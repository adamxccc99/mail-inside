import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { MailTmProvider } from './server/providers/mailtm.ts';
import type { EmailProvider } from './server/providers/types.ts';
import {
  saveMailbox,
  getMailboxByShareToken,
  deleteMailboxRecord,
  toClientMailbox,
  generateSecureToken
} from './server/db.ts';
import { startCleanupWorker } from './server/cleanup.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize email provider (Mail.tm adapter)
const provider: EmailProvider = new MailTmProvider();

// Start background expiration worker
startCleanupWorker(provider, 60000);

const app = express();
app.use(express.json());

// Basic rate limiting helper in memory for API abuse protection
const rateLimits = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(req: Request, maxRequests = 60, windowMs = 60000): boolean {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const client = rateLimits.get(ip);

  if (!client || now > client.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (client.count >= maxRequests) {
    return false;
  }

  client.count++;
  return true;
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    provider: provider.name,
    timestamp: new Date().toISOString()
  });
});

// 2. Get available domains
app.get('/api/domains', async (req: Request, res: Response) => {
  try {
    const domains = await provider.getAvailableDomains();
    res.json({ domains });
  } catch (err: any) {
    console.error('[API /api/domains error]:', err.message);
    res.status(503).json({ error: err.message || 'Unable to fetch email domains' });
  }
});

// 3. Create a temporary mailbox with duration (1h to 168h)
app.post('/api/mailboxes', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, 20, 60000)) {
    return res.status(429).json({ error: 'Too many mailbox requests. Please slow down.' });
  }

  try {
    const rawHours = Number(req.body.durationHours);
    // Allowed values: 1, 2, 6, 12, 24, 48, 72, 120, 168
    const durationHours = Math.max(1, Math.min(168, Number.isFinite(rawHours) && rawHours > 0 ? rawHours : 1));

    // Get active domains from provider
    const domains = await provider.getAvailableDomains();
    if (!domains || domains.length === 0) {
      return res.status(503).json({ error: 'No available email domains at this moment.' });
    }

    // Pick domain
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const username = `mail_${crypto.randomBytes(4).toString('hex')}_${Math.floor(100 + Math.random() * 900)}`;
    const address = `${username}@${domain}`.toLowerCase();
    const password = `Tmp_${crypto.randomBytes(12).toString('hex')}!`;

    // Create upstream account
    const account = await provider.createAccount(address, password);

    // Authenticate with upstream provider
    const token = await provider.authenticate(address, password);

    // Generate cryptographic share token
    const shareToken = generateSecureToken(24);
    const createdAt = Date.now();
    const expiresAt = createdAt + durationHours * 60 * 60 * 1000;

    // Save record securely
    const saved = saveMailbox({
      address: account.address,
      share_token: shareToken,
      provider: provider.name,
      provider_account_id: account.id,
      provider_token: token,
      provider_password: password,
      created_at: createdAt,
      duration_hours: durationHours,
      expires_at: expiresAt
    });

    res.status(201).json(toClientMailbox(saved));
  } catch (err: any) {
    console.error('[API /api/mailboxes error]:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create temporary email' });
  }
});

// 4. Retrieve mailbox status by share token
app.get('/api/mailboxes/:shareToken', (req: Request, res: Response) => {
  const { shareToken } = req.params;
  if (!shareToken || typeof shareToken !== 'string') {
    return res.status(400).json({ error: 'Missing share token' });
  }

  const mailbox = getMailboxByShareToken(shareToken);
  if (!mailbox) {
    return res.status(404).json({ error: 'Mailbox not found or invalid token' });
  }

  res.json(toClientMailbox(mailbox));
});

// 5. Retrieve messages for a mailbox
app.get('/api/mailboxes/:shareToken/messages', async (req: Request, res: Response) => {
  if (!checkRateLimit(req, 90, 60000)) {
    return res.status(429).json({ error: 'Too many refresh requests. Please wait a moment.' });
  }

  const { shareToken } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1;

  const mailbox = getMailboxByShareToken(shareToken);
  if (!mailbox) {
    return res.status(404).json({ error: 'Mailbox not found' });
  }

  if (mailbox.status === 'expired') {
    return res.status(410).json({
      error: 'This temporary mailbox has expired.',
      status: 'expired',
      mailbox: toClientMailbox(mailbox)
    });
  }

  if (mailbox.status === 'deleted') {
    return res.status(410).json({
      error: 'This temporary mailbox was deleted.',
      status: 'deleted',
      mailbox: toClientMailbox(mailbox)
    });
  }

  try {
    const data = await provider.getMessages(mailbox.provider_token, page);
    res.json({
      mailbox: toClientMailbox(mailbox),
      messages: data.messages,
      total: data.total,
      page
    });
  } catch (err: any) {
    console.error('[API /api/mailboxes/:shareToken/messages error]:', err.message);
    res.status(502).json({
      error: err.message || 'Failed to retrieve messages from provider',
      mailbox: toClientMailbox(mailbox),
      messages: [],
      total: 0
    });
  }
});

// 6. Retrieve single message details
app.get('/api/mailboxes/:shareToken/messages/:messageId', async (req: Request, res: Response) => {
  const { shareToken, messageId } = req.params;

  const mailbox = getMailboxByShareToken(shareToken);
  if (!mailbox) {
    return res.status(404).json({ error: 'Mailbox not found' });
  }

  if (mailbox.status !== 'active') {
    return res.status(410).json({ error: `Mailbox is ${mailbox.status}` });
  }

  try {
    const message = await provider.getMessage(mailbox.provider_token, messageId);
    res.json({ message });
  } catch (err: any) {
    console.error('[API /api/mailboxes/:shareToken/messages/:id error]:', err.message);
    res.status(502).json({ error: err.message || 'Failed to retrieve email content' });
  }
});

// 7. Manually delete a mailbox
app.delete('/api/mailboxes/:shareToken', async (req: Request, res: Response) => {
  const { shareToken } = req.params;

  const mailbox = getMailboxByShareToken(shareToken);
  if (!mailbox) {
    return res.status(404).json({ error: 'Mailbox not found' });
  }

  try {
    if (mailbox.provider_token && mailbox.provider_account_id) {
      await provider.deleteAccount(mailbox.provider_token, mailbox.provider_account_id);
    }
  } catch (err: any) {
    console.warn('[API Delete error upstream]:', err.message);
  }

  deleteMailboxRecord(shareToken);
  res.json({ success: true, message: 'Mailbox deleted successfully' });
});

// -------------------------------------------------------------
// Frontend Integration (Vite Middleware in dev / Static in prod)
// -------------------------------------------------------------

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mail inside] Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});

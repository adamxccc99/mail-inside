import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { MailboxRecord, ClientMailboxData } from './types.ts';

const DB_PATH = process.env.DATABASE_PATH || './data/mailinside.sqlite';
const dbDir = path.dirname(path.resolve(DB_PATH));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(path.resolve(DB_PATH));

// Initialize schema
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS mailboxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT UNIQUE NOT NULL,
    share_token TEXT UNIQUE NOT NULL,
    share_token_hash TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    provider_token TEXT NOT NULL,
    provider_password TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    duration_hours INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
  );

  CREATE INDEX IF NOT EXISTS idx_mailboxes_share_token ON mailboxes(share_token);
  CREATE INDEX IF NOT EXISTS idx_mailboxes_token_hash ON mailboxes(share_token_hash);
  CREATE INDEX IF NOT EXISTS idx_mailboxes_expires_at ON mailboxes(expires_at);
  CREATE INDEX IF NOT EXISTS idx_mailboxes_status ON mailboxes(status);
`);

export function hashShareToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function saveMailbox(record: {
  address: string;
  share_token: string;
  provider: string;
  provider_account_id: string;
  provider_token: string;
  provider_password: string;
  created_at: number;
  duration_hours: number;
  expires_at: number;
}): MailboxRecord {
  const tokenHash = hashShareToken(record.share_token);
  const stmt = db.prepare(`
    INSERT INTO mailboxes (
      address, share_token, share_token_hash, provider,
      provider_account_id, provider_token, provider_password,
      created_at, duration_hours, expires_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `);

  const result = stmt.run(
    record.address,
    record.share_token,
    tokenHash,
    record.provider,
    record.provider_account_id,
    record.provider_token,
    record.provider_password,
    record.created_at,
    record.duration_hours,
    record.expires_at
  );

  const id = Number(result.lastInsertRowid);
  return {
    ...record,
    id,
    share_token_hash: tokenHash,
    status: 'active'
  };
}

export function getMailboxByShareToken(token: string): MailboxRecord | null {
  const tokenHash = hashShareToken(token);
  const stmt = db.prepare(`
    SELECT * FROM mailboxes 
    WHERE (share_token = ? OR share_token_hash = ?)
    LIMIT 1
  `);
  const row = stmt.get(token, tokenHash) as unknown as MailboxRecord | undefined;
  if (!row) return null;

  // Check if it has passed its expiration time
  if (row.status === 'active' && Date.now() >= row.expires_at) {
    updateMailboxStatus(token, 'expired');
    row.status = 'expired';
  }

  return row;
}

export function updateMailboxStatus(token: string, status: 'active' | 'expired' | 'deleted'): void {
  const tokenHash = hashShareToken(token);
  const stmt = db.prepare(`
    UPDATE mailboxes 
    SET status = ? 
    WHERE share_token = ? OR share_token_hash = ?
  `);
  stmt.run(status, token, tokenHash);
}

export function getExpiredMailboxes(): MailboxRecord[] {
  const now = Date.now();
  const stmt = db.prepare(`
    SELECT * FROM mailboxes 
    WHERE status = 'active' AND expires_at <= ?
  `);
  return stmt.all(now) as unknown as MailboxRecord[];
}

export function deleteMailboxRecord(token: string): void {
  const tokenHash = hashShareToken(token);
  const stmt = db.prepare(`
    UPDATE mailboxes 
    SET status = 'deleted', provider_token = '', provider_password = ''
    WHERE share_token = ? OR share_token_hash = ?
  `);
  stmt.run(token, tokenHash);
}

export function toClientMailbox(row: MailboxRecord): ClientMailboxData {
  return {
    address: row.address,
    shareToken: row.share_token,
    createdAt: row.created_at,
    durationHours: row.duration_hours,
    expiresAt: row.expires_at,
    status: row.status
  };
}

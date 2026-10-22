import { getExpiredMailboxes, updateMailboxStatus } from './db.ts';
import type { EmailProvider } from './providers/types.ts';

let cleanupInterval: NodeJS.Timeout | null = null;

export async function runCleanup(provider: EmailProvider): Promise<{ processed: number; errors: number }> {
  const expired = getExpiredMailboxes();
  if (expired.length === 0) return { processed: 0, errors: 0 };

  let processed = 0;
  let errors = 0;

  for (const box of expired) {
    try {
      if (box.provider_token && box.provider_account_id) {
        await provider.deleteAccount(box.provider_token, box.provider_account_id);
      }
      updateMailboxStatus(box.share_token, 'expired');
      processed++;
    } catch (err: any) {
      console.warn(`[Cleanup] Error cleaning up expired mailbox ${box.id}:`, err?.message || err);
      // Still mark as expired locally so access is stopped
      updateMailboxStatus(box.share_token, 'expired');
      errors++;
    }
  }

  return { processed, errors };
}

export function startCleanupWorker(provider: EmailProvider, intervalMs = 60000): void {
  if (cleanupInterval) clearInterval(cleanupInterval);

  // Run initial cleanup
  runCleanup(provider).catch(() => {});

  // Set recurring cleanup
  cleanupInterval = setInterval(() => {
    runCleanup(provider).catch(err => {
      console.error('[Cleanup Worker] Error during scheduled cleanup:', err);
    });
  }, intervalMs);

  // Prevent keeping process alive if server shuts down
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

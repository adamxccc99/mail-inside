import React, { useState, useEffect } from 'react';
import {
  Copy,
  Share2,
  Link as LinkIcon,
  RefreshCw,
  Trash2,
  Clock,
  AlertTriangle,
  Check,
  PlusCircle,
  ShieldAlert
} from 'lucide-react';
import { useI18n } from '../i18n/context.tsx';
import { formatCountdown, getRemainingSeconds } from '../utils/time.ts';
import type { ClientMailboxData } from '../../server/types.ts';

interface MailboxCardProps {
  mailbox: ClientMailboxData;
  isRefreshing: boolean;
  onRefresh: () => void;
  onChangeEmailRequest: () => void;
  onDeleteEmailRequest: () => void;
  onCopyEmail: () => void;
  onCopyLink: () => void;
  onShareInbox: () => void;
  onExpired: () => void;
}

export const MailboxCard: React.FC<MailboxCardProps> = ({
  mailbox,
  isRefreshing,
  onRefresh,
  onChangeEmailRequest,
  onDeleteEmailRequest,
  onCopyEmail,
  onCopyLink,
  onShareInbox,
  onExpired
}) => {
  const { t } = useI18n();
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    getRemainingSeconds(mailbox.expiresAt)
  );
  const [copiedEmailRecent, setCopiedEmailRecent] = useState(false);
  const [copiedLinkRecent, setCopiedLinkRecent] = useState(false);

  // Live countdown timer running every second
  useEffect(() => {
    const updateTime = () => {
      const sec = getRemainingSeconds(mailbox.expiresAt);
      setRemainingSeconds(sec);
      if (sec <= 0) {
        onExpired();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [mailbox.expiresAt, onExpired]);

  const countdown = formatCountdown(remainingSeconds);

  const handleCopyEmailClick = () => {
    onCopyEmail();
    setCopiedEmailRecent(true);
    setTimeout(() => setCopiedEmailRecent(false), 2000);
  };

  const handleCopyLinkClick = () => {
    onCopyLink();
    setCopiedLinkRecent(true);
    setTimeout(() => setCopiedLinkRecent(false), 2000);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs mb-8 transition-all">
      {/* Top row: Label and Live Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          {t.activeEmailLabel}
        </span>

        {/* Live Countdown Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
            countdown.isExpiringSoon
              ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 animate-pulse'
              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
          title={t.timeRemainingLabel}
        >
          {countdown.isExpiringSoon ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-sky-500" />
          )}
          <span>{t.timeRemainingLabel}:</span>
          <span className="font-mono tabular-nums tracking-wider text-sm">
            {countdown.displayString}
          </span>
        </div>
      </div>

      {/* Main Email Address Display Field */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 mb-5">
        <div className="flex-1 min-w-0 px-2 py-1 select-all font-mono text-sm sm:text-lg font-bold text-slate-900 dark:text-white break-all sm:truncate">
          {mailbox.address}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyEmailClick}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.98] transition-all cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label={t.copyEmailButton}
          >
            {copiedEmailRecent ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.copyEmailButton}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyLinkClick}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            title={t.copyInboxLinkButton}
            aria-label={t.copyInboxLinkButton}
          >
            {copiedLinkRecent ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <LinkIcon className="w-4 h-4 text-slate-500" />
            )}
            <span className="hidden md:inline">{t.copyInboxLinkButton}</span>
          </button>

          <button
            type="button"
            onClick={onShareInbox}
            className="inline-flex items-center justify-center p-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            title={t.shareInboxButton}
            aria-label={t.shareInboxButton}
          >
            <Share2 className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Secondary Actions Bar: Change, Refresh, Delete */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onChangeEmailRequest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-sky-500" />
            <span>{t.changeEmailButton}</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
            <span>{t.refreshInboxButton}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onDeleteEmailRequest}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.deleteEmailButton}</span>
        </button>
      </div>

      {/* Warning banner regarding private link & financial services */}
      <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
        <span className="leading-relaxed">{t.privateLinkWarning}</span>
      </div>
    </div>
  );
};

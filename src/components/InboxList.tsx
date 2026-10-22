import React from 'react';
import { Mail, RefreshCw, Paperclip, Clock, Inbox, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n/context.tsx';
import { formatDateTime } from '../utils/time.ts';
import type { EmailMessageSummary } from '../../server/types.ts';

interface InboxListProps {
  messages: EmailMessageSummary[];
  total: number;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onSelectMessage: (msgId: string) => void;
  selectedMessageId?: string;
  errorMessage?: string | null;
}

export const InboxList: React.FC<InboxListProps> = ({
  messages,
  total,
  isLoading,
  isRefreshing,
  onRefresh,
  onSelectMessage,
  selectedMessageId,
  errorMessage
}) => {
  const { t, language } = useI18n();

  const unreadCount = messages.filter(m => !m.seen).length;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      {/* Inbox Panel Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.inboxHeading}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                {total}
              </strong>{' '}
              {t.totalMessagesLabel}
            </span>
            {unreadCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-sky-600 dark:text-sky-400 font-semibold tabular-nums">
                  {unreadCount} {t.unreadCountLabel}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-60"
          title={t.refreshInboxButton}
          aria-label={t.refreshInboxButton}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">{isRefreshing ? t.refreshingLabel : t.refreshInboxButton}</span>
        </button>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 shrink-0" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="relative mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 text-sky-600 dark:text-sky-400">
            <Mail className="w-8 h-8 opacity-90 animate-bounce duration-1000" />
            <div className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            {t.waitingEmailsHeading}
          </h3>
          <p className="max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.waitingEmailsDescription}
          </p>
        </div>
      ) : (
        /* Message Rows */
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {messages.map(msg => {
            const isSelected = selectedMessageId === msg.id;
            const senderName = msg.from?.name || msg.from?.address || 'Unknown';

            return (
              <button
                key={msg.id}
                type="button"
                onClick={() => onSelectMessage(msg.id)}
                className={`w-full text-left p-4 sm:px-6 sm:py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors cursor-pointer group ${
                  isSelected
                    ? 'bg-sky-50/70 dark:bg-sky-950/40'
                    : msg.seen
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50/90 font-medium'
                }`}
              >
                {/* Left side: Read indicator + Sender + Subject */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  {/* Unread indicator */}
                  <span
                    className={`mt-1 sm:mt-0 w-2 h-2 rounded-full shrink-0 ${
                      !msg.seen
                        ? 'bg-sky-600 dark:bg-sky-400'
                        : 'bg-transparent'
                    }`}
                    aria-label={!msg.seen ? 'Unread message' : 'Read message'}
                  />

                  <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span
                      className={`text-xs sm:text-sm truncate sm:w-48 shrink-0 ${
                        !msg.seen
                          ? 'font-bold text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {senderName}
                    </span>

                    <span
                      className={`text-xs sm:text-sm truncate flex-1 ${
                        !msg.seen
                          ? 'font-bold text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {msg.subject || t.noSubject}
                    </span>
                  </div>
                </div>

                {/* Right side: Attachments & Timestamp */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400 dark:text-slate-500 shrink-0 ps-5 sm:ps-0">
                  {msg.hasAttachments && (
                    <span title={t.hasAttachmentsLabel} className="flex items-center gap-1 text-slate-500">
                      <Paperclip className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] tabular-nums">
                    <Clock className="w-3 h-3" />
                    <span>{formatDateTime(msg.createdAt, language)}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

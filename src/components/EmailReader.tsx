import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Paperclip, Download, Code, FileText, Calendar, User, Mail } from 'lucide-react';
import { useI18n } from '../i18n/context.tsx';
import { formatDateTime, formatBytes } from '../utils/time.ts';
import { sanitizeEmailHtml } from '../utils/sanitize.ts';
import type { EmailMessageDetail } from '../../server/types.ts';

interface EmailReaderProps {
  message: EmailMessageDetail;
  onBack: () => void;
  isLoading?: boolean;
}

export const EmailReader: React.FC<EmailReaderProps> = ({ message, onBack, isLoading }) => {
  const { t, language, isRtl } = useI18n();
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');

  const senderDisplay = message.from.name
    ? `${message.from.name} <${message.from.address}>`
    : message.from.address;

  const recipientDisplay = message.to.map(t => (t.name ? `${t.name} <${t.address}>` : t.address)).join(', ');

  const hasHtml = message.html && message.html.length > 0 && message.html[0].trim().length > 0;
  const rawHtml = hasHtml ? message.html![0] : '';
  const sanitizedHtml = sanitizeEmailHtml(rawHtml);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Bar with Back Button & View Switcher */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{t.backToInboxButton}</span>
        </button>

        {hasHtml && (
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('html')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'html'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>{t.viewHtmlButton}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'text'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>{t.viewPlainButton}</span>
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
          {t.loadingMessageDetails}
        </div>
      ) : (
        <div className="p-5 sm:p-7">
          {/* Email Subject Headline */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {message.subject || t.noSubject}
          </h2>

          {/* Email Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <User className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-500 dark:text-slate-400">{t.fromLabel}: </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 select-all">{senderDisplay}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-500 dark:text-slate-400">{t.toLabel}: </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 select-all">{recipientDisplay}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 sm:col-span-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-500 dark:text-slate-400">{t.dateLabel}: </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                {formatDateTime(message.createdAt, language)}
              </span>
            </div>
          </div>

          {/* Attachments Section if present */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                <Paperclip className="w-3.5 h-3.5 text-sky-500" />
                <span>{t.attachmentsHeading} ({message.attachments.length})</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {message.attachments.map(att => (
                  <a
                    key={att.id}
                    href={att.downloadUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[200px]">{att.filename}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums">({formatBytes(att.size)})</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Email Body: Sanitized HTML or Plain Text */}
          <div className="prose dark:prose-invert max-w-none min-h-[220px] text-sm leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto">
            {viewMode === 'html' && hasHtml ? (
              <div
                className="email-body-content overflow-auto"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-sm bg-transparent p-0 border-0 text-slate-800 dark:text-slate-200">
                {message.text || 'No text content in this email.'}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

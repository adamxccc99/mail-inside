import React from 'react';
import { Clock, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n/context.tsx';

interface ExpiredViewProps {
  status: 'expired' | 'deleted';
  onCreateNew: () => void;
}

export const ExpiredView: React.FC<ExpiredViewProps> = ({ status, onCreateNew }) => {
  const { t } = useI18n();

  const isDeleted = status === 'deleted';

  return (
    <div className="w-full max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-sm">
      <div className="mx-auto mb-5 flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-amber-600 dark:text-amber-400">
        {isDeleted ? <Trash2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
        {isDeleted ? t.mailboxDeletedHeading : t.mailboxExpiredHeading}
      </h2>

      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
        {isDeleted ? t.mailboxDeletedMessage : t.mailboxExpiredMessage}
      </p>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>{t.privacyNotice4}</span>
      </div>

      <button
        type="button"
        onClick={onCreateNew}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 transition-all shadow-md shadow-sky-600/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <Plus className="w-4 h-4" />
        <span>{t.createNewEmailButton}</span>
      </button>
    </div>
  );
};

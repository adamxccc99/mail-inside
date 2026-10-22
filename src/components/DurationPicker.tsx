import React from 'react';
import { Clock, Shield, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18n } from '../i18n/context.tsx';
import { DURATION_OPTIONS } from '../utils/time.ts';

interface DurationPickerProps {
  selectedHours: number;
  onSelectHours: (hours: number) => void;
  onCreateEmail: () => void;
  isLoading: boolean;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({
  selectedHours,
  onSelectHours,
  onCreateEmail,
  isLoading
}) => {
  const { t, isRtl } = useI18n();

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      {/* Hero Headline and Value Proposition */}
      <div className="text-center mb-8 sm:mb-10 pt-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 text-balance">
          {t.heroHeadline}
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal mb-3 text-balance">
          {t.heroSubheadline}
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/80 px-3.5 py-1.5 rounded-full">
          <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{t.noRegistrationNotice}</span>
        </div>
      </div>

      {/* Step 1: Select Expiration Duration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.step1Title}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
              {t.step1Subtitle}
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 self-start sm:self-auto">
            {t.maxDurationNotice}
          </span>
        </div>

        {/* 9 Duration Cards Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 sm:gap-2.5 mb-6">
          {DURATION_OPTIONS.map(option => {
            const isSelected = selectedHours === option.hours;
            const label = (t as any)[option.labelKey] || `${option.hours}h`;

            return (
              <button
                key={option.hours}
                type="button"
                onClick={() => onSelectHours(option.hours)}
                disabled={isLoading}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isSelected
                    ? 'border-sky-600 dark:border-sky-400 bg-sky-50/80 dark:bg-sky-950/60 text-sky-950 dark:text-sky-100 shadow-sm ring-1 ring-sky-600/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-sm sm:text-base font-bold tabular-nums">
                  {option.hours >= 24 ? `${option.hours / 24}d` : `${option.hours}h`}
                </span>
                <span className="text-[11px] font-medium opacity-80 whitespace-nowrap mt-0.5">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step 2: Primary Creation Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <span>{t.expiresInPrefix}: </span>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold tabular-nums">
              {(t as any)[DURATION_OPTIONS.find(d => d.hours === selectedHours)?.labelKey || 'duration_1h']}
            </strong>
          </div>

          <button
            type="button"
            onClick={onCreateEmail}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-60 transition-all shadow-md shadow-sky-600/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.creatingEmailButton}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.createEmailButton}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

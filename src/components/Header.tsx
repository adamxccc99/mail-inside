import React, { useState, useRef, useEffect } from 'react';
import { Mail, Clock, Globe, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n/context.tsx';
import type { Language } from '../i18n/translations.ts';

interface HeaderProps {
  onNewEmailClick?: () => void;
  onScrollToPrivacy?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewEmailClick, onScrollToPrivacy }) => {
  const { language, setLanguage, t, isRtl } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Envelope + Clock Logo */}
        <a
          href="/"
          className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg tracking-tight whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-sm shadow-sky-500/20">
            <Mail className="w-4 h-4" />
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-950 p-0.5 rounded-full shadow-xs">
              <Clock className="w-2.5 h-2.5 text-indigo-600 dark:text-sky-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-extrabold">{t.brandName}</span>
            <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 leading-none">
              {t.brandTagline}
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#how-it-works"
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'ar' ? 'كيف يعمل' : language === 'es' ? 'Cómo funciona' : language === 'pt' ? 'Como funciona' : 'How it works'}
          </a>
          <button
            onClick={onScrollToPrivacy}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.privacyTitle}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{t.noRegistrationNotice.split(',')[0]}</span>
          </div>
        </nav>

        {/* Zone 3: Language Selector and Quick Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-expanded={langMenuOpen}
              aria-label={t.languageSelectLabel}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div
                className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-50`}
              >
                {languages.map(item => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors ${
                      language === item.code
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                    </div>
                    {language === item.code && <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action CTA button */}
          {onNewEmailClick && (
            <button
              onClick={onNewEmailClick}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              title={t.createNewEmailButton}
              aria-label={t.createNewEmailButton}
            >
              <span className="hidden sm:inline">{t.createNewEmailButton}</span>
              <span className="sm:hidden font-bold">+</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

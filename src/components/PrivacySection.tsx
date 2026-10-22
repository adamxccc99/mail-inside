import React from 'react';
import { ShieldCheck, Lock, AlertCircle, Trash2, HelpCircle } from 'lucide-react';
import { useI18n } from '../i18n/context.tsx';

export const PrivacySection: React.FC = () => {
  const { t, language } = useI18n();

  const faqs = [
    {
      q: language === 'ar' ? 'كيف تعمل الروابط القابلة للمشاركة؟' : language === 'es' ? '¿Cómo funcionan los enlaces compartibles?' : language === 'pt' ? 'Como funcionam os links compartilháveis?' : 'How do persistent shareable links work?',
      a: language === 'ar' ? 'عند إنشاء صندوق بريد، نولد رمزاً عشوائياً مشفراً غير قابل للتخمين. يمكنك استخدام الرابط من أي جهاز أو متصفح للرجوع إلى نفس الصندوق طوال فترة صلاحيته المحددة.' : language === 'es' ? 'Al crear un buzón, generamos un token criptográfico no adivinable. Puedes abrir este enlace en cualquier dispositivo para acceder a los mismos correos hasta que expire.' : language === 'pt' ? 'Ao criar uma caixa de correio, geramos um token criptográfico imprevisível. Você pode abrir o link em qualquer dispositivo para ler seus emails até o término do prazo.' : 'When creating a mailbox, a cryptographically secure random token is generated. You can open that exact URL on any device or browser to restore the mailbox and its messages until it reaches its scheduled expiration.'
    },
    {
      q: language === 'ar' ? 'ماذا يحدث عند انتهاء وقت الصلاحية؟' : language === 'es' ? '¿Qué sucede cuando expira el buzón?' : language === 'pt' ? 'O que acontece quando o prazo expira?' : 'What happens when the lifetime expires?',
      a: language === 'ar' ? 'يقوم خادمنا الآلي بحذف حساب البريد من الخوادم المزودة وحذف كافة السجلات والرسائل نهائياً، مع إلغاء صلاحية الرابط على الفور.' : language === 'es' ? 'Nuestro proceso en segundo plano elimina el buzón del proveedor y borra permanentemente todos los datos locales, revocando el enlace de inmediato.' : language === 'pt' ? 'Nosso processo em segundo plano exclui a caixa de correio no provedor e apaga permanentemente todas as mensagens locais, revogando o link na hora.' : 'Our background automated worker deletes the upstream mailbox account, erases all stored records and metadata, and permanently revokes the share link.'
    },
    {
      q: language === 'ar' ? 'هل يمكنني إرسال رسائل بريد إلكتروني؟' : language === 'es' ? '¿Puedo enviar correos electrónicos?' : language === 'pt' ? 'Posso enviar mensagens de email?' : 'Can I send emails from this temporary address?',
      a: language === 'ar' ? 'لا، هذه الخدمة مخصصة للاستقبال فقط لحماية الخصوصية ومكافحة الرسائل العشوائية والسبام.' : language === 'es' ? 'No, este servicio es estrictamente de solo recepción para proteger la privacidad y prevenir abusos de spam.' : language === 'pt' ? 'Não, este serviço é estritamente de recebimento para proteger a privacidade e evitar spam.' : 'No, this service is receive-only by design to protect privacy and prevent spam or abuse.'
    }
  ];

  return (
    <section id="how-it-works" className="w-full max-w-4xl mx-auto mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="text-center mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {t.privacyTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t.heroSubheadline}
        </p>
      </div>

      {/* 4 Pillars of Privacy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-semibold text-sm mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero Registration</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.privacyNotice1}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-semibold text-sm mb-1.5">
            <Lock className="w-4 h-4 text-sky-500" />
            <span>Cryptographic Share Links</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.privacyNotice2}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-semibold text-sm mb-1.5">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Temporary Use Only</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.privacyNotice3}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-semibold text-sm mb-1.5">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Guaranteed Erasure</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.privacyNotice4}
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-base">
          <HelpCircle className="w-4 h-4 text-sky-500" />
          <span>FAQ</span>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60"
            >
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {faq.q}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer attribution */}
      <footer className="text-center pb-12 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
        <p className="mb-2">
          © {new Date().getFullYear()} {t.brandName} ({language === 'ar' ? 'ايميل مؤقت' : 'Email Time'}). All rights reserved.
        </p>
        <p className="text-[11px] text-slate-500">
          {t.serviceAttribution}
        </p>
      </footer>
    </section>
  );
};

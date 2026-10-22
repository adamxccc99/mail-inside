export type Language = 'en' | 'ar' | 'es' | 'pt';

export interface TranslationDictionary {
  brandName: string;
  brandTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  noRegistrationNotice: string;
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  createEmailButton: string;
  creatingEmailButton: string;
  
  // Durations
  duration_1h: string;
  duration_2h: string;
  duration_6h: string;
  duration_12h: string;
  duration_1d: string;
  duration_2d: string;
  duration_3d: string;
  duration_5d: string;
  duration_7d: string;
  maxDurationNotice: string;

  // Mailbox Card
  activeEmailLabel: string;
  timeRemainingLabel: string;
  expiresInPrefix: string;
  copyEmailButton: string;
  copiedEmailToast: string;
  copyInboxLinkButton: string;
  copiedInboxLinkToast: string;
  shareInboxButton: string;
  sharedSuccessToast: string;
  changeEmailButton: string;
  refreshInboxButton: string;
  deleteEmailButton: string;
  privateLinkWarning: string;
  
  // Confirmations
  confirmChangeTitle: string;
  confirmChangeMessage: string;
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
  confirmDeleteButton: string;
  confirmChangeButton: string;
  cancelButton: string;

  // Inbox Panel
  inboxHeading: string;
  unreadCountLabel: string;
  totalMessagesLabel: string;
  refreshingLabel: string;
  waitingEmailsHeading: string;
  waitingEmailsDescription: string;
  senderColumn: string;
  subjectColumn: string;
  timeColumn: string;
  noSubject: string;
  hasAttachmentsLabel: string;

  // Email Reader
  backToInboxButton: string;
  fromLabel: string;
  toLabel: string;
  dateLabel: string;
  subjectLabel: string;
  attachmentsHeading: string;
  viewHtmlButton: string;
  viewPlainButton: string;
  downloadAttachmentButton: string;
  loadingMessageDetails: string;

  // Expired & Deleted States
  mailboxExpiredHeading: string;
  mailboxExpiredMessage: string;
  mailboxDeletedHeading: string;
  mailboxDeletedMessage: string;
  createNewEmailButton: string;

  // Privacy & Safety
  privacyTitle: string;
  privacyNotice1: string;
  privacyNotice2: string;
  privacyNotice3: string;
  privacyNotice4: string;
  serviceAttribution: string;

  // Errors & Status
  errorHeading: string;
  errorNetwork: string;
  errorNotFound: string;
  errorRateLimit: string;
  retryButton: string;
  languageSelectLabel: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'Mail inside',
    brandTagline: 'Anonymous Temporary Email',
    heroHeadline: 'Email Time — Your Temporary Email, On Your Time',
    heroSubheadline: 'Generate a secure, disposable inbox with custom expiration. Return anytime using your private link.',
    noRegistrationNotice: 'No registration, no personal data, 100% free and private.',
    step1Title: 'Select Mailbox Lifetime',
    step1Subtitle: 'Choose how long this inbox should remain active before permanent deletion.',
    step2Title: 'Generate Address',
    createEmailButton: 'Create Temporary Email',
    creatingEmailButton: 'Provisioning Secure Inbox...',

    duration_1h: '1 Hour',
    duration_2h: '2 Hours',
    duration_6h: '6 Hours',
    duration_12h: '12 Hours',
    duration_1d: '1 Day',
    duration_2d: '2 Days',
    duration_3d: '3 Days',
    duration_5d: '5 Days',
    duration_7d: '7 Days',
    maxDurationNotice: 'Maximum allowed lifetime is 7 days. Data is permanently erased upon expiration.',

    activeEmailLabel: 'Your Temporary Email Address',
    timeRemainingLabel: 'Time Remaining',
    expiresInPrefix: 'Expires in',
    copyEmailButton: 'Copy Email',
    copiedEmailToast: 'Email address copied to clipboard!',
    copyInboxLinkButton: 'Copy Inbox Link',
    copiedInboxLinkToast: 'Private inbox link copied! Bookmark it to return.',
    shareInboxButton: 'Share Inbox',
    sharedSuccessToast: 'Inbox link shared successfully.',
    changeEmailButton: 'Change Email',
    refreshInboxButton: 'Refresh Inbox',
    deleteEmailButton: 'Delete Mailbox',
    privateLinkWarning: 'Anyone with this link can access this inbox. Do not use for banking or critical services.',

    confirmChangeTitle: 'Change Temporary Email?',
    confirmChangeMessage: 'You are about to switch to a new mailbox. Your previous share link will remain valid until its expiration.',
    confirmDeleteTitle: 'Delete Mailbox Permanently?',
    confirmDeleteMessage: 'Are you sure you want to delete this temporary inbox? All messages and upstream accounts will be immediately destroyed.',
    confirmDeleteButton: 'Yes, Delete Now',
    confirmChangeButton: 'Create New Mailbox',
    cancelButton: 'Cancel',

    inboxHeading: 'Inbox',
    unreadCountLabel: 'unread',
    totalMessagesLabel: 'messages',
    refreshingLabel: 'Checking for emails...',
    waitingEmailsHeading: 'Waiting for incoming emails…',
    waitingEmailsDescription: 'Incoming messages will appear here automatically. You can also click Refresh at any time.',
    senderColumn: 'Sender',
    subjectColumn: 'Subject',
    timeColumn: 'Received',
    noSubject: '(No Subject)',
    hasAttachmentsLabel: 'Attachments',

    backToInboxButton: 'Back to Inbox',
    fromLabel: 'From',
    toLabel: 'To',
    dateLabel: 'Date',
    subjectLabel: 'Subject',
    attachmentsHeading: 'Attachments',
    viewHtmlButton: 'HTML View',
    viewPlainButton: 'Text View',
    downloadAttachmentButton: 'Download',
    loadingMessageDetails: 'Loading message contents securely...',

    mailboxExpiredHeading: 'Mailbox Expired',
    mailboxExpiredMessage: 'This temporary mailbox has reached its planned expiration time and its contents have been permanently deleted from all systems.',
    mailboxDeletedHeading: 'Mailbox Deleted',
    mailboxDeletedMessage: 'This mailbox was manually closed and all associated messages were eradicated.',
    createNewEmailButton: 'Create New Temporary Email',

    privacyTitle: 'Privacy & Security Guidelines',
    privacyNotice1: 'Zero registration or personally identifiable information is collected.',
    privacyNotice2: 'Private share links grant full read access to whoever possesses the URL.',
    privacyNotice3: 'Never use disposable email for financial, medical, banking, or permanent accounts.',
    privacyNotice4: 'All records, server tokens, and upstream mailboxes are erased upon expiration.',
    serviceAttribution: 'Powered by Mail inside temporary infrastructure with Mail.tm protocol.',

    errorHeading: 'Operation Error',
    errorNetwork: 'Unable to connect to the email server. Please check your connection.',
    errorNotFound: 'The requested mailbox or message does not exist or has already been removed.',
    errorRateLimit: 'Rate limit reached. Please wait a moment before sending more requests.',
    retryButton: 'Try Again',
    languageSelectLabel: 'Language'
  },

  ar: {
    brandName: 'ايميل مؤقت',
    brandTagline: 'بريد مؤقت مجهول وسريع',
    heroHeadline: 'ايميل مؤقت — بريدك المؤقت، على وقتك',
    heroSubheadline: 'أنشئ صندوق بريد مؤقت آمن مع تحديد فترة الصلاحية. يمكنك العودة إلى نفس الصندوق لاحقاً عبر رابط خاص.',
    noRegistrationNotice: 'بدون تسجيل، بدون بيانات شخصية، مجاني ومحمي 100%.',
    step1Title: 'اختر مدة صلاحية البريد',
    step1Subtitle: 'حدد الفترة الزمنية التي يبقى فيها هذا الصندوق نشطاً قبل الحذف النهائي التلقائي.',
    step2Title: 'إنشاء العنوان',
    createEmailButton: 'إنشاء بريد مؤقت',
    creatingEmailButton: 'جارٍ تجهيز الصندوق الآمن...',

    duration_1h: 'ساعة واحدة',
    duration_2h: 'ساعتان',
    duration_6h: '6 ساعات',
    duration_12h: '12 ساعة',
    duration_1d: 'يوم واحد',
    duration_2d: 'يومان',
    duration_3d: '3 أيام',
    duration_5d: '5 أيام',
    duration_7d: '7 أيام',
    maxDurationNotice: 'الحد الأقصى المسموح لصلاحية البريد هو 7 أيام، وتُحذف البيانات نهائياً بعد انتهاء الوقت.',

    activeEmailLabel: 'عنوان بريدك المؤقت',
    timeRemainingLabel: 'الوقت المتبقي',
    expiresInPrefix: 'ينتهي خلال',
    copyEmailButton: 'نسخ الإيميل',
    copiedEmailToast: 'تم نسخ عنوان البريد إلى الحافظة!',
    copyInboxLinkButton: 'نسخ رابط الصندوق',
    copiedInboxLinkToast: 'تم نسخ الرابط الخاص! احفظه للرجوع إلى نفس الصندوق.',
    shareInboxButton: 'مشاركة الصندوق',
    sharedSuccessToast: 'تمت مشاركة رابط البريد بنجاح.',
    changeEmailButton: 'تغيير الإيميل',
    refreshInboxButton: 'تحديث البريد',
    deleteEmailButton: 'حذف الإيميل',
    privateLinkWarning: 'أي شخص يمتلك هذا الرابط يمكنه قراءة الرسائل. لا تستخدمه للخدمات البنكية أو الحساسة.',

    confirmChangeTitle: 'تغيير البريد المؤقت؟',
    confirmChangeMessage: 'أنت على وشك الانتقال إلى صندوق جديد. سيبقى الرابط السابق صالحاً حتى موعد انتهائه.',
    confirmDeleteTitle: 'حذف الصندوق نهائياً؟',
    confirmDeleteMessage: 'هل أنت متأكد من رغبتك في حذف هذا الصندوق المؤقت فوراً؟ سيتم إتلاف جميع الرسائل نهائياً.',
    confirmDeleteButton: 'نعم، احذف الآن',
    confirmChangeButton: 'إنشاء بريد جديد',
    cancelButton: 'إلغاء',

    inboxHeading: 'صندوق الوارد',
    unreadCountLabel: 'غير مقروء',
    totalMessagesLabel: 'رسائل',
    refreshingLabel: 'جارٍ فحص الرسائل الجديدة...',
    waitingEmailsHeading: 'بانتظار وصول الرسائل…',
    waitingEmailsDescription: 'ستظهر الرسائل الواردة هنا تلقائياً فور استلامها. يمكنك الضغط على تحديث في أي وقت.',
    senderColumn: 'المرسل',
    subjectColumn: 'الموضوع',
    timeColumn: 'وقت الوصول',
    noSubject: '(بدون موضوع)',
    hasAttachmentsLabel: 'مرفقات',

    backToInboxButton: 'العودة إلى البريد',
    fromLabel: 'من',
    toLabel: 'إلى',
    dateLabel: 'التاريخ',
    subjectLabel: 'الموضوع',
    attachmentsHeading: 'المرفقات',
    viewHtmlButton: 'عرض التنسيق الأصلي (HTML)',
    viewPlainButton: 'عرض النص فقط',
    downloadAttachmentButton: 'تحميل',
    loadingMessageDetails: 'جارٍ تحميل محتوى الرسالة بأمان...',

    mailboxExpiredHeading: 'انتهت صلاحية البريد',
    mailboxExpiredMessage: 'انتهت الفترة الزمنية المحددة لهذا الصندوق المؤقت، وتم حذف محتوياته ورسائله نهائياً من كافة الأنظمة.',
    mailboxDeletedHeading: 'تم حذف الصندوق',
    mailboxDeletedMessage: 'تم إغلاق هذا الصندوق يدوياً ومسح كافة الرسائل المرتبطة به.',
    createNewEmailButton: 'إنشاء بريد مؤقت جديد',

    privacyTitle: 'إرشادات الخصوصية والأمان',
    privacyNotice1: 'لا نطلب أي تسجيل أو بيانات شخصية تعريفية إطلاقاً.',
    privacyNotice2: 'روابط الصناديق الخاصة تمنح إمكانية القراءة لمن يحوز الرابط.',
    privacyNotice3: 'لا تستخدم البريد المؤقت للحسابات المالية أو البنكية أو استرداد الحسابات الرسمية.',
    privacyNotice4: 'تُحذف جميع السجلات وبيانات الاعتماد نهائياً فور انتهاء الصلاحية.',
    serviceAttribution: 'مدعوم من بنية Mail inside المخصصة لخدمات البريد المؤقت.',

    errorHeading: 'حدث خطأ في العملية',
    errorNetwork: 'تعذر الاتصال بخادم البريد. يُرجى التحقق من اتصالك بالإنترنت.',
    errorNotFound: 'الصندوق أو الرسالة المطلوبة غير موجودة أو تم حذفها مسبقاً.',
    errorRateLimit: 'تم بلوغ الحد المسموح للطلبات. يُرجى الانتظار قليلاً قبل المحاولة مجدداً.',
    retryButton: 'إعادة المحاولة',
    languageSelectLabel: 'اللغة'
  },

  es: {
    brandName: 'Mail inside',
    brandTagline: 'Correo Temporal Anónimo',
    heroHeadline: 'Email Time — Tu correo temporal, a tu tiempo',
    heroSubheadline: 'Genera una bandeja temporal segura con expiración personalizada. Regresa cuando quieras con tu enlace privado.',
    noRegistrationNotice: 'Sin registro, sin datos personales, 100% gratuito y confidencial.',
    step1Title: 'Selecciona la duración del buzón',
    step1Subtitle: 'Elige cuánto tiempo permanecerá activa esta bandeja antes de su eliminación permanente.',
    step2Title: 'Generar dirección',
    createEmailButton: 'Crear correo temporal',
    creatingEmailButton: 'Aprovisionando buzón seguro...',

    duration_1h: '1 Hora',
    duration_2h: '2 Horas',
    duration_6h: '6 Horas',
    duration_12h: '12 Horas',
    duration_1d: '1 Día',
    duration_2d: '2 Días',
    duration_3d: '3 Días',
    duration_5d: '5 Días',
    duration_7d: '7 Días',
    maxDurationNotice: 'La duración máxima permitida es de 7 días. Los datos se borran definitivamente al expirar.',

    activeEmailLabel: 'Tu dirección de correo temporal',
    timeRemainingLabel: 'Tiempo restante',
    expiresInPrefix: 'Expira en',
    copyEmailButton: 'Copiar correo',
    copiedEmailToast: '¡Dirección de correo copiada al portapapeles!',
    copyInboxLinkButton: 'Copiar enlace del buzón',
    copiedInboxLinkToast: '¡Enlace privado copiado! Guárdalo para volver a este buzón.',
    shareInboxButton: 'Compartir buzón',
    sharedSuccessToast: 'Enlace del buzón compartido con éxito.',
    changeEmailButton: 'Cambiar correo',
    refreshInboxButton: 'Actualizar buzón',
    deleteEmailButton: 'Eliminar buzón',
    privateLinkWarning: 'Cualquier persona con este enlace podrá leer este buzón. No lo uses para banca o servicios críticos.',

    confirmChangeTitle: '¿Cambiar correo temporal?',
    confirmChangeMessage: 'Estás a punto de crear un nuevo buzón. Tu enlace anterior seguirá siendo válido hasta que expire.',
    confirmDeleteTitle: '¿Eliminar buzón permanentemente?',
    confirmDeleteMessage: '¿Seguro que deseas eliminar este buzón temporal? Todos los correos se borrarán inmediatamente.',
    confirmDeleteButton: 'Sí, eliminar ahora',
    confirmChangeButton: 'Crear nuevo buzón',
    cancelButton: 'Cancelar',

    inboxHeading: 'Bandeja de entrada',
    unreadCountLabel: 'sin leer',
    totalMessagesLabel: 'mensajes',
    refreshingLabel: 'Buscando nuevos correos...',
    waitingEmailsHeading: 'Esperando correos entrantes…',
    waitingEmailsDescription: 'Los mensajes aparecerán aquí automáticamente. También puedes pulsar Actualizar en cualquier momento.',
    senderColumn: 'Remitente',
    subjectColumn: 'Asunto',
    timeColumn: 'Recibido',
    noSubject: '(Sin asunto)',
    hasAttachmentsLabel: 'Adjuntos',

    backToInboxButton: 'Volver a la bandeja',
    fromLabel: 'De',
    toLabel: 'Para',
    dateLabel: 'Fecha',
    subjectLabel: 'Asunto',
    attachmentsHeading: 'Archivos adjuntos',
    viewHtmlButton: 'Vista HTML',
    viewPlainButton: 'Vista de texto',
    downloadAttachmentButton: 'Descargar',
    loadingMessageDetails: 'Cargando el contenido del correo...',

    mailboxExpiredHeading: 'Buzón expirado',
    mailboxExpiredMessage: 'Este buzón temporal ha alcanzado su tiempo límite y su contenido ha sido eliminado de forma permanente.',
    mailboxDeletedHeading: 'Buzón eliminado',
    mailboxDeletedMessage: 'Este buzón fue cerrado manualmente y todos los correos fueron eliminados.',
    createNewEmailButton: 'Crear nuevo correo temporal',

    privacyTitle: 'Pautas de Privacidad y Seguridad',
    privacyNotice1: 'No se requiere registro ni se recopilan datos de identidad.',
    privacyNotice2: 'Los enlaces privados permiten el acceso a quien posea la URL.',
    privacyNotice3: 'No utilices este servicio para banca, salud o cuentas permanentes.',
    privacyNotice4: 'Todos los registros y buzones se eliminan de raíz al expirar.',
    serviceAttribution: 'Desarrollado con la infraestructura Mail inside y protocolo Mail.tm.',

    errorHeading: 'Error en la operación',
    errorNetwork: 'No se pudo conectar con el servidor de correo. Verifica tu conexión.',
    errorNotFound: 'El buzón o mensaje solicitado no existe o ya ha sido eliminado.',
    errorRateLimit: 'Límite de solicitudes alcanzado. Por favor, espera unos instantes.',
    retryButton: 'Intentar de nuevo',
    languageSelectLabel: 'Idioma'
  },

  pt: {
    brandName: 'Mail inside',
    brandTagline: 'Email Temporário Anônimo',
    heroHeadline: 'Email Time — Seu email temporário, no seu tempo',
    heroSubheadline: 'Gere uma caixa de entrada temporária e segura com validade personalizada. Acesse novamente pelo link privado.',
    noRegistrationNotice: 'Sem cadastro, sem dados pessoais, 100% gratuito e privado.',
    step1Title: 'Escolha a duração da caixa de correio',
    step1Subtitle: 'Defina quanto tempo esta caixa ficará ativa antes da exclusão permanente.',
    step2Title: 'Gerar endereço',
    createEmailButton: 'Criar email temporário',
    creatingEmailButton: 'Provisionando caixa de correio...',

    duration_1h: '1 Hora',
    duration_2h: '2 Horas',
    duration_6h: '6 Horas',
    duration_12h: '12 Horas',
    duration_1d: '1 Dia',
    duration_2d: '2 Dias',
    duration_3d: '3 Dias',
    duration_5d: '5 Dias',
    duration_7d: '7 Dias',
    maxDurationNotice: 'O tempo máximo permitido é de 7 dias. Os dados são apagados permanentemente ao expirar.',

    activeEmailLabel: 'Seu endereço de email temporário',
    timeRemainingLabel: 'Tempo restante',
    expiresInPrefix: 'Expira em',
    copyEmailButton: 'Copiar email',
    copiedEmailToast: 'Endereço de email copiado com sucesso!',
    copyInboxLinkButton: 'Copiar link da caixa',
    copiedInboxLinkToast: 'Link privado copiado! Salve para voltar a esta mesma caixa.',
    shareInboxButton: 'Compartilhar caixa',
    sharedSuccessToast: 'Link da caixa compartilhado com sucesso.',
    changeEmailButton: 'Trocar email',
    refreshInboxButton: 'Atualizar caixa',
    deleteEmailButton: 'Excluir caixa',
    privateLinkWarning: 'Qualquer pessoa com este link pode ver estas mensagens. Não use para bancos ou contas essenciais.',

    confirmChangeTitle: 'Trocar email temporário?',
    confirmChangeMessage: 'Você criará uma nova caixa. O link anterior continuará ativo até o término do prazo.',
    confirmDeleteTitle: 'Excluir caixa permanentemente?',
    confirmDeleteMessage: 'Tem certeza de que deseja excluir esta caixa temporária? Todas as mensagens serão destruídas de imediato.',
    confirmDeleteButton: 'Sim, excluir agora',
    confirmChangeButton: 'Criar nova caixa',
    cancelButton: 'Cancelar',

    inboxHeading: 'Caixa de entrada',
    unreadCountLabel: 'não lidas',
    totalMessagesLabel: 'mensagens',
    refreshingLabel: 'Verificando novas mensagens...',
    waitingEmailsHeading: 'Aguardando novos emails…',
    waitingEmailsDescription: 'As mensagens recebidas aparecerão aqui automaticamente. Você também pode clicar em Atualizar.',
    senderColumn: 'Remetente',
    subjectColumn: 'Assunto',
    timeColumn: 'Recebido',
    noSubject: '(Sem assunto)',
    hasAttachmentsLabel: 'Anexos',

    backToInboxButton: 'Voltar à caixa de entrada',
    fromLabel: 'De',
    toLabel: 'Para',
    dateLabel: 'Data',
    subjectLabel: 'Assunto',
    attachmentsHeading: 'Anexos',
    viewHtmlButton: 'Visualização HTML',
    viewPlainButton: 'Visualização de texto',
    downloadAttachmentButton: 'Baixar',
    loadingMessageDetails: 'Carregando conteúdo da mensagem com segurança...',

    mailboxExpiredHeading: 'Caixa de correio expirada',
    mailboxExpiredMessage: 'Esta caixa temporária atingiu o prazo planejado e todos os seus dados foram excluídos definitivamente.',
    mailboxDeletedHeading: 'Caixa excluída',
    mailboxDeletedMessage: 'Esta caixa foi encerrada manualmente e todas as mensagens foram apagadas.',
    createNewEmailButton: 'Criar novo email temporário',

    privacyTitle: 'Diretrizes de Privacidade e Segurança',
    privacyNotice1: 'Nenhum registro ou informação de identidade é coletado.',
    privacyNotice2: 'Links privados concedem acesso a quem possuir o endereço URL.',
    privacyNotice3: 'Nunca utilize este serviço para contas bancárias, médicas ou definitivas.',
    privacyNotice4: 'Todos os registros e caixas são apagados na raiz ao término do prazo.',
    serviceAttribution: 'Operado pela infraestrutura Mail inside com suporte ao protocolo Mail.tm.',

    errorHeading: 'Erro na operação',
    errorNetwork: 'Não foi possível conectar ao servidor de email. Verifique sua conexão.',
    errorNotFound: 'A caixa ou mensagem solicitada não foi encontrada ou já foi removida.',
    errorRateLimit: 'Limite de requisições atingido. Aguarde alguns instantes.',
    retryButton: 'Tentar novamente',
    languageSelectLabel: 'Idioma'
  }
};

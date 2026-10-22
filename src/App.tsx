import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { DurationPicker } from './components/DurationPicker.tsx';
import { MailboxCard } from './components/MailboxCard.tsx';
import { InboxList } from './components/InboxList.tsx';
import { EmailReader } from './components/EmailReader.tsx';
import { ExpiredView } from './components/ExpiredView.tsx';
import { ConfirmModal } from './components/ConfirmModal.tsx';
import { ToastContainer, type ToastMessage } from './components/Toast.tsx';
import { PrivacySection } from './components/PrivacySection.tsx';
import { I18nProvider, useI18n } from './i18n/context.tsx';
import type { ClientMailboxData, EmailMessageSummary, EmailMessageDetail } from '../server/types.ts';

const LOCAL_STORAGE_ACTIVE_TOKEN = 'mailinside_active_share_token';

function getInitialTokenFromUrl(): string | null {
  try {
    const path = window.location.pathname;
    const match = path.match(/\/inbox\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return match[1];
    }
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || params.get('inbox') || null;
  } catch {
    return null;
  }
}

const MainApp: React.FC = () => {
  const { t } = useI18n();

  // Core state
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [mailbox, setMailbox] = useState<ClientMailboxData | null>(null);
  const [messages, setMessages] = useState<EmailMessageSummary[]>([]);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [inboxError, setInboxError] = useState<string | null>(null);

  // Email reader state
  const [selectedMessage, setSelectedMessage] = useState<EmailMessageDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  // Confirmation dialogs
  const [showChangeModal, setShowChangeModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev.slice(-3), { id, type, text }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch messages for a mailbox
  const fetchMessages = useCallback(async (token: string, background = false) => {
    if (!background) {
      setIsRefreshing(true);
    }
    setInboxError(null);

    try {
      const res = await fetch(`/api/mailboxes/${token}/messages`);
      if (res.status === 410) {
        // Mailbox expired or deleted
        const data = await res.json();
        setMailbox(prev => prev ? { ...prev, status: data.status || 'expired' } : null);
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to fetch messages');
      }

      const data = await res.json();
      setMessages(data.messages || []);
      setTotalMessages(data.total || 0);
      if (data.mailbox) {
        setMailbox(data.mailbox);
      }
    } catch (err: any) {
      console.warn('Error fetching messages:', err);
      if (!background) {
        setInboxError(err.message || t.errorNetwork);
      }
    } finally {
      setIsRefreshing(false);
      setIsLoadingMessages(false);
    }
  }, [t.errorNetwork]);

  // Load existing mailbox from token
  const loadMailbox = useCallback(async (token: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/mailboxes/${token}`);
      if (res.status === 404) {
        addToast('error', t.errorNotFound);
        localStorage.removeItem(LOCAL_STORAGE_ACTIVE_TOKEN);
        window.history.pushState(null, '', '/');
        setIsLoadingMessages(false);
        return;
      }

      const data: ClientMailboxData = await res.json();
      setMailbox(data);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_TOKEN, data.shareToken);

      if (data.status === 'active') {
        await fetchMessages(data.shareToken, false);
      }
    } catch (err: any) {
      addToast('error', err.message || t.errorNetwork);
      setIsLoadingMessages(false);
    }
  }, [addToast, fetchMessages, t.errorNotFound, t.errorNetwork]);

  // Initial load check from URL or localStorage
  useEffect(() => {
    const urlToken = getInitialTokenFromUrl();
    const storedToken = localStorage.getItem(LOCAL_STORAGE_ACTIVE_TOKEN);
    const tokenToLoad = urlToken || storedToken;

    if (tokenToLoad) {
      loadMailbox(tokenToLoad);
    }
  }, [loadMailbox]);

  // Background auto-refresh polling interval (every 12 seconds when active)
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!mailbox || mailbox.status !== 'active') {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }

    pollTimerRef.current = setInterval(() => {
      fetchMessages(mailbox.shareToken, true);
    }, 12000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [mailbox, fetchMessages]);

  // Create temporary email
  const handleCreateEmail = async (overrideHours?: number) => {
    const hours = overrideHours || selectedHours;
    setIsCreating(true);

    try {
      const res = await fetch('/api/mailboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationHours: hours })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to generate temporary email');
      }

      const newMailbox: ClientMailboxData = await res.json();
      setMailbox(newMailbox);
      setMessages([]);
      setTotalMessages(0);
      setSelectedMessage(null);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_TOKEN, newMailbox.shareToken);

      // Update URL safely
      window.history.pushState(null, '', `/inbox/${newMailbox.shareToken}`);

      addToast('success', `${t.activeEmailLabel}: ${newMailbox.address}`);

      // Initial check
      fetchMessages(newMailbox.shareToken, false);
    } catch (err: any) {
      addToast('error', err.message || t.errorNetwork);
    } finally {
      setIsCreating(false);
      setShowChangeModal(false);
    }
  };

  // Clipboard copy handlers
  const handleCopyEmail = () => {
    if (!mailbox) return;
    navigator.clipboard.writeText(mailbox.address).then(() => {
      addToast('success', t.copiedEmailToast);
    }).catch(() => {
      addToast('info', mailbox.address);
    });
  };

  const getShareUrl = () => {
    if (!mailbox) return window.location.href;
    return `${window.location.origin}/inbox/${mailbox.shareToken}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      addToast('success', t.copiedInboxLinkToast);
    }).catch(() => {
      addToast('info', url);
    });
  };

  const handleShareInbox = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t.brandName} - Temporary Inbox`,
          text: `Access my temporary mailbox on ${t.brandName}`,
          url
        });
        addToast('success', t.sharedSuccessToast);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }
    // Fallback to clipboard
    handleCopyLink();
  };

  // Delete mailbox
  const handleDeleteMailbox = async () => {
    if (!mailbox) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/mailboxes/${mailbox.shareToken}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete mailbox');
      }

      setMailbox(prev => prev ? { ...prev, status: 'deleted' } : null);
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_TOKEN);
      addToast('info', t.mailboxDeletedHeading);
    } catch (err: any) {
      addToast('error', err.message || t.errorNetwork);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Select message & read
  const handleSelectMessage = async (msgId: string) => {
    if (!mailbox) return;
    setIsLoadingDetail(true);

    // Optimistically mark as seen in UI
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, seen: true } : m));

    try {
      const res = await fetch(`/api/mailboxes/${mailbox.shareToken}/messages/${msgId}`);
      if (!res.ok) {
        throw new Error('Failed to load message content');
      }
      const data = await res.json();
      setSelectedMessage(data.message);
    } catch (err: any) {
      addToast('error', err.message || 'Unable to open email');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const scrollToPrivacy = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateNewFromExpired = () => {
    setMailbox(null);
    setSelectedMessage(null);
    setMessages([]);
    localStorage.removeItem(LOCAL_STORAGE_ACTIVE_TOKEN);
    window.history.pushState(null, '', '/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Header with Top Bar Contract */}
      <Header
        onNewEmailClick={mailbox ? () => setShowChangeModal(true) : undefined}
        onScrollToPrivacy={scrollToPrivacy}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!mailbox ? (
          /* Step 1 & Step 2: Duration Selector and Mailbox Creator */
          <DurationPicker
            selectedHours={selectedHours}
            onSelectHours={setSelectedHours}
            onCreateEmail={() => handleCreateEmail()}
            isLoading={isCreating}
          />
        ) : mailbox.status === 'expired' || mailbox.status === 'deleted' ? (
          /* Expired / Deleted View */
          <ExpiredView
            status={mailbox.status}
            onCreateNew={handleCreateNewFromExpired}
          />
        ) : (
          /* Active Mailbox View */
          <div className="w-full">
            <MailboxCard
              mailbox={mailbox}
              isRefreshing={isRefreshing}
              onRefresh={() => fetchMessages(mailbox.shareToken, false)}
              onChangeEmailRequest={() => setShowChangeModal(true)}
              onDeleteEmailRequest={() => setShowDeleteModal(true)}
              onCopyEmail={handleCopyEmail}
              onCopyLink={handleCopyLink}
              onShareInbox={handleShareInbox}
              onExpired={() => setMailbox(prev => prev ? { ...prev, status: 'expired' } : null)}
            />

            {/* Email Reader or Inbox List */}
            {selectedMessage ? (
              <EmailReader
                message={selectedMessage}
                onBack={() => setSelectedMessage(null)}
                isLoading={isLoadingDetail}
              />
            ) : (
              <InboxList
                messages={messages}
                total={totalMessages}
                isLoading={isLoadingMessages}
                isRefreshing={isRefreshing}
                onRefresh={() => fetchMessages(mailbox.shareToken, false)}
                onSelectMessage={handleSelectMessage}
                errorMessage={inboxError}
              />
            )}
          </div>
        )}

        {/* Informational Privacy & FAQ Section */}
        <PrivacySection />
      </main>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showChangeModal}
        title={t.confirmChangeTitle}
        message={t.confirmChangeMessage}
        confirmLabel={t.confirmChangeButton}
        onConfirm={() => handleCreateEmail()}
        onCancel={() => setShowChangeModal(false)}
        isLoading={isCreating}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        title={t.confirmDeleteTitle}
        message={t.confirmDeleteMessage}
        confirmLabel={t.confirmDeleteButton}
        isDestructive={true}
        onConfirm={handleDeleteMailbox}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <MainApp />
    </I18nProvider>
  );
}

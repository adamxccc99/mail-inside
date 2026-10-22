export interface MailboxRecord {
  id: number;
  address: string;
  share_token: string;
  share_token_hash: string;
  provider: string;
  provider_account_id: string;
  provider_token: string;
  provider_password?: string;
  created_at: number;
  duration_hours: number;
  expires_at: number;
  status: 'active' | 'expired' | 'deleted';
}

export interface ClientMailboxData {
  address: string;
  shareToken: string;
  createdAt: number;
  durationHours: number;
  expiresAt: number;
  status: 'active' | 'expired' | 'deleted';
}

export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  disposition: string;
  transferEncoding: string;
  related: boolean;
  size: number;
  downloadUrl?: string;
}

export interface EmailMessageSummary {
  id: string;
  accountId: string;
  msgid: string;
  from: {
    address: string;
    name: string;
  };
  to: Array<{
    address: string;
    name: string;
  }>;
  subject: string;
  intro?: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailMessageDetail extends EmailMessageSummary {
  text?: string;
  html?: string[];
  attachments?: EmailAttachment[];
}

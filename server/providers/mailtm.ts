import type { EmailProvider } from './types.ts';
import type { EmailMessageSummary, EmailMessageDetail } from '../types.ts';

const API_BASE = process.env.MAIL_TM_API_URL || 'https://api.mail.tm';

export class MailTmProvider implements EmailProvider {
  name = 'mailtm';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        let errorBody = '';
        try {
          const errJson = await response.json();
          errorBody = errJson.message || errJson['hydra:description'] || JSON.stringify(errJson);
        } catch {
          errorBody = await response.text().catch(() => response.statusText);
        }

        if (response.status === 429) {
          throw new Error('Email service rate limit reached. Please wait a moment and try again.');
        }
        if (response.status === 404) {
          throw new Error('Requested email or resource was not found.');
        }
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed with email provider.');
        }

        throw new Error(`Email provider error (${response.status}): ${errorBody}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json() as T;
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        throw new Error('Email provider request timed out. Please try again.');
      }
      throw err;
    }
  }

  async getAvailableDomains(): Promise<string[]> {
    interface DomainItem {
      id: string;
      domain: string;
      isActive: boolean;
      isPrivate: boolean;
    }
    interface DomainsResponse {
      'hydra:member'?: DomainItem[];
      totalItems?: number;
      'hydra:totalItems'?: number;
    }

    const data = await this.request<any>('/domains');
    const members: DomainItem[] = Array.isArray(data)
      ? data
      : (data && Array.isArray(data['hydra:member']) ? data['hydra:member'] : []);
    const activeDomains = members
      .filter(d => d.isActive && !d.isPrivate)
      .map(d => d.domain);

    if (activeDomains.length === 0) {
      // Fallback if none explicitly marked public
      const anyActive = members.filter(d => d.isActive).map(d => d.domain);
      if (anyActive.length > 0) return anyActive;
      throw new Error('No active email domains available from provider.');
    }

    return activeDomains;
  }

  async createAccount(address: string, password: string): Promise<{ id: string; address: string }> {
    interface AccountResponse {
      id: string;
      address: string;
      quota?: number;
    }

    const data = await this.request<AccountResponse>('/accounts', {
      method: 'POST',
      body: JSON.stringify({ address, password })
    });

    return {
      id: data.id,
      address: data.address
    };
  }

  async authenticate(address: string, password: string): Promise<string> {
    interface TokenResponse {
      token: string;
      id: string;
    }

    const data = await this.request<TokenResponse>('/token', {
      method: 'POST',
      body: JSON.stringify({ address, password })
    });

    if (!data.token) {
      throw new Error('Failed to retrieve authentication token from email provider.');
    }

    return data.token;
  }

  async getMessages(token: string, page = 1): Promise<{ messages: EmailMessageSummary[]; total: number }> {
    interface MessagesResponse {
      'hydra:member'?: any[];
      'hydra:totalItems'?: number;
      totalItems?: number;
    }

    const data = await this.request<MessagesResponse>(`/messages?page=${page}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const members = Array.isArray(data['hydra:member'])
      ? data['hydra:member']
      : (Array.isArray(data) ? data : []);

    const total = data['hydra:totalItems'] ?? data.totalItems ?? members.length;

    const messages: EmailMessageSummary[] = members.map((item: any) => ({
      id: item.id,
      accountId: item.accountId || '',
      msgid: item.msgid || '',
      from: {
        address: item.from?.address || '',
        name: item.from?.name || ''
      },
      to: Array.isArray(item.to) ? item.to.map((t: any) => ({
        address: t.address || '',
        name: t.name || ''
      })) : [],
      subject: item.subject || '(No Subject)',
      intro: item.intro || '',
      seen: Boolean(item.seen),
      isDeleted: Boolean(item.isDeleted),
      hasAttachments: Boolean(item.hasAttachments),
      size: item.size || 0,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    }));

    return { messages, total };
  }

  async getMessage(token: string, messageId: string): Promise<EmailMessageDetail> {
    const item = await this.request<any>(`/messages/${messageId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      id: item.id,
      accountId: item.accountId || '',
      msgid: item.msgid || '',
      from: {
        address: item.from?.address || '',
        name: item.from?.name || ''
      },
      to: Array.isArray(item.to) ? item.to.map((t: any) => ({
        address: t.address || '',
        name: t.name || ''
      })) : [],
      subject: item.subject || '(No Subject)',
      intro: item.intro || '',
      seen: Boolean(item.seen),
      isDeleted: Boolean(item.isDeleted),
      hasAttachments: Boolean(item.hasAttachments),
      size: item.size || 0,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      text: item.text || '',
      html: Array.isArray(item.html) ? item.html : (item.html ? [item.html] : []),
      attachments: Array.isArray(item.attachments) ? item.attachments.map((att: any) => ({
        id: att.id,
        filename: att.filename || 'attachment',
        contentType: att.contentType || 'application/octet-stream',
        disposition: att.disposition || 'attachment',
        transferEncoding: att.transferEncoding || '',
        related: Boolean(att.related),
        size: att.size || 0,
        downloadUrl: att.downloadUrl || `${API_BASE}/messages/${messageId}/attachment/${att.id}`
      })) : []
    };
  }

  async deleteAccount(token: string, accountId: string): Promise<boolean> {
    try {
      await this.request<any>(`/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch (err: any) {
      console.warn(`[MailTmProvider] Failed to delete account ${accountId} upstream:`, err.message);
      return false;
    }
  }
}

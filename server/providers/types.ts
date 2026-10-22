import type { EmailMessageSummary, EmailMessageDetail } from '../types.ts';

export interface EmailProvider {
  name: string;
  getAvailableDomains(): Promise<string[]>;
  createAccount(address: string, password: string): Promise<{ id: string; address: string }>;
  authenticate(address: string, password: string): Promise<string>;
  getMessages(token: string, page?: number): Promise<{ messages: EmailMessageSummary[]; total: number }>;
  getMessage(token: string, messageId: string): Promise<EmailMessageDetail>;
  deleteAccount(token: string, accountId: string): Promise<boolean>;
}

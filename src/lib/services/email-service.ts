import { graphService } from '../graph';
import { gmailService } from './gmail-service';
import { EmailProvider, Contact, CalendarEvent } from '@/types/email';

export class EmailService {
  private static instance: EmailService;
  private provider: EmailProvider | null = null;

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async setProvider(provider: EmailProvider) {
    this.provider = provider;
  }

  async getContacts(): Promise<Contact[]> {
    if (!this.provider) throw new Error('No email provider set');

    switch (this.provider) {
      case 'microsoft':
        return graphService.getContacts();
      case 'gmail':
        return gmailService.getContacts();
      default:
        throw new Error('Unsupported email provider');
    }
  }

  async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.provider) throw new Error('No email provider set');

    switch (this.provider) {
      case 'microsoft':
        return graphService.getCalendarEvents(startDate, endDate);
      case 'gmail':
        return gmailService.getCalendarEvents(startDate, endDate);
      default:
        throw new Error('Unsupported email provider');
    }
  }

  async syncData(): Promise<void> {
    if (!this.provider) throw new Error('No email provider set');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();

    try {
      await Promise.all([
        this.getContacts(),
        this.getCalendarEvents(startDate, endDate)
      ]);
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  }
}

export const emailService = EmailService.getInstance();
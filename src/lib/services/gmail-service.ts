import { gapi } from 'gapi-script';
import { GMAIL_CONFIG } from '../gmail-config';
import { Contact, CalendarEvent } from '@/types/email';

class GmailService {
  private static instance: GmailService;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): GmailService {
    if (!GmailService.instance) {
      GmailService.instance = new GmailService();
    }
    return GmailService.instance;
  }

  async initialize(accessToken: string) {
    if (this.initialized) return;

    await new Promise((resolve) => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          clientId: GMAIL_CONFIG.clientId,
          scope: GMAIL_CONFIG.scopes.join(' '),
        });

        gapi.client.setToken({ access_token: accessToken });
        this.initialized = true;
        resolve(true);
      });
    });
  }

  async getContacts(): Promise<Contact[]> {
    if (!this.initialized) throw new Error('Gmail service not initialized');

    try {
      const response = await gapi.client.request({
        path: 'https://people.googleapis.com/v1/people/me/connections',
        params: {
          personFields: 'names,emailAddresses,organizations',
          pageSize: 100,
        },
      });

      const contacts = response.result.connections || [];
      return contacts.map((person: any) => ({
        id: person.resourceName || '',
        name: person.names?.[0]?.displayName || '',
        email: person.emailAddresses?.[0]?.value || '',
        company: person.organizations?.[0]?.name || '',
        source: 'contact'
      }));
    } catch (error) {
      console.error('Error fetching Gmail contacts:', error);
      throw error;
    }
  }

  async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.initialized) throw new Error('Gmail service not initialized');

    try {
      const response = await gapi.client.request({
        path: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        params: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        },
      });

      const events = response.result.items || [];
      return events.map((event: any) => ({
        id: event.id || '',
        title: event.summary || '',
        start: event.start?.dateTime || '',
        end: event.end?.dateTime || '',
        attendees: event.attendees?.map((attendee: any) => ({
          email: attendee.email || '',
          name: attendee.displayName || ''
        })) || []
      }));
    } catch (error) {
      console.error('Error fetching Gmail calendar events:', error);
      throw error;
    }
  }
}

export const gmailService = GmailService.getInstance();
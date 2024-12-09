export type EmailProvider = 'microsoft' | 'gmail';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  source: 'contact' | 'meeting' | 'email';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees: Array<{
    email: string;
    name: string;
  }>;
}
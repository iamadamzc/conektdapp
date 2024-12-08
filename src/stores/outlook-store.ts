import { create } from 'zustand';
import { graphService } from '@/lib/graph';

interface Contact {
  id: string;
  name: string;
  email: string;
  source: 'meeting' | 'email';
  date: string;
  event?: string;
}

interface OutlookState {
  isAuthenticated: boolean;
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
  syncContacts: () => Promise<void>;
}

export const useOutlookStore = create<OutlookState>((set) => ({
  isAuthenticated: false,
  contacts: [],
  isLoading: false,
  error: null,

  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

  login: async () => {
    set({ isLoading: true, error: null });
    try {
      await graphService.login();
    } catch (error) {
      set({ error: 'Failed to login to Microsoft account' });
    } finally {
      set({ isLoading: false });
    }
  },

  syncContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Get calendar events for the last 30 days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const events = await graphService.getCalendarEvents(startDate, new Date());
      
      // Get email contacts for the last 30 days
      const emails = await graphService.getEmailContacts(30);

      // Process calendar events
      const meetingContacts = events.flatMap(event => 
        event.attendees.map(attendee => ({
          id: `meeting-${event.id}-${attendee.emailAddress.address}`,
          name: attendee.emailAddress.name,
          email: attendee.emailAddress.address,
          source: 'meeting' as const,
          date: event.start.dateTime,
          event: event.subject
        }))
      );

      // Process email contacts
      const emailContacts = emails.flatMap(email => [
        ...email.toRecipients,
        ...(email.ccRecipients || [])
      ].map(recipient => ({
        id: `email-${email.id}-${recipient.emailAddress.address}`,
        name: recipient.emailAddress.name,
        email: recipient.emailAddress.address,
        source: 'email' as const,
        date: email.receivedDateTime,
      })));

      // Combine and deduplicate contacts
      const allContacts = [...meetingContacts, ...emailContacts];
      const uniqueContacts = Array.from(
        new Map(allContacts.map(contact => [contact.email, contact])).values()
      );

      set({ contacts: uniqueContacts });
    } catch (error) {
      set({ error: 'Failed to sync contacts' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
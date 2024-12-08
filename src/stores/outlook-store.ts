import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { graphService } from '../lib/graph';
import { msalErrorConfig } from '../lib/auth-config';

interface EmailAddress {
  name: string;
  address: string;
}

interface Attendee {
  emailAddress: EmailAddress;
}

interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
  };
  attendees: Attendee[];
}

interface EmailMessage {
  id: string;
  receivedDateTime: string;
  toRecipients: { emailAddress: EmailAddress }[];
  ccRecipients?: { emailAddress: EmailAddress }[];
}

interface DirectContact {
  id: string;
  displayName: string;
  emailAddresses: { address: string }[];
  companyName?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  source: 'meeting' | 'email' | 'contact';
  date: string;
  event?: string;
  company?: string;
}

interface OutlookState {
  isAuthenticated: boolean;
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  login: () => Promise<void>;
  loginWithDifferentAccount: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
  syncContacts: () => Promise<void>;
  clearError: () => void;
  logout: () => void;
}

const SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutes

export const useOutlookStore = create<OutlookState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      contacts: [],
      isLoading: false,
      error: null,
      lastSync: null,

      setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

      clearError: () => set({ error: null }),

      login: async () => {
        set({ isLoading: true, error: null });
        try {
          await graphService.login();
          set({ isAuthenticated: true });
          // Attempt initial sync after successful login
          await get().syncContacts();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : msalErrorConfig.errorMessages.auth;
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithDifferentAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          await graphService.loginWithDifferentAccount();
          set({ isAuthenticated: true });
          // Clear existing contacts and perform fresh sync
          set({ contacts: [] });
          await get().syncContacts();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : msalErrorConfig.errorMessages.auth;
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          contacts: [],
          lastSync: null,
          error: null
        });
      },

      syncContacts: async () => {
        const state = get();
        // Check if sync is needed (not synced in last 30 minutes)
        const shouldSync = !state.lastSync || 
          (Date.now() - new Date(state.lastSync).getTime() > SYNC_INTERVAL);

        if (!shouldSync && state.contacts.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          // Get calendar events for the last 30 days
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          const events = await graphService.getCalendarEvents(startDate, new Date());
          
          // Get email contacts for the last 30 days
          const emails = await graphService.getEmailContacts(30);

          // Get direct contacts
          const directContacts = await graphService.getContacts();

          // Process calendar events
          const meetingContacts = events.flatMap((event: CalendarEvent) => 
            event.attendees.map((attendee: Attendee) => ({
              id: `meeting-${event.id}-${attendee.emailAddress.address}`,
              name: attendee.emailAddress.name,
              email: attendee.emailAddress.address,
              source: 'meeting' as const,
              date: event.start.dateTime,
              event: event.subject
            }))
          );

          // Process email contacts
          const emailContacts = emails.flatMap((email: EmailMessage) => [
            ...email.toRecipients,
            ...(email.ccRecipients || [])
          ].map(recipient => ({
            id: `email-${email.id}-${recipient.emailAddress.address}`,
            name: recipient.emailAddress.name,
            email: recipient.emailAddress.address,
            source: 'email' as const,
            date: email.receivedDateTime,
          })));

          // Process direct contacts
          const contacts = directContacts.map((contact: DirectContact) => ({
            id: `contact-${contact.id}`,
            name: contact.displayName,
            email: contact.emailAddresses[0]?.address,
            source: 'contact' as const,
            date: new Date().toISOString(),
            company: contact.companyName
          })).filter((contact: { email: string | undefined }) => contact.email); // Only include contacts with email addresses

          // Combine and deduplicate contacts
          const allContacts = [...meetingContacts, ...emailContacts, ...contacts];
          const uniqueContacts = Array.from(
            new Map(allContacts.map(contact => [contact.email, contact])).values()
          );

          set({ 
            contacts: uniqueContacts,
            lastSync: new Date().toISOString()
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : msalErrorConfig.errorMessages.graph;
          set({ error: errorMessage });
          
          // If error is auth-related, reset authentication state
          if (error instanceof Error && error.message === msalErrorConfig.errorMessages.token) {
            set({ isAuthenticated: false });
          }
          
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'outlook-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        contacts: state.contacts,
        lastSync: state.lastSync
      })
    }
  )
);

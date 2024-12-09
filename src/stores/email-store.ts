import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmailProvider, Contact, CalendarEvent } from '@/types/email';
import { emailService } from '@/lib/services/email-service';

interface EmailState {
  provider: EmailProvider | null;
  contacts: Contact[];
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  setProvider: (provider: EmailProvider) => Promise<void>;
  syncData: () => Promise<void>;
  clearError: () => void;
}

export const useEmailStore = create<EmailState>()(
  persist(
    (set, get) => ({
      provider: null,
      contacts: [],
      events: [],
      isLoading: false,
      error: null,
      lastSync: null,

      setProvider: async (provider) => {
        set({ provider });
        await emailService.setProvider(provider);
      },

      syncData: async () => {
        const { provider } = get();
        if (!provider) return;

        set({ isLoading: true, error: null });
        try {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          const endDate = new Date();

          const [contacts, events] = await Promise.all([
            emailService.getContacts(),
            emailService.getCalendarEvents(startDate, endDate)
          ]);

          set({
            contacts,
            events,
            lastSync: new Date().toISOString()
          });
        } catch (error) {
          set({ error: 'Failed to sync data' });
          console.error('Sync failed:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'email-storage',
      partialize: (state) => ({
        provider: state.provider,
        contacts: state.contacts,
        events: state.events,
        lastSync: state.lastSync
      })
    }
  )
);
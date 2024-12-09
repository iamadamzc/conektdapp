import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const user: User = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ error: 'Registration failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const user: User = {
            id: crypto.randomUUID(),
            email,
            firstName: '',
            lastName: '',
            company: '',
            createdAt: new Date().toISOString(),
          };
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ error: 'Login failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.clear(); // Clear all localStorage
        sessionStorage.clear(); // Clear all sessionStorage
        set({ user: null, isAuthenticated: false });
      },

      clearAuthState: () => {
        localStorage.clear(); // Clear all localStorage
        sessionStorage.clear(); // Clear all sessionStorage
        set({ user: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true, // Prevent auto-hydration of persisted state
    }
  )
);
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Connection, ConnectionStatus } from '@/types/connection';
import { mockConnections } from '@/data/mock-connections';

interface ConnectionState {
  connections: Record<string, Connection>;
  initialized: boolean;
  updateStatus: (id: string, status: ConnectionStatus, notes?: string) => void;
  addConnection: (connection: Omit<Connection, 'status' | 'lastUpdated' | 'notes'>) => void;
  getConnection: (id: string) => Connection | undefined;
  getAllConnections: () => Connection[];
  initializeStore: () => void;
  getStats: () => {
    total: number;
    pending: number;
    connected: number;
    rejected: number;
  };
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connections: {},
      initialized: false,

      initializeStore: () => {
        if (!get().initialized) {
          const connections = mockConnections.reduce((acc, connection) => {
            acc[connection.id] = {
              ...connection,
              lastUpdated: new Date().toISOString()
            };
            return acc;
          }, {} as Record<string, Connection>);

          set({ connections, initialized: true });
        }
      },

      updateStatus: (id, status, notes) => {
        set((state) => ({
          connections: {
            ...state.connections,
            [id]: {
              ...state.connections[id],
              status,
              lastUpdated: new Date().toISOString(),
              notes: notes || state.connections[id]?.notes,
            },
          },
        }));
      },

      addConnection: (connection) => {
        set((state) => ({
          connections: {
            ...state.connections,
            [connection.id]: {
              ...connection,
              status: 'not_connected',
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      getConnection: (id) => {
        return get().connections[id];
      },

      getAllConnections: () => {
        return Object.values(get().connections).sort(
          (a, b) => new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime()
        );
      },

      getStats: () => {
        const connections = Object.values(get().connections);
        return {
          total: connections.length,
          pending: connections.filter(c => c.status === 'pending').length,
          connected: connections.filter(c => c.status === 'connected').length,
          rejected: connections.filter(c => c.status === 'rejected').length,
        };
      },
    }),
    {
      name: 'connection-storage',
    }
  )
);
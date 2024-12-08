export type ConnectionStatus = 'not_connected' | 'pending' | 'connected' | 'rejected';
export type ConnectionSource = 'meeting' | 'email';

export interface Connection {
  id: string;
  name: string;
  email: string;
  event?: string;
  date: string;
  company: string;
  title?: string;
  source: ConnectionSource;
  status: ConnectionStatus;
  notes?: string;
  lastUpdated?: string;
}
import { Connection } from '@/types/connection';

export const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Brian P',
    email: 'brian@bluumly.com',
    event: 'Q1 Planning Meeting',
    date: '2024-03-15',
    company: 'Bluumly',
    title: 'Product Manager',
    source: 'meeting',
    status: 'not_connected'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@techcorp.com',
    event: 'Tech Conference 2024',
    date: '2024-03-10',
    company: 'TechCorp',
    title: 'Senior Developer',
    source: 'meeting',
    status: 'not_connected'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@innovate.io',
    event: 'Product Demo',
    date: '2024-03-08',
    company: 'Innovate',
    title: 'CTO',
    source: 'meeting',
    status: 'not_connected'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily@designstudio.com',
    event: 'UX Workshop',
    date: '2024-03-05',
    company: 'Design Studio',
    title: 'Lead Designer',
    source: 'meeting',
    status: 'not_connected'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.k@startup.co',
    event: 'Startup Meetup',
    date: '2024-03-01',
    company: 'StartupCo',
    title: 'Founder',
    source: 'meeting',
    status: 'not_connected'
  }
];
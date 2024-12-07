import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft } from 'lucide-react';
import { openLinkedInWindow } from '@/lib/window-utils';
import { ConnectionPanel } from './connection-panel';
import { formatLinkedInSearchQuery, getCompanyFromEmail } from '@/lib/utils';

const mockConnections = [
  {
    id: '1',
    name: 'Brian P',
    email: 'brian@bluumly.com',
    event: 'Q1 Planning Meeting',
    date: '2024-03-15',
    status: 'not_connected',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    event: 'Product Review',
    date: '2024-03-14',
    status: 'pending',
  },
] as const;

export const ConnectionList = () => {
  const [selectedConnection, setSelectedConnection] = useState<typeof mockConnections[number] | null>(null);

  const handleSearch = (connection: typeof mockConnections[number]) => {
    const [firstName, lastName] = connection.name.split(' ');
    const company = getCompanyFromEmail(connection.email);
    const searchUrl = formatLinkedInSearchQuery(firstName, lastName, company);
    openLinkedInWindow(searchUrl);
    setSelectedConnection(connection);
  };

  if (selectedConnection) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => setSelectedConnection(null)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Connections
        </Button>
        <ConnectionPanel connection={selectedConnection} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-base font-semibold text-gray-900">Recent Connections</h3>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {mockConnections.map((connection) => (
          <li key={connection.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{connection.name}</p>
                <p className="text-sm text-gray-500">{connection.email}</p>
                <p className="mt-1 text-xs text-gray-500">
                  From: {connection.event} ({connection.date})
                </p>
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex items-center shadow-sm"
                  onClick={() => handleSearch(connection)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search on LinkedIn
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
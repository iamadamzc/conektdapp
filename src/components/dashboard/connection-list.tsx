import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { openLinkedInWindow } from '@/lib/window-utils';
import { ConnectionPanel } from './connection-panel';
import { formatLinkedInSearchQuery, getCompanyFromEmail } from '@/lib/utils';
import { useConnectionStore } from '@/stores/connection-store';
import { Connection } from '@/types/connection';

export const ConnectionList = () => {
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getAllConnections, initializeStore } = useConnectionStore();
  const connections = getAllConnections();

  useEffect(() => {
    initializeStore();
  }, []);

  const handleSearch = (connection: Connection) => {
    const [firstName, lastName] = connection.name.split(' ');
    const searchUrl = formatLinkedInSearchQuery(firstName, lastName, connection.company);
    openLinkedInWindow(searchUrl);
    setSelectedConnection(connection);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % connections.length;
    setCurrentIndex(nextIndex);
    handleSearch(connections[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? connections.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    handleSearch(connections[prevIndex]);
  };

  const handleBack = () => {
    setSelectedConnection(null);
    setCurrentIndex(0);
  };

  if (selectedConnection) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">
              {currentIndex + 1} of {connections.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="flex items-center"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ConnectionPanel
          connection={selectedConnection}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-base font-semibold text-gray-900">Recent Connections</h3>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {connections.map((connection) => (
          <li key={connection.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{connection.name}</p>
                <p className="text-sm text-gray-500">{connection.title} at {connection.company}</p>
                <p className="mt-1 text-xs text-gray-500">
                  From: {connection.event} ({connection.date})
                </p>
                {connection.status !== 'not_connected' && (
                  <p className="mt-1 text-xs font-medium text-blue-600">
                    Status: {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                  </p>
                )}
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
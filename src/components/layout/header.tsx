import React from 'react';
import { Link2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOutlookStore } from '@/stores/outlook-store';

export const Header = () => {
  const { isAuthenticated, syncContacts, isLoading } = useOutlookStore();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Conektd</span>
          </div>
          {isAuthenticated && (
            <Button
              variant="secondary"
              className="flex items-center"
              onClick={() => syncContacts()}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Syncing...' : 'Sync Outlook'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { Link2 } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Link2 className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">Conektd</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Sync Outlook
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
};
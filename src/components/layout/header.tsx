import React from 'react';
import { Link2 } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Conektd</span>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Connections
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Settings
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
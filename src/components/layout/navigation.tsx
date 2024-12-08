import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutGrid, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutGrid },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center space-x-4">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md',
              'transition-colors duration-150 ease-in-out',
              location.pathname === item.href
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};
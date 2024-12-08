import React from 'react';
import { ConnectionList } from '@/components/dashboard/connection-list';
import { ConnectionStats } from '@/components/dashboard/connection-stats';
import { Linkedin } from 'lucide-react';

export const DashboardPage = () => {
  return (
    <div className="flex">
      {/* LinkedIn Window Area */}
      <div className="fixed left-0 top-16 w-1/2 h-[calc(100vh-4rem)] bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6">
          <Linkedin className="h-16 w-16 text-[#0A66C2] mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            LinkedIn search will open here
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="fixed right-0 top-16 w-1/2 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ConnectionStats />
          <ConnectionList />
        </div>
      </main>
    </div>
  );
};
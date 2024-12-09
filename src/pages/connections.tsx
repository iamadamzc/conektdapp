import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ConnectionList } from '@/components/dashboard/connection-list';
import { ConnectionStats } from '@/components/dashboard/connection-stats';

export const ConnectionsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Connections"
        description="Manage your LinkedIn connection requests"
      />
      
      <ConnectionStats />
      <ConnectionList />
    </div>
  );
};
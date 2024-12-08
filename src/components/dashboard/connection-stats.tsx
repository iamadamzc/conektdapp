import React from 'react';
import { useConnectionStore } from '@/stores/connection-store';
import { Users } from 'lucide-react';

export const ConnectionStats = () => {
  const { getAllConnections } = useConnectionStore();
  const connections = getAllConnections();
  
  const stats = {
    total: connections.length,
    pending: connections.filter(c => c.status === 'pending').length,
    connected: connections.filter(c => c.status === 'connected').length,
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Total Connections</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.total}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Pending</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.pending}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Connected</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.connected}</p>
      </div>
    </div>
  );
};
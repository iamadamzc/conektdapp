import React from 'react';
import { Button } from '@/components/ui/button';
import { useOutlookStore } from '@/stores/outlook-store';

export const SettingsPage = () => {
  const { syncContacts, isLoading } = useOutlookStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Microsoft Integration</h3>
              <p className="text-sm text-gray-500 mb-4">
                Configure how Conektd syncs with your Microsoft account.
              </p>
              <Button
                variant="secondary"
                onClick={() => syncContacts()}
                disabled={isLoading}
              >
                {isLoading ? 'Syncing...' : 'Sync Outlook Data'}
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Data Management</h3>
              <p className="text-sm text-gray-500 mb-4">
                Control how your data is stored and managed within Conektd.
              </p>
              <Button variant="outline">Export Connections</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Button } from '@/components/ui/button';
import { useOutlookStore } from '@/stores/outlook-store';
import { LogIn, UserPlus } from 'lucide-react';

export const MicrosoftLogin = () => {
  const { login, loginWithDifferentAccount, isLoading } = useOutlookStore();

  return (
    <div className="text-center space-y-6 max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome to Conektd</h2>
        <p className="text-gray-600">
          Connect your Microsoft account to sync your Outlook contacts and calendar events.
        </p>
      </div>
      
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => login()}
          disabled={isLoading}
        >
          <LogIn className="mr-2 h-5 w-5" />
          {isLoading ? 'Connecting...' : 'Connect Microsoft Account'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => loginWithDifferentAccount()}
          disabled={isLoading}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Use Different Account
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        By connecting, you agree to allow Conektd to access your Outlook calendar and contacts.
      </p>
    </div>
  );
};
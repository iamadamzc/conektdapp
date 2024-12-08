import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOutlookStore } from '@/stores/outlook-store';

export const MicrosoftLogin = () => {
  const { login, isLoading } = useOutlookStore();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await login();
    } catch (err: any) {
      if (err.errorCode === 'popup_window_error') {
        setError('Please allow popups for this site to login with Microsoft');
      } else {
        setError('Failed to connect to Microsoft. Please try again.');
      }
    }
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Connect Your Microsoft Account</h2>
      <p className="text-gray-600">Connect your Microsoft account to sync your Outlook contacts and calendar events.</p>
      
      <Button
        variant="primary"
        size="lg"
        className="w-full max-w-sm"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Connect Microsoft Account'}
      </Button>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Button } from '../../components/ui/button';
import { useOutlookStore } from '../../stores/outlook-store';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';

export const MicrosoftLogin = () => {
  const { login, loginWithDifferentAccount, isLoading, error, clearError } = useOutlookStore();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
    }
  };

  const handleDifferentAccount = async () => {
    try {
      await loginWithDifferentAccount();
    } catch (error) {
      // Error is handled by the store
      console.error('Login with different account failed:', error);
    }
  };

  return (
    <div className="text-center space-y-6 max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome to Conektd</h2>
        <p className="text-gray-600">
          Connect your Microsoft account to sync your Outlook contacts and calendar events.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2" onClick={clearError}>
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full relative"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Connect Microsoft Account
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleDifferentAccount}
          disabled={isLoading}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Use Different Account
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        By connecting, you agree to allow Conektd to access your Outlook calendar and contacts.
        Your data will be used only to suggest LinkedIn connections.
      </p>
    </div>
  );
};

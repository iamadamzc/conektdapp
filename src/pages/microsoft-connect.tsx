import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MicrosoftLogin } from '@/components/auth/microsoft-login';
import { Link2 } from 'lucide-react';

export const MicrosoftConnectPage = () => {
  const navigate = useNavigate();

  const handleMicrosoftSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Link2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Microsoft Account</h1>
          <p className="text-gray-600">
            Link your Microsoft account to sync your Outlook contacts and calendar
          </p>
        </div>

        <MicrosoftLogin onSuccess={handleMicrosoftSuccess} />
      </div>
    </div>
  );
};
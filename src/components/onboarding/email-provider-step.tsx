import React from 'react';
import { GmailLogin } from '../auth/gmail-login';
import { MicrosoftLogin } from '../auth/microsoft-login';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const EmailProviderStep = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Connect Email Provider</h2>
        <p className="text-gray-600">
          Choose your email provider to sync contacts and calendar
        </p>
      </div>

      <Tabs defaultValue="gmail" className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="gmail" className="flex-1">Gmail</TabsTrigger>
          <TabsTrigger value="microsoft" className="flex-1">Microsoft</TabsTrigger>
        </TabsList>

        <TabsContent value="gmail" className="space-y-4">
          <p className="text-sm text-gray-500">
            Connect your Gmail account to sync your contacts and calendar events.
          </p>
          <GmailLogin />
        </TabsContent>

        <TabsContent value="microsoft" className="space-y-4">
          <p className="text-sm text-gray-500">
            Connect your Microsoft account to sync your contacts and calendar events.
          </p>
          <MicrosoftLogin />
        </TabsContent>
      </Tabs>
    </div>
  );
};
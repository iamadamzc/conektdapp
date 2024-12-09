import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { GmailLogin } from '@/components/auth/gmail-login';
import { MicrosoftLogin } from '@/components/auth/microsoft-login';
import { useEmailStore } from '@/stores/email-store';
import { RefreshCw } from 'lucide-react';

export const SettingsPage = () => {
  const { provider, isLoading, syncData } = useEmailStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and email integration settings"
      />

      <Card>
        <CardHeader>
          <CardTitle>Email Integration</CardTitle>
        </CardHeader>
        
        <Tabs defaultValue="microsoft" className="p-6">
          <TabsList className="mb-4">
            <TabsTrigger value="microsoft">Microsoft Outlook</TabsTrigger>
            <TabsTrigger value="gmail">Gmail</TabsTrigger>
          </TabsList>

          <TabsContent value="microsoft">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Connect your Microsoft Outlook account to sync contacts and calendar events.
              </p>
              <MicrosoftLogin />
              {provider === 'microsoft' && (
                <Button
                  variant="outline"
                  onClick={syncData}
                  disabled={isLoading}
                  className="w-full"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Syncing...' : 'Sync Now'}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gmail">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Connect your Gmail account to sync contacts and calendar events.
              </p>
              <GmailLogin />
              {provider === 'gmail' && (
                <Button
                  variant="outline"
                  onClick={syncData}
                  disabled={isLoading}
                  className="w-full"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Syncing...' : 'Sync Now'}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
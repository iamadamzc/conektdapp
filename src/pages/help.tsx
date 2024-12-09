import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export const HelpPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Support"
        description="Get help with using Conektd"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Mail className="h-6 w-6 text-blue-600" />
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <p className="text-sm text-gray-500">
            Need help? Our support team is here to assist you.
          </p>
          <Button className="mt-4">
            Send Email
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <p className="text-sm text-gray-500">
            Find answers to commonly asked questions.
          </p>
          <Button variant="outline" className="mt-4">
            View FAQs
          </Button>
        </Card>
      </div>
    </div>
  );
};
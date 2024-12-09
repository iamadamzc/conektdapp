import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';

export const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="View your upcoming meetings and events"
      />

      <Card className="text-center">
        <div className="flex items-center justify-center">
          <CalendarIcon className="h-12 w-12 text-gray-400" />
        </div>
        <p className="mt-4 text-gray-500">
          Calendar integration coming soon
        </p>
      </Card>
    </div>
  );
};
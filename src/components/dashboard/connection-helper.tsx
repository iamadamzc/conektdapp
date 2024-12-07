import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConnectionHelperProps {
  connection: {
    name: string;
    email: string;
    event: string;
  } | null;
  isVisible: boolean;
}

export const ConnectionHelper: React.FC<ConnectionHelperProps> = ({
  connection,
  isVisible
}) => {
  if (!isVisible || !connection) return null;

  const messageTemplate = `Hi ${connection.name}, \n\nIt was great meeting you at ${connection.event}. I'd love to stay connected and explore potential collaborations.\n\nBest regards`;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageTemplate);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div className={cn(
      'fixed right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200',
      'animate-in slide-in-from-right-2 duration-300'
    )}>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Connect with {connection.name}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="relative rounded bg-gray-50 p-2">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {messageTemplate}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-1 top-1 h-6 w-6 p-0"
              onClick={copyMessage}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <ol className="ml-4 list-decimal text-xs text-gray-600 space-y-1">
            <li>Click the "Connect" button on LinkedIn</li>
            <li>Choose "Add a note"</li>
            <li>Paste the message above</li>
            <li>Send the request</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
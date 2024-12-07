import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionPanelProps {
  connection: {
    name: string;
    email: string;
    event: string;
    date: string;
  };
}

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  connection,
}) => {
  const [message, setMessage] = useState(
    `Hi ${connection.name},\n\nIt was great meeting you at ${connection.event}. I'd love to stay connected and explore potential collaborations.\n\nBest regards`
  );
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Connect with {connection.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Met at {connection.event} on {connection.date}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Customize your connection message and copy</h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center min-w-[80px] justify-center shadow-sm"
                onClick={copyMessage}
              >
                {copied ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-0 text-sm text-gray-700 font-sans resize-none focus:ring-0 focus:outline-none"
                rows={6}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Next Steps</h3>
            <ol className="ml-4 list-decimal text-sm text-gray-600 space-y-2">
              <li>Click on Connect</li>
              <li>Click "Add a note"</li>
              <li>Paste your message</li>
              <li>Click Send</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
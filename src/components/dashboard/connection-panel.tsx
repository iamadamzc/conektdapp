import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConnectionStore, ConnectionStatus } from '@/stores/connection-store';
import { cn } from '@/lib/utils';

interface ConnectionPanelProps {
  connection: {
    id: string;
    name: string;
    email: string;
    event: string;
    date: string;
  };
  onNext: () => void;
  onBack: () => void;
}

const statusConfig = {
  not_connected: { label: 'Not Connected', color: 'bg-gray-100 text-gray-700' },
  pending: { label: 'Request Sent', color: 'bg-blue-100 text-blue-700' },
  connected: { label: 'Connected', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'No Response', color: 'bg-red-100 text-red-700' },
};

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  connection,
  onNext,
  onBack,
}) => {
  const { getConnection, updateStatus } = useConnectionStore();
  const savedConnection = getConnection(connection.id);
  const [message, setMessage] = useState(
    `Hi ${connection.name},\n\nIt was great meeting you at ${connection.event}. I'd love to stay connected and explore potential collaborations.\n\nBest regards`
  );
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState(savedConnection?.notes || '');

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleStatusUpdate = (status: ConnectionStatus) => {
    updateStatus(connection.id, status, notes);
    if (status === 'connected' || status === 'rejected') {
      onNext(); // Automatically move to next connection
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Connect with {connection.name}</h2>
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              statusConfig[savedConnection?.status || 'not_connected'].color
            )}>
              {statusConfig[savedConnection?.status || 'not_connected'].label}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Met at {connection.event} on {connection.date}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Connection message</h3>
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
            <h3 className="text-sm font-medium text-gray-900 mb-3">Notes</h3>
            <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this connection..."
                className="w-full bg-transparent border-0 text-sm text-gray-700 font-sans resize-none focus:ring-0 focus:outline-none"
                rows={3}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate('pending')}
                className={cn(savedConnection?.status === 'pending' && 'bg-blue-50')}
              >
                Request Sent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate('connected')}
                className={cn(savedConnection?.status === 'connected' && 'bg-green-50')}
              >
                Connected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate('rejected')}
                className={cn(savedConnection?.status === 'rejected' && 'bg-red-50')}
              >
                No Response
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { gmailService } from '@/lib/services/gmail-service';
import { useEmailStore } from '@/stores/email-store';
import { useToast } from '@/lib/hooks/use-toast';
import { GMAIL_CONFIG } from '@/lib/gmail-config';
import { useAuthStore } from '@/stores/auth-store';

export const GmailLogin = () => {
  const { setProvider, syncData } = useEmailStore();
  const { addToast } = useToast();
  const { clearAuthState } = useAuthStore();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Clear any existing auth state before initializing Gmail
        clearAuthState();
        
        await gmailService.initialize(response.access_token);
        await setProvider('gmail');
        await syncData();
        
        addToast({
          title: 'Success',
          description: 'Gmail account connected successfully',
          type: 'success'
        });
      } catch (error) {
        console.error('Gmail login failed:', error);
        addToast({
          title: 'Error',
          description: 'Failed to connect Gmail account',
          type: 'error'
        });
      }
    },
    onError: () => {
      console.error('Gmail login failed');
      addToast({
        title: 'Error',
        description: 'Failed to connect Gmail account',
        type: 'error'
      });
    },
    scope: GMAIL_CONFIG.scopes.join(' '),
    flow: 'implicit'
  });

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => login()}
    >
      <Mail className="mr-2 h-5 w-5" />
      Connect Gmail Account
    </Button>
  );
};
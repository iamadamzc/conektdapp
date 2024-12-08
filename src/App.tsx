import React, { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { ConnectionList } from '@/components/dashboard/connection-list';
import { Linkedin } from 'lucide-react';
import { MicrosoftLogin } from '@/components/auth/microsoft-login';
import { useOutlookStore } from '@/stores/outlook-store';
import { graphService } from '@/lib/graph';

function App() {
  const { isAuthenticated, setAuthenticated } = useOutlookStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await graphService.initialize();
        const account = await graphService.handleRedirectPromise();
        if (account) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
      }
    };

    initializeAuth();
  }, [setAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {!isAuthenticated ? (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <MicrosoftLogin />
        </div>
      ) : (
        <div className="flex">
          {/* LinkedIn Window Area */}
          <div className="fixed left-0 top-16 w-1/2 h-[calc(100vh-4rem)] bg-gray-100 flex items-center justify-center">
            <div className="text-center p-6">
              <Linkedin className="h-16 w-16 text-[#0A66C2] mx-auto mb-4" />
              <p className="text-lg text-gray-600">
                LinkedIn search will open here
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="fixed right-0 top-16 w-1/2 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-8">
              <ConnectionList />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
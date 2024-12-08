import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth-store';
import { OnboardingPage } from './pages/onboarding';
import { DashboardPage } from './pages/dashboard';
import { SettingsPage } from './pages/settings';
import { MicrosoftConnectPage } from './pages/microsoft-connect';
import { Header } from './components/layout/header';
import { Navigation } from './components/layout/navigation';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Header />}
        
        {/* Main Content */}
        <div className="flex flex-col min-h-screen">
          {isAuthenticated && (
            <div className="border-b border-gray-200 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Navigation />
              </div>
            </div>
          )}

          <Routes>
            {!isAuthenticated ? (
              // Public routes (unauthenticated)
              <>
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/connect-microsoft" element={<MicrosoftConnectPage />} />
                {/* Redirect all other routes to onboarding */}
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
              </>
            ) : (
              // Protected routes (authenticated)
              <>
                {/* Dashboard as home page */}
                <Route path="/" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* Redirect all other routes to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

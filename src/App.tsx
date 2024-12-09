import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth-store';
import { RootLayout } from './components/layout/root-layout';
import { OnboardingPage } from './pages/onboarding';
import { DashboardPage } from './pages/dashboard';
import { ConnectionsPage } from './pages/connections';
import { CalendarPage } from './pages/calendar';
import { SettingsPage } from './pages/settings';
import { HelpPage } from './pages/help';
import { MicrosoftConnectPage } from './pages/microsoft-connect';

function App() {
  const { isAuthenticated, clearAuthState } = useAuthStore();

  // Clear auth state on initial load
  useEffect(() => {
    clearAuthState();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/connect-microsoft" element={<MicrosoftConnectPage />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <Route element={<RootLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage", // Changed from sessionStorage for persistence
    storeAuthStateInCookie: true, // Enable cookies for IE11 support
  },
  system: {
    allowNativeBroker: false,
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    asyncPopups: false,
    tokenRenewalOffsetSeconds: 300 // Refresh token 5 minutes before expiry
  }
};

export const loginRequest = {
  scopes: [
    'User.Read',
    'Calendars.Read',
    'Mail.Read',
    'Contacts.Read', // Added Contacts.Read scope
    'offline_access'
  ],
};

// Add error handling configuration
export const msalErrorConfig = {
  maxRetries: 3,
  retryDelay: 1000, // milliseconds
  errorMessages: {
    auth: 'Authentication failed. Please try again.',
    token: 'Session expired. Please log in again.',
    graph: 'Failed to fetch data from Microsoft services.',
    network: 'Network error. Please check your connection.'
  }
};

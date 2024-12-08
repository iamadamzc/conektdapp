export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    asyncPopups: false
  }
};

export const loginRequest = {
  scopes: [
    'User.Read',
    'Calendars.Read',
    'Mail.Read',
    'offline_access'
  ],
};
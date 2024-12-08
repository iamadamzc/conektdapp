import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { loginRequest, msalConfig, msalErrorConfig } from "./auth-config";

// Utility for implementing retry logic
const retry = async (fn: () => Promise<any>, retries = msalErrorConfig.maxRetries) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && !isAuthError(error)) {
      await new Promise(resolve => setTimeout(resolve, msalErrorConfig.retryDelay));
      return retry(fn, retries - 1);
    }
    throw error;
  }
};

const isAuthError = (error: any): boolean => {
  return error instanceof InteractionRequiredAuthError || 
         (error?.response?.status === 401) ||
         (error?.message?.includes('token'));
};

export class GraphService {
  private static instance: GraphService;
  private msalInstance: PublicClientApplication;
  private graphClient: Client | null = null;
  private tokenExpirationTimer: number | null = null;

  private constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
    this.initialize().catch(console.error);
  }

  static getInstance(): GraphService {
    if (!GraphService.instance) {
      GraphService.instance = new GraphService();
    }
    return GraphService.instance;
  }

  async initialize() {
    try {
      await this.msalInstance.initialize();
      await this.handleRedirectPromise();
      
      // Try to silently acquire token if user was previously logged in
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await this.setGraphClient(accounts[0]);
      }
    } catch (error) {
      console.error("Error during initialization:", error);
      // Non-blocking error - don't throw
    }
  }

  async login() {
    try {
      const loginResponse = await this.msalInstance.loginPopup({
        ...loginRequest,
        prompt: 'select_account'
      });
      
      if (loginResponse) {
        await this.setGraphClient(loginResponse.account);
        return loginResponse.account;
      }
      throw new Error(msalErrorConfig.errorMessages.auth);
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error(
        error instanceof InteractionRequiredAuthError
          ? msalErrorConfig.errorMessages.token
          : msalErrorConfig.errorMessages.auth
      );
    }
  }

  async loginWithDifferentAccount() {
    try {
      await this.msalInstance.clearCache();
      this.clearTokenExpirationTimer();
      
      const loginResponse = await this.msalInstance.loginPopup({
        ...loginRequest,
        prompt: 'select_account'
      });
      
      if (loginResponse) {
        await this.setGraphClient(loginResponse.account);
        return loginResponse.account;
      }
      throw new Error(msalErrorConfig.errorMessages.auth);
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error(msalErrorConfig.errorMessages.auth);
    }
  }

  private clearTokenExpirationTimer() {
    if (this.tokenExpirationTimer !== null) {
      window.clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  async handleRedirectPromise() {
    try {
      const response = await this.msalInstance.handleRedirectPromise();
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await this.setGraphClient(accounts[0]);
        return accounts[0];
      }
      return null;
    } catch (error) {
      console.error("Error handling redirect:", error);
      throw new Error(msalErrorConfig.errorMessages.auth);
    }
  }

  private async setGraphClient(account: AccountInfo) {
    try {
      // Acquire token silently first
      const token = await this.msalInstance.acquireTokenSilent({
        ...loginRequest,
        account
      });

      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
        this.msalInstance,
        {
          account,
          scopes: loginRequest.scopes,
          interactionType: InteractionType.Popup
        }
      );

      this.graphClient = Client.initWithMiddleware({ authProvider });

      // Set up token refresh
      if (token.expiresOn) {
        const expiresIn = token.expiresOn.getTime() - Date.now() - (msalConfig.system.tokenRenewalOffsetSeconds * 1000);
        this.clearTokenExpirationTimer();
        this.tokenExpirationTimer = window.setTimeout(async () => {
          try {
            await this.msalInstance.acquireTokenSilent({
              ...loginRequest,
              account
            });
          } catch (error) {
            console.error("Error refreshing token:", error);
            // Token refresh failed, user needs to re-authenticate
            throw new Error(msalErrorConfig.errorMessages.token);
          }
        }, expiresIn);
      }
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Token expired or requires interaction
        throw new Error(msalErrorConfig.errorMessages.token);
      }
      throw error;
    }
  }

  async getCalendarEvents(startDate: Date, endDate: Date) {
    if (!this.graphClient) {
      throw new Error("Graph client not initialized");
    }

    return retry(async () => {
      try {
        const response = await this.graphClient!
          .api("/me/calendarView")
          .query({
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString(),
          })
          .select("subject,start,end,attendees")
          .orderby("start/dateTime")
          .get();

        return response.value;
      } catch (error) {
        if (isAuthError(error)) {
          throw error; // Let retry handle auth errors differently
        }
        console.error("Error fetching calendar events:", error);
        throw new Error(msalErrorConfig.errorMessages.graph);
      }
    });
  }

  async getEmailContacts(days: number = 30) {
    if (!this.graphClient) {
      throw new Error("Graph client not initialized");
    }

    return retry(async () => {
      try {
        const date = new Date();
        date.setDate(date.getDate() - days);

        const response = await this.graphClient!
          .api("/me/messages")
          .query({
            $filter: `receivedDateTime ge ${date.toISOString()}`,
          })
          .select("subject,from,toRecipients,ccRecipients,receivedDateTime")
          .orderby("receivedDateTime desc")
          .get();

        return response.value;
      } catch (error) {
        if (isAuthError(error)) {
          throw error; // Let retry handle auth errors differently
        }
        console.error("Error fetching email contacts:", error);
        throw new Error(msalErrorConfig.errorMessages.graph);
      }
    });
  }

  // New method to get direct contacts
  async getContacts() {
    if (!this.graphClient) {
      throw new Error("Graph client not initialized");
    }

    return retry(async () => {
      try {
        const response = await this.graphClient!
          .api("/me/contacts")
          .select("displayName,emailAddresses,companyName")
          .orderby("displayName")
          .get();

        return response.value;
      } catch (error) {
        if (isAuthError(error)) {
          throw error;
        }
        console.error("Error fetching contacts:", error);
        throw new Error(msalErrorConfig.errorMessages.graph);
      }
    });
  }
}

export const graphService = GraphService.getInstance();

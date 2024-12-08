import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest, msalConfig } from "./auth-config";

export class GraphService {
  private static instance: GraphService;
  private msalInstance: PublicClientApplication;
  private graphClient: Client | null = null;

  private constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  static getInstance(): GraphService {
    if (!GraphService.instance) {
      GraphService.instance = new GraphService();
    }
    return GraphService.instance;
  }

  async initialize() {
    await this.msalInstance.initialize();
    await this.handleRedirectPromise();
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
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async loginWithDifferentAccount() {
    try {
      // Clear cache before login to ensure fresh login
      await this.msalInstance.clearCache();
      const loginResponse = await this.msalInstance.loginPopup({
        ...loginRequest,
        prompt: 'select_account'
      });
      
      if (loginResponse) {
        await this.setGraphClient(loginResponse.account);
        return loginResponse.account;
      }
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async handleRedirectPromise() {
    try {
      await this.msalInstance.handleRedirectPromise();
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await this.setGraphClient(accounts[0]);
        return accounts[0];
      }
      return null;
    } catch (error) {
      console.error("Error handling redirect:", error);
      throw error;
    }
  }

  private async setGraphClient(account: AccountInfo) {
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalInstance,
      {
        account,
        scopes: loginRequest.scopes,
        interactionType: "popup"
      }
    );

    this.graphClient = Client.initWithMiddleware({ authProvider });
  }

  async getCalendarEvents(startDate: Date, endDate: Date) {
    if (!this.graphClient) throw new Error("Graph client not initialized");

    try {
      const response = await this.graphClient
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
      console.error("Error fetching calendar events:", error);
      throw error;
    }
  }

  async getEmailContacts(days: number = 30) {
    if (!this.graphClient) throw new Error("Graph client not initialized");

    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      const response = await this.graphClient
        .api("/me/messages")
        .query({
          $filter: `receivedDateTime ge ${date.toISOString()}`,
        })
        .select("subject,from,toRecipients,ccRecipients,receivedDateTime")
        .orderby("receivedDateTime desc")
        .get();

      return response.value;
    } catch (error) {
      console.error("Error fetching email contacts:", error);
      throw error;
    }
  }
}

export const graphService = GraphService.getInstance();
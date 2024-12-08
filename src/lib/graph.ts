import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
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
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      await this.setGraphClient(accounts[0]);
    }
  }

  async login() {
    try {
      const response = await this.msalInstance.loginPopup(loginRequest);
      if (response?.account) {
        await this.setGraphClient(response.account);
        return response.account;
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async handleRedirectPromise() {
    try {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await this.setGraphClient(accounts[0]);
        return accounts[0];
      }
      return null;
    } catch (error) {
      console.error("Error handling auth state:", error);
      throw error;
    }
  }

  private async setGraphClient(account: AccountInfo) {
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalInstance,
      {
        account,
        scopes: loginRequest.scopes,
        interactionType: "popup",
      }
    );

    this.graphClient = Client.initWithMiddleware({ authProvider });
  }

  async getCalendarEvents(startDate: Date, endDate: Date) {
    if (!this.graphClient) throw new Error("Graph client not initialized");

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
  }

  async getEmailContacts(days: number = 30) {
    if (!this.graphClient) throw new Error("Graph client not initialized");

    const date = new Date();
    date.setDate(date.getDate() - days);

    const response = await this.graphClient
      .api("/me/messages")
      .query({
        $filter: `receivedDateTime ge ${date.toISOString()}`,
      })
      .select("subject,from,toRecipients,ccRecipients")
      .orderby("receivedDateTime desc")
      .get();

    return response.value;
  }
}

export const graphService = GraphService.getInstance();
import NuramaClient from '../NuramaClient.js';

export interface GetBalanceResponse {
  /** Total spendable balance — sum of planBalance + purchasedBalance. */
  balance: number;
  /**
   * Plan-granted credits for the current billing cycle. Refreshed (SET, not
   * added) on every Stripe renewal. Unspent plan credits do NOT carry over.
   */
  planBalance: number;
  /**
   * Purchased credits — accumulated from one-off top-ups, auto-top-ups, admin
   * grants. Carries over indefinitely.
   */
  purchasedBalance: number;
  /**
   * True when the workspace has at least one prior manual top-up
   * (`subscriptionGrant` order). Powers the FE auto-top-up enable gate —
   * users must top up manually once before auto top-up can be enabled.
   */
  hasPriorTopUp?: boolean;
}

export interface UsageReportParams {
  /** ISO date string. Server defaults to 30 days ago when omitted. */
  startDate?: string;
  /** ISO date string. Server defaults to "now" when omitted. */
  endDate?: string;
  /** Narrow the per-integration breakdown to a single user's calls. */
  userId?: string;
  /** Narrow the per-user breakdown to a single integration point. */
  integrationPoint?: string;
}

export interface UsageReportUserRow {
  userId: string;
  displayName: string | null;
  avatar: unknown | null;
  color: string | null;
  billedCredits: number;
  callCount: number;
}

export interface UsageReportIntegrationRow {
  integrationPoint: string;
  billedCredits: number;
  callCount: number;
}

export interface UsageReportResponse {
  total: {
    billedCredits: number;
    callCount: number;
    tokensIn: number;
    tokensOut: number;
  };
  byUser: UsageReportUserRow[];
  byIntegration: UsageReportIntegrationRow[];
  filters: {
    startDate: string;
    endDate: string;
    userId: string | null;
    integrationPoint: string | null;
  };
}

/**
 * Service-agnostic Nurama Credit balance + usage endpoints.
 *
 * The `/v1/credits/*` route shape and SDK namespace are deliberately
 * decoupled from any single service's naming so future services (convos,
 * etc.) can draw from the same balance without callers having to know
 * where the spend originated. Today the metered data is AI-only because
 * AI is the only service that's metered, but the contract is stable.
 */
export default function createCreditsMethods(client: NuramaClient) {
  return {
    /**
     * Get the workspace's spendable credit balance.
     */
    async getBalance(workspaceId: string): Promise<GetBalanceResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/credits/balance?workspaceId=${encodeURIComponent(workspaceId)}`,
        method: 'GET',
        sendJWT: true,
      });
    },

    /**
     * Get the workspace's credit usage report. Same shape as the AI usage
     * report — today the data is AI-only because AI is the only service
     * that's metered.
     */
    async getUsageReport(
      workspaceId: string,
      params: UsageReportParams = {},
    ): Promise<UsageReportResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      const query = new URLSearchParams({ workspaceId });
      if (params.startDate) query.set('startDate', params.startDate);
      if (params.endDate) query.set('endDate', params.endDate);
      if (params.userId) query.set('userId', params.userId);
      if (params.integrationPoint) query.set('integrationPoint', params.integrationPoint);
      return client._request({
        endpoint: `/v1/credits/usage?${query.toString()}`,
        method: 'GET',
        sendJWT: true,
      });
    },
  };
}

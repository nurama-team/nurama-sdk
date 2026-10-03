import NuramaClient from '../NuramaClient.js';
import { type Subscription } from '@nurama/types'; // Import Subscription type

// --- Common Interfaces (Should be shared) ---
export interface SortParams {
    sort?: Record<string, 1 | -1>;
}

export type SubscriptionStatus = 'active' | 'pending' | 'canceled' | 'expired' | 'pastDue' | 'paused' | 'paymentFailed' | 'unpaid';

/**
 * Soft warnings returned by a plan swap / dry-run. STRUCTURED (not localized
 * strings) so the multi-lingual FE renders the copy from these values.
 */
export type PlanChangeWarning =
  | { type: 'capabilityRemoved'; capability: string }
  | {
      type: 'seatMigration';
      currentSeats: number;
      unitPrice: number | null;
      total: number | null;
      currency: string;
      period: 'month' | 'year';
    };

// --- Query Parameter Interfaces ---
export interface GetSubscriptionsParams extends SortParams {
    status?: SubscriptionStatus;
    limit?: number;
    page?: number;
}

export interface CreateWorkspaceOrderParams {
    productId: string;
    quantity: number;
    /**
     * Customer-chosen purchase amount in the subscription's currency MINOR
     * unit (pence for GBP, cents for USD, yen for JPY, etc.). Required for
     * variable-amount products (currently only the AI add-on, `productType:
     * 'enableAi'`). Server enforces a per-currency minimum.
     */
    amountInMinor?: number;
}

export interface GetSubscriptionOrdersParams {
    limit?: number;
    page?: number;
    sortBy?: string;
}

// --- Response Interfaces (based on YAML and tests) ---
// Subscription type is imported from nurama-types

// Keep local definitions for these as they are not in nurama-types
export interface ResourceLimits {
    totalStorageInBytes: number;
    totalSeats: number;
    totalCredits: number;
}

export interface SeatUsage {
    totalSeats: number;
    usedSeats: number;
    availableSeats: number;
}

export interface RoleSeatUsage {
    /** Distinct users occupying this seat type across the workspace + projects. */
    used: number;
    /** Plan cap for this seat type, or `null` when the plan is unlimited for it. */
    limit: number | null;
}

export interface RoleUsage {
    creators: RoleSeatUsage;
    reviewers: RoleSeatUsage;
}

export interface StorageUsage {
    totalStorageInBytes: number;
    usedStorageInBytes: number;
    availableStorageInBytes: number;
}

// --- Method Definitions ---

/**
 * Defines subscription-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the subscription-related methods.
 */
export default function createSubscriptionMethods(client: NuramaClient) {
  return {
    /**
         * Retrieves the active subscription for a specific workspace.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @returns {Promise<Subscription>} The workspace subscription object.
         */
    async getWorkspaceSubscription(workspaceId: string): Promise<Subscription> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request<Subscription>({
        method: 'GET',
        endpoint: `/v1/subscriptions/workspace/${workspaceId}`,
        sendJWT: true,
      });
    },

    /**
         * Cancels the subscription for a specific workspace.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @returns {Promise<any>} The cancellation response.
         */
    async cancelWorkspaceSubscription(workspaceId: string): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request<any>({
        method: 'DELETE',
        endpoint: `/v1/subscriptions/workspace/${workspaceId}`,
        sendJWT: true,
      });
    },

    /**
     * Reverse a scheduled (period-end) cancellation, keeping the workspace's
     * subscription on its normal renewal cycle. Only valid while the
     * subscription is still active with a pending cancellation; a fully
     * lapsed subscription can't be resumed (the owner must re-subscribe).
     * Requires authentication and permission.
     * @param {string} workspaceId - The ID of the workspace.
     * @returns {Promise<any>} The resume response.
     */
    async resumeWorkspaceSubscription(workspaceId: string): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request<any>({
        method: 'POST',
        endpoint: `/v1/subscriptions/workspace/${workspaceId}/resume`,
        sendJWT: true,
      });
    },

    /**
     * Swap the workspace's active basePlan line for a different basePlan product.
     * Same code path both upgrades and downgrades; the API's pre-flight
     * capacity check is what distinguishes a permitted change from a refused
     * one. Pass `dryRun: true` to get the pre-flight verdict without mutating.
     *
     * On over-allocation the API returns 400 `planCapacityInsufficient` with
     * `errorData.violations: [{ resource, current, newLimit }]`, surfaced via
     * the SDK's normal error path.
     *
     * On success, returns the updated subscription plus a `warnings[]` array
     * of feature-gate capabilities the destination plan does NOT include (the
     * FE renders these as a confirmation notice).
     */
    async swapWorkspacePlan(workspaceId: string, params: {
      newProductId: string;
      currency: string;
      billingPeriod: 'month' | 'year';
      dryRun?: boolean;
    }): Promise<{ subscription: Subscription | null; warnings: PlanChangeWarning[] }> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!params.newProductId) throw new Error('newProductId is required.');
      if (!params.currency) throw new Error('currency is required.');
      if (!params.billingPeriod) throw new Error('billingPeriod is required.');
      return client._request<{ subscription: Subscription | null; warnings: PlanChangeWarning[] }>({
        method: 'PUT',
        endpoint: `/v1/subscriptions/workspace/${workspaceId}/plan`,
        body: params,
        sendJWT: true,
      });
    },

    /**
         * Retrieves subscription orders for a specific workspace.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @param {GetSubscriptionOrdersParams} [params] - Optional query parameters.
         * @returns {Promise<any[]>} An array of subscription order objects.
         */
    async getWorkspaceOrders(workspaceId: string, params?: GetSubscriptionOrdersParams): Promise<any[]> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request<any[]>({
        method: 'GET',
        endpoint: `/v1/subscriptions/workspace/${workspaceId}/orders`,
        params,
        sendJWT: true,
      });
    },

    /**
         * Creates a subscription order for a specific workspace.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @param {CreateWorkspaceOrderParams} orderData - The order data.
         * @returns {Promise<any>} The created order response.
         */
    async createWorkspaceOrder(workspaceId: string, orderData: CreateWorkspaceOrderParams): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!orderData.productId) throw new Error('productId is required.');
      if (typeof orderData.quantity !== 'number') throw new Error('quantity is required and must be a number.');
      
      return client._request<any>({
        method: 'POST',
        endpoint: `/v1/subscriptions/workspace/${workspaceId}/order`,
        body: orderData,
        sendJWT: true,
      });
    },

    /**
         * Retrieves all subscriptions owned by the currently authenticated user.
         * Requires authentication.
         * @param {GetSubscriptionsParams} [params] - Optional query parameters for status and sorting.
         * @returns {Promise<Subscription[]>} An array of subscription objects.
         */
    async getUserSubscriptions(params?: GetSubscriptionsParams): Promise<Subscription[]> {
      return client._request<Subscription[]>({
        method: 'GET',
        endpoint: '/v1/subscriptions/',
        params,
        sendJWT: true,
      });
    },

    /**
         * Retrieves the resource limits (e.g., storage, seats) for a specific resource (typically workspace).
         * Requires authentication.
         * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
         * @returns {Promise<ResourceLimits>} An object containing the resource limits.
         */
    async getResourceLimits(resourceId: string): Promise<ResourceLimits> {
      if (!resourceId) throw new Error('resourceId is required.');
      // Note: Backend route uses /limits/:resourceId, validation uses resourceId
      // Endpoint in test file is not hit for limits directly, assuming workspace ID based on context
      return client._request<ResourceLimits>({
        method: 'GET',
        endpoint: `/v1/subscriptions/limits/${resourceId}`, // Assuming resourceId here is workspaceId
        sendJWT: true,
      });
    },

    /**
         * Retrieves the seat usage for a specific resource (typically workspace).
         * Requires authentication.
         * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
         * @returns {Promise<SeatUsage>} An object containing seat usage details.
         */
    async getSeatUsage(resourceId: string): Promise<SeatUsage> {
      if (!resourceId) throw new Error('resourceId is required.');
      return client._request<SeatUsage>({
        method: 'GET',
        endpoint: `/v1/subscriptions/usage/seats/${resourceId}`, // Assuming resourceId here is workspaceId
        sendJWT: true,
      });
    },

    /**
         * Retrieves per-role (creator / reviewer) seat usage and caps for a
         * workspace. `limit` is `null` when the plan is unlimited for that
         * seat type. Requires authentication.
         * @param {string} resourceId - The workspace ID.
         * @returns {Promise<RoleUsage>} Creator- and reviewer-side seat usage.
         */
    async getRoleUsage(resourceId: string): Promise<RoleUsage> {
      if (!resourceId) throw new Error('resourceId is required.');
      return client._request<RoleUsage>({
        method: 'GET',
        endpoint: `/v1/subscriptions/usage/roles/${resourceId}`,
        sendJWT: true,
      });
    },

    /**
         * Retrieves the storage usage for a specific resource (typically workspace).
         * Requires authentication.
         * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
         * @returns {Promise<StorageUsage>} An object containing storage usage details.
         */
    async getStorageUsage(resourceId: string): Promise<StorageUsage> {
      if (!resourceId) throw new Error('resourceId is required.');
      return client._request<StorageUsage>({
        method: 'GET',
        endpoint: `/v1/subscriptions/usage/storage/${resourceId}`, // Assuming resourceId here is workspaceId
        sendJWT: true,
      });
    },

    /**
         * Retrieves the workspace usage summary (billable seats and storage used).
         * Requires authentication and subscription management permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @returns {Promise<{billableSeatCount: number; storageUsedInBytes: number}>} Usage summary.
         */
    async getWorkspaceUsageSummary(workspaceId: string): Promise<{
      billableSeatCount: number;
      storageUsedInBytes: number;
    }> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        method: 'GET',
        endpoint: `/v1/subscriptions/workspace/${workspaceId}/usage-summary`,
        sendJWT: true,
      });
    },
  };
} 
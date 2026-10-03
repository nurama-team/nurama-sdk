import NuramaClient from '../NuramaClient.js';
import { type Subscription } from '@nurama/types';
export interface SortParams {
    sort?: Record<string, 1 | -1>;
}
export type SubscriptionStatus = 'active' | 'pending' | 'canceled' | 'expired' | 'pastDue' | 'paused' | 'paymentFailed' | 'unpaid';
/**
 * Soft warnings returned by a plan swap / dry-run. STRUCTURED (not localized
 * strings) so the multi-lingual FE renders the copy from these values.
 */
export type PlanChangeWarning = {
    type: 'capabilityRemoved';
    capability: string;
} | {
    type: 'seatMigration';
    currentSeats: number;
    unitPrice: number | null;
    total: number | null;
    currency: string;
    period: 'month' | 'year';
};
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
/**
 * Defines subscription-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the subscription-related methods.
 */
export default function createSubscriptionMethods(client: NuramaClient): {
    /**
         * Retrieves the active subscription for a specific workspace.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @returns {Promise<Subscription>} The workspace subscription object.
         */
    getWorkspaceSubscription(workspaceId: string): Promise<Subscription>;
    /**
         * Cancels the subscription for a specific workspace.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @returns {Promise<any>} The cancellation response.
         */
    cancelWorkspaceSubscription(workspaceId: string): Promise<any>;
    /**
     * Reverse a scheduled (period-end) cancellation, keeping the workspace's
     * subscription on its normal renewal cycle. Only valid while the
     * subscription is still active with a pending cancellation; a fully
     * lapsed subscription can't be resumed (the owner must re-subscribe).
     * Requires authentication and permission.
     * @param {string} workspaceId - The ID of the workspace.
     * @returns {Promise<any>} The resume response.
     */
    resumeWorkspaceSubscription(workspaceId: string): Promise<any>;
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
    swapWorkspacePlan(workspaceId: string, params: {
        newProductId: string;
        currency: string;
        billingPeriod: "month" | "year";
        dryRun?: boolean;
    }): Promise<{
        subscription: Subscription | null;
        warnings: PlanChangeWarning[];
    }>;
    /**
         * Retrieves subscription orders for a specific workspace.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @param {GetSubscriptionOrdersParams} [params] - Optional query parameters.
         * @returns {Promise<any[]>} An array of subscription order objects.
         */
    getWorkspaceOrders(workspaceId: string, params?: GetSubscriptionOrdersParams): Promise<any[]>;
    /**
         * Creates a subscription order for a specific workspace.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @param {CreateWorkspaceOrderParams} orderData - The order data.
         * @returns {Promise<any>} The created order response.
         */
    createWorkspaceOrder(workspaceId: string, orderData: CreateWorkspaceOrderParams): Promise<any>;
    /**
         * Retrieves all subscriptions owned by the currently authenticated user.
         * Requires authentication.
         * @param {GetSubscriptionsParams} [params] - Optional query parameters for status and sorting.
         * @returns {Promise<Subscription[]>} An array of subscription objects.
         */
    getUserSubscriptions(params?: GetSubscriptionsParams): Promise<Subscription[]>;
    /**
         * Retrieves the resource limits (e.g., storage, seats) for a specific resource (typically workspace).
         * Requires authentication.
         * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
         * @returns {Promise<ResourceLimits>} An object containing the resource limits.
         */
    getResourceLimits(resourceId: string): Promise<ResourceLimits>;
    /**
         * Retrieves the seat usage for a specific resource (typically workspace).
         * Requires authentication.
         * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
         * @returns {Promise<SeatUsage>} An object containing seat usage details.
         */
    getSeatUsage(resourceId: string): Promise<SeatUsage>;
    /**
         * Retrieves per-role (creator / reviewer) seat usage and caps for a
         * workspace. `limit` is `null` when the plan is unlimited for that
         * seat type. Requires authentication.
         * @param {string} resourceId - The workspace ID.
         * @returns {Promise<RoleUsage>} Creator- and reviewer-side seat usage.
         */
    getRoleUsage(resourceId: string): Promise<RoleUsage>;
    /**
         * Retrieves the storage usage for a specific resource (typically workspace).
         * Requires authentication.
         * @param {string} resourceId - The ID of the resource (e.g., workspaceId).
         * @returns {Promise<StorageUsage>} An object containing storage usage details.
         */
    getStorageUsage(resourceId: string): Promise<StorageUsage>;
    /**
         * Retrieves the workspace usage summary (billable seats and storage used).
         * Requires authentication and subscription management permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @returns {Promise<{billableSeatCount: number; storageUsedInBytes: number}>} Usage summary.
         */
    getWorkspaceUsageSummary(workspaceId: string): Promise<{
        billableSeatCount: number;
        storageUsedInBytes: number;
    }>;
};
//# sourceMappingURL=subscription.d.ts.map
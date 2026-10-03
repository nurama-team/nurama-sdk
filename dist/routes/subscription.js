// --- Method Definitions ---
/**
 * Defines subscription-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the subscription-related methods.
 */
export default function createSubscriptionMethods(client) {
    return {
        /**
             * Retrieves the active subscription for a specific workspace.
             * Requires authentication and permission.
             * @param {string} workspaceId - The ID of the workspace.
             * @returns {Promise<Subscription>} The workspace subscription object.
             */
        async getWorkspaceSubscription(workspaceId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
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
        async cancelWorkspaceSubscription(workspaceId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
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
        async resumeWorkspaceSubscription(workspaceId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
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
        async swapWorkspacePlan(workspaceId, params) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!params.newProductId)
                throw new Error('newProductId is required.');
            if (!params.currency)
                throw new Error('currency is required.');
            if (!params.billingPeriod)
                throw new Error('billingPeriod is required.');
            return client._request({
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
        async getWorkspaceOrders(workspaceId, params) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
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
        async createWorkspaceOrder(workspaceId, orderData) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!orderData.productId)
                throw new Error('productId is required.');
            if (typeof orderData.quantity !== 'number')
                throw new Error('quantity is required and must be a number.');
            return client._request({
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
        async getUserSubscriptions(params) {
            return client._request({
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
        async getResourceLimits(resourceId) {
            if (!resourceId)
                throw new Error('resourceId is required.');
            // Note: Backend route uses /limits/:resourceId, validation uses resourceId
            // Endpoint in test file is not hit for limits directly, assuming workspace ID based on context
            return client._request({
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
        async getSeatUsage(resourceId) {
            if (!resourceId)
                throw new Error('resourceId is required.');
            return client._request({
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
        async getRoleUsage(resourceId) {
            if (!resourceId)
                throw new Error('resourceId is required.');
            return client._request({
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
        async getStorageUsage(resourceId) {
            if (!resourceId)
                throw new Error('resourceId is required.');
            return client._request({
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
        async getWorkspaceUsageSummary(workspaceId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/subscriptions/workspace/${workspaceId}/usage-summary`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=subscription.js.map
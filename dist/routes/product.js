/**
 * Defines product-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the product-related methods.
 */
export default function createProductMethods(client) {
    return {
        /**
         * Retrieves available products for a specific workspace, considering restrictions.
         * Requires authentication and permission.
         * @param {string} workspaceId - The ID of the workspace.
         * @param {GetWorkspaceProductsParams} [params] - Optional query parameters.
         * @returns {Promise<ProductResponse[]>} An array of available product objects.
         */
        async getWorkspaceProducts(workspaceId, params) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/products/workspace/${workspaceId}`,
                params,
                sendJWT: true,
            });
        },
        /**
         * List active starter-package "plans" available to the caller,
         * scoped by user-level restrictions but NOT bound to a workspace.
         * Used by the post-signup plan-selection overlay before any
         * workspace exists.
         * @returns {Promise<ProductResponse[]>} Active starter-package plans.
         */
        async listPlans() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/products/plans',
                sendJWT: true,
            });
        },
        /**
         * Suggested billing currency for the caller, derived server-side from
         * the CDN geo header. A *default* for the currency selector only — the
         * user can override. Falls back to `usd` with no geo header.
         */
        async getSuggestedCurrency() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/products/suggested-currency',
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=product.js.map
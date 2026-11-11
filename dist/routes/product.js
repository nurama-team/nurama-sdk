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
         * The base-plan catalogue. Works signed out: without a session it is the
         * public catalogue (active, unrestricted plans). With one it also has the
         * promo plans restricted to the caller (`restricted: true`) and leaves out
         * a Demo they've already used. Plans carry only their public fields —
         * no `restrictTo`, `notes` or payment-provider ids.
         * @returns {Promise<ProductResponse[]>} Base plans available to the caller.
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
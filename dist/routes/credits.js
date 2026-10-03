/**
 * Service-agnostic Nurama Credit balance + usage endpoints.
 *
 * The `/v1/credits/*` route shape and SDK namespace are deliberately
 * decoupled from any single service's naming so future services (convos,
 * etc.) can draw from the same balance without callers having to know
 * where the spend originated. Today the metered data is AI-only because
 * AI is the only service that's metered, but the contract is stable.
 */
export default function createCreditsMethods(client) {
    return {
        /**
         * Get the workspace's spendable credit balance.
         */
        async getBalance(workspaceId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
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
        async getUsageReport(workspaceId, params = {}) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            const query = new URLSearchParams({ workspaceId });
            if (params.startDate)
                query.set('startDate', params.startDate);
            if (params.endDate)
                query.set('endDate', params.endDate);
            if (params.userId)
                query.set('userId', params.userId);
            if (params.integrationPoint)
                query.set('integrationPoint', params.integrationPoint);
            return client._request({
                endpoint: `/v1/credits/usage?${query.toString()}`,
                method: 'GET',
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=credits.js.map
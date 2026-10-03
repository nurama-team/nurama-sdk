/**
 * Outbound webhook subscription management. Admin-gated server-side
 * by `canManageWebhooks`. All operations are workspace-scoped — there
 * is no app-owned surface here yet (Phase 3 / OAuth).
 */
export default function createWebhookMethods(client) {
    return {
        /**
         * Create a webhook subscription. The signing secret is in the
         * response's `secret` field — store it immediately, it cannot be
         * retrieved again.
         *
         * @requires `canManageWebhooks` on the workspace.
         */
        async createWebhook(workspaceId, data) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * List webhook subscriptions in a workspace. Secrets are never returned.
         *
         * @requires `canManageWebhooks` on the workspace.
         */
        async listWebhooks(workspaceId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks`,
                sendJWT: true,
                bypassCache: true,
            });
        },
        /**
         * Fetch a single webhook subscription by id.
         *
         * @requires `canManageWebhooks` on the workspace.
         */
        async getWebhook(workspaceId, webhookId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!webhookId)
                throw new Error('webhookId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}`,
                sendJWT: true,
                bypassCache: true,
            });
        },
        /**
         * Update a webhook subscription's url, event filter, or active state.
         *
         * @requires `canManageWebhooks` on the workspace.
         */
        async updateWebhook(workspaceId, webhookId, data) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!webhookId)
                throw new Error('webhookId is required.');
            return client._request({
                method: 'PATCH',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Delete a webhook subscription. In-flight deliveries continue to
         * the receiver until they exhaust retries; no new deliveries fire.
         *
         * @requires `canManageWebhooks` on the workspace.
         */
        async deleteWebhook(workspaceId, webhookId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!webhookId)
                throw new Error('webhookId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}`,
                sendJWT: true,
            });
        },
        /**
         * Generate a new HMAC signing secret for a subscription and return
         * it once. The old secret is invalidated immediately.
         *
         * @requires `canManageWebhooks` on the workspace.
         */
        async rotateWebhookSecret(workspaceId, webhookId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!webhookId)
                throw new Error('webhookId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/rotate-secret`,
                sendJWT: true,
            });
        },
        /**
         * Fire a synthetic `webhook.test` delivery to the subscription's
         * URL. The receiver gets a small payload they can use to verify
         * their HMAC + parsing setup. Returns immediately; check the
         * delivery log for the outcome.
         */
        async testWebhook(workspaceId, webhookId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!webhookId)
                throw new Error('webhookId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/test`,
                sendJWT: true,
            });
        },
        /**
         * Paginated list of delivery attempts for a webhook subscription.
         * Useful for diagnosing failures (HTTP status, response body snippet,
         * retry timing).
         *
         * @requires `canManageWebhooks` on the workspace.
         */
        async listWebhookDeliveries(workspaceId, webhookId, params = {}) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!webhookId)
                throw new Error('webhookId is required.');
            const search = new URLSearchParams();
            if (params.limit !== undefined)
                search.set('limit', String(params.limit));
            if (params.cursor !== undefined)
                search.set('cursor', params.cursor);
            if (params.status !== undefined)
                search.set('status', params.status);
            const qs = search.toString();
            return client._request({
                method: 'GET',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/deliveries${qs ? `?${qs}` : ''}`,
                sendJWT: true,
                bypassCache: true,
            });
        },
        /**
         * Re-fire a specific past delivery attempt. Useful for confirming a
         * receiver fix without waiting for the next real event.
         *
         * @requires `canManageWebhooks` on the workspace.
         */
        async replayWebhookDelivery(workspaceId, webhookId, attemptId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!webhookId)
                throw new Error('webhookId is required.');
            if (!attemptId)
                throw new Error('attemptId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/deliveries/${attemptId}/replay`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=webhook.js.map
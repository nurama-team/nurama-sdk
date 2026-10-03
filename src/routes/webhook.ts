import NuramaClient from '../NuramaClient.js';

/**
 * Wire-format webhook event names. Mirrors the backend's
 * `@config/webhookEvents` registry. New events land here and on the
 * backend together; the additive-only payload contract means receivers
 * pinned to a specific event name keep working as fields are added.
 */
export type WebhookEvent =
  | 'task.created'
  | 'task.updated'
  | 'task.deleted'
  | 'chat.message.created'
  | 'asset.published'
  | 'webhook.test';

export type WebhookSubscriptionStatus = 'active' | 'paused' | 'failedOut';

/**
 * Public shape of a webhook subscription. Never includes the signing
 * secret or the encrypted ciphertext — those are server-only fields.
 */
export interface WebhookSubscription {
  id: string;
  workspaceId: string;
  appId?: string | null;
  name: string;
  url: string;
  events: WebhookEvent[];
  status: WebhookSubscriptionStatus;
  failedOutAt?: string | null;
  failedOutReason?: string | null;
  /**
   * Optional expiration. When set and in the past, the worker stops
   * fanning new attempts to this subscription, and any in-flight
   * attempts DLQ with a clear reason rather than retrying. Null = no
   * expiry; the subscription delivers indefinitely until manually
   * paused or deleted.
   */
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  lastDeliveryAt?: string | null;
  lastSuccessAt?: string | null;
  lastFailureAt?: string | null;
}

export interface CreateWebhookData {
  name: string;
  url: string;
  events: WebhookEvent[];
  /** Optional ISO timestamp. Must be in the future when set. */
  expiresAt?: string | null;
}

export interface UpdateWebhookData {
  name?: string;
  url?: string;
  events?: WebhookEvent[];
  status?: 'active' | 'paused';
  /** Pass null to clear an existing expiry; pass a future ISO date to set / extend. */
  expiresAt?: string | null;
}

export interface CreateWebhookResponse {
  subscription: WebhookSubscription;
  /**
   * The HMAC signing secret. Returned ONLY here (and from
   * `rotateWebhookSecret`). The server keeps the ciphertext on the row
   * and cannot recover the plaintext later — the customer must capture
   * it now or rotate.
   */
  signingSecret: string;
}

export interface RotateWebhookSecretResponse extends CreateWebhookResponse {}

export type WebhookAttemptStatus = 'pending' | 'inflight' | 'succeeded' | 'failed' | 'dlq';

export interface WebhookAttempt {
  id: string;
  notificationId: string;
  subscriptionId: string;
  attempt: number;
  maxAttempts: number;
  status: WebhookAttemptStatus;
  signatureV1: string;
  scheduledAt: string;
  startedAt?: string | null;
  deliveredAt?: string | null;
  nextRetryAt?: string | null;
  responseCode?: number | null;
  responseBody?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseHeaders?: Record<string, any> | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListDeliveriesParams {
  limit?: number;
  cursor?: string;
  status?: WebhookAttemptStatus;
}

export interface ListDeliveriesResponse {
  items: WebhookAttempt[];
  nextCursor: string | null;
}

export interface TestWebhookResponse {
  queued: true;
  message: string;
}

/**
 * Outbound webhook subscription management. Admin-gated server-side
 * by `canManageWebhooks`. All operations are workspace-scoped — there
 * is no app-owned surface here yet (Phase 3 / OAuth).
 */
export default function createWebhookMethods(client: NuramaClient) {
  return {
    /**
     * Create a webhook subscription. The signing secret is in the
     * response's `secret` field — store it immediately, it cannot be
     * retrieved again.
     *
     * @requires `canManageWebhooks` on the workspace.
     */
    async createWebhook(
      workspaceId: string,
      data: CreateWebhookData,
    ): Promise<CreateWebhookResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request<CreateWebhookResponse>({
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
    async listWebhooks(workspaceId: string): Promise<WebhookSubscription[]> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request<WebhookSubscription[]>({
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
    async getWebhook(workspaceId: string, webhookId: string): Promise<WebhookSubscription> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!webhookId) throw new Error('webhookId is required.');
      return client._request<WebhookSubscription>({
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
    async updateWebhook(
      workspaceId: string,
      webhookId: string,
      data: UpdateWebhookData,
    ): Promise<WebhookSubscription> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!webhookId) throw new Error('webhookId is required.');
      return client._request<WebhookSubscription>({
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
    async deleteWebhook(workspaceId: string, webhookId: string): Promise<void> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!webhookId) throw new Error('webhookId is required.');
      return client._request<void>({
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
    async rotateWebhookSecret(
      workspaceId: string,
      webhookId: string,
    ): Promise<RotateWebhookSecretResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!webhookId) throw new Error('webhookId is required.');
      return client._request<RotateWebhookSecretResponse>({
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
    async testWebhook(workspaceId: string, webhookId: string): Promise<TestWebhookResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!webhookId) throw new Error('webhookId is required.');
      return client._request<TestWebhookResponse>({
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
    async listWebhookDeliveries(
      workspaceId: string,
      webhookId: string,
      params: ListDeliveriesParams = {},
    ): Promise<ListDeliveriesResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!webhookId) throw new Error('webhookId is required.');
      const search = new URLSearchParams();
      if (params.limit !== undefined) search.set('limit', String(params.limit));
      if (params.cursor !== undefined) search.set('cursor', params.cursor);
      if (params.status !== undefined) search.set('status', params.status);
      const qs = search.toString();
      return client._request<ListDeliveriesResponse>({
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
    async replayWebhookDelivery(
      workspaceId: string,
      webhookId: string,
      attemptId: string,
    ): Promise<{ attempt: WebhookAttempt }> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!webhookId) throw new Error('webhookId is required.');
      if (!attemptId) throw new Error('attemptId is required.');
      return client._request<{ attempt: WebhookAttempt }>({
        method: 'POST',
        endpoint: `/v1/workspaces/${workspaceId}/webhooks/${webhookId}/deliveries/${attemptId}/replay`,
        sendJWT: true,
      });
    },
  };
}

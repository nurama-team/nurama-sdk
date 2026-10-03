import NuramaClient from '../NuramaClient.js';
import type {
  SupportChatGetTopicResponse,
  SupportChatCreateAttachmentRequest,
  SupportChatCreateAttachmentResponse,
} from '@nurama/types';

/**
 * Nurama Support chat — one topic per user on the `/news` page.
 *
 * The surface is intentionally tiny: one endpoint that lazily creates
 * the user's support topic on first call and returns the existing row
 * on every subsequent call. There is no list / archive / delete — each
 * user has exactly one support conversation that persists across visits.
 *
 * Messages flow through the regular chat endpoints on
 * `nuramaClient.chat`:
 *
 *   - send: `nuramaClient.chat.createMessage(topic.chatId, { content })`
 *   - list: `nuramaClient.chat.getMessages(topic.chatId, …)`
 *
 * Backend gates: `auth → requireGlobalSupportChatEnabled → supportChatLimiter`.
 * Unmetered (no credit deduction) — abuse is bounded by the per-user
 * per-day rate limiter, not a credit balance check.
 */
export default function createSupportChatMethods(client: NuramaClient) {
  return {
    /**
     * Get-or-create the caller's Support topic. Idempotent: re-calling
     * returns the same row, so this is safe to invoke on every page mount.
     */
    async getTopic(): Promise<SupportChatGetTopicResponse> {
      return client._request({
        endpoint: '/v1/ai/support-chat/topic',
        method: 'GET',
        sendJWT: true,
      });
    },

    /**
     * Mint a Scratch upload bundle for one image attachment. The bytes
     * land in a Scratch row with a 72-hour TTL and are read by the
     * orchestrator's vision pass on the next user message — never
     * promoted to a permanent Asset.
     *
     * Same upload protocol as every other multipart upload on the
     * platform: call this, multipart-upload the bytes to `urls`, then
     * call `nuramaClient.scratch.completeUpload(scratchId, { uploadId, parts })`.
     * Send the message with `attachments: [{ scratchId, name }]`.
     */
    async createAttachment(
      data: SupportChatCreateAttachmentRequest,
    ): Promise<SupportChatCreateAttachmentResponse> {
      return client._request({
        endpoint: '/v1/ai/support-chat/attachments',
        method: 'POST',
        body: data,
        sendJWT: true,
      });
    },
  };
}

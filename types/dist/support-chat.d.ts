import type { ObjectId } from './common.js';
/**
 * Nurama Support chat — the customer-support surface on the `/news`
 * page. Distinct from the regular AI chat (`/v1/ai/chat/*`): one topic
 * per user, no workspace coupling, Haiku-backed, zero tools, unmetered.
 *
 * Messages flow through the same backing `Chat` row used by every other
 * chat surface — send with `nuramaClient.chat.createMessage(chatId, …)`,
 * read with `nuramaClient.chat.getMessages(chatId, …)`. The orchestrator
 * branches on `chat.chatType === 'support'` server-side.
 */
export interface SupportChatTopic {
    id: ObjectId;
    chatType: 'support';
    /** Always `'social'` for support topics — no workspace / project binding. */
    scopeType: 'social';
    scopeId: null;
    /** The user owning the topic (== creatorId for this surface). */
    creatorId: ObjectId;
    /**
     * Audit anchor — always `'user'` for support topics. Mirrors the
     * polymorphic shape on `AiUsageEvent` (`billedResourceType` /
     * `billedResourceId`) so the audit stream is internally consistent.
     */
    billedResourceType: 'user';
    billedResourceId: ObjectId;
    /** ID of the backing Chat. ChatMessages reference it via `chatId`. */
    chatId: ObjectId;
    /** Topic title — null until the user (or, future, an auto-namer) sets one. */
    title: string | null;
    totalMessages: number;
    lastMessagePreview: string | null;
    lastMessageAt: string | null;
    archived: boolean;
    status: 'active';
    createdAt: string;
    updatedAt: string;
}
export interface SupportChatGetTopicResponse {
    topic: SupportChatTopic;
}
/** One image attachment mint request — `POST /v1/ai/support-chat/attachments`. */
export interface SupportChatCreateAttachmentRequest {
    name: string;
    sizeInMB: number;
    mimeType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
}
/**
 * Scratch upload bundle returned by `POST /v1/ai/support-chat/attachments`.
 * Identical shape to the bundle other upload-via-scratch surfaces (AI
 * Revision) return — multipart-upload the bytes to `urls`, then call
 * `nuramaClient.scratch.completeUpload(scratchId, { uploadId, parts })`.
 */
export interface SupportChatCreateAttachmentResponse {
    scratchId: ObjectId;
    uploadId: string;
    key: string;
    urls: string[];
}

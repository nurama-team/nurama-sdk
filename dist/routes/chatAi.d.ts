import NuramaClient from '../NuramaClient.js';
import type { AiChatListTopicsParams, AiChatListTopicsResponse, AiChatCreateTopicRequest, AiChatCreateTopicResponse, AiChatGetTopicResponse, AiChatUpdateTopicRequest } from '@nurama/types';
/**
 * Topic-CRUD methods for AI chat. Message send + list happens through
 * the regular chat endpoints on `nuramaClient.chat`:
 *
 *   - send:  `nuramaClient.chat.createMessage(topic.chatId, …)`
 *   - list:  `nuramaClient.chat.getMessages(topic.chatId, …)`
 *
 * The backend's `chat.service.createMessage` detects `chatType === 'ai'`
 * and fires the AI orchestrator as a tail call so the same path that
 * powers every other chat surface (attachments, mentions, link previews,
 * link‐preview generation, notifications) carries AI chat too.
 *
 * Each topic is private to its creator. Topic scope is one of:
 *   - 'workspace' → cross-project chat in the workspace
 *   - 'project'   → bound to a single project
 *   - 'social'    → personal chat with no resource backing
 *
 * All endpoints below require:
 *   - workspace AI add-on subscription
 *   - `aiChatEnabled` resolved true (workspace setting + project override)
 *   - caller has project / workspace read access for scoped topics
 *
 * Credit-balance gating happens server-side on the regular chat
 * `createMessage` path when the target chat is an AI chat.
 */
export default function createAiChatMethods(client: NuramaClient): {
    /** List the caller's topics for a scope (workspace, project, or social). */
    listTopics(params: AiChatListTopicsParams): Promise<AiChatListTopicsResponse>;
    /**
     * Create a new (empty) topic. After this resolves, send the first
     * message through `nuramaClient.chat.createMessage(topic.chatId, …)`.
     */
    createTopic(data: AiChatCreateTopicRequest): Promise<AiChatCreateTopicResponse>;
    getTopic(topicId: string, params: {
        workspaceId: string;
    }): Promise<AiChatGetTopicResponse>;
    updateTopic(topicId: string, data: AiChatUpdateTopicRequest): Promise<AiChatGetTopicResponse>;
    /**
     * Soft-delete a topic. The backend flips the topic + its backing
     * chat + every chat-scoped attachment asset to `pendingDelete`;
     * the file-management sweeper handles the actual S3 + DB cleanup
     * asynchronously. The caller can drop the row from their local
     * list immediately — there's no "undo" surface for this.
     */
    deleteTopic(topicId: string, params: {
        workspaceId: string;
    }): Promise<AiChatGetTopicResponse>;
};
//# sourceMappingURL=chatAi.d.ts.map
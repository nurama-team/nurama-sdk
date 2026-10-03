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
export default function createAiChatMethods(client) {
    const buildQuery = (params) => {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null || value === '')
                continue;
            search.set(key, String(value));
        }
        const query = search.toString();
        return query ? `?${query}` : '';
    };
    return {
        /** List the caller's topics for a scope (workspace, project, or social). */
        async listTopics(params) {
            if (!params?.workspaceId)
                throw new Error('workspaceId is required.');
            if (!params?.scopeType)
                throw new Error('scopeType is required.');
            if (params.scopeType !== 'social' && !params.scopeId) {
                throw new Error('scopeId is required for workspace/project scope.');
            }
            return client._request({
                endpoint: `/v1/ai/chat/topics${buildQuery(params)}`,
                method: 'GET',
                sendJWT: true,
            });
        },
        /**
         * Create a new (empty) topic. After this resolves, send the first
         * message through `nuramaClient.chat.createMessage(topic.chatId, …)`.
         */
        async createTopic(data) {
            if (!data?.workspaceId)
                throw new Error('workspaceId is required.');
            if (!data?.scopeType)
                throw new Error('scopeType is required.');
            if (data.scopeType !== 'social' && !data.scopeId) {
                throw new Error('scopeId is required for workspace/project scope.');
            }
            return client._request({
                endpoint: '/v1/ai/chat/topics',
                method: 'POST',
                body: data,
                sendJWT: true,
            });
        },
        async getTopic(topicId, params) {
            if (!topicId)
                throw new Error('topicId is required.');
            return client._request({
                endpoint: `/v1/ai/chat/topics/${encodeURIComponent(topicId)}${buildQuery(params)}`,
                method: 'GET',
                sendJWT: true,
            });
        },
        async updateTopic(topicId, data) {
            if (!topicId)
                throw new Error('topicId is required.');
            return client._request({
                endpoint: `/v1/ai/chat/topics/${encodeURIComponent(topicId)}`,
                method: 'PATCH',
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Soft-delete a topic. The backend flips the topic + its backing
         * chat + every chat-scoped attachment asset to `pendingDelete`;
         * the file-management sweeper handles the actual S3 + DB cleanup
         * asynchronously. The caller can drop the row from their local
         * list immediately — there's no "undo" surface for this.
         */
        async deleteTopic(topicId, params) {
            if (!topicId)
                throw new Error('topicId is required.');
            return client._request({
                endpoint: `/v1/ai/chat/topics/${encodeURIComponent(topicId)}${buildQuery(params)}`,
                method: 'DELETE',
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=chatAi.js.map
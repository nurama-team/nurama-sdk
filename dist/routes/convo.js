/**
 * Defines convo (video/audio chat) related methods for the NuramaClient.
 * Handles starting, joining, and managing real-time conversations.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the convo-related methods.
 */
export default function createConvoMethods(client) {
    return {
        /**
         * Start a new conversation (video or audio).
         * Requires authentication.
         * @param {StartConvoRequest} data - Conversation start data.
         * @returns {Promise<StartConvoResponse>} The created conversation and room details.
         * @example
         * const result = await client.convo.startConvo({
         *   chatId: '507f1f77bcf86cd799439011',
         *   chatType: 'chat',
         *   convoType: 'video'
         * });
         */
        async startConvo(data) {
            if (!data.chatId || !data.chatType || !data.convoType) {
                throw new Error('chatId, chatType, and convoType are required.');
            }
            return client._request({
                method: 'POST',
                endpoint: '/v1/convos',
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Get a specific conversation by ID.
         * Requires authentication and permission to view the conversation.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<GetConvoResponse>} The conversation details.
         * @example
         * const result = await client.convo.getConvo('507f1f77bcf86cd799439011');
         */
        async getConvo(convoId) {
            if (!convoId) {
                throw new Error('convoId is required.');
            }
            return client._request({
                method: 'GET',
                endpoint: `/v1/convos/${convoId}`,
                sendJWT: true,
            });
        },
        /**
         * Join an active conversation.
         * Returns the conversation details and a Daily.co meeting token for the user.
         * Requires authentication and permission to join the conversation.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<JoinConvoResponse>} The conversation and meeting token.
         * @example
         * const result = await client.convo.joinConvo('507f1f77bcf86cd799439011');
         * // Use result.token to join the Daily.co call
         * // Use result.convo.dailyRoomUrl as the room URL
         */
        async joinConvo(convoId) {
            if (!convoId) {
                throw new Error('convoId is required.');
            }
            return client._request({
                method: 'PUT',
                endpoint: `/v1/convos/${convoId}/join`,
                sendJWT: true,
            });
        },
        /**
         * Rejoin an active conversation (page refresh / reconnect).
         * Only returns a new meeting token if the user is already an active participant.
         * No notifications are sent.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<JoinConvoResponse>} The conversation and meeting token.
         */
        async rejoinConvo(convoId) {
            if (!convoId) {
                throw new Error('convoId is required.');
            }
            return client._request({
                method: 'PUT',
                endpoint: `/v1/convos/${convoId}/rejoin`,
                sendJWT: true,
            });
        },
        /**
         * Leave an active conversation.
         * Removes the user from the active participants list.
         * Requires authentication.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<LeaveConvoResponse>} The updated conversation.
         * @example
         * const result = await client.convo.leaveConvo('507f1f77bcf86cd799439011');
         */
        async leaveConvo(convoId) {
            if (!convoId) {
                throw new Error('convoId is required.');
            }
            return client._request({
                method: 'PUT',
                endpoint: `/v1/convos/${convoId}/leave`,
                sendJWT: true,
            });
        },
        /**
         * Mark a conversation as complete.
         * Ends the conversation and triggers recording/transcript processing if enabled.
         * Requires authentication and permission to complete the conversation.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<CompleteConvoResponse>} The completed conversation.
         * @example
         * const result = await client.convo.completeConvo('507f1f77bcf86cd799439011');
         */
        async completeConvo(convoId) {
            if (!convoId) {
                throw new Error('convoId is required.');
            }
            return client._request({
                method: 'PUT',
                endpoint: `/v1/convos/${convoId}/complete`,
                sendJWT: true,
            });
        },
        /**
         * Delete/cancel a conversation.
         * Only the creator can delete a conversation.
         * Requires authentication and permission to delete the conversation.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<void>} Resolves with no value; the API responds 204.
         * @example
         * await client.convo.deleteConvo('507f1f77bcf86cd799439011');
         */
        async deleteConvo(convoId) {
            if (!convoId) {
                throw new Error('convoId is required.');
            }
            await client._request({
                method: 'DELETE',
                endpoint: `/v1/convos/${convoId}`,
                sendJWT: true,
            });
        },
        /**
         * Update a conversation's subject and/or description.
         * Only the conversation starter can update these fields.
         * Requires authentication.
         * @param {string} convoId - The conversation ID.
         * @param {UpdateConvoRequest} data - Update data containing subject and/or description.
         * @returns {Promise<UpdateConvoResponse>} The updated conversation.
         * @example
         * const result = await client.convo.updateConvo('507f1f77bcf86cd799439011', {
         *   subject: 'Weekly Team Sync',
         *   description: 'Discussing project updates and roadmap'
         * });
         */
        async updateConvo(convoId, data) {
            if (!convoId) {
                throw new Error('convoId is required.');
            }
            return client._request({
                method: 'PATCH',
                endpoint: `/v1/convos/${convoId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * List the convos that have taken place in a chat, newest first.
         * Requires read access to the chat.
         * @param {string} chatId - The chat ID.
         * @param {object} [params] - Optional filter.
         * @param {'active'|'completed'|'cancelled'} [params.status] - Only convos in this status.
         * @returns {Promise<Convo[]>} Convos for the chat.
         */
        async getChatConvos(chatId, params) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}/convos`,
                params,
                sendJWT: true,
            });
        },
        /**
         * List every convo across all chats in a project (the "Convos drawer"), newest first.
         * Requires `canGetProject` on the project.
         * @param {string} projectId - The project ID.
         * @param {object} [params] - Optional filters.
         * @param {'creator'|'reviewer'} [params.visibility] - Only convos from chats with this visibility.
         * @param {'active'|'completed'|'cancelled'} [params.status] - Only convos in this status.
         * @returns {Promise<Convo[]>} Convos for the project.
         */
        async getProjectConvos(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/projects/${projectId}/convos`,
                params,
                sendJWT: true,
            });
        },
        /**
         * Get conversations for a scope (project).
         * Returns paginated list of conversations with cursor-based pagination.
         * Active conversations are returned first.
         * Requires authentication and permission to view conversations.
         * @param {string} scopeId - The scope (project) ID.
         * @param {object} params - Query parameters.
         * @param {string[]} params.visibility - Array of visibility levels ('creator', 'reviewer').
         * @param {string} [params.status] - Filter by status ('active', 'completed', 'cancelled').
         * @param {string} [params.search] - Search query for participant names.
         * @param {number} [params.limit=20] - Number of results per page.
         * @param {string} [params.cursor] - Cursor for pagination.
         * @param {boolean} [params.includeCounts] - Include total counts.
         * @returns {Promise<GetScopeConvosResponse>} Paginated conversation list.
         * @example
         * const result = await client.convo.getScopeConvos('507f1f77bcf86cd799439011', {
         *   visibility: ['creator', 'reviewer'],
         *   status: 'active',
         *   limit: 20
         * });
         */
        /**
         * Promote a convo's recording or transcript to a standalone asset.
         *
         * Additive: the artifact stays bundled with the convo as well, so calling
         * this twice returns the first asset with `alreadyPromoted: true` rather
         * than making a second copy.
         *
         * Only the convo's starter may promote. A transcript is promoted as a text
         * document built from the transcript text, not the raw .vtt.
         * @param {string} convoId - The conversation ID.
         * @param {'recording'|'transcript'} kind - Which artifact to promote.
         * @param {string} dailyId - The provider's id for the artifact, taken from
         *   the convo's `recordings` / `transcripts` entries.
         * @param {PromoteConvoArtifactRequest} [data] - Optional display name.
         * @returns {Promise<PromoteConvoArtifactResponse>} The asset, and whether it already existed.
         * @example
         * const { asset } = await client.convo.promoteConvoArtifact(convoId, 'recording', rec.dailyId);
         */
        async promoteConvoArtifact(convoId, kind, dailyId, data) {
            if (!convoId)
                throw new Error('convoId is required.');
            if (!dailyId)
                throw new Error('dailyId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/convos/${convoId}/artifacts/${kind}/${dailyId}/promote`,
                body: data ?? {},
                sendJWT: true,
            });
        },
        async getScopeConvos(scopeId, params) {
            if (!scopeId) {
                throw new Error('scopeId is required.');
            }
            if (!params.visibility || params.visibility.length === 0) {
                throw new Error('visibility array is required and must not be empty.');
            }
            const queryParams = new URLSearchParams();
            params.visibility.forEach((vis) => queryParams.append('visibility[]', vis));
            if (params.status)
                queryParams.append('status', params.status);
            if (params.search)
                queryParams.append('search', params.search);
            if (params.limit)
                queryParams.append('limit', params.limit.toString());
            if (params.cursor)
                queryParams.append('cursor', params.cursor);
            if (params.includeCounts)
                queryParams.append('includeCounts', 'true');
            return client._request({
                method: 'GET',
                endpoint: `/v1/convos/scope/${scopeId}?${queryParams.toString()}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=convo.js.map
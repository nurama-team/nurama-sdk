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
         * List the convos the caller can see across all their projects and Team
         * Chats: the ones running now, and the ones that ended within the last
         * hour. Running convos come first. Each carries its `project` and
         * `workspace`.
         * @returns {Promise<GetMyConvosResponse>} The caller's running and recently ended convos.
         * @example
         * const { results } = await client.convo.getMyConvos();
         */
        async getMyConvos() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/convos',
                sendJWT: true,
            });
        },
        /**
         * Get what is needed to play a convo recording or show a transcript.
         *
         * A recording answers with a short-lived signed `url`; a transcript answers
         * with its `content` inline, cue timings included. Open to anyone who can
         * see the convo. Nothing is created — to keep an artifact as an asset, use
         * `promoteConvoArtifact`.
         * @param {string} convoId - The conversation ID.
         * @param {'recording'|'transcript'} kind - Which artifact to play.
         * @param {string} dailyId - The provider's id for the artifact, taken from
         *   the convo's `recordings` / `transcripts` entries.
         * @returns {Promise<ConvoArtifactPlaybackResponse>} The signed URL or the transcript text.
         * @example
         * const { url } = await client.convo.getConvoArtifactPlayback(convoId, 'recording', rec.dailyId);
         */
        async getConvoArtifactPlayback(convoId, kind, dailyId) {
            if (!convoId)
                throw new Error('convoId is required.');
            if (!dailyId)
                throw new Error('dailyId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/convos/${convoId}/artifacts/${kind}/${encodeURIComponent(dailyId)}/playback`,
                sendJWT: true,
            });
        },
        /**
         * The mentions kept on a convo: the people and assets Nu picked out of its
         * transcript, and any added by hand. Only an admin of the convo's project
         * who was on the call may read them.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<ConvoMentionsResponse>} Every mention, pending and sent.
         */
        async getConvoMentions(convoId) {
            if (!convoId)
                throw new Error('convoId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/convos/${convoId}/mentions`,
                sendJWT: true,
            });
        },
        /**
         * Replace a convo's pending mentions with the given list — suggestions
         * kept, plus anyone or anything added by hand. Sent mentions are untouched.
         * @param {string} convoId - The conversation ID.
         * @param {UpdateConvoMentionsRequest} data - The pending list as it should now stand.
         * @returns {Promise<ConvoMentionsResponse>} The convo's mentions after the change.
         */
        async updateConvoMentions(convoId, data) {
            if (!convoId)
                throw new Error('convoId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/convos/${convoId}/mentions`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Send a convo's pending mentions: they are added to the convo's own
         * message in its chat, and each person newly mentioned is told.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<SendConvoMentionsResponse>} The convo's message, and the mentions now marked sent.
         */
        async sendConvoMentions(convoId) {
            if (!convoId)
                throw new Error('convoId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/convos/${convoId}/mentions/send`,
                body: {},
                sendJWT: true,
            });
        },
        /**
         * Take a sent mention off the convo's message. A person's mention task is
         * deleted with it.
         * @param {string} convoId - The conversation ID.
         * @param {'user'|'asset'} kind - What is mentioned.
         * @param {string} targetId - The user's or asset's id.
         * @returns {Promise<ConvoMentionsResponse>} The convo's mentions after the change.
         */
        async removeConvoMention(convoId, kind, targetId) {
            if (!convoId)
                throw new Error('convoId is required.');
            if (!targetId)
                throw new Error('targetId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/convos/${convoId}/mentions/${kind}/${targetId}`,
                sendJWT: true,
            });
        },
        /**
         * Write or edit a convo's summary by hand. For whoever started the convo
         * and anyone who was on the call; works with AI summaries off.
         * @param {string} convoId - The conversation ID.
         * @param {string} summary - Markdown. Empty removes the summary.
         * @returns {Promise<UpdateConvoSummaryResponse>} The summary as kept.
         */
        async updateConvoSummary(convoId, summary) {
            if (!convoId)
                throw new Error('convoId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/convos/${convoId}/summary`,
                body: { summary },
                sendJWT: true,
            });
        },
        /**
         * List the tasks made from a convo, oldest first.
         * @param {string} convoId - The conversation ID.
         * @returns {Promise<ConvoTasksResponse>} The tasks, as a chat draws them on a card.
         */
        async getConvoTasks(convoId) {
            if (!convoId)
                throw new Error('convoId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/convos/${convoId}/tasks`,
                sendJWT: true,
            });
        },
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
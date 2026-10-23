/**
 * Defines chat-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the chat-related methods.
 */
export default function createChatMethods(client) {
    return {
        // --- Topic Chats ---
        /**
         * Creates a topic chat for a project or asset at a given visibility.
         * Requires `canCreateCreatorChat` (visibility `creator`) or `canCreateReviewerChat`
         * (visibility `reviewer`) on the topic resource. Although `visibility` is optional in
         * the type, the permission check only passes when it is one of those two values, so
         * omitting it results in 403.
         * @param {CreateTopicChatData} data - `topicType` (`project` | `asset`), `topicId`, optional `subject` (max 100 chars) and `visibility`.
         * @returns {Promise<ChatResponse>} The created chat.
         */
        async createTopicChat(data) {
            return client._request({
                method: 'POST',
                endpoint: '/v1/chats/topic',
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Retrieves the topic chat for a project, asset, public release or task, together
         * with its most recent messages and their replies.
         * Requires `canGetCreatorChat` or `canGetReviewerChat` on the chat, matching
         * `params.visibility`. `replies` (default 10, max 100) and `sort` (default `{ id: -1 }`)
         * are honoured, but `messages` is accepted and then not forwarded by the API handler,
         * so 10 recent messages are always returned.
         * @param {string} topicId - The ID of the topic resource (project, asset, public release or task).
         * @param {GetChatByTopicIdParams} params - See GetChatByTopicIdParams. `topicType` is one of `project`, `asset`, `public`, `task`.
         * @returns {Promise<ChatResponse>} The chat, including `recentMessages`.
         * @throws {Error} 'topicId is required.' when `topicId` is falsy.
         */
        async getChatByTopicId(topicId, params) {
            if (!topicId)
                throw new Error('topicId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/topic/${topicId}`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Member Chats ---
        /**
         * Creates a member ("Team") chat in a workspace with the given members.
         * Only `scopeType: 'workspace'` is accepted by the API: project-scoped member chats
         * are deprecated and `social` is not supported yet, so both are rejected with 400
         * even though the type still allows them. Requires `canCreateWorkspaceMemberChat` on
         * the workspace. The caller is always added as the first member, every member must
         * be chat-eligible in the scope (`membersInvalid` otherwise), and a random approved
         * colour is assigned (the API also accepts an optional `color`, not exposed on this type).
         * @param {CreateMemberChatData} data - `scopeType`, `scopeId`, `memberIds` and optional `subject` (max 100 chars).
         * @returns {Promise<MemberChatResponse>} The created member chat.
         */
        async createMemberChat(data) {
            return client._request({
                method: 'POST',
                endpoint: '/v1/chats/member',
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Lists the member chats the caller belongs to, most recently updated first, each
         * with its recent messages.
         * Defaults to index pagination (`page`, `limit` max 20); pass `paginate: 'cursor'` for
         * cursor pagination. `updatedBefore` is only accepted with index pagination,
         * `recentMessages` caps the messages returned per chat (default and max 20), and
         * `archived` narrows to chats the caller has (`true`) or has not (`false`) archived.
         * `createdBefore` / `createdAfter` from DateRangeParams are not accepted by this
         * endpoint and cause a 400.
         * @param {GetUsersMemberChatsParams} [params] - See GetUsersMemberChatsParams.
         * @returns {Promise<PaginatedResponse<MemberChatResponse>>} A paginated list of member chats.
         */
        async getUsersMemberChats(params) {
            return client._request({
                method: 'GET',
                endpoint: '/v1/chats/member',
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Retrieves a member chat by ID without its messages.
         * The caller must be a member of the chat.
         * @param {string} chatId - The ID of the member chat.
         * @returns {Promise<MemberChatResponse>} The member chat with `participants`, `members` and `icon` populated.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getMemberChat(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/member/${chatId}`,
                sendJWT: true,
            });
        },
        /**
         * Retrieves every project topic chat (creator/reviewer) the caller can
         * access across all projects in a workspace, with the latest message and
         * message count for each, ordered by most recent activity. Powers the
         * workspace-level "Project Chat" list.
         * Requires `canGetWorkspace` on the workspace; access to each project's chats is
         * derived from the caller's inherited `canGetCreatorChat` / `canGetReviewerChat`.
         * @param {string} workspaceId - The ID of the workspace.
         * @returns {Promise<Array<object>>} An array of `{ project, visibility, chat }` entries; `chat.recentMessages` holds at most the latest message.
         * @throws {Error} 'workspaceId is required.' when `workspaceId` is falsy.
         */
        async getWorkspaceProjectChats(workspaceId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/workspace/${workspaceId}/project-chats`,
                sendJWT: true,
            });
        },
        /**
         * Updates a member chat's subject and/or colour.
         * The caller must be a member of the chat. `subject` is limited to 100 characters
         * and `color` must be one of the approved palette colours.
         * @param {string} chatId - The ID of the member chat.
         * @param {UpdateMemberChatData} data - The new `subject` and/or `color`.
         * @returns {Promise<MemberChatResponse>} The updated member chat.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async updateMemberChat(chatId, data) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/member/${chatId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Marks a member chat, its messages and its attachments for deletion.
         * Only the chat's creator may delete it; other members receive 403. From the
         * members' perspective the chat disappears immediately; the rows are removed later
         * by the cleanup service.
         * @param {string} chatId - The ID of the member chat.
         * @returns {Promise<void>} Resolves with `null` (the API sends an empty body).
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async deleteMemberChat(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/chats/member/${chatId}`,
                sendJWT: true,
            });
        },
        /**
         * Archives a member chat for the calling user only.
         * Adds the caller to the chat's `archivedBy` list; other members' view of the chat
         * is unaffected. The caller must be a member of the chat.
         * @param {string} chatId - The ID of the member chat.
         * @returns {Promise<MemberChatResponse>} The updated member chat.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async archiveMemberChat(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/member/${chatId}/archive`,
                sendJWT: true,
            });
        },
        /**
         * Unarchives a member chat for the calling user only.
         * Removes the caller from the chat's `archivedBy` list. The caller must be a member
         * of the chat.
         * @param {string} chatId - The ID of the member chat.
         * @returns {Promise<MemberChatResponse>} The updated member chat.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async unarchiveMemberChat(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/member/${chatId}/unarchive`,
                sendJWT: true,
            });
        },
        /**
         * Gets unread state for every member chat you belong to — one row per chat,
         * carrying the chat's `lastMessageAt`, your `lastReadAt` and a `hasUnread`
         * flag. Compares timestamps rather than counting, so it costs the same
         * whether you have three chats or three hundred; for a count, read the
         * single-chat endpoint for the chat on screen.
         * @returns {Promise<{ results: MemberChatReadState[] }>} Unread state per member chat.
         */
        async getMemberChatReadStates() {
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/member/read-state`,
                sendJWT: true,
            });
        },
        /**
         * Gets where you had read up to in a member chat, and how many messages have
         * arrived since. `lastReadAt` is null if you have never recorded a position,
         * and `unreadCount` is 0 then. Your own messages never count.
         * @param {string} chatId - The ID of the member chat.
         * @returns {Promise<ReadState>} Your reading position in that chat.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getMemberChatReadState(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/member/${chatId}/read-state`,
                sendJWT: true,
            });
        },
        /**
         * Marks a member chat as caught up. Pass `lastReadAt` (epoch ms) to catch up
         * to the newest message you had loaded; omit it to catch up to now. The
         * marker only moves forward and never past the present, so a stale value is
         * a no-op rather than an error.
         * @param {string} chatId - The ID of the member chat.
         * @param {number} [lastReadAt] - Epoch ms of the newest message you had loaded.
         * @returns {Promise<ReadState>} Your updated reading position.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async markMemberChatCaughtUp(chatId, lastReadAt) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/chats/member/${chatId}/read-state`,
                body: lastReadAt === undefined ? {} : { lastReadAt },
                sendJWT: true,
            });
        },
        /**
         * Creates an icon asset for a member chat and returns signed upload URLs for it.
         * Any existing icon is marked for deletion. The caller must be a member of the chat;
         * `sizeInMB` is capped at 10 and `name` at 100 characters. Upload the file to the
         * returned `signedUrlData.urls` afterwards, exactly as for any asset upload.
         * @param {string} chatId - The ID of the member chat.
         * @param {UpdateMemberChatIconData} data - `name` (with extension), `checksum` (MD5 or SHA-256) and `sizeInMB`.
         * @returns {Promise<{ chat: MemberChatResponse } & AttachmentUploadRecord>} The updated `chat` plus the created upload record. Note the record's fields (`asset`, `signedUrlData`, `status`, ...) are spread directly onto the response; there is no `iconData` key despite the declared type.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async updateMemberChatIcon(chatId, data) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/member/${chatId}/icon`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Lists the members that can be added to an existing member chat, based on the chat's
         * scope and the caller's role in it.
         * The caller must be a member of the chat. For workspace-scoped chats the result is a
         * flat array of memberships; for legacy project-scoped chats it is an
         * `AddableMembersByScope` object.
         * @param {string} chatId - The ID of the member chat.
         * @returns {Promise<MemberResponse[] | AddableMembersByScope>} Addable memberships, each with its `user` populated.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getAddableMembers(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/member/members/${chatId}`,
                sendJWT: true,
            });
        },
        /**
         * Lists the members addable to a NEW member chat, by scope, before the chat
         * exists. Use this to populate the create-chat member picker — unlike the
         * raw membership-list endpoints it isn't admin-gated, so non-admin members
         * allowed to start a Team Chat still get the correct list.
         * Requires `canCreateWorkspaceMemberChat` (or `canCreateProjectMemberChat`) on the
         * scope. For `project` scope the result is an `AddableMembersByScope` object; note
         * that project-scoped member chats can no longer be created.
         * @param {'workspace' | 'project'} scopeType - Scope of the chat to create.
         * @param {string} scopeId - ID of the scope resource.
         * @returns {Promise<MemberResponse[] | AddableMembersByScope>} Addable memberships, each with its `user` populated.
         * @throws {Error} 'scopeType is required.' or 'scopeId is required.' when either is falsy.
         */
        async getScopeAddableMembers(scopeType, scopeId) {
            if (!scopeType)
                throw new Error('scopeType is required.');
            if (!scopeId)
                throw new Error('scopeId is required.');
            return client._request({
                method: 'GET',
                endpoint: '/v1/chats/member/addable',
                params: { scopeType, scopeId },
                sendJWT: true,
            });
        },
        /**
         * Adds users to a member chat by user ID.
         * The caller must be a member of the chat, and every user must be chat-eligible in
         * the chat's scope (`membersInvalid` otherwise). `memberIds` is not enforced by
         * validation, but the request cannot succeed without it.
         * @param {string} chatId - The ID of the member chat.
         * @param {MemberIdList} data - `memberIds`: the user IDs to add.
         * @returns {Promise<MemberChatResponse>} The updated member chat.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async addMembers(chatId, data) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/member/members/${chatId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Removes users from a member chat by user ID.
         * The caller must be a member of the chat. The chat's creator cannot be removed
         * (`ownerCannotLeaveChat`) and unknown user IDs produce `userNotFound`. Sent as a
         * DELETE with a JSON body.
         * @param {string} chatId - The ID of the member chat.
         * @param {MemberIdList} data - `memberIds`: the user IDs to remove.
         * @returns {Promise<MemberChatResponse>} The updated member chat.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async removeMembers(chatId, data) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/chats/member/members/${chatId}`,
                body: data,
                sendJWT: true,
            });
        },
        // --- Generic Chat Management ---
        /**
         * Retrieves a topic chat (project, asset, task or public) by ID without its messages.
         * Requires `canGetCreatorChat` or `canGetReviewerChat` on the chat, matching its
         * visibility. Only topic chats are served here; member chats are served by
         * `getMemberChat` and a member chat ID yields `chatNotFound`.
         * @param {string} chatId - The ID of the topic chat.
         * @returns {Promise<ChatResponse>} The chat with `participants` populated.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getChat(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}`,
                sendJWT: true,
            });
        },
        /**
         * Updates the subject of a topic chat.
         * Requires `canUpdateCreatorChat` or `canUpdateReviewerChat` on the chat, matching
         * its visibility. `subject` is limited to 100 characters. For member chats use
         * `updateMemberChat`.
         * @param {string} chatId - The ID of the topic chat.
         * @param {UpdateChatSubjectData} data - The new `subject`.
         * @returns {Promise<ChatResponse>} The updated chat.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async updateChatSubject(chatId, data) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/${chatId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Marks a topic chat for deletion.
         * In practice this only succeeds for `user`-topic chats owned by the caller: project
         * and asset topic chats are refused with `topicChatsMayNotBeDeleted`, and any other
         * topic type with `unknownError`. Member chats are deleted with `deleteMemberChat`.
         * @param {string} chatId - The ID of the chat.
         * @returns {Promise<void>} Resolves with `null` (the API sends an empty body).
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async deleteChat(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/chats/${chatId}`,
                sendJWT: true,
            });
        },
        // --- Messages ---
        /**
         * Posts a message to any chat type (topic, member, submission, AI, support).
         * Either `content` (max 10,000 chars) or at least one attachment is required. API
         * tokens need the `chat:write` scope (`tokenScopeMissing` / 403 otherwise); users
         * need message-create permission on the chat, e.g. `canCreateCreatorChatMessage` /
         * `canCreateReviewerChatMessage` for topic chats or membership for member chats.
         * Limits: 6 attachments, 10 of each mention kind, 5 quotes, 5 link previews and
         * 100 annotations. Mentioning users in topic/member/submission chats creates tasks
         * and notifications for them. `pageContext` is only read by AI chats and ignored by
         * every other chat type.
         * @param {string} chatId - The ID of the chat to post in.
         * @param {CreateMessageData} data - See CreateMessageData. `attachments` may mix upload-shape (`FileAttachmentData`) and scratch-shape (`ScratchAttachmentRef`) items.
         * @returns {Promise<ChatMessageResponse>} The created message. When upload-shape attachments were sent it also carries `attachmentData` with the created assets and their signed upload URLs.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async createMessage(chatId, data) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/chats/${chatId}/new-message`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Posts a message to an asset's chat at the given visibility, creating the chat first
         * if it does not exist yet (asset chats are normally auto-created, so this mainly
         * covers legacy assets).
         * Only media assets are accepted (`assetInvalidFunctionType` / 404 otherwise).
         * Requires both `canCreate{Creator|Reviewer}Chat` and
         * `canCreate{Creator|Reviewer}ChatMessage` on the asset for the chosen visibility.
         * The body follows the same rules as `createMessage`. The `params` argument is
         * neither validated nor forwarded by the API handler, so the returned chat always
         * carries 10 recent messages with 10 replies each, sorted `{ id: -1 }`.
         * @param {string} assetId - The ID of the media asset.
         * @param {'creator' | 'reviewer'} visibility - Which of the asset's two chats to post in.
         * @param {CreateAssetChatAndMessageData} data - See CreateMessageData.
         * @param {CreateAssetChatAndMessageParams} [params] - Accepted for backwards compatibility only; currently ignored by the API.
         * @returns {Promise<any>} `{ chat, message }`: the chat re-read after the message landed (so `recentMessages` includes it) and the created message, which carries `attachmentData` when upload-shape attachments were sent.
         * @throws {Error} 'assetId is required.' when `assetId` is falsy.
         */
        async createAssetChatAndMessage(assetId, visibility, data, params) {
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/chats/asset/${assetId}/${visibility}/new-message`,
                body: data,
                params: params, // Params for recent messages/replies included in response
                sendJWT: true,
            });
        },
        /**
         * Lists a chat's active messages with their recent replies and populated
         * attachments and mentions.
         * Requires read access to the chat (`canGetChat`); API tokens need the `chat:read`
         * scope (`tokenScopeMissing` / 403 otherwise). Defaults to index pagination (`page`,
         * `limit` max 100, sort `{ id: -1 }`); pass `paginate: 'cursor'` for cursor
         * pagination. `createdBefore` / `createdAfter` are only accepted with index
         * pagination and `updatedBefore` is not accepted at all. `replyLimit` (default 10,
         * max 100) sets the replies returned per message; `replies` is a deprecated alias
         * that takes precedence over `replyLimit` whenever it is set to anything other than 10.
         * @param {string} chatId - The ID of the chat.
         * @param {GetMessagesParams} [params] - See GetMessagesParams.
         * @returns {Promise<PaginatedResponse<ChatMessageResponse>>} A paginated list of messages.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getMessages(chatId, params) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}/messages`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Retrieves a single message by ID with its most recent replies.
         * Requires read access to the message's chat (`canGetChatMessage`). `replies`
         * defaults to 10 (max 100) and `sort` (default `{ id: -1 }`) orders the included replies.
         * @param {string} messageId - The ID of the message.
         * @param {GetMessageParams} [params] - See GetMessageParams.
         * @returns {Promise<ChatMessageResponse>} The message.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async getMessage(messageId, params) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/message/${messageId}`,
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Revises a message's content, mentions, quotes, annotations and link previews,
         * keeping the previous version as a revision.
         * Only the author may revise, and in topic/submission chats they also need
         * `canUpdateOwnChatMessage`. Annotations are replaced, not merged: omit
         * `annotations` to keep the current ones, send `[]` to remove them all.
         * `linkPreviews` likewise replaces the stored previews. Same size limits as
         * `createMessage`.
         * @param {string} messageId - The ID of the message to revise.
         * @param {ReviseMessageData} data - See ReviseMessageData.
         * @returns {Promise<ChatMessageResponse>} The revised message.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async reviseMessage(messageId, data) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/message/${messageId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Marks a message for deletion.
         * Only the author may delete, and in topic/submission chats they also need
         * `canDeleteOwnChatMessage`. The row is removed later by the cleanup service.
         * @param {string} messageId - The ID of the message.
         * @returns {Promise<ChatMessageResponse>} The deleted message.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async deleteMessage(messageId) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/chats/message/${messageId}`,
                sendJWT: true,
            });
        },
        // --- Replies ---
        /**
         * Lists the active replies to a message, with attachments populated.
         * Requires read access to the message's chat (`canGetChatMessage`). Defaults to
         * index pagination (`page`, `limit` max 100, sort `{ id: -1 }`); pass
         * `paginate: 'cursor'` for cursor pagination. `createdBefore` / `createdAfter` are
         * only accepted with index pagination and `updatedBefore` is not accepted at all.
         * @param {string} messageId - The ID of the parent message.
         * @param {GetRepliesParams} [params] - See GetRepliesParams.
         * @returns {Promise<PaginatedResponse<ChatMessageResponse>>} A paginated list of replies.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async getReplies(messageId, params) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/message/${messageId}/replies`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Attachments ---
        /**
         * Creates attachment assets for an existing message and returns signed upload URLs
         * for them.
         * Only the message's author may attach, and in topic/submission chats they also
         * need `canCreateAttachment`. Only image and video file names are accepted, each
         * `checksum` must be a 32-64 character hex MD5/SHA-256 digest, `id` must be an
         * integer no greater than 10, and the message may hold at most 6 attachments in
         * total (`exceedsMaxAttachments`). The request is also checked against the
         * workspace storage quota (`uploadRequestExceedsSubscription`).
         * @param {string} messageId - The ID of the message.
         * @param {FileAttachmentData[]} attachments - The files to attach; sent as the raw JSON body array.
         * @returns {Promise<AttachmentResponse[]>} One record per input file: the input item plus `status` and, on success, `asset` and `signedUrlData` (or `error` on failure). Not a bare `Asset` as the declared type suggests.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async addAttachments(messageId, attachments) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/chats/message/${messageId}/attachment/`,
                body: attachments,
                sendJWT: true,
            });
        },
        /**
         * Removes an attachment from a message and marks the asset for deletion.
         * Only the author may remove attachments, and in topic/submission chats they also
         * need `canDeleteOwnAttachment`. If the message is left with no content and no
         * attachments it is marked for deletion as well, and the deleted message is returned.
         * @param {string} messageId - The ID of the message.
         * @param {string} assetId - The ID of the attached asset to remove.
         * @returns {Promise<ChatMessageResponse>} The updated (or deleted) message.
         * @throws {Error} 'messageId is required.' or 'assetId is required.' when either is falsy.
         */
        async removeAttachment(messageId, assetId) {
            if (!messageId)
                throw new Error('messageId is required.');
            if (!assetId)
                throw new Error('assetId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/chats/message/${messageId}/attachment/${assetId}`,
                sendJWT: true,
            });
        },
        // --- Mentions ---
        /**
         * Lists the messages in which the caller was mentioned.
         * Defaults to index pagination (`page`, `limit` max 100, sort `{ id: -1 }`); pass
         * `paginate: 'cursor'` for cursor pagination. Filter with `chatId` and/or
         * `authorId`. `createdBefore` is only accepted with index pagination;
         * `createdAfter` and `updatedBefore` from DateRangeParams are not accepted by this
         * endpoint and cause a 400.
         * @param {GetUsersMentionsParams} [params] - See GetUsersMentionsParams.
         * @returns {Promise<PaginatedResponse<ChatMessageResponse>>} A paginated list of messages.
         */
        async getMentions(params) {
            return client._request({
                method: 'GET',
                endpoint: '/v1/chats/mentions',
                params: params,
                sendJWT: true,
            });
        },
        // --- Summaries ---
        // --- Reactions ---
        /**
         * Adds the caller's emoji reaction to a message, replacing any reaction they already
         * had on it.
         * Each user holds at most one reaction per message. Requires message-create
         * permission on the chat (`canCreateReaction`). `emoji` must be 1-10 characters.
         * @param {string} messageId - The ID of the message.
         * @param {CreateReactionData} data - The `emoji` to react with.
         * @returns {Promise<ChatMessageResponse>} The updated message, including `reactions`.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async createReaction(messageId, data) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/chats/message/${messageId}/reaction`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Removes the caller's own reaction from a message.
         * Gated by the same permission as `createReaction`. Calling it when the caller has
         * no reaction is a no-op that still returns the message.
         * @param {string} messageId - The ID of the message.
         * @returns {Promise<ChatMessageResponse>} The updated message.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async removeReaction(messageId) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/chats/message/${messageId}/reaction`,
                sendJWT: true,
            });
        },
        // --- Follow/Unfollow ---
        /**
         * Adds the caller to a chat's following list so they are notified about new
         * messages and updates.
         * Works with topic, member and submission chats and is idempotent. Requires
         * message-create permission on the chat (`canCreateChatMessage`).
         * @param {string} chatId - The ID of the chat to follow.
         * @returns {Promise<void>} Resolves once followed. The API sends an empty body; re-fetch the chat if you need its `following` list.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async followChat(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            await client._request({
                method: 'PUT',
                endpoint: `/v1/chats/${chatId}/follow`,
                sendJWT: true,
            });
        },
        /**
         * Removes the caller from a chat's following list.
         * Works with topic, member and submission chats and is idempotent. No chat
         * permission is checked, so users can stop notifications for a chat they have
         * since lost access to.
         * @param {string} chatId - The ID of the chat to unfollow.
         * @returns {Promise<void>} Resolves once unfollowed. The API sends an empty body.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async unfollowChat(chatId) {
            if (!chatId)
                throw new Error('chatId is required.');
            await client._request({
                method: 'PUT',
                endpoint: `/v1/chats/${chatId}/unfollow`,
                sendJWT: true,
            });
        },
        // --- Mentionable Assets ---
        /**
         * Lists the active assets that can be mentioned (`{{assetMention:assetId}}`) in a chat.
         * What is returned depends on the chat: project and asset topic chats return the
         * project's assets at the chat's visibility; project-scoped member chats and
         * submission chats return all of the project's assets; AI chats return the topic
         * project's assets filtered to the caller's own visibility tiers; workspace/social
         * member chats return an empty list. Requires read access to the chat
         * (`canGetChatMentionableAssets`). Defaults to index pagination (`page`, `limit`
         * max 100, sort `{ name: 1 }`); pass `paginate: 'cursor'` for cursor pagination.
         * `startAt` / `includeStartAtRecord` are not accepted here.
         * @param {string} chatId - The ID of the chat.
         * @param {GetMentionableAssetsParams} [params] - See GetMentionableAssetsParams. `nameSearch` is a case-insensitive partial match.
         * @returns {Promise<PaginatedResponse<Asset>>} A paginated list of assets.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getMentionableAssets(chatId, params) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}/mentionable/assets`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Mentionable Folders ---
        /**
         * Lists the active folders that can be mentioned (`{{folderMention:folderId}}`) in a chat.
         * What is returned depends on the chat: project and asset topic chats return the
         * project's folders at the chat's visibility; project-scoped member chats return
         * all of the project's folders; submission chats return the project's
         * reviewer-visibility folders; AI chats return the topic project's folders filtered
         * to the caller's own visibility tiers; workspace/social member chats return an
         * empty list. Requires read access to the chat (`canGetChatMentionableFolders`).
         * Defaults to index pagination (`page`, `limit` max 100, sort `{ name: 1 }`); pass
         * `paginate: 'cursor'` for cursor pagination. `startAt` / `includeStartAtRecord`
         * are not accepted here.
         * @param {string} chatId - The ID of the chat.
         * @param {GetMentionableFoldersParams} [params] - See GetMentionableFoldersParams. `nameSearch` is a case-insensitive partial match.
         * @returns {Promise<PaginatedResponse<Folder>>} A paginated list of folders.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getMentionableFolders(chatId, params) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}/mentionable/folders`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Mentionable Submissions ---
        /**
         * Lists the active submissions in a chat's project that can be mentioned
         * (`{{submissionMention:submissionId}}`).
         * The project is resolved from the chat (project/asset/task topic chats,
         * project-scoped member chats, submission chats and project-scoped AI chats); chats
         * without a project return an empty page. Requires read access to the chat
         * (`canGetChatMentionableSubmissions`). Index pagination only (`page`, `limit` max
         * 100, sort `{ createdAt: -1 }`, also sortable by `subject` and `lastMessageAt`);
         * cursor-pagination params cause a 400.
         * @param {string} chatId - The ID of the chat.
         * @param {GetMentionableSubmissionsParams} [params] - See GetMentionableSubmissionsParams. `nameSearch` is a case-insensitive partial match on the subject.
         * @returns {Promise<PaginatedResponse<MentionableSubmission>>} A paginated list of submissions.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getMentionableSubmissions(chatId, params) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}/mentionable/submissions`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Mentionable Public collections ---
        /**
         * Lists the active public releases (share links) owned by a chat's project that can
         * be mentioned (`{{publicMention:token}}`).
         * The project is resolved from the chat exactly as for `getMentionableSubmissions`;
         * chats without a project return an empty page. Requires read access to the chat
         * (`canGetChatMentionablePublics`). Index pagination only (`page`, `limit` max 100,
         * sort `{ createdAt: -1 }`, also sortable by `title` and `expires`);
         * cursor-pagination params cause a 400.
         * @param {string} chatId - The ID of the chat.
         * @param {GetMentionablePublicsParams} [params] - See GetMentionablePublicsParams. `nameSearch` is a case-insensitive partial match on the title.
         * @returns {Promise<PaginatedResponse<MentionablePublic>>} A paginated list of public releases; use each entry's `token` in the mention.
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getMentionablePublics(chatId, params) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}/mentionable/publics`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Mentionable Tasks (boards addon required) ---
        /**
         * Lists the board tasks that can be mentioned (`{{taskMention:taskId}}`) in a chat.
         * Requires the workspace to have the `boards` capability (`capabilityNotAvailable`
         * / 403 otherwise) and read access to the chat (`canGetChatMentionableTasks`).
         * Project, asset and task topic chats return tasks in the project on boards whose
         * visibility includes the chat's; project-scoped member chats return every board
         * task in the project; submission chats return tasks on reviewer-visible boards;
         * workspace/social member chats return an empty list. Legacy tasks without a board
         * are never returned. Defaults to index pagination (`page`, `limit` max 100, sort
         * `{ updatedAt: -1 }`); pass `paginate: 'cursor'` for cursor pagination.
         * @param {string} chatId - The ID of the chat.
         * @param {GetMentionableTasksParams} [params] - See GetMentionableTasksParams. `nameSearch` matches a subject substring, an exact task number or an exact task ID.
         * @returns {Promise<PaginatedResponse<any>>} A paginated list of task summaries (`id`, `subject`, `taskNumber`, `status`, `projectId`, `boardId`, `assignedToId`, `createdAt`, `updatedAt`).
         * @throws {Error} 'chatId is required.' when `chatId` is falsy.
         */
        async getMentionableTasks(chatId, params) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}/mentionable/tasks`,
                params: params,
                sendJWT: true,
            });
        },
        // --- Highlighting ---
        /**
         * Highlights a message, recording the caller as the highlighter.
         * In topic and submission chats this requires `canHighlightMessage` on the chat; in
         * member chats any member may highlight. For project and asset topic chats a system
         * message is posted in the project chat of the same visibility, a
         * `chatHighlightMessage` notification is sent and project members are emailed.
         * @param {string} messageId - The ID of the message.
         * @returns {Promise<ChatMessageResponse>} The highlighted message.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async highlightMessage(messageId) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/message/${messageId}/highlight`,
                sendJWT: true,
            });
        },
        /**
         * Removes the highlight from a message.
         * Clears the highlighter fields and removes the associated system messages and
         * notification. Same permission as `highlightMessage`.
         * @param {string} messageId - The ID of the message.
         * @returns {Promise<ChatMessageResponse>} The unhighlighted message.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async unhighlightMessage(messageId) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/chats/message/${messageId}/unhighlight`,
                sendJWT: true,
            });
        },
        // --- Short Links ---
        /**
         * Creates a short link for a chat message, or returns the existing one if the
         * message already has a short link.
         * Visibility is inherited from the parent chat (`creator` / `reviewer` for topic
         * chats, `null` for member chats). Requires read access to the message's chat
         * (`canCreateMessageShortLink`).
         * @param {string} messageId - The ID of the message.
         * @returns {Promise<{ code: string; shortUrl: string }>} The 8-character alphanumeric `code` and the complete `shortUrl`.
         * @throws {Error} 'messageId is required.' when `messageId` is falsy.
         */
        async createMessageShortLink(messageId) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/chats/message/${messageId}/shortlink`,
                sendJWT: true,
            });
        },
        // --- Link Previews ---
        /**
         * Fetches Open Graph / meta-tag preview data for one to five URLs.
         * Each preview carries an HMAC-SHA256 `signature` that must be passed back
         * unchanged in `linkPreviews` when creating or revising a message, as the API
         * verifies it to reject spoofed previews. Duplicate URLs are collapsed and URLs
         * that fail validation, fetching or SSRF checks are omitted, so `previews` may be
         * shorter than `urls`. Rate limited to 30 requests per minute per IP.
         * @param {FetchLinkPreviewsData} data - `urls`: 1-5 absolute http(s) URLs, each at most 2048 characters.
         * @returns {Promise<LinkPreviewResponse>} `{ previews }`.
         */
        async fetchLinkPreviews(data) {
            return client._request({
                method: 'POST',
                endpoint: '/v1/link-preview',
                body: data,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=chat.js.map
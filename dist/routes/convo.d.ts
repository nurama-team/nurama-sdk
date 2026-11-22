import NuramaClient from '../NuramaClient.js';
import { type StartConvoRequest, type StartConvoResponse, type GetConvoResponse, type JoinConvoResponse, type LeaveConvoResponse, type CompleteConvoResponse, type UpdateConvoRequest, type UpdateConvoResponse, type GetScopeConvosResponse, type ConvoArtifactPlaybackResponse, type GetMyConvosResponse, type PromoteConvoArtifactRequest, type PromoteConvoArtifactResponse, type ConvoMentionsResponse, type ConvoTasksResponse, type UpdateConvoSummaryResponse, type UpdateConvoMentionsRequest, type SendConvoMentionsResponse, type Convo } from '@nurama/types';
/**
 * Defines convo (video/audio chat) related methods for the NuramaClient.
 * Handles starting, joining, and managing real-time conversations.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the convo-related methods.
 */
export default function createConvoMethods(client: NuramaClient): {
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
    startConvo(data: StartConvoRequest): Promise<StartConvoResponse>;
    /**
     * Get a specific conversation by ID.
     * Requires authentication and permission to view the conversation.
     * @param {string} convoId - The conversation ID.
     * @returns {Promise<GetConvoResponse>} The conversation details.
     * @example
     * const result = await client.convo.getConvo('507f1f77bcf86cd799439011');
     */
    getConvo(convoId: string): Promise<GetConvoResponse>;
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
    joinConvo(convoId: string): Promise<JoinConvoResponse>;
    /**
     * Rejoin an active conversation (page refresh / reconnect).
     * Only returns a new meeting token if the user is already an active participant.
     * No notifications are sent.
     * @param {string} convoId - The conversation ID.
     * @returns {Promise<JoinConvoResponse>} The conversation and meeting token.
     */
    rejoinConvo(convoId: string): Promise<JoinConvoResponse>;
    /**
     * Leave an active conversation.
     * Removes the user from the active participants list.
     * Requires authentication.
     * @param {string} convoId - The conversation ID.
     * @returns {Promise<LeaveConvoResponse>} The updated conversation.
     * @example
     * const result = await client.convo.leaveConvo('507f1f77bcf86cd799439011');
     */
    leaveConvo(convoId: string): Promise<LeaveConvoResponse>;
    /**
     * Mark a conversation as complete.
     * Ends the conversation and triggers recording/transcript processing if enabled.
     * Requires authentication and permission to complete the conversation.
     * @param {string} convoId - The conversation ID.
     * @returns {Promise<CompleteConvoResponse>} The completed conversation.
     * @example
     * const result = await client.convo.completeConvo('507f1f77bcf86cd799439011');
     */
    completeConvo(convoId: string): Promise<CompleteConvoResponse>;
    /**
     * Delete/cancel a conversation.
     * Only the creator can delete a conversation.
     * Requires authentication and permission to delete the conversation.
     * @param {string} convoId - The conversation ID.
     * @returns {Promise<void>} Resolves with no value; the API responds 204.
     * @example
     * await client.convo.deleteConvo('507f1f77bcf86cd799439011');
     */
    deleteConvo(convoId: string): Promise<void>;
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
    updateConvo(convoId: string, data: UpdateConvoRequest): Promise<UpdateConvoResponse>;
    /**
     * List the convos that have taken place in a chat, newest first.
     * Requires read access to the chat.
     * @param {string} chatId - The chat ID.
     * @param {object} [params] - Optional filter.
     * @param {'active'|'completed'|'cancelled'} [params.status] - Only convos in this status.
     * @returns {Promise<Convo[]>} Convos for the chat.
     */
    getChatConvos(chatId: string, params?: {
        status?: "active" | "completed" | "cancelled";
    }): Promise<Convo[]>;
    /**
     * List every convo across all chats in a project (the "Convos drawer"), newest first.
     * Requires `canGetProject` on the project.
     * @param {string} projectId - The project ID.
     * @param {object} [params] - Optional filters.
     * @param {'creator'|'reviewer'} [params.visibility] - Only convos from chats with this visibility.
     * @param {'active'|'completed'|'cancelled'} [params.status] - Only convos in this status.
     * @returns {Promise<Convo[]>} Convos for the project.
     */
    getProjectConvos(projectId: string, params?: {
        visibility?: "creator" | "reviewer";
        status?: "active" | "completed" | "cancelled";
    }): Promise<Convo[]>;
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
    getMyConvos(): Promise<GetMyConvosResponse>;
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
    getConvoArtifactPlayback(convoId: string, kind: "recording" | "transcript", dailyId: string): Promise<ConvoArtifactPlaybackResponse>;
    /**
     * The mentions kept on a convo: the people and assets Nu picked out of its
     * transcript, and any added by hand. Only an admin of the convo's project
     * who was on the call may read them.
     * @param {string} convoId - The conversation ID.
     * @returns {Promise<ConvoMentionsResponse>} Every mention, pending and sent.
     */
    getConvoMentions(convoId: string): Promise<ConvoMentionsResponse>;
    /**
     * Replace a convo's pending mentions with the given list — suggestions
     * kept, plus anyone or anything added by hand. Sent mentions are untouched.
     * @param {string} convoId - The conversation ID.
     * @param {UpdateConvoMentionsRequest} data - The pending list as it should now stand.
     * @returns {Promise<ConvoMentionsResponse>} The convo's mentions after the change.
     */
    updateConvoMentions(convoId: string, data: UpdateConvoMentionsRequest): Promise<ConvoMentionsResponse>;
    /**
     * Send a convo's pending mentions: they are added to the convo's own
     * message in its chat, and each person newly mentioned is told.
     * @param {string} convoId - The conversation ID.
     * @returns {Promise<SendConvoMentionsResponse>} The convo's message, and the mentions now marked sent.
     */
    sendConvoMentions(convoId: string): Promise<SendConvoMentionsResponse>;
    /**
     * Take a sent mention off the convo's message. A person's mention task is
     * deleted with it.
     * @param {string} convoId - The conversation ID.
     * @param {'user'|'asset'} kind - What is mentioned.
     * @param {string} targetId - The user's or asset's id.
     * @returns {Promise<ConvoMentionsResponse>} The convo's mentions after the change.
     */
    removeConvoMention(convoId: string, kind: "user" | "asset", targetId: string): Promise<ConvoMentionsResponse>;
    /**
     * Write or edit a convo's summary by hand. For whoever started the convo
     * and anyone who was on the call; works with AI summaries off.
     * @param {string} convoId - The conversation ID.
     * @param {string} summary - Markdown. Empty removes the summary.
     * @returns {Promise<UpdateConvoSummaryResponse>} The summary as kept.
     */
    updateConvoSummary(convoId: string, summary: string): Promise<UpdateConvoSummaryResponse>;
    /**
     * List the tasks made from a convo, oldest first.
     * @param {string} convoId - The conversation ID.
     * @returns {Promise<ConvoTasksResponse>} The tasks, as a chat draws them on a card.
     */
    getConvoTasks(convoId: string): Promise<ConvoTasksResponse>;
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
    promoteConvoArtifact(convoId: string, kind: "recording" | "transcript", dailyId: string, data?: PromoteConvoArtifactRequest): Promise<PromoteConvoArtifactResponse>;
    getScopeConvos(scopeId: string, params: {
        visibility: string[];
        status?: string;
        search?: string;
        limit?: number;
        cursor?: string;
        includeCounts?: boolean;
    }): Promise<GetScopeConvosResponse>;
};
//# sourceMappingURL=convo.d.ts.map
import NuramaClient from '../NuramaClient.js';
import { type StartConvoRequest, type StartConvoResponse, type GetConvoResponse, type JoinConvoResponse, type LeaveConvoResponse, type CompleteConvoResponse, type UpdateConvoRequest, type UpdateConvoResponse, type GetScopeConvosResponse, type PromoteConvoArtifactRequest, type PromoteConvoArtifactResponse, type Convo } from '@nurama/types';
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
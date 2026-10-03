import NuramaClient from '../NuramaClient.js';
import { type Asset, type Chat, type ChatMessage, type ChatMember, type Folder, type LinkPreview, type Membership, type PaginatedResult, type CursorPaginatedResult } from '@nurama/types';
export interface PaginationParams {
    limit?: number;
    paginate?: 'cursor' | 'index';
    cursor?: string;
    paginateReverse?: boolean;
    includeCounts?: boolean;
    includeCursorRecord?: boolean;
    startAt?: string;
    includeStartAtRecord?: boolean;
    page?: number;
}
export interface SortParams {
    sort?: Record<string, 1 | -1>;
}
export interface DateRangeParams {
    createdBefore?: string | number;
    createdAfter?: string | number;
    updatedBefore?: string | number;
}
export interface CreateTopicChatData {
    topicType: 'project' | 'asset';
    topicId: string;
    subject?: string;
    visibility?: 'creator' | 'reviewer';
}
export interface CreateMemberChatData {
    /** Only `workspace` is accepted by the API; `project` is rejected with 400 (project-scoped member chats are no longer created). */
    scopeType: 'workspace' | 'project';
    scopeId: string;
    subject?: string;
    memberIds: string[];
    /** Optional hex colour from the approved palette (see `GET /config`). */
    color?: string;
}
export interface UpdateChatSubjectData {
    subject: string;
}
export interface UpdateMemberChatData {
    subject?: string;
    color?: string;
}
export interface UpdateMemberChatIconData {
    name: string;
    checksum: string;
    sizeInMB: number;
}
export interface MemberIdList {
    memberIds: string[];
}
export interface FileAttachmentData {
    id: number;
    name: string;
    checksum: string;
    sizeInMB: number;
}
/**
 * Scratch-shape attachment ref — points at bytes already uploaded to a
 * Scratch row. Used by AI Revision (Attach to chat) and the Nurama
 * Support chat (image attachments). The chat-send endpoint accepts
 * either this shape OR the upload-shape (`FileAttachmentData`) in the
 * same `attachments[]` array; `chat.service.createMessage` partitions
 * and routes per-item.
 */
export interface ScratchAttachmentRef {
    scratchId: string;
    name?: string;
}
export interface PercentageCoordinates {
    x: number;
    y: number;
}
export interface BaseAnnotation {
    color?: string;
    frame?: number;
    timestamp?: number;
    startTimestamp?: number;
    endTimestamp?: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
    skewX?: number;
    skewY?: number;
    flipX?: boolean;
    flipY?: boolean;
    originX?: 'left' | 'center' | 'right';
    originY?: 'top' | 'center' | 'bottom';
    opacity?: number;
    visible?: boolean;
    shadow?: {
        color?: string;
        blur?: number;
        offsetX?: number;
        offsetY?: number;
    };
    strokeLineCap?: 'butt' | 'round' | 'square';
    strokeLineJoin?: 'miter' | 'round' | 'bevel';
    strokeMiterLimit?: number;
    strokeDashArray?: number[];
    fillRule?: 'nonzero' | 'evenodd';
}
export interface NestedDotAnnotation extends BaseAnnotation {
    type: 'dot';
    coordinates: PercentageCoordinates;
    radius?: number;
}
export interface NestedShapeAnnotation extends BaseAnnotation {
    type: 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'line';
    coordinates: PercentageCoordinates[];
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
}
export interface NestedTextAnnotation extends BaseAnnotation {
    type: 'text';
    coordinates: PercentageCoordinates;
    content: string;
    fontSize?: number;
    fontFamily?: 'Arial' | 'Helvetica' | 'Times New Roman' | 'Courier New' | 'Georgia' | 'Verdana';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textColor?: string;
}
export interface NestedPathAnnotation extends BaseAnnotation {
    type: 'path';
    pathData: string;
    strokeColor?: string;
    strokeWidth?: number;
}
export type NestedAnnotation = NestedDotAnnotation | NestedShapeAnnotation | NestedTextAnnotation | NestedPathAnnotation;
export interface DotAnnotation extends BaseAnnotation {
    type: 'dot';
    coordinates: PercentageCoordinates;
    radius?: number;
    nestedAnnotations?: NestedAnnotation[];
}
export interface FrameCommentAnnotation extends BaseAnnotation {
    type: 'frameComment';
    nestedAnnotations?: NestedAnnotation[];
}
export interface ShapeAnnotation extends BaseAnnotation {
    type: 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'line';
    coordinates: PercentageCoordinates[];
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
    nestedAnnotations?: NestedAnnotation[];
}
export interface TextAnnotation extends BaseAnnotation {
    type: 'text';
    coordinates: PercentageCoordinates;
    content: string;
    fontSize?: number;
    fontFamily?: 'Arial' | 'Helvetica' | 'Times New Roman' | 'Courier New' | 'Georgia' | 'Verdana';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textColor?: string;
    nestedAnnotations?: NestedAnnotation[];
}
export interface PathAnnotation extends BaseAnnotation {
    type: 'path';
    pathData: string;
    strokeColor?: string;
    strokeWidth?: number;
    nestedAnnotations?: NestedAnnotation[];
}
export type Annotation = DotAnnotation | FrameCommentAnnotation | ShapeAnnotation | TextAnnotation | PathAnnotation;
export interface CreateMessageData {
    content?: string;
    attachments?: (FileAttachmentData | ScratchAttachmentRef)[];
    replyToId?: string;
    annotations?: Annotation[];
    mentions?: string[];
    assetMentions?: string[];
    folderMentions?: string[];
    submissionMentions?: string[];
    publicMentions?: string[];
    taskMentions?: string[];
    quotes?: string[];
    linkPreviews?: LinkPreview[];
    /**
     * AI-chat only. Sent on the regular chat endpoint when the target
     * chat is an AI topic so the orchestrator gets the page snapshot the
     * user was looking at. Regular chats ignore this field.
     */
    pageContext?: {
        path?: string;
        pageTitle?: string;
        visibleAssetIds?: string[];
    };
}
export interface CreateAssetChatAndMessageData extends CreateMessageData {
}
export interface ReviseMessageData {
    content?: string;
    mentions?: string[];
    assetMentions?: string[];
    folderMentions?: string[];
    submissionMentions?: string[];
    publicMentions?: string[];
    taskMentions?: string[];
    annotations?: Annotation[];
    quotes?: string[];
    linkPreviews?: LinkPreview[];
}
export interface FetchLinkPreviewsData {
    urls: string[];
}
export interface LinkPreviewResponse {
    previews: LinkPreview[];
}
export interface CreateReactionData {
    emoji: string;
}
export interface GetUsersMemberChatsParams extends PaginationParams, SortParams, DateRangeParams {
    recentMessages?: number;
    scopeId?: string;
    subjectSearch?: string;
    memberSearch?: string;
    archived?: boolean;
}
export interface GetUsersMentionsParams extends PaginationParams, SortParams, DateRangeParams {
    chatId?: string;
    authorId?: string;
}
export interface GetChatByTopicIdParams extends SortParams {
    topicType: 'project' | 'asset' | string;
    visibility?: 'creator' | 'reviewer';
    messages?: number;
    replies?: number;
}
export interface GetMessagesParams extends PaginationParams, SortParams, DateRangeParams {
    replies?: number;
    replyLimit?: number;
    replySort?: Record<string, 1 | -1>;
    excludeReplies?: boolean;
    contentSearch?: string;
    authorId?: string;
    type?: 'user' | 'system';
    highlighted?: boolean;
    hasAttachments?: boolean;
    hasAnnotations?: boolean;
    isConvoMessage?: boolean;
}
export interface CreateAssetChatAndMessageParams extends SortParams {
    messages?: number;
    replies?: number;
}
export interface GetMessageParams extends SortParams {
    replies?: number;
}
export interface GetRepliesParams extends PaginationParams, SortParams, DateRangeParams {
}
export interface GetMentionableAssetsParams extends PaginationParams, SortParams {
    nameSearch?: string;
}
export interface GetMentionableFoldersParams extends PaginationParams, SortParams {
    nameSearch?: string;
}
export interface GetMentionableTasksParams extends PaginationParams, SortParams {
    nameSearch?: string;
}
export interface GetMentionableSubmissionsParams extends PaginationParams, SortParams {
    nameSearch?: string;
}
export interface GetMentionablePublicsParams extends PaginationParams, SortParams {
    nameSearch?: string;
}
/**
 * Mentionable submission entry returned by
 * `getMentionableSubmissions`. Each submission's `id` doubles as the
 * `chatId` (the ChatSubmission row IS the submission chat).
 */
export interface MentionableSubmission {
    id: string;
    subject: string;
    description: string | null;
    version: string | null;
    status: string;
    totalMessages: number;
    lastMessageAt: string | null;
    publishedAt: string;
    chatId: string;
    creator: {
        id: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
    } | null;
}
/**
 * Mentionable public collection entry returned by
 * `getMentionablePublics`. `token` is the URL-safe stable identifier
 * used in the `publicMention:<token>` message-token payload.
 */
export interface MentionablePublic {
    id: string;
    token: string;
    title: string;
    description: string | null;
    status: string;
    expiresAt: string | null;
    createdAt: string;
    chatId: string | null;
    creator: {
        id: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
    } | null;
}
export type ChatResponse = Chat;
export type MemberChatResponse = ChatMember;
export type ChatMessageResponse = ChatMessage;
export type MemberResponse = Membership;
/** Addable members for a legacy project-scoped member chat, split by the membership they come from. */
export interface AddableMembersByScope {
    projectMembership: MemberResponse[];
    workspaceMembership: MemberResponse[];
}
/**
 * One entry of an upload response: the created asset plus the signed upload data the
 * caller uses to PUT the bytes, or a per-file failure (`status: 'fail'` with `error`).
 */
export interface AttachmentUploadRecord {
    id: number | string;
    name: string;
    status: 'success' | 'fail';
    asset?: Asset;
    signedUrlData?: any;
    uploadChunkSizeInBytes?: number;
    error?: string;
}
export type AttachmentResponse = AttachmentUploadRecord;
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
    results?: T[];
};
/**
 * Defines chat-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the chat-related methods.
 */
export default function createChatMethods(client: NuramaClient): {
    /**
     * Creates a topic chat for a project or asset at a given visibility.
     * Requires `canCreateCreatorChat` (visibility `creator`) or `canCreateReviewerChat`
     * (visibility `reviewer`) on the topic resource. Although `visibility` is optional in
     * the type, the permission check only passes when it is one of those two values, so
     * omitting it results in 403.
     * @param {CreateTopicChatData} data - `topicType` (`project` | `asset`), `topicId`, optional `subject` (max 100 chars) and `visibility`.
     * @returns {Promise<ChatResponse>} The created chat.
     */
    createTopicChat(data: CreateTopicChatData): Promise<ChatResponse>;
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
    getChatByTopicId(topicId: string, params: GetChatByTopicIdParams): Promise<ChatResponse>;
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
    createMemberChat(data: CreateMemberChatData): Promise<MemberChatResponse>;
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
    getUsersMemberChats(params?: GetUsersMemberChatsParams): Promise<PaginatedResponse<MemberChatResponse>>;
    /**
     * Retrieves a member chat by ID without its messages.
     * The caller must be a member of the chat.
     * @param {string} chatId - The ID of the member chat.
     * @returns {Promise<MemberChatResponse>} The member chat with `participants`, `members` and `icon` populated.
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    getMemberChat(chatId: string): Promise<MemberChatResponse>;
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
    getWorkspaceProjectChats(workspaceId: string): Promise<any[]>;
    /**
     * Updates a member chat's subject and/or colour.
     * The caller must be a member of the chat. `subject` is limited to 100 characters
     * and `color` must be one of the approved palette colours.
     * @param {string} chatId - The ID of the member chat.
     * @param {UpdateMemberChatData} data - The new `subject` and/or `color`.
     * @returns {Promise<MemberChatResponse>} The updated member chat.
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    updateMemberChat(chatId: string, data: UpdateMemberChatData): Promise<MemberChatResponse>;
    /**
     * Marks a member chat, its messages and its attachments for deletion.
     * Only the chat's creator may delete it; other members receive 403. From the
     * members' perspective the chat disappears immediately; the rows are removed later
     * by the cleanup service.
     * @param {string} chatId - The ID of the member chat.
     * @returns {Promise<void>} Resolves with `null` (the API sends an empty body).
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    deleteMemberChat(chatId: string): Promise<void>;
    /**
     * Archives a member chat for the calling user only.
     * Adds the caller to the chat's `archivedBy` list; other members' view of the chat
     * is unaffected. The caller must be a member of the chat.
     * @param {string} chatId - The ID of the member chat.
     * @returns {Promise<MemberChatResponse>} The updated member chat.
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    archiveMemberChat(chatId: string): Promise<MemberChatResponse>;
    /**
     * Unarchives a member chat for the calling user only.
     * Removes the caller from the chat's `archivedBy` list. The caller must be a member
     * of the chat.
     * @param {string} chatId - The ID of the member chat.
     * @returns {Promise<MemberChatResponse>} The updated member chat.
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    unarchiveMemberChat(chatId: string): Promise<MemberChatResponse>;
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
    updateMemberChatIcon(chatId: string, data: UpdateMemberChatIconData): Promise<{
        chat: MemberChatResponse;
    } & AttachmentUploadRecord>;
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
    getAddableMembers(chatId: string): Promise<MemberResponse[] | AddableMembersByScope>;
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
    getScopeAddableMembers(scopeType: "workspace" | "project", scopeId: string): Promise<MemberResponse[] | AddableMembersByScope>;
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
    addMembers(chatId: string, data: MemberIdList): Promise<MemberChatResponse>;
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
    removeMembers(chatId: string, data: MemberIdList): Promise<MemberChatResponse>;
    /**
     * Retrieves a topic chat (project, asset, task or public) by ID without its messages.
     * Requires `canGetCreatorChat` or `canGetReviewerChat` on the chat, matching its
     * visibility. Only topic chats are served here; member chats are served by
     * `getMemberChat` and a member chat ID yields `chatNotFound`.
     * @param {string} chatId - The ID of the topic chat.
     * @returns {Promise<ChatResponse>} The chat with `participants` populated.
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    getChat(chatId: string): Promise<ChatResponse>;
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
    updateChatSubject(chatId: string, data: UpdateChatSubjectData): Promise<ChatResponse>;
    /**
     * Marks a topic chat for deletion.
     * In practice this only succeeds for `user`-topic chats owned by the caller: project
     * and asset topic chats are refused with `topicChatsMayNotBeDeleted`, and any other
     * topic type with `unknownError`. Member chats are deleted with `deleteMemberChat`.
     * @param {string} chatId - The ID of the chat.
     * @returns {Promise<void>} Resolves with `null` (the API sends an empty body).
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    deleteChat(chatId: string): Promise<void>;
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
    createMessage(chatId: string, data: CreateMessageData): Promise<ChatMessageResponse>;
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
    createAssetChatAndMessage(assetId: string, visibility: "creator" | "reviewer", data: CreateAssetChatAndMessageData, params?: CreateAssetChatAndMessageParams): Promise<any>;
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
    getMessages(chatId: string, params?: GetMessagesParams): Promise<PaginatedResponse<ChatMessageResponse>>;
    /**
     * Retrieves a single message by ID with its most recent replies.
     * Requires read access to the message's chat (`canGetChatMessage`). `replies`
     * defaults to 10 (max 100) and `sort` (default `{ id: -1 }`) orders the included replies.
     * @param {string} messageId - The ID of the message.
     * @param {GetMessageParams} [params] - See GetMessageParams.
     * @returns {Promise<ChatMessageResponse>} The message.
     * @throws {Error} 'messageId is required.' when `messageId` is falsy.
     */
    getMessage(messageId: string, params?: GetMessageParams): Promise<ChatMessageResponse>;
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
    reviseMessage(messageId: string, data: ReviseMessageData): Promise<ChatMessageResponse>;
    /**
     * Marks a message for deletion.
     * Only the author may delete, and in topic/submission chats they also need
     * `canDeleteOwnChatMessage`. The row is removed later by the cleanup service.
     * @param {string} messageId - The ID of the message.
     * @returns {Promise<ChatMessageResponse>} The deleted message.
     * @throws {Error} 'messageId is required.' when `messageId` is falsy.
     */
    deleteMessage(messageId: string): Promise<ChatMessageResponse>;
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
    getReplies(messageId: string, params?: GetRepliesParams): Promise<PaginatedResponse<ChatMessageResponse>>;
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
    addAttachments(messageId: string, attachments: FileAttachmentData[]): Promise<AttachmentResponse[]>;
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
    removeAttachment(messageId: string, assetId: string): Promise<ChatMessageResponse>;
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
    getMentions(params?: GetUsersMentionsParams): Promise<PaginatedResponse<ChatMessageResponse>>;
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
    createReaction(messageId: string, data: CreateReactionData): Promise<ChatMessageResponse>;
    /**
     * Removes the caller's own reaction from a message.
     * Gated by the same permission as `createReaction`. Calling it when the caller has
     * no reaction is a no-op that still returns the message.
     * @param {string} messageId - The ID of the message.
     * @returns {Promise<ChatMessageResponse>} The updated message.
     * @throws {Error} 'messageId is required.' when `messageId` is falsy.
     */
    removeReaction(messageId: string): Promise<ChatMessageResponse>;
    /**
     * Adds the caller to a chat's following list so they are notified about new
     * messages and updates.
     * Works with topic, member and submission chats and is idempotent. Requires
     * message-create permission on the chat (`canCreateChatMessage`).
     * @param {string} chatId - The ID of the chat to follow.
     * @returns {Promise<void>} Resolves once followed. The API sends an empty body; re-fetch the chat if you need its `following` list.
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    followChat(chatId: string): Promise<void>;
    /**
     * Removes the caller from a chat's following list.
     * Works with topic, member and submission chats and is idempotent. No chat
     * permission is checked, so users can stop notifications for a chat they have
     * since lost access to.
     * @param {string} chatId - The ID of the chat to unfollow.
     * @returns {Promise<void>} Resolves once unfollowed. The API sends an empty body.
     * @throws {Error} 'chatId is required.' when `chatId` is falsy.
     */
    unfollowChat(chatId: string): Promise<void>;
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
    getMentionableAssets(chatId: string, params?: GetMentionableAssetsParams): Promise<PaginatedResponse<Asset>>;
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
    getMentionableFolders(chatId: string, params?: GetMentionableFoldersParams): Promise<PaginatedResponse<Folder>>;
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
    getMentionableSubmissions(chatId: string, params?: GetMentionableSubmissionsParams): Promise<PaginatedResponse<MentionableSubmission>>;
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
    getMentionablePublics(chatId: string, params?: GetMentionablePublicsParams): Promise<PaginatedResponse<MentionablePublic>>;
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
    getMentionableTasks(chatId: string, params?: GetMentionableTasksParams): Promise<PaginatedResponse<any>>;
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
    highlightMessage(messageId: string): Promise<ChatMessageResponse>;
    /**
     * Removes the highlight from a message.
     * Clears the highlighter fields and removes the associated system messages and
     * notification. Same permission as `highlightMessage`.
     * @param {string} messageId - The ID of the message.
     * @returns {Promise<ChatMessageResponse>} The unhighlighted message.
     * @throws {Error} 'messageId is required.' when `messageId` is falsy.
     */
    unhighlightMessage(messageId: string): Promise<ChatMessageResponse>;
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
    createMessageShortLink(messageId: string): Promise<{
        code: string;
        shortUrl: string;
    }>;
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
    fetchLinkPreviews(data: FetchLinkPreviewsData): Promise<LinkPreviewResponse>;
};
//# sourceMappingURL=chat.d.ts.map
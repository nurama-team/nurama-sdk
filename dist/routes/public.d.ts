import NuramaClient from '../NuramaClient.js';
import { type ResolvePublicDownloadResponse, type PublicDownloadUrlResponse, type PublicEmbedFilesResponse } from './shortlink.js';
import { FileSystem, CursorPaginatedResult, DownloadSignedUrlData, ObjectId, Chat, ChatMessage, CreatePublicChatMessageRequest, CreatePublicAssetChatMessageResponse, GetPublicChatMessagesParams, PublicChatMessagesResponse, PublicAssetResponse } from '@nurama/types';
/**
 * Base pagination parameters
 */
export interface PaginationParams {
    limit?: number;
    paginate?: 'cursor' | 'index';
    cursor?: string;
    paginateReverse?: boolean;
    includeCursorRecord?: boolean;
    includeCounts?: boolean;
    startAt?: string;
    includeStartAtRecord?: boolean;
    page?: number;
    sort?: Record<string, 1 | -1>;
}
/**
 * Pagination parameters specific to public routes
 */
export interface PublicPaginationParams extends PaginationParams {
    resourceIds?: ObjectId[];
    resourceSlugs?: string[];
    resourceType?: 'asset' | 'folder';
    resourceTags?: ObjectId[];
    creatorId?: ObjectId;
    mediaTypes?: ('image' | 'video' | 'audio' | 'file' | 'folder')[];
    resourceStatus?: 'active' | 'pendingDelete';
    nameSearch?: string;
    recursiveSearch?: boolean;
}
/**
 * Request body for downloading public assets
 */
export interface DownloadPublicAssetsData {
    assetIds: ObjectId[];
}
/**
 * Response type for paginated public file system items
 */
export type PublicFileSystemResponse = CursorPaginatedResult & {
    results?: FileSystem[];
};
/**
 * Response type for a single public file system
 */
export interface PublicFileSystemDetailsResponse {
    id: string;
    projectId: string;
    token: string;
    title: string;
    description?: string;
    itemPaths: string[];
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    /**
     * Whether unauthenticated visitors may comment on this release by supplying a
     * display name (no account). Drives the anonymous compose flow in the UI.
     */
    allowAnonymousComments?: boolean;
}
/**
 * Defines public route methods for unauthenticated access to public file systems.
 */
export default function createPublicMethods(client: NuramaClient): {
    /**
     * Gets public file system details by token.
     * This endpoint does not require authentication - access is controlled by the token.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @returns {Promise<PublicFileSystemDetailsResponse>} The public file system details.
     *
     * @example
     * ```typescript
     * const publicFileSystem = await nuramaClient.public.getPublicFileSystem('abc123def4');
     * ```
     */
    getPublicFileSystem(token: string): Promise<PublicFileSystemDetailsResponse>;
    /**
     * Gets public items at the root level of a public file system.
     * This endpoint does not require authentication - access is controlled by the token.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {PublicPaginationParams} params - Optional pagination and filtering parameters.
     * @returns {Promise<PublicFileSystemResponse>} Paginated list of public file system items.
     *
     * @example
     * ```typescript
     * const publicItems = await nuramaClient.public.getPublicItems('abc123def4');
     * ```
     */
    getPublicItems(token: string, params?: PublicPaginationParams): Promise<PublicFileSystemResponse>;
    /**
     * Gets public items at a specific path within a public file system.
     * This endpoint does not require authentication - access is controlled by the token.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {string} path - The path within the public file system to retrieve items from.
     * @param {PublicPaginationParams} params - Optional pagination and filtering parameters.
     * @returns {Promise<PublicFileSystemResponse>} Paginated list of public file system items.
     *
     * @example
     * ```typescript
     * const items = await nuramaClient.public.getPublicItemsAtPath('abc123def4', 'folder1/subfolder');
     * ```
     */
    getPublicItemsAtPath(token: string, path: string, params?: PublicPaginationParams): Promise<PublicFileSystemResponse>;
    /**
     * Downloads public assets by generating signed URLs for the original files.
     * This endpoint does not require authentication - access is controlled by the token.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {DownloadPublicAssetsData} downloadData - The asset IDs to download.
     * @returns {Promise<DownloadSignedUrlData[]>} Array of signed download URLs for the requested assets.
     *
     * @example
     * ```typescript
     * const downloadUrls = await nuramaClient.public.downloadAssets('abc123def4', {
     *   assetIds: ['507f1f77bcf86cd799439011', '507f191e810c19729de860ea']
     * });
     * ```
     */
    downloadAssets(token: string, downloadData: DownloadPublicAssetsData): Promise<DownloadSignedUrlData[]>;
    /**
     * Gets the main public file system chat or a specific chat by ID.
     * This endpoint does not require authentication for read access.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {string} [chatId] - Optional specific chat ID to retrieve.
     * @returns {Promise<Chat | null>} The chat object, or null if no main chat exists yet.
     *
     * @example
     * ```typescript
     * // Get main public file system chat
     * const mainChat = await nuramaClient.public.getPublicChat('abc123def4');
     *
     * // Get specific chat by ID
     * const chat = await nuramaClient.public.getPublicChat('abc123def4', 'chat-id-here');
     * ```
     */
    getPublicChat(token: string, chatId?: string): Promise<Chat | null>;
    /**
     * Gets paginated messages for a public chat.
     * This endpoint does not require authentication for read access.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {string} chatId - The ID of the chat to get messages from.
     * @param {GetPublicChatMessagesParams} [params] - Optional pagination parameters.
     * @returns {Promise<PublicChatMessagesResponse>} Paginated list of chat messages.
     *
     * @example
     * ```typescript
     * const messages = await nuramaClient.public.getPublicChatMessages('abc123def4', 'chat-id', {
     *   limit: 20,
     *   paginateReverse: false,
     * });
     * ```
     */
    getPublicChatMessages(token: string, chatId: string, params?: GetPublicChatMessagesParams): Promise<PublicChatMessagesResponse>;
    /**
     * Creates a message in an existing public chat.
     * Requires authentication.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {string} chatId - The ID of the chat to post to.
     * @param {CreatePublicChatMessageRequest} data - The message data.
     * @returns {Promise<ChatMessage>} The created message.
     *
     * @example
     * ```typescript
     * const message = await nuramaClient.public.createPublicChatMessage('abc123def4', 'chat-id', {
     *   content: 'Hello world!',
     * });
     * ```
     */
    createPublicChatMessage(token: string, chatId: string, data: CreatePublicChatMessageRequest): Promise<ChatMessage>;
    /**
     * Creates a message on the main public topic chat.
     * If no main chat exists for this public file system, one is created (lazy creation).
     * Requires authentication.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {CreatePublicChatMessageRequest} data - The message data.
     * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
     *
     * @example
     * ```typescript
     * // This creates the main chat if it doesn't exist and posts the first message
     * const { chat, message } = await nuramaClient.public.createPublicTopicChatMessage('abc123def4', {
     *   content: 'First comment on this public file system!',
     * });
     * ```
     */
    createPublicTopicChatMessage(token: string, data: CreatePublicChatMessageRequest): Promise<CreatePublicAssetChatMessageResponse>;
    /**
     * Gets an asset with its public chat in the context of a public file system.
     * This endpoint does not require authentication for read access.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {string} assetId - The ID of the asset to retrieve.
     * @returns {Promise<PublicAssetResponse>} The asset with its public chat (or null if no chat exists).
     *
     * @example
     * ```typescript
     * const asset = await nuramaClient.public.getPublicAsset('abc123def4', 'asset-id');
     * if (asset.chats.public) {
     *   console.log('Asset has public chat:', asset.chats.public.id);
     * }
     * ```
     */
    getPublicAsset(token: string, assetId: string): Promise<PublicAssetResponse>;
    /**
     * Creates a message on an asset's public chat.
     * If no public chat exists for this asset in this public file system, one is created (lazy creation).
     * Requires authentication.
     *
     * @param {string} token - The 10-character alphanumeric public access token.
     * @param {string} assetId - The ID of the asset to post to.
     * @param {CreatePublicChatMessageRequest} data - The message data.
     * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
     *
     * @example
     * ```typescript
     * // This creates the chat if it doesn't exist and posts the first message
     * const { chat, message } = await nuramaClient.public.createPublicAssetChatMessage('abc123def4', 'asset-id', {
     *   content: 'First comment on this asset!',
     * });
     * ```
     */
    createPublicAssetChatMessage(token: string, assetId: string, data: CreatePublicChatMessageRequest): Promise<CreatePublicAssetChatMessageResponse>;
    /**
     * Resolve a public asset-link token to the minimal file info the download page shows.
     * Public endpoint; no authentication.
     * @param {string} token - The public asset-link token.
     * @returns {Promise<ResolvePublicDownloadResponse>} File name, media type and link status.
     * @throws {Error} 'token is required.' when `token` is falsy.
     */
    resolvePublicDownload(token: string): Promise<ResolvePublicDownloadResponse>;
    /**
     * Get a short-lived signed download URL for a public asset-link token.
     * Public endpoint; fails with 403 for embed-only links.
     * @param {string} token - The public asset-link token.
     * @returns {Promise<PublicDownloadUrlResponse>} The signed URL and its expiry.
     * @throws {Error} 'token is required.' when `token` is falsy.
     */
    getPublicDownloadUrl(token: string): Promise<PublicDownloadUrlResponse>;
    /**
     * Get the HLS stream and fallback media key paths for the embeddable player.
     * Public endpoint; fails with 403 for download-only links.
     * @param {string} token - The public asset-link token.
     * @returns {Promise<PublicEmbedFilesResponse>} Stream and fallback key paths.
     * @throws {Error} 'token is required.' when `token` is falsy.
     */
    getPublicEmbedFiles(token: string): Promise<PublicEmbedFilesResponse>;
    /**
     * Record a play event from the embed player for a public asset link.
     * Public endpoint; no authentication. The API responds 204.
     * @param {string} token - The public asset-link token.
     * @param {object} body - `{ eventType: 'play_started' | 'play_completed' }`.
     * @returns {Promise<void>} Resolves once recorded.
     * @throws {Error} 'token is required.' when `token` is falsy.
     */
    recordAccessActivity(token: string, body: {
        eventType: "play_started" | "play_completed";
    }): Promise<void>;
};
//# sourceMappingURL=public.d.ts.map
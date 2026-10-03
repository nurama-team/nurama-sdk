export interface DocumentViewUrlResponse {
    /** Signed URL for the document's `media` PDF, served inline. */
    url: string;
    /** Unix seconds. Refetch rather than reusing a URL past this. */
    expires: number;
    /** From `meta.document.pageCount`; 0 when processing has not reported it. */
    pageCount: number;
    /**
     * True when the `media` PDF holds only the first `pageCount` pages of a
     * longer document, because post-processing hit its `maxPages` cap. The PDF
     * itself is internally consistent, so this flag is the only way to know.
     */
    pagesTruncated: boolean;
    /**
     * Which end of the document the `media` PDF kept. `'start'` for everything
     * read front-to-back; `'end'` for logs, whose newest lines are at the bottom.
     * Only meaningful when `pagesTruncated` is true.
     */
    truncatedFrom: 'start' | 'end';
    /** Pages in the source document. Equals `pageCount` unless truncated. */
    originalPageCount: number;
}
import NuramaClient from '../NuramaClient.js';
import { type Asset, type File, type AssetReferences } from '@nurama/types';
export interface UpdateAssetData {
    name?: string;
    meta?: Record<string, any>;
    tags?: string[];
    folderId?: string | null;
}
export interface TagAssetData {
    tagId: string;
}
export interface UntagAssetData {
    tagId: string;
}
export interface CreateAssetShortLinkData {
    visibility?: 'creator' | 'reviewer';
}
export interface ShortLink {
    id: string;
    code: string;
    resourceId: string;
    resourceType: 'asset' | 'project' | 'workspace' | 'chatMessage' | 'chatSubmission';
    visibility: 'creator' | 'reviewer' | null;
    creatorId: string;
    createdAt: string;
    updatedAt?: string;
}
export interface CreateAssetShortLinkResponse {
    shortLink: ShortLink;
    shortUrl: string;
}
export type PublicAssetLinkMode = 'download' | 'embed' | 'embed-download';
export interface PublicAssetLink {
    id: string;
    token: string;
    assetId: string;
    projectId: string;
    creatorId: string;
    expires: string | null;
    status: 'active' | 'disabled' | 'expired';
    /**
     * Capability mode for this link.
     * - 'download'        — direct-download link only; embed iframe blocked.
     * - 'embed'           — embeddable iframe only; direct download blocked.
     * - 'embed-download'  — both endpoints allowed (default; backward-compatible).
     * Enforced server-side at /v1/public-download/{token}/download and /embed-files.
     */
    mode?: PublicAssetLinkMode;
    publicUrl: string;
    isExpired?: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface CompleteMultipartUploadData {
    key: string;
    uploadId: string;
    parts: {
        ETag: string;
        PartNumber: number;
    }[];
    assetId: string;
}
export interface MultipartUploadOptions {
    onProgress?: (progress: {
        partNumber: number;
        totalParts: number;
        percentComplete: number;
        totalPercentComplete: number;
    }) => void;
    maxRetries?: number;
    abortSignal?: AbortSignal;
    enableProgressPersistence?: boolean;
    projectId?: string;
    sessionId?: string;
    fileName?: string;
    fileSize?: number;
    assetId?: string;
}
export interface PartUploadOptions {
    onPartProgress?: (progress: {
        partNumber: number;
        totalParts: number;
        partPercent: number;
    }) => void;
    maxRetries?: number;
    abortSignal?: AbortSignal;
}
export interface MultipartUploadResult {
    key: string;
    uploadId: string;
    parts: {
        ETag: string;
        PartNumber: number;
    }[];
}
export interface GetAssetParams {
    chatVisibility?: 'creator' | 'reviewer';
    chatMessageSort?: {
        id?: 1 | -1;
    };
    chatReplySort?: {
        id?: 1 | -1;
    };
    chatMessageLimit?: number;
    chatReplyLimit?: number;
}
export interface GetAssetPageParams {
    sort?: Record<string, 1 | -1>;
    limit?: number;
    visibility?: 'creator' | 'reviewer' | string;
    inFolder?: boolean;
}
export interface Chat {
    _id?: string;
    id?: string;
    totalMessages?: number;
    recentMessages?: any[];
}
export interface AssetWithChats extends Omit<Asset, 'chats'> {
    chats?: {
        creator?: Chat;
        reviewer?: Chat;
    };
}
export type AssetResponse = AssetWithChats;
export type FileResponse = File;
export type AssetPageResponse = {
    page: number;
};
export type RepairAssetsResponse = any[];
export type DownloadAssetsResponse = any[];
/**
 * Defines asset-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the asset-related methods.
 */
export default function createAssetMethods(client: NuramaClient): {
    /**
     * Retrieves a specific asset by its ID with optional chat data.
     * @param {string} assetId - The ID of the asset.
     * @param {GetAssetParams} [params] - Optional parameters for chat data inclusion.
     * @returns {Promise<AssetResponse>} The asset object with optional chat data.
     */
    getAsset(assetId: string, params?: GetAssetParams): Promise<AssetResponse>;
    /**
     * Lists every location an asset is referenced — its primary file system and
     * each secondary reference (reviewer, submission, public), grouped and counted.
     *
     * Renaming an asset retitles it at every one of these locations, and deleting
     * its last primary reference removes them all — so this is what the rename and
     * delete confirmations show the user before either happens.
     *
     * @param {string} assetId - The ID of the asset.
     * @returns {Promise<AssetReferences>} The asset's references.
     */
    getAssetReferences(assetId: string): Promise<AssetReferences>;
    /**
     * Updates an asset.
     * @param {string} assetId - The ID of the asset to update.
     * @param {UpdateAssetData} updateData - Data to update (e.g., name, meta, tags, folderId).
     * @returns {Promise<AssetResponse>} The updated asset object.
     */
    updateAsset(assetId: string, updateData: UpdateAssetData): Promise<AssetResponse>;
    /**
     * Deletes an asset (marks for deletion).
     * @param {string} assetId - The ID of the asset to delete.
     * @returns {Promise<void>}
     */
    deleteAsset(assetId: string): Promise<AssetResponse>;
    /**
     * Retrieves a specific file from an asset.
     * @param {string} assetId - The ID of the asset.
     * @param {string} fileId - The ID of the file.
     * @returns {Promise<FileResponse>} The file object.
     */
    getFile(assetId: string, fileId: string): Promise<FileResponse>;
    /**
     * Retrieves files of a specific function type from an asset.
     * @param {string} assetId - The ID of the asset.
     * @param {string} functionType - The function type of the files (e.g., 'thumbnail', 'original').
     * @returns {Promise<FileResponse[]>} An array of file objects.
     */
    getFilesByFunctionType(assetId: string, functionType: string): Promise<FileResponse[]>;
    /**
     * Complete a multipart upload initiated by `createAssets`.
     *
     * Matches the route (`POST /v1/assets/complete-upload`) and mirrors
     * `nuramaClient.scratch.completeUpload`, so moving between the asset
     * and scratch namespaces uses the same verb.
     *
     * @param {CompleteMultipartUploadData} uploadData - Data including key, uploadId, parts, and assetId.
     * @returns {Promise<any>} S3 completion response.
     */
    completeUpload(uploadData: CompleteMultipartUploadData): Promise<any>;
    /**
     * Uploads a file using multipart upload with the provided signed URLs
     * @param {File|Blob|Buffer|string} file - The file to upload (File/Blob in browser, Buffer/string path in Node.js)
     * @param {string[]} signedUrls - Array of signed URLs for each part
     * @param {string} key - The S3 key for the upload
     * @param {string} uploadId - The S3 uploadId for the multipart upload
     * @param {MultipartUploadOptions} options - Upload options
     * @returns {Promise<MultipartUploadResult>} The completed upload data
     */
    multipartUpload(file: File | Blob | Buffer | string, signedUrls: string[], key: string, uploadId: string, options?: MultipartUploadOptions): Promise<MultipartUploadResult>;
    /**
     * Gets the page number an asset appears on based on specified filters and sorting.
     * @param {string} assetId - The ID of the asset to find the page for.
     * @param {GetAssetPageParams} [params] - Query parameters for sorting, filtering, and pagination limit.
     * @returns {Promise<AssetPageResponse>} Object containing the page number.
     */
    getAssetPage(assetId: string, params?: GetAssetPageParams): Promise<AssetPageResponse>;
    /**
     * Attempts to repair assets (e.g., regenerate signed URLs for pending uploads).
     * @param {string[]} assetIds - An array of asset IDs to repair.
     * @returns {Promise<RepairAssetsResponse>} Array of repair results.
     */
    repairAssets(assetIds: string[]): Promise<RepairAssetsResponse>;
    /**
     * Generates signed download URLs for the original files of specified assets.
     * @param {string[]} assetIds - An array of asset IDs.
     * @returns {Promise<DownloadAssetsResponse>} Array of download URL results.
     */
    downloadAssets(assetIds: string[]): Promise<DownloadAssetsResponse>;
    /**
     * Mints a short-lived signed URL for rendering a document inline.
     *
     * Documents keep their `media` PDF in the private bucket, so unlike images
     * and video it cannot be addressed by keyPath through the file CDN. Fetch
     * this per document open; do not cache it past `expires`.
     *
     * @param {string} assetId - The document asset's ID.
     * @returns {Promise<DocumentViewUrlResponse>} Signed URL, expiry and page count.
     */
    getDocumentViewUrl(assetId: string): Promise<DocumentViewUrlResponse>;
    /**
     * Tags an asset with a specific tag.
     * @param {string} assetId - The ID of the asset to tag.
     * @param {TagAssetData} tagData - Data containing the tag ID.
     * @returns {Promise<AssetResponse>} The updated asset object.
     */
    tagAsset(assetId: string, tagData: TagAssetData): Promise<AssetResponse>;
    /**
     * Untags an asset by removing a specific tag.
     * @param {string} assetId - The ID of the asset to untag.
     * @param {UntagAssetData} untagData - Data containing the tag ID to remove.
     * @returns {Promise<AssetResponse>} The updated asset object.
     */
    untagAsset(assetId: string, untagData: UntagAssetData): Promise<AssetResponse>;
    /**
     * Creates a short link for an asset.
     * If a short link already exists for the asset with the same visibility, returns the existing one.
     * @param {string} assetId - The ID of the asset to create a short link for.
     * @param {CreateAssetShortLinkData} [data] - Optional data including visibility context.
     * @returns {Promise<CreateAssetShortLinkResponse>} The short link object and short URL.
     */
    createShortLink(assetId: string, data?: CreateAssetShortLinkData): Promise<CreateAssetShortLinkResponse>;
    /**
     * Create a public download link for an asset.
     * @param {string} assetId - The asset ID.
     * @param {Object} data - Link creation data.
     * @param {string} data.projectId - The project ID.
     * @param {number} [data.validity] - Link validity in milliseconds.
     * @returns {Promise<PublicAssetLink>} The created public link.
     */
    createPublicLink(assetId: string, data: {
        projectId: string;
        validity?: number;
        mode?: PublicAssetLinkMode;
    }): Promise<PublicAssetLink>;
    /**
     * Get all public download links for an asset.
     * @param {string} assetId - The asset ID.
     * @returns {Promise<{ results: PublicAssetLink[] }>} The public links.
     */
    getPublicLinks(assetId: string, options?: {
        bypassCache?: boolean;
    }): Promise<{
        results: PublicAssetLink[];
    }>;
    /**
     * Update a public download link (extend expiration or change status).
     * @param {string} assetId - The asset ID.
     * @param {string} linkId - The link ID.
     * @param {Object} data - Update data.
     * @returns {Promise<PublicAssetLink>} The updated public link.
     */
    updatePublicLink(assetId: string, linkId: string, data: {
        validity?: number;
        status?: string;
        mode?: PublicAssetLinkMode;
    }): Promise<PublicAssetLink>;
    /**
     * Disable a public download link.
     * @param {string} assetId - The asset ID.
     * @param {string} linkId - The link ID.
     * @returns {Promise<PublicAssetLink>} The disabled public link.
     */
    disablePublicLink(assetId: string, linkId: string): Promise<PublicAssetLink>;
    /**
     * Reactivate a disabled/expired public download link.
     * @param {string} assetId - The asset ID.
     * @param {string} linkId - The link ID.
     * @param {Object} [data] - Reactivation data.
     * @param {number} [data.validity] - New validity in milliseconds.
     * @returns {Promise<PublicAssetLink>} The reactivated public link.
     */
    reactivatePublicLink(assetId: string, linkId: string, data?: {
        validity?: number;
    }): Promise<PublicAssetLink>;
    /**
     * Mint a signed multipart upload URL for a user-supplied custom thumbnail
     * image. The upload lands in the originals bucket tagged so the
     * post-processing Lambda generates the customThumbnail outputs and
     * registers them on the asset via the file-update callback.
     *
     * Caller flow:
     *   1. multipartUpload(file, response.urls, response.key, response.uploadId)
     *   2. completeCustomThumbnailUpload({ assetId, key, uploadId, parts })
     *   3. wait for the assetFileUpdate websocket event
     */
    getCustomThumbnailUploadUrl(assetId: string, data: {
        fileName: string;
        mimeType: string;
        sizeInMB: number;
    }): Promise<{
        fileName: string;
        assetId: string;
        uploadId: string;
        key: string;
        urls: string[];
        mimeType: string;
        expires: number;
        status: string;
    }>;
    /**
     * Finalize the multipart S3 upload for a custom thumbnail. Triggers the
     * post-processing Lambda by committing the S3 object.
     */
    completeCustomThumbnailUpload(assetId: string, data: {
        key: string;
        uploadId: string;
        parts: {
            ETag: string;
            PartNumber: number;
        }[];
    }): Promise<{
        status: string;
        key: string;
    }>;
    /**
     * Remove the custom thumbnail from an asset. Soft-deletes all custom
     * thumb files; the asset falls back to the auto-generated thumbnail.
     */
    removeCustomThumbnail(assetId: string): Promise<Asset>;
    /**
     * Promote a chat-message attachment into a project as a fresh,
     * independent project asset. The source attachment is left untouched;
     * the new project asset has its own lifecycle, post-processing
     * pipeline, and storage footprint.
     *
     * Idempotent: a second promote of the same source into the same
     * project returns the existing promoted asset with `deduped: true`.
     *
     * Requires `canCreateAsset` on the destination project — reviewers
     * are blocked. The server additionally rejects when the source
     * attachment's workspace doesn't match the destination project's.
     */
    promoteAttachmentToProject(assetId: string, payload: {
        projectId: string;
        fileName?: string;
    }): Promise<{
        asset: Asset;
        deduped: boolean;
    }>;
    /**
     * Upload Session Management Methods
     */
    /**
     * Get all active upload sessions for a project
     * @param {string} projectId - The project ID to get sessions for
     * @returns {UploadSessionData[]} Array of upload session data
     */
    getUploadSessions(projectId: string): import("../utils/uploadSessionManager.js").UploadSessionData[];
    /**
     * True when any upload is genuinely in flight anywhere in the app (across
     * all projects and tabs). Intended for app-level guards — e.g. suppressing
     * an automatic version-update page refresh while bytes are still uploading.
     * Stale (crashed-tab) sessions are ignored via the freshness window.
     * @param {number} [staleMs] - Max age of the last progress update that still
     *   counts as active (default: 2 minutes)
     * @returns {boolean}
     */
    hasActiveUploads(staleMs?: number): boolean;
    /**
     * Get a specific upload session
     * @param {string} projectId - The project ID
     * @param {string} sessionId - The session ID
     * @returns {UploadSessionData | null} Upload session data or null if not found
     */
    getUploadSession(projectId: string, sessionId: string): import("../utils/uploadSessionManager.js").UploadSessionData | null;
    /**
     * Remove an upload session
     * @param {string} projectId - The project ID
     * @param {string} sessionId - The session ID
     */
    removeUploadSession(projectId: string, sessionId: string): void;
    /**
     * Clean up old upload sessions for a project
     * @param {string} projectId - The project ID
     * @param {number} [olderThanMs] - Remove sessions older than this (default: 24 hours)
     */
    cleanupUploadSessions(projectId: string, olderThanMs?: number): void;
    /**
     * Register a listener for cross-tab upload session messages
     * @param {string} listenerId - Unique listener ID
     * @param {function} callback - Callback function to handle messages
     */
    onUploadSessionMessage(listenerId: string, callback: (message: any) => void): void;
    /**
     * Unregister a cross-tab upload session message listener
     * @param {string} listenerId - Unique listener ID
     */
    offUploadSessionMessage(listenerId: string): void;
    /**
     * Mark an upload session as completed
     * @param {string} projectId - The project ID
     * @param {string} sessionId - The session ID
     */
    completeUploadSession(projectId: string, sessionId: string): void;
    /**
     * Record an authenticated play event from the in-app player. Fire-and-forget;
     * server returns 204. Throw-on-failure is fine because the caller already
     * de-dupes per session.
     */
    recordAccessActivity(assetId: string, body: {
        eventType: "play_started" | "play_completed";
        visibility: "creator" | "reviewer";
    }): Promise<void>;
    /**
     * Get aggregated access-activity for a single asset. Returns totals per
     * eventType, a breakdown for the requested dimension, and a zero-filled
     * daily series.
     */
    getAssetAccessActivity(assetId: string, params?: {
        range?: "7d" | "30d" | "90d";
        groupBy?: "visibility" | "referrerHost" | "country" | "userAgentClass" | "day";
        eventType?: "play_started" | "play_completed" | "download" | "embed_resolved";
        limit?: number;
    }): Promise<{
        range: string;
        from: string;
        to: string;
        totals: Array<{
            eventType: string;
            count: number;
        }>;
        breakdown: Array<{
            value: string;
            label: string;
            count: number;
        }>;
        series: Array<{
            date: string;
            eventType: string;
            count: number;
        }>;
        groupBy: string;
        eventType: string | null;
    }>;
};
//# sourceMappingURL=asset.d.ts.map
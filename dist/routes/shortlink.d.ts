import NuramaClient from '../NuramaClient.js';
export interface ResolveShortLinkResponse {
    deepLink: string;
    resourceId: string;
    resourceType: 'asset' | 'project' | 'workspace' | 'chatMessage' | 'chatSubmission';
    visibility: 'creator' | 'reviewer' | null;
}
export interface ResolvePublicDownloadResponse {
    token: string;
    fileName: string;
    mediaType: string;
    status: string;
    /**
     * Capability mode of the link. The download page uses this to decide
     * whether to render the inline preview (`embed-download`), the embed-only
     * message (`embed`), or auto-download (`download`). Optional for backward
     * compatibility with older API versions; treat absence as `embed-download`.
     */
    mode?: 'download' | 'embed' | 'embed-download';
    /** Mime type of the original media file, when known. */
    mimeType?: string | null;
    /**
     * For image assets: the keyPath of the image file, used to render an
     * inline preview on the download page. Null for non-image assets (video /
     * audio previews are iframed from the embed page; files render an icon).
     */
    previewKeyPath?: string | null;
}
export interface PublicDownloadUrlResponse {
    url: string;
    fileName: string;
    mimeType: string;
    expires: number;
}
export interface PublicEmbedFilesResponse {
    fileName: string;
    mediaType: 'video' | 'audio' | 'image' | 'file' | string;
    /**
     * Mode of the underlying public link: 'embed' (no download) or 'embed-download'
     * (download allowed alongside embed). 'download' never appears — that mode
     * blocks the embed-files endpoint entirely. Optional for backward compatibility
     * with older API versions; treat absence as 'embed-download'.
     */
    mode?: 'embed' | 'embed-download';
    /** HLS manifest keyPath (e.g. "workspaces/.../stream/index.m3u8"), null if not yet processed. */
    streamKeyPath: string | null;
    /** Original media keyPath used as fallback when no HLS manifest is available. */
    mediaKeyPath: string | null;
    /** Poster image keyPath for video assets (explicit poster, falling back to largest thumbnail). Null when none exists. */
    posterKeyPath: string | null;
    /** Pre-computed waveform peaks JSON keyPath for audio assets. Null for video / when no peaks file exists. */
    waveformKeyPath?: string | null;
    /**
     * Timeline-thumbnail geometry (`asset.meta.storyboard`) for a video's filmstrip and
     * hover preview. Null for non-video assets or video without storyboard sheets.
     * Optional for backward compatibility with older API versions.
     */
    storyboard?: Record<string, unknown> | null;
    /** The storyboard sheet files matching `storyboard.sheets`. Empty when there's no storyboard. */
    storyboardFiles?: Array<{
        name?: string;
        keyPath: string;
    }>;
}
/**
 * Defines short link related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the short link related methods.
 */
export default function createShortLinkMethods(client: NuramaClient): {
    /**
     * Resolves a short link code to its full deep link path.
     * This endpoint is publicly accessible and does not require authentication.
     * @param {string} code - The 8-character alphanumeric short link code.
     * @returns {Promise<ResolveShortLinkResponse>} The resolved deep link information.
     */
    resolveShortLink(code: string): Promise<ResolveShortLinkResponse>;
};
//# sourceMappingURL=shortlink.d.ts.map
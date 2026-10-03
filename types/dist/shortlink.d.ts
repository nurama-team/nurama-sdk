/**
 * ShortLink Type Definitions
 * Short links provide compact, shareable URLs that resolve to full deep link paths.
 */
/**
 * Resource types that can have short links
 */
export type ShortLinkResourceType = 'asset' | 'project' | 'workspace' | 'chatMessage' | 'chatSubmission';
/**
 * Visibility context for short links
 */
export type ShortLinkVisibility = 'creator' | 'reviewer' | null;
/**
 * ShortLink model representing a compact URL that maps to a resource
 */
export interface ShortLink {
    /** ShortLink ID */
    id: string;
    /** Unique 8-character alphanumeric code */
    code: string;
    /** ID of the linked resource */
    resourceId: string;
    /** Type of the linked resource */
    resourceType: ShortLinkResourceType;
    /** Optional visibility context for the short link */
    visibility: ShortLinkVisibility;
    /** ID of the user who created the short link */
    creatorId: string;
    /** When the short link was created */
    createdAt: string;
    /** When the short link was last updated */
    updatedAt: string;
}
/**
 * Request body for creating a short link for an asset
 */
export interface CreateAssetShortLinkBody {
    /** Optional visibility context for the short link */
    visibility?: 'creator' | 'reviewer';
}
/**
 * Response when creating a short link
 */
export interface CreateShortLinkResponse {
    /** The created or existing short link */
    shortLink: ShortLink;
    /** The complete short URL ready for sharing */
    shortUrl: string;
}
/**
 * Response when resolving a short link
 */
export interface ResolveShortLinkResponse {
    /** The full deep link path for navigation */
    deepLink: string;
    /** The ID of the linked resource */
    resourceId: string;
    /** The type of the linked resource */
    resourceType: ShortLinkResourceType;
    /** The visibility context for the resource (if applicable) */
    visibility: ShortLinkVisibility;
}

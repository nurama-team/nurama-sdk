import type { ObjectId } from './common';
import type { PublicUser } from './user';
import type { Project } from './project';
import type { FileSystem } from './file-system';
import type { PaginatedResult, CursorPaginatedResult } from './pagination';
import type { Chat, ChatMessage } from './chat';
import type { Asset } from './asset';

/**
 * Represents a public file system that provides unauthenticated access to shared resources.
 */
export interface PublicFileSystem {
  /**
   * The unique identifier of the public file system.
   * @format objectId
   */
  id: ObjectId;

  /**
   * The 10-character alphanumeric access token for public access.
   * @pattern ^[a-zA-Z0-9]{10}$
   * @example abc123xyz0
   */
  token: string;

  /**
   * The title of the public file system.
   */
  title: string;

  /**
   * Optional description of the public file system.
   */
  description?: string;

  /**
   * Inventory object containing file system structure and metadata.
   */
  inventory?: Record<string, any>;

  /**
   * The ID of the user who created this public file system.
   * @format objectId
   */
  creatorId: ObjectId;

  /**
   * Populated creator user information.
   */
  creator?: ObjectId | PublicUser;

  /**
   * The type of resource that owns this public file system.
   * Currently only 'project' is supported.
   */
  ownerResourceType: 'project';

  /**
   * The ID of the resource that owns this public file system.
   * @format objectId
   */
  ownerResourceId: ObjectId;

  /**
   * Populated owner resource (Project).
   */
  ownerResource?: Project;

  /**
   * The expiration date of the public file system.
   * @format date-time
   */
  expires: string;

  /**
   * The status of the public file system. `unreleased` is a staged release —
   * prepared but not yet released, so it stays externally inaccessible until
   * released (see the public release endpoint).
   */
  status: 'active' | 'disabled' | 'expired' | 'error' | 'unreleased';

  /**
   * Array of item paths included in this public file system.
   */
  itemPaths?: string[];

  /**
   * The timestamp when the public file system was created.
   * @format int64
   */
  createdAt?: number;

  /**
   * The timestamp when the public file system was last updated.
   * @format int64
   */
  updatedAt?: number;

  /**
   * Whether the release suppresses the "Shared by" creator and per-item creators
   * from the public view. Off by default.
   */
  hideCreators?: boolean;

  /**
   * Whether unauthenticated visitors may comment on this release by supplying a
   * display name (no account). Off by default. When true, the frontend allows an
   * anonymous compose flow gated on a locally-stored guest identity.
   */
  allowAnonymousComments?: boolean;
}

/**
 * Response type for public file system details endpoint.
 * This is a simplified view of the public file system for API responses.
 */
export interface PublicFileSystemDetailsResponse {
  /**
   * The unique identifier of the public file system.
   */
  id: string;

  /**
   * The ID of the project that owns this public file system.
   */
  projectId: string;

  /**
   * The 10-character alphanumeric access token.
   */
  token: string;

  /**
   * The title of the public file system.
   */
  title: string;

  /**
   * Optional description of the public file system.
   */
  description?: string;

  /**
   * Array of item paths included in this public file system.
   */
  itemPaths: string[];

  /**
   * The expiration date of the public file system.
   * @format date-time
   */
  expiresAt: string;

  /**
   * The creation date of the public file system.
   * @format date-time
   */
  createdAt: string;

  /**
   * The last update date of the public file system.
   * @format date-time
   */
  updatedAt: string;

  /**
   * Whether unauthenticated visitors may comment on this release by supplying a
   * display name (no account). Off by default. When true, the frontend allows an
   * anonymous compose flow gated on a locally-stored guest identity.
   */
  allowAnonymousComments?: boolean;
}

/**
 * Response type for paginated public file system items using index pagination.
 */
export type PublicFileSystemItemsResponse = PaginatedResult & {
  results?: FileSystem[];
};

/**
 * Response type for paginated public file system items using cursor pagination.
 */
export type CursorPaginatedPublicFileSystemItemsResponse = CursorPaginatedResult & {
  results?: FileSystem[];
};

/**
 * Request body for generating download links for public assets.
 */
export interface PublicDownloadRequest {
  /**
   * Array of asset IDs to generate download links for.
   * @format objectId
   */
  assetIds: ObjectId[];
}

/**
 * Response item for public asset download links.
 */
export interface PublicDownloadResponse {
  /**
   * The asset ID.
   * @format objectId
   */
  assetId: ObjectId;

  /**
   * Signed URL for downloading the asset.
   * @format uri
   */
  downloadUrl: string;

  /**
   * URL expiration time in seconds.
   */
  expiresIn: number;
}

/**
 * Parameters for creating a new public file system.
 */
export interface CreatePublicFileSystemRequest {
  /**
   * Array of file system entry IDs to include in the public share.
   * @format objectId
   */
  fileSystemIds: ObjectId[];

  /**
   * Title for the public file system.
   */
  title: string;

  /**
   * Optional description for the public file system.
   */
  description?: string;

  /**
   * The ID of the user creating the public file system.
   * @format objectId
   */
  creatorId: ObjectId;

  /**
   * The type of resource that will own this public file system.
   */
  ownerResourceType: 'project';

  /**
   * The ID of the resource that will own this public file system.
   * @format objectId
   */
  ownerResourceId: ObjectId;

  /**
   * Validity period in milliseconds (optional, defaults to system setting).
   */
  validity?: number;

  /**
   * When false, the release is staged as `unreleased` — externally inaccessible
   * until it is released. Defaults to true (goes live immediately).
   */
  releaseImmediately?: boolean;
}

/**
 * Parameters for updating a public file system.
 */
export interface UpdatePublicFileSystemRequest {
  /**
   * Updated title for the public file system.
   */
  title?: string;

  /**
   * Updated description for the public file system.
   */
  description?: string;

  /**
   * Updated expiration date.
   * @format date-time
   */
  expires?: string;

  /**
   * Updated status.
   */
  status?: 'active' | 'disabled';
}

// ============================================================================
// Public Chat Types
// ============================================================================

/**
 * Request body for creating a message in a public chat.
 */
export interface CreatePublicChatMessageRequest {
  /**
   * The content of the message.
   * @maxLength 10000
   */
  content?: string;

  /**
   * Array of annotations (for images/videos).
   */
  annotations?: unknown[];

  /**
   * Array of mentioned user IDs.
   * @format objectId
   */
  mentions?: ObjectId[];

  /**
   * Array of mentioned asset IDs.
   * @format objectId
   */
  assetMentions?: ObjectId[];

  /**
   * Array of quoted message IDs.
   * @format objectId
   */
  quotes?: ObjectId[];

  /**
   * ID of the message being replied to.
   * @format objectId
   */
  replyToId?: ObjectId;

  /**
   * Client-generated identity for an anonymous commenter (a UUID persisted in the
   * visitor's localStorage per release token). Keeps two same-named guests
   * distinct. Ignored when the request is authenticated.
   */
  guestId?: string;

  /**
   * Display name for an anonymous commenter. Required (and only used) when posting
   * without authentication on a release that has allowAnonymousComments enabled.
   */
  guestName?: string;

  /**
   * Color the anonymous commenter selected — must be one of the platform's
   * approved colors. Ignored when authenticated.
   */
  guestColor?: string;
}

/**
 * Response for getting an asset with its public chat.
 * Extends Asset with the public chat field in chats.
 */
export interface PublicAssetResponse extends Omit<Asset, 'chats'> {
  /**
   * Chats associated with the asset, including the public chat.
   */
  chats: {
    /**
     * Last message timestamp for creator chat.
     */
    creatorLastMessageAt?: string | null;
    /**
     * Last message timestamp for reviewer chat.
     */
    reviewerLastMessageAt?: string | null;
    /**
     * Creator chat ID.
     * @format objectId
     */
    creator?: ObjectId | null;
    /**
     * Reviewer chat ID.
     * @format objectId
     */
    reviewer?: ObjectId | null;
    /**
     * The public chat for this asset in the context of the public file system.
     * Null if no chat has been created yet (lazy creation).
     */
    public: Chat | null;
  };
}

/**
 * Response for creating a message on an asset's public chat (lazy creation).
 */
export interface CreatePublicAssetChatMessageResponse {
  /**
   * The chat (created if it didn't exist).
   */
  chat: Chat;

  /**
   * The created message.
   */
  message: ChatMessage;
}

/**
 * Parameters for getting public chat messages.
 */
export interface GetPublicChatMessagesParams {
  /**
   * Maximum number of messages to return.
   * @default 20
   */
  limit?: number;

  /**
   * Cursor for pagination.
   */
  cursor?: string;

  /**
   * Whether to paginate in reverse order.
   * @default false
   */
  paginateReverse?: boolean;

  /**
   * Whether to include total counts.
   * @default false
   */
  includeCounts?: boolean;

  /**
   * Start at specific message ID.
   * @format objectId
   */
  startAt?: ObjectId;

  /**
   * Whether to include the startAt record in results.
   * @default true
   */
  includeStartAtRecord?: boolean;

  /**
   * Sort order for messages.
   */
  sort?: Record<string, 1 | -1>;

  /**
   * Number of recent replies to include per message.
   * @default 10
   */
  replies?: number;
}

/**
 * Response for paginated public chat messages.
 */
export type PublicChatMessagesResponse = CursorPaginatedResult & {
  results?: ChatMessage[];
};

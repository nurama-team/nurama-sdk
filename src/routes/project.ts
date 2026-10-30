import NuramaClient from '../NuramaClient.js';
import {
  type Project,
  type Asset,
  type Folder,
  type Chat,
  type ChatMessage,
  type ChatSubmission, // Correct type name
  type PaginatedResult,
  type CursorPaginatedResult,
  type PublicAssetResponse,
  type PublicChatMessagesResponse,
  type CreatePublicChatMessageRequest,
  type CreatePublicAssetChatMessageResponse,
  type SearchProjectParams,
  type SearchResponse,
  type DeleteImpact,
  type FeedEvent,
  type FeedVisibility,
  type ListFeedEventsParams,
  type CursorPaginatedFeedEvents,
  type ReadState,
} from '@nurama/types';

// Combine pagination metadata with a results array
// (Should be defined centrally or imported if used across multiple route files)
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
  results?: T[];
};

// --- Request Body Interfaces ---
export interface CreateProjectData {
    name: string;
    workspaceId: string;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    updateSlug?: boolean;
}

export interface FileUploadData {
    id: number; // Client-side ID, likely ignored by backend but present in tests
    name: string;
    checksum: string;
    sizeInMB: number;
    basePath?: string; // Optional path within the project structure
}

export interface ProjectFileUploadBody {
    files: FileUploadData[];
    destinationPath?: string;
}

export interface LogoUploadData extends FileUploadData {}

export interface CreateSubmissionData {
    itemPaths?: string[];
    subject?: string;
    description?: string;
    version?: string;
    /**
     * When false, the submission is staged as `unreleased` — hidden from
     * reviewers until it is released via `releaseSubmission`. Defaults to true
     * (goes live immediately).
     */
    releaseImmediately?: boolean;
}

export interface AddItemsToSubmissionData {
    itemPaths: string[];
    destinationPath?: string;
}

export interface UpdateSubmissionData {
    subject?: string;
    description?: string;
    version?: string;
}

export interface TagSubmissionData {
    tagId: string;
}

export interface CreateSubmissionFolderData {
    name: string;
    color?: string;
    basePath?: string;
}

export interface GetSubmissionParams {
    chatMessageSort?: {
        id?: 1 | -1;
        createdAt?: 1 | -1;
        updatedAt?: 1 | -1;
    };
    chatReplySort?: {
        id?: 1 | -1;
        createdAt?: 1 | -1;
        updatedAt?: 1 | -1;
    };
    chatMessageLimit?: number;
    chatReplyLimit?: number;
}

export interface MoveSubmissionItemsData {
    itemPaths: string[];
    destinationPath: string;
}

export interface CopySubmissionItemsData {
    itemPaths: string[];
    destinationPath: string;
}

export interface DeleteSubmissionItemsData {
    itemPaths: string[];
}

export interface CreateFolderData {
    name: string;
    color?: string;
    basePath?: string;
}

export interface PublishItemsData {
    resourceIds: string[];
    basePath?: string;
    sendEmailNotification?: boolean;
}

export interface UnpublishItemsData {
    resourceIds: string[];
}

export interface MoveItemsData {
    itemPaths: string[];
    destinationPath: string;
}

/**
 * A move into a virtual folder is not a move. `Public/` and `Submission/`
 * copy the items into that collection; `Review/` publishes them. Both leave
 * the sources in place, and both report through the extra fields below.
 */
export interface MoveItemsResult {
    /** Items copied, or published when `published` is true. */
    count: number;
    /** Set when the destination resolved to a virtual folder. */
    virtualDestination?: boolean;
    /** Set when the destination was `Review/`, so the items were published. */
    published?: boolean;
    /** Items the publish rejected. Empty or absent when everything went through. */
    errors?: Array<{ type: string; data?: unknown; message?: string }>;
}

export interface CopyItemsData {
    itemPaths: string[];
    destinationPath: string;
}

export interface DeleteItemsData {
    itemPaths: string[];
}

// --- Public File System Interfaces ---

export interface CreatePublicFileSystemData {
    itemPaths?: string[];
    title: string;
    description?: string;
    validity?: number; // Validity period in milliseconds
    /** Repress asset/folder creators + the "Shared by" user in the external public API output. */
    hideCreators?: boolean;
    /** Allow unauthenticated visitors to comment with just a display name + color. */
    allowAnonymousComments?: boolean;
    /**
     * When false, the release is staged as `unreleased` — externally
     * inaccessible until it is released via `releasePublicFileSystem`. Defaults
     * to true (goes live immediately).
     */
    releaseImmediately?: boolean;
}

export interface UpdatePublicFileSystemData {
    title?: string;
    description?: string;
    validity?: number; // Validity extension period in milliseconds (from now)
    status?: 'active' | 'disabled' | 'expired' | 'error' | 'unreleased';
    /** Repress asset/folder creators + the "Shared by" user in the external public API output. */
    hideCreators?: boolean;
    /** Allow unauthenticated visitors to comment with just a display name + color. */
    allowAnonymousComments?: boolean;
}

export interface AddItemsToPublicFileSystemData {
    itemPaths: string[];
}

export interface MovePublicItemsData {
    itemPaths: string[];
    destinationPath: string;
}

export interface CopyPublicItemsData {
    itemPaths: string[];
    destinationPath: string;
}

export interface DeletePublicItemsData {
    itemPaths: string[];
}

// --- Query Parameter Interfaces ---

// Base interface for pagination options
export interface PaginationParams {
    limit?: number;
    page?: number; // For index pagination
    paginate?: 'cursor' | 'index'; // Specify pagination type
    cursor?: string; // For cursor pagination
    paginateReverse?: boolean; // For cursor pagination
    includeCursorRecord?: boolean; // For cursor pagination
    startAt?: string; // For cursor pagination - start at a specific record ID
    includeCounts?: boolean; // For cursor pagination - include counts
}

export interface GetItemsAtPathParams extends SortParams, DateRangeParams {
    paginate?: 'cursor' | 'index';
    resourceIds?: string[];
    resourceType?: 'asset' | 'folder';
    resourceTags?: string[];
    creatorId?: string;
    mediaTypes?: ('image' | 'video' | 'folder')[];
    resourceStatus?: 'active' | 'pendingDelete';
    nameSearch?: string;
    limit?: number;
    // Cursor pagination options
    cursor?: string;
    paginateReverse?: boolean;
    includeCounts?: boolean;
    includeCursorRecord?: boolean;
    startAt?: string;
    includeStartAtRecord?: boolean;
    // Index pagination options
    page?: number;
}

export interface SortParams {
    sort?: Record<string, 1 | -1>;
}

export interface DateRangeParams {
    createdBefore?: string | number; // Timestamp or ISO string
    createdAfter?: string | number; // Timestamp or ISO string
}

 
// interface ListProjectsParams extends SortParams, PaginationParams {
//     // No specific project list filters identified in tests yet
// }

export interface ListAssetsParams extends SortParams, PaginationParams, DateRangeParams {
    mediaTypes?: ('image' | 'video' | string)[]; // Allow other types if needed
    includeChats?: boolean;
    folderId?: string;
    ignoreFolder?: boolean;
}

export interface ListFeedParams extends ListAssetsParams {
    // Feed uses similar params to ListAssetsParams
    followedChatsOnly?: boolean;
    hideIfNoChatMessages?: boolean;
    chatMessageSort?: Record<string, 1 | -1>;
    chatReplySort?: Record<string, 1 | -1>;
    chatMessageLimit?: number;
    chatReplyLimit?: number;
}

export interface ListFoldersParams extends SortParams, PaginationParams, DateRangeParams {
    mediaTypes?: ('image' | 'video' | string)[];
    // empty?: boolean; // Test checks for non-empty, API might support this
}

export interface ListSubmissionsParams extends SortParams, PaginationParams, DateRangeParams {
    search?: string;
}

export type PublicFileSystemStatus = 'active' | 'expired' | 'disabled' | 'unreleased';

export interface ListPublicFileSystemsParams extends SortParams, PaginationParams {
    search?: string;
    status?: PublicFileSystemStatus | PublicFileSystemStatus[];
    creatorId?: string;
}

export interface GetHighlightedMessagesParams extends SortParams, PaginationParams {
    // Cursor pagination support for highlighted messages
}

export interface GetPublicChatMessagesParams extends PaginationParams {
    replyLimit?: number;
}

export interface GetChatParams {
    messages?: number;
    replies?: number;
}

// --- Response Interfaces (using imported types) ---
export type ProjectResponse = Project;
export type AssetResponse = Asset;
export type FolderResponse = Folder;
export type ChatResponse = Chat;
export type SubmissionResponse = ChatSubmission; // Use ChatSubmission type

export interface PublicFileSystemResponse {
    id: string;
    projectId: string;
    token: string;
    title: string;
    description?: string;
    itemPaths: string[];
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    hideCreators?: boolean;
    allowAnonymousComments?: boolean;
}

export interface PublicAuditAssetResponse {
    id: string;
    name: string;
    mediaType: string;
    thumbnail: { keyPath: string } | null;
    creator: {
        id: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        avatar?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
        color?: string;
    } | null;
    publicFileSystems: Array<{ id: string; title: string; status: string }>;
    publicLinkCount: number;
    hasActivePublicLink: boolean;
    everPublic: boolean;
    createdAt: string;
}

/**
 * Defines project-related methods for the NuramaClient.
 */
export interface ProjectTopAccessActivityResponse {
    range: string;
    from: string;
    to: string;
    eventType: string;
    results: Array<{ assetId: string; count: number }>;
}

export default function createProjectMethods(client: NuramaClient) {
  return {
    /**
     * Creates a new project.
     * @param {CreateProjectData} projectData - Data for the new project.
     * @returns {Promise<ProjectResponse>} The created project object.
     */
    async createProject(projectData: CreateProjectData): Promise<ProjectResponse> {
      return client._request<ProjectResponse>({
        method: 'POST',
        endpoint: '/v1/projects',
        body: projectData,
        sendJWT: true,
      });
    },

    /**
     * Retrieves projects accessible by the user.
     * NOTE: API endpoint `/v1/projects` does not currently support pagination.
     * @returns {Promise<ProjectResponse[]>} List of project objects.
     */
    async getProjects(): Promise<ProjectResponse[]> {
      return client._request<ProjectResponse[]>({
        method: 'GET',
        endpoint: '/v1/projects',
        sendJWT: true,
      });
    },

    /**
     * Retrieves a specific project by its ID.
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<ProjectResponse>} The project object.
     */
    async getProject(projectId: string): Promise<ProjectResponse> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<ProjectResponse>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}`,
        sendJWT: true,
      });
    },

    /**
     * Updates a project.
     * @param {string} projectId - The ID of the project to update.
     * @param {UpdateProjectData} updateData - Data to update.
     * @returns {Promise<ProjectResponse>} The updated project object.
     */
    async updateProject(projectId: string, updateData: UpdateProjectData): Promise<ProjectResponse> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<ProjectResponse>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}`,
        body: updateData,
        sendJWT: true,
      });
    },

    /**
     * Updates a single project setting (e.g. `aiPolishEnabled`,
     * `aiCustomPreprompt`). Pass `null` to inherit the workspace's value;
     * pass a typed value to override. The valid setting names are validated
     * server-side against `projectService.validProjectSettings`.
     *
     * @param {string} projectId
     * @param {string} name - Setting key (e.g. 'aiPolishEnabled').
     * @param {unknown} value - null (inherit) | boolean | string.
     */
    async updateSetting(projectId: string, name: string, value: unknown): Promise<ProjectResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!name) throw new Error('name is required.');
      return client._request<ProjectResponse>({
        method: 'PATCH',
        endpoint: `/v1/projects/${projectId}/settings/${encodeURIComponent(name)}`,
        body: { value },
        sendJWT: true,
      });
    },

    /**
     * Full-text search across assets, chat messages, and tasks within a project.
     * Results are populated per the content type's native list view (asset →
     * creator/publisher/tags; chatMessage → author/mentions/attachments; task →
     * creator/assignee/project/origin).
     *
     * @param {string} projectId
     * @param {SearchProjectParams} params - At minimum `q`. Optional filters: `contentTypes`, `dateFrom`, `dateTo`, `creatorId`, `sortBy`, `page`, `limit`.
     * @returns {Promise<SearchResponse>} Paginated search results.
     */
    async searchProject(projectId: string, params: SearchProjectParams): Promise<SearchResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!params || !params.q) throw new Error('params.q is required.');
      return client._request<SearchResponse>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/search`,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Deletes a project (marks for deletion).
     * @param {string} projectId - The ID of the project to delete.
     * @returns {Promise<PublicFileSystemResponse>} The deleted public release record.
     */
    async deleteProject(projectId: string): Promise<void> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request({
        method: 'DELETE',
        endpoint: `/v1/projects/${projectId}`,
        sendJWT: true,
      });
    },

    /**
     * Creates a new logo asset for a project.
     * @param {string} projectId - The ID of the project.
     * @param {LogoUploadData} logoData - File metadata for the logo.
     * @returns {Promise<any>} Object containing signed URL data and updated project info.
     */
    async createLogo(projectId: string, logoData: LogoUploadData): Promise<any> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/logo`,
        body: logoData,
        sendJWT: true,
      });
    },

    /**
     * Updates the logo asset for a project.
     * @param {string} projectId - The ID of the project.
     * @param {LogoUploadData} logoData - File metadata for the new logo.
     * @returns {Promise<any>} Object containing signed URL data and updated project info.
     */
    async updateLogo(projectId: string, logoData: LogoUploadData): Promise<any> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/logo`,
        body: logoData,
        sendJWT: true,
      });
    },

    /**
     * Create assets within a project and return their signed links for upload.
     * @param {string} projectId - The ID of the project.
     * @param {ProjectFileUploadBody} fileUploadBody - List of files to upload with optional destination path.
     * @returns {Promise<any[]>} Array of results, each containing asset info and signed URL data.
     */
    async createAssets(projectId: string, fileUploadBody: ProjectFileUploadBody): Promise<any[]> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<any[]>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}`,
        body: fileUploadBody,
        sendJWT: true,
      });
    },

    // --- Asset Listing ---

    /**
     * Gets the home feed for a project with a specified visibility.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {ListFeedParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<AssetResponse>>} Paginated feed items.
     */
    async getHomeFeed(projectId: string, visibility: 'creator' | 'reviewer', params?: ListFeedParams): Promise<PaginatedResponse<AssetResponse>> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');
      
      return client._request<PaginatedResponse<AssetResponse>>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/feed/${visibility}`,
        params: params,
        sendJWT: true,
      });
    },

    // --- Event Feed ---

    /**
     * Gets one page of the project's event feed (uploads, asset discussions,
     * publishes, submissions and public releases), most recent activity first.
     * The creator and reviewer feeds never share events.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - Which feed to read.
     * @param {ListFeedEventsParams} [params] - Filters and cursor.
     * @returns {Promise<CursorPaginatedFeedEvents>} One page of feed events.
     */
    async getFeedEvents(projectId: string, visibility: FeedVisibility, params?: ListFeedEventsParams): Promise<CursorPaginatedFeedEvents> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');

      return client._request<CursorPaginatedFeedEvents>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/feed-events/${visibility}`,
        params,
        sendJWT: true,
      });
    },

    /**
     * Sets your reaction on a feed event. One per person — a new emoji
     * replaces your previous one.
     * @returns {Promise<FeedEvent>} The updated event.
     */
    async setFeedEventReaction(projectId: string, visibility: FeedVisibility, eventId: string, emoji: string): Promise<FeedEvent> {
      if (!projectId || !visibility || !eventId) throw new Error('projectId, visibility and eventId are required.');
      if (!emoji) throw new Error('emoji is required.');

      return client._request<FeedEvent>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/feed-events/${visibility}/${eventId}/reaction`,
        body: { emoji },
        sendJWT: true,
      });
    },

    /**
     * Removes your reaction from a feed event.
     * @returns {Promise<FeedEvent>} The updated event.
     */
    async removeFeedEventReaction(projectId: string, visibility: FeedVisibility, eventId: string): Promise<FeedEvent> {
      if (!projectId || !visibility || !eventId) throw new Error('projectId, visibility and eventId are required.');

      return client._request<FeedEvent>({
        method: 'DELETE',
        endpoint: `/v1/projects/${projectId}/feed-events/${visibility}/${eventId}/reaction`,
        sendJWT: true,
      });
    },

    /**
     * Gets where you had read up to in a project feed, and how many cards have
     * moved since. `lastReadAt` is null if you have never recorded a position,
     * and `unreadCount` is 0 then. Cards you are the actor on never count.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - Which feed to read.
     * @returns {Promise<ReadState>} Your reading position in that feed.
     */
    async getFeedReadState(projectId: string, visibility: FeedVisibility): Promise<ReadState> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');

      return client._request<ReadState>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/feed-events/${visibility}/read-state`,
        sendJWT: true,
      });
    },

    /**
     * Marks a project feed as caught up. Pass `lastReadAt` (epoch ms) to catch
     * up to the newest card you had loaded; omit it to catch up to now. The
     * marker only moves forward and never past the present, so a stale value is
     * a no-op rather than an error.
     * @returns {Promise<ReadState>} Your updated reading position.
     */
    async markFeedCaughtUp(projectId: string, visibility: FeedVisibility, lastReadAt?: number): Promise<ReadState> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');

      return client._request<ReadState>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/feed-events/${visibility}/read-state`,
        body: lastReadAt === undefined ? {} : { lastReadAt },
        sendJWT: true,
      });
    },

    // --- Folder Listing ---

    /**
     * Gets folders within a project with specified visibility.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {ListFoldersParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<FolderResponse>>} Paginated list of folders.
     */
    async getFolders(projectId: string, visibility: 'creator' | 'reviewer', params?: ListFoldersParams): Promise<PaginatedResponse<FolderResponse>> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');

      // Use file system API with folder filter
      const fileSystemParams: GetItemsAtPathParams = {
        ...(params as object),
        resourceType: 'folder',
        mediaTypes: ['folder'],
      };
      
      return this.getItemsAtPath(projectId, visibility, '', fileSystemParams) as Promise<PaginatedResponse<FolderResponse>>;
    },

    // --- Chat ---

    /**
     * Gets the project chat with the specified visibility.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {GetChatParams} [params] - Query parameters for message/reply limits.
     * @returns {Promise<ChatResponse>} The chat object.
     */
    async getProjectChat(projectId: string, visibility: 'creator' | 'reviewer', params?: GetChatParams): Promise<ChatResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');
      
      return client._request<ChatResponse>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/chat/${visibility}`,
        params: params,
        sendJWT: true,
      });
    },

    // --- Submissions ---

    /**
     * Creates a new submission for a project.
     * @param {string} projectId - The ID of the project.
     * @param {CreateSubmissionData} submissionData - Data for the submission.
     * @returns {Promise<SubmissionResponse>} The created submission object.
     */
    async createSubmission(projectId: string, submissionData: CreateSubmissionData): Promise<SubmissionResponse> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<SubmissionResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/submission`,
        body: submissionData,
        sendJWT: true,
      });
    },

    /**
     * Adds items to an existing submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {AddItemsToSubmissionData} addItemsData - Data for adding items to the submission.
     * @returns {Promise<SubmissionResponse>} The updated submission object.
     */
    async addItemsToSubmission(projectId: string, submissionId: string, addItemsData: AddItemsToSubmissionData): Promise<SubmissionResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<SubmissionResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/add`,
        body: addItemsData,
        sendJWT: true,
      });
    },

    /**
     * Retrieves submissions for a project.
     * @param {string} projectId - The ID of the project.
     * @param {ListSubmissionsParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<SubmissionResponse>>} Paginated list of submissions.
     */
    async getSubmissions(projectId: string, params?: ListSubmissionsParams): Promise<PaginatedResponse<SubmissionResponse>> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<PaginatedResponse<SubmissionResponse>>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/submission`,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Retrieves a specific submission by its ID.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {GetSubmissionParams} [params] - Query parameters for chat message/reply options.
     * @returns {Promise<SubmissionResponse>} The submission object.
     */
    async getSubmission(projectId: string, submissionId: string, params?: GetSubmissionParams): Promise<SubmissionResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<SubmissionResponse>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}`,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Updates a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {UpdateSubmissionData} updateData - Data to update.
     * @returns {Promise<SubmissionResponse>} The updated submission object.
     */
    async updateSubmission(projectId: string, submissionId: string, updateData: UpdateSubmissionData): Promise<SubmissionResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<SubmissionResponse>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}`,
        body: updateData,
        sendJWT: true,
      });
    },

    /**
     * Releases a staged (unreleased) submission, making it visible to reviewers
     * and firing the deferred "new submission" side effects (emails,
     * notifications, system messages).
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @returns {Promise<SubmissionResponse>} The released submission object.
     */
    async releaseSubmission(projectId: string, submissionId: string): Promise<SubmissionResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<SubmissionResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/release`,
        sendJWT: true,
      });
    },

    /**
     * Re-releases an already-released submission's side effects (the "Release
     * Update" action) — re-notifies reviewers with the submission-update email
     * template + `submissionUpdate` notification. Does not change status.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @returns {Promise<SubmissionResponse>} The submission object.
     */
    async releaseSubmissionUpdate(projectId: string, submissionId: string): Promise<SubmissionResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<SubmissionResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/release-update`,
        sendJWT: true,
      });
    },

    /**
     * Gets files for a specific submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {string} [path] - The path to get items from (optional, defaults to root).
     * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<any>>} Paginated list of files.
     */
    async getSubmissionItems(projectId: string, submissionId: string, path?: string, params?: GetItemsAtPathParams): Promise<PaginatedResponse<any>> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');

      // Build endpoint with optional path segment (backend supports wildcard paths)
      let endpoint = `/v1/projects/${projectId}/submission/${submissionId}/files`;
      if (path && typeof path === 'string' && path.trim() !== '') {
        // Add path to URL - backend route supports /:path(*) wildcard
        endpoint += `/${encodeURIComponent(path)}`;
      }
      
      return client._request<PaginatedResponse<any>>({
        method: 'GET',
        endpoint,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Creates a folder within a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {CreateSubmissionFolderData} folderData - Data for creating the folder.
     * @returns {Promise<FolderResponse>} The created folder object.
     */
    async createSubmissionFolder(projectId: string, submissionId: string, folderData: CreateSubmissionFolderData): Promise<FolderResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<FolderResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/create-folder`,
        body: folderData,
        sendJWT: true,
      });
    },

    /**
     * Moves items within a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {MoveSubmissionItemsData} moveData - Data for moving items.
     * @returns {Promise<{count: number}>} Object containing the count of moved items.
     */
    async moveSubmissionItems(projectId: string, submissionId: string, moveData: MoveSubmissionItemsData): Promise<{count: number}> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<{count: number}>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/move`,
        body: moveData,
        sendJWT: true,
      });
    },

    /**
     * Copies items within a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {CopySubmissionItemsData} copyData - Data for copying items.
     * @returns {Promise<{count: number}>} Object containing the count of copied items.
     */
    async copySubmissionItems(projectId: string, submissionId: string, copyData: CopySubmissionItemsData): Promise<{count: number}> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<{count: number}>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/copy`,
        body: copyData,
        sendJWT: true,
      });
    },

    /**
     * Deletes items within a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {DeleteSubmissionItemsData} deleteData - Data for deleting items.
     * @returns {Promise<{count: number}>} Object containing the count of deleted items.
     */
    async deleteSubmissionItems(projectId: string, submissionId: string, deleteData: DeleteSubmissionItemsData): Promise<{count: number}> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<{count: number}>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/files/delete`,
        body: deleteData,
        sendJWT: true,
      });
    },

    /**
     * Adds a tag to a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {TagSubmissionData} tagData - Data for tagging the submission.
     * @returns {Promise<SubmissionResponse>} The updated submission object.
     */
    async tagSubmission(projectId: string, submissionId: string, tagData: TagSubmissionData): Promise<SubmissionResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<SubmissionResponse>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/tag`,
        body: tagData,
        sendJWT: true,
      });
    },

    /**
     * Removes a tag from a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {TagSubmissionData} tagData - Data for untagging the submission.
     * @returns {Promise<SubmissionResponse>} The updated submission object.
     */
    async untagSubmission(projectId: string, submissionId: string, tagData: TagSubmissionData): Promise<SubmissionResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!submissionId) throw new Error('submissionId is required.');
      return client._request<SubmissionResponse>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/submission/${submissionId}/untag`,
        body: tagData,
        sendJWT: true,
      });
    },

    // --- Publishing / File System Functions ---

    /**
     * Publishes a list of items (assets, folders) within a project.
     * @param {string} projectId - The ID of the project.
     * @param {PublishItemsData} publishData - Data for publishing items.
     * @returns {Promise<any>} Object containing lists of published items and results.
     */
    async publishItems(projectId: string, publishData: PublishItemsData): Promise<any> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<any>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/publish`,
        body: publishData,
        sendJWT: true,
      });
    },

    /**
     * Unpublishes a list of items (assets, folders) within a project.
     * @param {string} projectId - The ID of the project.
     * @param {UnpublishItemsData} unpublishData - Data for unpublishing items.
     * @returns {Promise<any>} Object containing lists of unpublished items and results.
     */
    async unpublishItems(projectId: string, unpublishData: UnpublishItemsData): Promise<any> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<any>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/unpublish`,
        body: unpublishData,
        sendJWT: true,
      });
    },

    /**
     * Creates a folder within a project with file system integration.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {CreateFolderData} folderData - Data for creating the folder.
     * @returns {Promise<FolderResponse>} The created folder object.
     */
    async createFolder(projectId: string, visibility: 'creator' | 'reviewer', folderData: CreateFolderData): Promise<FolderResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');
      return client._request<FolderResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/files/${visibility}/create-folder`,
        body: folderData,
        sendJWT: true,
      });
    },

    /**
     * Gets items at a specific path within a project.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {string} [path] - The path to get items from (optional, defaults to root).
     * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
     * @param {boolean} [usePost] - Whether to use POST method (useful for large resourceIds arrays).
     * @returns {Promise<PaginatedResponse<any>>} Paginated list of items at the path.
     */
    async getItemsAtPath(projectId: string, visibility: 'creator' | 'reviewer', path?: string, params?: GetItemsAtPathParams, usePost: boolean = false): Promise<PaginatedResponse<any>> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');
      
      let endpoint = `/v1/projects/${projectId}/files/${visibility}`;
      if (path && path.trim() !== '') {
        endpoint += `/${encodeURIComponent(path)}`;
      }
      
      // Use POST method if specified (useful for large resourceIds arrays)
      const method = usePost ? 'POST' : 'GET';
      
      return client._request<PaginatedResponse<any>>({
        method: method,
        endpoint: endpoint,
        params: method === 'GET' ? params : undefined,
        body: method === 'POST' ? params : undefined,
        sendJWT: true,
      });
    },

    /**
     * Moves items to a specific path within a project.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {MoveItemsData} moveData - Data for moving items.
     * @returns {Promise<{count: number}>} Object containing the count of moved items.
     */
    async moveItemsToPath(projectId: string, visibility: 'creator' | 'reviewer', moveData: MoveItemsData): Promise<MoveItemsResult> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');
      return client._request<MoveItemsResult>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/files/${visibility}/move`,
        body: moveData,
        sendJWT: true,
      });
    },

    /**
     * Copies items to a specific path within a project.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {CopyItemsData} copyData - Data for copying items.
     * @returns {Promise<{count: number}>} Object containing the count of copied items.
     */
    async copyItemsToPath(projectId: string, visibility: 'creator' | 'reviewer', copyData: CopyItemsData): Promise<{count: number}> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');
      return client._request<{count: number}>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/files/${visibility}/copy`,
        body: copyData,
        sendJWT: true,
      });
    },

    /**
     * Deletes items at a specific path within a project.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {DeleteItemsData} deleteData - Data for deleting items.
     * @returns {Promise<{count: number}>} Object containing the count of deleted items.
     */
    async deleteItemsAtPath(projectId: string, visibility: 'creator' | 'reviewer', deleteData: DeleteItemsData): Promise<{count: number}> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');
      return client._request<{count: number}>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/files/${visibility}/delete`,
        body: deleteData,
        sendJWT: true,
      });
    },

    /**
     * Asks what deleting these paths would reach, without deleting anything.
     *
     * Computed from the same cascade the delete runs, so the answer is what
     * will happen rather than an estimate of it. Only SECONDARY references
     * come back — the reviewer, submission and public-release copies that
     * would go with the selection.
     *
     * @param {string} projectId
     * @param {'creator'|'reviewer'} visibility
     * @param {DeleteItemsData} deleteData - The same body the delete takes.
     * @returns {Promise<DeleteImpact>}
     */
    async previewDeleteItemsAtPath(
      projectId: string,
      visibility: 'creator' | 'reviewer',
      deleteData: DeleteItemsData,
    ): Promise<DeleteImpact> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required (creator or reviewer).');
      return client._request<DeleteImpact>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/files/${visibility}/delete-preview`,
        body: deleteData,
        sendJWT: true,
      });
    },

    // --- Public File System Methods ---

    /**
     * Gets all public file systems for a project.
     * @param {string} projectId - The ID of the project.
     * @param {ListPublicFileSystemsParams} [params] - Query parameters (pagination, sort, search, status, creatorId).
     * @returns {Promise<PaginatedResponse<PublicFileSystemResponse>>} Paginated list of public file systems.
     */
    async getPublicFileSystems(projectId: string, params?: ListPublicFileSystemsParams): Promise<PaginatedResponse<PublicFileSystemResponse>> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<PaginatedResponse<PublicFileSystemResponse>>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/public`,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Get the public audit for a project — assets that are or have been publicly exposed.
     *
     * @requires `projectAdmin` or `projectOwner` on the project (or workspace-tier admin via inheritance).
     * @param {string} projectId
     * @param {Object} [params]
     * @param {boolean} [params.currentlyPublic=false] - When true, only assets currently public.
     * @param {number} [params.page]
     * @param {number} [params.limit]
     */
    async getPublicAudit(
      projectId: string,
      params?: { currentlyPublic?: boolean; page?: number; limit?: number },
    ): Promise<PaginatedResponse<PublicAuditAssetResponse>> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<PaginatedResponse<PublicAuditAssetResponse>>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/public-audit`,
        params,
        sendJWT: true,
      });
    },

    /**
     * Creates a public file system with a secure token for sharing project assets publicly.
     * @param {string} projectId - The ID of the project.
     * @param {CreatePublicFileSystemData} publicFileSystemData - Data for creating the public file system.
     * @returns {Promise<PublicFileSystemResponse>} The created public file system object.
     */
    async createPublicFileSystem(projectId: string, publicFileSystemData: CreatePublicFileSystemData): Promise<PublicFileSystemResponse> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<PublicFileSystemResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/public`,
        body: publicFileSystemData,
        sendJWT: true,
      });
    },

    /**
     * Updates an existing public file system's title and description.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @param {UpdatePublicFileSystemData} updateData - Data to update.
     * @returns {Promise<PublicFileSystemResponse>} The updated public file system object.
     */
    async updatePublicFileSystem(projectId: string, publicId: string, updateData: UpdatePublicFileSystemData): Promise<PublicFileSystemResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!publicId) throw new Error('publicId is required.');
      return client._request<PublicFileSystemResponse>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/public/${publicId}`,
        body: updateData,
        sendJWT: true,
      });
    },

    /**
     * Releases a staged (unreleased) public file system, making it externally
     * accessible via its public token.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @returns {Promise<PublicFileSystemResponse>} The released public file system object.
     */
    async releasePublicFileSystem(projectId: string, publicId: string): Promise<PublicFileSystemResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!publicId) throw new Error('publicId is required.');
      return client._request<PublicFileSystemResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/public/${publicId}/release`,
        sendJWT: true,
      });
    },

    /**
     * Retrieves a specific public file system by its ID.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @returns {Promise<PublicFileSystemResponse>} The public file system object.
     */
    async getPublicFileSystem(projectId: string, publicId: string): Promise<PublicFileSystemResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!publicId) throw new Error('publicId is required.');
      return client._request<PublicFileSystemResponse>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/public/${publicId}`,
        sendJWT: true,
      });
    },

    /**
     * Deletes a public file system and invalidates its access token.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @returns {Promise<PublicFileSystemResponse>} The deleted public release record.
     */
    async deletePublicFileSystem(projectId: string, publicId: string): Promise<PublicFileSystemResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!publicId) throw new Error('publicId is required.');
      return client._request({
        method: 'DELETE',
        endpoint: `/v1/projects/${projectId}/public/${publicId}`,
        sendJWT: true,
      });
    },

    /**
     * Adds additional items to an existing public file system.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @param {AddItemsToPublicFileSystemData} addItemsData - Data for adding items.
     * @returns {Promise<PublicFileSystemResponse>} The updated public file system object.
     */
    async addItemsToPublicFileSystem(projectId: string, publicId: string, addItemsData: AddItemsToPublicFileSystemData): Promise<PublicFileSystemResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!publicId) throw new Error('publicId is required.');
      return client._request<PublicFileSystemResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/public/${publicId}/add`,
        body: addItemsData,
        sendJWT: true,
      });
    },

    /**
     * Gets items from a public file system at a specific path (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {string} [path] - The path to get items from (optional, defaults to root).
     * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<any>>} Paginated list of public file system items.
     */
    async getPublicItemsAtPath(projectId: string, token: string, path?: string, params?: GetItemsAtPathParams): Promise<PaginatedResponse<any>> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');

      let endpoint = `/v1/projects/${projectId}/public/${token}/files`;
      if (path && path.trim() !== '') {
        endpoint += `/${encodeURIComponent(path)}`;
      }

      return client._request<PaginatedResponse<any>>({
        method: 'GET',
        endpoint,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Moves items within a public file system (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {MovePublicItemsData} moveData - Data for moving items.
     * @returns {Promise<{count: number}>} Object containing the count of moved items.
     */
    async movePublicItemsAtPath(projectId: string, token: string, moveData: MovePublicItemsData): Promise<{count: number}> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');
      return client._request<{count: number}>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/public/${token}/files/move`,
        body: moveData,
        sendJWT: true,
      });
    },

    /**
     * Copies items within a public file system (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {CopyPublicItemsData} copyData - Data for copying items.
     * @returns {Promise<{count: number}>} Object containing the count of copied items.
     */
    async copyPublicItemsAtPath(projectId: string, token: string, copyData: CopyPublicItemsData): Promise<{count: number}> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');
      return client._request<{count: number}>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/public/${token}/files/copy`,
        body: copyData,
        sendJWT: true,
      });
    },

    /**
     * Deletes items from a public file system (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {DeletePublicItemsData} deleteData - Data for deleting items.
     * @returns {Promise<{count: number}>} Object containing the count of deleted items.
     */
    async deletePublicItemsAtPath(projectId: string, token: string, deleteData: DeletePublicItemsData): Promise<{count: number}> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');
      return client._request<{count: number}>({
        method: 'PUT',
        endpoint: `/v1/projects/${projectId}/public/${token}/files/delete`,
        body: deleteData,
        sendJWT: true,
      });
    },

    /**
     * Creates a folder inside a public file system (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {CreateFolderData} folderData - Data for creating the folder (name, color, basePath).
     * @returns {Promise<FolderResponse>} The created folder object.
     */
    async createPublicFolder(projectId: string, token: string, folderData: CreateFolderData): Promise<FolderResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');
      return client._request<FolderResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/public/${token}/files/create-folder`,
        body: folderData,
        sendJWT: true,
      });
    },

    /**
     * Gets a public chat from an authenticated project context.
     * Unlike the public endpoint, this does NOT check token expiration.
     * Use this for internal management of public file systems.
     *
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @returns {Promise<any>} The public chat or null if none exists.
     */
    async getProjectPublicChat(projectId: string, token: string): Promise<any> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');

      return client._request<any>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/public/${token}/chat`,
        sendJWT: true,
      });
    },

    /**
     * Gets a public asset with its public chat from an authenticated project context.
     * Unlike the public endpoint, this does NOT check token expiration.
     * Use this for internal management of public file systems.
     *
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {string} assetId - The ID of the asset to retrieve.
     * @returns {Promise<PublicAssetResponse>} The asset with its public chat.
     */
    async getProjectPublicAsset(projectId: string, token: string, assetId: string): Promise<PublicAssetResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');
      if (!assetId) throw new Error('assetId is required.');

      return client._request<PublicAssetResponse>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/public/${token}/assets/${assetId}`,
        sendJWT: true,
      });
    },

    /**
     * Gets messages from a public chat from an authenticated project context.
     * Unlike the public endpoint, this does NOT check token expiration.
     * Use this for internal management of public file systems.
     *
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {string} chatId - The ID of the chat.
     * @param {GetPublicChatMessagesParams} [params] - Query parameters for pagination.
     * @returns {Promise<PublicChatMessagesResponse>} Paginated list of chat messages.
     */
    async getProjectPublicChatMessages(
      projectId: string,
      token: string,
      chatId: string,
      params?: GetPublicChatMessagesParams
    ): Promise<PublicChatMessagesResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');
      if (!chatId) throw new Error('chatId is required.');

      return client._request<PublicChatMessagesResponse>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/public/${token}/chat/${chatId}/messages`,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Creates a message in an existing public chat from an authenticated project context.
     * Unlike the public endpoint, this does NOT check token expiration.
     *
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {string} chatId - The ID of the chat.
     * @param {CreatePublicChatMessageRequest} data - Message data.
     * @returns {Promise<ChatMessage>} The created message.
     */
    async createProjectPublicChatMessage(
      projectId: string,
      token: string,
      chatId: string,
      data: CreatePublicChatMessageRequest
    ): Promise<ChatMessage> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');
      if (!chatId) throw new Error('chatId is required.');

      return client._request<ChatMessage>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/public/${token}/chat/${chatId}/messages`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Creates a message on the main public topic chat from an authenticated project context.
     * Creates the chat lazily if it doesn't exist yet.
     * Unlike the public endpoint, this does NOT check token expiration.
     *
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {CreatePublicChatMessageRequest} data - Message data.
     * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
     */
    async createProjectPublicTopicChatMessage(
      projectId: string,
      token: string,
      data: CreatePublicChatMessageRequest
    ): Promise<CreatePublicAssetChatMessageResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');

      return client._request<CreatePublicAssetChatMessageResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/public/${token}/chat/messages`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Creates a message on an asset's public chat from an authenticated project context.
     * Creates the chat lazily if it doesn't exist yet.
     * Unlike the public endpoint, this does NOT check token expiration.
     *
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {string} assetId - The ID of the asset.
     * @param {CreatePublicChatMessageRequest} data - Message data.
     * @returns {Promise<CreatePublicAssetChatMessageResponse>} The chat and created message.
     */
    async createProjectPublicAssetChatMessage(
      projectId: string,
      token: string,
      assetId: string,
      data: CreatePublicChatMessageRequest
    ): Promise<CreatePublicAssetChatMessageResponse> {
      if (!projectId) throw new Error('projectId is required.');
      if (!token) throw new Error('token is required.');
      if (!assetId) throw new Error('assetId is required.');

      return client._request<CreatePublicAssetChatMessageResponse>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/public/${token}/assets/${assetId}/messages`,
        body: data,
        sendJWT: true,
      });
    },

    // --- Highlighted Messages ---

    /**
     * Lists a project's assets for one visibility tier.
     * `creator` requires `canGetCreatorAssets`; `reviewer` requires `canGetReviewerAssets`.
     * @param {string} projectId - The project ID.
     * @param {'creator'|'reviewer'} visibility - Which tier's assets to list.
     * @param {ListAssetsParams} [params] - Filters and pagination. See ListAssetsParams.
     * @returns {Promise<PaginatedResponse<AssetResponse>>} Paginated assets.
     * @throws {Error} 'projectId is required.' or 'visibility is required.'.
     */
    async getAssets(projectId: string, visibility: 'creator' | 'reviewer', params?: ListAssetsParams): Promise<PaginatedResponse<AssetResponse>> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required.');
      return client._request<PaginatedResponse<AssetResponse>>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/assets/${visibility}`,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Lists highlighted chat messages across a project for one visibility tier (cursor pagination only).
     * `creator` requires `canGetCreatorHighlights`; `reviewer` requires `canGetReviewerHighlights`.
     * @param {string} projectId - The project ID.
     * @param {'creator'|'reviewer'} visibility - Which tier's highlights to list.
     * @param {GetHighlightedMessagesParams} [params] - Cursor pagination. See GetHighlightedMessagesParams.
     * @returns {Promise<PaginatedResponse<ChatMessage>>} Paginated highlighted messages.
     * @throws {Error} 'projectId is required.' or 'visibility is required.'.
     */
    async getHighlightedMessages(projectId: string, visibility: 'creator' | 'reviewer', params?: GetHighlightedMessagesParams): Promise<PaginatedResponse<ChatMessage>> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required.');
      return client._request<PaginatedResponse<ChatMessage>>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/${visibility}/highlighted-messages`,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Gets your reading position in a project's highlights: when you last
     * caught up, and how many messages others have highlighted since. If you
     * have never caught up, it counts from when read tracking began.
     * @param {string} projectId - The project ID.
     * @param {'creator' | 'reviewer'} visibility - Which highlights.
     * @returns {Promise<ReadState>} Your reading position.
     */
    async getHighlightsReadState(projectId: string, visibility: 'creator' | 'reviewer'): Promise<ReadState> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required.');

      return client._request<ReadState>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/${visibility}/highlighted-messages/read-state`,
        sendJWT: true,
      });
    },

    /**
     * Marks a project's highlights as read. Pass `lastReadAt` (epoch ms) — the
     * `highlightedAt` of the newest highlight you had loaded; omit it to catch
     * up to now. The marker only moves forward and never past the present.
     * @returns {Promise<ReadState>} Your updated reading position.
     */
    async markHighlightsCaughtUp(projectId: string, visibility: 'creator' | 'reviewer', lastReadAt?: number): Promise<ReadState> {
      if (!projectId) throw new Error('projectId is required.');
      if (!visibility) throw new Error('visibility is required.');

      return client._request<ReadState>({
        method: 'POST',
        endpoint: `/v1/projects/${projectId}/${visibility}/highlighted-messages/read-state`,
        body: lastReadAt === undefined ? {} : { lastReadAt },
        sendJWT: true,
      });
    },

    /**
     * Top-N assets in a project by access-activity event type (plays, downloads, embeds).
     * Requires project read access. Returns asset IDs and counts only; hydrate names and
     * thumbnails through the normal asset fetch path.
     * @param {string} projectId - The project ID.
     * @param {object} [params] - `range` ('7d' | '30d' | '90d'), `eventType`, `limit`.
     * @returns {Promise<ProjectTopAccessActivityResponse>} Ranked asset IDs with counts.
     * @throws {Error} 'projectId is required.' when `projectId` is falsy.
     */
    async getTopAccessActivity(
      projectId: string,
      params?: {
        range?: '7d' | '30d' | '90d';
        eventType?: 'play_started' | 'play_completed' | 'download' | 'embed_resolved';
        limit?: number;
      },
    ): Promise<ProjectTopAccessActivityResponse> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<ProjectTopAccessActivityResponse>({
        method: 'GET',
        endpoint: `/v1/projects/${projectId}/access-activity/top-assets`,
        params,
        sendJWT: true,
      });
    },
  };
}

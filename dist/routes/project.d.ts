import NuramaClient from '../NuramaClient.js';
import { type Project, type Asset, type Folder, type Chat, type ChatMessage, type ChatSubmission, // Correct type name
type PaginatedResult, type CursorPaginatedResult, type PublicAssetResponse, type PublicChatMessagesResponse, type CreatePublicChatMessageRequest, type CreatePublicAssetChatMessageResponse, type SearchProjectParams, type SearchResponse, type DeleteImpact, type FeedEvent, type FeedVisibility, type ListFeedEventsParams, type CursorPaginatedFeedEvents } from '@nurama/types';
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
    results?: T[];
};
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
    id: number;
    name: string;
    checksum: string;
    sizeInMB: number;
    basePath?: string;
}
export interface ProjectFileUploadBody {
    files: FileUploadData[];
    destinationPath?: string;
}
export interface LogoUploadData extends FileUploadData {
}
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
    errors?: Array<{
        type: string;
        data?: unknown;
        message?: string;
    }>;
}
export interface CopyItemsData {
    itemPaths: string[];
    destinationPath: string;
}
export interface DeleteItemsData {
    itemPaths: string[];
}
export interface CreatePublicFileSystemData {
    itemPaths?: string[];
    title: string;
    description?: string;
    validity?: number;
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
    validity?: number;
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
export interface PaginationParams {
    limit?: number;
    page?: number;
    paginate?: 'cursor' | 'index';
    cursor?: string;
    paginateReverse?: boolean;
    includeCursorRecord?: boolean;
    startAt?: string;
    includeCounts?: boolean;
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
}
export interface ListAssetsParams extends SortParams, PaginationParams, DateRangeParams {
    mediaTypes?: ('image' | 'video' | string)[];
    includeChats?: boolean;
    folderId?: string;
    ignoreFolder?: boolean;
}
export interface ListFeedParams extends ListAssetsParams {
    followedChatsOnly?: boolean;
    hideIfNoChatMessages?: boolean;
    chatMessageSort?: Record<string, 1 | -1>;
    chatReplySort?: Record<string, 1 | -1>;
    chatMessageLimit?: number;
    chatReplyLimit?: number;
}
export interface ListFoldersParams extends SortParams, PaginationParams, DateRangeParams {
    mediaTypes?: ('image' | 'video' | string)[];
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
}
export interface GetPublicChatMessagesParams extends PaginationParams {
    replyLimit?: number;
}
export interface GetChatParams {
    messages?: number;
    replies?: number;
}
export type ProjectResponse = Project;
export type AssetResponse = Asset;
export type FolderResponse = Folder;
export type ChatResponse = Chat;
export type SubmissionResponse = ChatSubmission;
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
    thumbnail: {
        keyPath: string;
    } | null;
    creator: {
        id: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        avatar?: any;
        color?: string;
    } | null;
    publicFileSystems: Array<{
        id: string;
        title: string;
        status: string;
    }>;
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
    results: Array<{
        assetId: string;
        count: number;
    }>;
}
export default function createProjectMethods(client: NuramaClient): {
    /**
     * Creates a new project.
     * @param {CreateProjectData} projectData - Data for the new project.
     * @returns {Promise<ProjectResponse>} The created project object.
     */
    createProject(projectData: CreateProjectData): Promise<ProjectResponse>;
    /**
     * Retrieves projects accessible by the user.
     * NOTE: API endpoint `/v1/projects` does not currently support pagination.
     * @returns {Promise<ProjectResponse[]>} List of project objects.
     */
    getProjects(): Promise<ProjectResponse[]>;
    /**
     * Retrieves a specific project by its ID.
     * @param {string} projectId - The ID of the project.
     * @returns {Promise<ProjectResponse>} The project object.
     */
    getProject(projectId: string): Promise<ProjectResponse>;
    /**
     * Updates a project.
     * @param {string} projectId - The ID of the project to update.
     * @param {UpdateProjectData} updateData - Data to update.
     * @returns {Promise<ProjectResponse>} The updated project object.
     */
    updateProject(projectId: string, updateData: UpdateProjectData): Promise<ProjectResponse>;
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
    updateSetting(projectId: string, name: string, value: unknown): Promise<ProjectResponse>;
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
    searchProject(projectId: string, params: SearchProjectParams): Promise<SearchResponse>;
    /**
     * Deletes a project (marks for deletion).
     * @param {string} projectId - The ID of the project to delete.
     * @returns {Promise<PublicFileSystemResponse>} The deleted public release record.
     */
    deleteProject(projectId: string): Promise<void>;
    /**
     * Creates a new logo asset for a project.
     * @param {string} projectId - The ID of the project.
     * @param {LogoUploadData} logoData - File metadata for the logo.
     * @returns {Promise<any>} Object containing signed URL data and updated project info.
     */
    createLogo(projectId: string, logoData: LogoUploadData): Promise<any>;
    /**
     * Updates the logo asset for a project.
     * @param {string} projectId - The ID of the project.
     * @param {LogoUploadData} logoData - File metadata for the new logo.
     * @returns {Promise<any>} Object containing signed URL data and updated project info.
     */
    updateLogo(projectId: string, logoData: LogoUploadData): Promise<any>;
    /**
     * Create assets within a project and return their signed links for upload.
     * @param {string} projectId - The ID of the project.
     * @param {ProjectFileUploadBody} fileUploadBody - List of files to upload with optional destination path.
     * @returns {Promise<any[]>} Array of results, each containing asset info and signed URL data.
     */
    createAssets(projectId: string, fileUploadBody: ProjectFileUploadBody): Promise<any[]>;
    /**
     * Gets the home feed for a project with a specified visibility.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {ListFeedParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<AssetResponse>>} Paginated feed items.
     */
    getHomeFeed(projectId: string, visibility: "creator" | "reviewer", params?: ListFeedParams): Promise<PaginatedResponse<AssetResponse>>;
    /**
     * Gets one page of the project's event feed (uploads, asset discussions,
     * publishes, submissions and public releases), most recent activity first.
     * The creator and reviewer feeds never share events.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - Which feed to read.
     * @param {ListFeedEventsParams} [params] - Filters and cursor.
     * @returns {Promise<CursorPaginatedFeedEvents>} One page of feed events.
     */
    getFeedEvents(projectId: string, visibility: FeedVisibility, params?: ListFeedEventsParams): Promise<CursorPaginatedFeedEvents>;
    /**
     * Sets your reaction on a feed event. One per person — a new emoji
     * replaces your previous one.
     * @returns {Promise<FeedEvent>} The updated event.
     */
    setFeedEventReaction(projectId: string, visibility: FeedVisibility, eventId: string, emoji: string): Promise<FeedEvent>;
    /**
     * Removes your reaction from a feed event.
     * @returns {Promise<FeedEvent>} The updated event.
     */
    removeFeedEventReaction(projectId: string, visibility: FeedVisibility, eventId: string): Promise<FeedEvent>;
    /**
     * Gets folders within a project with specified visibility.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {ListFoldersParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<FolderResponse>>} Paginated list of folders.
     */
    getFolders(projectId: string, visibility: "creator" | "reviewer", params?: ListFoldersParams): Promise<PaginatedResponse<FolderResponse>>;
    /**
     * Gets the project chat with the specified visibility.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {GetChatParams} [params] - Query parameters for message/reply limits.
     * @returns {Promise<ChatResponse>} The chat object.
     */
    getProjectChat(projectId: string, visibility: "creator" | "reviewer", params?: GetChatParams): Promise<ChatResponse>;
    /**
     * Creates a new submission for a project.
     * @param {string} projectId - The ID of the project.
     * @param {CreateSubmissionData} submissionData - Data for the submission.
     * @returns {Promise<SubmissionResponse>} The created submission object.
     */
    createSubmission(projectId: string, submissionData: CreateSubmissionData): Promise<SubmissionResponse>;
    /**
     * Adds items to an existing submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {AddItemsToSubmissionData} addItemsData - Data for adding items to the submission.
     * @returns {Promise<SubmissionResponse>} The updated submission object.
     */
    addItemsToSubmission(projectId: string, submissionId: string, addItemsData: AddItemsToSubmissionData): Promise<SubmissionResponse>;
    /**
     * Retrieves submissions for a project.
     * @param {string} projectId - The ID of the project.
     * @param {ListSubmissionsParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<SubmissionResponse>>} Paginated list of submissions.
     */
    getSubmissions(projectId: string, params?: ListSubmissionsParams): Promise<PaginatedResponse<SubmissionResponse>>;
    /**
     * Retrieves a specific submission by its ID.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {GetSubmissionParams} [params] - Query parameters for chat message/reply options.
     * @returns {Promise<SubmissionResponse>} The submission object.
     */
    getSubmission(projectId: string, submissionId: string, params?: GetSubmissionParams): Promise<SubmissionResponse>;
    /**
     * Updates a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {UpdateSubmissionData} updateData - Data to update.
     * @returns {Promise<SubmissionResponse>} The updated submission object.
     */
    updateSubmission(projectId: string, submissionId: string, updateData: UpdateSubmissionData): Promise<SubmissionResponse>;
    /**
     * Releases a staged (unreleased) submission, making it visible to reviewers
     * and firing the deferred "new submission" side effects (emails,
     * notifications, system messages).
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @returns {Promise<SubmissionResponse>} The released submission object.
     */
    releaseSubmission(projectId: string, submissionId: string): Promise<SubmissionResponse>;
    /**
     * Re-releases an already-released submission's side effects (the "Release
     * Update" action) — re-notifies reviewers with the submission-update email
     * template + `submissionUpdate` notification. Does not change status.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @returns {Promise<SubmissionResponse>} The submission object.
     */
    releaseSubmissionUpdate(projectId: string, submissionId: string): Promise<SubmissionResponse>;
    /**
     * Gets files for a specific submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {string} [path] - The path to get items from (optional, defaults to root).
     * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<any>>} Paginated list of files.
     */
    getSubmissionItems(projectId: string, submissionId: string, path?: string, params?: GetItemsAtPathParams): Promise<PaginatedResponse<any>>;
    /**
     * Creates a folder within a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {CreateSubmissionFolderData} folderData - Data for creating the folder.
     * @returns {Promise<FolderResponse>} The created folder object.
     */
    createSubmissionFolder(projectId: string, submissionId: string, folderData: CreateSubmissionFolderData): Promise<FolderResponse>;
    /**
     * Moves items within a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {MoveSubmissionItemsData} moveData - Data for moving items.
     * @returns {Promise<{count: number}>} Object containing the count of moved items.
     */
    moveSubmissionItems(projectId: string, submissionId: string, moveData: MoveSubmissionItemsData): Promise<{
        count: number;
    }>;
    /**
     * Copies items within a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {CopySubmissionItemsData} copyData - Data for copying items.
     * @returns {Promise<{count: number}>} Object containing the count of copied items.
     */
    copySubmissionItems(projectId: string, submissionId: string, copyData: CopySubmissionItemsData): Promise<{
        count: number;
    }>;
    /**
     * Deletes items within a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {DeleteSubmissionItemsData} deleteData - Data for deleting items.
     * @returns {Promise<{count: number}>} Object containing the count of deleted items.
     */
    deleteSubmissionItems(projectId: string, submissionId: string, deleteData: DeleteSubmissionItemsData): Promise<{
        count: number;
    }>;
    /**
     * Adds a tag to a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {TagSubmissionData} tagData - Data for tagging the submission.
     * @returns {Promise<SubmissionResponse>} The updated submission object.
     */
    tagSubmission(projectId: string, submissionId: string, tagData: TagSubmissionData): Promise<SubmissionResponse>;
    /**
     * Removes a tag from a submission.
     * @param {string} projectId - The ID of the project.
     * @param {string} submissionId - The ID of the submission.
     * @param {TagSubmissionData} tagData - Data for untagging the submission.
     * @returns {Promise<SubmissionResponse>} The updated submission object.
     */
    untagSubmission(projectId: string, submissionId: string, tagData: TagSubmissionData): Promise<SubmissionResponse>;
    /**
     * Publishes a list of items (assets, folders) within a project.
     * @param {string} projectId - The ID of the project.
     * @param {PublishItemsData} publishData - Data for publishing items.
     * @returns {Promise<any>} Object containing lists of published items and results.
     */
    publishItems(projectId: string, publishData: PublishItemsData): Promise<any>;
    /**
     * Unpublishes a list of items (assets, folders) within a project.
     * @param {string} projectId - The ID of the project.
     * @param {UnpublishItemsData} unpublishData - Data for unpublishing items.
     * @returns {Promise<any>} Object containing lists of unpublished items and results.
     */
    unpublishItems(projectId: string, unpublishData: UnpublishItemsData): Promise<any>;
    /**
     * Creates a folder within a project with file system integration.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {CreateFolderData} folderData - Data for creating the folder.
     * @returns {Promise<FolderResponse>} The created folder object.
     */
    createFolder(projectId: string, visibility: "creator" | "reviewer", folderData: CreateFolderData): Promise<FolderResponse>;
    /**
     * Gets items at a specific path within a project.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {string} [path] - The path to get items from (optional, defaults to root).
     * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
     * @param {boolean} [usePost] - Whether to use POST method (useful for large resourceIds arrays).
     * @returns {Promise<PaginatedResponse<any>>} Paginated list of items at the path.
     */
    getItemsAtPath(projectId: string, visibility: "creator" | "reviewer", path?: string, params?: GetItemsAtPathParams, usePost?: boolean): Promise<PaginatedResponse<any>>;
    /**
     * Moves items to a specific path within a project.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {MoveItemsData} moveData - Data for moving items.
     * @returns {Promise<{count: number}>} Object containing the count of moved items.
     */
    moveItemsToPath(projectId: string, visibility: "creator" | "reviewer", moveData: MoveItemsData): Promise<MoveItemsResult>;
    /**
     * Copies items to a specific path within a project.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {CopyItemsData} copyData - Data for copying items.
     * @returns {Promise<{count: number}>} Object containing the count of copied items.
     */
    copyItemsToPath(projectId: string, visibility: "creator" | "reviewer", copyData: CopyItemsData): Promise<{
        count: number;
    }>;
    /**
     * Deletes items at a specific path within a project.
     * @param {string} projectId - The ID of the project.
     * @param {'creator' | 'reviewer'} visibility - The visibility context ('creator' or 'reviewer').
     * @param {DeleteItemsData} deleteData - Data for deleting items.
     * @returns {Promise<{count: number}>} Object containing the count of deleted items.
     */
    deleteItemsAtPath(projectId: string, visibility: "creator" | "reviewer", deleteData: DeleteItemsData): Promise<{
        count: number;
    }>;
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
    previewDeleteItemsAtPath(projectId: string, visibility: "creator" | "reviewer", deleteData: DeleteItemsData): Promise<DeleteImpact>;
    /**
     * Gets all public file systems for a project.
     * @param {string} projectId - The ID of the project.
     * @param {ListPublicFileSystemsParams} [params] - Query parameters (pagination, sort, search, status, creatorId).
     * @returns {Promise<PaginatedResponse<PublicFileSystemResponse>>} Paginated list of public file systems.
     */
    getPublicFileSystems(projectId: string, params?: ListPublicFileSystemsParams): Promise<PaginatedResponse<PublicFileSystemResponse>>;
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
    getPublicAudit(projectId: string, params?: {
        currentlyPublic?: boolean;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<PublicAuditAssetResponse>>;
    /**
     * Creates a public file system with a secure token for sharing project assets publicly.
     * @param {string} projectId - The ID of the project.
     * @param {CreatePublicFileSystemData} publicFileSystemData - Data for creating the public file system.
     * @returns {Promise<PublicFileSystemResponse>} The created public file system object.
     */
    createPublicFileSystem(projectId: string, publicFileSystemData: CreatePublicFileSystemData): Promise<PublicFileSystemResponse>;
    /**
     * Updates an existing public file system's title and description.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @param {UpdatePublicFileSystemData} updateData - Data to update.
     * @returns {Promise<PublicFileSystemResponse>} The updated public file system object.
     */
    updatePublicFileSystem(projectId: string, publicId: string, updateData: UpdatePublicFileSystemData): Promise<PublicFileSystemResponse>;
    /**
     * Releases a staged (unreleased) public file system, making it externally
     * accessible via its public token.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @returns {Promise<PublicFileSystemResponse>} The released public file system object.
     */
    releasePublicFileSystem(projectId: string, publicId: string): Promise<PublicFileSystemResponse>;
    /**
     * Retrieves a specific public file system by its ID.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @returns {Promise<PublicFileSystemResponse>} The public file system object.
     */
    getPublicFileSystem(projectId: string, publicId: string): Promise<PublicFileSystemResponse>;
    /**
     * Deletes a public file system and invalidates its access token.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @returns {Promise<PublicFileSystemResponse>} The deleted public release record.
     */
    deletePublicFileSystem(projectId: string, publicId: string): Promise<PublicFileSystemResponse>;
    /**
     * Adds additional items to an existing public file system.
     * @param {string} projectId - The ID of the project.
     * @param {string} publicId - The ID of the public file system.
     * @param {AddItemsToPublicFileSystemData} addItemsData - Data for adding items.
     * @returns {Promise<PublicFileSystemResponse>} The updated public file system object.
     */
    addItemsToPublicFileSystem(projectId: string, publicId: string, addItemsData: AddItemsToPublicFileSystemData): Promise<PublicFileSystemResponse>;
    /**
     * Gets items from a public file system at a specific path (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {string} [path] - The path to get items from (optional, defaults to root).
     * @param {GetItemsAtPathParams} [params] - Query parameters for filtering and pagination.
     * @returns {Promise<PaginatedResponse<any>>} Paginated list of public file system items.
     */
    getPublicItemsAtPath(projectId: string, token: string, path?: string, params?: GetItemsAtPathParams): Promise<PaginatedResponse<any>>;
    /**
     * Moves items within a public file system (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {MovePublicItemsData} moveData - Data for moving items.
     * @returns {Promise<{count: number}>} Object containing the count of moved items.
     */
    movePublicItemsAtPath(projectId: string, token: string, moveData: MovePublicItemsData): Promise<{
        count: number;
    }>;
    /**
     * Copies items within a public file system (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {CopyPublicItemsData} copyData - Data for copying items.
     * @returns {Promise<{count: number}>} Object containing the count of copied items.
     */
    copyPublicItemsAtPath(projectId: string, token: string, copyData: CopyPublicItemsData): Promise<{
        count: number;
    }>;
    /**
     * Deletes items from a public file system (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {DeletePublicItemsData} deleteData - Data for deleting items.
     * @returns {Promise<{count: number}>} Object containing the count of deleted items.
     */
    deletePublicItemsAtPath(projectId: string, token: string, deleteData: DeletePublicItemsData): Promise<{
        count: number;
    }>;
    /**
     * Creates a folder inside a public file system (authenticated management).
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @param {CreateFolderData} folderData - Data for creating the folder (name, color, basePath).
     * @returns {Promise<FolderResponse>} The created folder object.
     */
    createPublicFolder(projectId: string, token: string, folderData: CreateFolderData): Promise<FolderResponse>;
    /**
     * Gets a public chat from an authenticated project context.
     * Unlike the public endpoint, this does NOT check token expiration.
     * Use this for internal management of public file systems.
     *
     * @param {string} projectId - The ID of the project.
     * @param {string} token - The public access token.
     * @returns {Promise<any>} The public chat or null if none exists.
     */
    getProjectPublicChat(projectId: string, token: string): Promise<any>;
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
    getProjectPublicAsset(projectId: string, token: string, assetId: string): Promise<PublicAssetResponse>;
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
    getProjectPublicChatMessages(projectId: string, token: string, chatId: string, params?: GetPublicChatMessagesParams): Promise<PublicChatMessagesResponse>;
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
    createProjectPublicChatMessage(projectId: string, token: string, chatId: string, data: CreatePublicChatMessageRequest): Promise<ChatMessage>;
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
    createProjectPublicTopicChatMessage(projectId: string, token: string, data: CreatePublicChatMessageRequest): Promise<CreatePublicAssetChatMessageResponse>;
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
    createProjectPublicAssetChatMessage(projectId: string, token: string, assetId: string, data: CreatePublicChatMessageRequest): Promise<CreatePublicAssetChatMessageResponse>;
    /**
     * Lists a project's assets for one visibility tier.
     * `creator` requires `canGetCreatorAssets`; `reviewer` requires `canGetReviewerAssets`.
     * @param {string} projectId - The project ID.
     * @param {'creator'|'reviewer'} visibility - Which tier's assets to list.
     * @param {ListAssetsParams} [params] - Filters and pagination. See ListAssetsParams.
     * @returns {Promise<PaginatedResponse<AssetResponse>>} Paginated assets.
     * @throws {Error} 'projectId is required.' or 'visibility is required.'.
     */
    getAssets(projectId: string, visibility: "creator" | "reviewer", params?: ListAssetsParams): Promise<PaginatedResponse<AssetResponse>>;
    /**
     * Lists highlighted chat messages across a project for one visibility tier (cursor pagination only).
     * `creator` requires `canGetCreatorHighlights`; `reviewer` requires `canGetReviewerHighlights`.
     * @param {string} projectId - The project ID.
     * @param {'creator'|'reviewer'} visibility - Which tier's highlights to list.
     * @param {GetHighlightedMessagesParams} [params] - Cursor pagination. See GetHighlightedMessagesParams.
     * @returns {Promise<PaginatedResponse<ChatMessage>>} Paginated highlighted messages.
     * @throws {Error} 'projectId is required.' or 'visibility is required.'.
     */
    getHighlightedMessages(projectId: string, visibility: "creator" | "reviewer", params?: GetHighlightedMessagesParams): Promise<PaginatedResponse<ChatMessage>>;
    /**
     * Top-N assets in a project by access-activity event type (plays, downloads, embeds).
     * Requires project read access. Returns asset IDs and counts only; hydrate names and
     * thumbnails through the normal asset fetch path.
     * @param {string} projectId - The project ID.
     * @param {object} [params] - `range` ('7d' | '30d' | '90d'), `eventType`, `limit`.
     * @returns {Promise<ProjectTopAccessActivityResponse>} Ranked asset IDs with counts.
     * @throws {Error} 'projectId is required.' when `projectId` is falsy.
     */
    getTopAccessActivity(projectId: string, params?: {
        range?: "7d" | "30d" | "90d";
        eventType?: "play_started" | "play_completed" | "download" | "embed_resolved";
        limit?: number;
    }): Promise<ProjectTopAccessActivityResponse>;
};
//# sourceMappingURL=project.d.ts.map
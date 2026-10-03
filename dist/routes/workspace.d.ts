import NuramaClient from '../NuramaClient.js';
export interface CreateWorkspaceData {
    name: string;
    description?: string;
}
export interface UpdateWorkspaceData {
    name?: string;
    description?: string;
    updateSlug?: boolean;
}
export interface FileData {
    name: string;
    checksum: string;
    sizeInMB: number;
}
export interface SortParams {
    [key: string]: 1 | -1;
}
/**
 * Defines workspace-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the workspace methods.
 */
export default function createWorkspaceMethods(client: NuramaClient): {
    /**
     * Creates a new workspace.
     * Requires authentication.
     * @param data - Workspace data.
     * @returns {Promise<object>} The created workspace object.
     */
    createWorkspace(data: CreateWorkspaceData): Promise<any>;
    /**
     * Retrieves a specific workspace by its ID.
     * Requires authentication.
     * @param {string} workspaceId - The ID of the workspace to retrieve.
     * @returns {Promise<object>} The workspace object.
     */
    getWorkspace(workspaceId: string): Promise<any>;
    /**
     * Lists all workspaces the authenticated user has access to.
     * Requires authentication.
     * @param {object} [sortParams] - Optional sorting. Keys are field names (`id`, `name`, `createdAt`, `updatedAt`);
     *   values are 1 for ascending or -1 for descending. Sent as `?sort[name]=1&sort[createdAt]=-1`.
     * @returns {Promise<Array<object>>} Workspaces with the caller's `roles` and the workspace `capabilities`.
     */
    listWorkspaces(sortParams?: SortParams): Promise<any[]>;
    /**
     * Request signed URL data to upload a workspace logo.
     * Caller then multipart-uploads the file using the returned `signedUrlData`
     * and calls `client.asset.completeUpload(...)` to finalize.
     *
     * @param {string} fileData.checksum - The MD5 checksum.
     * @param {number} fileData.sizeInMB - The file size in MB.
     * @returns {Promise<object>} Response containing signed URL data and workspace info.
     */
    createLogo(workspaceId: string, fileData: FileData): Promise<any>;
    /**
     * Request signed URL data to replace the workspace logo. Same upload
     * shape as `createLogo`; existing logo is replaced once `completeUpload`
     * lands.
     *
     * @param {string} fileData.checksum - The MD5 checksum.
     * @param {number} fileData.sizeInMB - The file size in MB.
     * @returns {Promise<object>} Response containing signed URL data and workspace info.
     */
    updateLogo(workspaceId: string, fileData: FileData): Promise<any>;
    /**
     * Request signed URL data to upload a workspace icon (the small square
     * shown in sidebars and tabs — distinct from the logo).
     *
     * @param {string} fileData.checksum - The MD5 checksum.
     * @param {number} fileData.sizeInMB - The file size in MB.
     * @returns {Promise<object>} Response containing signed URL data and workspace info.
     */
    createIcon(workspaceId: string, fileData: FileData): Promise<any>;
    /**
     * Request signed URL data to replace the workspace icon. Same upload
     * shape as `createIcon`.
     *
     * @param {string} fileData.checksum - The MD5 checksum.
     * @param {number} fileData.sizeInMB - The file size in MB.
     * @returns {Promise<object>} Response containing signed URL data and workspace info.
     */
    updateIcon(workspaceId: string, fileData: FileData): Promise<any>;
    /**
     * List the projects inside a workspace that the calling user has
     * access to.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @returns {Promise<Array<object>>} An array of project objects.
     */
    listProjects(workspaceId: string): Promise<any[]>;
    /**
     * Update workspace metadata (name, description, etc.).
     *
     * @param {boolean} [updateData.updateSlug] - Whether to update the slug based on the new name.
     * @returns {Promise<object>} The updated workspace object.
     */
    updateWorkspace(workspaceId: string, updateData: UpdateWorkspaceData): Promise<any>;
    /**
     * Soft-delete a workspace. All nested resources (projects, chats,
     * assets) become inaccessible; bytes are reclaimed by the cleanup
     * cron.
     *
     * @param {string} workspaceId - The ID of the workspace to delete.
     * @returns {Promise<object>} Object confirming the status change.
     */
    deleteWorkspace(workspaceId: string): Promise<any>;
    /**
     * Toggle a single workspace boolean setting (e.g. an `enableX` feature
     * flag).
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} settingName - The name of the setting.
     * @param {boolean} value - The new value for the setting.
     * @returns {Promise<object>} The updated workspace object with new settings.
     */
    updateSetting(workspaceId: string, settingName: string, value: boolean): Promise<any>;
};
//# sourceMappingURL=workspace.d.ts.map
import NuramaClient from '../NuramaClient.js';

// Define specific types for workspace requests/responses if desired
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
export default function createWorkspaceMethods(client: NuramaClient) {
  // Specify return type more accurately if possible, using WorkspaceMethods interface
  return {
    /**
     * Creates a new workspace.
     * Requires authentication.
     * @param data - Workspace data.
     * @returns {Promise<object>} The created workspace object.
     */
    async createWorkspace(data: CreateWorkspaceData): Promise<any> {
      return client._request({
        endpoint: '/v1/workspaces',
        method: 'POST',
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Retrieves a specific workspace by its ID.
     * Requires authentication.
     * @param {string} workspaceId - The ID of the workspace to retrieve.
     * @returns {Promise<object>} The workspace object.
     */
    async getWorkspace(workspaceId: string): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}`,
        method: 'GET',
        sendJWT: true,
      });
    },

    /**
     * Lists all workspaces the authenticated user has access to.
     * Requires authentication.
     * @param {object} [sortParams] - Optional sorting. Keys are field names (`id`, `name`, `createdAt`, `updatedAt`);
     *   values are 1 for ascending or -1 for descending. Sent as `?sort[name]=1&sort[createdAt]=-1`.
     * @returns {Promise<Array<object>>} Workspaces with the caller's `roles` and the workspace `capabilities`.
     */
    async listWorkspaces(sortParams: SortParams = {}): Promise<any[]> {
      return client._request({
        endpoint: '/v1/workspaces',
        method: 'GET',
        params: Object.keys(sortParams).length > 0 ? { sort: sortParams } : undefined,
        sendJWT: true,
      });
    },

    /**
     * Request signed URL data to upload a workspace logo.
     * Caller then multipart-uploads the file using the returned `signedUrlData`
     * and calls `client.asset.completeUpload(...)` to finalize.
     *
     * @param {string} fileData.checksum - The MD5 checksum.
     * @param {number} fileData.sizeInMB - The file size in MB.
     * @returns {Promise<object>} Response containing signed URL data and workspace info.
     */
    async createLogo(workspaceId: string, fileData: FileData): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}/logo`,
        method: 'POST',
        body: fileData,
        sendJWT: true,
      });
    },

    /**
     * Request signed URL data to replace the workspace logo. Same upload
     * shape as `createLogo`; existing logo is replaced once `completeUpload`
     * lands.
     *
     * @param {string} fileData.checksum - The MD5 checksum.
     * @param {number} fileData.sizeInMB - The file size in MB.
     * @returns {Promise<object>} Response containing signed URL data and workspace info.
     */
    async updateLogo(workspaceId: string, fileData: FileData): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}/logo`,
        method: 'PUT',
        body: fileData,
        sendJWT: true,
      });
    },

    /**
     * Request signed URL data to upload a workspace icon (the small square
     * shown in sidebars and tabs — distinct from the logo).
     *
     * @param {string} fileData.checksum - The MD5 checksum.
     * @param {number} fileData.sizeInMB - The file size in MB.
     * @returns {Promise<object>} Response containing signed URL data and workspace info.
     */
    async createIcon(workspaceId: string, fileData: FileData): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}/icon`,
        method: 'POST',
        body: fileData,
        sendJWT: true,
      });
    },

    /**
     * Request signed URL data to replace the workspace icon. Same upload
     * shape as `createIcon`.
     *
     * @param {string} fileData.checksum - The MD5 checksum.
     * @param {number} fileData.sizeInMB - The file size in MB.
     * @returns {Promise<object>} Response containing signed URL data and workspace info.
     */
    async updateIcon(workspaceId: string, fileData: FileData): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}/icon`,
        method: 'PUT',
        body: fileData,
        sendJWT: true,
      });
    },

    /**
     * List the projects inside a workspace that the calling user has
     * access to.
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @returns {Promise<Array<object>>} An array of project objects.
     */
    async listProjects(workspaceId: string): Promise<any[]> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}/projects`,
        method: 'GET',
        sendJWT: true,
      });
    },

    /**
     * Update workspace metadata (name, description, etc.).
     *
     * @param {boolean} [updateData.updateSlug] - Whether to update the slug based on the new name.
     * @returns {Promise<object>} The updated workspace object.
     */
    async updateWorkspace(workspaceId: string, updateData: UpdateWorkspaceData): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}`,
        method: 'PUT',
        body: updateData,
        sendJWT: true,
      });
    },

    /**
     * Soft-delete a workspace. All nested resources (projects, chats,
     * assets) become inaccessible; bytes are reclaimed by the cleanup
     * cron.
     *
     * @param {string} workspaceId - The ID of the workspace to delete.
     * @returns {Promise<object>} Object confirming the status change.
     */
    async deleteWorkspace(workspaceId: string): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}`,
        method: 'DELETE',
        sendJWT: true,
      });
    },

    /**
     * Toggle a single workspace boolean setting (e.g. an `enableX` feature
     * flag).
     *
     * @param {string} workspaceId - The ID of the workspace.
     * @param {string} settingName - The name of the setting.
     * @param {boolean} value - The new value for the setting.
     * @returns {Promise<object>} The updated workspace object with new settings.
     */
    async updateSetting(workspaceId: string, settingName: string, value: boolean): Promise<any> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!settingName) throw new Error('settingName is required.');
      return client._request({
        endpoint: `/v1/workspaces/${workspaceId}/settings/${settingName}`,
        method: 'PUT',
        body: { value },
        sendJWT: true,
      });
    },

  };
}
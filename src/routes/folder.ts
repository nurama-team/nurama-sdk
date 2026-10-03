import NuramaClient from '../NuramaClient.js';
import {
  type Folder,
  type Asset,
  type PaginatedResult,
  type CursorPaginatedResult,
} from '@nurama/types';

// Combine pagination metadata with a results array
// (Should be defined centrally or imported if used across multiple route files)
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
  results?: T[];
};

// --- Common Interfaces (Consider moving to a shared file if used elsewhere) ---
export interface PaginationParams {
    limit?: number;
    page?: number;
}

export interface SortParams {
    sort?: Record<string, 1 | -1>;
}

// --- Request Body Interfaces ---
export interface UpdateFolderData {
    name?: string;
    color?: string;
}

export interface UpdateFolderIconData {
    name: string;
    checksum: string;
    sizeInMB: number;
}



export interface TagFolderData {
    tagId: string;
}

export interface UntagFolderData {
    tagId: string;
}

// --- Query Parameter Interfaces ---
export interface GetFoldersAssetsParams extends PaginationParams, SortParams {
    visibility?: 'creator' | 'reviewer';
    chats?: boolean;
    messages?: number;
    replies?: number;
}

// --- Response Interfaces ---
export type FolderResponse = Folder; // Use Folder type
export type AssetResponse = Asset; // Use Asset type

/**
 * Defines folder-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the folder-related methods.
 */
export default function createFolderMethods(client: NuramaClient) {
  return {
    /** Fetch a single folder by id. */
    async getFolder(folderId: string): Promise<FolderResponse> {
      if (!folderId) throw new Error('folderId is required.');
      return client._request<FolderResponse>({
        method: 'GET',
        endpoint: `/v1/folders/${folderId}`,
        sendJWT: true,
      });
    },

    /**
     * Updates a folder's name and/or color.
     * @param {string} folderId - The ID of the folder to update.
     * @param {UpdateFolderData} data - Data containing the name and/or color to update.
     * @returns {Promise<FolderResponse>} The updated folder object.
     */
    async updateFolder(folderId: string, data: UpdateFolderData): Promise<FolderResponse> {
      if (!folderId) throw new Error('folderId is required.');
      return client._request<FolderResponse>({
        method: 'PUT',
        endpoint: `/v1/folders/${folderId}`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Updates a folder's icon.
     * @param {string} folderId - The ID of the folder to update.
     * @param {UpdateFolderIconData} data - Icon file data including name, checksum, and size.
     * @returns {Promise<any>} Object containing the updated folder and signed upload URLs.
     */
    async updateFolderIcon(folderId: string, data: UpdateFolderIconData): Promise<any> {
      if (!folderId) throw new Error('folderId is required.');
      return client._request<any>({
        method: 'PUT',
        endpoint: `/v1/folders/${folderId}/icon`,
        body: data,
        sendJWT: true,
      });
    },

    /** List the assets that live directly inside a folder (does not recurse). */
    async getFoldersAssets(folderId: string, params?: GetFoldersAssetsParams): Promise<PaginatedResponse<AssetResponse>> {
      if (!folderId) throw new Error('folderId is required.');
      return client._request<PaginatedResponse<AssetResponse>>({
        method: 'GET',
        endpoint: `/v1/folders/${folderId}/assets`,
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Tags a folder with a specific tag.
     * @param {string} folderId - The ID of the folder to tag.
     * @param {TagFolderData} tagData - Data containing the tag ID.
     * @returns {Promise<FolderResponse>} The updated folder object.
     */
    async tagFolder(folderId: string, tagData: TagFolderData): Promise<FolderResponse> {
      if (!folderId) throw new Error('folderId is required.');
      if (!tagData.tagId) throw new Error('tagId is required.');
      return client._request<FolderResponse>({
        method: 'PUT',
        endpoint: `/v1/folders/${folderId}/tag`,
        body: tagData,
        sendJWT: true,
      });
    },

    /**
     * Untags a folder by removing a specific tag.
     * @param {string} folderId - The ID of the folder to untag.
     * @param {UntagFolderData} untagData - Data containing the tag ID to remove.
     * @returns {Promise<FolderResponse>} The updated folder object.
     */
    async untagFolder(folderId: string, untagData: UntagFolderData): Promise<FolderResponse> {
      if (!folderId) throw new Error('folderId is required.');
      if (!untagData.tagId) throw new Error('tagId is required.');
      return client._request<FolderResponse>({
        method: 'PUT',
        endpoint: `/v1/folders/${folderId}/untag`,
        body: untagData,
        sendJWT: true,
      });
    },

  };
}

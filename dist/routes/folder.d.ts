import NuramaClient from '../NuramaClient.js';
import { type Folder, type Asset, type PaginatedResult, type CursorPaginatedResult } from '@nurama/types';
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
    results?: T[];
};
export interface PaginationParams {
    limit?: number;
    page?: number;
}
export interface SortParams {
    sort?: Record<string, 1 | -1>;
}
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
export interface GetFoldersAssetsParams extends PaginationParams, SortParams {
    visibility?: 'creator' | 'reviewer';
    chats?: boolean;
    messages?: number;
    replies?: number;
}
export type FolderResponse = Folder;
export type AssetResponse = Asset;
/**
 * Defines folder-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the folder-related methods.
 */
export default function createFolderMethods(client: NuramaClient): {
    /** Fetch a single folder by id. */
    getFolder(folderId: string): Promise<FolderResponse>;
    /**
     * Updates a folder's name and/or color.
     * @param {string} folderId - The ID of the folder to update.
     * @param {UpdateFolderData} data - Data containing the name and/or color to update.
     * @returns {Promise<FolderResponse>} The updated folder object.
     */
    updateFolder(folderId: string, data: UpdateFolderData): Promise<FolderResponse>;
    /**
     * Updates a folder's icon.
     * @param {string} folderId - The ID of the folder to update.
     * @param {UpdateFolderIconData} data - Icon file data including name, checksum, and size.
     * @returns {Promise<any>} Object containing the updated folder and signed upload URLs.
     */
    updateFolderIcon(folderId: string, data: UpdateFolderIconData): Promise<any>;
    /** List the assets that live directly inside a folder (does not recurse). */
    getFoldersAssets(folderId: string, params?: GetFoldersAssetsParams): Promise<PaginatedResponse<AssetResponse>>;
    /**
     * Tags a folder with a specific tag.
     * @param {string} folderId - The ID of the folder to tag.
     * @param {TagFolderData} tagData - Data containing the tag ID.
     * @returns {Promise<FolderResponse>} The updated folder object.
     */
    tagFolder(folderId: string, tagData: TagFolderData): Promise<FolderResponse>;
    /**
     * Untags a folder by removing a specific tag.
     * @param {string} folderId - The ID of the folder to untag.
     * @param {UntagFolderData} untagData - Data containing the tag ID to remove.
     * @returns {Promise<FolderResponse>} The updated folder object.
     */
    untagFolder(folderId: string, untagData: UntagFolderData): Promise<FolderResponse>;
};
//# sourceMappingURL=folder.d.ts.map
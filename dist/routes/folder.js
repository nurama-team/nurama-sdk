/**
 * Defines folder-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the folder-related methods.
 */
export default function createFolderMethods(client) {
    return {
        /** Fetch a single folder by id. */
        async getFolder(folderId) {
            if (!folderId)
                throw new Error('folderId is required.');
            return client._request({
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
        async updateFolder(folderId, data) {
            if (!folderId)
                throw new Error('folderId is required.');
            return client._request({
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
        async updateFolderIcon(folderId, data) {
            if (!folderId)
                throw new Error('folderId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/folders/${folderId}/icon`,
                body: data,
                sendJWT: true,
            });
        },
        /** List the assets that live directly inside a folder (does not recurse). */
        async getFoldersAssets(folderId, params) {
            if (!folderId)
                throw new Error('folderId is required.');
            return client._request({
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
        async tagFolder(folderId, tagData) {
            if (!folderId)
                throw new Error('folderId is required.');
            if (!tagData.tagId)
                throw new Error('tagId is required.');
            return client._request({
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
        async untagFolder(folderId, untagData) {
            if (!folderId)
                throw new Error('folderId is required.');
            if (!untagData.tagId)
                throw new Error('tagId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/folders/${folderId}/untag`,
                body: untagData,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=folder.js.map
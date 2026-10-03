/**
 * Defines tag-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the tag-related methods.
 */
export default function createTagMethods(client) {
    return {
        /**
         * Creates a new tag for a specific resource.
         * @param {CreateTagData} tagData - The tag data to create.
         * @returns {Promise<Tag>} The created tag object.
         */
        async createTag(tagData) {
            if (!tagData.name)
                throw new Error('Tag name is required.');
            if (!tagData.ownerResourceType)
                throw new Error('Owner resource type is required.');
            if (!tagData.ownerResourceId)
                throw new Error('Owner resource ID is required.');
            return client._request({
                method: 'POST',
                endpoint: '/v1/tags',
                body: tagData,
                sendJWT: true,
            });
        },
        /**
         * Retrieves all tags for a specific resource.
         * @param {TagOwnerResourceType} ownerResourceType - The type of resource to get tags for.
         * @param {string} ownerResourceId - The ID of the resource to get tags for.
         * @param {GetTagsParams} [params] - Optional parameters for filtering and sorting.
         * @returns {Promise<Tags>} Array of tag objects.
         */
        async getTags(ownerResourceType, ownerResourceId, params) {
            if (!ownerResourceType)
                throw new Error('Owner resource type is required.');
            if (!ownerResourceId)
                throw new Error('Owner resource ID is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/tags/${ownerResourceType}/${ownerResourceId}`,
                params,
                sendJWT: true,
            });
        },
        /**
         * Updates an existing tag.
         * @param {string} tagId - The ID of the tag to update.
         * @param {UpdateTagData} updateData - The data to update.
         * @returns {Promise<Tag>} The updated tag object.
         */
        async updateTag(tagId, updateData) {
            if (!tagId)
                throw new Error('Tag ID is required.');
            if (!updateData.name && !updateData.color) {
                throw new Error('At least one field (name or color) must be provided for update.');
            }
            return client._request({
                method: 'PUT',
                endpoint: `/v1/tags/${tagId}`,
                body: updateData,
                sendJWT: true,
            });
        },
        /**
         * Deletes a tag permanently.
         * @param {string} tagId - The ID of the tag to delete.
         * @returns {Promise<Tag>} The deleted tag object.
         */
        async deleteTag(tagId) {
            if (!tagId)
                throw new Error('Tag ID is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/tags/${tagId}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=tag.js.map
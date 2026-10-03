import NuramaClient from '../NuramaClient.js';
import { type Tag, type TagOwnerResourceType } from '@nurama/types';

/**
 * Data required to create a new tag
 */
export interface CreateTagData {
  /** The name of the tag */
  name: string;
  
  /** The type of resource that will own this tag */
  ownerResourceType: TagOwnerResourceType;
  
  /** The ID of the resource that will own this tag */
  ownerResourceId: string;
  
  /** Optional hex color code for the tag. If not provided, a color will be assigned automatically */
  color?: string;
}

/**
 * Data for updating an existing tag
 */
export interface UpdateTagData {
  /** The new name for the tag */
  name?: string;
  
  /** The new hex color code for the tag */
  color?: string;
}

/**
 * Parameters for getting tags for a resource
 */
export interface GetTagsParams {
  /** Filter tags by partial name match (case-insensitive) */
  name?: string;
  
  /** Sort tags by field */
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
}

/**
 * Array of tags
 */
export type Tags = Tag[];

/**
 * Defines tag-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the tag-related methods.
 */
export default function createTagMethods(client: NuramaClient) {
  return {
    /**
     * Creates a new tag for a specific resource.
     * @param {CreateTagData} tagData - The tag data to create.
     * @returns {Promise<Tag>} The created tag object.
     */
    async createTag(tagData: CreateTagData): Promise<Tag> {
      if (!tagData.name) throw new Error('Tag name is required.');
      if (!tagData.ownerResourceType) throw new Error('Owner resource type is required.');
      if (!tagData.ownerResourceId) throw new Error('Owner resource ID is required.');

      return client._request<Tag>({
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
    async getTags(
      ownerResourceType: TagOwnerResourceType,
      ownerResourceId: string,
      params?: GetTagsParams
    ): Promise<Tags> {
      if (!ownerResourceType) throw new Error('Owner resource type is required.');
      if (!ownerResourceId) throw new Error('Owner resource ID is required.');

      return client._request<Tags>({
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
    async updateTag(tagId: string, updateData: UpdateTagData): Promise<Tag> {
      if (!tagId) throw new Error('Tag ID is required.');
      if (!updateData.name && !updateData.color) {
        throw new Error('At least one field (name or color) must be provided for update.');
      }

      return client._request<Tag>({
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
    async deleteTag(tagId: string): Promise<Tag> {
      if (!tagId) throw new Error('Tag ID is required.');

      return client._request<Tag>({
        method: 'DELETE',
        endpoint: `/v1/tags/${tagId}`,
        sendJWT: true,
      });
    },
  };
} 
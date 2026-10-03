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
export default function createTagMethods(client: NuramaClient): {
    /**
     * Creates a new tag for a specific resource.
     * @param {CreateTagData} tagData - The tag data to create.
     * @returns {Promise<Tag>} The created tag object.
     */
    createTag(tagData: CreateTagData): Promise<Tag>;
    /**
     * Retrieves all tags for a specific resource.
     * @param {TagOwnerResourceType} ownerResourceType - The type of resource to get tags for.
     * @param {string} ownerResourceId - The ID of the resource to get tags for.
     * @param {GetTagsParams} [params] - Optional parameters for filtering and sorting.
     * @returns {Promise<Tags>} Array of tag objects.
     */
    getTags(ownerResourceType: TagOwnerResourceType, ownerResourceId: string, params?: GetTagsParams): Promise<Tags>;
    /**
     * Updates an existing tag.
     * @param {string} tagId - The ID of the tag to update.
     * @param {UpdateTagData} updateData - The data to update.
     * @returns {Promise<Tag>} The updated tag object.
     */
    updateTag(tagId: string, updateData: UpdateTagData): Promise<Tag>;
    /**
     * Deletes a tag permanently.
     * @param {string} tagId - The ID of the tag to delete.
     * @returns {Promise<Tag>} The deleted tag object.
     */
    deleteTag(tagId: string): Promise<Tag>;
};
//# sourceMappingURL=tag.d.ts.map
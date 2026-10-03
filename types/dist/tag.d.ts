import { ObjectId } from './common';
/**
 * Tag-related type definitions for the Nurama platform.
 */
/**
 * Supported resource types that can own tags
 */
export type TagOwnerResourceType = 'project' | 'folder' | 'asset' | 'submission' | 'chat' | 'user';
/**
 * Base tag interface containing all tag properties
 */
export interface Tag {
    /**
     * The unique identifier of the tag
     * @format objectId
     */
    id?: ObjectId;
    /**
     * The display name of the tag
     */
    name: string;
    /**
     * URL-friendly version of the tag name
     */
    slug: string;
    /**
     * The type of resource that owns this tag
     */
    ownerResourceType: TagOwnerResourceType;
    /**
     * The ID of the resource that owns this tag
     * @format objectId
     */
    ownerResourceId: ObjectId;
    /**
     * Hex color code for the tag (e.g., #FF5733)
     */
    color: string;
    /**
     * The timestamp when the tag was created
     * @format int64
     */
    createdAt?: number;
    /**
     * The timestamp when the tag was last updated
     * @format int64
     */
    updatedAt?: number;
}

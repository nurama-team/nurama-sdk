import { ObjectId } from './common';
import { PublicUser } from './user';

export interface FileSystem {
  /**
   * The unique identifier of the file system entry.
   * @format objectId
   */
  id?: ObjectId;
  /**
   * The ID of the resource (asset or folder) this file system entry represents.
   * @format objectId
   */
  resourceId: ObjectId;
  /**
   * The populated resource (Asset or Folder).
   */
  resource?: ObjectId;
  /**
   * The type of resource this file system entry represents.
   */
  resourceType: 'asset' | 'folder';
  /**
   * The name of the resource.
   */
  resourceName: string;
  /**
   * The slug of the resource.
   */
  resourceSlug?: string;
  /**
   * The ID of the user who created the resource.
   * @format objectId
   */
  resourceCreatorId: ObjectId;
  /**
   * The populated creator user information.
   */
  resourceCreator?: ObjectId | PublicUser;
  /**
   * Array of tag IDs associated with the resource.
   * @format objectId
   */
  resourceTags?: ObjectId[];
  /**
   * The media type of the resource.
   */
  resourceMediaType: 'folder' | 'image' | 'audio' | 'video' | 'file';
  /**
   * The status of the resource.
   */
  resourceStatus: 'active' | 'inactive' | 'pendingDelete';
  /**
   * The creation date of the resource.
   * @format date-time
   */
  resourceCreatedAt?: string;
  /**
   * The size of the resource in bytes.
   */
  sizeInBytes: number;
  /**
   * The path to the item (excluding the item name).
   * @example /project/projectId/creator/folder-one
   */
  path: string;
  /**
   * The full path including the item name.
   * @example /project/projectId/creator/folder-one/resourceName
   */
  itemPath: string;
  /**
   * Array of path components for hierarchical queries.
   */
  pathComponents?: string[];
  /**
   * The timestamp when the file system entry was created.
   * @format int64
   */
  createdAt?: number;
  /**
   * The timestamp when the file system entry was last updated.
   * @format int64
   */
  updatedAt?: number;
} 
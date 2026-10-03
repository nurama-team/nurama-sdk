import type { ObjectId } from './common';
import type { PublicUser } from './user';
import type { Asset } from './asset';
/**
 * Represents a folder within a project or other resource.
 */
export interface Folder {
    /**
     * The unique identifier of the folder.
     * @format objectId
     */
    id?: ObjectId;
    /**
     * The type of resource the folder belongs to.
     */
    ownerResourceType: string;
    /**
     * The ID of the resource the folder belongs to.
     * @format objectId
     */
    ownerResourceId: ObjectId;
    /**
     * The ID of the user who created the folder.
     * @format objectId
     */
    creatorId: ObjectId;
    /**
     * The populated creator user information.
     */
    creator?: ObjectId | PublicUser;
    /**
     * The icon asset for the folder.
     * @format objectId
     */
    icon?: ObjectId | Asset;
    /**
     * The color associated with the folder.
     */
    color?: string;
    /**
     * The name of the folder.
     */
    name: string;
    /**
     * The slug for the folder.
     */
    slug?: string;
    /**
     * The file system path reference for the folder.
     */
    fileSystemPath?: string;
    /**
     * Array of tag IDs associated with the folder.
     * @format objectId
     */
    tags?: ObjectId[];
    /**
     * The status of the folder.
     * @default active
     */
    status?: 'active' | 'pendingDelete';
    /**
     * The timestamp when the folder was created.
     * @format int64
     */
    createdAt?: number;
    /**
     * The timestamp when the folder was last updated.
     * @format int64
     */
    updatedAt?: number;
    /**
     * Set on server-synthesized virtual folders that have no FileSystem row.
     * Tells the UI to swap the folder icon for the appropriate sidebar icon
     * (Public globe / Submission package / Review eye) and suppress the creator
     * avatar. Absent on real folders.
     *
     * `review-root` has no per-container level below it — `Review/` opens the
     * project's reviewer file system directly — so there is no `review` member
     * to pair with it the way `public` / `submission` pair with their roots.
     */
    virtualType?: 'public-root' | 'submission-root' | 'review-root' | 'public' | 'submission';
}

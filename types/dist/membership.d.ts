import type { ObjectId } from './common';
import type { PublicUser } from './user';
import type { Workspace } from './workspace';
import type { Project } from './project';
import type { PaginatedResult } from './pagination';
/**
 * Represents a membership linking a user to a resource (workspace or project).
 */
export interface Membership {
    /**
     * @format objectId
     * @example 659804b988f90a59c3c87b82
     */
    id: ObjectId;
    /**
     * @format objectId
     * @example 659804b988f90a59c3c87b62
     */
    userId: ObjectId;
    /**
     * @format objectId
     * @example 659804b988f90a59c3c87b79
     */
    resourceId: ObjectId;
    /**
     * @example workspace
     */
    resourceType: 'workspace' | 'project';
    /**
     * @example ["workspaceOwner"]
     */
    roles: string[];
    /**
     * @format int64
     * @example 1704461497862
     */
    createdAt?: number;
    /**
     * @format int64
     * @example 1704461497862
     */
    updatedAt?: number;
    /**
     * The populated resource (Workspace or Project).
     */
    resource?: Workspace | Project;
    /**
     * The populated user information.
     */
    user?: PublicUser;
}
/**
 * Represents an item in a membership report, detailing a user's access.
 */
interface MembershipReportItem {
    user?: PublicUser;
    resources?: {
        /** @example 6733736868949390a715fc63 */
        resourceId?: ObjectId;
        /** @example project */
        resourceType?: string;
        /** @example Orn Group */
        name?: string;
        /** @example ["reviewer", "creator", "projectOwner ect."] */
        roles?: string[];
        /**
         * The timestamp when the user last accessed this resource
         * @format date-time
         * @example 2025-10-24T10:30:00.000Z
         */
        lastSeen?: string | null;
    }[];
    membershipRecords?: {
        /** @example 6733736868949390a715fc63 */
        id?: ObjectId;
        /** @example 6733736868949390a715fc63 */
        resourceId?: ObjectId;
        /** @example project */
        resourceType?: string;
        /** @example ["creator"] */
        roles?: string[];
    }[];
    /**
     * @format date-time
     * @example 2024-11-12T15:25:28.620Z
     */
    createdAt?: string;
    /**
     * @format date-time
     * @example 2024-11-12T15:25:28.620Z
     */
    updatedAt?: string;
    /** @example 6733736768949390a715fac4 */
    userId?: ObjectId;
    /** @example ["reviewer"] */
    roles?: string[];
    /** @example false */
    isBillable?: boolean;
}
/**
 * Represents a paginated result of membership reports.
 */
export type MembershipReport = PaginatedResult & {
    results?: MembershipReportItem[];
};
/**
 * Represents a user who can be mentioned, including their roles.
 * Uses an intersection type to combine PublicUser with roles.
 */
export type Mentionable = PublicUser & {
    /**
     * @example ["reviewer"]
     */
    roles?: string[];
};
/**
 * Represents an invitation for a user to join a resource.
 */
export interface Invite {
    /**
     * @format objectId
     * @example 657c3baa3a0ac4bba66abc2a
     */
    id: ObjectId;
    /**
     * @format objectId
     * @example 657c3baa3a0ac4bba66abc2a
     */
    inviteToken: ObjectId;
    /**
     * @format objectId
     * @example 657c3baa3a0ac4bba66abc06
     */
    inviterId: ObjectId;
    /**
     * @format email
     * @example bernice_koss@hotmail.com
     */
    inviteeEmail: string;
    /**
     * This key is only available of the use has already joined the platform.
     * @format objectId
     * @example 657c3baa3a0ac4bba66abc06
     */
    inviteeId?: ObjectId;
    /**
     * @format objectId
     * @example 657c3baa3a0ac4bba66abc1b
     */
    resourceId: ObjectId;
    /**
     * @example Workspace
     */
    resourceType: string;
    /**
     * @example workspaceAdmin
     */
    role: string;
    /**
     * @format date-time
     * @example 2023-12-15T12:12:34.784Z
     */
    expires: string;
    /**
     * @example active
     */
    status: string;
    /**
     * Populated Workspace or Project data.
     */
    resource?: Workspace | Project;
    /**
     * Populated public user data for the inviter.
     */
    inviter?: PublicUser;
    /**
     * This key is only available of the use has already joined the platform.
     * Populated public user data for the invitee.
     */
    invitee?: PublicUser;
}
export {};

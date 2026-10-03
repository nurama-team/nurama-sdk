import NuramaClient from '../NuramaClient.js';
import { type Membership, type MembershipReport, type Mentionable } from '@nurama/types';
export interface PaginationParams {
    limit?: number;
    page?: number;
}
export interface SortParams {
    sort?: Record<string, 1 | -1>;
}
export interface AddRemoveRoleData {
    membershipId: string;
    role: string;
}
export interface GetWorkspaceMembershipParams extends PaginationParams, SortParams {
    nameSearch?: string | null;
    isBillable?: boolean;
}
export interface GetProjectMembershipParams extends PaginationParams, SortParams {
    nameSearch?: string | null;
}
export interface GetLastSeenData {
    userIds: string[];
}
export interface LastSeenResult {
    userId: string;
    resourceId: string;
    resourceType: 'workspace' | 'project';
    lastSeen: string | null;
}
export interface GetLastSeenResponse {
    results: LastSeenResult[];
}
export type MembershipResponse = Membership;
export type PaginatedMembershipResponse = MembershipReport;
export type MentionableUserResponse = Mentionable;
/**
 * Defines membership-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the membership-related methods.
 */
export default function createMembershipMethods(client: NuramaClient): {
    /**
         * Retrieves the membership records for the currently authenticated user.
         * @returns {Promise<MembershipResponse[]>} An array of the user's membership records.
         */
    getMyMemberships(): Promise<MembershipResponse[]>;
    /**
         * Retrieves memberships associated with a specific workspace.
         * Requires permission to get workspace members.
         * @param {string} workspaceId - The ID of the workspace.
         * @param {GetWorkspaceMembershipParams} [params] - Query parameters for pagination, sorting, filtering.
         * @returns {Promise<PaginatedMembershipResponse>} Paginated list of workspace memberships.
         */
    getWorkspaceMemberships(workspaceId: string, params?: GetWorkspaceMembershipParams): Promise<PaginatedMembershipResponse>;
    /**
         * Retrieves memberships associated with a specific project.
         * Requires permission based on user's role in the project/workspace.
         * @param {string} projectId - The ID of the project.
         * @param {GetProjectMembershipParams} [params] - Query parameters for pagination, sorting, filtering.
         * @returns {Promise<PaginatedMembershipResponse>} Paginated list of project memberships.
         */
    getProjectMemberships(projectId: string, params?: GetProjectMembershipParams): Promise<PaginatedMembershipResponse>;
    /**
         * Deletes a specific membership record by its ID.
         * Requires specific permissions to delete others' memberships.
         * @param {string} membershipId - The ID of the membership record to delete.
         * @returns {Promise<void>}
         */
    deleteMembership(membershipId: string): Promise<void>;
    /**
         * Allows the authenticated user to leave a resource (delete their own membership).
         * Cannot be used to remove ownership roles.
         * @param {string} resourceId - The ID of the resource (workspace or project) to leave.
         * @returns {Promise<void>}
         */
    leaveResource(resourceId: string): Promise<void>;
    /**
         * Adds a role to an existing membership record.
         * Requires permission to add roles.
         * @param {AddRemoveRoleData} data - Object containing membershipId and the role to add.
         * @returns {Promise<MembershipResponse>} The updated membership object.
         */
    addRole(data: AddRemoveRoleData): Promise<MembershipResponse>;
    /**
         * Removes a role from an existing membership record.
         * Requires permission to remove roles. Cannot remove ownership roles.
         * @param {AddRemoveRoleData} data - Object containing membershipId and the role to remove.
         * @returns {Promise<MembershipResponse>} The updated membership object.
         */
    removeRole(data: AddRemoveRoleData): Promise<MembershipResponse>;
    /**
         * Retrieves a list of users mentionable within a project based on visibility.
         * Requires permission to get mentionable users.
         * @param {string} projectId - The ID of the project.
         * @param {'creator' | 'reviewer' | 'all'} visibility - The visibility scope. Pass 'all' to get users from both creator and reviewer visibilities (e.g. for boards visible to both).
         * @returns {Promise<MentionableUserResponse[]>} An array of mentionable user objects.
         */
    getProjectMentionableUsers(projectId: string, visibility: "creator" | "reviewer" | "all"): Promise<MentionableUserResponse[]>;
    /**
         * Retrieves resource-specific last seen timestamps for multiple users in a workspace.
         * Requires permission to get workspace members.
         * @param {string} workspaceId - The ID of the workspace.
         * @param {GetLastSeenData} data - Object containing array of user IDs (1-100).
         * @returns {Promise<GetLastSeenResponse>} Object with results array containing last seen data.
         */
    getWorkspaceLastSeen(workspaceId: string, data: GetLastSeenData): Promise<GetLastSeenResponse>;
    /**
         * Retrieves resource-specific last seen timestamps for multiple users in a project.
         * Requires permission to get project members.
         * @param {string} projectId - The ID of the project.
         * @param {GetLastSeenData} data - Object containing array of user IDs (1-100).
         * @returns {Promise<GetLastSeenResponse>} Object with results array containing last seen data.
         */
    getProjectLastSeen(projectId: string, data: GetLastSeenData): Promise<GetLastSeenResponse>;
};
//# sourceMappingURL=membership.d.ts.map
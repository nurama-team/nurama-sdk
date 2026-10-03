/**
 * Defines membership-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the membership-related methods.
 */
export default function createMembershipMethods(client) {
    return {
        /**
             * Retrieves the membership records for the currently authenticated user.
             * @returns {Promise<MembershipResponse[]>} An array of the user's membership records.
             */
        async getMyMemberships() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/memberships/',
                sendJWT: true,
            });
        },
        /**
             * Retrieves memberships associated with a specific workspace.
             * Requires permission to get workspace members.
             * @param {string} workspaceId - The ID of the workspace.
             * @param {GetWorkspaceMembershipParams} [params] - Query parameters for pagination, sorting, filtering.
             * @returns {Promise<PaginatedMembershipResponse>} Paginated list of workspace memberships.
             */
        async getWorkspaceMemberships(workspaceId, params) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/memberships/workspace/${workspaceId}`,
                params: params,
                sendJWT: true,
            });
        },
        /**
             * Retrieves memberships associated with a specific project.
             * Requires permission based on user's role in the project/workspace.
             * @param {string} projectId - The ID of the project.
             * @param {GetProjectMembershipParams} [params] - Query parameters for pagination, sorting, filtering.
             * @returns {Promise<PaginatedMembershipResponse>} Paginated list of project memberships.
             */
        async getProjectMemberships(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/memberships/project/${projectId}`,
                params: params,
                sendJWT: true,
            });
        },
        /**
             * Deletes a specific membership record by its ID.
             * Requires specific permissions to delete others' memberships.
             * @param {string} membershipId - The ID of the membership record to delete.
             * @returns {Promise<void>}
             */
        async deleteMembership(membershipId) {
            if (!membershipId)
                throw new Error('membershipId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/memberships/${membershipId}`,
                sendJWT: true,
            });
        },
        /**
             * Allows the authenticated user to leave a resource (delete their own membership).
             * Cannot be used to remove ownership roles.
             * @param {string} resourceId - The ID of the resource (workspace or project) to leave.
             * @returns {Promise<void>}
             */
        async leaveResource(resourceId) {
            if (!resourceId)
                throw new Error('resourceId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/memberships/leave/${resourceId}`,
                sendJWT: true,
            });
        },
        /**
             * Adds a role to an existing membership record.
             * Requires permission to add roles.
             * @param {AddRemoveRoleData} data - Object containing membershipId and the role to add.
             * @returns {Promise<MembershipResponse>} The updated membership object.
             */
        async addRole(data) {
            if (!data || !data.membershipId || !data.role) {
                throw new Error('membershipId and role are required.');
            }
            return client._request({
                method: 'POST',
                endpoint: '/v1/memberships/add-role',
                body: data,
                sendJWT: true,
            });
        },
        /**
             * Removes a role from an existing membership record.
             * Requires permission to remove roles. Cannot remove ownership roles.
             * @param {AddRemoveRoleData} data - Object containing membershipId and the role to remove.
             * @returns {Promise<MembershipResponse>} The updated membership object.
             */
        async removeRole(data) {
            if (!data || !data.membershipId || !data.role) {
                throw new Error('membershipId and role are required.');
            }
            return client._request({
                method: 'POST',
                endpoint: '/v1/memberships/remove-role',
                body: data,
                sendJWT: true,
            });
        },
        /**
             * Retrieves a list of users mentionable within a project based on visibility.
             * Requires permission to get mentionable users.
             * @param {string} projectId - The ID of the project.
             * @param {'creator' | 'reviewer' | 'all'} visibility - The visibility scope. Pass 'all' to get users from both creator and reviewer visibilities (e.g. for boards visible to both).
             * @returns {Promise<MentionableUserResponse[]>} An array of mentionable user objects.
             */
        async getProjectMentionableUsers(projectId, visibility) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!visibility)
                throw new Error('visibility is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/memberships/mentionable/project/${projectId}/${visibility}`,
                sendJWT: true,
            });
        },
        /**
             * Retrieves resource-specific last seen timestamps for multiple users in a workspace.
             * Requires permission to get workspace members.
             * @param {string} workspaceId - The ID of the workspace.
             * @param {GetLastSeenData} data - Object containing array of user IDs (1-100).
             * @returns {Promise<GetLastSeenResponse>} Object with results array containing last seen data.
             */
        async getWorkspaceLastSeen(workspaceId, data) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!data || !data.userIds || !Array.isArray(data.userIds) || data.userIds.length === 0) {
                throw new Error('userIds array is required and must contain at least one user ID.');
            }
            if (data.userIds.length > 100) {
                throw new Error('userIds array cannot contain more than 100 user IDs.');
            }
            return client._request({
                method: 'POST',
                endpoint: `/v1/memberships/workspace/${workspaceId}/last-seen`,
                body: data,
                sendJWT: true,
            });
        },
        /**
             * Retrieves resource-specific last seen timestamps for multiple users in a project.
             * Requires permission to get project members.
             * @param {string} projectId - The ID of the project.
             * @param {GetLastSeenData} data - Object containing array of user IDs (1-100).
             * @returns {Promise<GetLastSeenResponse>} Object with results array containing last seen data.
             */
        async getProjectLastSeen(projectId, data) {
            if (!projectId)
                throw new Error('projectId is required.');
            if (!data || !data.userIds || !Array.isArray(data.userIds) || data.userIds.length === 0) {
                throw new Error('userIds array is required and must contain at least one user ID.');
            }
            if (data.userIds.length > 100) {
                throw new Error('userIds array cannot contain more than 100 user IDs.');
            }
            return client._request({
                method: 'POST',
                endpoint: `/v1/memberships/project/${projectId}/last-seen`,
                body: data,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=membership.js.map
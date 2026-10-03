/**
 * Defines invite-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the invite-related methods.
 */
export default function createInviteMethods(client) {
    return {
        /**
         * Invite a user (by email) to a workspace or project at a given role.
         * Triggers an invitation email; the recipient accepts via the link.
         */
        async inviteUser(data) {
            return client._request({
                method: 'POST',
                endpoint: '/v1/invites',
                body: data,
                sendJWT: true,
            });
        },
        /** List invites the current user has issued (pending, accepted, expired). */
        async getInvites(params) {
            return client._request({
                method: 'GET',
                endpoint: '/v1/invites',
                params: params,
                sendJWT: true,
            });
        },
        /**
         * Look up an invite by id. Public — no auth — so the recipient can
         * preview the invite (target resource, role, inviter) before signing
         * up or logging in.
         */
        async getInviteById(inviteId) {
            if (!inviteId)
                throw new Error('inviteId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/invites/${inviteId}`,
                sendJWT: false, // Public route - no authentication required
            });
        },
        /** Revoke a pending invite. */
        async cancelInvite(inviteId) {
            if (!inviteId)
                throw new Error('inviteId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/invites/${inviteId}`,
                sendJWT: true,
            });
        },
        /** List pending invites attached to a workspace or project resource. */
        async getInvitesForResource(resourceId, params) {
            if (!resourceId)
                throw new Error('resourceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/invites/resource/${resourceId}`,
                params: params,
                sendJWT: true,
            });
        },
        /** Accept an invite for the authenticated user. Creates the membership. */
        async acceptInvite(inviteId) {
            if (!inviteId)
                throw new Error('inviteId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/invites/accept/${inviteId}`,
                sendJWT: true,
            });
        },
        /** Re-send a pending invite email (does not extend or reissue the token). */
        async resendInvite(inviteId) {
            if (!inviteId)
                throw new Error('inviteId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/invites/resend/${inviteId}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=invite.js.map
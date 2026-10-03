/**
 * Defines join-link ("invite link") methods for the NuramaClient. A join link
 * lets people join a project via a shareable URL; management is gated by the
 * caller's grant authority and the workspace plan's per-mode capability
 * (enforced server-side).
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the join-link methods.
 */
export default function createJoinLinkMethods(client) {
    return {
        /** Create a join link for a project. */
        async createJoinLink(data) {
            return client._request({
                method: 'POST',
                endpoint: '/v1/join-links',
                body: data,
                sendJWT: true,
            });
        },
        /** List a project's join links. */
        async getJoinLinks(params) {
            if (!params?.projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: '/v1/join-links',
                params,
                sendJWT: true,
            });
        },
        /** Update a join link's settings (role, mode, domains, expiry, enable/disable). */
        async updateJoinLink(linkId, data) {
            if (!linkId)
                throw new Error('linkId is required.');
            return client._request({
                method: 'PATCH',
                endpoint: `/v1/join-links/${linkId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Rotate a link's token, invalidating the old URL. Optionally reset expiry.
         * Existing memberships are untouched.
         */
        async rollJoinLink(linkId, expiresAt) {
            if (!linkId)
                throw new Error('linkId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/join-links/${linkId}/roll`,
                body: expiresAt !== undefined ? { expiresAt } : {},
                sendJWT: true,
            });
        },
        /**
         * Public preview of a join link by token — no auth — so the join landing
         * page can show "Join <project>" before the visitor signs in.
         */
        async getJoinByToken(token) {
            if (!token)
                throw new Error('token is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/join/${token}`,
                sendJWT: false, // Public route - no authentication required
            });
        },
        /** Redeem a join link for the authenticated user. */
        async joinByToken(token) {
            if (!token)
                throw new Error('token is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/join/${token}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=joinLink.js.map
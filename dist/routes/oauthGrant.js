export default function createOAuthGrantMethods(client) {
    return {
        /**
         * List the applications the caller has authorised, newest first.
         * Expired grants are omitted by the server.
         */
        async listGrants() {
            const res = await client._request({
                method: 'GET',
                endpoint: '/v1/oauth-grants',
                sendJWT: true,
                bypassCache: true,
            });
            return res.results;
        },
        /**
         * Withdraw an application's access: the grant and every token issued
         * under it. An access token already in flight stays valid until it
         * expires, so revocation is not instantaneous for a request under way.
         */
        async revokeGrant(grantId) {
            if (!grantId)
                throw new Error('grantId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/oauth-grants/${grantId}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=oauthGrant.js.map
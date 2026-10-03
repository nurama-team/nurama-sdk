/**
 * Personal Access Token surface — auth-gated, owner-scoped. Any
 * logged-in user can mint, list, and revoke their own tokens; there
 * is no admin-on-behalf surface here (admins managing bot keys do
 * that via the `bot` methods).
 */
export default function createTokenMethods(client) {
    return {
        /**
         * Mint a new Personal Access Token for the calling user.
         * The raw secret is in the response's `token` field — store it
         * immediately, it cannot be retrieved again.
         */
        async createToken(data) {
            return client._request({
                method: 'POST',
                endpoint: '/v1/tokens',
                body: data,
                sendJWT: true,
            });
        },
        /**
         * List the caller's Personal Access Tokens. Bot-access keys held
         * by the same user (rare but possible — admin who's also a bot
         * owner) are filtered out server-side and surface via the bot
         * management screens instead.
         */
        async listTokens() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/tokens',
                sendJWT: true,
                bypassCache: true,
            });
        },
        /**
         * Revoke one of the caller's Personal Access Tokens. The revocation
         * is immediate — the token will return 401 on the very next request.
         */
        async deleteToken(tokenId) {
            if (!tokenId)
                throw new Error('tokenId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/tokens/${tokenId}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=token.js.map
/**
 * Defines short link related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the short link related methods.
 */
export default function createShortLinkMethods(client) {
    return {
        /**
         * Resolves a short link code to its full deep link path.
         * This endpoint is publicly accessible and does not require authentication.
         * @param {string} code - The 8-character alphanumeric short link code.
         * @returns {Promise<ResolveShortLinkResponse>} The resolved deep link information.
         */
        async resolveShortLink(code) {
            if (!code)
                throw new Error('code is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/shortlink/${code}`,
                sendJWT: false,
            });
        },
    };
}
//# sourceMappingURL=shortlink.js.map
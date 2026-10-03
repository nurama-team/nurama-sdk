/**
 * Creates methods related to configuration endpoints.
 * @param client - The NuramaClient instance.
 * @returns An object with configuration-related methods.
 */
export default function createConfigMethods(client) {
    return {
        /**
         * Retrieves the application configuration.
         *
         * @returns {Promise<any>} A promise that resolves with the configuration object.
         * @throws {ApiError} Throws an ApiError if the request fails.
         */
        getConfig: async () => {
            // client._log('[DEBUG] Fetching application configuration'); // Logging is handled by _request
            return client._request({
                endpoint: '/v1/config',
                method: 'GET',
                sendJWT: false, // This endpoint does not require authentication
            });
        },
    };
}
//# sourceMappingURL=config.js.map
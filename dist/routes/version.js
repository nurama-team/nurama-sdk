// --- Method Definitions ---
/**
 * Defines version-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the version-related methods.
 */
export default function createVersionMethods(client) {
    return {
        /**
         * Retrieves the latest git commit hash of the deployed application.
         * This is a public endpoint and does not require authentication.
         * @returns {Promise<CommitResponse>} An object containing the buildCommit hash.
         */
        async getCommitHash() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/version/commit',
                sendJWT: false,
            });
        },
        /**
         * Retrieves the API health report (database connectivity, memory, uptime).
         * Public endpoint. Resolves normally for `healthy` and `degraded`; the API
         * responds 503 for `unhealthy`, which surfaces as a thrown error with `status: 503`
         * and the report on `data`.
         * @returns {Promise<HealthStatus>} The health report.
         */
        async getHealth() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/version/health',
                sendJWT: false,
                bypassCache: true,
            });
        },
    };
}
//# sourceMappingURL=version.js.map
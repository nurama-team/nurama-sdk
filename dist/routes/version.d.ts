import NuramaClient from '../NuramaClient.js';
export interface CommitResponse {
    buildCommit: string;
}
export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    /** Epoch milliseconds when the check ran. */
    timestamp: number;
    /** Process uptime in seconds. */
    uptime: number;
    /** Present when status is `degraded` or `unhealthy`. */
    reason?: string;
    postgres: {
        status: 'connected' | 'disconnected';
        [key: string]: unknown;
    };
    memory: Record<string, unknown>;
    [key: string]: unknown;
}
/**
 * Defines version-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the version-related methods.
 */
export default function createVersionMethods(client: NuramaClient): {
    /**
     * Retrieves the latest git commit hash of the deployed application.
     * This is a public endpoint and does not require authentication.
     * @returns {Promise<CommitResponse>} An object containing the buildCommit hash.
     */
    getCommitHash(): Promise<CommitResponse>;
    /**
     * Retrieves the API health report (database connectivity, memory, uptime).
     * Public endpoint. Resolves normally for `healthy` and `degraded`; the API
     * responds 503 for `unhealthy`, which surfaces as a thrown error with `status: 503`
     * and the report on `data`.
     * @returns {Promise<HealthStatus>} The health report.
     */
    getHealth(): Promise<HealthStatus>;
};
export type VersionMethods = ReturnType<typeof createVersionMethods>;
//# sourceMappingURL=version.d.ts.map
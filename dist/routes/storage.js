// --- Method Definitions ---
/**
 * Defines storage-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the storage-related methods.
 */
export default function createStorageMethods(client) {
    return {
        /**
             * Retrieves storage usage chart data for a specific resource.
             * Requires authentication and permission.
             * @param {ResourceType} resourceType - The type of the resource.
             * @param {string} resourceId - The ID of the resource.
             * @param {GetStorageChartParams} [params] - Optional query parameters for date range and aggregation.
             * @returns {Promise<ChartDataResponse>} An array of chart data entries.
             */
        async getStorageChart(resourceType, resourceId, params) {
            if (!resourceType)
                throw new Error('resourceType is required.');
            if (!resourceId)
                throw new Error('resourceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/storage/chart/${resourceType}/${resourceId}`,
                params,
                sendJWT: true,
            });
        },
        /**
             * Retrieves the latest storage record for a specific resource.
             * Requires authentication and permission.
             * @param {ResourceType} resourceType - The type of the resource.
             * @param {string} resourceId - The ID of the resource.
             * @returns {Promise<StorageRecord>} The latest storage record for the resource.
             */
        async getStorageRecord(resourceType, resourceId) {
            if (!resourceType)
                throw new Error('resourceType is required.');
            if (!resourceId)
                throw new Error('resourceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/storage/${resourceType}/${resourceId}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=storage.js.map
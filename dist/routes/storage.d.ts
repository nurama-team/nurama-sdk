import NuramaClient from '../NuramaClient.js';
export type ResourceType = 'user' | 'workspace' | 'project' | 'chat' | 'asset';
export interface GetStorageChartParams {
    startDate?: number;
    endDate?: number;
    aggregationPeriod?: 'year' | 'month' | 'week' | 'day';
}
export interface ChartDataEntry {
    period: string;
    averageSizeInBytes: number;
}
export type ChartDataResponse = ChartDataEntry[];
export interface StorageRecord {
    resourceId: string;
    resourceType: ResourceType;
    sizeInBytes: number;
    id: string;
}
/**
 * Defines storage-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the storage-related methods.
 */
export default function createStorageMethods(client: NuramaClient): {
    /**
         * Retrieves storage usage chart data for a specific resource.
         * Requires authentication and permission.
         * @param {ResourceType} resourceType - The type of the resource.
         * @param {string} resourceId - The ID of the resource.
         * @param {GetStorageChartParams} [params] - Optional query parameters for date range and aggregation.
         * @returns {Promise<ChartDataResponse>} An array of chart data entries.
         */
    getStorageChart(resourceType: ResourceType, resourceId: string, params?: GetStorageChartParams): Promise<ChartDataResponse>;
    /**
         * Retrieves the latest storage record for a specific resource.
         * Requires authentication and permission.
         * @param {ResourceType} resourceType - The type of the resource.
         * @param {string} resourceId - The ID of the resource.
         * @returns {Promise<StorageRecord>} The latest storage record for the resource.
         */
    getStorageRecord(resourceType: ResourceType, resourceId: string): Promise<StorageRecord>;
};
export type StorageMethods = ReturnType<typeof createStorageMethods>;
//# sourceMappingURL=storage.d.ts.map
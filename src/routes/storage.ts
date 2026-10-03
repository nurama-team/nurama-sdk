import NuramaClient from '../NuramaClient.js';

// --- Resource Type Enum ---
export type ResourceType = 'user' | 'workspace' | 'project' | 'chat' | 'asset';

// --- Query Parameter Interfaces ---
export interface GetStorageChartParams {
    startDate?: number; // Unix timestamp (ms) or similar number format expected by backend
    endDate?: number;   // Unix timestamp (ms) or similar number format expected by backend
    aggregationPeriod?: 'year' | 'month' | 'week' | 'day';
}

// --- Response Interfaces ---
export interface ChartDataEntry {
    period: string; // e.g., "YYYY-MM-DD", "YYYY-W##", "YYYY-MM", "YYYY"
    averageSizeInBytes: number;
}

export type ChartDataResponse = ChartDataEntry[];

export interface StorageRecord {
    resourceId: string;
    resourceType: ResourceType;
    sizeInBytes: number;
    id: string; // The ID of the storage record itself
}

// --- Method Definitions ---

/**
 * Defines storage-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the storage-related methods.
 */
export default function createStorageMethods(client: NuramaClient) {
  return {
    /**
         * Retrieves storage usage chart data for a specific resource.
         * Requires authentication and permission.
         * @param {ResourceType} resourceType - The type of the resource.
         * @param {string} resourceId - The ID of the resource.
         * @param {GetStorageChartParams} [params] - Optional query parameters for date range and aggregation.
         * @returns {Promise<ChartDataResponse>} An array of chart data entries.
         */
    async getStorageChart(
      resourceType: ResourceType,
      resourceId: string,
      params?: GetStorageChartParams
    ): Promise<ChartDataResponse> {
      if (!resourceType) throw new Error('resourceType is required.');
      if (!resourceId) throw new Error('resourceId is required.');
      return client._request<ChartDataResponse>({
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
    async getStorageRecord(
      resourceType: ResourceType,
      resourceId: string
    ): Promise<StorageRecord> {
      if (!resourceType) throw new Error('resourceType is required.');
      if (!resourceId) throw new Error('resourceId is required.');
      return client._request<StorageRecord>({
        method: 'GET',
        endpoint: `/v1/storage/${resourceType}/${resourceId}`,
        sendJWT: true,
      });
    },
  };
}

// --- Export Method Type ---
export type StorageMethods = ReturnType<typeof createStorageMethods>; 
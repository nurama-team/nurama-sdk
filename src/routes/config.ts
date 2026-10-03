// import { Config } from '@nurama/types'; // Removed temporarily due to import resolution issues
import type NuramaClient from '../NuramaClient'; // Use type import for client

// Define the shape of the returned object
export interface ConfigMethods {
  getConfig: () => Promise<any>;
}

/**
 * Creates methods related to configuration endpoints.
 * @param client - The NuramaClient instance.
 * @returns An object with configuration-related methods.
 */
export default function createConfigMethods(client: NuramaClient): ConfigMethods {
  return {
    /**
     * Retrieves the application configuration.
     *
     * @returns {Promise<any>} A promise that resolves with the configuration object.
     * @throws {ApiError} Throws an ApiError if the request fails.
     */
    getConfig: async (): Promise<any> => {
      // client._log('[DEBUG] Fetching application configuration'); // Logging is handled by _request
      return client._request<any>({
        endpoint: '/v1/config',
        method: 'GET',
        sendJWT: false, // This endpoint does not require authentication
      });
    },
  };
} 
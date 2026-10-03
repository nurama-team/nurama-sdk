import NuramaClient from '../NuramaClient.js';
import {
  type Notification,
  type PaginatedResult,
  type CursorPaginatedResult,
} from '@nurama/types';

// Combine pagination metadata with a results array
// (Should be defined centrally or imported if used across multiple route files)
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
  results?: T[];
};

// --- Common Interfaces (Should be shared) ---
export interface PaginationParams {
    limit?: number;
    // Cursor specific
    cursor?: string;
    paginateReverse?: boolean;
    includeCounts?: boolean;
    includeCursorRecord?: boolean;
    startAt?: string; 
    includeStartAtRecord?: boolean;
    // Index specific
    page?: number;
}

export interface SortParams {
    sort?: Record<string, 1 | -1>;
}

// --- Request Body Interfaces ---
export interface BaseNotificationParams {
    channels: string[];
    types?: string[]; // Consider using a specific type based on notificationTypes
}

export interface GetNotificationsData extends BaseNotificationParams, PaginationParams, SortParams {
    paginate?: 'cursor' | 'index';
    // Index specific pagination params from validation
    createdAfter?: number; 
    createdBefore?: number;
}

export interface GetNewNotificationsData extends BaseNotificationParams, PaginationParams {
     paginate?: 'cursor' | 'index';
    updateLastSeen?: boolean;
}

export interface GetNewNotificationCountData extends BaseNotificationParams {}

export interface ChannelQuery {
    channels: string[];
    types?: string[];
}

export interface GetNewNotificationCountBulkData {
    channelQueries: ChannelQuery[];
}

export interface GetUsersLastNotificationsSeenData extends BaseNotificationParams {}

export interface UpdateUsersLastSeenData extends BaseNotificationParams {}

// --- Response Interfaces (using 'any' for now) ---
 
//type NotificationResponse = any;
export type PaginatedNotificationResponse = PaginatedResponse<Notification>;
export type NotificationCountResponse = { count: number };
export type NotificationCountBulkResponse = ({ channels: string[], types?: string[], count: number })[];
export type LastSeenResponse = { channels: string[], lastSeen: number, types?: string[] }; // Defined based on comments/tests


/**
 * Defines notification-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the notification-related methods.
 */
export default function createNotificationMethods(client: NuramaClient) {
  return {
    /**
         * Retrieves notifications for specified channels, with optional filtering and pagination.
         * @param {GetNotificationsData} data - Request body containing channels, types, and pagination/sorting options.
         * @returns {Promise<PaginatedNotificationResponse>} Paginated list of notifications.
         */
    async getNotifications(data: GetNotificationsData): Promise<PaginatedNotificationResponse> {
      return client._request<PaginatedNotificationResponse>({
        method: 'POST',
        endpoint: '/v1/notifications/',
        body: data,
        sendJWT: true,
      });
    },

    /**
         * Retrieves new notifications since the user's last viewed timestamp for the specified channels.
         * Optionally updates the last viewed timestamp.
         * @param {GetNewNotificationsData} data - Request body containing channels, types, pagination, and update flag.
         * @returns {Promise<PaginatedNotificationResponse>} Paginated list of new notifications.
         */
    async getNewNotifications(data: GetNewNotificationsData): Promise<PaginatedNotificationResponse> {
      return client._request<PaginatedNotificationResponse>({
        method: 'POST',
        endpoint: '/v1/notifications/new',
        body: data,
        sendJWT: true,
      });
    },

    /**
         * Gets the count of new (unread) notifications for the specified channels.
         * @param {GetNewNotificationCountData} data - Request body containing channels and optional types.
         * @returns {Promise<NotificationCountResponse>} Object containing the count of new notifications.
         */
    async getNewNotificationCount(data: GetNewNotificationCountData): Promise<NotificationCountResponse> {
      return client._request<NotificationCountResponse>({
        method: 'POST',
        endpoint: '/v1/notifications/count',
        body: data,
        sendJWT: true,
      });
    },

    /**
         * Gets the count of new notifications for multiple channel/type queries in a single request.
         * @param {GetNewNotificationCountBulkData} data - Request body containing an array of channel queries.
         * @returns {Promise<NotificationCountBulkResponse>} Array of objects, each containing channels, types (if provided), and count.
         */
    async getNewNotificationCountBulk(data: GetNewNotificationCountBulkData): Promise<NotificationCountBulkResponse> {
      return client._request<NotificationCountBulkResponse>({
        method: 'POST',
        endpoint: '/v1/notifications/count/bulk',
        body: data,
        sendJWT: true,
      });
    },

    /**
         * Retrieves the last seen timestamp record for the specified channels and optional types.
         * @param {GetUsersLastNotificationsSeenData} data - Request body containing channels and optional types.
         * @returns {Promise<LastSeenResponse>} The last seen record object.
         */
    async getUsersLastNotificationsSeen(data: GetUsersLastNotificationsSeenData): Promise<LastSeenResponse> {
      return client._request<LastSeenResponse>({
        method: 'POST',
        endpoint: '/v1/notifications/last-seen',
        body: data,
        sendJWT: true,
      });
    },

    /**
         * Updates (or creates) the last seen timestamp for the user for the specified channels and optional types.
         * @param {UpdateUsersLastSeenData} data - Request body containing channels and optional types.
         * @returns {Promise<LastSeenResponse>} The updated (or created) last seen record object.
         */
    async updateUsersLastSeen(data: UpdateUsersLastSeenData): Promise<LastSeenResponse> {
      return client._request<LastSeenResponse>({
        method: 'PUT',
        endpoint: '/v1/notifications/last-seen',
        body: data,
        sendJWT: true,
      });
    },
  };
} 
import NuramaClient from '../NuramaClient.js';
import { type Notification, type PaginatedResult, type CursorPaginatedResult } from '@nurama/types';
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
    results?: T[];
};
export interface PaginationParams {
    limit?: number;
    cursor?: string;
    paginateReverse?: boolean;
    includeCounts?: boolean;
    includeCursorRecord?: boolean;
    startAt?: string;
    includeStartAtRecord?: boolean;
    page?: number;
}
export interface SortParams {
    sort?: Record<string, 1 | -1>;
}
export interface BaseNotificationParams {
    channels: string[];
    types?: string[];
}
export interface GetNotificationsData extends BaseNotificationParams, PaginationParams, SortParams {
    paginate?: 'cursor' | 'index';
    createdAfter?: number;
    createdBefore?: number;
}
export interface GetNewNotificationsData extends BaseNotificationParams, PaginationParams {
    paginate?: 'cursor' | 'index';
    updateLastSeen?: boolean;
}
export interface GetNewNotificationCountData extends BaseNotificationParams {
}
export interface ChannelQuery {
    channels: string[];
    types?: string[];
}
export interface GetNewNotificationCountBulkData {
    channelQueries: ChannelQuery[];
}
export interface GetUsersLastNotificationsSeenData extends BaseNotificationParams {
}
export interface UpdateUsersLastSeenData extends BaseNotificationParams {
}
export type PaginatedNotificationResponse = PaginatedResponse<Notification>;
export type NotificationCountResponse = {
    count: number;
};
export type NotificationCountBulkResponse = ({
    channels: string[];
    types?: string[];
    count: number;
})[];
export type LastSeenResponse = {
    channels: string[];
    lastSeen: number;
    types?: string[];
};
/**
 * Defines notification-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the notification-related methods.
 */
export default function createNotificationMethods(client: NuramaClient): {
    /**
         * Retrieves notifications for specified channels, with optional filtering and pagination.
         * @param {GetNotificationsData} data - Request body containing channels, types, and pagination/sorting options.
         * @returns {Promise<PaginatedNotificationResponse>} Paginated list of notifications.
         */
    getNotifications(data: GetNotificationsData): Promise<PaginatedNotificationResponse>;
    /**
         * Retrieves new notifications since the user's last viewed timestamp for the specified channels.
         * Optionally updates the last viewed timestamp.
         * @param {GetNewNotificationsData} data - Request body containing channels, types, pagination, and update flag.
         * @returns {Promise<PaginatedNotificationResponse>} Paginated list of new notifications.
         */
    getNewNotifications(data: GetNewNotificationsData): Promise<PaginatedNotificationResponse>;
    /**
         * Gets the count of new (unread) notifications for the specified channels.
         * @param {GetNewNotificationCountData} data - Request body containing channels and optional types.
         * @returns {Promise<NotificationCountResponse>} Object containing the count of new notifications.
         */
    getNewNotificationCount(data: GetNewNotificationCountData): Promise<NotificationCountResponse>;
    /**
         * Gets the count of new notifications for multiple channel/type queries in a single request.
         * @param {GetNewNotificationCountBulkData} data - Request body containing an array of channel queries.
         * @returns {Promise<NotificationCountBulkResponse>} Array of objects, each containing channels, types (if provided), and count.
         */
    getNewNotificationCountBulk(data: GetNewNotificationCountBulkData): Promise<NotificationCountBulkResponse>;
    /**
         * Retrieves the last seen timestamp record for the specified channels and optional types.
         * @param {GetUsersLastNotificationsSeenData} data - Request body containing channels and optional types.
         * @returns {Promise<LastSeenResponse>} The last seen record object.
         */
    getUsersLastNotificationsSeen(data: GetUsersLastNotificationsSeenData): Promise<LastSeenResponse>;
    /**
         * Updates (or creates) the last seen timestamp for the user for the specified channels and optional types.
         * @param {UpdateUsersLastSeenData} data - Request body containing channels and optional types.
         * @returns {Promise<LastSeenResponse>} The updated (or created) last seen record object.
         */
    updateUsersLastSeen(data: UpdateUsersLastSeenData): Promise<LastSeenResponse>;
};
//# sourceMappingURL=notification.d.ts.map
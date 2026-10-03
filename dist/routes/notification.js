/**
 * Defines notification-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the notification-related methods.
 */
export default function createNotificationMethods(client) {
    return {
        /**
             * Retrieves notifications for specified channels, with optional filtering and pagination.
             * @param {GetNotificationsData} data - Request body containing channels, types, and pagination/sorting options.
             * @returns {Promise<PaginatedNotificationResponse>} Paginated list of notifications.
             */
        async getNotifications(data) {
            return client._request({
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
        async getNewNotifications(data) {
            return client._request({
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
        async getNewNotificationCount(data) {
            return client._request({
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
        async getNewNotificationCountBulk(data) {
            return client._request({
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
        async getUsersLastNotificationsSeen(data) {
            return client._request({
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
        async updateUsersLastSeen(data) {
            return client._request({
                method: 'PUT',
                endpoint: '/v1/notifications/last-seen',
                body: data,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=notification.js.map
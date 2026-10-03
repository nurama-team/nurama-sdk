import type { ObjectId } from './common';
import type { PublicUser } from './user';
/**
 * Represents the structure of changes within a notification.
 */
interface NotificationChanges {
    create?: {
        /** @format objectId */
        resourceId: ObjectId;
        resourceType: string;
        /** The resource that was created. */
        resource: Record<string, any>;
    }[];
    update?: {
        /** @format objectId */
        resourceId: ObjectId;
        resourceType: string;
        /** The resource before the update. ( Optional ) */
        oldResource?: Record<string, any>;
        /** The resource that was updated. */
        resource: Record<string, any>;
    }[];
    delete?: {
        /** @format objectId */
        resourceId: ObjectId;
        resourceType: string;
    }[];
}
/**
 * Represents a notification stored in the system.
 */
export interface Notification {
    /**
     * The unique identifier of the notification
     * @format objectId
     */
    id: ObjectId;
    /**
     * The type of notification as defined in config/notifications.
     */
    type: string;
    /**
     * The ID of the user who initiated the notification. Not present for system notifications.
     * @format objectId
     */
    initiatorId?: ObjectId;
    /**
     * The type of resource the notification is about.
     */
    initiatorType: 'user' | 'system';
    /**
     * The public user information for the initiator of the notification. Not present for system notifications.
     */
    initiator?: PublicUser;
    /**
     * The ID of the resource the notification is about.
     * @format objectId
     */
    resourceId: ObjectId;
    /**
     * The type of resource the notification is about.
     */
    resourceType: 'workspace' | 'project' | 'asset' | 'chat' | 'chatMessage' | 'user';
    /**
     * The channels associated with the notification
     */
    channels: string[];
    /**
     * Tokens as defined by the notifications template in config/notifications
     */
    tokens: Record<string, any>;
    /**
     * The timestamp when the notification was created
     * @format int64
     */
    createdAt?: number;
    /**
     * The timestamp when the notification was last updated
     * @format int64
     */
    updatedAt?: number;
    /**
     * The changes that occurred to the resource. Not all keys may be present.
     */
    changes?: NotificationChanges;
}
/**
 * A notification event is a notification that is sent over websocket.
 */
export interface NotificationEvent {
    /**
     * The type of notification as defined in config/notifications.
     */
    type: string;
    /**
     * The ID of the user who initiated the notification. Not present for system notifications.
     * @format objectId
     */
    initiatorId?: ObjectId;
    /**
     * The type of resource the notification is about.
     */
    initiatorType: 'user' | 'system';
    /**
     * The public user information for the initiator of the notification. Not present for system notifications.
     */
    initiator?: PublicUser;
    /**
     * The ID of the resource the notification is about.
     * @format objectId
     */
    resourceId: ObjectId;
    /**
     * The type of resource the notification is about.
     */
    resourceType: 'workspace' | 'project' | 'asset' | 'chat' | 'chatMessage' | 'user';
    /**
     * The channels associated with the notification
     */
    channels: string[];
    /**
     * Tokens as defined by the notifications template in config/notifications
     */
    tokens: Record<string, any>;
    /**
     * The timestamp when the notification was created
     * @format date-time
     */
    createdAt?: string;
    /**
     * The changes that occurred to the resource. Not all keys may be present.
     */
    changes?: NotificationChanges;
}
/**
 * An object formated {[channel: string]: timestamp} showing the last time a user has viewed a channel for each specified channel.
 * It also includes overall createdAt and updatedAt timestamps for the LastSeen record itself.
 * @example {"/workspace/ws123": 1678886400000, "/project/proj456": 1678886500000, "createdAt": 1678886400000, "updatedAt": 1678886500000}
 */
export interface LastSeen {
    [key: string]: number | undefined;
    /**
     * The timestamp when the LastSeen record was created.
     * @format int64
     */
    createdAt?: number;
    /**
     * The timestamp when the LastSeen record was last updated.
     * @format int64
     */
    updatedAt?: number;
}
/**
 * Represents the response containing new notifications and related metadata.
 */
export interface NewNotifications {
    results?: Notification[];
    /**
     * Timestamp indicating the upper bound of notification creation time
     * @format int64
     */
    createdBefore?: number;
    /**
     * Timestamp of when the user last saw notifications. This will be null if there is no record.
     * @format int64
     */
    lastSeen?: number | null;
    /**
     * Updated last seen time step. Only set if updateLastSeen param is set. Otherwise null.
     * @format int64
     */
    updatedLastSeen?: number | null;
}
export {};

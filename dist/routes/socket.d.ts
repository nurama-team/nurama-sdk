import NuramaClient from '../NuramaClient.js';
export interface SocketInterface {
    connected: boolean;
    on: (event: string, listener: (...args: any[]) => void) => void;
    off: (event: string) => void;
    disconnect: () => void;
    emit: (event: string, ...args: any[]) => void;
    timeout: (ms: number) => {
        emit: (event: string, ...args: any[]) => void;
    };
}
export interface BaseNotificationEvent {
    type: string;
    initiatorId: string | null;
    initiatorType: 'user' | 'system';
    initiator: any | null;
    resourceId: string;
    resourceType: string;
    channels: string[];
    createdAt: string;
    tokens?: Record<string, any>;
    changes?: {
        create?: Array<{
            resourceId: string;
            resourceType: string;
            resource: any;
        }>;
        update?: Array<{
            resourceId: string;
            resourceType: string;
            resource: any;
            oldResource?: any;
            newResource?: any;
        }>;
        delete?: Array<{
            resourceId: string;
            resourceType: string;
        }>;
    };
}
export interface SocketOptions {
    /**
     * Automatically handle token refresh
     * @default true
     */
    autoRefresh?: boolean;
    /**
     * Automatically reconnect if connection is lost
     * @default true
     */
    autoReconnect?: boolean;
    /**
     * Automatically attempt to reconnect if token expires
     * @default true
     */
    autoReconnectOnTokenExpiry?: boolean;
    /**
     * Debug logging
     * @default false
     */
    debug?: boolean;
    /**
     * Override the WebSocket URL for this specific connection
     * Takes precedence over the client's websocketURL option
     */
    websocketURL?: string;
}
export interface PublicSocketOptions {
    /**
     * Automatically reconnect if connection is lost
     * @default true
     */
    autoReconnect?: boolean;
    /**
     * Debug logging
     * @default false
     */
    debug?: boolean;
    /**
     * Override the WebSocket URL for this specific connection
     * Takes precedence over the client's websocketURL option
     */
    websocketURL?: string;
}
export interface SocketChannel {
    /** Socket.IO instance */
    socket: SocketInterface;
    /** Channel path */
    channel: string;
    /** Event listeners */
    listeners: Record<string, Set<(event: any) => void>>;
}
export default function createSocketMethods(client: NuramaClient): {
    connect: (channel: string, options?: SocketOptions) => Promise<SocketChannel>;
    connectPublic: (publicToken: string, options?: PublicSocketOptions) => Promise<SocketChannel>;
    disconnect: (channel: string) => Promise<void>;
    disconnectAll: () => Promise<void>;
    subscribe: <T = BaseNotificationEvent>(channel: string, event: string, callback: (event: T) => void) => Promise<void>;
    subscribePublic: <T = BaseNotificationEvent>(publicToken: string, event: string, callback: (event: T) => void) => Promise<void>;
    unsubscribe: (channel: string, event: string, callback?: (event: any) => void) => void;
    isConnected: (channel: string) => boolean;
    emit: (channel: string, event: string, data?: unknown) => void;
    emitWithAck: (channel: string, event: string, data: unknown, timeoutMs: number) => Promise<boolean>;
    onReconnect: (channel: string, callback: (event?: unknown) => void) => void;
    onReconnectFailed: (channel: string, callback: () => void) => void;
};
export type SocketMethods = ReturnType<typeof createSocketMethods>;
//# sourceMappingURL=socket.d.ts.map
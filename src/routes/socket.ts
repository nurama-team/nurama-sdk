/* eslint-disable no-console */

import NuramaClient from '../NuramaClient.js';

// Define a generic Socket interface to avoid tight coupling to the socket.io-client types
export interface SocketInterface {
  connected: boolean;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string) => void;
  disconnect: () => void;
  emit: (event: string, ...args: any[]) => void;
  // socket.io v4 timeout-bounded ack pattern: `.timeout(ms).emit(ev, ...args, cb)`.
  // Returns a thin chainable whose `.emit` invokes `cb(Error | null, ...ackArgs)`
  // — Error on timeout, null on server ack. Used by `emitWithAck`.
  timeout: (ms: number) => { emit: (event: string, ...args: any[]) => void };
}

// Interfaces for socket events
export interface BaseNotificationEvent {
  type: string;
  initiatorId: string | null;
  initiatorType: 'user' | 'system';
  initiator: any | null; // User object if initiatorType is 'user'
  resourceId: string;
  resourceType: string;
  channels: string[];
  createdAt: string;
  tokens?: Record<string, any>;
  changes?: {
    create?: Array<{ resourceId: string; resourceType: string; resource: any }>;
    update?: Array<{ resourceId: string; resourceType: string; resource: any; oldResource?: any; newResource?: any }>;
    delete?: Array<{ resourceId: string; resourceType: string }>;
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

/**
 * Listener-set keys that the built-in socket handlers bound in connect()/
 * connectPublic() dispatch to directly (rather than via a subscribe()-bound
 * `socket.on`). When re-establishing subscriptions after an in-place reconnect
 * these must be repopulated on the new connection's listener set, NOT re-run
 * through subscribe() — doing so would bind a second `socket.on` dispatcher and
 * fire each callback twice.
 */
const LIFECYCLE_LISTENER_EVENTS = new Set([
  'disconnect',
  'tokenExpired',
  'tokenBlacklisted',
  'reconnect_failed',
  'reconnect',
]);

export default function createSocketMethods(client: NuramaClient) {
  // Track active socket connections
  const activeConnections: Record<string, SocketChannel> = {};
  
  // Extract configuration from client
  const debug = client.debug;
  
  /**
   * Log helper for socket-related messages
   */
  const _log = (...args: any[]): void => {
    if (debug) {
      console.log('[SOCKET]', ...args);
    }
  };
  
  // We'll need to dynamically import socket.io-client since it's not available in all environments
  const getSocketIO = async (): Promise<any> => {
    try {
      // Handle different versions of socket.io-client
      const socketModule = await import('socket.io-client');
      // Socket.io 4.x exports the io function directly
      return socketModule.default || socketModule;
    } catch (error) {
      throw new Error('socket.io-client is not installed. Please install it with: npm install socket.io-client');
    }
  };
  
  /**
   * Get an authentication token for WebSocket connection.
   * Returns the long-lived API key when the client is in bot mode, otherwise the JWT.
   */
  const getAuthToken = (): string | null => {
    return (client as any)._apiKey || (client as any)._getAccessToken();
  };

  /** True when the client is authenticating with a bot API key. */
  const isApiKeyMode = (): boolean => Boolean((client as any)._apiKey);
  
  /**
   * Get the WebSocket server URL
   * 
   * Priority:
   * 1. Connection-specific websocketURL (from options)
   * 2. Client-level websocketURL (from client options)
   * 3. Use the baseURL directly - Socket.IO handles protocol conversion
   */
  const getWebSocketURL = (connectionOptions?: SocketOptions): string => {
    // 1. Check connection-specific override
    if (connectionOptions?.websocketURL) {
      return connectionOptions.websocketURL;
    }
    
    // 2. Check client-level websocketURL
    if (client.websocketURL) {
      return client.websocketURL;
    }
    
    // 3. Use baseURL directly - Socket.IO handles protocol conversion
    return client.baseURL;
  };
  
  /**
   * Connect to a socket channel
   * @param channel Channel path to connect to (e.g., '/user/123')
   * @param options Socket connection options
   * @returns Promise that resolves with the socket channel
   */
  const connect = async (channel: string, options: SocketOptions = {}): Promise<SocketChannel> => {
    _log(`Connecting to channel: ${channel}`);
    
    // Default options
    const socketOptions = {
      autoRefresh: true,
      autoReconnect: true,
      autoReconnectOnTokenExpiry: true,
      debug: client.debug,
      ...options
    };
    
    // Check if already connected
    if (activeConnections[channel]) {
      _log(`Already connected to channel: ${channel}`);
      return activeConnections[channel];
    }
    
    // Get access token
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }
    
    // Get WebSocket URL using the helper function - no protocol conversion needed
    const wsUrl = getWebSocketURL(options);
    _log(`Using Socket.IO URL: ${wsUrl}`);
    
    // Dynamically import socket.io-client
    const io = await getSocketIO();
    
    // Create socket connection with enhanced reconnection configuration
    const socket = io(`${wsUrl}${channel}`, {
      query: { token },

      // Reconnection configuration for resilience
      reconnection: socketOptions.autoReconnect,
      reconnectionAttempts: 10,           // Maximum reconnection attempts before giving up
      reconnectionDelay: 1000,             // Start with 1 second delay
      reconnectionDelayMax: 30000,         // Max delay of 30 seconds between attempts
      randomizationFactor: 0.5,            // Add jitter to avoid thundering herd problem

      // Connection timeout
      timeout: 20000,                      // 20 seconds to establish initial connection

      // Transport configuration
      transports: ['websocket', 'polling'], // Prefer WebSocket, fallback to polling
      upgrade: true,                        // Allow transport upgrade
      rememberUpgrade: true,                // Remember successful upgrade

      // Ping/pong for connection health
      forceNew: false,                      // Reuse existing connection if available
    });
    
    // Create channel object
    const socketChannel: SocketChannel = {
      socket,
      channel,
      listeners: {},
    };
    
    // Store connection immediately so subscribers can register socket.on handlers
    // even before the connection is fully established. Socket.io preserves
    // handlers across reconnections, so they will fire once connected.
    activeConnections[channel] = socketChannel;

    // Setup event listeners
    return new Promise((resolve, reject) => {
      let settled = false;

      // Handle connection (initial or after reconnection)
      socket.on('connect', () => {
        _log(`Connected to channel: ${channel}`);
        activeConnections[channel] = socketChannel;
        if (!settled) {
          settled = true;
          resolve(socketChannel);
        }
      });

      // Handle connection error — log but let socket.io retry
      socket.on('connect_error', (error: unknown) => {
        _log(`Connection error for channel ${channel}:`, error);
        // Don't reject — socket.io's auto-reconnect will keep trying
        // Resolve the promise so callers aren't blocked — subscriptions
        // registered via socket.on will fire once the connection succeeds
        if (!settled) {
          settled = true;
          resolve(socketChannel);
        }
      });

      // Handle reconnection attempts
      socket.on('reconnect_attempt', (attempt: number) => {
        _log(`Reconnection attempt ${attempt} for channel: ${channel}`);
      });

      // Handle successful reconnection
      socket.on('reconnect', (attempt: number) => {
        _log(`Reconnected to channel ${channel} after ${attempt} attempts`);
        // Ensure activeConnections is up to date after reconnect
        activeConnections[channel] = socketChannel;
        // Notify app-level onReconnect listeners so they can REST-refetch any
        // gap of server->client messages missed while the transport was down
        // (socket.io has no replay across a reconnect).
        const reconnectListeners = socketChannel.listeners['reconnect'] || new Set();
        reconnectListeners.forEach(listener => listener({ type: 'reconnect', attempt }));
      });

      // Handle reconnection failure — only reject when socket.io gives up entirely
      socket.on('reconnect_failed', () => {
        _log(`Reconnection failed for channel ${channel} after maximum attempts`);
        // Emit to listeners for UI feedback
        const eventListeners = socketChannel.listeners['reconnect_failed'] || new Set();
        eventListeners.forEach(listener => listener({ type: 'reconnect_failed' }));
        if (!settled) {
          settled = true;
          reject(new Error(`Connection to ${channel} failed after maximum reconnection attempts`));
        }
      });
      
      // Handle token events
      socket.on('tokenEvent', (event: string) => {
        _log(`Token event on channel ${channel}:`, event);

        if (event === 'TokenExpired' && socketOptions.autoReconnectOnTokenExpiry) {
          // API keys don't expire client-side; if the server emits TokenExpired
          // for a bot, treat it as terminal — there's nothing to refresh.
          if (isApiKeyMode()) {
            _log('Token expired event in API key mode — disconnecting (no refresh path)');
            disconnect(channel);
            const eventListeners = socketChannel.listeners['tokenExpired'] || new Set();
            eventListeners.forEach(listener => listener({ type: 'tokenExpired' }));
            return;
          }

          // Refresh token and reconnect
          _log('Token expired, attempting to refresh and reconnect');

          // Call the client's _refreshToken method (using 'as any' for TypeScript)
          (client as any)._refreshToken()
            .then(() => {
              _log('Token refreshed, reconnecting');
              // Preserve event subscriptions across the reconnect. connect()
              // builds a brand-new socket whose listeners map starts empty, so
              // without re-binding these the channel reconnects but silently
              // stops delivering 'notification' events — the app-level
              // subscription is lost until a full page reload. This fires on the
              // server's token-expiry sweep (~every 30 min for a long-lived
              // session), so the reconnect must carry the subscriptions over.
              const preservedListeners = socketChannel.listeners;
              disconnect(channel)
                .then(() => connect(channel, options))
                .then((newConnection) => {
                  Object.entries(preservedListeners).forEach(([listenerEvent, callbacks]) => {
                    callbacks.forEach((callback) => {
                      if (LIFECYCLE_LISTENER_EVENTS.has(listenerEvent)) {
                        // Built-in handlers on the fresh socket already dispatch
                        // these; just repopulate the set they read from.
                        if (!newConnection.listeners[listenerEvent]) {
                          newConnection.listeners[listenerEvent] = new Set();
                        }
                        newConnection.listeners[listenerEvent].add(callback);
                      } else {
                        subscribe(channel, listenerEvent, callback as (e: any) => void);
                      }
                    });
                  });
                  // The fresh socket fired 'connect', not 'reconnect', so notify
                  // onReconnect listeners here too — a token-refresh reconnect is
                  // still a gap that needs the same REST catch-up.
                  (newConnection.listeners['reconnect'] || new Set()).forEach(listener =>
                    listener({ type: 'reconnect', reason: 'tokenRefresh' }));
                })
                .catch((error: unknown) => {
                  _log(`Failed to re-establish subscriptions after token refresh on ${channel}:`, error);
                });
            })
            .catch((error: unknown) => {
              _log('Failed to refresh token', error);
              // Emit disconnect event to listeners
              const eventListeners = socketChannel.listeners['tokenExpired'] || new Set();
              eventListeners.forEach(listener => listener({ type: 'tokenExpired', error }));
            });
        } else if (event === 'tokenBlacklisted') {
          // Force disconnect
          _log('Token blacklisted, disconnecting');
          disconnect(channel);
          
          // Emit disconnect event to listeners
          const eventListeners = socketChannel.listeners['tokenBlacklisted'] || new Set();
          eventListeners.forEach(listener => listener({ type: 'tokenBlacklisted' }));
        }
      });
      
      // Handle disconnect
      socket.on('disconnect', (reason: string) => {
        _log(`Disconnected from channel ${channel}:`, reason);
        
        // Emit disconnect event to listeners
        const eventListeners = socketChannel.listeners['disconnect'] || new Set();
        eventListeners.forEach(listener => listener({ type: 'disconnect', reason }));
        
        // Remove from active connections
        delete activeConnections[channel];
      });
    });
  };

  /**
   * Connect to a public socket channel without authentication
   * @param publicToken Public file system token (10-character alphanumeric)
   * @param options Socket connection options
   * @returns Promise that resolves with the socket channel
   */
  const connectPublic = async (publicToken: string, options: PublicSocketOptions = {}): Promise<SocketChannel> => {
    const channel = `public/${publicToken}`;
    _log(`Connecting to public channel: ${channel}`);

    // Default options
    const socketOptions = {
      autoReconnect: true,
      debug: client.debug,
      ...options
    };

    // Check if already connected
    if (activeConnections[channel]) {
      _log(`Already connected to public channel: ${channel}`);
      return activeConnections[channel];
    }

    // Get WebSocket URL using the helper function
    const wsUrl = getWebSocketURL(options);
    _log(`Using Socket.IO URL for public connection: ${wsUrl}`);

    // Dynamically import socket.io-client
    const io = await getSocketIO();

    // Create socket connection - no token needed for public channels
    const socket = io(`${wsUrl}${channel}`, {
      query: { publicToken },

      // Reconnection configuration for resilience
      reconnection: socketOptions.autoReconnect,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5,

      // Connection timeout
      timeout: 20000,

      // Transport configuration
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,

      forceNew: false,
    });

    // Create channel object
    const socketChannel: SocketChannel = {
      socket,
      channel,
      listeners: {},
    };

    // Setup event listeners
    return new Promise((resolve, reject) => {
      // Handle connection
      socket.on('connect', () => {
        _log(`Connected to public channel: ${channel}`);
        activeConnections[channel] = socketChannel;
        resolve(socketChannel);
      });

      // Handle connection error
      socket.on('connect_error', (error: unknown) => {
        _log(`Connection error for public channel ${channel}:`, error);
        reject(error);
      });

      // Handle reconnection attempts
      socket.on('reconnect_attempt', (attempt: number) => {
        _log(`Reconnection attempt ${attempt} for public channel: ${channel}`);
      });

      // Handle successful reconnection
      socket.on('reconnect', (attempt: number) => {
        _log(`Reconnected to public channel ${channel} after ${attempt} attempts`);
      });

      // Handle reconnection failure
      socket.on('reconnect_failed', () => {
        _log(`Reconnection failed for public channel ${channel} after maximum attempts`);
        const eventListeners = socketChannel.listeners['reconnect_failed'] || new Set();
        eventListeners.forEach(listener => listener({ type: 'reconnect_failed' }));
      });

      // Handle disconnect
      socket.on('disconnect', (reason: string) => {
        _log(`Disconnected from public channel ${channel}:`, reason);

        // Emit disconnect event to listeners
        const eventListeners = socketChannel.listeners['disconnect'] || new Set();
        eventListeners.forEach(listener => listener({ type: 'disconnect', reason }));

        // Remove from active connections
        delete activeConnections[channel];
      });
    });
  };

  /**
   * Disconnect from a socket channel
   * @param channel Channel to disconnect from
   */
  const disconnect = async (channel: string): Promise<void> => {
    const connection = activeConnections[channel];
    if (connection) {
      _log(`Disconnecting from channel: ${channel}`);
      connection.socket.disconnect();
      delete activeConnections[channel];
    }
  };
  
  /**
   * Subscribe to an event on a channel
   * @param channel Channel to subscribe to
   * @param event Event name to listen for
   * @param callback Callback function to handle events
   */
  const subscribe = async <T = BaseNotificationEvent>(
    channel: string, 
    event: string, 
    callback: (event: T) => void
  ): Promise<void> => {
    // Get or create connection
    let connection = activeConnections[channel];
    if (!connection) {
      connection = await connect(channel);
    }
    
    // Initialize listeners set for this event if needed
    if (!connection.listeners[event]) {
      connection.listeners[event] = new Set();
      
      // Add socket listener for this event
      connection.socket.on(event, (eventData: T) => {
        _log(`Received event '${event}' on channel ${channel}:`, eventData);
        
        // Call all registered callbacks
        const eventListeners = connection.listeners[event] || new Set();
        eventListeners.forEach(listener => listener(eventData));
      });
    }
    
    // Add callback to listeners
    connection.listeners[event].add(callback as any);
    _log(`Subscribed to event '${event}' on channel ${channel}`);
  };
  
  /**
   * Subscribe to an event on a public channel
   * Automatically connects to the public channel if not already connected
   * @param publicToken Public file system token (10-character alphanumeric)
   * @param event Event name to listen for
   * @param callback Callback function to handle events
   */
  const subscribePublic = async <T = BaseNotificationEvent>(
    publicToken: string,
    event: string,
    callback: (event: T) => void
  ): Promise<void> => {
    const channel = `public/${publicToken}`;

    // Get or create public connection
    let connection = activeConnections[channel];
    if (!connection) {
      connection = await connectPublic(publicToken);
    }

    // Initialize listeners set for this event if needed
    if (!connection.listeners[event]) {
      connection.listeners[event] = new Set();

      // Add socket listener for this event
      connection.socket.on(event, (eventData: T) => {
        _log(`Received event '${event}' on public channel ${channel}:`, eventData);

        // Call all registered callbacks
        const eventListeners = connection.listeners[event] || new Set();
        eventListeners.forEach(listener => listener(eventData));
      });
    }

    // Add callback to listeners
    connection.listeners[event].add(callback as any);
    _log(`Subscribed to event '${event}' on public channel ${channel}`);
  };

  /**
   * Unsubscribe from an event on a channel
   * @param channel Channel to unsubscribe from
   * @param event Event name to stop listening for
   * @param callback Callback function to remove (if not provided, all callbacks will be removed)
   */
  /**
   * Stop listening for an event on a channel. If `callback` is provided,
   * only that specific listener is removed; otherwise every listener for
   * that event is cleared.
   *
   * @param channel Channel to unsubscribe from
   * @param event Event name to stop listening for
   * @param callback Specific callback to remove (optional)
   */
  const unsubscribe = (
    channel: string,
    event: string,
    callback?: (event: any) => void
  ): void => {
    const connection = activeConnections[channel];
    if (!connection || !connection.listeners[event]) {
      return;
    }
    
    if (callback) {
      // Remove specific callback
      connection.listeners[event].delete(callback);
      _log(`Unsubscribed specific callback from event '${event}' on channel ${channel}`);
    } else {
      // Remove all callbacks
      connection.listeners[event].clear();
      connection.socket.off(event);
      _log(`Unsubscribed all callbacks from event '${event}' on channel ${channel}`);
    }
  };
  
  /**
   * Check if connected to a channel
   * @param channel Channel to check
   * @returns True if connected, false otherwise
   */
  const isConnected = (channel: string): boolean => {
    return !!activeConnections[channel]?.socket.connected;
  };

  /**
   * Emit an event to a connected channel
   * @param channel Channel to emit to
   * @param event Event name
   * @param data Event data
   */
  const emit = (channel: string, event: string, data?: unknown): void => {
    const connection = activeConnections[channel];
    if (!connection?.socket.connected) {
      _log(`Cannot emit to channel ${channel}: not connected`);
      return;
    }
    _log(`Emitting '${event}' on channel ${channel}`);
    connection.socket.emit(event, data);
  };

  /**
   * Emit an event with a timeout-bounded server acknowledgement. Resolves
   * `true` if the server acks within `timeoutMs`, `false` on timeout or
   * transport error. Used by the FE WS layer (`WebSocketManager.probeChannel`)
   * to actively verify a channel's liveness when `socket.connected` may be
   * stale — most notably after a backgrounded tab returns to focus, where
   * the flag can remain `true` for up to socket.io's own heartbeat window
   * (~25–45s) even after the underlying TCP transport has died.
   *
   * Relies on socket.io v4's `socket.timeout(ms).emit(ev, data, cb)`
   * pattern: the BE handler invokes `ack()` (its trailing callback arg);
   * if no ack arrives within `timeoutMs` the cb is invoked with an Error.
   */
  const emitWithAck = (
    channel: string,
    event: string,
    data: unknown,
    timeoutMs: number,
  ): Promise<boolean> => {
    const connection = activeConnections[channel];
    if (!connection) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      try {
        connection.socket.timeout(timeoutMs).emit(event, data, (err: Error | null) => {
          resolve(!err);
        });
      } catch (error) {
        _log(`emitWithAck error on channel ${channel}:`, error);
        resolve(false);
      }
    });
  };

  /**
   * Disconnect from all channels
   */
  const disconnectAll = async (): Promise<void> => {
    _log('Disconnecting from all channels');
    const channels = Object.keys(activeConnections);
    for (const channel of channels) {
      await disconnect(channel);
    }
  };

  /**
   * Register a callback for when Socket.IO exhausts all reconnection attempts
   * @param channel Channel to monitor
   * @param callback Callback invoked when reconnection fails permanently
   */
  const onReconnectFailed = (channel: string, callback: () => void): void => {
    const connection = activeConnections[channel];
    if (connection) {
      // Add to the channel's listener set so the existing reconnect_failed
      // handler in connect()/connectPublic() dispatches to it
      if (!connection.listeners['reconnect_failed']) {
        connection.listeners['reconnect_failed'] = new Set();
      }
      connection.listeners['reconnect_failed'].add(callback);
    }
  };

  /**
   * Register a callback for when the channel reconnects — a socket.io
   * transport-level reconnect, or the token-refresh reconnect. Use it to recover
   * any gap of server->client messages missed while the connection was down;
   * socket.io does not replay those. Dispatched from the 'reconnect' handler in
   * connect() and from the token-refresh path.
   */
  const onReconnect = (channel: string, callback: (event?: unknown) => void): void => {
    const connection = activeConnections[channel];
    if (connection) {
      if (!connection.listeners['reconnect']) {
        connection.listeners['reconnect'] = new Set();
      }
      connection.listeners['reconnect'].add(callback);
    }
  };

  return {
    connect,
    connectPublic,
    disconnect,
    disconnectAll,
    subscribe,
    subscribePublic,
    unsubscribe,
    isConnected,
    emit,
    emitWithAck,
    onReconnect,
    onReconnectFailed,
  };
}

export type SocketMethods = ReturnType<typeof createSocketMethods>; 
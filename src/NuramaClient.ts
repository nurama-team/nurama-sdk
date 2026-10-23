import { jwtDecode } from 'jwt-decode';

import { paramsToUrlSearchParams } from './utils/urlParams.js';
import createAuthMethods from './routes/auth.js';
import createSubscriptionMethods from './routes/subscription.js';
import createUserMethods from './routes/user.js';
import createWorkspaceMethods from './routes/workspace.js';
import createProjectMethods from './routes/project.js';
import createAssetMethods from './routes/asset.js';
import createChatMethods from './routes/chat.js';
import createFolderMethods from './routes/folder.js';
import createInviteMethods from './routes/invite.js';
import createJoinLinkMethods from './routes/joinLink.js';
import createMembershipMethods from './routes/membership.js';
import createNotificationMethods from './routes/notification.js';
import createPaymentMethods from './routes/payment.js';
import createProductMethods from './routes/product.js';
import createSocketMethods from './routes/socket.js';
import createStorageMethods from './routes/storage.js';
import createTaskMethods from './routes/task.js';
import createVersionMethods from './routes/version.js';
import createConfigMethods from './routes/config.js';
import createTagMethods from './routes/tag.js';
import createUserFeedMethods from './routes/userFeed.js';
import createPublicMethods from './routes/public.js';
import createSettingsMethods from './routes/settings.js';
import createDeviceMethods from './routes/device.js';
import createShortLinkMethods from './routes/shortlink.js';
import createConvoMethods from './routes/convo.js';
import createBoardMethods from './routes/board.js';
import createTaskRelationMethods from './routes/taskRelation.js';
import createBotMethods from './routes/bot.js';
import createAiMethods from './routes/ai.js';
import createAiChatMethods from './routes/chatAi.js';
import createSupportChatMethods from './routes/supportChat.js';
import createBlogPostsMethods from './routes/blogPosts.js';
import createCreditsMethods from './routes/credits.js';
import createScratchMethods from './routes/scratch.js';
import createTokenMethods from './routes/token.js';
import createOAuthGrantMethods from './routes/oauthGrant.js';
import createWebhookMethods from './routes/webhook.js';
import createSupportTicketMethods from './routes/supportTicket.js';
import { SDK_VERSION, type SDKVersionInfo } from './version.js';

// Type definitions

export interface NuramaClientOptions {
  /** Custom fetch implementation. If not provided, will use global fetch */
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

  /** Key used to store the access token in storage. Default: 'nurama_token' */
  tokenStorageKey?: string;

  /** Key used to store the refresh token in storage. Default: 'nurama_refresh_token' */
  refreshTokenStorageKey?: string;

  /** Whether to run in browser mode (uses localStorage for token storage). Default: false */
  browserMode?: boolean;

  /** Number of seconds before token expiry to trigger refresh. Default: 300 (5 minutes) */
  tokenExpiryBufferSeconds?: number;

  /** Delay in ms between token refresh retries. Default: 1000 */
  tokenRefreshRetryDelayMs?: number;

  /** Maximum time in ms to wait for token refresh. Default: 10000 */
  tokenRefreshMaxWaitMs?: number;

  /** Timeout in ms for the refresh lock to prevent multiple simultaneous refreshes. Default: 5000 */
  refreshLockTimeoutMs?: number;

  /** Enable debug logging. Default: false */
  debug?: boolean;
  
  /** WebSocket server URL. If not provided, will use the baseURL */
  websocketURL?: string;

  /** Enable response caching. Default: true */
  enableCache?: boolean;

  /** Cache duration in seconds. Default: 5 */
  cacheDurationSeconds?: number;

  /** After a successful write (POST/PUT/PATCH/DELETE) to a resource, evict
   *  cached GET responses for that resource so the next read returns fresh
   *  data (read-after-write consistency). Default: true. */
  invalidateCacheOnMutation?: boolean;

  /** Callback invoked when authentication fails and re-login is required
   *  (e.g., refresh token expired/missing). `reason.type` carries the
   *  backend error type when available — notably `emailVerificationRequired`
   *  when the refresh was rejected because the user's email-verification
   *  grace period has expired, so callers can prompt verification instead of
   *  a plain logout. */
  onUnauthorized?: (reason?: { type?: string }) => void;

  /** Invoked when the API returns a `{ error: 'maintenance' }` body on a 418 or
   *  503 — i.e. the site is in a maintenance window (the edge rule returns this
   *  to non-allowlisted clients; a Cloudflare WAF block can only be a 4xx, so
   *  418 — a guaranteed-unused sentinel — is used there, while a Worker/origin
   *  can return 503). Lets an already-loaded (cached) SPA surface a maintenance
   *  message instead of failing silently. */
  onMaintenance?: () => void;

  /**
   * Invoked whenever the client's tokens change (login, MFA completion, refresh,
   * logout, or a failed refresh clearing the session). Lets non-browser hosts
   * (e.g. React Native) persist the session in their own secure storage; pair
   * with `restoreSession()` on startup. Not called by `restoreSession()` itself.
   */
  onTokensChanged?: (session: NuramaSession | null) => void;

  /**
   * Long-lived API key to use for every request (e.g., a bot API key starting with `nrm_bot_`).
   * When set, the client skips JWT refresh logic and uses the key as the bearer token.
   */
  apiKey?: string;
}

/** A persisted session: the token pair plus their ISO expiry timestamps. */
export interface NuramaSession {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiry: string | null;
  refreshTokenExpiry: string | null;
}

interface RequestParams {
  [key: string]: any; // Allows any query parameters
}

interface RequestBody {
  [key: string]: any; // Allows any body structure, consider defining more specific types
}

// Base request options internal to the client
interface InternalRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  params?: RequestParams;
  body?: RequestBody | null;
  /**
   * Authentication mode for the request:
   *   - true (default): JWT required — refresh a stale token and throw if unavailable.
   *   - false: no auth — never attach a token.
   *   - 'optional': attach a valid token if the client has one (best-effort
   *     refresh), otherwise proceed anonymously without throwing. Used by public
   *     routes that accept both authenticated and anonymous callers.
   */
  sendJWT?: boolean | 'optional';
  customHeaders?: Record<string, string>;
  _isInternalRefresh?: boolean;
  bypassCache?: boolean;
}

// Cache entry structure
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

// JWT payload structure (adjust based on your actual token)
interface JwtPayload {
  exp: number;
  sub: string; // Add user ID to JWT payload
  // Add other relevant claims like sub, iat, etc.
}

/**
 * Error thrown by `_request` when the API responds with a non-2xx status.
 * `status` is the HTTP status and `data` the parsed error body
 * (`{ type, code, message, errorData? }`). Use `isApiError` to narrow.
 */
export interface ApiError extends Error {
  status?: number;
  data?: any;
}

/** Narrow an unknown thrown value to an API error carrying an HTTP status. */
export const isApiError = (error: unknown): error is ApiError =>
  error instanceof Error && typeof (error as ApiError).status === 'number';

// Define types for the route method groups based on their return types
export interface AuthMethods extends ReturnType<typeof createAuthMethods> {}
export interface SubscriptionMethods extends ReturnType<typeof createSubscriptionMethods> {}
export interface UserMethods extends ReturnType<typeof createUserMethods> {}
export interface WorkspaceMethods extends ReturnType<typeof createWorkspaceMethods> {}
export interface ProjectMethods extends ReturnType<typeof createProjectMethods> {}
export interface AssetMethods extends ReturnType<typeof createAssetMethods> {}
type ChatMethods = ReturnType<typeof createChatMethods>;
type FolderMethods = ReturnType<typeof createFolderMethods>;
type InviteMethods = ReturnType<typeof createInviteMethods>;
type JoinLinkMethods = ReturnType<typeof createJoinLinkMethods>;
type MembershipMethods = ReturnType<typeof createMembershipMethods>;
type NotificationMethods = ReturnType<typeof createNotificationMethods>;
type PaymentMethods = ReturnType<typeof createPaymentMethods>;
type ProductMethods = ReturnType<typeof createProductMethods>;
type SocketMethods = ReturnType<typeof createSocketMethods>;
type StorageMethods = ReturnType<typeof createStorageMethods>;
type TaskMethods = ReturnType<typeof createTaskMethods>;
type VersionMethods = ReturnType<typeof createVersionMethods>;
type ConfigMethods = ReturnType<typeof createConfigMethods>;
type TagMethods = ReturnType<typeof createTagMethods>;
type UserFeedMethods = ReturnType<typeof createUserFeedMethods>;
type PublicMethods = ReturnType<typeof createPublicMethods>;
type SettingsMethods = ReturnType<typeof createSettingsMethods>;
type DeviceMethods = ReturnType<typeof createDeviceMethods>;
type ShortLinkMethods = ReturnType<typeof createShortLinkMethods>;
type ConvoMethods = ReturnType<typeof createConvoMethods>;
type BoardMethods = ReturnType<typeof createBoardMethods>;
type TaskRelationMethods = ReturnType<typeof createTaskRelationMethods>;
type BotMethods = ReturnType<typeof createBotMethods>;
type AiMethods = ReturnType<typeof createAiMethods>;
type AiChatMethods = ReturnType<typeof createAiChatMethods>;
type SupportChatMethods = ReturnType<typeof createSupportChatMethods>;
type BlogPostsMethods = ReturnType<typeof createBlogPostsMethods>;
type CreditsMethods = ReturnType<typeof createCreditsMethods>;
type ScratchMethods = ReturnType<typeof createScratchMethods>;
type TokenMethods = ReturnType<typeof createTokenMethods>;
type OAuthGrantMethods = ReturnType<typeof createOAuthGrantMethods>;
type WebhookMethods = ReturnType<typeof createWebhookMethods>;
type SupportTicketMethods = ReturnType<typeof createSupportTicketMethods>;

/**
 * Client interface for interacting with the Nurama REST API.
 */
class NuramaClient {
  // --- Properties with types ---
  readonly baseURL: string;
  readonly fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  readonly tokenStorageKey: string;
  readonly refreshTokenStorageKey: string;
  readonly browserMode: boolean = false;
  readonly tokenExpiryBufferSeconds: number;
  readonly refreshLockTimeoutMs: number;
  readonly tokenRefreshRetryDelayMs: number;
  readonly tokenRefreshMaxWaitMs: number;
  readonly debug: boolean;
  readonly websocketURL?: string;
  readonly enableCache: boolean;
  readonly cacheDurationSeconds: number;
  readonly invalidateCacheOnMutation: boolean;
  private readonly _onUnauthorized?: (reason?: { type?: string }) => void;
  private readonly _onMaintenance?: () => void;
  private readonly _onTokensChanged?: (session: NuramaSession | null) => void;

  private _accessToken: string | null = null;
  private _refreshTokenValue: string | null = null;
  private _accessTokenExpiry: string | null = null;
  private _refreshTokenExpiry: string | null = null;
  private _verifyMfaToken: string | null = null;
  private _isRefreshing: boolean = false;
  private _lastRefreshAttempt: number = 0;
  private _cache: Map<string, CacheEntry> = new Map();
  // Bumped on any cache clear/invalidation so a GET already in flight won't
  // re-cache a response body that predates the clear.
  private _cacheGeneration = 0;
  private readonly _apiKey: string | null = null;

  // Namespaced methods
  readonly auth: AuthMethods;
  readonly subscription: SubscriptionMethods;
  readonly user: UserMethods;
  readonly workspace: WorkspaceMethods;
  readonly project: ProjectMethods;
  readonly asset: AssetMethods;
  public chat: ChatMethods;
  public folder: FolderMethods;
  public invite: InviteMethods;
  public joinLink: JoinLinkMethods;
  public membership: MembershipMethods;
  public notification: NotificationMethods;
  public payment: PaymentMethods;
  public product: ProductMethods;
  public socket: SocketMethods;
  public storage: StorageMethods;
  public task: TaskMethods;
  public version: VersionMethods;
  readonly config: ConfigMethods;
  public tag: TagMethods;
  public userFeed: UserFeedMethods;
  public public: PublicMethods;
  public settings: SettingsMethods;
  public device: DeviceMethods;
  public shortlink: ShortLinkMethods;
  public convo: ConvoMethods;
  public board: BoardMethods;
  public taskRelation: TaskRelationMethods;
  public bot: BotMethods;
  public ai: AiMethods;
  public aiChat: AiChatMethods;
  public supportChat: SupportChatMethods;
  public blogPosts: BlogPostsMethods;
  public credits: CreditsMethods;
  public scratch: ScratchMethods;
  public token: TokenMethods;

  /** Connected applications: what the user has authorised over OAuth. */
  public oauthGrant: OAuthGrantMethods;
  public webhook: WebhookMethods;
  public supportTicket: SupportTicketMethods;

  /**
   * Creates an instance of NuramaClient.
   * @param baseURL - The base URL for the Nurama API.
   * @param options - Configuration options.
   */
  constructor(baseURL: string, options: NuramaClientOptions = {}) {
    if (!baseURL) {
      throw new Error('baseURL is required.');
    }
    // Use global fetch if available and no fetch provided
    const defaultFetch = typeof fetch !== 'undefined' ? fetch : undefined;

    this.baseURL = baseURL.replace(/\/$/, '');

    // Determine if we're in browser mode
    this.browserMode = options.browserMode || false;
    
    // Handle fetch implementation with proper binding in browser mode
    let effectiveFetch;
    if (options.fetch) {
      // User provided custom fetch implementation
      effectiveFetch = options.fetch;
    } else if (this.browserMode && typeof window !== 'undefined' && window.fetch) {
      // In browser mode, wrap fetch to ensure proper binding to window
      effectiveFetch = (url: RequestInfo | URL, init?: RequestInit) => window.fetch(url, init);
    } else {
      // Fallback to default fetch
      effectiveFetch = defaultFetch;
    }

    // Validate fetch availability
    if (!effectiveFetch) {
      throw new Error('Fetch implementation not found. Please provide one in options or ensure global fetch is available.');
    }
    this.fetch = effectiveFetch as (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

    this.tokenStorageKey = options.tokenStorageKey || 'nurama_access_token';
    this.refreshTokenStorageKey = options.refreshTokenStorageKey || 'nurama_refresh_token';
    this.tokenExpiryBufferSeconds = options.tokenExpiryBufferSeconds === undefined ? 60 : options.tokenExpiryBufferSeconds;
    this.refreshLockTimeoutMs = options.refreshLockTimeoutMs === undefined ? 1000 : options.refreshLockTimeoutMs;
    this.tokenRefreshRetryDelayMs = options.tokenRefreshRetryDelayMs === undefined ? 100 : options.tokenRefreshRetryDelayMs;
    this.tokenRefreshMaxWaitMs = options.tokenRefreshMaxWaitMs === undefined ? 1000 : options.tokenRefreshMaxWaitMs;
    this.debug = options.debug || false;
    this.websocketURL = options.websocketURL;
    this.enableCache = options.enableCache === undefined ? true : options.enableCache;
    this.cacheDurationSeconds = options.cacheDurationSeconds === undefined ? 5 : options.cacheDurationSeconds;
    this.invalidateCacheOnMutation = options.invalidateCacheOnMutation === undefined ? true : options.invalidateCacheOnMutation;
    this._onUnauthorized = options.onUnauthorized;
    this._onMaintenance = options.onMaintenance;
    this._onTokensChanged = options.onTokensChanged;
    this._apiKey = options.apiKey || null;

    if (this.browserMode && !this._apiKey) {
      this._loadTokens();
    }

    // --- Create API namespaces ---
    this.auth = createAuthMethods(this);
    this.subscription = createSubscriptionMethods(this);
    this.user = createUserMethods(this);
    this.workspace = createWorkspaceMethods(this);
    this.project = createProjectMethods(this);
    this.asset = createAssetMethods(this);
    this.chat = createChatMethods(this);
    this.folder = createFolderMethods(this);
    this.invite = createInviteMethods(this);
    this.joinLink = createJoinLinkMethods(this);
    this.membership = createMembershipMethods(this);
    this.notification = createNotificationMethods(this);
    this.payment = createPaymentMethods(this);
    this.product = createProductMethods(this);
    this.socket = createSocketMethods(this);
    this.storage = createStorageMethods(this);
    this.task = createTaskMethods(this);
    this.version = createVersionMethods(this);
    this.config = createConfigMethods(this);
    this.tag = createTagMethods(this);
    this.userFeed = createUserFeedMethods(this);
    this.public = createPublicMethods(this);
    this.settings = createSettingsMethods(this);
    this.device = createDeviceMethods(this);
    this.shortlink = createShortLinkMethods(this);
    this.convo = createConvoMethods(this);
    this.board = createBoardMethods(this);
    this.taskRelation = createTaskRelationMethods(this);
    this.bot = createBotMethods(this);
    this.ai = createAiMethods(this);
    this.aiChat = createAiChatMethods(this);
    this.supportChat = createSupportChatMethods(this);
    this.blogPosts = createBlogPostsMethods(this);
    this.credits = createCreditsMethods(this);
    this.scratch = createScratchMethods(this);
    this.token = createTokenMethods(this);
    this.oauthGrant = createOAuthGrantMethods(this);
    this.webhook = createWebhookMethods(this);
    this.supportTicket = createSupportTicketMethods(this);
  }

  /**
   * Internal helper for conditional logging. Underscore-prefixed to flag
   * "internal contract" — accessible from sibling route modules but not
   * part of the documented public API.
   *
   * @param args - Arguments to pass to console.log.
   */
  public _log(...args: any[]): void {
    if (this.debug) {
      console.log(...args); // eslint-disable-line no-console
    }
  }

  /**
   * Checks if a POST endpoint is safe to cache (read-only query operations).
   * @param endpoint - The API endpoint to check.
   * @returns True if the POST endpoint is cacheable, false otherwise.
   * @private
   */
  private _isCacheablePostEndpoint(endpoint: string): boolean {
    // List of POST endpoints that are safe to cache (read-only query operations)
    const cacheablePostEndpoints = [
      '/v1/notifications/count',
      '/v1/notifications/count/bulk',
      '/v1/notifications',
      '/v1/notifications/new',
      '/v1/notifications/last-seen'
    ];
    
    return cacheablePostEndpoints.some(cacheableEndpoint => endpoint === cacheableEndpoint);
  }

  /**
   * Generates a cache key for a request.
   * @param options - Request configuration.
   * @returns A unique cache key string.
   * @private
   */
  private _generateCacheKey(options: InternalRequestOptions): string {
    const { endpoint, method = 'GET', params = {}, body = null } = options;
    const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as RequestParams);
    
    return JSON.stringify({
      endpoint,
      method,
      params: sortedParams,
      body
    });
  }

  /**
   * Checks if a cache entry is still valid.
   * @param entry - The cache entry to check.
   * @returns True if the entry is still valid, false otherwise.
   * @private
   */
  private _isCacheEntryValid(entry: CacheEntry): boolean {
    const now = Date.now();
    const maxAge = this.cacheDurationSeconds * 1000;
    return (now - entry.timestamp) < maxAge;
  }

  /**
   * Gets a cached response if available and valid.
   * @param cacheKey - The cache key to look up.
   * @returns The cached data or null if not found/expired.
   * @private
   */
  private _getCachedResponse<T>(cacheKey: string): T | null {
    const entry = this._cache.get(cacheKey);
    if (!entry) return null;
    
    if (this._isCacheEntryValid(entry)) {
      this._log('[DEBUG] Cache hit for key:', cacheKey);
      return entry.data as T;
    } else {
      // Remove expired entry
      this._cache.delete(cacheKey);
      this._log('[DEBUG] Cache entry expired and removed for key:', cacheKey);
      return null;
    }
  }

  /**
   * Stores a response in the cache.
   * @param cacheKey - The cache key.
   * @param data - The data to cache.
   * @private
   */
  private _setCachedResponse<T>(cacheKey: string, data: T): void {
    this._cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    this._log('[DEBUG] Cached response for key:', cacheKey);
  }

  /**
   * Gets or sets a pending promise for concurrent requests.
   * @param cacheKey - The cache key.
   * @param promise - The promise to store (optional).
   * @returns The existing or new promise.
   * @private
   */
  private _getPendingPromise<T>(cacheKey: string, promise?: Promise<T>): Promise<T> | null {
    const entry = this._cache.get(cacheKey);
    
    if (promise) {
      // Store the promise
      if (entry) {
        entry.promise = promise;
      } else {
        this._cache.set(cacheKey, {
          data: null,
          timestamp: Date.now(),
          promise
        });
      }
      return promise;
    }
    
    // Return existing promise if valid
    if (entry?.promise && this._isCacheEntryValid(entry)) {
      this._log('[DEBUG] Returning pending promise for concurrent request:', cacheKey);
      return entry.promise;
    }
    
    return null;
  }

  /**
   * Clears the pending promise from a cache entry.
   * @param cacheKey - The cache key.
   * @private
   */
  private _clearPendingPromise(cacheKey: string): void {
    const entry = this._cache.get(cacheKey);
    if (entry) {
      delete entry.promise;
    }
  }

  /**
   * True if a request is a write that should invalidate cached reads for its
   * resource. Cacheable "read" POSTs (query endpoints) are excluded.
   * @private
   */
  private _isMutation(method: string, endpoint: string): boolean {
    const m = (method || 'GET').toUpperCase();
    if (m === 'PUT' || m === 'PATCH' || m === 'DELETE') return true;
    if (m === 'POST') return !this._isCacheablePostEndpoint(endpoint);
    return false;
  }

  /**
   * True if a path segment looks like a resource id (UUID or numeric) rather
   * than a collection name.
   * @private
   */
  private _looksLikeSegmentId(segment: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
      || /^\d+$/.test(segment);
  }

  /**
   * The resource "collection" a mutation acts on — the deepest non-id,
   * non-version path segment (e.g. `/v1/workspaces/:id/projects` -> `projects`,
   * `DELETE /v1/projects/:id` -> `projects`).
   * @private
   */
  private _resourceToken(endpoint: string): string | null {
    const path = (endpoint || '').split('?')[0];
    const segments = path.split('/').filter(Boolean);
    for (let i = segments.length - 1; i >= 0; i -= 1) {
      const seg = segments[i];
      if (seg === 'v1' || this._looksLikeSegmentId(seg)) continue;
      return seg;
    }
    return null;
  }

  /**
   * Evict cached GET responses that belong to the same resource collection as a
   * just-completed write, so the next read is fresh. Matches the parent-nested
   * list form too — a `POST /v1/projects` also evicts a cached
   * `/v1/workspaces/:id/projects` because both paths contain the `projects`
   * segment. Cross-resource relationships that don't share a path segment
   * (e.g. a payment write vs the subscription read) are NOT covered here and
   * are handled at their call sites.
   * @private
   */
  private _invalidateForMutation(endpoint: string): void {
    // Bump first so any GET already in flight won't re-cache a pre-write body.
    this._cacheGeneration++;
    const token = this._resourceToken(endpoint);
    if (!token) {
      // Couldn't identify the resource — clear everything to stay correct.
      this._cache.clear();
      return;
    }
    for (const key of Array.from(this._cache.keys())) {
      let cachedEndpoint = '';
      try {
        cachedEndpoint = (JSON.parse(key) as { endpoint?: string }).endpoint || '';
      } catch {
        continue;
      }
      const segments = cachedEndpoint.split('?')[0].split('/').filter(Boolean);
      if (segments.includes(token)) {
        this._cache.delete(key);
      }
    }
    this._log('[DEBUG] Invalidated cached reads for resource:', token);
  }

  /**
   * Sets the access and refresh tokens with optional expiration timestamps.
   * @param accessToken - The JWT access token or null to clear.
   * @param refreshToken - The refresh token or null to clear.
   * @param accessTokenExpiry - ISO timestamp when access token expires (optional).
   * @param refreshTokenExpiry - ISO timestamp when refresh token expires (optional).
   * @private
   */
  private _setTokens(
    accessToken: string | null,
    refreshToken: string | null,
    accessTokenExpiry?: string | null,
    refreshTokenExpiry?: string | null
  ): void {
    this._log('[DEBUG] Setting tokens. Access:', accessToken ? 'Yes' : 'No', 'Refresh:', refreshToken ? 'Yes' : 'No');
    this._accessToken = accessToken;
    this._refreshTokenValue = refreshToken;
    this._accessTokenExpiry = accessTokenExpiry || null;
    this._refreshTokenExpiry = refreshTokenExpiry || null;

    // Clear verifyMfa token when setting regular tokens (or clearing all)
    if (!accessToken && !refreshToken) {
      this._verifyMfaToken = null;
    }

    if (this.browserMode) {
      try {
        if (accessToken) {
          localStorage.setItem(this.tokenStorageKey, accessToken);
        } else {
          localStorage.removeItem(this.tokenStorageKey);
        }
        if (refreshToken) {
          localStorage.setItem(this.refreshTokenStorageKey, refreshToken);
        } else {
          localStorage.removeItem(this.refreshTokenStorageKey);
        }

        // Store expiration timestamps
        if (accessTokenExpiry) {
          localStorage.setItem(`${this.tokenStorageKey}_expiry`, accessTokenExpiry);
        } else {
          localStorage.removeItem(`${this.tokenStorageKey}_expiry`);
        }
        if (refreshTokenExpiry) {
          localStorage.setItem(`${this.refreshTokenStorageKey}_expiry`, refreshTokenExpiry);
        } else {
          localStorage.removeItem(`${this.refreshTokenStorageKey}_expiry`);
        }
      } catch (e) {
        console.error('Failed to save tokens to localStorage:', e);
      }
    }

    if (this._onTokensChanged) {
      try {
        this._onTokensChanged(accessToken || refreshToken ? this.getSession() : null);
      } catch (e) {
        console.error('onTokensChanged handler threw:', e);
      }
    }
  }

  /**
   * Returns the current session (tokens and expiries), or null when signed out.
   * @public
   */
  public getSession(): NuramaSession | null {
    if (!this._accessToken && !this._refreshTokenValue) return null;
    return {
      accessToken: this._accessToken,
      refreshToken: this._refreshTokenValue,
      accessTokenExpiry: this._accessTokenExpiry,
      refreshTokenExpiry: this._refreshTokenExpiry,
    };
  }

  /**
   * Restores a session previously captured through `onTokensChanged` /
   * `getSession()` — for hosts that persist tokens outside localStorage.
   * Does not fire `onTokensChanged`. A missing or expired access token is
   * refreshed on the next authenticated request.
   * @public
   */
  public restoreSession(session: NuramaSession | null): void {
    this._accessToken = session?.accessToken ?? null;
    this._refreshTokenValue = session?.refreshToken ?? null;
    this._accessTokenExpiry = session?.accessTokenExpiry ?? null;
    this._refreshTokenExpiry = session?.refreshTokenExpiry ?? null;
  }

  /**
   * Retrieves the current access token.
   * @returns The access token or null.
   * @private
   */
  private _getAccessToken(): string | null {
    return this._accessToken;
  }

  /**
   * Retrieves the current refresh token.
   * @returns The refresh token or null.
   * @private
   */
  private _getRefreshToken(): string | null {
    return this._refreshTokenValue;
  }

  /**
   * Sets the MFA verification token.
   * @param verifyMfaToken - The verify MFA token or null to clear.
   * @internal
   */
  _setVerifyMfaToken(verifyMfaToken: string | null): void {
    this._log('[DEBUG] Setting verifyMfa token:', verifyMfaToken ? 'Yes' : 'No');
    this._verifyMfaToken = verifyMfaToken;
  }

  /**
   * Retrieves the current verify MFA token.
   * @returns The verify MFA token or null.
   * @internal
   */
  _getVerifyMfaToken(): string | null {
    return this._verifyMfaToken;
  }

  /**
   * Loads tokens and their expiration timestamps from storage (browser mode only).
   * @private
   */
  private _loadTokens(): void {
    if (!this.browserMode) return;
    try {
      this._accessToken = localStorage.getItem(this.tokenStorageKey);
      this._refreshTokenValue = localStorage.getItem(this.refreshTokenStorageKey);
      this._accessTokenExpiry = localStorage.getItem(`${this.tokenStorageKey}_expiry`);
      this._refreshTokenExpiry = localStorage.getItem(`${this.refreshTokenStorageKey}_expiry`);
      this._log('[DEBUG] Loaded tokens from localStorage. Access:', this._accessToken ? 'Yes' : 'No', 'Refresh:', this._refreshTokenValue ? 'Yes' : 'No');
      this._log('[DEBUG] Loaded token expiries. Access expiry:', this._accessTokenExpiry || 'None', 'Refresh expiry:', this._refreshTokenExpiry || 'None');
    } catch (e) {
      console.error('Failed to load tokens from localStorage:', e);
      this._accessToken = null;
      this._refreshTokenValue = null;
      this._accessTokenExpiry = null;
      this._refreshTokenExpiry = null;
    }
  }

  /**
   * Checks if the current access token is expired or close to expiring.
   * @returns True if the token is missing, expired, or needs refresh based on buffer.
   * @private
   */
  private _isTokenExpired(): boolean {
    // API keys never expire client-side; the server is the source of truth.
    if (this._apiKey) return false;
    const token = this._getAccessToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded || typeof decoded.exp !== 'number') {
        console.error('Invalid token or missing exp claim.');
        return true;
      }

      const expirationTimeMs = decoded.exp * 1000;
      const currentTimeMs = Date.now();
      const bufferMs = this.tokenExpiryBufferSeconds * 1000;

      const needsRefresh = currentTimeMs >= expirationTimeMs - bufferMs;
      if (needsRefresh && this.debug) {
        this._log(`[DEBUG] Token needs refresh. Current: ${new Date(currentTimeMs).toISOString()}, Expires: ${new Date(expirationTimeMs).toISOString()}, Buffer: ${this.tokenExpiryBufferSeconds}s`);
      }
      return needsRefresh;

    } catch (e) {
      console.error('Failed to decode or check token expiry:', e);
      return true;
    }
  }

  /**
   * Checks if the current JWT token exists and is valid.
   * @returns {boolean} True if the token exists and is valid, false otherwise.
   */
  public tokenValid(): boolean {
    return !this._isTokenExpired();
  }

  /**
   * Gets the token expiration timestamps.
   * @returns Object containing access and refresh token expiry ISO timestamps.
   * @public
   */
  public getTokenExpiry(): { access: string | null; refresh: string | null } {
    return {
      access: this._accessTokenExpiry,
      refresh: this._refreshTokenExpiry
    };
  }

  /**
   * Refreshes the access token using the stored refresh token.
   * Includes a time lock to prevent rapid concurrent refresh attempts.
   * @returns Promise resolving when refresh attempt is complete (or bypassed).
   * @private
   */
  private async _refreshToken(): Promise<void> {
    const now = Date.now();
    if (this._isRefreshing) {
      this._log('[DEBUG] Token refresh already in progress, waiting...');
      const waitStartTime = Date.now();
      while (this._isRefreshing) {
        if (Date.now() - waitStartTime > this.tokenRefreshMaxWaitMs) {
          console.error('Timed out waiting for token refresh to complete.');
          throw new Error('Timeout waiting for token refresh.');
        }
        await new Promise(resolve => setTimeout(resolve, this.tokenRefreshRetryDelayMs));
      }
      this._log('[DEBUG] Other refresh process finished.');
      if (!this._isTokenExpired()) {
        this._log('[DEBUG] Token is now valid after waiting.');
        return;
      }
      if (now - this._lastRefreshAttempt < this.refreshLockTimeoutMs) {
        this._log(`[DEBUG] Refresh attempt too soon after waiting (last attempt: ${new Date(this._lastRefreshAttempt).toISOString()}, now: ${new Date(now).toISOString()})`);
        throw new Error('Token still requires refresh after wait, but locked due to recent attempt.');
      }
    } else if (now - this._lastRefreshAttempt < this.refreshLockTimeoutMs) {
      this._log(`[DEBUG] Refresh attempt too soon (last attempt: ${new Date(this._lastRefreshAttempt).toISOString()}, now: ${new Date(now).toISOString()})`);
      if (this._isTokenExpired()) { 
        throw new Error('Token requires refresh, but locked due to recent attempt.');
      }
      return;
    }

    const refreshToken = this._getRefreshToken();
    if (!refreshToken) {
      this._log('[DEBUG] No refresh token available for _refreshToken.');
      this._setTokens(null, null);
      throw new Error('Refresh token not found.');
    }

    this._isRefreshing = true;
    this._lastRefreshAttempt = now;

    try {
      this._log('[DEBUG] Attempting token refresh...');
      // Make the actual request, skipping the standard refresh check
      // Define expected response type for refresh endpoint
      interface RefreshResponse {
          access: { token: string; expires: string };
          refresh: { token: string; expires: string };
      }
      const response = await this._request<RefreshResponse>({
        endpoint: '/v1/auth/refresh-tokens',
        method: 'POST',
        body: { refreshToken },
        sendJWT: false,
        _isInternalRefresh: true
      });

      if (response && response.access && response.access.token && response.refresh && response.refresh.token) {
        this._log('[DEBUG] Token refresh successful.');
        this._setTokens(
          response.access.token,
          response.refresh.token,
          response.access.expires,
          response.refresh.expires
        );
      } else {
        console.error('Invalid token refresh response:', response);
        // Clear both tokens since response structure is invalid
        this._setTokens(null, null);
        throw new Error('Invalid token refresh response structure.');
      }
    } catch (error: any) {
      console.error('Token refresh API call failed:', error);

      // Check if the error is due to invalid refresh token (401/403)
      // In these cases, the refresh token itself is invalid and should be cleared
      const isInvalidRefreshToken = error?.status === 401 || error?.status === 403;

      if (isInvalidRefreshToken) {
        this._log('[DEBUG] Refresh token is invalid (401/403), clearing all tokens');
        // Clear both access and refresh tokens
        this._setTokens(null, null);
      } else {
        this._log('[DEBUG] Refresh failed due to network/server error, keeping refresh token for retry');
        // For other errors (network issues, 500 errors, etc.), only clear access token
        // Keep refresh token so it can be retried later
        this._setTokens(null, refreshToken, null, this._refreshTokenExpiry);
      }

      // Preserve the backend error type (e.g. `emailVerificationRequired`)
      // so the request-level handler can pass it to onUnauthorized and the
      // app can prompt verification rather than a generic logout.
      const wrapped = new Error('Token refresh failed.') as any;
      wrapped.reasonType = error?.data?.type;
      throw wrapped;
    } finally {
      this._isRefreshing = false;
    }
  }

  /**
   * Makes an HTTP request to the API.
   * Handles token attachment and potential refresh.
   * @param options - Request configuration.
   * @returns The response data.
   * @private
   */
  public async _request<T = any>(options: InternalRequestOptions): Promise<T> {
    const { endpoint, method = 'GET', params = {}, body = null, sendJWT = true, customHeaders = {}, _isInternalRefresh = false, bypassCache = false } = options;
    
    // Generate cache key for this request
    const cacheKey = this._generateCacheKey(options);
    
    // Check if this is a cacheable POST request (read-only query operations)
    const isCacheablePost = method === 'POST' && this._isCacheablePostEndpoint(endpoint);
    const shouldUseCache = this.enableCache && !bypassCache && !_isInternalRefresh && 
      (method === 'GET' || method === 'HEAD' || isCacheablePost);
    
    if (isCacheablePost) {
      this._log('[DEBUG] POST request eligible for caching:', endpoint);
    }
    
    // Check cache first (for GET/HEAD requests and cacheable POST requests when cache is enabled)
    if (shouldUseCache) {
      // Check for cached response
      const cachedResponse = this._getCachedResponse<T>(cacheKey);
      if (cachedResponse !== null) {
        return cachedResponse;
      }
      
      // Check for pending promise (concurrent request handling)
      const pendingPromise = this._getPendingPromise<T>(cacheKey);
      if (pendingPromise) {
        return pendingPromise;
      }
    }

    let token: string | null = this._apiKey || this._getAccessToken();

    // Only check for token expiry and refresh if we need to send JWT (skip for API key auth)
    if (!_isInternalRefresh && sendJWT === true && !this._apiKey) {
      if (this._isTokenExpired()) {
        try {
          await this._refreshToken();
          token = this._getAccessToken();
        } catch (refreshError) {
          console.error('Token refresh failed during request:', refreshError);
          this._setTokens(null, null);
          if (this._onUnauthorized) {
            this._onUnauthorized({ type: (refreshError as { reasonType?: string })?.reasonType });
          }
          throw new Error('Authentication required due to refresh failure.');
        }
        // If token is still null after refresh attempt, something went wrong
        if (!token) {
          if (this._onUnauthorized) {
            this._onUnauthorized();
          }
          throw new Error('Authentication required, token unavailable after refresh attempt.');
        }
      }
    } else if (!_isInternalRefresh && sendJWT === 'optional' && !this._apiKey) {
      // Optional auth: send a valid token if we have one so the caller keeps
      // their identity, but proceed anonymously (no token) rather than throwing
      // when there's no session or a refresh fails. Used by public routes that
      // accept both authenticated and anonymous callers.
      if (token && this._isTokenExpired()) {
        try {
          await this._refreshToken();
          token = this._getAccessToken();
        } catch {
          token = null; // proceed without auth
        }
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (sendJWT && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
      if (headers['Content-Type'] === 'application/json') {
        config.body = JSON.stringify(body);
      } else {
        // For non-JSON, pass body directly (e.g., FormData)
        config.body = body as BodyInit; 
        // Let fetch handle Content-Type for FormData, etc.
        delete headers['Content-Type']; 
      }
    }

    // Ensure params is a proper object to prevent string iteration
    const safeParams = (params && typeof params === 'object' && !Array.isArray(params)) ? params : {};
    
    // Filter undefined/null params and convert to URL-safe format using enhanced parseUrlParams
    const filteredParams = Object.entries(safeParams)
      .filter(([, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);

    // Use enhanced parseUrlParams utility with 'repeat' format for arrays
    const searchParams = paramsToUrlSearchParams(filteredParams, { arrayFormat: 'repeat' });

    const url = `${this.baseURL}${endpoint}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    this._log(`[DEBUG] API Request: ${method} ${url}`, body ? { Body: body } : '');

    // Snapshot the cache generation so a clear/invalidation that lands while
    // this request is in flight prevents it from caching a now-stale body.
    const cacheGenerationAtStart = this._cacheGeneration;

    // Create the actual request promise
    const requestPromise = this._executeRequest<T>(url, config);

    // Store pending promise for concurrent request handling
    if (shouldUseCache) {
      this._getPendingPromise<T>(cacheKey, requestPromise);
    }

    try {
      const result = await requestPromise;

      // Cache the successful response (unless it was invalidated mid-flight).
      if (shouldUseCache && result !== null && this._cacheGeneration === cacheGenerationAtStart) {
        this._setCachedResponse<T>(cacheKey, result);
      }

      // A successful write evicts cached reads for the same resource so the
      // next GET returns fresh data (read-after-write consistency).
      if (this.enableCache && this.invalidateCacheOnMutation && !_isInternalRefresh && this._isMutation(method, endpoint)) {
        this._invalidateForMutation(endpoint);
      }

      return result;
    } finally {
      // Clear pending promise
      if (shouldUseCache) {
        this._clearPendingPromise(cacheKey);
      }
    }
  }

  /**
   * Executes the actual HTTP request.
   * @param url - The complete URL to request.
   * @param config - The fetch configuration.
   * @returns The response data.
   * @private
   */
  private async _executeRequest<T>(url: string, config: RequestInit): Promise<T> {
    try {
      const response: Response = await this.fetch(url, config);

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
          this._log('[DEBUG] API Error Response Body:', errorData);
        } catch (error) {
          errorData = { message: response.statusText };
          this._log(`[DEBUG] API Error Response Text: ${response.statusText}`);
        }
        // A `{ error: 'maintenance' }` body on a 418/503 → the site is in a
        // maintenance window (the edge rule returns exactly this to
        // non-allowlisted clients). Notify the host so an already-loaded /
        // cached SPA can show a maintenance message. Gating on the BODY — not
        // just the status — avoids mislabeling a transient/real outage (which
        // returns a different body) as planned maintenance.
        //
        // 418 and 503 are accepted: a Cloudflare WAF "Block" custom response can
        // only be a 4xx, and 418 ("I'm a teapot") is a guaranteed-unused
        // sentinel no real API path emits — so it can never collide. A Worker /
        // real origin can instead return the semantically-correct 503.
        if (
          (response.status === 418 || response.status === 503) &&
          errorData?.error === 'maintenance' &&
          this._onMaintenance
        ) {
          try { this._onMaintenance(); } catch { /* handler must never break the request path */ }
        }
        // Create a more informative error object
        const error = new Error(errorData.message || errorData.type || `HTTP error! status: ${response.status}`) as any;
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      if (response.status === 204) {
        this._log(`[DEBUG] API Response: ${response.status} No Content`);
        return null as T; // Return null for 204 No Content
      }

      try {
        const responseData = await response.json();
        this._log(`[DEBUG] API Response: ${response.status}`, responseData);
        return responseData as T;
      } catch (error) {
        this._log(`[DEBUG] API Response OK but failed to parse as JSON: ${response.status}`, response);
        return null as T;
      }

    } catch (error: any) {
      const apiError = error as ApiError; // Assert the error type
      if (!(error instanceof Error && apiError.status)) {
        // Only log generic network/fetch errors here
        // Specific API errors (response.ok === false) are logged above
        console.error(`[ERROR] API request failed: ${config.method} ${url}`, error);
      } else {
        this._log(`[DEBUG] API Error Caught: ${config.method} ${url}`, error);
      }
      throw error; // Re-throw the error for handling by the caller
    }
  }

  /**
   * Gets the current user's ID from the JWT token.
   * @returns {string | null} The user ID if available, null otherwise.
   */
  public getUserId(): string | null {
    const token = this._getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded?.sub || null;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  /**
   * Gets the SDK version information including build timestamp and hash.
   * Useful for debugging and verifying which SDK version is in use.
   * @returns {SDKVersionInfo} SDK version, build timestamp, build hash, and git commit
   */
  public getVersion(): SDKVersionInfo {
    return SDK_VERSION;
  }

  /**
   * Clears the response cache.
   * @public
   */
  public clearCache(): void {
    this._cache.clear();
    this._cacheGeneration++;
    this._log('[DEBUG] Cache cleared');
  }

  /**
   * Gets cache statistics for debugging.
   * @returns Object containing cache statistics.
   * @public
   */
  public getCacheStats(): { size: number; entries: Array<{ key: string; timestamp: number; hasData: boolean; hasPendingPromise: boolean }> } {
    const entries = Array.from(this._cache.entries()).map(([key, entry]) => ({
      key,
      timestamp: entry.timestamp,
      hasData: entry.data !== null && entry.data !== undefined,
      hasPendingPromise: !!entry.promise
    }));

    return {
      size: this._cache.size,
      entries
    };
  }
}

export default NuramaClient;
export type { SDKVersionInfo };
export type { HealthStatus } from './routes/version.js';
export type { UserTodo } from './routes/user.js';
export type {
  SupportTicketScope,
  SupportTicketStatus,
  CreateSupportTicketRequest,
  SupportTicket,
  SupportTicketListParams,
  SupportTicketListResponse,
  SupportTicketScopeOptions,
} from './routes/supportTicket.js';
export type {
  BotApiKeySummary,
  Bot,
  CreateBotData,
  CreateBotResponse,
  UpdateBotData,
  RotateBotKeyResponse,
  UpdateBotAvatarFileData,
  UpdateBotAvatarResponse,
  BotProjectRole,
  BotProjectMembership,
} from './routes/bot.js';
export type {
  WebhookEvent,
  WebhookSubscriptionStatus,
  WebhookSubscription,
  CreateWebhookData,
  UpdateWebhookData,
  CreateWebhookResponse,
  RotateWebhookSecretResponse,
  WebhookAttemptStatus,
  WebhookAttempt,
  ListDeliveriesParams,
  ListDeliveriesResponse,
  TestWebhookResponse,
} from './routes/webhook.js';
export type {
  TokenKind,
  TokenScope,
  TokenSummary,
  CreateTokenData,
  CreateTokenResponse,
} from './routes/token.js';

// Removed redundant export: export type { UserMethods, AssetMethods };
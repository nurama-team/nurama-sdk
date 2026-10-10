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
import { type SDKVersionInfo } from './version.js';
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
    onUnauthorized?: (reason?: {
        type?: string;
    }) => void;
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
    [key: string]: any;
}
interface RequestBody {
    [key: string]: any;
}
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
export declare const isApiError: (error: unknown) => error is ApiError;
export interface AuthMethods extends ReturnType<typeof createAuthMethods> {
}
export interface SubscriptionMethods extends ReturnType<typeof createSubscriptionMethods> {
}
export interface UserMethods extends ReturnType<typeof createUserMethods> {
}
export interface WorkspaceMethods extends ReturnType<typeof createWorkspaceMethods> {
}
export interface ProjectMethods extends ReturnType<typeof createProjectMethods> {
}
export interface AssetMethods extends ReturnType<typeof createAssetMethods> {
}
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
declare class NuramaClient {
    readonly baseURL: string;
    readonly fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    readonly tokenStorageKey: string;
    readonly refreshTokenStorageKey: string;
    readonly browserMode: boolean;
    readonly tokenExpiryBufferSeconds: number;
    readonly refreshLockTimeoutMs: number;
    readonly tokenRefreshRetryDelayMs: number;
    readonly tokenRefreshMaxWaitMs: number;
    readonly debug: boolean;
    readonly websocketURL?: string;
    readonly enableCache: boolean;
    readonly cacheDurationSeconds: number;
    readonly invalidateCacheOnMutation: boolean;
    private readonly _onUnauthorized?;
    private readonly _onMaintenance?;
    private readonly _onTokensChanged?;
    private _accessToken;
    private _refreshTokenValue;
    private _accessTokenExpiry;
    private _refreshTokenExpiry;
    private _verifyMfaToken;
    private _isRefreshing;
    private _lastRefreshAttempt;
    private _cache;
    private _cacheGeneration;
    private readonly _apiKey;
    readonly auth: AuthMethods;
    readonly subscription: SubscriptionMethods;
    readonly user: UserMethods;
    readonly workspace: WorkspaceMethods;
    readonly project: ProjectMethods;
    readonly asset: AssetMethods;
    chat: ChatMethods;
    folder: FolderMethods;
    invite: InviteMethods;
    joinLink: JoinLinkMethods;
    membership: MembershipMethods;
    notification: NotificationMethods;
    payment: PaymentMethods;
    product: ProductMethods;
    socket: SocketMethods;
    storage: StorageMethods;
    task: TaskMethods;
    version: VersionMethods;
    readonly config: ConfigMethods;
    tag: TagMethods;
    public: PublicMethods;
    settings: SettingsMethods;
    device: DeviceMethods;
    shortlink: ShortLinkMethods;
    convo: ConvoMethods;
    board: BoardMethods;
    taskRelation: TaskRelationMethods;
    bot: BotMethods;
    ai: AiMethods;
    aiChat: AiChatMethods;
    supportChat: SupportChatMethods;
    blogPosts: BlogPostsMethods;
    credits: CreditsMethods;
    scratch: ScratchMethods;
    token: TokenMethods;
    /** Connected applications: what the user has authorised over OAuth. */
    oauthGrant: OAuthGrantMethods;
    webhook: WebhookMethods;
    supportTicket: SupportTicketMethods;
    /**
     * Creates an instance of NuramaClient.
     * @param baseURL - The base URL for the Nurama API.
     * @param options - Configuration options.
     */
    constructor(baseURL: string, options?: NuramaClientOptions);
    /**
     * Internal helper for conditional logging. Underscore-prefixed to flag
     * "internal contract" — accessible from sibling route modules but not
     * part of the documented public API.
     *
     * @param args - Arguments to pass to console.log.
     */
    _log(...args: any[]): void;
    /**
     * Checks if a POST endpoint is safe to cache (read-only query operations).
     * @param endpoint - The API endpoint to check.
     * @returns True if the POST endpoint is cacheable, false otherwise.
     * @private
     */
    private _isCacheablePostEndpoint;
    /**
     * Generates a cache key for a request.
     * @param options - Request configuration.
     * @returns A unique cache key string.
     * @private
     */
    private _generateCacheKey;
    /**
     * Checks if a cache entry is still valid.
     * @param entry - The cache entry to check.
     * @returns True if the entry is still valid, false otherwise.
     * @private
     */
    private _isCacheEntryValid;
    /**
     * Gets a cached response if available and valid.
     * @param cacheKey - The cache key to look up.
     * @returns The cached data or null if not found/expired.
     * @private
     */
    private _getCachedResponse;
    /**
     * Stores a response in the cache.
     * @param cacheKey - The cache key.
     * @param data - The data to cache.
     * @private
     */
    private _setCachedResponse;
    /**
     * Gets or sets a pending promise for concurrent requests.
     * @param cacheKey - The cache key.
     * @param promise - The promise to store (optional).
     * @returns The existing or new promise.
     * @private
     */
    private _getPendingPromise;
    /**
     * Clears the pending promise from a cache entry.
     * @param cacheKey - The cache key.
     * @private
     */
    private _clearPendingPromise;
    /**
     * True if a request is a write that should invalidate cached reads for its
     * resource. Cacheable "read" POSTs (query endpoints) are excluded.
     * @private
     */
    private _isMutation;
    /**
     * True if a path segment looks like a resource id (UUID or numeric) rather
     * than a collection name.
     * @private
     */
    private _looksLikeSegmentId;
    /**
     * The resource "collection" a mutation acts on — the deepest non-id,
     * non-version path segment (e.g. `/v1/workspaces/:id/projects` -> `projects`,
     * `DELETE /v1/projects/:id` -> `projects`).
     * @private
     */
    private _resourceToken;
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
    private _invalidateForMutation;
    /**
     * Sets the access and refresh tokens with optional expiration timestamps.
     * @param accessToken - The JWT access token or null to clear.
     * @param refreshToken - The refresh token or null to clear.
     * @param accessTokenExpiry - ISO timestamp when access token expires (optional).
     * @param refreshTokenExpiry - ISO timestamp when refresh token expires (optional).
     * @private
     */
    private _setTokens;
    /**
     * Returns the current session (tokens and expiries), or null when signed out.
     * @public
     */
    getSession(): NuramaSession | null;
    /**
     * Restores a session previously captured through `onTokensChanged` /
     * `getSession()` — for hosts that persist tokens outside localStorage.
     * Does not fire `onTokensChanged`. A missing or expired access token is
     * refreshed on the next authenticated request.
     * @public
     */
    restoreSession(session: NuramaSession | null): void;
    /**
     * Retrieves the current access token.
     * @returns The access token or null.
     * @private
     */
    private _getAccessToken;
    /**
     * Retrieves the current refresh token.
     * @returns The refresh token or null.
     * @private
     */
    private _getRefreshToken;
    /**
     * Sets the MFA verification token.
     * @param verifyMfaToken - The verify MFA token or null to clear.
     * @internal
     */
    _setVerifyMfaToken(verifyMfaToken: string | null): void;
    /**
     * Retrieves the current verify MFA token.
     * @returns The verify MFA token or null.
     * @internal
     */
    _getVerifyMfaToken(): string | null;
    /**
     * Loads tokens and their expiration timestamps from storage (browser mode only).
     * @private
     */
    private _loadTokens;
    /**
     * Checks if the current access token is expired or close to expiring.
     * @returns True if the token is missing, expired, or needs refresh based on buffer.
     * @private
     */
    private _isTokenExpired;
    /**
     * Checks if the current JWT token exists and is valid.
     * @returns {boolean} True if the token exists and is valid, false otherwise.
     */
    tokenValid(): boolean;
    /**
     * Gets the token expiration timestamps.
     * @returns Object containing access and refresh token expiry ISO timestamps.
     * @public
     */
    getTokenExpiry(): {
        access: string | null;
        refresh: string | null;
    };
    /**
     * Refreshes the access token using the stored refresh token.
     * Includes a time lock to prevent rapid concurrent refresh attempts.
     * @returns Promise resolving when refresh attempt is complete (or bypassed).
     * @private
     */
    private _refreshToken;
    /**
     * Makes an HTTP request to the API.
     * Handles token attachment and potential refresh.
     * @param options - Request configuration.
     * @returns The response data.
     * @private
     */
    _request<T = any>(options: InternalRequestOptions): Promise<T>;
    /**
     * Executes the actual HTTP request.
     * @param url - The complete URL to request.
     * @param config - The fetch configuration.
     * @returns The response data.
     * @private
     */
    private _executeRequest;
    /**
     * Gets the current user's ID from the JWT token.
     * @returns {string | null} The user ID if available, null otherwise.
     */
    getUserId(): string | null;
    /**
     * Gets the SDK version information including build timestamp and hash.
     * Useful for debugging and verifying which SDK version is in use.
     * @returns {SDKVersionInfo} SDK version, build timestamp, build hash, and git commit
     */
    getVersion(): SDKVersionInfo;
    /**
     * Clears the response cache.
     * @public
     */
    clearCache(): void;
    /**
     * Gets cache statistics for debugging.
     * @returns Object containing cache statistics.
     * @public
     */
    getCacheStats(): {
        size: number;
        entries: Array<{
            key: string;
            timestamp: number;
            hasData: boolean;
            hasPendingPromise: boolean;
        }>;
    };
}
export default NuramaClient;
export type { SDKVersionInfo };
export type { HealthStatus } from './routes/version.js';
export type { UserTodo } from './routes/user.js';
export type { SupportTicketScope, SupportTicketStatus, CreateSupportTicketRequest, SupportTicket, SupportTicketListParams, SupportTicketListResponse, SupportTicketScopeOptions, } from './routes/supportTicket.js';
export type { BotApiKeySummary, Bot, CreateBotData, CreateBotResponse, UpdateBotData, RotateBotKeyResponse, UpdateBotAvatarFileData, UpdateBotAvatarResponse, BotProjectRole, BotProjectMembership, } from './routes/bot.js';
export type { WebhookEvent, WebhookSubscriptionStatus, WebhookSubscription, CreateWebhookData, UpdateWebhookData, CreateWebhookResponse, RotateWebhookSecretResponse, WebhookAttemptStatus, WebhookAttempt, ListDeliveriesParams, ListDeliveriesResponse, TestWebhookResponse, } from './routes/webhook.js';
export type { TokenKind, TokenScope, TokenSummary, CreateTokenData, CreateTokenResponse, } from './routes/token.js';
//# sourceMappingURL=NuramaClient.d.ts.map
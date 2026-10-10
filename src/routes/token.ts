import NuramaClient from '../NuramaClient.js';

/**
 * Personal Access Token kinds. v1 only mints `pat`; the rest are
 * reserved for the future OAuth grant flow and are listed here so
 * downstream code can switch on the kind without importing a server-
 * side enum.
 */
export type TokenKind = 'pat' | 'oauthAccess' | 'oauthRefresh' | 'botAccess';

/**
 * Granted action verbs on a token. Mirrors the backend's
 * `@config/tokenScopes` registry; adding a scope on the BE means
 * adding it here too (or callers fall back to `string` when they
 * accept arbitrary scopes from configuration).
 */
export type TokenScope =
  | 'chat:read'
  | 'chat:write'
  | 'tasks:read'
  | 'tasks:write'
  | 'assets:read'
  | 'assets:write'
  | 'projects:read'
  | 'projects:write'
  | 'workspaces:read'
  | 'workspaces:write'
  | 'convos:read'
  | 'convos:write'
  | 'notifications:read'
  | 'notifications:write'
  | 'ai:use';

/**
 * The shape returned by `listTokens` and (without the `token` field)
 * the metadata half of `createToken`. Never includes the raw secret —
 * that is shown exactly once at creation time and is the caller's
 * responsibility to capture.
 */
export interface TokenSummary {
  id: string;
  name: string;
  prefix: string;
  scopes: TokenScope[];
  kind: TokenKind;
  lastUsed?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface CreateTokenData {
  /** Customer-facing label. 1–80 characters. */
  name: string;
  /** At least one scope. Validated against the backend registry. */
  scopes: TokenScope[];
  /** Optional ISO date. Null / omitted = non-expiring. */
  expiresAt?: string | null;
}

export interface UpdateTokenScopesData {
  /**
   * The COMPLETE new scope set, not a delta — the same shape
   * `createToken` takes, so what a token may do is always stated in
   * full rather than accumulated through edits nobody can review.
   * At least one scope.
   */
  scopes: TokenScope[];
}

export interface CreateTokenResponse extends TokenSummary {
  /**
   * The raw secret. Returned ONLY in this response. The server keeps a
   * one-way hash and cannot recover this value — the customer must
   * capture it immediately (typical pattern: reveal-once modal with a
   * copy button).
   */
  token: string;
}

/**
 * Personal Access Token surface — auth-gated, owner-scoped. Any
 * logged-in user can mint, list, and revoke their own tokens; there
 * is no admin-on-behalf surface here (admins managing bot keys do
 * that via the `bot` methods).
 */
export default function createTokenMethods(client: NuramaClient) {
  return {
    /**
     * Mint a new Personal Access Token for the calling user.
     * The raw secret is in the response's `token` field — store it
     * immediately, it cannot be retrieved again.
     */
    async createToken(data: CreateTokenData): Promise<CreateTokenResponse> {
      return client._request<CreateTokenResponse>({
        method: 'POST',
        endpoint: '/v1/tokens',
        body: data,
        sendJWT: true,
      });
    },

    /**
     * List the caller's Personal Access Tokens. Bot-access keys held
     * by the same user (rare but possible — admin who's also a bot
     * owner) are filtered out server-side and surface via the bot
     * management screens instead.
     */
    async listTokens(): Promise<TokenSummary[]> {
      return client._request<TokenSummary[]>({
        method: 'GET',
        endpoint: '/v1/tokens',
        sendJWT: true,
        bypassCache: true,
      });
    },

    /**
     * Replace the scopes on one of the caller's Personal Access Tokens.
     *
     * `scopes` is the complete new set, not a delta. This exists because
     * the scope registry grows over time: a token minted before a scope
     * existed cannot hold it, and without this the only remedy is minting
     * a replacement and reconfiguring everywhere the old one is used.
     *
     * The change takes effect on the token's very next request. Scopes
     * remain a ceiling, never a floor — widening a token never lets it do
     * anything its owner cannot already do.
     */
    async updateTokenScopes(tokenId: string, data: UpdateTokenScopesData): Promise<TokenSummary> {
      if (!tokenId) throw new Error('tokenId is required.');
      return client._request<TokenSummary>({
        method: 'PATCH',
        endpoint: `/v1/tokens/${tokenId}`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Revoke one of the caller's Personal Access Tokens. The revocation
     * is immediate — the token will return 401 on the very next request.
     */
    async deleteToken(tokenId: string): Promise<void> {
      if (!tokenId) throw new Error('tokenId is required.');
      return client._request<void>({
        method: 'DELETE',
        endpoint: `/v1/tokens/${tokenId}`,
        sendJWT: true,
      });
    },
  };
}

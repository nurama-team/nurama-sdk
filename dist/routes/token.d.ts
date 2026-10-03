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
export type TokenScope = 'chat:read' | 'chat:write' | 'tasks:read' | 'tasks:write' | 'assets:read' | 'assets:write' | 'projects:read' | 'workspaces:read';
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
export default function createTokenMethods(client: NuramaClient): {
    /**
     * Mint a new Personal Access Token for the calling user.
     * The raw secret is in the response's `token` field — store it
     * immediately, it cannot be retrieved again.
     */
    createToken(data: CreateTokenData): Promise<CreateTokenResponse>;
    /**
     * List the caller's Personal Access Tokens. Bot-access keys held
     * by the same user (rare but possible — admin who's also a bot
     * owner) are filtered out server-side and surface via the bot
     * management screens instead.
     */
    listTokens(): Promise<TokenSummary[]>;
    /**
     * Revoke one of the caller's Personal Access Tokens. The revocation
     * is immediate — the token will return 401 on the very next request.
     */
    deleteToken(tokenId: string): Promise<void>;
};
//# sourceMappingURL=token.d.ts.map
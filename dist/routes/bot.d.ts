import NuramaClient from '../NuramaClient.js';
export interface BotApiKeySummary {
    id: string;
    keyPrefix: string;
    name: string;
    /** Discriminator. Bot keys mint as 'botAccess'. */
    kind?: 'botAccess' | 'pat' | 'oauthAccess' | 'oauthRefresh' | null;
    /** Granted scopes. A bot key is minted with the full registry when none are chosen. */
    scopes?: string[];
    lastUsed?: string | null;
    expiresAt?: string | null;
    status: 'active' | 'revoked';
    createdAt: string;
}
export interface Bot {
    id: string;
    displayName: string;
    color: string;
    accountType: 'bot';
    status: string;
    avatarId: string | null;
    /**
     * Populated avatar Asset (joined server-side from `avatarId`). The web client
     * resolves the image URL from this field via `getAvatarUrl()`.
     */
    avatar?: any | null;
    roles?: string[];
    membershipId?: string;
    apiKeys?: BotApiKeySummary[];
    apiKey?: BotApiKeySummary;
    /**
     * Project memberships within the workspace the bot belongs to. Populated by
     * `listBots` and `getBot`. Empty array if the bot has no project assignments.
     */
    projectMemberships?: BotProjectMembership[];
    createdAt: string;
    updatedAt: string;
}
export interface CreateBotData {
    /** Display name for the bot. 1–50 characters. */
    name: string;
    /** Optional hex color from the approved palette. Auto-assigned if omitted. */
    color?: string;
    /** Workspace roles to grant the bot. Must be one or more of:
     *  workspaceAdmin, workspaceMember, workspaceChatMember. */
    roles: Array<'workspaceAdmin' | 'workspaceMember' | 'workspaceChatMember'>;
    /**
     * Optional API-key scopes. Omit (or pass an empty array) to mint the key
     * with the full scope registry, which is what the bot's roles already allow
     * — every route declares a scope now, so a genuinely empty set would leave
     * the key unable to call anything. Pass a subset to narrow it.
     */
    scopes?: string[];
}
export interface CreateBotResponse {
    bot: Bot;
    /** Raw API key, returned ONCE at creation time. Store it immediately — it
     *  cannot be retrieved again. */
    rawKey: string;
}
export interface UpdateBotData {
    name?: string;
    color?: string;
}
export interface RotateBotKeyResponse {
    apiKey: BotApiKeySummary;
    /** New raw API key. Returned once. */
    rawKey: string;
}
export interface CreateBotKeyData {
    /** Label shown in the bot's key list. */
    name: string;
    /** Validated server-side against the token-scope registry. Omit for the full set. */
    scopes?: string[];
    /** Optional expiry, ISO 8601. Must be in the future. */
    expiresAt?: string;
}
export interface CreateBotKeyResponse {
    apiKey: BotApiKeySummary;
    /** Raw API key. Returned once and not recoverable afterwards. */
    rawKey: string;
}
export interface UpdateBotKeyScopesData {
    /**
     * The COMPLETE new scope set, not a delta — the same shape `createBotKey`
     * takes. At least one scope; a scopeless key authenticates and is then
     * refused by every gated route, so revoke it instead of emptying it.
     */
    scopes: string[];
}
export interface UpdateBotAvatarFileData {
    name: string;
    sizeInMB: number;
    checksum: string;
}
export interface UpdateBotAvatarResponse {
    user: {
        id: string;
        avatarId: string | null;
    };
    asset?: {
        id: string;
        [k: string]: unknown;
    };
    signedUrlData?: {
        key: string;
        uploadId: string;
        urls: string[];
    };
    [k: string]: unknown;
}
export type BotProjectRole = 'creator' | 'reviewer' | 'projectAdmin';
export interface BotProjectMembership {
    membershipId: string;
    projectId: string;
    projectName: string;
    roles: BotProjectRole[];
}
/**
 * Bot user administration methods. Used by workspace owners/admins (callers
 * holding a JWT) to manage bot users in a workspace. Bots themselves cannot
 * call these endpoints — bot administration is restricted server-side.
 */
export default function createBotMethods(client: NuramaClient): {
    /**
     * Create a bot user in a workspace.
     * Returns the new bot and the raw API key (shown only once).
     */
    createBot(workspaceId: string, data: CreateBotData): Promise<CreateBotResponse>;
    /** List bot users in a workspace. */
    listBots(workspaceId: string): Promise<Bot[]>;
    /** Get a single bot's details, including all of its API key metadata (no secrets). */
    getBot(workspaceId: string, botId: string): Promise<Bot>;
    /** Update a bot's display name and/or color. */
    updateBot(workspaceId: string, botId: string, data: UpdateBotData): Promise<Bot>;
    /**
     * Delete a bot user. Revokes all API keys, removes the workspace
     * membership, and marks the user inactive.
     */
    deleteBot(workspaceId: string, botId: string): Promise<void>;
    /**
     * Revoke the bot's current API key and issue a new one.
     * The new raw key is returned once.
     *
     * The replacement carries the old key's scopes verbatim, so this is not a
     * way to pick up scopes added to the registry since the key was minted —
     * `updateBotKeyScopes` is.
     */
    rotateBotKey(workspaceId: string, botId: string): Promise<RotateBotKeyResponse>;
    /**
     * Mint an ADDITIONAL API key for the bot, up to 5 live keys.
     *
     * Unlike `rotateBotKey`, the bot's existing keys keep working — which is
     * what makes a zero-downtime changeover possible: mint, move traffic over,
     * then revoke the old key. The raw key is returned once.
     */
    createBotKey(workspaceId: string, botId: string, keyData: CreateBotKeyData): Promise<CreateBotKeyResponse>;
    /**
     * Replace the scopes on one of the bot's API keys, in place.
     *
     * A key's scopes are a snapshot taken when it was minted, and the registry
     * grows — a key created before a scope existed cannot hold it. Rotation is
     * not a substitute: `rotateBotKey` copies the old scope set onto the
     * replacement, so a stale key stays stale through every rotation.
     *
     * This matters most for keys minted with `scopes` omitted, which means
     * "the full registry" as it stood that day, not "whatever the full registry
     * becomes".
     *
     * The secret is unchanged — every caller configured with this key keeps
     * working, which is the whole point. Requires `canManageBots`.
     */
    updateBotKeyScopes(workspaceId: string, botId: string, keyId: string, data: UpdateBotKeyScopesData): Promise<BotApiKeySummary>;
    /**
     * Revoke one of the bot's API keys, leaving its others working.
     * A revoked key stops authenticating immediately and frees a slot
     * against the 5-key cap.
     */
    revokeBotKey(workspaceId: string, botId: string, keyId: string): Promise<void>;
    /**
     * Request signed URL data to upload a new avatar for the bot.
     * Caller multipart-uploads the file to S3 using the returned `signedUrlData`,
     * then calls `client.asset.completeUpload(...)` to finalize.
     */
    updateBotAvatar(workspaceId: string, botId: string, fileData: UpdateBotAvatarFileData): Promise<UpdateBotAvatarResponse>;
    /**
     * List the bot's project memberships within the workspace.
     */
    listProjectMemberships(workspaceId: string, botId: string): Promise<BotProjectMembership[]>;
    /**
     * Upsert the bot's membership on a project. Replaces roles if a membership
     * already exists; creates one otherwise. Idempotent.
     */
    setProjectMembership(workspaceId: string, botId: string, projectId: string, data: {
        roles: BotProjectRole[];
    }): Promise<BotProjectMembership>;
    /**
     * Remove the bot's membership on a project. Idempotent.
     */
    removeProjectMembership(workspaceId: string, botId: string, projectId: string): Promise<void>;
};
//# sourceMappingURL=bot.d.ts.map
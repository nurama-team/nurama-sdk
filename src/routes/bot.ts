import NuramaClient from '../NuramaClient.js';

export interface BotApiKeySummary {
  id: string;
  keyPrefix: string;
  name: string;
  /** Discriminator. Bot keys mint as 'botAccess'. */
  kind?: 'botAccess' | 'pat' | 'oauthAccess' | 'oauthRefresh' | null;
  /** Granted action verbs. Empty array = unscoped (legacy). */
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
   * Optional API-key scopes. Defaults to [] (legacy — bot key can call
   * any route that isn't yet scope-gated). Once a route is gated by
   * `requireTokenScope` the bot needs the matching scope here for that
   * route to work.
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

export interface UpdateBotAvatarFileData {
  name: string;
  sizeInMB: number;
  checksum: string;
}

export interface UpdateBotAvatarResponse {
  user: { id: string; avatarId: string | null };
  asset?: { id: string; [k: string]: unknown };
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
export default function createBotMethods(client: NuramaClient) {
  return {
    /**
     * Create a bot user in a workspace.
     * Returns the new bot and the raw API key (shown only once).
     */
    async createBot(workspaceId: string, data: CreateBotData): Promise<CreateBotResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request<CreateBotResponse>({
        method: 'POST',
        endpoint: `/v1/workspaces/${workspaceId}/bots`,
        body: data,
        sendJWT: true,
      });
    },

    /** List bot users in a workspace. */
    async listBots(workspaceId: string): Promise<Bot[]> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      return client._request<Bot[]>({
        method: 'GET',
        endpoint: `/v1/workspaces/${workspaceId}/bots`,
        sendJWT: true,
        bypassCache: true,
      });
    },

    /** Get a single bot's details, including all of its API key metadata (no secrets). */
    async getBot(workspaceId: string, botId: string): Promise<Bot> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!botId) throw new Error('botId is required.');
      return client._request<Bot>({
        method: 'GET',
        endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}`,
        sendJWT: true,
        bypassCache: true,
      });
    },

    /** Update a bot's display name and/or color. */
    async updateBot(workspaceId: string, botId: string, data: UpdateBotData): Promise<Bot> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!botId) throw new Error('botId is required.');
      return client._request<Bot>({
        method: 'PUT',
        endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Delete a bot user. Revokes all API keys, removes the workspace
     * membership, and marks the user inactive.
     */
    async deleteBot(workspaceId: string, botId: string): Promise<void> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!botId) throw new Error('botId is required.');
      return client._request<void>({
        method: 'DELETE',
        endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}`,
        sendJWT: true,
      });
    },

    /**
     * Revoke the bot's current API key and issue a new one.
     * The new raw key is returned once.
     */
    async rotateBotKey(workspaceId: string, botId: string): Promise<RotateBotKeyResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!botId) throw new Error('botId is required.');
      return client._request<RotateBotKeyResponse>({
        method: 'POST',
        endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/rotate-key`,
        sendJWT: true,
      });
    },

    /**
     * Request signed URL data to upload a new avatar for the bot.
     * Caller multipart-uploads the file to S3 using the returned `signedUrlData`,
     * then calls `client.asset.completeUpload(...)` to finalize.
     */
    async updateBotAvatar(
      workspaceId: string,
      botId: string,
      fileData: UpdateBotAvatarFileData,
    ): Promise<UpdateBotAvatarResponse> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!botId) throw new Error('botId is required.');
      return client._request<UpdateBotAvatarResponse>({
        method: 'POST',
        endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/avatar`,
        body: fileData,
        sendJWT: true,
      });
    },

    /**
     * List the bot's project memberships within the workspace.
     */
    async listProjectMemberships(workspaceId: string, botId: string): Promise<BotProjectMembership[]> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!botId) throw new Error('botId is required.');
      return client._request<BotProjectMembership[]>({
        method: 'GET',
        endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/memberships`,
        sendJWT: true,
        bypassCache: true,
      });
    },

    /**
     * Upsert the bot's membership on a project. Replaces roles if a membership
     * already exists; creates one otherwise. Idempotent.
     */
    async setProjectMembership(
      workspaceId: string,
      botId: string,
      projectId: string,
      data: { roles: BotProjectRole[] },
    ): Promise<BotProjectMembership> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!botId) throw new Error('botId is required.');
      if (!projectId) throw new Error('projectId is required.');
      return client._request<BotProjectMembership>({
        method: 'PUT',
        endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/memberships/project/${projectId}`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Remove the bot's membership on a project. Idempotent.
     */
    async removeProjectMembership(workspaceId: string, botId: string, projectId: string): Promise<void> {
      if (!workspaceId) throw new Error('workspaceId is required.');
      if (!botId) throw new Error('botId is required.');
      if (!projectId) throw new Error('projectId is required.');
      return client._request<void>({
        method: 'DELETE',
        endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/memberships/project/${projectId}`,
        sendJWT: true,
      });
    },
  };
}

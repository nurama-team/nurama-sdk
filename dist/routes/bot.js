/**
 * Bot user administration methods. Used by workspace owners/admins (callers
 * holding a JWT) to manage bot users in a workspace. Bots themselves cannot
 * call these endpoints — bot administration is restricted server-side.
 */
export default function createBotMethods(client) {
    return {
        /**
         * Create a bot user in a workspace.
         * Returns the new bot and the raw API key (shown only once).
         */
        async createBot(workspaceId, data) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/workspaces/${workspaceId}/bots`,
                body: data,
                sendJWT: true,
            });
        },
        /** List bot users in a workspace. */
        async listBots(workspaceId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/workspaces/${workspaceId}/bots`,
                sendJWT: true,
                bypassCache: true,
            });
        },
        /** Get a single bot's details, including all of its API key metadata (no secrets). */
        async getBot(workspaceId, botId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}`,
                sendJWT: true,
                bypassCache: true,
            });
        },
        /** Update a bot's display name and/or color. */
        async updateBot(workspaceId, botId, data) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            return client._request({
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
        async deleteBot(workspaceId, botId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}`,
                sendJWT: true,
            });
        },
        /**
         * Revoke the bot's current API key and issue a new one.
         * The new raw key is returned once.
         *
         * The replacement carries the old key's scopes verbatim, so this is not a
         * way to pick up scopes added to the registry since the key was minted —
         * `updateBotKeyScopes` is.
         */
        async rotateBotKey(workspaceId, botId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/rotate-key`,
                sendJWT: true,
            });
        },
        /**
         * Mint an ADDITIONAL API key for the bot, up to 5 live keys.
         *
         * Unlike `rotateBotKey`, the bot's existing keys keep working — which is
         * what makes a zero-downtime changeover possible: mint, move traffic over,
         * then revoke the old key. The raw key is returned once.
         */
        async createBotKey(workspaceId, botId, keyData) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            if (!keyData?.name)
                throw new Error('name is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/keys`,
                body: keyData,
                sendJWT: true,
            });
        },
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
        async updateBotKeyScopes(workspaceId, botId, keyId, data) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            if (!keyId)
                throw new Error('keyId is required.');
            return client._request({
                method: 'PATCH',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/keys/${keyId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Revoke one of the bot's API keys, leaving its others working.
         * A revoked key stops authenticating immediately and frees a slot
         * against the 5-key cap.
         */
        async revokeBotKey(workspaceId, botId, keyId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            if (!keyId)
                throw new Error('keyId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/keys/${keyId}`,
                sendJWT: true,
            });
        },
        /**
         * Request signed URL data to upload a new avatar for the bot.
         * Caller multipart-uploads the file to S3 using the returned `signedUrlData`,
         * then calls `client.asset.completeUpload(...)` to finalize.
         */
        async updateBotAvatar(workspaceId, botId, fileData) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/avatar`,
                body: fileData,
                sendJWT: true,
            });
        },
        /**
         * List the bot's project memberships within the workspace.
         */
        async listProjectMemberships(workspaceId, botId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            return client._request({
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
        async setProjectMembership(workspaceId, botId, projectId, data) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/memberships/project/${projectId}`,
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Remove the bot's membership on a project. Idempotent.
         */
        async removeProjectMembership(workspaceId, botId, projectId) {
            if (!workspaceId)
                throw new Error('workspaceId is required.');
            if (!botId)
                throw new Error('botId is required.');
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/workspaces/${workspaceId}/bots/${botId}/memberships/project/${projectId}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=bot.js.map
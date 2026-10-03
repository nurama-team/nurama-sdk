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
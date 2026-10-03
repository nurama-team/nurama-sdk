/**
 * Defines settings-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the settings-related methods.
 */
export default function createSettingsMethods(client) {
    return {
        /**
         * Get effective (resolved) settings for a resource with full cascade.
         * Requires authentication.
         * @param {string} resourceType - The resource type (workspace or project).
         * @param {string} resourceId - The resource ID.
         * @param {string} [workspaceId] - The workspace ID (required for projects).
         * @returns {Promise<EffectiveSettings>} The effective settings object.
         */
        async getEffectiveSettings(resourceType, resourceId, workspaceId) {
            return client._request({
                method: 'GET',
                endpoint: `/v1/settings/${resourceType}/${resourceId}/effective`,
                params: workspaceId ? { workspaceId } : undefined,
                sendJWT: true,
            });
        },
        /**
         * Get raw resource settings (overrides only, not cascaded).
         * Requires authentication.
         * @param {string} resourceType - The resource type (workspace or project).
         * @param {string} resourceId - The resource ID.
         * @returns {Promise<ResourceSettings | { message: string }>} The resource settings object.
         */
        async getResourceSettings(resourceType, resourceId) {
            return client._request({
                method: 'GET',
                endpoint: `/v1/settings/${resourceType}/${resourceId}`,
                sendJWT: true,
            });
        },
        /**
         * Get all resource settings for current user.
         * Requires authentication.
         * @returns {Promise<{ resourceSettings: ResourceSettings[] }>} Object containing array of resource settings.
         */
        async getAllResourceSettings() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/settings',
                sendJWT: true,
            });
        },
        /**
         * Update resource-specific settings.
         * Requires authentication.
         * @param {string} resourceType - The resource type (workspace or project).
         * @param {string} resourceId - The resource ID.
         * @param {ResourceSettingsOverrides} settings - The settings to update.
         * @returns {Promise<{ message: string; settings: ResourceSettings }>} Success message and updated settings.
         */
        async updateResourceSettings(resourceType, resourceId, settings) {
            return client._request({
                method: 'PUT',
                endpoint: `/v1/settings/${resourceType}/${resourceId}`,
                body: settings,
                sendJWT: true,
            });
        },
        /**
         * Reset resource settings to inherit from parent/global.
         * Requires authentication.
         * @param {string} resourceType - The resource type (workspace or project).
         * @param {string} resourceId - The resource ID.
         * @returns {Promise<{ message: string }>} Success message.
         */
        async resetResourceSettings(resourceType, resourceId) {
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/settings/${resourceType}/${resourceId}`,
                sendJWT: true,
            });
        },
        /**
         * Cleanup orphaned settings (settings for resources user no longer has access to).
         * Requires authentication.
         * @returns {Promise<{ message: string; removedCount: number }>} Success message and count of removed settings.
         */
        async cleanupOrphanedSettings() {
            return client._request({
                method: 'POST',
                endpoint: '/v1/settings/cleanup',
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=settings.js.map
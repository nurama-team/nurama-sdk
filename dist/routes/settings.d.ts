import NuramaClient from '../NuramaClient.js';
export interface ResourceSettingsOverrides {
    emailNotifications?: {
        sendEmailNotifications?: boolean | null;
        newMention?: boolean | null;
        newFollowing?: boolean | null;
        dailySummary?: boolean | null;
        publishedAsset?: boolean | null;
        newMentionActiveInterval?: number | null;
        newFollowingActiveInterval?: number | null;
    };
    systemNotifications?: {
        showSystemNotifications?: boolean | null;
        mentions?: boolean | null;
        alerts?: boolean | null;
        privateMessages?: boolean | null;
    };
    sounds?: {
        playSounds?: boolean | null;
        mentions?: boolean | null;
        alerts?: boolean | null;
        privateMessages?: boolean | null;
    };
}
export interface ResourceSettings {
    resourceId: string;
    resourceType: 'workspace' | 'project';
    emailNotifications?: Record<string, any>;
    systemNotifications?: Record<string, any>;
    sounds?: Record<string, any>;
}
export interface EffectiveSettings {
    emailNotifications: Record<string, any>;
    systemNotifications: Record<string, any>;
    sounds: Record<string, any>;
}
/**
 * Defines settings-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the settings-related methods.
 */
export default function createSettingsMethods(client: NuramaClient): {
    /**
     * Get effective (resolved) settings for a resource with full cascade.
     * Requires authentication.
     * @param {string} resourceType - The resource type (workspace or project).
     * @param {string} resourceId - The resource ID.
     * @param {string} [workspaceId] - The workspace ID (required for projects).
     * @returns {Promise<EffectiveSettings>} The effective settings object.
     */
    getEffectiveSettings(resourceType: "workspace" | "project", resourceId: string, workspaceId?: string): Promise<EffectiveSettings>;
    /**
     * Get raw resource settings (overrides only, not cascaded).
     * Requires authentication.
     * @param {string} resourceType - The resource type (workspace or project).
     * @param {string} resourceId - The resource ID.
     * @returns {Promise<ResourceSettings | { message: string }>} The resource settings object.
     */
    getResourceSettings(resourceType: "workspace" | "project", resourceId: string): Promise<ResourceSettings | {
        message: string;
    }>;
    /**
     * Get all resource settings for current user.
     * Requires authentication.
     * @returns {Promise<{ resourceSettings: ResourceSettings[] }>} Object containing array of resource settings.
     */
    getAllResourceSettings(): Promise<{
        resourceSettings: ResourceSettings[];
    }>;
    /**
     * Update resource-specific settings.
     * Requires authentication.
     * @param {string} resourceType - The resource type (workspace or project).
     * @param {string} resourceId - The resource ID.
     * @param {ResourceSettingsOverrides} settings - The settings to update.
     * @returns {Promise<{ message: string; settings: ResourceSettings }>} Success message and updated settings.
     */
    updateResourceSettings(resourceType: "workspace" | "project", resourceId: string, settings: ResourceSettingsOverrides): Promise<{
        message: string;
        settings: ResourceSettings;
    }>;
    /**
     * Reset resource settings to inherit from parent/global.
     * Requires authentication.
     * @param {string} resourceType - The resource type (workspace or project).
     * @param {string} resourceId - The resource ID.
     * @returns {Promise<{ message: string }>} Success message.
     */
    resetResourceSettings(resourceType: "workspace" | "project", resourceId: string): Promise<{
        message: string;
    }>;
    /**
     * Cleanup orphaned settings (settings for resources user no longer has access to).
     * Requires authentication.
     * @returns {Promise<{ message: string; removedCount: number }>} Success message and count of removed settings.
     */
    cleanupOrphanedSettings(): Promise<{
        message: string;
        removedCount: number;
    }>;
};
//# sourceMappingURL=settings.d.ts.map
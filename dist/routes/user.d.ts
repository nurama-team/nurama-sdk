import NuramaClient from '../NuramaClient.js';
import { type User, type PublicUser } from '@nurama/types';
export interface FileData {
    name: string;
    checksum: string;
    sizeInMB: number;
}
export interface UpdateUserData {
    email?: string;
    userName?: string;
    password?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    company?: string;
    displayName?: string;
    color?: string;
    allowOauthAutolink?: boolean;
}
export interface PreferencesData {
    hide?: string[];
    dismissed?: {
        todos?: string[];
    };
    dailyTips?: {
        disabled?: boolean;
        lastShownDate?: string;
    };
    featureIntros?: Record<string, string[]>;
    dateFormat?: 'european' | 'american' | 'iso';
}
export interface UserTodo {
    id: string;
    dismissible: boolean;
}
/**
 * Defines user-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the user-related methods.
 */
export default function createUserMethods(client: NuramaClient): {
    /**
     * Retrieves the public profile of a specific user.
     * Requires authentication.
     * @param {string} userId - The ID of the user to retrieve.
     * @returns {Promise<object>} Public user object.
     */
    getUser(userId: string): Promise<PublicUser>;
    /**
     * Retrieves the current user's profile.
     * Requires authentication.
     * @returns {Promise<PublicUser>} The current user's profile.
     * @throws {Error} If no user ID is found in the token.
     */
    getSelf(): Promise<PublicUser>;
    /**
     * Deletes the current user.
     * Requires authentication.
     * @returns {Promise<void>}
     */
    deleteCurrentUser(): Promise<void>;
    /**
     * Updates the user's avatar.
     * @param {object} fileData - File metadata (e.g., { name, checksum, sizeInMB }).
     * @returns {Promise<object>} Object containing signed URL data and updated user info.
     */
    updateAvatar(fileData: FileData): Promise<any>;
    /**
     * Creates a new avatar for the user.
     * @param {object} fileData - File metadata (e.g., { name, checksum, sizeInMB }).
     * @returns {Promise<object>} Object containing signed URL data and updated user info.
     */
    createAvatar(fileData: FileData): Promise<any>;
    /**
     * Updates the user's preferences.
     * @param {object} preferenceData - Preference data to update (e.g., { hide: ['feedHint'] }).
     * @returns {Promise<object>} Updated user object.
     */
    updatePreferences(preferenceData: PreferencesData): Promise<User>;
    /**
     * Record that the current user has seen a one-time UI element (welcome
     * video, tutorial coachmark). Idempotent. Returns the updated user.
     * @param {string} element - one-time element key (see backend oneTimeElements).
     */
    markSeen(element: string): Promise<User>;
    /**
     * Remove one-time UI elements from the current user's `hasSeen` so they
     * display again. Pass specific element keys, or omit to clear ALL.
     * Returns the updated user.
     * @param {string[]} [elements] - elements to remove; omit to clear all.
     */
    unmarkSeen(elements?: string[]): Promise<User>;
    /**
     * Updates the logged-in user's profile.
     * Requires authentication.
     * At least one field must be provided.
     * @param {UpdateUserData} updateData - The user data fields to update.
     * @returns {Promise<User>} The updated user object.
     */
    updateSelf(updateData: UpdateUserData): Promise<User>;
    /**
     * Get the current user's active site-level Todos for the onboarding
     * drawer. Returns only todos whose completion condition isn't met and
     * (for dismissibles) that the user hasn't opted out of. Server
     * computes from live state — no caching on the server side, so a
     * fresh call always reflects ground truth.
     */
    getTodos(): Promise<{
        todos: UserTodo[];
    }>;
};
//# sourceMappingURL=user.d.ts.map
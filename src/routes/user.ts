import NuramaClient from '../NuramaClient.js';
import { type User, type PublicUser } from '@nurama/types';

export interface FileData { 
    name: string;
    checksum: string;
    sizeInMB: number;
}

// Define the type for the update data based on backend validation
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
    // Per-user UX dismissals — anything the user has explicitly opted
    // out of seeing again. The BE merges this object one level deep, so a
    // write to one `dismissed.*` key preserves its siblings. For each
    // inner array the server treats the value as the full list — callers
    // should merge the new id into the existing array before sending.
    dismissed?: {
      todos?: string[];
    };
    // Daily-tips carousel state. `disabled` opts out entirely; `lastShownDate`
    // (local `YYYY-MM-DD`) gates the once-per-day rule cumulatively across
    // workspaces and devices. Merged one level deep by the BE.
    dailyTips?: {
      disabled?: boolean;
      lastShownDate?: string;
    };
    // Per-project feature-intro tutorials the user has seen, keyed by project
    // id. Merged one level deep by the BE.
    featureIntros?: Record<string, string[]>;
    // Preferred date display format. Seeded at registration from the
    // registrant's country (European unless month-first, e.g. the US → american);
    // European is the fallback when unset. User-overridable, incl. ISO (YYYY-MM-DD).
    dateFormat?: 'european' | 'american' | 'iso';
    // Add other preferences
}

// Structural shape only — visible strings are looked up on the FE by
// `id` against the `auth.todos.<id>.{title,description,actionLabel}`
// i18n keys. Keeps the backend response language-agnostic.
export interface UserTodo {
  id: string;
  dismissible: boolean;
}

/**
 * Defines user-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the user-related methods.
 */
export default function createUserMethods(client: NuramaClient) {
  // Specify return type more accurately if possible, using UserMethods interface
  return {
    /**
     * Retrieves the public profile of a specific user.
     * Requires authentication.
     * @param {string} userId - The ID of the user to retrieve.
     * @returns {Promise<object>} Public user object.
     */
    async getUser(userId: string): Promise<PublicUser> {
      if (!userId) {
        throw new Error('userId is required.');
      }
      return client._request({
        method: 'GET',
        endpoint: `/v1/users/${userId}`,
        sendJWT: true,
      });
    },

    /**
     * Retrieves the current user's profile.
     * Requires authentication.
     * @returns {Promise<PublicUser>} The current user's profile.
     * @throws {Error} If no user ID is found in the token.
     */
    async getSelf(): Promise<PublicUser> {
      return client._request({
        method: 'GET',
        endpoint: '/v1/users',
        sendJWT: true,
      });
    },

    /**
     * Deletes the current user.
     * Requires authentication.
     * @returns {Promise<void>}
     */
    async deleteCurrentUser(): Promise<void> {
      return client._request({
        method: 'DELETE',
        endpoint: '/v1/users',
        sendJWT: true,
      });
    },
    /**
     * Updates the user's avatar.
     * @param {object} fileData - File metadata (e.g., { name, checksum, sizeInMB }).
     * @returns {Promise<object>} Object containing signed URL data and updated user info.
     */
    async updateAvatar(fileData: FileData): Promise<any> {
      return client._request({
        method: 'PUT',
        endpoint: '/v1/users/avatar',
        body: fileData,
        sendJWT: true,
      });
    },
    /**
     * Creates a new avatar for the user.
     * @param {object} fileData - File metadata (e.g., { name, checksum, sizeInMB }).
     * @returns {Promise<object>} Object containing signed URL data and updated user info.
     */
    async createAvatar(fileData: FileData): Promise<any> {
      return client._request({
        method: 'POST',
        endpoint: '/v1/users/avatar',
        body: fileData,
        sendJWT: true,
      });
    },
    /**
     * Updates the user's preferences.
     * @param {object} preferenceData - Preference data to update (e.g., { hide: ['feedHint'] }).
     * @returns {Promise<object>} Updated user object.
     */
    async updatePreferences(preferenceData: PreferencesData): Promise<User> {
      return client._request({
        method: 'PATCH',
        endpoint: '/v1/users/preferences',
        body: preferenceData,
        sendJWT: true,
      });
    },

    /**
     * Record that the current user has seen a one-time UI element (welcome
     * video, tutorial coachmark). Idempotent. Returns the updated user.
     * @param {string} element - one-time element key (see backend oneTimeElements).
     */
    async markSeen(element: string): Promise<User> {
      return client._request({
        method: 'POST',
        endpoint: '/v1/users/has-seen',
        body: { element },
        sendJWT: true,
      });
    },

    /**
     * Remove one-time UI elements from the current user's `hasSeen` so they
     * display again. Pass specific element keys, or omit to clear ALL.
     * Returns the updated user.
     * @param {string[]} [elements] - elements to remove; omit to clear all.
     */
    async unmarkSeen(elements?: string[]): Promise<User> {
      return client._request({
        method: 'DELETE',
        endpoint: '/v1/users/has-seen',
        body: elements ? { elements } : {},
        sendJWT: true,
      });
    },

    /**
     * Updates the logged-in user's profile.
     * Requires authentication.
     * At least one field must be provided.
     * @param {UpdateUserData} updateData - The user data fields to update.
     * @returns {Promise<User>} The updated user object.
     */
    async updateSelf(updateData: UpdateUserData): Promise<User> {
      // Ensure at least one key is present, matching backend validation .min(1)
      if (Object.keys(updateData).length === 0) {
        throw new Error('At least one field must be provided to update the user.');
      }
      return client._request<User>({
        method: 'PATCH',
        endpoint: '/v1/users', // Endpoint for updating the logged-in user
        body: updateData,
        sendJWT: true,
      });
    },

    /**
     * Get the current user's active site-level Todos for the onboarding
     * drawer. Returns only todos whose completion condition isn't met and
     * (for dismissibles) that the user hasn't opted out of. Server
     * computes from live state — no caching on the server side, so a
     * fresh call always reflects ground truth.
     */
    async getTodos(): Promise<{ todos: UserTodo[] }> {
      return client._request<{ todos: UserTodo[] }>({
        method: 'GET',
        endpoint: '/v1/users/todos',
        sendJWT: true,
      });
    },
  };
} 
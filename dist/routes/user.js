/**
 * Defines user-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the user-related methods.
 */
export default function createUserMethods(client) {
    // Specify return type more accurately if possible, using UserMethods interface
    return {
        /**
         * Retrieves the public profile of a specific user.
         * Requires authentication.
         * @param {string} userId - The ID of the user to retrieve.
         * @returns {Promise<object>} Public user object.
         */
        async getUser(userId) {
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
        async getSelf() {
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
        async deleteCurrentUser() {
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
        async updateAvatar(fileData) {
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
        async createAvatar(fileData) {
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
        async updatePreferences(preferenceData) {
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
        async markSeen(element) {
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
        async unmarkSeen(elements) {
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
        async updateSelf(updateData) {
            // Ensure at least one key is present, matching backend validation .min(1)
            if (Object.keys(updateData).length === 0) {
                throw new Error('At least one field must be provided to update the user.');
            }
            return client._request({
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
        async getTodos() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/users/todos',
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=user.js.map
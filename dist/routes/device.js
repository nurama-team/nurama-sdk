/**
 * Defines device-related methods for the NuramaClient.
 * Handles device registration and management for push notifications.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the device-related methods.
 */
export default function createDeviceMethods(client) {
    return {
        /**
         * Register a new device for push notifications.
         * If the same push token is registered again, the existing device will be updated.
         * Requires authentication.
         * @param {RegisterDeviceBody} deviceData - Device registration data.
         * @returns {Promise<Device>} The registered device object.
         * @example
         * const device = await client.device.registerDevice({
         *   deviceType: 'ios',
         *   pushToken: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
         *   bundleId: 'com.nurama.mobile',
         *   deviceInfo: {
         *     appVersion: '1.0.0',
         *     osVersion: '17.0',
         *     deviceModel: 'iPhone 15',
         *     deviceName: "John's iPhone"
         *   }
         * });
         */
        async registerDevice(deviceData) {
            if (!deviceData.deviceType || !deviceData.pushToken) {
                throw new Error('deviceType and pushToken are required.');
            }
            return client._request({
                method: 'POST',
                endpoint: '/v1/devices',
                body: deviceData,
                sendJWT: true,
            });
        },
        /**
         * Get all devices for the authenticated user.
         * Requires authentication.
         * @param {GetUserDevicesQuery} [filters] - Optional filters (status, deviceType).
         * @returns {Promise<Device[]>} Array of device objects.
         * @example
         * const devices = await client.device.getUserDevices({ status: 'active' });
         */
        async getUserDevices(filters) {
            return client._request({
                method: 'GET',
                endpoint: '/v1/devices',
                params: filters,
                sendJWT: true,
            });
        },
        /**
         * Get a specific device by ID.
         * Users can only access their own devices.
         * Requires authentication.
         * @param {string} deviceId - The device ID.
         * @returns {Promise<Device>} The device object.
         * @example
         * const device = await client.device.getDevice('507f1f77bcf86cd799439011');
         */
        async getDevice(deviceId) {
            if (!deviceId) {
                throw new Error('deviceId is required.');
            }
            return client._request({
                method: 'GET',
                endpoint: `/v1/devices/${deviceId}`,
                sendJWT: true,
            });
        },
        /**
         * Update device information.
         * Users can only update their own devices.
         * Requires authentication.
         * @param {string} deviceId - The device ID.
         * @param {UpdateDeviceBody} updateData - Data to update (pushToken, deviceInfo, status, subscribedChannels).
         * @returns {Promise<Device>} The updated device object.
         * @example
         * const device = await client.device.updateDevice('507f1f77bcf86cd799439011', {
         *   deviceInfo: { appVersion: '1.1.0' },
         *   status: 'active'
         * });
         */
        async updateDevice(deviceId, updateData) {
            if (!deviceId) {
                throw new Error('deviceId is required.');
            }
            if (Object.keys(updateData).length === 0) {
                throw new Error('At least one field must be provided to update the device.');
            }
            return client._request({
                method: 'PUT',
                endpoint: `/v1/devices/${deviceId}`,
                body: updateData,
                sendJWT: true,
            });
        },
        /**
         * Delete a device.
         * Users can only delete their own devices.
         * Requires authentication.
         * @param {string} deviceId - The device ID.
         * @returns {Promise<void>}
         * @example
         * await client.device.deleteDevice('507f1f77bcf86cd799439011');
         */
        async deleteDevice(deviceId) {
            if (!deviceId) {
                throw new Error('deviceId is required.');
            }
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/devices/${deviceId}`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=device.js.map
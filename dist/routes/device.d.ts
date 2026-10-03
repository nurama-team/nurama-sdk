import NuramaClient from '../NuramaClient.js';
import { type Device, type RegisterDeviceBody, type UpdateDeviceBody, type GetUserDevicesQuery } from '@nurama/types';
/**
 * Defines device-related methods for the NuramaClient.
 * Handles device registration and management for push notifications.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the device-related methods.
 */
export default function createDeviceMethods(client: NuramaClient): {
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
    registerDevice(deviceData: RegisterDeviceBody): Promise<Device>;
    /**
     * Get all devices for the authenticated user.
     * Requires authentication.
     * @param {GetUserDevicesQuery} [filters] - Optional filters (status, deviceType).
     * @returns {Promise<Device[]>} Array of device objects.
     * @example
     * const devices = await client.device.getUserDevices({ status: 'active' });
     */
    getUserDevices(filters?: GetUserDevicesQuery): Promise<Device[]>;
    /**
     * Get a specific device by ID.
     * Users can only access their own devices.
     * Requires authentication.
     * @param {string} deviceId - The device ID.
     * @returns {Promise<Device>} The device object.
     * @example
     * const device = await client.device.getDevice('507f1f77bcf86cd799439011');
     */
    getDevice(deviceId: string): Promise<Device>;
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
    updateDevice(deviceId: string, updateData: UpdateDeviceBody): Promise<Device>;
    /**
     * Delete a device.
     * Users can only delete their own devices.
     * Requires authentication.
     * @param {string} deviceId - The device ID.
     * @returns {Promise<void>}
     * @example
     * await client.device.deleteDevice('507f1f77bcf86cd799439011');
     */
    deleteDevice(deviceId: string): Promise<void>;
};
//# sourceMappingURL=device.d.ts.map
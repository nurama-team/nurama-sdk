/**
 * Device and Push Notification Type Definitions
 */

/**
 * Device types supported by the platform
 */
export type DeviceType = 'ios' | 'android' | 'web' | 'desktop-macos' | 'desktop-windows' | 'desktop-linux';

/**
 * Push notification services
 */
export type PushService = 'apns' | 'fcm' | 'expo' | 'webpush';

/**
 * Device status
 */
export type DeviceStatus = 'active' | 'inactive' | 'revoked';

/**
 * Optional device metadata
 */
export interface DeviceInfo {
  /** Application version */
  appVersion?: string;
  /** Operating system version */
  osVersion?: string;
  /** Device model (e.g., "iPhone 15", "Pixel 8") */
  deviceModel?: string;
  /** User-assigned device name */
  deviceName?: string;
}

/**
 * Device model representing a registered device for push notifications
 */
export interface Device {
  /** Device ID */
  id: string;
  /** User ID who owns the device */
  userId: string;
  /** Type of device */
  deviceType: DeviceType;
  /** Push notification token (Expo push token or native FCM/APNs token) */
  pushToken: string;
  /** Push notification service being used */
  pushService: PushService;
  /** PushKit VoIP token for iOS CallKit */
  voipPushToken?: string | null;
  /** App bundle identifier (e.g., com.nurama.mobile.beta) */
  bundleId?: string | null;
  /** Optional device metadata */
  deviceInfo?: DeviceInfo;
  /** Device status */
  status: DeviceStatus;
  /** Last time the device was active */
  lastActive: string;
  /** Channels the device is subscribed to */
  subscribedChannels?: string[];
  /** When the device was first registered */
  createdAt: string;
  /** When the device was last updated */
  updatedAt: string;
}

/**
 * Request body for registering a new device
 */
export interface RegisterDeviceBody {
  /** Type of device being registered */
  deviceType: DeviceType;
  /** Push notification token */
  pushToken: string;
  /** PushKit VoIP token for iOS CallKit */
  voipPushToken?: string;
  /** App bundle identifier (e.g., com.nurama.mobile.beta) */
  bundleId?: string;
  /** Optional device metadata */
  deviceInfo?: DeviceInfo;
}

/**
 * Request body for updating a device
 */
export interface UpdateDeviceBody {
  /** Updated push notification token */
  pushToken?: string;
  /** PushKit VoIP token for iOS CallKit (set to null to clear) */
  voipPushToken?: string | null;
  /** App bundle identifier (e.g., com.nurama.mobile.beta) */
  bundleId?: string;
  /** Updated device metadata */
  deviceInfo?: DeviceInfo;
  /** Updated device status */
  status?: DeviceStatus;
  /** Updated subscribed channels */
  subscribedChannels?: string[];
}

/**
 * Query parameters for getting user devices
 */
export interface GetUserDevicesQuery {
  /** Filter by device status */
  status?: DeviceStatus;
  /** Filter by device type */
  deviceType?: DeviceType;
}

/** A file in an upload Live Activity's batch, as the app sees it (the API carries it on through processing). */
export interface LiveActivityFile {
  /** The app's id for the file in its upload queue. */
  key: string;
  /** The asset, once the API has created it. */
  assetId?: string | null;
  kind: 'image' | 'video' | 'file';
  size: number;
  state: 'uploading' | 'processing' | 'ready' | 'failed';
  /** 0–1 through the current state: bytes sent, or the processing percent. */
  progress: number;
}

/**
 * Register or refresh an upload Live Activity
 */
export interface RegisterLiveActivityBody {
  /** The caller's registered iOS device the activity runs on (from `registerDevice`). */
  deviceId: string;
  /** The activity's own APNs push token (hex). */
  pushToken: string;
  /** App bundle id; the push topic is `<bundleId>.push-type.liveactivity`. */
  bundleId: string;
  /** The APNs environment the app's build receives pushes from. */
  apnsEnvironment: 'production' | 'development';
  /** Where the batch is going, as the activity shows it. */
  destination?: string;
  files: LiveActivityFile[];
}

export interface LiveActivityRegistration {
  id: string;
  stage: 'uploading' | 'processing' | 'done';
}

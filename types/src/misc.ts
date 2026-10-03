import type { ObjectId } from './common';

/**
 * Represents an authentication token with an expiration time.
 * @example { token: "eyJ...", expires: "2020-05-12T16:18:04.793Z" }
 */
export interface Token {
  token: string;
  /** @format date-time */
  expires: string;
}

/**
 * Represents a set of authentication tokens (access, refresh, and optional MFA verification).
 */
export interface AuthTokens {
  access: Token;
  refresh: Token;
  verifyMfa?: Token;
}

/**
 * Represents the response when enabling MFA.
 */
export interface MFAEnableResponse {
  /** The MFA secret (plain text, only shown once) */
  mfaSecret: string;
  /** The OTP Auth URL for QR code generation */
  otpauth: string;
  /** Array of backup codes (plain text, only shown once) */
  backupCodes: string[];
}

/**
 * Represents the response when verifying MFA (login challenge or setup).
 */
export interface MFAVerifyResponse {
  user: import('./user').User;
  tokens?: AuthTokens;
}

/**
 * Represents a generated summary.
 */
export interface Summary {
  /** @format objectId */
  id: ObjectId;
  /** @format objectId */
  chatId: ObjectId;
  /** @format objectId */
  creatorId: ObjectId;
  /** @default pending */
  status: 'pending' | 'processing' | 'complete' | 'failed';
  /**
   * The generated summary text.
   */
  summary?: string | null;
  /**
   * Error message if status is failed.
   */
  error?: string | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

/**
 * Represents the request body for updating user details.
 * Note: Based on schema, all fields are optional for update.
 */
export interface UpdateUserRequest {
  /** @format email */
  email?: string;
  /**
   * @pattern ^[a-zA-Z0-9_.-]+$
   * @maxLength 35
   */
  userName?: string;
  /**
   * @format password
   * @minLength 8
   */
  password?: string;
  /**
   * @minLength 1
   * @maxLength 35
   */
  firstName?: string;
  /** @maxLength 35 */
  middleName?: string;
  /**
   * @minLength 1
   * @maxLength 35
   */
  lastName?: string;
  /** @maxLength 100 */
  company?: string;
  /**
   * @minLength 1
   * @maxLength 50
   */
  displayName?: string;
  avatar?: string;
  /**
   * Key value pairs of users preferences.
   */
  preferences?: string;
}

/**
 * Represents the request body for changing password.
 */
export interface ChangePasswordRequest {
  /** Current password for verification */
  currentPassword: string;
  /** New password */
  newPassword: string;
  /** MFA token (required if MFA enabled) */
  mfaToken?: string;
}

/**
 * Represents the request body for locking an account.
 * The token can be provided in either the query string or request body.
 */
export interface LockAccountRequest {
  /** Lock account token from password changed email */
  token: string;
}

/**
 * Represents a notification channel string.
 * Channel must be in the format /[resourceType]/[resourceId]/[visibility(OPTIONAL)]
 * @example /workspace/[workspaceId]
 */
export type Channel = string;

/**
 * Represents an array of notification channels.
 * @example ["/workspace/[workspaceId]", "/project/[projectId]/creator"]
 */
export type Channels = Channel[];


/**
 * Represents the request body for removing assets (e.g., from a folder).
 */
export interface RemoveAssets {
  /**
   * An array of asset IDs to remove.
   * @format objectId
   */
  assetIds: ObjectId[];
} 
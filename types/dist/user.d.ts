import type { ObjectId } from './common';
import type { Asset } from './asset';
/**
 * Available badge/award types for users
 */
export type UserBadge = 'staff' | 'earlyAdopter';
/**
 * Supported OAuth providers
 */
export type OAuthProvider = 'google' | 'apple' | 'microsoft' | 'adobe';
/**
 * OAuth provider link information
 */
export interface LinkedAuthProvider {
    /**
     * OAuth provider name
     */
    provider: OAuthProvider;
    /**
     * Provider-specific user ID
     */
    providerId: string;
    /**
     * Additional provider-specific data
     */
    providerData?: Record<string, any>;
    /**
     * Timestamp when provider was linked
     * @format int64
     */
    linkedAt: number;
}
/**
 * Represents the full details of a user account.
 */
export interface User {
    /**
     * User's Id
     * @format objectId
     */
    id: ObjectId;
    /**
     * The first name of the user.
     * @minLength 3
     * @maxLength 35
     */
    firstName: string;
    /**
     * The middle name of the user.
     * @maxLength 35
     */
    middleName?: string;
    /**
     * The last name of the user.
     * @maxLength 35
     */
    lastName: string;
    /**
     * The company of the user.
     * @maxLength 100
     */
    company?: string;
    /**
     * The username of the user.
     * @pattern ^[a-zA-Z0-9_.-]+$
     * @maxLength 35
     */
    userName: string;
    /**
     * The display name of the user.
     * @maxLength 50
     */
    displayName: string;
    /**
     * The color of users border and fallback icon.
     * @format color
     */
    color?: string;
    /**
     * The avatar asset of the user.
     */
    avatar?: Asset;
    /**
     * The email address of the user.
     * @format email
     */
    email: string;
    /**
     * An array of membership IDs associated with the user.
     * @format objectId
     */
    memberships?: ObjectId[];
    /**
     * Indicates whether the user's email is verified.
     * @default false
     */
    isEmailVerified?: boolean;
    /**
     * Indicates whether multi-factor authentication (MFA) is enabled for the user.
     * @default false
     */
    mfaEnabled?: boolean;
    /**
     * The type of multi-factor authentication (MFA) used by the user.
     * @default 'totp'
     */
    mfaType?: 'totp';
    /**
     * The status of the user. Defined in @config/status.user
     * @default 'active'
     */
    status?: 'active' | 'inactive' | 'locked' | 'pendingDelete';
    /**
     * The account type of the user.
     * @default 'standard'
     */
    accountType?: 'standard' | 'guest';
    /**
     * Key value pairs of users preferences.
     */
    preferences?: string;
    /**
     * Array of badges/awards earned by the user.
     * @default ['earlyAdopter']
     */
    awards?: UserBadge[];
    /**
     * Array of linked OAuth providers for this user account.
     * Users can link multiple OAuth providers (Google, Apple, Microsoft, Adobe)
     * to enable sign-in through multiple methods.
     */
    linkedAuthProviders?: LinkedAuthProvider[];
    /**
     * The timestamp when the user was created.
     * @format int64
     */
    createdAt?: number;
    /**
     * The timestamp when the user was last updated.
     * @format int64
     */
    updatedAt?: number;
}
/**
 * OAuth platform types
 */
export type OAuthPlatform = 'web' | 'mobile' | 'desktop';
/**
 * OAuth exchange request payload
 */
export interface OAuthExchangeRequest {
    /**
     * Exchange code received from OAuth callback
     */
    code: string;
}
/**
 * OAuth exchange response with user and tokens
 */
export interface OAuthExchangeResponse {
    /**
     * User object
     */
    user: User;
    /**
     * Authentication tokens
     */
    tokens: {
        access: {
            token: string;
            expires?: string;
        };
        refresh: {
            token: string;
            expires?: string;
        };
    };
    /**
     * Optional return URL to redirect user after authentication
     */
    returnUrl?: string;
}
/**
 * Represents publicly viewable information about a user.
 */
export interface PublicUser {
    /**
     * User's Id
     * @format objectId
     */
    id: ObjectId;
    /**
     * The first name of the user.
     * @minLength 3
     * @maxLength 35
     */
    firstName: string;
    /**
     * The last name of the user.
     * @maxLength 35
     */
    lastName: string;
    /**
     * The company of the user.
     * @maxLength 100
     */
    company?: string;
    /**
     * The display name of the user.
     * @maxLength 50
     */
    displayName: string;
    /**
     * The color of users border and fallback icon.
     * @format color
     */
    color?: string;
    /**
     * The avatar asset of the user.
     */
    avatar?: Asset;
    /**
     * Array of badges/awards earned by the user.
     */
    awards?: UserBadge[];
    /**
     * True when this "author" is a synthesized anonymous guest commenter (no real
     * user account) rather than a persisted user. Set on public chat message
     * authors posted anonymously; drives the guest badge in the UI. When true,
     * firstName/lastName are absent and identity is carried by displayName + color.
     */
    isGuest?: boolean;
}
/**
 * Guest registration request payload
 */
export interface GuestRegisterRequest {
    email: string;
    displayName: string;
    /**
     * Optional avatar color the guest selected — must be one of the platform's
     * approved colors. A random approved color is assigned when omitted.
     */
    color?: string;
    publicToken: string;
}
/**
 * Guest upgrade request payload
 */
export interface GuestUpgradeRequest {
    password: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    userName?: string;
}

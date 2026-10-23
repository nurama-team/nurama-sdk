import NuramaClient from "../NuramaClient.js";
import { type User, type AuthTokens, type MFAEnableResponse, type MFAVerifyResponse, type OAuthProvider, type LinkedAuthProvider, type OAuthExchangeResponse, type Passkey, type PasskeyRegistrationProof, type PasskeyCredentialOptions, type PasskeyCredentialResponse, type PasskeyDesktopLoginRequest, type PasskeyDesktopLoginResponse } from '@nurama/types';
export interface RegisterUserData extends Pick<User, "firstName" | "lastName" | "email"> {
    password: string;
}
export interface LoginCredentials {
    login: string;
    password: string;
    /**
     * Optional. When signing in to accept an invite, pass the invite id: it
     * only reaches the user through the message sent to that address, so
     * quoting it proves control of the inbox and lifts the email-verification
     * grace block for this login. Credentials are still required.
     */
    inviteId?: string;
}
export interface ResetPasswordData {
    token: string;
    password: string;
}
export interface VerifyMFAData {
    mfaToken: string;
}
export interface VerifyBackupCodeData {
    backupCode: string;
}
export interface DisableMFAData {
    mfaToken: string;
}
export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    mfaToken?: string;
}
export interface LoginRegisterResponse {
    user: User;
    tokens: AuthTokens;
}
export interface RefreshResponse extends AuthTokens {
}
/**
 * Defines authentication-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the authentication methods.
 */
export default function createAuthMethods(client: NuramaClient): {
    /**
     * Registers a new user.
     * @param userData - User registration data.
     * @returns {Promise<object>} Object containing user info and tokens.
     */
    register(userData: RegisterUserData): Promise<LoginRegisterResponse>;
    /**
     * Logs in a user.
     * @param credentials - Login credentials.
     * @returns {Promise<object>} Object containing user info and tokens (or MFA challenge token).
     */
    login(credentials: LoginCredentials): Promise<LoginRegisterResponse>;
    /**
     * Logs out a user.
     * @param refreshToken - The refresh token to invalidate.
     * @returns {Promise<void>}
     */
    logout(refreshToken: string): Promise<void>;
    /**
     * Refreshes user tokens.
     * @param refreshToken - The refresh token.
     * @returns {Promise<object>} Object containing new access and refresh tokens.
     */
    refreshTokens(refreshToken?: string): Promise<RefreshResponse>;
    /**
     * Forgets a user's password.
     * @param email - The user's email address.
     * @returns {Promise<void>}
     */
    forgotPassword(email: string): Promise<void>;
    /**
     * Resets a user's password.
     * @param params - Input parameters.
     * @param params.token - The password reset token.
     * @param params.password - The new password.
     * @returns Promise resolving when complete.
     */
    resetPassword({ token, password }: ResetPasswordData): Promise<void>;
    /**
     * Sends a verification email to the authenticated user.
     * @returns Promise resolving when complete.
     */
    sendVerificationEmail(): Promise<void>;
    /**
     * Public, unauthenticated resend of the verification email keyed by
     * address. For users past the verification grace window who can't log
     * in or call the authed sendVerificationEmail. Always resolves (the
     * server returns 204 regardless of whether the email exists).
     * @param email - The email address to resend the verification link to.
     */
    resendVerification(email: string): Promise<void>;
    /**
     * Verifies a user's email using the provided token.
     * @param token - The email verification token.
     * @returns Promise resolving when complete.
     */
    verifyEmail(token: string): Promise<void>;
    /**
     * Enables multi-factor authentication for the authenticated user.
     * @returns Promise resolving to MFA setup details (secret, OTP URL, backup codes).
     */
    enableMfa(): Promise<MFAEnableResponse>;
    /**
     * Verifies an MFA token (e.g., TOTP code).
     * This is used both during initial MFA setup and during login challenges.
     * @param mfaToken - The MFA token code.
     * @returns Promise resolving to user/token data upon successful verification.
     */
    verifyMfa(mfaToken: string): Promise<MFAVerifyResponse>;
    /**
     * Verifies an MFA backup code.
     * This is used during login when a user has lost access to their authenticator app.
     * @param backupCode - The backup code (8-character hex string).
     * @returns Promise resolving to user/token data upon successful verification.
     */
    verifyBackupCode(backupCode: string): Promise<MFAVerifyResponse>;
    /**
     * Disables multi-factor authentication for the authenticated user.
     * Requires a current valid MFA token for confirmation.
     * @param mfaToken - The current MFA token code.
     * @returns Promise resolving when complete.
     */
    disableMfa(mfaToken: string): Promise<void>;
    /**
     * Changes the authenticated user's password.
     * Requires current password verification and MFA token if MFA is enabled.
     * All refresh tokens will be invalidated after password change.
     * @param currentPassword - The current password for verification.
     * @param newPassword - The new password.
     * @param mfaToken - MFA token (required if MFA is enabled).
     * @returns Promise resolving when complete.
     */
    changePassword(currentPassword: string, newPassword: string, mfaToken?: string): Promise<void>;
    /**
     * Locks a user account using a lock account token.
     * This is used when a user receives a password changed notification
     * for a change they did not initiate, allowing them to immediately
     * secure their account.
     * @param token - The lock account token from the password changed email.
     * @returns Promise resolving when the account is locked.
     */
    lockAccount(token: string): Promise<void>;
    /**
     * Sets a password for an OAuth-only user account.
     * This allows OAuth users to add local authentication as a backup.
     * @param password - The password to set.
     * @param mfaToken - MFA token (required if MFA is enabled).
     * @returns Promise resolving when complete.
     */
    setPassword(password: string, mfaToken?: string): Promise<void>;
    /**
     * Links an OAuth provider to the authenticated user's account.
     * This allows users to sign in with multiple OAuth providers.
     * @param provider - The OAuth provider to link (google, apple, microsoft, adobe).
     * @returns Promise resolving to user data with updated linked providers.
     */
    linkOAuthProvider(provider: OAuthProvider): Promise<LoginRegisterResponse>;
    /**
     * Gets the options for the browser's passkey sign-in prompt. Pass them to the WebAuthn library
     * (`startAuthentication` in @simplewebauthn/browser), then send its result to `loginWithPasskey`.
     * @param origin - The web origin to sign in for, from a native app (which has no browser `Origin`); pass the
     *   same one to `loginWithPasskey`. Browsers send their own and ignore this.
     * @returns Promise resolving to WebAuthn request options.
     */
    getPasskeyLoginOptions(origin?: string): Promise<PasskeyCredentialOptions>;
    /**
     * Signs in with the browser's response to the passkey prompt and stores the tokens.
     * A passkey stands in for two-factor, so this never returns an MFA challenge.
     * @param credential - The WebAuthn library's AuthenticationResponseJSON.
     * @param origin - From a native app: the origin passed to `getPasskeyLoginOptions`.
     * @returns Promise resolving to the user and tokens.
     */
    loginWithPasskey(credential: PasskeyCredentialResponse, origin?: string): Promise<LoginRegisterResponse>;
    /**
     * Signs the desktop app in with a passkey, from the browser. Stores nothing: the tokens wait behind the
     * returned one-time code, which the desktop app redeems with `exchangeOAuthCode(code, { codeVerifier })`.
     * @param credential - The WebAuthn library's AuthenticationResponseJSON.
     * @param handoff - The `state` and PKCE `codeChallenge` the desktop app made.
     * @returns Promise resolving to the one-time code.
     */
    loginDesktopWithPasskey(credential: PasskeyCredentialResponse, handoff: Omit<PasskeyDesktopLoginRequest, "credential">): Promise<PasskeyDesktopLoginResponse>;
    /**
     * Gets the options for the browser's "create a passkey" prompt, after confirming who is asking.
     * @param proof - The password when the account has one, and a two-factor code when two-factor is on.
     * @returns Promise resolving to WebAuthn creation options.
     */
    getPasskeyRegistrationOptions(proof?: PasskeyRegistrationProof): Promise<PasskeyCredentialOptions>;
    /**
     * Saves the passkey the browser created.
     * @param credential - The WebAuthn library's RegistrationResponseJSON.
     * @param name - Optional name to tell it apart, e.g. "MacBook".
     * @returns Promise resolving to the saved passkey.
     */
    registerPasskey(credential: PasskeyCredentialResponse, name?: string): Promise<Passkey>;
    /**
     * Lists the authenticated user's passkeys, oldest first.
     * @returns Promise resolving to the user's passkeys.
     */
    listPasskeys(): Promise<Passkey[]>;
    /**
     * Renames one of the authenticated user's passkeys.
     * @param passkeyId - The passkey's id.
     * @param name - The new name.
     * @returns Promise resolving to the renamed passkey.
     */
    renamePasskey(passkeyId: string, name: string): Promise<Passkey>;
    /**
     * Removes one of the authenticated user's passkeys.
     * @param passkeyId - The passkey's id.
     * @returns Promise resolving when complete.
     */
    deletePasskey(passkeyId: string): Promise<void>;
    /**
     * Unlinks an OAuth provider from the authenticated user's account.
     * User must have at least one authentication method remaining (password or another OAuth provider).
     * @param provider - The OAuth provider to unlink (google, apple, microsoft, adobe).
     * @returns Promise resolving when complete.
     */
    unlinkOAuthProvider(provider: OAuthProvider): Promise<void>;
    /**
     * Gets all OAuth providers linked to the authenticated user's account.
     * @returns Promise resolving to array of linked OAuth providers.
     */
    getLinkedOAuthProviders(): Promise<LinkedAuthProvider[]>;
    /**
     * Exchanges an OAuth authorization code for JWT tokens.
     * This is called after the OAuth callback redirects the user back to the app with an exchange code.
     * The exchange code is a short-lived (5 min), single-use token that can be traded for JWT tokens.
     * @param code - The exchange code received from the OAuth callback.
     * @returns Promise resolving to user data, tokens, and optional return URL.
     */
    /**
     * Registers a guest account for public chat participation.
     * Always returns void (204) regardless of outcome for anti-enumeration.
     * @param data - Guest registration data (email, displayName, optional approved color, publicToken).
     */
    registerGuest(data: {
        email: string;
        displayName: string;
        color?: string;
        publicToken: string;
    }): Promise<void>;
    /**
     * Verifies a guest account using the token from the verification email.
     * Stores auth tokens on success and returns user data.
     * @param token - The guest verification token.
     * @returns Promise resolving to user data and auth tokens.
     */
    verifyGuest(token: string): Promise<LoginRegisterResponse>;
    /**
     * Upgrades a guest account to a standard account with a password.
     * Requires the user to be authenticated as a guest.
     * @param data - Upgrade data (password, optional firstName, lastName, company, userName).
     * @returns Promise resolving to the upgraded user data.
     */
    upgradeGuest(data: {
        password: string;
        firstName?: string;
        lastName?: string;
        company?: string;
        userName?: string;
    }): Promise<{
        user: User;
    }>;
    /**
     * Exchanges a one-time sign-in code for tokens and stores them.
     * @param code - The code from the sign-in redirect.
     * @param options.codeVerifier - The PKCE verifier, for a code made with a challenge.
     * @returns Promise resolving to the user and tokens, or a two-factor challenge.
     */
    exchangeOAuthCode(code: string, { codeVerifier }?: {
        codeVerifier?: string;
    }): Promise<OAuthExchangeResponse>;
};
//# sourceMappingURL=auth.d.ts.map
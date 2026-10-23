import NuramaClient from "../NuramaClient.js"; // Adjust path if needed
import {
  type User,
  type AuthTokens,
  type MFAEnableResponse,
  type MFAVerifyResponse,
  type LockAccountRequest,
  type OAuthProvider,
  type LinkedAuthProvider,
  type OAuthExchangeRequest,
  type OAuthExchangeResponse,
  type Passkey,
  type PasskeyRegistrationProof,
  type PasskeyCredentialOptions,
  type PasskeyCredentialResponse,
  type PasskeyDesktopLoginRequest,
  type PasskeyDesktopLoginResponse,
} from '@nurama/types';

// Define specific types for auth requests
export interface RegisterUserData
  extends Pick<User, "firstName" | "lastName" | "email"> {
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

// Define specific response structures combining User and Tokens
export interface LoginRegisterResponse {
  user: User;
  tokens: AuthTokens;
}

// Type for refresh response (just tokens)
export interface RefreshResponse extends AuthTokens {}

/**
 * Defines authentication-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the authentication methods.
 */
export default function createAuthMethods(client: NuramaClient) {
  // Specify return type more accurately if possible, using AuthMethods interface
  return {
    /**
     * Registers a new user.
     * @param userData - User registration data.
     * @returns {Promise<object>} Object containing user info and tokens.
     */
    async register(userData: RegisterUserData): Promise<LoginRegisterResponse> {
      const result: LoginRegisterResponse = await client._request({
        endpoint: "/v1/auth/register",
        method: "POST",
        body: userData,
        sendJWT: false,
      });
      // Store tokens upon successful registration
      if (
        result &&
        result.tokens &&
        result.tokens.access &&
        result.tokens.refresh
      ) {
        // Accessing the private _setTokens - might need adjustment if visibility changes
        (client as any)._setTokens(
          result.tokens.access.token,
          result.tokens.refresh.token,
          result.tokens.access.expires,
          result.tokens.refresh.expires
        );
      } else {
        console.warn("Register response did not contain expected tokens.");
      }
      return result;
    },

    /**
     * Logs in a user.
     * @param credentials - Login credentials.
     * @returns {Promise<object>} Object containing user info and tokens (or MFA challenge token).
     */
    async login(
      credentials: LoginCredentials
    ): Promise<LoginRegisterResponse /* | MFAChallengeResponse */> {
      const result: LoginRegisterResponse /* | MFAChallengeResponse */ =
        await client._request({
          endpoint: "/v1/auth/login",
          method: "POST",
          body: credentials,
          sendJWT: false,
        });
      // Store tokens upon successful login
      if (
        result &&
        "tokens" in result &&
        result.tokens &&
        result.tokens.access &&
        result.tokens.refresh
      ) {
        (client as any)._setTokens(
          result.tokens.access.token,
          result.tokens.refresh.token,
          result.tokens.access.expires,
          result.tokens.refresh.expires
        );
      } else if (
        result &&
        "tokens" in result &&
        result.tokens &&
        result.tokens.verifyMfa
      ) {
        // MFA Challenge - store the verifyMfa token for verification
        (client as any)._setTokens(null, null);
        (client as any)._setVerifyMfaToken(result.tokens.verifyMfa.token);
      } else {
        console.warn(
          "Login response did not contain expected tokens or MFA challenge."
        );
        (client as any)._setTokens(null, null);
      }
      return result;
    },

    /**
     * Logs out a user.
     * @param refreshToken - The refresh token to invalidate.
     * @returns {Promise<void>}
     */
    async logout(refreshToken: string): Promise<void> {
      // Get the refresh token *before* potentially clearing it
      const tokenToInvalidate =
        refreshToken || (client as any)._getRefreshToken();

      if (tokenToInvalidate) {
        try {
          await client._request({
            endpoint: "/v1/auth/logout",
            method: "POST",
            body: { refreshToken: tokenToInvalidate },
            sendJWT: false, // Logout might not need JWT, depends on API
          });
        } catch (error) {
          // Ignore errors - token may already be invalid/deleted
          // The goal is to clear local tokens regardless
          console.warn('Logout API call failed, but clearing local tokens:', error);
        }
      }
      // Clear tokens locally regardless of API call success/failure
      (client as any)._setTokens(null, null);
    },

    /**
     * Refreshes user tokens.
     * @param refreshToken - The refresh token.
     * @returns {Promise<object>} Object containing new access and refresh tokens.
     */
    async refreshTokens(refreshToken?: string): Promise<RefreshResponse> {
      const tokenToUse = refreshToken || (client as any)._getRefreshToken();
      if (!tokenToUse) {
        throw new Error(
          "No refresh token provided or found in client storage."
        );
      }
      const result: RefreshResponse = await client._request({
        endpoint: "/v1/auth/refresh-tokens",
        method: "POST",
        body: { refreshToken: tokenToUse },
        sendJWT: false, // Refresh endpoint uses the refresh token, not the access token
        _isInternalRefresh: true, // Mark as internal to prevent recursive refresh loop if called by _request
      });
      // Store the *new* tokens
      if (result && result.access && result.refresh) {
        (client as any)._setTokens(
          result.access.token,
          result.refresh.token,
          result.access.expires,
          result.refresh.expires
        );
      } else {
        console.warn("Refresh response did not contain expected tokens.");
        // Clear tokens if refresh failed to return new ones
        (client as any)._setTokens(null, null);
      }
      return result;
    },

    /**
     * Forgets a user's password.
     * @param email - The user's email address.
     * @returns {Promise<void>}
     */
    async forgotPassword(email: string): Promise<void> {
      await client._request<void>({
        // Specify void return type
        endpoint: "/v1/auth/forgot-password",
        method: "POST",
        body: { email },
        sendJWT: false, // Usually doesn't require JWT
      });
    },

    /**
     * Resets a user's password.
     * @param params - Input parameters.
     * @param params.token - The password reset token.
     * @param params.password - The new password.
     * @returns Promise resolving when complete.
     */
    async resetPassword({ token, password }: ResetPasswordData): Promise<void> {
      await client._request<void>({
        // Specify void return type
        endpoint: "/v1/auth/reset-password",
        method: "POST",
        body: { token, password },
        sendJWT: false, // Token is the authentication here
      });
    },

    /**
     * Sends a verification email to the authenticated user.
     * @returns Promise resolving when complete.
     */
    async sendVerificationEmail(): Promise<void> {
      await client._request<void>({
        // Specify void return type
        endpoint: "/v1/auth/send-verification-email",
        method: "POST",
        sendJWT: true,
      });
    },

    /**
     * Public, unauthenticated resend of the verification email keyed by
     * address. For users past the verification grace window who can't log
     * in or call the authed sendVerificationEmail. Always resolves (the
     * server returns 204 regardless of whether the email exists).
     * @param email - The email address to resend the verification link to.
     */
    async resendVerification(email: string): Promise<void> {
      await client._request<void>({
        endpoint: "/v1/auth/resend-verification",
        method: "POST",
        body: { email },
        sendJWT: false,
      });
    },

    /**
     * Verifies a user's email using the provided token.
     * @param token - The email verification token.
     * @returns Promise resolving when complete.
     */
    async verifyEmail(token: string): Promise<void> {
      await client._request<void>({
        // Specify void return type
        endpoint: `/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
        method: "POST",
        sendJWT: false, // Token is the authentication here
      });
    },

    /**
     * Enables multi-factor authentication for the authenticated user.
     * @returns Promise resolving to MFA setup details (secret, OTP URL, backup codes).
     */
    async enableMfa(): Promise<MFAEnableResponse> {
      return client._request<MFAEnableResponse>({
        endpoint: "/v1/auth/enable-mfa",
        method: "POST",
        sendJWT: true,
      });
    },

    /**
     * Verifies an MFA token (e.g., TOTP code).
     * This is used both during initial MFA setup and during login challenges.
     * @param mfaToken - The MFA token code.
     * @returns Promise resolving to user/token data upon successful verification.
     */
    async verifyMfa(mfaToken: string): Promise<MFAVerifyResponse> {
      // Response can be full login data (if completing challenge) or just user data (if setting up)

      // Check if we have a verifyMfa token from login (for login challenge)
      const verifyMfaToken = (client as any)._getVerifyMfaToken();

      const requestOptions: any = {
        endpoint: "/v1/auth/verify-mfa",
        method: "POST",
        body: { mfaToken } satisfies VerifyMFAData,
      };

      if (verifyMfaToken) {
        // During MFA login challenge - use the verifyMfa token
        requestOptions.sendJWT = false;
        requestOptions.customHeaders = {
          'Authorization': `Bearer ${verifyMfaToken}`
        };
      } else {
        // During MFA setup - use regular access token
        requestOptions.sendJWT = true;
      }

      const result = await client._request<MFAVerifyResponse>(requestOptions);

      // If login challenge was completed, set the new tokens and clear verifyMfa token
      if (result && result.tokens?.access) {
        (client as any)._setTokens(
          result.tokens.access.token,
          result.tokens.refresh.token,
          result.tokens.access.expires,
          result.tokens.refresh.expires
        );
        // Clear the verifyMfa token as it's no longer needed
        (client as any)._setVerifyMfaToken(null);
      }
      return result;
    },

    /**
     * Verifies an MFA backup code.
     * This is used during login when a user has lost access to their authenticator app.
     * @param backupCode - The backup code (8-character hex string).
     * @returns Promise resolving to user/token data upon successful verification.
     */
    async verifyBackupCode(backupCode: string): Promise<MFAVerifyResponse> {
      // Check if we have a verifyMfa token from login (for login challenge)
      const verifyMfaToken = (client as any)._getVerifyMfaToken();

      const requestOptions: any = {
        endpoint: "/v1/auth/verify-backup-code",
        method: "POST",
        body: { backupCode } satisfies VerifyBackupCodeData,
      };

      if (verifyMfaToken) {
        // During MFA login challenge - use the verifyMfa token
        requestOptions.sendJWT = false;
        requestOptions.customHeaders = {
          'Authorization': `Bearer ${verifyMfaToken}`
        };
      } else {
        // During MFA setup - use regular access token
        requestOptions.sendJWT = true;
      }

      const result = await client._request<MFAVerifyResponse>(requestOptions);

      // If login challenge was completed, set the new tokens and clear verifyMfa token
      if (result && result.tokens?.access) {
        (client as any)._setTokens(
          result.tokens.access.token,
          result.tokens.refresh.token,
          result.tokens.access.expires,
          result.tokens.refresh.expires
        );
        // Clear the verifyMfa token as it's no longer needed
        (client as any)._setVerifyMfaToken(null);
      }
      return result;
    },

    /**
     * Disables multi-factor authentication for the authenticated user.
     * Requires a current valid MFA token for confirmation.
     * @param mfaToken - The current MFA token code.
     * @returns Promise resolving when complete.
     */
    async disableMfa(mfaToken: string): Promise<void> {
      await client._request<void>({
        // Specify void return type
        endpoint: "/v1/auth/disable-mfa",
        method: "POST",
        body: { mfaToken } satisfies DisableMFAData, // Use interface for body
        sendJWT: true,
      });
    },

    /**
     * Changes the authenticated user's password.
     * Requires current password verification and MFA token if MFA is enabled.
     * All refresh tokens will be invalidated after password change.
     * @param currentPassword - The current password for verification.
     * @param newPassword - The new password.
     * @param mfaToken - MFA token (required if MFA is enabled).
     * @returns Promise resolving when complete.
     */
    async changePassword(currentPassword: string, newPassword: string, mfaToken?: string): Promise<void> {
      await client._request<void>({
        endpoint: "/v1/auth/change-password",
        method: "POST",
        body: { currentPassword, newPassword, mfaToken } satisfies ChangePasswordData,
        sendJWT: true,
      });

      // Clear local tokens since all sessions are invalidated
      (client as any)._setTokens(null, null);
    },

    /**
     * Locks a user account using a lock account token.
     * This is used when a user receives a password changed notification
     * for a change they did not initiate, allowing them to immediately
     * secure their account.
     * @param token - The lock account token from the password changed email.
     * @returns Promise resolving when the account is locked.
     */
    async lockAccount(token: string): Promise<void> {
      await client._request<void>({
        endpoint: "/v1/auth/lock-account",
        method: "POST",
        body: { token } satisfies LockAccountRequest,
        sendJWT: false, // Token is the authentication here
      });

      // Clear local tokens since the account is now locked
      (client as any)._setTokens(null, null);
    },

    /**
     * Sets a password for an OAuth-only user account.
     * This allows OAuth users to add local authentication as a backup.
     * @param password - The password to set.
     * @param mfaToken - MFA token (required if MFA is enabled).
     * @returns Promise resolving when complete.
     */
    async setPassword(password: string, mfaToken?: string): Promise<void> {
      await client._request<void>({
        endpoint: "/v1/auth/set-password",
        method: "POST",
        body: { password, mfaToken },
        sendJWT: true,
      });
    },

    /**
     * Links an OAuth provider to the authenticated user's account.
     * This allows users to sign in with multiple OAuth providers.
     * @param provider - The OAuth provider to link (google, apple, microsoft, adobe).
     * @returns Promise resolving to user data with updated linked providers.
     */
    async linkOAuthProvider(provider: OAuthProvider): Promise<LoginRegisterResponse> {
      const result: LoginRegisterResponse = await client._request({
        endpoint: `/v1/auth/${provider}/link`,
        method: "POST",
        sendJWT: true,
      });
      return result;
    },

    /**
     * Gets the options for the browser's passkey sign-in prompt. Pass them to the WebAuthn library
     * (`startAuthentication` in @simplewebauthn/browser), then send its result to `loginWithPasskey`.
     * @param origin - The web origin to sign in for, from a native app (which has no browser `Origin`); pass the
     *   same one to `loginWithPasskey`. Browsers send their own and ignore this.
     * @returns Promise resolving to WebAuthn request options.
     */
    async getPasskeyLoginOptions(origin?: string): Promise<PasskeyCredentialOptions> {
      return client._request<PasskeyCredentialOptions>({
        endpoint: "/v1/auth/passkeys/login-options",
        method: "POST",
        sendJWT: false,
        ...(origin ? { customHeaders: { Origin: origin } } : {}),
      });
    },

    /**
     * Signs in with the browser's response to the passkey prompt and stores the tokens.
     * A passkey stands in for two-factor, so this never returns an MFA challenge.
     * @param credential - The WebAuthn library's AuthenticationResponseJSON.
     * @param origin - From a native app: the origin passed to `getPasskeyLoginOptions`.
     * @returns Promise resolving to the user and tokens.
     */
    async loginWithPasskey(credential: PasskeyCredentialResponse, origin?: string): Promise<LoginRegisterResponse> {
      const result: LoginRegisterResponse = await client._request({
        endpoint: "/v1/auth/passkeys/login",
        method: "POST",
        body: { credential },
        sendJWT: false,
        ...(origin ? { customHeaders: { Origin: origin } } : {}),
      });
      (client as any)._setTokens(
        result.tokens.access.token,
        result.tokens.refresh.token,
        result.tokens.access.expires,
        result.tokens.refresh.expires
      );
      return result;
    },

    /**
     * Signs the desktop app in with a passkey, from the browser. Stores nothing: the tokens wait behind the
     * returned one-time code, which the desktop app redeems with `exchangeOAuthCode(code, { codeVerifier })`.
     * @param credential - The WebAuthn library's AuthenticationResponseJSON.
     * @param handoff - The `state` and PKCE `codeChallenge` the desktop app made.
     * @returns Promise resolving to the one-time code.
     */
    async loginDesktopWithPasskey(
      credential: PasskeyCredentialResponse,
      handoff: Omit<PasskeyDesktopLoginRequest, "credential">
    ): Promise<PasskeyDesktopLoginResponse> {
      return client._request<PasskeyDesktopLoginResponse>({
        endpoint: "/v1/auth/passkeys/desktop-login",
        method: "POST",
        body: { credential, ...handoff } satisfies PasskeyDesktopLoginRequest,
        sendJWT: false,
      });
    },

    /**
     * Gets the options for the browser's "create a passkey" prompt, after confirming who is asking.
     * @param proof - The password when the account has one, and a two-factor code when two-factor is on.
     * @returns Promise resolving to WebAuthn creation options.
     */
    async getPasskeyRegistrationOptions(proof: PasskeyRegistrationProof = {}): Promise<PasskeyCredentialOptions> {
      return client._request<PasskeyCredentialOptions>({
        endpoint: "/v1/auth/passkeys/registration-options",
        method: "POST",
        body: proof,
        sendJWT: true,
      });
    },

    /**
     * Saves the passkey the browser created.
     * @param credential - The WebAuthn library's RegistrationResponseJSON.
     * @param name - Optional name to tell it apart, e.g. "MacBook".
     * @returns Promise resolving to the saved passkey.
     */
    async registerPasskey(credential: PasskeyCredentialResponse, name?: string): Promise<Passkey> {
      return client._request<Passkey>({
        endpoint: "/v1/auth/passkeys",
        method: "POST",
        body: { credential, ...(name ? { name } : {}) },
        sendJWT: true,
      });
    },

    /**
     * Lists the authenticated user's passkeys, oldest first.
     * @returns Promise resolving to the user's passkeys.
     */
    async listPasskeys(): Promise<Passkey[]> {
      return client._request<Passkey[]>({
        endpoint: "/v1/auth/passkeys",
        method: "GET",
        sendJWT: true,
      });
    },

    /**
     * Renames one of the authenticated user's passkeys.
     * @param passkeyId - The passkey's id.
     * @param name - The new name.
     * @returns Promise resolving to the renamed passkey.
     */
    async renamePasskey(passkeyId: string, name: string): Promise<Passkey> {
      return client._request<Passkey>({
        endpoint: `/v1/auth/passkeys/${passkeyId}`,
        method: "PATCH",
        body: { name },
        sendJWT: true,
      });
    },

    /**
     * Removes one of the authenticated user's passkeys.
     * @param passkeyId - The passkey's id.
     * @returns Promise resolving when complete.
     */
    async deletePasskey(passkeyId: string): Promise<void> {
      await client._request<void>({
        endpoint: `/v1/auth/passkeys/${passkeyId}`,
        method: "DELETE",
        sendJWT: true,
      });
    },

    /**
     * Unlinks an OAuth provider from the authenticated user's account.
     * User must have at least one authentication method remaining (password or another OAuth provider).
     * @param provider - The OAuth provider to unlink (google, apple, microsoft, adobe).
     * @returns Promise resolving when complete.
     */
    async unlinkOAuthProvider(provider: OAuthProvider): Promise<void> {
      await client._request<void>({
        endpoint: `/v1/auth/oauth/${provider}/unlink`,
        method: "DELETE",
        sendJWT: true,
      });
    },

    /**
     * Gets all OAuth providers linked to the authenticated user's account.
     * @returns Promise resolving to array of linked OAuth providers.
     */
    async getLinkedOAuthProviders(): Promise<LinkedAuthProvider[]> {
      return client._request<LinkedAuthProvider[]>({
        endpoint: "/v1/auth/oauth/providers",
        method: "GET",
        sendJWT: true,
      });
    },

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
    async registerGuest(data: { email: string; displayName: string; color?: string; publicToken: string }): Promise<void> {
      await client._request<void>({
        endpoint: "/v1/auth/register-guest",
        method: "POST",
        body: data,
        sendJWT: false,
      });
    },

    /**
     * Verifies a guest account using the token from the verification email.
     * Stores auth tokens on success and returns user data.
     * @param token - The guest verification token.
     * @returns Promise resolving to user data and auth tokens.
     */
    async verifyGuest(token: string): Promise<LoginRegisterResponse> {
      const result: LoginRegisterResponse = await client._request({
        endpoint: `/v1/auth/verify-guest?token=${encodeURIComponent(token)}`,
        method: "POST",
        sendJWT: false,
      });
      if (result?.tokens?.access && result?.tokens?.refresh) {
        (client as any)._setTokens(
          result.tokens.access.token,
          result.tokens.refresh.token,
          result.tokens.access.expires,
          result.tokens.refresh.expires
        );
      }
      return result;
    },

    /**
     * Upgrades a guest account to a standard account with a password.
     * Requires the user to be authenticated as a guest.
     * @param data - Upgrade data (password, optional firstName, lastName, company, userName).
     * @returns Promise resolving to the upgraded user data.
     */
    async upgradeGuest(data: { password: string; firstName?: string; lastName?: string; company?: string; userName?: string }): Promise<{ user: User }> {
      return client._request<{ user: User }>({
        endpoint: "/v1/auth/upgrade-guest",
        method: "POST",
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Exchanges a one-time sign-in code for tokens and stores them.
     * @param code - The code from the sign-in redirect.
     * @param options.codeVerifier - The PKCE verifier, for a code made with a challenge.
     * @returns Promise resolving to the user and tokens, or a two-factor challenge.
     */
    async exchangeOAuthCode(code: string, { codeVerifier }: { codeVerifier?: string } = {}): Promise<OAuthExchangeResponse> {
      const result: OAuthExchangeResponse = await client._request({
        endpoint: "/v1/auth/oauth/exchange",
        method: "POST",
        body: { code, ...(codeVerifier ? { codeVerifier } : {}) } satisfies OAuthExchangeRequest,
        sendJWT: false, // No authentication needed - the code is the proof
      });

      // Store tokens upon successful exchange
      // Check if this is MFA flow or regular auth
      if (result && result.tokens) {
        if (result.tokens.access && result.tokens.refresh) {
          // Regular auth - store access and refresh tokens
          (client as any)._setTokens(
            result.tokens.access.token,
            result.tokens.refresh.token,
            result.tokens.access.expires,
            result.tokens.refresh.expires
          );
        } else if ((result.tokens as any).verifyMfa) {
          // MFA required - verifyMfa token will be handled by frontend
          console.log("[SDK] OAuth login requires MFA verification");
        } else {
          console.warn("OAuth exchange response did not contain expected tokens.");
        }
      }

      return result;
    },

  };
}

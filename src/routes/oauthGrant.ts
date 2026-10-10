import NuramaClient from '../NuramaClient.js';

/**
 * One application a user has authorised over OAuth.
 *
 * A grant is the record of consent: the scopes approved, and the tie binding
 * every token issued under it. Revoking one withdraws the application's
 * access.
 */
export interface OAuthGrantSummary {
  /** Opaque identifier; pass to `revokeGrant`. */
  grantId: string;
  clientId: string | null;
  /**
   * The application's name.
   *
   * Chosen by the application itself when `verified` is false — treat it as
   * display text from an untrusted source, never as identification.
   */
  clientName: string | null;
  /**
   * Whether Nurama configured this application.
   *
   * False for one that registered itself through Dynamic Client Registration:
   * it picked its own name and nobody reviewed it.
   */
  verified: boolean;
  /** Scopes the user approved, from the backend's token-scope registry. */
  scopes: string[];
  grantedAt: string;
  expiresAt: string | null;
}

export default function createOAuthGrantMethods(client: NuramaClient) {
  return {
    /**
     * List the applications the caller has authorised, newest first.
     * Expired grants are omitted by the server.
     */
    async listGrants(): Promise<OAuthGrantSummary[]> {
      const res = await client._request<{ results: OAuthGrantSummary[] }>({
        method: 'GET',
        endpoint: '/v1/oauth-grants',
        sendJWT: true,
        bypassCache: true,
      });
      return res.results;
    },

    /**
     * Withdraw an application's access: the grant and every token issued
     * under it. An access token already in flight stays valid until it
     * expires, so revocation is not instantaneous for a request under way.
     */
    async revokeGrant(grantId: string): Promise<void> {
      if (!grantId) throw new Error('grantId is required.');
      return client._request<void>({
        method: 'DELETE',
        endpoint: `/v1/oauth-grants/${grantId}`,
        sendJWT: true,
      });
    },
  };
}

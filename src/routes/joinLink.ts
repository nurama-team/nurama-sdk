import NuramaClient from '../NuramaClient.js';
import {
  type JoinLink,
  type JoinLinkPreview,
  type CreateJoinLinkPayload,
  type UpdateJoinLinkPayload,
  type RedeemJoinLinkResult,
} from '@nurama/types';

// --- Query Parameter Interfaces ---
export interface GetJoinLinksParams {
  projectId: string;
}

// --- Response Interfaces ---
export type JoinLinkResponse = JoinLink;
export interface JoinLinksListResponse {
  results: JoinLink[];
}

/**
 * Defines join-link ("invite link") methods for the NuramaClient. A join link
 * lets people join a project via a shareable URL; management is gated by the
 * caller's grant authority and the workspace plan's per-mode capability
 * (enforced server-side).
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the join-link methods.
 */
export default function createJoinLinkMethods(client: NuramaClient) {
  return {
    /** Create a join link for a project. */
    async createJoinLink(data: CreateJoinLinkPayload): Promise<JoinLinkResponse> {
      return client._request<JoinLinkResponse>({
        method: 'POST',
        endpoint: '/v1/join-links',
        body: data,
        sendJWT: true,
      });
    },

    /** List a project's join links. */
    async getJoinLinks(params: GetJoinLinksParams): Promise<JoinLinksListResponse> {
      if (!params?.projectId) throw new Error('projectId is required.');
      return client._request<JoinLinksListResponse>({
        method: 'GET',
        endpoint: '/v1/join-links',
        params,
        sendJWT: true,
      });
    },

    /** Update a join link's settings (role, mode, domains, expiry, enable/disable). */
    async updateJoinLink(linkId: string, data: UpdateJoinLinkPayload): Promise<JoinLinkResponse> {
      if (!linkId) throw new Error('linkId is required.');
      return client._request<JoinLinkResponse>({
        method: 'PATCH',
        endpoint: `/v1/join-links/${linkId}`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Rotate a link's token, invalidating the old URL. Optionally reset expiry.
     * Existing memberships are untouched.
     */
    async rollJoinLink(linkId: string, expiresAt?: string | null): Promise<JoinLinkResponse> {
      if (!linkId) throw new Error('linkId is required.');
      return client._request<JoinLinkResponse>({
        method: 'POST',
        endpoint: `/v1/join-links/${linkId}/roll`,
        body: expiresAt !== undefined ? { expiresAt } : {},
        sendJWT: true,
      });
    },

    /**
     * Public preview of a join link by token — no auth — so the join landing
     * page can show "Join <project>" before the visitor signs in.
     */
    async getJoinByToken(token: string): Promise<JoinLinkPreview> {
      if (!token) throw new Error('token is required.');
      return client._request<JoinLinkPreview>({
        method: 'GET',
        endpoint: `/v1/join/${token}`,
        sendJWT: false, // Public route - no authentication required
      });
    },

    /** Redeem a join link for the authenticated user. */
    async joinByToken(token: string): Promise<RedeemJoinLinkResult> {
      if (!token) throw new Error('token is required.');
      return client._request<RedeemJoinLinkResult>({
        method: 'POST',
        endpoint: `/v1/join/${token}`,
        sendJWT: true,
      });
    },
  };
}

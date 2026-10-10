import NuramaClient from '../NuramaClient.js';
import {
  type JoinLink,
  type JoinLinkPreview,
  type CreateJoinLinkPayload,
  type UpdateJoinLinkPayload,
  type RedeemJoinLinkResult,
  type ListJoinRequestsResponse,
  type ListMyJoinRequestsResponse,
  type ApproveJoinRequestResponse,
  type RejectJoinRequestRequest,
  type RejectJoinRequestResponse,
  type UpdateJoinRequestCooldownRequest,
  type ProjectJoinRequest,
  type ListBansResponse,
  type CreateResourceBanRequest,
  type ResourceBan,
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

    /** The queue of people waiting on a decision for this project. */
    async getJoinRequests(params: { projectId: string }): Promise<ListJoinRequestsResponse> {
      if (!params?.projectId) throw new Error('projectId is required.');
      return client._request<ListJoinRequestsResponse>({
        method: 'GET',
        endpoint: '/v1/join-links/requests',
        params,
        sendJWT: true,
      });
    },

    /**
     * The caller's own requests still waiting on a decision.
     *
     * Needs no `projectId`: it is scoped server-side to the caller, who is not
     * a member of the projects they are waiting on and so cannot read those
     * projects' queues.
     */
    async getMyJoinRequests(): Promise<ListMyJoinRequestsResponse> {
      return client._request<ListMyJoinRequestsResponse>({
        method: 'GET',
        endpoint: '/v1/join-links/requests/mine',
        sendJWT: true,
      });
    },

    /**
     * Approve a request and admit the person.
     *
     * Seats and the link's remaining uses are re-checked here, not when the
     * request was made — a queue outlives the capacity that existed when it was
     * filled, so approval can legitimately fail on a seat limit.
     */
    async approveJoinRequest(requestId: string, projectId: string): Promise<ApproveJoinRequestResponse> {
      if (!requestId) throw new Error('requestId is required.');
      if (!projectId) throw new Error('projectId is required.');
      return client._request<ApproveJoinRequestResponse>({
        method: 'POST',
        endpoint: `/v1/join-links/requests/${requestId}/approve`,
        body: { projectId },
        sendJWT: true,
      });
    },

    /**
     * Reject a request, optionally barring the person.
     *
     * Passing `ban` is destructive beyond the refusal: a ban REMOVES an existing
     * membership, so it can take away access the person already had in scope.
     * It is a separate field for that reason, never implied by the rejection.
     */
    async rejectJoinRequest(requestId: string, data: RejectJoinRequestRequest): Promise<RejectJoinRequestResponse> {
      if (!requestId) throw new Error('requestId is required.');
      if (!data?.projectId) throw new Error('projectId is required.');
      return client._request<RejectJoinRequestResponse>({
        method: 'POST',
        endpoint: `/v1/join-links/requests/${requestId}/reject`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Change or lift the cooldown on a rejected request.
     *
     * Only a rejected request has one; `reapplyAfter: null` lifts it, letting
     * the person ask again straight away. A barred person is refused — the ban
     * already blocks every path, so lifting that is the action that matters.
     */
    async updateJoinRequestCooldown(
      requestId: string,
      data: UpdateJoinRequestCooldownRequest,
    ): Promise<ProjectJoinRequest> {
      if (!requestId) throw new Error('requestId is required.');
      if (!data?.projectId) throw new Error('projectId is required.');
      return client._request<ProjectJoinRequest>({
        method: 'PATCH',
        endpoint: `/v1/join-links/requests/${requestId}/cooldown`,
        body: { projectId: data.projectId, reapplyAfter: data.reapplyAfter ?? null },
        sendJWT: true,
      });
    },

    /**
     * Bar someone, without a request to refuse.
     *
     * Destructive: the ban REMOVES every membership the person holds in its
     * scope, so a `workspace` ban clears them out of every project in it. An
     * owner cannot be barred, and neither can you bar yourself.
     */
    async createResourceBan(data: CreateResourceBanRequest): Promise<ResourceBan> {
      if (!data?.projectId) throw new Error('projectId is required.');
      if (!data?.userId) throw new Error('userId is required.');
      if (!data?.scope) throw new Error('scope is required.');
      return client._request<ResourceBan>({
        method: 'POST',
        endpoint: '/v1/join-links/bans',
        body: data,
        sendJWT: true,
      });
    },

    /** People barred from this project, newest first. */
    async getResourceBans(params: { projectId: string }): Promise<ListBansResponse> {
      if (!params?.projectId) throw new Error('projectId is required.');
      return client._request<ListBansResponse>({
        method: 'GET',
        endpoint: '/v1/join-links/bans',
        params,
        sendJWT: true,
      });
    },

    /** Lift a ban. It does not restore any membership the ban removed. */
    async liftResourceBan(banId: string): Promise<ResourceBan> {
      if (!banId) throw new Error('banId is required.');
      return client._request<ResourceBan>({
        method: 'DELETE',
        endpoint: `/v1/join-links/bans/${banId}`,
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

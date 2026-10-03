import NuramaClient from '../NuramaClient.js';
import {
  type Invite,
  type Membership,
  type PaginatedResult,
  type CursorPaginatedResult,
} from '@nurama/types';

// Combine pagination metadata with a results array
// (Should be defined centrally or imported if used across multiple route files)
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
  results?: T[];
};

// --- Request Body Interfaces ---
export interface InviteUserToResourceData {
    inviteeEmail: string;
    resourceType: string; // e.g., 'workspace', 'project'
    resourceId: string;
    role: string; // Use a specific type/enum if possible based on `invitableRoles`
    /** Optional workspace-level roles granted alongside the primary role
     *  (subset of the backend `additionalRoles`, e.g. workspaceChatMember,
     *  workspaceAdmin). Applied to the workspace membership on accept. */
    additionalRoles?: string[];
}

// --- Query Parameter Interfaces ---
export type InviteStatus = 'active' | 'canceled' | 'accepted';

export interface GetUsersInvitesParams {
    inviteType?: 'all' | 'inviter' | 'invitee';
    status?: InviteStatus | InviteStatus[];
}

export interface GetInvitesToResourceParams {
    status?: InviteStatus | InviteStatus[];
}

// --- Response Interfaces ---
export type InviteResponse = Invite;
// Assuming the response for getInvites might be complex depending on params
export type PaginatedInvitesResponse = PaginatedResponse<Invite> | { inviter: Invite[], invitee: Invite[] } | Invite[]; 
export type AcceptInviteResponse = {
    membership: Membership; // Use Membership type
    invite: Invite; // Use Invite type
};

/**
 * Defines invite-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the invite-related methods.
 */
export default function createInviteMethods(client: NuramaClient) {
  return {
    /**
     * Invite a user (by email) to a workspace or project at a given role.
     * Triggers an invitation email; the recipient accepts via the link.
     */
    async inviteUser(data: InviteUserToResourceData): Promise<InviteResponse> {
      return client._request<InviteResponse>({
        method: 'POST',
        endpoint: '/v1/invites',
        body: data,
        sendJWT: true,
      });
    },

    /** List invites the current user has issued (pending, accepted, expired). */
    async getInvites(params?: GetUsersInvitesParams): Promise<PaginatedInvitesResponse> {
      return client._request<PaginatedInvitesResponse>({
        method: 'GET',
        endpoint: '/v1/invites',
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Look up an invite by id. Public — no auth — so the recipient can
     * preview the invite (target resource, role, inviter) before signing
     * up or logging in.
     */
    async getInviteById(inviteId: string): Promise<InviteResponse> {
      if (!inviteId) throw new Error('inviteId is required.');
      return client._request<InviteResponse>({
        method: 'GET',
        endpoint: `/v1/invites/${inviteId}`,
        sendJWT: false, // Public route - no authentication required
      });
    },

    /** Revoke a pending invite. */
    async cancelInvite(inviteId: string): Promise<InviteResponse> {
      if (!inviteId) throw new Error('inviteId is required.');
      return client._request<InviteResponse>({
        method: 'DELETE',
        endpoint: `/v1/invites/${inviteId}`,
        sendJWT: true,
      });
    },

    /** List pending invites attached to a workspace or project resource. */
    async getInvitesForResource(resourceId: string, params?: GetInvitesToResourceParams): Promise<InviteResponse[]> {
      if (!resourceId) throw new Error('resourceId is required.');
      return client._request<InviteResponse[]>({
        method: 'GET',
        endpoint: `/v1/invites/resource/${resourceId}`,
        params: params,
        sendJWT: true,
      });
    },

    /** Accept an invite for the authenticated user. Creates the membership. */
    async acceptInvite(inviteId: string): Promise<AcceptInviteResponse> {
      if (!inviteId) throw new Error('inviteId is required.');
      return client._request<AcceptInviteResponse>({
        method: 'POST',
        endpoint: `/v1/invites/accept/${inviteId}`,
        sendJWT: true,
      });
    },

    /** Re-send a pending invite email (does not extend or reissue the token). */
    async resendInvite(inviteId: string): Promise<InviteResponse> {
      if (!inviteId) throw new Error('inviteId is required.');
      return client._request<InviteResponse>({
        method: 'POST',
        endpoint: `/v1/invites/resend/${inviteId}`,
        sendJWT: true,
      });
    },
  };
} 
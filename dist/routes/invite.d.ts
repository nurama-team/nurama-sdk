import NuramaClient from '../NuramaClient.js';
import { type Invite, type Membership, type PaginatedResult, type CursorPaginatedResult } from '@nurama/types';
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
    results?: T[];
};
export interface InviteUserToResourceData {
    inviteeEmail: string;
    resourceType: string;
    resourceId: string;
    role: string;
    /** Optional workspace-level roles granted alongside the primary role
     *  (subset of the backend `additionalRoles`, e.g. workspaceChatMember,
     *  workspaceAdmin). Applied to the workspace membership on accept. */
    additionalRoles?: string[];
}
export type InviteStatus = 'active' | 'canceled' | 'accepted';
export interface GetUsersInvitesParams {
    inviteType?: 'all' | 'inviter' | 'invitee';
    status?: InviteStatus | InviteStatus[];
}
export interface GetInvitesToResourceParams {
    status?: InviteStatus | InviteStatus[];
}
export type InviteResponse = Invite;
export type PaginatedInvitesResponse = PaginatedResponse<Invite> | {
    inviter: Invite[];
    invitee: Invite[];
} | Invite[];
export type AcceptInviteResponse = {
    membership: Membership;
    invite: Invite;
};
/**
 * Defines invite-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the invite-related methods.
 */
export default function createInviteMethods(client: NuramaClient): {
    /**
     * Invite a user (by email) to a workspace or project at a given role.
     * Triggers an invitation email; the recipient accepts via the link.
     */
    inviteUser(data: InviteUserToResourceData): Promise<InviteResponse>;
    /** List invites the current user has issued (pending, accepted, expired). */
    getInvites(params?: GetUsersInvitesParams): Promise<PaginatedInvitesResponse>;
    /**
     * Look up an invite by id. Public — no auth — so the recipient can
     * preview the invite (target resource, role, inviter) before signing
     * up or logging in.
     */
    getInviteById(inviteId: string): Promise<InviteResponse>;
    /** Revoke a pending invite. */
    cancelInvite(inviteId: string): Promise<InviteResponse>;
    /** List pending invites attached to a workspace or project resource. */
    getInvitesForResource(resourceId: string, params?: GetInvitesToResourceParams): Promise<InviteResponse[]>;
    /** Accept an invite for the authenticated user. Creates the membership. */
    acceptInvite(inviteId: string): Promise<AcceptInviteResponse>;
    /** Re-send a pending invite email (does not extend or reissue the token). */
    resendInvite(inviteId: string): Promise<InviteResponse>;
};
//# sourceMappingURL=invite.d.ts.map
import NuramaClient from '../NuramaClient.js';
import { type JoinLink, type JoinLinkPreview, type CreateJoinLinkPayload, type UpdateJoinLinkPayload, type RedeemJoinLinkResult, type ListJoinRequestsResponse, type ListMyJoinRequestsResponse, type ApproveJoinRequestResponse, type RejectJoinRequestRequest, type RejectJoinRequestResponse, type UpdateJoinRequestCooldownRequest, type ProjectJoinRequest, type ListBansResponse, type CreateResourceBanRequest, type ResourceBan } from '@nurama/types';
export interface GetJoinLinksParams {
    projectId: string;
}
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
export default function createJoinLinkMethods(client: NuramaClient): {
    /** Create a join link for a project. */
    createJoinLink(data: CreateJoinLinkPayload): Promise<JoinLinkResponse>;
    /** List a project's join links. */
    getJoinLinks(params: GetJoinLinksParams): Promise<JoinLinksListResponse>;
    /** The queue of people waiting on a decision for this project. */
    getJoinRequests(params: {
        projectId: string;
    }): Promise<ListJoinRequestsResponse>;
    /**
     * The caller's own requests still waiting on a decision.
     *
     * Needs no `projectId`: it is scoped server-side to the caller, who is not
     * a member of the projects they are waiting on and so cannot read those
     * projects' queues.
     */
    getMyJoinRequests(): Promise<ListMyJoinRequestsResponse>;
    /**
     * Approve a request and admit the person.
     *
     * Seats and the link's remaining uses are re-checked here, not when the
     * request was made — a queue outlives the capacity that existed when it was
     * filled, so approval can legitimately fail on a seat limit.
     */
    approveJoinRequest(requestId: string, projectId: string): Promise<ApproveJoinRequestResponse>;
    /**
     * Reject a request, optionally barring the person.
     *
     * Passing `ban` is destructive beyond the refusal: a ban REMOVES an existing
     * membership, so it can take away access the person already had in scope.
     * It is a separate field for that reason, never implied by the rejection.
     */
    rejectJoinRequest(requestId: string, data: RejectJoinRequestRequest): Promise<RejectJoinRequestResponse>;
    /**
     * Change or lift the cooldown on a rejected request.
     *
     * Only a rejected request has one; `reapplyAfter: null` lifts it, letting
     * the person ask again straight away. A barred person is refused — the ban
     * already blocks every path, so lifting that is the action that matters.
     */
    updateJoinRequestCooldown(requestId: string, data: UpdateJoinRequestCooldownRequest): Promise<ProjectJoinRequest>;
    /**
     * Bar someone, without a request to refuse.
     *
     * Destructive: the ban REMOVES every membership the person holds in its
     * scope, so a `workspace` ban clears them out of every project in it. An
     * owner cannot be barred, and neither can you bar yourself.
     */
    createResourceBan(data: CreateResourceBanRequest): Promise<ResourceBan>;
    /** People barred from this project, newest first. */
    getResourceBans(params: {
        projectId: string;
    }): Promise<ListBansResponse>;
    /** Lift a ban. It does not restore any membership the ban removed. */
    liftResourceBan(banId: string): Promise<ResourceBan>;
    /** Update a join link's settings (role, mode, domains, expiry, enable/disable). */
    updateJoinLink(linkId: string, data: UpdateJoinLinkPayload): Promise<JoinLinkResponse>;
    /**
     * Rotate a link's token, invalidating the old URL. Optionally reset expiry.
     * Existing memberships are untouched.
     */
    rollJoinLink(linkId: string, expiresAt?: string | null): Promise<JoinLinkResponse>;
    /**
     * Public preview of a join link by token — no auth — so the join landing
     * page can show "Join <project>" before the visitor signs in.
     */
    getJoinByToken(token: string): Promise<JoinLinkPreview>;
    /** Redeem a join link for the authenticated user. */
    joinByToken(token: string): Promise<RedeemJoinLinkResult>;
};
//# sourceMappingURL=joinLink.d.ts.map
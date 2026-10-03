import NuramaClient from '../NuramaClient.js';
import { type JoinLink, type JoinLinkPreview, type CreateJoinLinkPayload, type UpdateJoinLinkPayload, type RedeemJoinLinkResult } from '@nurama/types';
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
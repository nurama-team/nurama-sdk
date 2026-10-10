import { ObjectId } from './common';
import { Membership } from './membership';
import { Asset } from './asset';
/**
 * A shareable link that lets people join a project.
 *
 *  - `mode: 'auto'`     → redeeming grants membership immediately.
 *  - `mode: 'approval'` → redeeming files a request an admin approves (Phase 2).
 *
 * The plan capability required depends on the mode: `joinLinksApproval` (every
 * paid plan) for approval links, `joinLinksAuto` (Studio Pro / Brand) for auto
 * links. Currently only project-owned links exist.
 */
export interface JoinLink {
    /** @format uuid */
    id: ObjectId;
    /** The opaque token embedded in the join URL (rotates when rolled). */
    token: string;
    /**
     * Admin-chosen name for the link, so several on one project can be told apart
     * and the approval queue can say which one a request came through. Null when
     * unnamed; clients fall back to the mode plus a short id.
     */
    label?: string | null;
    /** Fully-qualified join URL, e.g. `https://app.nurama.com/join/<token>`. */
    url: string;
    /** @example project */
    ownerResourceType: 'project';
    /** @format uuid */
    ownerResourceId: ObjectId;
    /** Role granted to joiners. @example reviewer */
    role: string;
    /** Extra workspace-level roles granted alongside `role`. */
    additionalRoles: string[];
    /** @example auto */
    mode: 'auto' | 'approval';
    /** Bare, lower-cased domains the joiner's email must match; empty = any. */
    allowedEmailDomains: string[];
    /** @example active */
    status: 'active' | 'disabled';
    /** @format date-time */
    expiresAt: string | null;
    /** Maximum successful redemptions; null = unlimited. */
    maxUses: number | null;
    /** Successful redemptions so far. */
    useCount: number;
    /** @format uuid */
    creatorId: ObjectId;
    /** @format date-time */
    tokenRolledAt: string | null;
    /** @format uuid */
    rolledByUserId: ObjectId | null;
    /** @format date-time */
    createdAt: string;
    /** @format date-time */
    updatedAt: string;
}
/** Public, pre-sign-in preview shown on the join landing page. */
export interface JoinLinkPreview {
    /** @format uuid */
    projectId: ObjectId;
    projectName: string | null;
    /** Project logo asset (with parsed `files`) for the join page icon, if any. */
    projectLogo?: Asset | null;
    /** Project brand color, used for the icon's fallback/border. */
    projectColor?: string | null;
    mode: 'auto' | 'approval';
    emailRestricted: boolean;
    allowedEmailDomains: string[];
}
/** Payload to create a join link. */
export interface CreateJoinLinkPayload {
    /** @format uuid */
    projectId: string;
    /** Optional name for the link. Trimmed; empty is stored as null. */
    label?: string | null;
    mode?: 'auto' | 'approval';
    role?: string;
    additionalRoles?: string[];
    allowedEmailDomains?: string[];
    /** @format date-time */
    expiresAt?: string | null;
    maxUses?: number | null;
}
/** Payload to update a join link's settings (at least one field). */
export interface UpdateJoinLinkPayload {
    /** Pass null or '' to clear the name. */
    label?: string | null;
    role?: string;
    mode?: 'auto' | 'approval';
    additionalRoles?: string[];
    allowedEmailDomains?: string[];
    /** @format date-time */
    expiresAt?: string | null;
    maxUses?: number | null;
    status?: 'active' | 'disabled';
}
/** Result of redeeming a join link. */
export interface RedeemJoinLinkResult {
    /**
     * - `joined`         → membership granted; the caller can go into the project.
     * - `already-member` → nothing to do; they were in already.
     * - `requested`      → an APPROVAL-mode link. Nothing was granted: a request is
     *   queued for an admin. A caller that treats this like `joined` will walk the
     *   person through role onboarding and then fail to reach the project, because
     *   they have no membership — so handle it explicitly.
     */
    status: 'joined' | 'already-member' | 'requested';
    membership?: Membership;
    /** Present only when `status` is `requested` — the queued request row. */
    request?: ProjectJoinRequest;
}
/** Lifecycle of a request to join a project through an approval-mode link. */
export type JoinRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export interface ProjectJoinRequest {
    id: string;
    /** The link the request came through, not its token — rolling a token keeps requests intact. */
    linkId: string;
    projectId: string;
    userId: string;
    /**
     * The terms the requester actually saw, snapshotted at request time. The link
     * can be edited while a request waits; an admin approves what was asked for.
     */
    role: string;
    additionalRoles: string[];
    requestedEmail?: string | null;
    status: JoinRequestStatus;
    decidedById?: string | null;
    decidedAt?: string | null;
    /**
     * Set on a rejection that carried a cooldown — when this person may ask again.
     * Null for an approval, and for a plain rejection with no cooldown.
     */
    reapplyAfter?: string | null;
    createdAt: string;
    updatedAt: string;
    /**
     * The requester, populated for the admin queue so it can show a face and a
     * name rather than a bare id. Null if the account has since been removed.
     */
    user?: JoinRequestPerson | null;
    /** Whoever decided it — part of the record a decided row is kept for. */
    decidedBy?: JoinRequestPerson | null;
    /**
     * The link this request arrived through, populated for the admin queue. Null
     * when the link has since been deleted — the request itself is kept either way.
     */
    link?: JoinRequestLink | null;
}
/**
 * The link a request came through, as the queue needs it. No `token`: the queue
 * names and distinguishes links, it does not hand them out.
 */
export interface JoinRequestLink {
    id: string;
    label?: string | null;
    mode: 'auto' | 'approval';
    role: string;
    status: 'active' | 'disabled';
    /** When the link was minted. Names an unnamed link, so two can be told apart. */
    createdAt: string;
}
/** The subset of a user the join-request queue renders. */
export interface JoinRequestPerson {
    id: string;
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    color?: string | null;
    avatarId?: string | null;
    avatar?: unknown;
}
/** How far a ban reaches. A workspace ban covers every project inside it. */
export type BanScope = 'project' | 'workspace';
export interface ResourceBan {
    id: string;
    scope: BanScope;
    /** The project or workspace the ban is set on, per `scope`. */
    resourceId: string;
    workspaceId: string;
    userId: string;
    /** Display only. Bans key on the account, so changing email does not lift one. */
    email?: string | null;
    reason?: string | null;
    /** The rejected request this ban came from, when it came from one. */
    sourceRequestId?: string | null;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}
export interface ListJoinRequestsResponse {
    results: ProjectJoinRequest[];
}
/**
 * A pending request as its own requester sees it.
 *
 * The same row as `ProjectJoinRequest`, carrying the project instead of the
 * person: who asked is not news to the person who asked, and while they wait
 * they are not a member, so what they learn about the project is limited to
 * what the public link preview already showed them.
 */
export interface MyJoinRequest {
    id: string;
    projectId: string;
    role: string;
    additionalRoles: string[];
    /** Always `pending` — a decided request is no longer outstanding. */
    status: JoinRequestStatus;
    createdAt: string;
    /** Null if the project has since been deleted. */
    project?: {
        id: string;
        name: string;
        /** Brand colour, for the icon's fallback and border. */
        color?: string | null;
        /** Logo asset with parsed `files`, as the public link preview carries it. */
        logo?: Asset | null;
    } | null;
}
export interface ListMyJoinRequestsResponse {
    results: MyJoinRequest[];
}
export interface ApproveJoinRequestResponse {
    request: ProjectJoinRequest;
    membership: unknown;
}
export interface RejectJoinRequestRequest {
    projectId: string;
    /**
     * Present means "also bar this person". Deliberately explicit: a ban REMOVES
     * an existing membership, so it can take away access they already had.
     *
     * Mutually exclusive with `reapplyAfter` — the server refuses both together,
     * because a ban already blocks every path and a cooldown beside it would be
     * dead config.
     */
    ban?: {
        scope: BanScope;
        reason?: string;
    };
    /**
     * The softer alternative: an ISO timestamp for when this person may ask again.
     *
     * Blocks self-service joining through any of the project's links until then,
     * and unlike a ban it does not touch existing memberships or stop an admin
     * from inviting them directly. Omit for an ordinary rejection, which they may
     * follow with a fresh request immediately.
     */
    reapplyAfter?: string | null;
}
/** The reapply-cooldown presets the admin UI offers on a rejection. */
export type ReapplyPreset = 'none' | '24h' | '1w' | '1m' | '1y' | 'custom';
export interface RejectJoinRequestResponse {
    request: ProjectJoinRequest;
}
/**
 * Amending the cooldown a rejection already set.
 *
 * `reapplyAfter` is required rather than optional: the value IS the call, and
 * `null` — "they may ask again now" — is a decision worth stating rather than
 * one that should fall out of an omitted field.
 */
export interface UpdateJoinRequestCooldownRequest {
    projectId: string;
    reapplyAfter: string | null;
}
/**
 * Barring someone directly, rather than through rejecting their request.
 *
 * `userId`, not an email: the ban hangs off the account, and taking an address
 * would make this a way to ask whether one has an account behind it.
 */
export interface CreateResourceBanRequest {
    projectId: string;
    userId: string;
    scope: BanScope;
    /** Admin-visible only. The person barred is never shown it, or told at all. */
    reason?: string;
}
export interface ListBansResponse {
    results: ResourceBan[];
}

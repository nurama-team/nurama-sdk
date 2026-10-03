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
    status: 'joined' | 'already-member';
    membership?: Membership;
}

import type { ObjectId } from './common.js';
/**
 * Scratch — platform-wide temporary object-storage primitive.
 *
 * The storage backend is S3-compatible (S3, R2, etc.) — the SDK works
 * against any provider that speaks the S3 wire protocol. Consumers
 * stage bytes here when the bytes are either going to be promoted to a
 * real `Asset` shortly, or expire and be reaped. There is no public
 * surface for *creating* scratch rows — parent processes (e.g. AI
 * Revision) mint signed PUT URLs server-side and return them inline.
 * Clients call `POST /v1/scratch/:id/confirm` after the upload
 * completes; the server records the audit row + increments workspace
 * storage usage.
 */
/**
 * Lifecycle states:
 *   - 'pendingUpload' — row exists, upload URL minted, bucket object not
 *     yet present.
 *   - 'active'        — bytes are on the bucket and usable by consumers.
 *   - 'promoted'      — moved to a real Asset; `promotedToAssetId` set.
 *   - 'expired'       — past `expires` and processed by cleanup; row
 *     lingers briefly for audit before hard-delete.
 */
export type ScratchStatus = 'pendingUpload' | 'active' | 'promoted' | 'expired';
/** One scratch row. */
export interface Scratch {
    id: ObjectId;
    /** Groups items in one job (e.g. all revisions from one modal session). */
    jobId: ObjectId | null;
    workspaceId: ObjectId;
    /** Null = workspace-scope. */
    projectId: ObjectId | null;
    creatorId: ObjectId;
    /** Discriminator: 'aiRevision' | 'userTempUpload' | …. camelCase, stable. */
    jobType: string;
    /** Role within the job: 'result' | 'source' | 'mask' | …. */
    function: string;
    status: ScratchStatus;
    /** Canonical bucket key the row points at. */
    keyPath: string;
    mimeType: string | null;
    sizeInBytes: number | null;
    meta: Record<string, unknown> | null;
    expires: string;
    /** Backref when status='promoted'. */
    promotedToAssetId: ObjectId | null;
    createdAt: string;
    updatedAt: string;
}
/**
 * Body for `POST /v1/scratch/:id/complete-upload`. Same shape as the
 * asset complete-upload route (minus the asset-specific `key` /
 * `assetId` fields — scratch looks `keyPath` up off the row).
 */
export interface ScratchCompleteUploadBody {
    uploadId: string;
    parts: Array<{
        ETag: string;
        PartNumber: number;
    }>;
}
/**
 * Response from `POST /v1/scratch/:id/complete-upload`. The url is the
 * public media-bucket URL the FE can render directly.
 */
export interface ScratchCompleteUploadResponse {
    id: ObjectId;
    url: string | null;
}
/**
 * Bundle returned by parent processes that mint scratch upload URLs
 * (e.g. AI Revision's user-direct upload path). Mirrors the shape
 * `asset.service.generateMultipartSignedUrls` returns per file, minus
 * the asset-specific fields. The FE uses `uploadId` + `urls` to drive a
 * multipart upload (one PUT per URL) then calls
 * `POST /v1/scratch/:id/complete-upload` with the collected
 * `{ ETag, PartNumber }` tuples.
 */
export interface ScratchUploadBundle {
    /** The new scratch row id. */
    scratchId: ObjectId;
    /** S3-compatible multipart UploadId. */
    uploadId: string;
    /** Canonical bucket key the row points at. */
    keyPath: string;
    /** Per-part signed PUT URLs (one per chunk). */
    urls: string[];
    /** When the URLs and the row expire. */
    expires: string;
}
/**
 * StorageUsageEvent — audit row written for every scratch byte event.
 * The workspace's subscription storage quota is the authoritative
 * consumption tracker (see the `Storage` snapshot rows written by
 * `storageService.applyStorageDelta`); this row is the per-event trail
 * that says which process / function / scratchId moved how many bytes
 * for the workspace, and when.
 */
export interface StorageUsageEvent {
    id: ObjectId;
    workspaceId: ObjectId;
    projectId: ObjectId | null;
    userId: ObjectId;
    scratchId: ObjectId | null;
    /** Mirrors Scratch.jobType. */
    jobType: string;
    function: string;
    sizeInBytes: number;
    createdAt: string;
}

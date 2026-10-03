import NuramaClient from '../NuramaClient.js';

export interface CompleteUploadBody {
  uploadId: string;
  parts: Array<{ ETag: string; PartNumber: number }>;
}

export interface CompleteUploadResponse {
  id: string;
  url: string | null;
}

export interface PromoteBody {
  /** Optional rename — lands on `Asset.name`. Defaults to a row-id-derived name. */
  fileName?: string;
}

export interface PromoteResponse {
  asset: unknown;
  /**
   * `true` when the scratch row was already promoted on a prior call
   * (e.g. the same revision was Attached-to-chat earlier and the
   * chat-send pipeline ran the promote synchronously). The returned
   * `asset` is the existing one. The FE should treat this as a no-op
   * for "newly added" UX (toast copy, list-refresh side effects) while
   * still surfacing the asset.
   */
  alreadyPromoted: boolean;
}

/**
 * Scratch — platform-wide temporary object-storage with explicit lifecycle.
 *
 * There is NO public surface for creating scratch rows or minting
 * upload URLs. Parent processes (e.g. AI Revision) initiate the
 * multipart upload server-side and return the
 * `{ scratchId, uploadId, key, urls[] }` bundle in their own response
 * payload. The FE uploads each part directly against its signed URL
 * (same pattern as asset uploads), then calls `completeUpload` here to
 * finalise.
 *
 * `completeUpload` mirrors `nuramaClient.asset.completeUpload`:
 * the body is the same `{ uploadId, parts }` shape, the server runs the
 * S3-compatible `CompleteMultipartUploadCommand`, and (for scratch
 * specifically) HEADs the resulting object, increments workspace
 * storage usage, and writes the audit row.
 */
export default function createScratchMethods(client: NuramaClient) {
  return {
    /**
     * Finish a multipart upload for a scratch row. Same `{ uploadId,
     * parts }` body the asset complete-upload route accepts. Server
     * runs `CompleteMultipartUploadCommand` against the media bucket,
     * HEADs the object for size, increments workspace storage usage,
     * writes the audit row, and flips status pendingUpload → active.
     * Creator-only.
     */
    async completeUpload(scratchId: string, data: CompleteUploadBody): Promise<CompleteUploadResponse> {
      if (!scratchId) throw new Error('scratchId is required.');
      if (!data?.uploadId) throw new Error('uploadId is required.');
      if (!Array.isArray(data?.parts) || data.parts.length === 0) {
        throw new Error('parts is required.');
      }
      return client._request({
        endpoint: `/v1/scratch/${encodeURIComponent(scratchId)}/complete-upload`,
        method: 'POST',
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Promote a scratch row to a real Asset. Creator-only — only the
     * user who created the scratch row can call this. Destination is
     * derived server-side from the row itself:
     *   - row has `projectId`     → asset created in that project
     *   - row has only workspace  → asset created at the workspace
     *
     * No body fields for destination on purpose: the FE doesn't get to
     * claim a scratch belongs to a different workspace / project. The
     * only optional input is `fileName` to override the asset's
     * user-facing name.
     */
    async promote(scratchId: string, data: PromoteBody = {}): Promise<PromoteResponse> {
      if (!scratchId) throw new Error('scratchId is required.');
      return client._request({
        endpoint: `/v1/scratch/${encodeURIComponent(scratchId)}/promote`,
        method: 'POST',
        body: data,
        sendJWT: true,
      });
    },
  };
}

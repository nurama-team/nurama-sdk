import type { ObjectId } from './common.js';

/**
 * AI Revision — prompt-driven image variant generation from the asset
 * viewer's annotation toolbar. The result is staged on a Scratch row.
 * Two promotion outcomes:
 *   - **Upload to project** → `POST /v1/ai/revisions/promote` materialises
 *     a project-scoped Asset eagerly.
 *   - **Attach to chat** → the FE leaves the scratch id in the chat
 *     composer's pending attachments; the chat-send endpoint
 *     (`POST /v1/chats/:chatId/messages`) accepts `{ scratchId, name? }`
 *     attachment items and promotes each to a chat-scoped Asset when
 *     the message lands. No `/v1/ai/revisions/promote` call.
 */

/**
 * Source for a revision call. Exactly one of:
 *   - `url`     — public media URL of an existing image asset.
 *   - `dataUrl` — base64 data URL (e.g. a video frame captured client-side).
 */
export type AiRevisionSource = { url: string } | { dataUrl: string };

export interface AiRevisionGenerateRequest {
  workspaceId: ObjectId;
  projectId?: ObjectId;
  /** Audit-only; the FE has already resolved the asset's media URL. */
  assetId?: ObjectId;
  source: AiRevisionSource;
  prompt: string;
  /** Prior revisions in the same session, used for multi-image conditioning. */
  references?: string[];
  /**
   * Optional alpha-channel mask PNG (data URL) matching the source
   * image's dimensions. Transparent pixels mark the edit region; opaque
   * pixels are preserved. Server forwards it as OpenAI's `mask` field
   * (region-indicator metadata), not as another reference image.
   */
  mask?: { dataUrl: string };
  /** Groups all revisions in one modal session. */
  jobId?: ObjectId;
}

export interface AiRevisionGenerateResponse {
  /** Scratch id for the staged revision. */
  revisionId: ObjectId;
  revisionUrl: string | null;
  model: string;
  quality: string;
  billedCredits: number;
  balanceAfter: number | null;
  eventId: ObjectId | null;
}

export interface AiRevisionPromoteRequest {
  workspaceId: ObjectId;
  scratchId: ObjectId;
  projectId: ObjectId;
  fileName?: string;
}

export interface AiRevisionPromoteResponse {
  asset: unknown;
}

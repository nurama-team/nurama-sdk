import NuramaClient from '../NuramaClient.js';
/** One turn of the drafting conversation, as sent back on each request. */
export interface ComposeWithNuTurn {
    role: 'user' | 'assistant';
    text: string;
    /**
     * Wording this turn offered. Held per turn so an earlier draft stays
     * takeable after the conversation has moved on — the user may prefer the
     * version from three turns ago.
     */
    proposal?: string | null;
}
export interface ComposeWithNuRequest {
    workspaceId: string;
    /** Chat being composed into. Read server-side for context and tone. */
    chatId: string;
    projectId?: string;
    messages: ComposeWithNuTurn[];
}
export interface ComposeWithNuResponse {
    /** What Nu said to the user. Never posted anywhere. */
    text: string;
    /** Wording the user may put in their composer, or null for a pure question. */
    proposal: string | null;
    billedCredits: number;
    balanceAfter: number | null;
    eventId: string | null;
}
/** One Nu Feedback submission. */
export interface SubmitAiFeedbackRequest {
    rating: 'positive' | 'negative';
    /** Which AI surface produced the reply — the two are tuned separately. */
    surface: 'chat' | 'assist';
    chatId: string;
    messageId?: string;
    /** The user's own words on what worked or didn't. Optional. */
    notes?: string;
    workspaceId?: string;
    projectId?: string;
    /** Extras the client already holds, folded into the stored snapshot. */
    pageContext?: Record<string, unknown>;
    contextItems?: Array<Record<string, unknown>>;
}
export interface PolishRequest {
    workspaceId: string;
    text: string;
    toneId: string;
    projectId?: string;
}
export interface PolishResponse {
    polishedText: string;
    billedCredits: number;
    balanceAfter: number;
    eventId: string | null;
}
export interface TaskGenerationContextMessage {
    /** Display name of the message author. Optional but improves the prompt. */
    authorName?: string;
    content: string;
}
export interface GenerateTasksRequest {
    workspaceId: string;
    projectId: string;
    messageText: string;
    /** Optional source chat message id — reserved for future audit linking. */
    messageId?: string;
    /**
     * Preceding chat messages (oldest first) to give the model conversational
     * lead-in. Server caps at 10 messages and trims long content per-message;
     * the focal `messageText` is the actual instruction.
     */
    contextMessages?: TaskGenerationContextMessage[];
}
export interface GeneratedTask {
    subject: string;
    description: string;
}
export interface GenerateTasksResponse {
    tasks: GeneratedTask[];
    billedCredits: number;
    balanceAfter: number;
    eventId: string | null;
}
export interface ToneEntry {
    id: string;
    label: string;
}
export interface ListTonesResponse {
    tones: ToneEntry[];
}
/**
 * Source for an image revision call. Exactly one of:
 *   - `url`       — public media URL (typical for image assets).
 *   - `scratchId` — id of a Scratch row the FE uploaded via
 *                   `createRevisionSourceUpload`. Preferred for
 *                   captured video frames so bytes never transit the
 *                   API node.
 *   - `dataUrl`   — DEPRECATED legacy path: FE-captured video frame
 *                   serialised as a base64 data URL inline in the
 *                   request body. Kept here for back-compat during
 *                   FE rollout; new code should always use the
 *                   `scratchId` flow.
 */
export type ImageRevisionSource = {
    url: string;
} | {
    scratchId: string;
} | {
    dataUrl: string;
};
export interface GenerateImageRevisionRequest {
    workspaceId: string;
    projectId?: string;
    /** Audit-only — the caller has already resolved the asset's media URL. */
    assetId?: string;
    source: ImageRevisionSource;
    prompt: string;
    /** Prior revisions to condition on (public URLs or data URLs). */
    references?: string[];
    /**
     * Optional alpha-channel mask PNG (data URL) matching the source
     * image's dimensions. Transparent pixels mark the edit region; opaque
     * pixels are preserved. When supplied, the server forwards it as
     * OpenAI's top-level `mask` field — NOT as another `references[]`
     * entry — and auto-augments the prompt with a region directive.
     */
    mask?: {
        dataUrl: string;
    };
    /** Groups all revisions from one modal session. */
    jobId?: string;
    /**
     * Source image's aspect ratio (width / height). Two effects when set:
     *   1. The server picks the closest OpenAI-supported generation
     *      size — landscape, portrait, or square — instead of always
     *      generating 1024×1024. Reduces the gap between the model's
     *      output aspect and the source aspect before any padding.
     *   2. After generation, the server pads the result with black
     *      bars (letterbox/pillarbox) so the final bytes exactly
     *      match this aspect. The user gets an output image whose
     *      framing matches the input they started from, with the
     *      generated content centred and the unfilled edges padded.
     *
     * Omit (or pass `1.0`) for legacy square output.
     */
    sourceAspect?: number;
}
export interface GenerateImageRevisionResponse {
    /**
     * Scratch id. The FE forwards this in one of two outcomes:
     *   - "Upload to project" → call `promoteRevision` (this SDK module)
     *     to materialise as a project-scoped Asset.
     *   - "Attach to chat" → pass `{ scratchId }` as a chat-message
     *     attachment item; the chat-send endpoint promotes it to a
     *     chat-scoped Asset at send time.
     */
    revisionId: string;
    /** Public URL the FE can render directly. */
    revisionUrl: string | null;
    model: string;
    quality: string;
    billedCredits: number;
    balanceAfter: number | null;
    eventId: string | null;
}
/**
 * Source-upload mint request. Returns a multipart upload bundle the
 * FE drives like any other scratch / asset upload (PUT each `urls[i]`
 * with the corresponding part, collect the ETags, call complete-
 * upload). Server hardcodes mime to `image/jpeg` — the only producer
 * is the captured video frame, which is always JPEG. Size cap
 * (matches OpenAI's images/edits per-image limit): 25 MB.
 */
export interface CreateRevisionSourceUploadRequest {
    workspaceId: string;
    projectId?: string;
    /** Audit-only lineage — the originating asset id. */
    assetId?: string;
    sizeInMB: number;
}
export interface CreateRevisionSourceUploadResponse {
    /** Use as `source.scratchId` on the subsequent `generateRevision` call. */
    scratchId: string;
    /**
     * Bucket-side keyPath. Pass to `nuramaClient.asset.multipartUpload`
     * which threads it through into its session-progress + result shape.
     */
    key: string;
    /** Pass back to `POST /v1/scratch/:id/complete-upload` along with parts. */
    uploadId: string;
    /**
     * One signed PUT URL per multipart part. Single-element array for
     * sub-chunk-size payloads (1080p JPEG frames are well under).
     */
    urls: string[];
    /** ISO-string TTL — the row is reaped after this. */
    expires: string;
}
/**
 * Methods for the Nu AI assistant integration points.
 *
 * Nu is the platform-native AI feature set. Each integration point is gated
 * by workspace settings (`allowAiFeatures` master switch + per-feature toggle
 * + role allowlist) and metered against the workspace's credit balance.
 *
 * MVP exposes a single integration point — Polish — used by the chat
 * composer to rewrite a draft message in a selected tone.
 */
export default function createAiMethods(client: NuramaClient): {
    /**
     * Rewrite a draft chat message in a selected tone. Charges the workspace's
     * credit balance based on the underlying provider cost plus markup.
     *
     * @param data - Polish request payload.
     * @returns The polished text plus billing telemetry.
     */
    /**
     * One turn of a Compose-with-Nu drafting conversation.
     *
     * Send only the drafting thread — the chat being written into is read
     * server-side from `chatId`, under the caller's own permissions. The
     * result is Nu's commentary plus, when it has one, a proposed message.
     * Nothing is posted: the proposal is the user's to take or discard.
     */
    composeWithNu(data: ComposeWithNuRequest): Promise<ComposeWithNuResponse>;
    /**
     * Record a thumbs-up / thumbs-down on one assistant reply.
     *
     * `chatId` is required because it is what the server authorises against —
     * a user can only rate a reply in a chat they can already read — and it is
     * what the stored transcript snapshot is built from.
     */
    submitFeedback(data: SubmitAiFeedbackRequest): Promise<{
        id: string;
    }>;
    polish(data: PolishRequest): Promise<PolishResponse>;
    /**
     * Convert a chat message into one or more board-task drafts. The
     * frontend opens the EnhancedTaskCreatorModal in a loading state, calls
     * this method, and seeds the modal's draft list from the response's
     * `tasks` array. Requires both the AI add-on AND the Boards add-on on
     * the workspace; the server returns `productNotActive` if either is
     * missing.
     *
     * @param data - Task generation request payload.
     * @returns Tasks plus billing telemetry.
     */
    generateTasks(data: GenerateTasksRequest): Promise<GenerateTasksResponse>;
    /**
     * Returns the catalogue of polish tones the platform supports. The FE
     * uses this to populate the tone dropdown without hard-coding the IDs.
     */
    listTones(): Promise<ListTonesResponse>;
    /**
     * Generate one image revision (prompt-driven variant of a source
     * image or video frame). The result is staged on Scratch — the FE
     * then chooses one of two outcomes:
     *   - "Add to project" → call `nuramaClient.scratch.promote(id)` to
     *     create a project-scoped Asset immediately.
     *   - "Attach to chat" → leave the scratch id in the chat
     *     composer's pending attachments; the chat-send endpoint
     *     accepts `{ scratchId, name? }` items in `attachments[]` and
     *     promotes each to a chat-scoped Asset at send time.
     */
    generateRevision(data: GenerateImageRevisionRequest): Promise<GenerateImageRevisionResponse>;
    /**
     * Mint a signed-URL bundle for uploading a source image (typically
     * a captured video frame) into Scratch BEFORE calling
     * `generateRevision`. Use the resulting `scratchId` as the
     * `source.scratchId` on the generate call.
     *
     * Why this exists: video frames are captured client-side and need
     * to reach OpenAI as a public media URL. Posting the bytes inline
     * (as `dataUrl`) makes the API node a pass-through for multi-MB
     * payloads; staging on Scratch first keeps the node out of the
     * byte path entirely.
     */
    createRevisionSourceUpload(data: CreateRevisionSourceUploadRequest): Promise<CreateRevisionSourceUploadResponse>;
};
//# sourceMappingURL=ai.d.ts.map
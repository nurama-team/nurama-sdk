// Scratch promotion moved to the scratch namespace —
// `nuramaClient.scratch.promote(id, { fileName? })`. The AI module
// no longer carries a `promoteRevision`. Two reasons for the move:
//   1. Scratch is a generic primitive; promote applies to ALL scratch
//      jobTypes, not just AI Revision.
//   2. Destination (workspace + project) is derived from the scratch
//      row's own state on the server — keeps promote a single-arg
//      operation from the FE's perspective ("promote this row") and
//      removes the cross-workspace-promote attack surface.
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
export default function createAiMethods(client) {
    return {
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
        async composeWithNu(data) {
            if (!data?.workspaceId)
                throw new Error('workspaceId is required.');
            if (!data?.chatId)
                throw new Error('chatId is required.');
            if (!data?.messages?.length)
                throw new Error('messages is required.');
            return client._request({
                endpoint: '/v1/ai/compose',
                method: 'POST',
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Record a thumbs-up / thumbs-down on one assistant reply.
         *
         * `chatId` is required because it is what the server authorises against —
         * a user can only rate a reply in a chat they can already read — and it is
         * what the stored transcript snapshot is built from.
         */
        async submitFeedback(data) {
            if (!data?.chatId)
                throw new Error('chatId is required.');
            if (!data?.rating)
                throw new Error('rating is required.');
            if (!data?.surface)
                throw new Error('surface is required.');
            return client._request({
                endpoint: '/v1/ai/feedback',
                method: 'POST',
                body: data,
                sendJWT: true,
            });
        },
        async polish(data) {
            if (!data?.workspaceId)
                throw new Error('workspaceId is required.');
            if (!data?.text)
                throw new Error('text is required.');
            if (!data?.toneId)
                throw new Error('toneId is required.');
            return client._request({
                endpoint: '/v1/ai/polish',
                method: 'POST',
                body: data,
                sendJWT: true,
            });
        },
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
        async generateTasks(data) {
            if (!data?.workspaceId)
                throw new Error('workspaceId is required.');
            if (!data?.projectId)
                throw new Error('projectId is required.');
            if (!data?.messageText)
                throw new Error('messageText is required.');
            return client._request({
                endpoint: '/v1/ai/task-generation',
                method: 'POST',
                body: data,
                sendJWT: true,
            });
        },
        /**
         * Returns the catalogue of polish tones the platform supports. The FE
         * uses this to populate the tone dropdown without hard-coding the IDs.
         */
        async listTones() {
            return client._request({
                endpoint: '/v1/ai/tones',
                method: 'GET',
                sendJWT: true,
            });
        },
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
        async generateRevision(data) {
            if (!data?.workspaceId)
                throw new Error('workspaceId is required.');
            if (!data?.source)
                throw new Error('source is required.');
            if (!data?.prompt)
                throw new Error('prompt is required.');
            return client._request({
                endpoint: '/v1/ai/revisions',
                method: 'POST',
                body: data,
                sendJWT: true,
            });
        },
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
        async createRevisionSourceUpload(data) {
            if (!data?.workspaceId)
                throw new Error('workspaceId is required.');
            if (!(data?.sizeInMB > 0))
                throw new Error('sizeInMB must be a positive number.');
            return client._request({
                endpoint: '/v1/ai/revisions/source-upload',
                method: 'POST',
                body: data,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=ai.js.map
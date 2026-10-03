import type { ObjectId } from './common.js';
/**
 * AI chat — the platform's in-app chat with the AI assistant.
 *
 * An `AiChatTopic` is one user's private conversation context, scoped to a
 * workspace, a project, or as a personal (social) chat. Messages live in
 * the shared `ChatMessage` collection on a backing `Chat` with
 * `chatType: 'ai'`. See packages/types/src/chat.ts for the AI-specific
 * columns added to `ChatMessage`.
 */
/** Role label applied to assistant or tool messages in an AI chat thread. */
export type AiChatMessageRole = 'assistant' | 'tool';
/**
 * Scope of an AI chat topic. Mirrors ChatMember's scope semantics:
 *   - 'workspace' → cross-project AI chat; scopeId = workspaceId
 *   - 'project'   → bound to one project;  scopeId = projectId
 *   - 'social'    → personal chat with no resource; scopeId = null
 */
export type AiChatTopicScopeType = 'workspace' | 'project' | 'social';
/** One AI chat topic. */
export interface AiChatTopic {
    id: ObjectId;
    chatType: 'ai';
    scopeType: AiChatTopicScopeType;
    /** Null when scopeType is 'social'. */
    scopeId: ObjectId | null;
    /** Billing workspace. Always set, even for social chats. */
    workspaceId: ObjectId;
    creatorId: ObjectId;
    /** ID of the backing Chat. ChatMessages reference it via `chatId`. */
    chatId: ObjectId;
    /** Null until the assistant auto-names the topic or the user sets one.
     *  Editable at any time via PATCH /topics/:id. */
    title: string | null;
    /** True when the backend's auto-name attempt finished without
     *  producing a title (LLM threw OR returned empty). Lets the FE
     *  differentiate "currently generating" from "naming gave up" while
     *  `title` is still null. */
    titleGenerationFailed: boolean;
    /** Context-column pins, persisted per topic so they survive a session. */
    contextItems?: AiChatContextItem[] | null;
    totalMessages: number;
    /** Sum of billed credits across every assistant turn in this topic. */
    totalBilledCredits: number;
    /** Truncated plain-text snapshot of the most recent message (≤280
     *  chars). Lets topic-list rows render a 2-line summary without
     *  fetching the last ChatMessage. Null on freshly-created topics. */
    lastMessagePreview: string | null;
    lastMessageAt: string | null;
    archived: boolean;
    status: 'active';
    createdAt: string;
    updatedAt: string;
}
export interface AiChatToolCall {
    /** Provider-supplied tool-call ID. Pairs with the matching result entry. */
    id: string;
    name: string;
    args: Record<string, unknown>;
}
export interface AiChatToolResult {
    id: string;
    name: string;
    ok: boolean;
    result: unknown;
}
export interface AiChatListTopicsParams {
    workspaceId: ObjectId;
    scopeType: AiChatTopicScopeType;
    /** Required when scopeType is 'workspace' or 'project'; omit for 'social'. */
    scopeId?: ObjectId;
    archived?: boolean;
    limit?: number;
}
export interface AiChatListTopicsResponse {
    results: AiChatTopic[];
}
export interface AiChatCreateTopicRequest {
    workspaceId: ObjectId;
    scopeType: AiChatTopicScopeType;
    /** Required when scopeType is 'workspace' or 'project'; omit for 'social'. */
    scopeId?: ObjectId;
    title?: string;
}
export interface AiChatCreateTopicResponse {
    topic: AiChatTopic;
}
export interface AiChatGetTopicResponse {
    topic: AiChatTopic;
}
/**
 * A single Context-column pin. Identity only — the server re-resolves every
 * entry under the caller's live permissions on each turn, so this carries no
 * names, no thumbnails, and no access decision.
 */
export interface AiChatContextItem {
    type: 'asset' | 'folder' | 'user' | 'submission' | 'public' | 'chat' | 'task';
    /** UUID, or the share token for `public` collections. */
    id: string;
}
export interface AiChatUpdateTopicRequest {
    workspaceId: ObjectId;
    title?: string;
    archived?: boolean;
    /** Replaces the topic's pins wholesale. An empty array clears them. */
    contextItems?: AiChatContextItem[];
}

import { ObjectId } from './common';
import { Asset, File } from './asset';
import { PublicUser } from './user';
import { CursorPaginatedResult } from './pagination';
/**
 * Event feed — one card per event rather than one per asset.
 *
 * Every card is self-contained: `data` carries everything it renders, so a
 * page of the feed needs no further lookups.
 */
export type FeedEventKind = 'upload' | 'assetChat' | 'projectChat' | 'taskChat' | 'publish' | 'submission' | 'public' | 'member' | 'task';
export type FeedVisibility = 'creator' | 'reviewer';
/** The slice of an asset a card draws: name, type and thumbnail files. */
export interface FeedEventAssetPreview {
    id: ObjectId;
    name: string;
    mediaType: string;
    files: File[];
}
export interface FeedEventReaction {
    user: ObjectId;
    emoji: string;
    /** Snapshot of the reacting user, for naming them without a lookup. */
    profile?: PublicUser | null;
}
/** A message in an asset-chat card's preview (raw content, as the chat renders it). */
export interface FeedEventChatMessage {
    id: ObjectId;
    authorId: ObjectId | null;
    createdAt: number;
    content: string;
    mentions?: Record<string, unknown>[];
    assetMentions?: Record<string, unknown>[];
    folderMentions?: Record<string, unknown>[];
    taskMentions?: Record<string, unknown>[];
    submissionMentions?: Record<string, unknown>[];
    publicMentions?: Record<string, unknown>[];
    attachments?: Record<string, unknown>[];
}
/** `data` for upload and publish cards. */
export interface FeedEventGroupData {
    actor: PublicUser | null;
    assets: FeedEventAssetPreview[];
    count: number;
}
export interface FeedEventAssetChatData {
    asset: FeedEventAssetPreview;
    chatId: ObjectId;
    participants: PublicUser[];
    participantCount: number;
    /** Oldest → newest, at most five. */
    recentMessages: FeedEventChatMessage[];
    messageCount: number;
}
/**
 * `data` for project-chat cards. The same shape as an asset chat's minus the
 * asset: the project's own chat is about the project, not about any one thing
 * in it.
 */
export interface FeedEventProjectChatData {
    chatId: ObjectId;
    /** The chat's own subject, where it has been given one. */
    chatSubject: string | null;
    participants: PublicUser[];
    participantCount: number;
    /** Oldest → newest, at most five. */
    recentMessages: FeedEventChatMessage[];
    messageCount: number;
}
/** The task a task-chat card is about, as the card draws it. */
export interface FeedEventTaskPreview {
    id: ObjectId;
    /** The project's task number (#12), when the task has one. */
    number: number | null;
    subject: string;
    status: string;
    /** The board it's on — opening the card deep-links there (`?task=<id>`). */
    boardId: ObjectId | null;
    /** The board's name — current as of the page load, not when the card was written. */
    boardName: string | null;
}
/**
 * `data` for task-chat cards: a discussion in a board task's own chat. The
 * same shape as an asset chat's, about a task rather than an asset.
 */
export interface FeedEventTaskChatData {
    task: FeedEventTaskPreview;
    chatId: ObjectId;
    participants: PublicUser[];
    participantCount: number;
    /** Oldest → newest, at most five. */
    recentMessages: FeedEventChatMessage[];
    messageCount: number;
}
export interface FeedEventSubmissionData extends FeedEventGroupData {
    submissionId: ObjectId;
    subject: string | null;
    description: string | null;
    version: string | null;
}
export interface FeedEventPublicData extends FeedEventGroupData {
    publicId: ObjectId;
    token: string;
    title: string | null;
    expires: number | null;
}
/** `data` for membership cards: someone joined or left the project. */
export interface FeedEventMemberData {
    /** The member who joined or left. */
    actor: PublicUser | null;
    action: 'joined' | 'left';
    roles: string[];
}
/** A task row's latest state on a task card. */
export type FeedEventTaskLatest = {
    action: 'completed';
} | {
    action: 'moved';
    columnName: string | null;
    boardName: string | null;
} | {
    action: 'status';
    status: string;
} | {
    action: 'assigned';
    assignee: PublicUser | null;
};
/** One task on a task card: created on this card, and/or its latest change. */
export interface FeedEventTaskRow {
    id: ObjectId;
    /** The board it's on — opening the row deep-links there (`?task=<id>`). */
    boardId: ObjectId | null;
    /** The board's name — current as of the page load, not when the card was written. */
    boardName: string | null;
    /** The project's task number (#12), when the task has one. */
    number: number | null;
    subject: string;
    created: boolean;
    latest: FeedEventTaskLatest | null;
}
/** `data` for task cards: one person's task activity, one row per task. */
export interface FeedEventTaskData {
    actor: PublicUser | null;
    /** In the order first touched. */
    tasks: FeedEventTaskRow[];
    count: number;
}
interface FeedEventBase {
    id: ObjectId;
    projectId: ObjectId;
    visibility: FeedVisibility;
    subjectKey: ObjectId | null;
    actorId: ObjectId | null;
    assetIds: ObjectId[];
    /** Every task the card covers: a task card's rows, a task-chat card's task. */
    taskIds: ObjectId[];
    mediaTypes: string[];
    searchText: string;
    reactions: FeedEventReaction[];
    /** Epoch ms. The only sort key; changes only when the card moves to the bottom. */
    lastActivityAt: number;
    createdAt: number;
    updatedAt: number;
    /**
     * The assets the card shows up front — its most recent few — in full with
     * their chats, exactly as the asset feed loads them, so each renders as the
     * asset feed's own item. Present on API pages (gone assets are left out);
     * absent on websocket pushes.
     */
    assets?: Asset[];
}
export type FeedEvent = (FeedEventBase & {
    kind: 'upload' | 'publish';
    data: FeedEventGroupData;
}) | (FeedEventBase & {
    kind: 'assetChat';
    data: FeedEventAssetChatData;
}) | (FeedEventBase & {
    kind: 'projectChat';
    data: FeedEventProjectChatData;
}) | (FeedEventBase & {
    kind: 'taskChat';
    data: FeedEventTaskChatData;
}) | (FeedEventBase & {
    kind: 'submission';
    data: FeedEventSubmissionData;
}) | (FeedEventBase & {
    kind: 'public';
    data: FeedEventPublicData;
}) | (FeedEventBase & {
    kind: 'member';
    data: FeedEventMemberData;
}) | (FeedEventBase & {
    kind: 'task';
    data: FeedEventTaskData;
});
export interface ListFeedEventsParams {
    kinds?: FeedEventKind[];
    mediaTypes?: string[];
    search?: string;
    followedOnly?: boolean;
    cursor?: string;
    limit?: number;
}
export type CursorPaginatedFeedEvents = CursorPaginatedResult & {
    results: FeedEvent[];
};
export {};

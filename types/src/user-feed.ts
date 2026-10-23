import { ObjectId } from './common';
import { PublicUser } from './user';
import { File } from './asset';
import { FeedEvent, FeedEventKind, FeedVisibility } from './feed-event';
import { CursorPaginatedResult } from './pagination';

/**
 * User feed — one person's cross-project feed.
 *
 * Two categories of item:
 *   - `activity`: a project card. `event` is the card, loaded exactly as the
 *     project feed serves it.
 *   - `action`: something waiting on this person. `data` is its snapshot, and
 *     it settles itself (`state` → `done`) when the thing it asks for happens.
 */
export type UserFeedCategory = 'activity' | 'action';

export type UserFeedActionKind = 'mention' | 'taskAssigned' | 'invite' | 'joinRequest' | 'convoLive';

export type UserFeedState = 'open' | 'done' | 'dismissed';

export interface UserFeedMentionData {
  taskId: ObjectId;
  messageId: ObjectId | null;
  chatId: ObjectId | null;
  topicType: string;
  topicId: ObjectId;
  visibility: string | null;
  /** The message, cut short; `{{mention:<id>}}` tokens are left whole. */
  excerpt: string;
}

export interface UserFeedTaskAssignedData {
  taskId: ObjectId;
  taskNumber: number | null;
  subject: string;
  status: string;
  boardId: ObjectId;
  boardName: string | null;
  boardVisibility: FeedVisibility[];
}

export interface UserFeedInviteData {
  inviteId: ObjectId;
  resourceType: 'project' | 'workspace';
  resourceId: ObjectId;
  resourceName: string;
  role: string;
  /** Epoch ms. */
  expires: number;
}

export interface UserFeedJoinRequestData {
  requestId: ObjectId;
  role: string;
  additionalRoles: string[];
}

export interface UserFeedConvoLiveData {
  convoId: ObjectId;
  chatId: ObjectId;
  chatType: string;
  convoType: string;
  subject: string | null;
}

/** A project's or workspace's logo: just the files needed to draw it. */
export interface UserFeedLogo {
  id: ObjectId;
  files: File[];
}

/** The project an item is in, as its header shows it. */
export interface UserFeedProject {
  id: ObjectId;
  workspaceId: ObjectId;
  name: string;
  slug: string | null;
  color: string | null;
  logo: UserFeedLogo | null;
}

export interface UserFeedWorkspace {
  id: ObjectId;
  name: string;
  slug: string;
  color: string | null;
  logo: UserFeedLogo | null;
}

interface UserFeedEntryBase {
  id: ObjectId;
  /** Unique within one person's feed: the card id, or the task / invite / request / convo id. */
  subjectKey: string;
  state: UserFeedState;
  workspaceId: ObjectId | null;
  /** Null for an invite to a project the person is not in yet. */
  projectId: ObjectId | null;
  actorId: ObjectId | null;
  /** Epoch ms. The feed's sort key. */
  lastActivityAt: number;
  createdAt: number;
  resolvedAt: number | null;
  project: UserFeedProject | null;
  workspace: UserFeedWorkspace | null;
}

export type UserFeedActivityEntry = UserFeedEntryBase & {
  category: 'activity';
  kind: FeedEventKind;
  visibility: FeedVisibility;
  feedEventId: ObjectId;
  data: null;
  event: FeedEvent;
};

export type UserFeedActionEntry = UserFeedEntryBase & {
  category: 'action';
  visibility: '';
  feedEventId: null;
  /** Who caused it. */
  actor: PublicUser | null;
} & (
    | { kind: 'mention'; data: UserFeedMentionData }
    | { kind: 'taskAssigned'; data: UserFeedTaskAssignedData }
    | { kind: 'invite'; data: UserFeedInviteData }
    | { kind: 'joinRequest'; data: UserFeedJoinRequestData }
    | { kind: 'convoLive'; data: UserFeedConvoLiveData }
  );

export type UserFeedEntry = UserFeedActivityEntry | UserFeedActionEntry;

export interface ListUserFeedParams {
  category?: UserFeedCategory;
  /** Defaults to open and done. */
  states?: UserFeedState[];
  workspaceId?: ObjectId;
  projectId?: ObjectId;
  /**
   * The project feed's filters, across every project. They narrow project
   * cards only; any of them set leaves action items out.
   */
  kinds?: FeedEventKind[];
  mediaTypes?: string[];
  search?: string;
  followedOnly?: boolean;
  cursor?: string;
  limit?: number;
}

export type CursorPaginatedUserFeed = CursorPaginatedResult & {
  results: UserFeedEntry[];
};

/**
 * One project's unread activity in your feed — the badge on its icon.
 *
 * Counted against that project's OWN read marker, not the feed-wide one, so
 * opening a project clears its badge and leaves the rest alone. A project with
 * nothing new is absent rather than zero, and one you have never opened reports
 * nothing at all.
 */
export interface UserFeedProjectUnread {
  projectId: ObjectId;
  /** Null for an item that belongs to no workspace. */
  workspaceId: ObjectId | null;
  /** Which side of the project the count came from — you follow one of the two. */
  visibility: FeedVisibility;
  unreadCount: number;
}

/** Every badge the app shows. `unread` stops at 100 — show "99+" past 99. */
export interface UserFeedSummary {
  /** Items other people put in the feed since the read marker; answered or cleared ones don't count. */
  unread: number;
  /** Epoch ms, or null when no read position has been recorded. */
  lastReadAt: number | null;
  /**
   * Per-project activity badges. Normally one row per project, since you follow
   * one side of each; not capped, because each row is one icon's number.
   */
  byProject: UserFeedProjectUnread[];
}

/**
 * The `userFeed` websocket event's `tokens.item`: what changed, named by
 * `kind` + `subjectKey`, the same for everyone it is sent to.
 */
export interface UserFeedChange {
  change: 'placed' | 'state' | 'removed' | 'cleared';
  category: UserFeedCategory;
  kind?: FeedEventKind | UserFeedActionKind;
  subjectKey?: string;
  /** In place of `subjectKey` when several items of one kind changed state at once. */
  subjectKeys?: string[];
  state?: UserFeedState;
  feedEventId?: ObjectId;
  projectId?: ObjectId | null;
  visibility?: FeedVisibility;
  /** Epoch ms, for `placed`. */
  lastActivityAt?: number;
  /** Epoch ms, for `cleared`: every open action item at or before it was dismissed. */
  before?: number;
}

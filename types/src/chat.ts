import type { ObjectId } from './common';
import type { Asset } from './asset';
import type { Folder } from './folder';
import type { PublicUser } from './user';
import type { Project } from './project';
import type { Workspace } from './workspace';

// Forward declaration for ChatMessage due to circular dependency/usage
// interface ChatMessage extends BaseChatMessage {}

/**
 * Represents a reaction to a chat message.
 */
export interface Reaction {
  /**
   * The ID of the user who reacted.
   * @format objectId
   */
  user: ObjectId | PublicUser;
  /**
   * The emoji used for the reaction.
   */
  emoji: string;
}

/**
 * Represents a quoted message with navigation info for deep-linking.
 */
export interface QuotedMessage {
  /**
   * The ID of the quoted message.
   * @format objectId
   */
  id: ObjectId;
  /**
   * The content of the quoted message.
   */
  content?: string;
  /**
   * The ID of the author of the quoted message.
   * @format objectId
   */
  authorId: ObjectId;
  /**
   * The author of the quoted message (populated).
   */
  author?: PublicUser;
  /**
   * The ID of the chat the quoted message belongs to.
   * @format objectId
   */
  chatId: ObjectId;
  /**
   * The type of chat the quoted message belongs to.
   */
  chatType: 'topic' | 'member' | 'submission';
  /**
   * Navigation info for deep-linking to the quoted message.
   */
  chat?: {
    id: ObjectId;
    topicId?: ObjectId;
    topicType?: 'project' | 'asset' | 'task';
    visibility?: 'creator' | 'reviewer';
    projectId?: ObjectId;
    scopeId?: ObjectId;
    scopeType?: 'project' | 'workspace';
  };
  /**
   * The timestamp when the quoted message was created.
   * @format int64
   */
  createdAt?: number;
  /**
   * The status of the quoted message.
   */
  status?: 'active' | 'inactive';
}

/**
 * Represents a link preview (URL unfurling) extracted from message content.
 */
export interface LinkPreview {
  /** The original URL */
  url: string;
  /** Page title from og:title or <title> tag */
  title?: string | null;
  /** Page description from og:description or meta description */
  description?: string | null;
  /** Image URL from og:image */
  image?: string | null;
  /** Site name from og:site_name */
  siteName?: string | null;
  /** Favicon URL */
  favicon?: string | null;
  /** HMAC signature for anti-spoofing verification (transient, not persisted) */
  signature?: string;
}

/**
 * Base interface for ChatMessage, used to handle potential recursive structures.
 */
interface BaseChatMessage {
  /**
   * @format objectId
   */
  id?: ObjectId;
  /**
   * Whether the message comes from a user or the system.
   */
  type?: 'user' | 'system';
  /**
   * Type of Resource data points to.
   */
  dataType?: 'notification'; // Assuming only notification type for now
  /**
   * If the message is a system message this will usually be populated with an object of 'dataType'.
   * If it is an object ID it is that data type but unpopulated.
   */
  data?: Record<string, any> | ObjectId; // Define more strictly if possible
  /**
   * The ID of the chat the message belongs to.
   * @format objectId
   */
  chatId: ObjectId;
  /**
   * The ID of the user who authored the message.
   * @format objectId
   */
  authorId: ObjectId;
  /**
   * The author of the message.
   */
  author?: ObjectId | PublicUser;
  /**
   * If this message is a reply to another this is the ID of the message it is a reply to.
   * @format objectId
   * @default null
   */
  replyToId?: ObjectId | null;
  /**
   * The message that this message is a reply to.
   */
  replyTo?: ChatMessage | null | ObjectId;
  /**
   * The content of the chat message.
   * @maxLength 10000
   */
  content: string;
  /**
   * Array of user IDs mentioned in the message using {{mention:userId}} tokens.
   */
  mentions?: (ObjectId | PublicUser)[];
  /**
   * Array of asset IDs mentioned in the message using {{assetMention:assetId}} tokens.
   * In responses, these are populated with full Asset objects.
   */
  assetMentions?: (ObjectId | Asset)[];
  /**
   * Array of folder IDs mentioned in the message using {{folderMention:folderId}} tokens.
   * In responses, these are populated with full Folder objects.
   */
  folderMentions?: (ObjectId | Folder)[];
  /**
   * Array of quoted message IDs using {{quote:messageId}} tokens.
   * In responses, these are populated with QuotedMessage objects.
   */
  quotes?: (ObjectId | QuotedMessage)[];
  /**
   * Array of Assets attached to the message.
   */
  attachments?: (ObjectId | Asset)[];
  /**
   * Array of link previews extracted from the message content.
   */
  linkPreviews?: LinkPreview[];
  /**
   * Array of reactions to the message.
   */
  reactions?: Reaction[];
  /**
   * When a messages is edited a version of the original is stored here as a revision.
   */
  revisions?: ChatMessage[]; // Recursive reference
  /**
   * Additional metadata for the chat message.
   */
  meta?: Record<string, any>;
  /**
   * The status of the chat message.
   */
  status?: 'active' | 'inactive';
  /**
   * Total number of replies attached to message.
   */
  totalReplies?: number;
  /**
   * Array of IDs of Chat-Messages or the actual chats Chat-Message depending on request options.
   */
  recentReplies?: (ObjectId | ChatMessage)[]; // Recursive reference
  /**
   * An annotation associated with the message.
   * The specific structure (DotValidation, FrameCommentValidation) is not defined in the schema.
   */
  annotations?: unknown; // Use 'unknown' or a more specific type if defined elsewhere
  /**
   * The date and time the message was created.
   * @format int64
   */
  createdAt?: number;
  /**
   * The date and time the message was last updated.
   * @format int64
   */
  updatedAt?: number;
  /**
   * Whether the message is highlighted, and by whom and when. `highlightedAt`
   * is what the highlights drawer's "new" markers compare against.
   */
  highlighted?: boolean;
  highlightedById?: ObjectId | null;
  /** @format int64 */
  highlightedAt?: number | null;
  /**
   * AI authoring role. Null on plain user messages; set when Nu wrote the
   * row. See packages/types/src/chat-ai.ts for the surrounding topic shape.
   */
  aiRole?: 'assistant' | 'tool' | null;
  /** Provider model identifier (e.g. 'anthropic/claude-sonnet-4-6'). */
  aiModel?: string | null;
  aiTokensIn?: number | null;
  aiTokensOut?: number | null;
  /**
   * Tool-call trace for an assistant turn, in call order. Each entry pairs
   * with the matching `aiToolResults[i]` entry by `id`.
   */
  aiToolCalls?: Array<{ id: string; name: string; args: Record<string, unknown> }> | null;
  aiToolResults?: Array<{ id: string; name: string; ok: boolean; result: unknown }> | null;
  /** FK to the AiUsageEvent created for billing this turn. */
  aiUsageEventId?: ObjectId | null;
}

/**
 * Represents a chat message within a chat.
 */
export interface ChatMessage extends BaseChatMessage {}

/**
 * Represents a chat conversation.
 */
export interface Chat {
  /**
   * The ID of the topic the chat is attached to.
   * @format objectId
   */
  topicId: ObjectId;
  /**
   * The type of resource the chat is about.
   */
  topicType: 'project' | 'asset' | 'user' | 'public' | 'task';
  /**
   * The type of reply the chat is about.
   */
  replyType: 'thread' | 'quote';
  /**
   * The subject of the chat, such as an asset's file name.
   */
  subject?: string;
  /**
   * Controls which type of members can access the chat.
   */
  visibility: 'creator' | 'reviewer' | 'members' | 'public';
  /**
   * Users who have participated in the chat.
   * @format objectId
   */
  participants?: ObjectId[] | PublicUser[];
  /**
   * Users who are following the chat to receive updates.
   * @format objectId
   */
  following?: ObjectId[] | PublicUser[];
  /**
   * Total number of messages in chat.
   */
  totalMessages?: number;
  /**
   * Array of IDs of messages of the most recent chats or the actual chats depending on request options.
   */
  recentMessages?: (ObjectId | ChatMessage)[];
  /**
   * The status of the chat.
   */
  status?: 'active' | 'inactive' | 'pendingDelete';
  /**
   * Timestamp of query. Used to generate future paginated requests.
   * @format int64
   */
  createdBefore?: number;
  /**
  * Unique identifier for the chat itself (if applicable, not explicitly in schema but often present)
  * @format objectId
  */
  id?: ObjectId; // Added based on common patterns
  /**
   * The timestamp when the chat was created.
   * @format int64
   */
  createdAt?: number;
  /**
   * The timestamp when the chat was last updated.
   * @format int64
   */
  updatedAt?: number;
  /**
   * Reference to active conversation/convo in this chat
   * @format objectId
   */
  activeConvo?: ObjectId | Record<string, unknown>;
  /**
   * Reference to the public file system this chat belongs to.
   * Only present when visibility is 'public' and topicType is 'asset'.
   * @format objectId
   */
  publicId?: ObjectId;
}

/**
 * One entry in the workspace-level "Project Chat" list: a project topic chat
 * (creator or reviewer) the caller can access, paired with a summary of the
 * project it belongs to. Returned by `GET /v1/workspaces/:workspaceId/project-chats`.
 */
export interface WorkspaceProjectChat {
  /**
   * Summary of the project the chat belongs to.
   * @format objectId
   */
  project: {
    id: ObjectId;
    name: string;
    logo?: unknown;
    color?: string;
  };
  /**
   * Which side of the project the chat is visible to.
   */
  visibility: 'creator' | 'reviewer';
  /**
   * The topic chat with its most recent message populated.
   */
  chat: Chat;
}

/**
 * Represents a chat specifically for a submission.
 */
export interface ChatSubmission {
  /**
   * @default submission
   */
  chatType: 'submission';
  /**
   * The type of reply the chat is about.
   */
  replyType: 'thread' | 'quote';
  /**
   * The ID of the project the chat is about
   * @format objectId
   */
  projectId: ObjectId;
  /**
   * Project ID or populated project data.
   */
  project?: ObjectId | Project;
  /**
   * The ID of the user who published the submission.
   * @format objectId
   */
  publisherId: ObjectId;
  /**
   * User ID or populated public user data.
   */
  publisher?: ObjectId | PublicUser;
  /**
   * The subject of the chat, such as an asset's file name.
   */
  subject?: string;
  /**
   * Description of the submission.
   */
  description?: string;
  /**
   * Version of the submission.
   */
  version?: string;
  /**
   * Inventory object containing submission data.
   */
  inventory?: Record<string, any>;
  /**
   * Users who have participated in the chat.
   * @format objectId
   */
  participants?: ObjectId[] | PublicUser[];
  /**
   * Users who are following the chat to receive updates.
   * @format objectId
   */
  following?: ObjectId[] | PublicUser[];
  /**
   * Array of annotations.
   */
  annotations?: Record<string, any>[]; // Define more strictly if possible
  /**
   * Total number of messages in chat.
   */
  totalMessages?: number;
  /**
   * Timestamp of the last message.
   * @format date-time
   */
  lastMessageAt?: Date;
  /**
   * Array of IDs of messages of the most recent chats or the actual chats depending on request options.
   */
  recentMessages?: (ObjectId | ChatMessage)[];
  /**
   * Array of tag IDs associated with the submission.
   * @format objectId
   */
  tags?: ObjectId[];
  /**
   * The status of the chat. `unreleased` is a staged submission — prepared but
   * not yet released to reviewers (see the submission release endpoint).
   */
  status?: 'active' | 'inactive' | 'pendingDelete' | 'unreleased';
  /**
   * Timestamp of creation
   * @format int64
   */
  createdAt?: number;
  /**
   * Timestamp of last update
   * @format int64
   */
  updatedAt?: number;
  /**
  * Unique identifier for the chat submission itself (if applicable)
  * @format objectId
  */
  id?: ObjectId; // Added based on common patterns
}

/**
 * Represents member information related to a chat.
 */
export interface ChatMember {
  /**
   * @default member
   */
  chatType: 'member';
  /**
   * The ID of the scope the chat is about.
   * @format objectId
   */
  scopeId: ObjectId;
  /**
   * Scope of chat. Determines who can be invited to the chat.
   */
  scopeType: 'project' | 'workspace' | 'social';
  /**
   * Populated scope data (project or workspace) based on scopeType.
   * Includes logo asset when populated.
   */
  scope?: Project | Workspace;
  /**
   * The type of reply the chat is about.
   */
  replyType: 'thread' | 'quote';
  /**
   * The ID of the user who created the chat.
   * @format objectId
   */
  creatorId: ObjectId;
  /**
   * The subject of the chat, such as an asset's file name.
   */
  subject?: string;
  /**
   * Members are everyone who can currently participate in the chat.
   * @format objectId
   */
  members?: ObjectId[] | PublicUser[];
  /**
   * Users who have participated in the chat.
   * @format objectId
   */
  participants?: ObjectId[] | PublicUser[];
  /**
   * Users who are following the chat to receive updates.
   * @format objectId
   */
  following?: ObjectId[] | PublicUser[];
  /**
   * Total number of messages in chat.
   */
  totalMessages?: number;
  /**
   * Array of IDs of messages of the most recent chats or the actual chats depending on request options.
   */
  recentMessages?: (ObjectId | ChatMessage)[];
  /**
   * Chat icon/logo asset reference.
   * @format objectId
   */
  icon?: ObjectId | Asset;
  /**
   * The status of the chat.
   */
  status?: 'active' | 'inactive' | 'pendingDelete';
  /**
   * Timestamp of query. Used to generate future paginated requests.
   * @format int64
   */
  createdBefore?: number;
  /**
   * Unique identifier for the chat member record itself.
   * @format objectId
   */
  id?: ObjectId;
  /**
   * The timestamp when the chat member object was created.
   * @format int64
   */
  createdAt?: number;
  /**
   * The timestamp when the chat member object was last updated.
   * @format int64
   */
  updatedAt?: number;
} 
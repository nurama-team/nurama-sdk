// Defines the structure for configuration limits related to chat functionalities.
interface ChatLimits {
  /** Maximum character length for chat subjects. */
  maxSubjectCharacterLength: number;
  /** Maximum character length for chat message content. */
  maxContentCharacterLength: number;
  /** Number of recent messages to retrieve for a chat. */
  numberOfRecentMessages: number;
  /** Number of recent replies to retrieve for a message. */
  numberOfRecentReplies: number;
  /** Maximum number of messages to return in a single query. */
  maxMessageResults: number;
  /** Maximum number of replies to return in a single query. */
  maxReplyResults: number;
  /** Maximum number of member chats a user can participate in. */
  maxMemberChats: number;
  /** Maximum number of recent messages to retrieve for member chats. */
  maxMemberChatRecentMessages: number;
}

// Defines the structure for configuration limits related to chat messages.
interface ChatMessageLimits {
  /** Maximum number of attachments allowed per chat message. */
  maxNumberOfAttachments: number;
  /** Maximum number of annotations allowed per chat message. */
  maxNumberOfAnnotations: number;
  /** Maximum number of user mentions allowed per chat message. */
  maxNumberOfMentions: number;
}

// Defines the structure for configuration limits related to assets.
interface AssetLimits {
  /** Maximum character length for asset names. */
  maxNameLength: number;
  /** Maximum number of assets that can be downloaded in a single request. */
  maxDownloadResults: number;
  /** Maximum number of assets that can be repaired in a single request. */
  maxRepairResults: number;
  /** Maximum number of assets that can be published in a single request. */
  maxPublishResults: number;
}

// Defines the structure for configuration limits related to memberships.
interface MembershipLimits {
  /** Maximum number of membership records allowed. */
  maxMembershipRecords: number;
}

// Defines the structure for configuration limits related to projects.
interface ProjectLimits {
  /** Maximum number of projects a user can create or be a member of. */
  maxProjects: number;
  /** Maximum character length for project names. */
  maxNameLength: number;
  /** Maximum character length for project descriptions. */
  maxDescriptionLength: number;
  /** Maximum number of results to return in the project feed. */
  maxFeedResults: number;
}

// Defines the structure for configuration limits related to workspaces.
interface WorkspaceLimits {
  /** Maximum number of workspaces a user can be associated with. */
  maxWorkspacesPerUser: number;
  /** Maximum character length for workspace names. */
  maxNameLength: number;
  /** Maximum character length for workspace descriptions. */
  maxDescriptionLength: number;
}

// Defines the structure for configuration limits related to folders.
interface FolderLimits {
  /** Maximum character length for folder names. */
  maxNameLength: number;
  /** Maximum character length for folder descriptions. */
  maxDescriptionLength: number;
  /** The maximum number of folders a user can have. */
  maxFolders: number;
}

// Defines the structure for configuration limits related to users.
interface UserLimits {
  /** Minimum required length for user passwords. */
  minPasswordLength: number;
  /** Minimum required length for usernames. */
  minUserNameLength: number;
  /** Maximum allowed length for usernames. */
  maxUserNameLength: number;
  /** Maximum allowed length for user first names. */
  maxFirstNameLength: number;
  /** Maximum allowed length for user middle names. */
  maxMiddleNameLength: number;
  /** Maximum allowed length for user last names. */
  maxLastNameLength: number;
  /** Maximum allowed length for company names. */
  maxCompanyNameLength: number;
  /** Maximum allowed length for display names. */
  maxDisplayNameLength: number;
}

// Defines the structure for configuration limits related to notifications.
interface NotificationLimits {
  /** Maximum number of notifications to return in a single query. */
  maxNotificationResults: number;
  /** Maximum number of channels to retrieve notification results for. */
  maxNumberOfChannels: number;
}

// Defines the structure for configuration limits related to tasks.
interface TaskLimits {
  /** Maximum number of tasks to return in a single query. */
  maxTaskResults: number;
}

// Defines the structure for configuration limits related to subscriptions.
interface SubscriptionLimits {
  /** Maximum number of starter packages allowed per subscription. */
  maxStarterPackages: number;
}

// Defines the structure for configuration limits related to summaries.
interface SummaryLimits {
  /** Maximum number of summaries to return in a single query. */
  maxSummaryResults: number;
}

// Defines the structure for various resource limits within the application configuration.
interface Limits {
  chat: ChatLimits;
  chatMessage: ChatMessageLimits;
  asset: AssetLimits;
  membership: MembershipLimits;
  project: ProjectLimits;
  workspace: WorkspaceLimits;
  folder: FolderLimits;
  user: UserLimits;
  notification: NotificationLimits;
  task: TaskLimits;
  subscription: SubscriptionLimits;
  summary: SummaryLimits;
  /** The maximum number of assets a user can have. */
  maxAssets: number;
}

// Defines the structure for color configurations.
interface Colors {
  /** An array of approved color strings. */
  approvedColors: string[];
}

// Defines the overall configuration structure for the application.
export interface Config {
  limits: Limits;
  colors: Colors;
} 
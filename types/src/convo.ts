/**
 * Convo (Video/Audio Chat) Types
 */

export type ConvoType = 'video' | 'audio';
export type ConvoStatus = 'active' | 'completed' | 'cancelled';
export type ChatType = 'topic' | 'member' | 'submission';

/** Lifecycle of a bundled artifact's transfer out of Daily. */
export type ConvoArtifactStatus = 'pending' | 'stored' | 'failed';

export interface ConvoRecording {
  /** Daily's own id for the recording. Entries are keyed by it. */
  dailyId: string;
  /** Key in the private bucket. `pending` entries have one before bytes exist. */
  keyPath?: string;
  status: ConvoArtifactStatus;
  sizeBytes?: number;
  durationSeconds?: number;
  /** Populated only once the recording has been promoted to an Asset. */
  assetId?: string | null;
  asset?: string; // Populated asset reference
  /** Why the transfer failed; set only when `status` is 'failed'. */
  error?: string | null;
  /**
   * When Daily's own copy was deleted, after ours was verified present.
   *
   * Daily bills recording storage monthly while it holds the file, but the
   * customer is charged once — so the copy there is released rather than left
   * to accrue. Unset means it was never released, which a sweep can retry.
   */
  dailyDeletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConvoTranscript {
  /** Daily's own id for the transcript. Entries are keyed by it. */
  dailyId: string;
  keyPath?: string;
  status: ConvoArtifactStatus;
  format: 'vtt' | 'json' | 'txt';
  sizeBytes?: number;
  /**
   * Populated only once promoted. Note the promoted asset is a .txt rendered
   * from the transcript text, not this entry's .vtt — .vtt is not a supported
   * document type, and the raw file stays bundled for cue timing.
   */
  assetId?: string | null;
  asset?: string; // Populated asset reference
  error?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Convo {
  id: string;

  // Core identification
  convoType: ConvoType;
  status: ConvoStatus;

  // Optional metadata
  subject?: string;
  notes?: string;

  // Parent message relationship
  messageId: string;
  message?: string; // Populated message reference

  // Parent chat relationship
  chatId: string;
  chat?: string; // Populated chat reference
  chatType: ChatType;

  // Daily.co integration
  dailyRoomName: string;
  dailyRoomUrl: string;
  dailyRoomConfig?: Record<string, any>;

  /**
   * Whether this convo was actually created with recording / transcription on.
   *
   * These are the EFFECTIVE values, not what was requested: a request is
   * clamped by the deployment ceiling, so asking for recording on a deployment
   * that has it switched off yields `false` here. Read them back rather than
   * assuming the request succeeded.
   */
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;

  /**
   * Plain text lifted from the transcript cues, kept alongside the stored .vtt
   * so the convo's chat message is searchable and the assistant can read it
   * without parsing WebVTT. Absent until a transcript is ingested.
   */
  transcriptText?: string | null;

  // Participants tracking
  startedById: string;
  startedBy?: string; // Populated user reference
  activeParticipants: string[];
  allParticipants: string[];

  // Timing
  startedAt: Date;
  endedAt?: Date;
  durationMinutes?: number;

  // Recordings & Transcripts
  recordings: ConvoRecording[];
  transcripts: ConvoTranscript[];

  // Scope fields
  scopeId?: string;
  scopeType?: 'project';
  scopeVisibility?: ('creator' | 'reviewer')[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response types for API

export interface StartConvoRequest {
  chatId: string;
  chatType: ChatType;
  convoType: ConvoType;
  sendEmailNotification?: boolean;
  subject?: string;
  notes?: string;
  /**
   * Opt in to recording / transcription for this convo. Both bill per minute,
   * so both default to off. Each is a request rather than a guarantee — the
   * deployment can refuse it; check the returned convo for what was granted.
   */
  recordingEnabled?: boolean;
  transcriptionEnabled?: boolean;
}

export interface StartConvoResponse {
  convo: Convo;
}

export interface UpdateConvoRequest {
  subject?: string;
  notes?: string;
}

export interface UpdateConvoResponse {
  convo: Convo;
}

export interface GetConvoResponse {
  convo: Convo;
}

export interface JoinConvoResponse {
  convo: Convo;
  token: string; // Daily.co meeting token
}

export interface LeaveConvoResponse {
  convo: Convo;
}

export interface CompleteConvoResponse {
  convo: Convo;
}

export interface DeleteConvoResponse {
  message: string;
}

export interface GetScopeConvosResponse {
  results: Convo[];
  nextCursor?: string | null;
  prevCursor?: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalResults?: number;
  totalPreviousResults?: number;
  totalNextResults?: number;
}

export interface PromoteConvoArtifactRequest {
  /** Optional display name for the resulting asset. */
  fileName?: string;
}

export interface PromoteConvoArtifactResponse {
  asset: unknown;
  /**
   * True when the artifact had already been promoted. Promotion is additive and
   * idempotent — a second call returns the first call's asset rather than
   * making another copy of the same bytes.
   */
  alreadyPromoted: boolean;
}

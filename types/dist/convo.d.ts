import { File } from './asset';
import { PublicUser } from './user';
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
    asset?: string;
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
    asset?: string;
    error?: string | null;
    createdAt?: string;
    updatedAt?: string;
}
/** A board task Nu proposed from a convo's transcript. */
/**
 * A person or asset a convo's transcript talks about. Nu suggests them as the
 * convo is summarised, and an admin who was on the call can add more; nobody
 * is mentioned until the pending ones are sent. A `sent` one is a mention on
 * the convo's own chat message, and can be taken back.
 */
export interface ConvoMention {
    id: string;
    kind: 'user' | 'asset';
    /** The user's or asset's id. */
    targetId: string;
    /** Why it came up in the call. May be empty. */
    reason: string;
    /** Suggested by Nu, or added by hand. */
    source: 'nu' | 'manual';
    status: 'pending' | 'sent';
    sentAt: number | null;
    /** Present on a `user` mention. */
    user?: PublicUser | null;
    /** Present on an `asset` mention. */
    asset?: {
        id: string;
        name: string;
        mediaType?: string;
    } | null;
}
export interface ConvoMentionsResponse {
    mentions: ConvoMention[];
    /** When Nu read the transcript for mentions; null when it has not. */
    suggestedMentionsGeneratedAt: number | null;
}
export interface UpdateConvoMentionsRequest {
    /** The pending list as it should now stand. Leaving one out removes it. */
    mentions: {
        kind: 'user' | 'asset';
        targetId: string;
        reason?: string;
    }[];
}
export interface SendConvoMentionsResponse extends ConvoMentionsResponse {
    /** The convo's own chat message, which now carries the mentions. */
    message: unknown;
}
/** A task made from a convo, as a chat draws it on a card. */
export interface ConvoTask {
    id: string;
    subject: string;
    description?: string | null;
    status?: string;
    taskNumber?: number | null;
    projectId?: string;
    boardId?: string;
    boardName?: string;
    columnId?: string | null;
    columnName?: string;
    columnColor?: string | null;
    assignedTo?: {
        id: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
    };
    tags?: {
        id: string;
        name: string;
        color: string;
    }[];
}
export interface ConvoTasksResponse {
    /** Oldest first. */
    tasks: ConvoTask[];
}
export interface ConvoSuggestedTask {
    subject: string;
    description: string;
    /** The project member the transcript says the task is for, when it names one unambiguously. */
    assignedToId?: string;
    /** The board this kind of work belongs on, judged from the project's boards. */
    boardId?: string;
    /** A column on that board, when one clearly fits. */
    columnId?: string;
}
export interface Convo {
    id: string;
    convoType: ConvoType;
    status: ConvoStatus;
    subject?: string;
    notes?: string;
    messageId: string;
    message?: string;
    chatId: string;
    chat?: string;
    chatType: ChatType;
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
    /**
     * Nu's summary of the transcript, once one has been made — on request, or on
     * its own when the transcript arrived. Kept so it is made and billed once.
     */
    summary?: string | null;
    summaryGeneratedAt?: string | number | null;
    /** Board tasks Nu proposed from the transcript. Proposals only. */
    suggestedTasks?: ConvoSuggestedTask[] | null;
    suggestedTasksGeneratedAt?: string | number | null;
    /** The name each person joined the call under, mapped to their user id. */
    speakers?: Record<string, string>;
    startedById: string;
    startedBy?: string;
    activeParticipants: string[];
    allParticipants: string[];
    startedAt: Date;
    endedAt?: Date;
    durationMinutes?: number;
    recordings: ConvoRecording[];
    transcripts: ConvoTranscript[];
    scopeId?: string;
    scopeType?: 'project';
    scopeVisibility?: ('creator' | 'reviewer')[];
    createdAt: Date;
    updatedAt: Date;
}
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
/**
 * `POST /v1/convos` answers with the convo itself (not wrapped in `convo`)
 * plus the starter's Daily meeting token.
 */
export type StartConvoResponse = Convo & {
    meetingToken: string;
};
export interface UpdateConvoRequest {
    subject?: string;
    notes?: string;
}
export interface UpdateConvoSummaryResponse {
    /** The summary as kept (Markdown); null when it was removed. */
    summary: string | null;
    summaryGeneratedAt: number | null;
}
export interface UpdateConvoResponse {
    convo: Convo;
}
export interface GetConvoResponse {
    convo: Convo;
}
export interface JoinConvoResponse {
    convo: Convo;
    token: string;
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
/** Where a convo is, as a list spanning several projects shows it. */
export interface ConvoPlace {
    id: string;
    workspaceId?: string;
    name: string;
    slug: string | null;
    color: string | null;
    logo: {
        id: string;
        files: File[];
    } | null;
}
/**
 * A convo in the caller's cross-project list: running now, or ended within the
 * last hour. `project` and `workspace` are null where the convo has none — a
 * direct message, for one.
 */
export type MyConvo = Convo & {
    project: ConvoPlace | null;
    workspace: ConvoPlace | null;
};
export interface GetMyConvosResponse {
    results: MyConvo[];
}
/**
 * What is needed to play one of a convo's bundled artifacts.
 *
 * A recording carries a short-lived signed `url`; a transcript carries its
 * `content` inline, cue timings included.
 */
export interface ConvoArtifactPlaybackResponse {
    kind: 'recording' | 'transcript';
    dailyId: string;
    contentType: string;
    /** Recording only. Signed URL to the video, valid for `expiresIn` seconds. */
    url?: string;
    /** Recording only. Lifetime of `url` in seconds. */
    expiresIn?: number;
    /** Recording only. */
    durationSeconds?: number;
    /**
     * When the artifact began, in epoch seconds: a recording's first frame, a
     * transcript's first moment of listening. The two rarely match, so a
     * transcript's cue times are moved by `recording.startedAt - transcript.startedAt`
     * to line up with the video. Null when the provider did not say.
     */
    startedAt?: number | null;
    /** Transcript only. Format of `content`. */
    format?: 'vtt' | 'json' | 'txt';
    /** Transcript only. The stored transcript file as text. */
    content?: string;
    /**
     * Transcript only. The name each person joined the call under, mapped to
     * their user id — who each speaker label in `content` is. Empty for a convo
     * recorded before labels were kept.
     */
    speakers?: Record<string, string>;
    /** Transcript only. Everyone who was on the call, to draw each speaker from. */
    participants?: PublicUser[];
    /** Transcript only. The assistant's summary of it, once one has been made. */
    summary?: string | null;
}
export interface PromoteConvoArtifactRequest {
    /** Optional display name for the resulting asset. */
    fileName?: string;
    /**
     * The project whose assets to add it to, for a convo that is in no project
     * (a Team Chat). The caller must be able to add assets there. Ignored for a
     * project convo, which always goes to its own project.
     */
    projectId?: string;
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

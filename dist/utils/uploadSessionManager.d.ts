/**
 * Upload Session Manager for Nurama SDK
 *
 * Provides upload progress persistence and cross-tab synchronization
 * - Persists upload progress to localStorage with project isolation
 * - Syncs upload state across multiple browser tabs
 * - Automatic cleanup of completed/failed uploads
 */
export interface UploadSessionData {
    sessionId: string;
    projectId: string;
    uploadId: string;
    key: string;
    assetId?: string;
    progress: number;
    partNumber: number;
    totalParts: number;
    completedParts: number[];
    fileName: string;
    fileSize: number;
    timestamp: number;
    status: 'uploading' | 'completing' | 'completed' | 'failed' | 'cancelled';
    error?: string;
}
export interface CrossTabMessage {
    type: 'upload_progress_update' | 'upload_status_change' | 'upload_cleanup';
    projectId: string;
    sessionId: string;
    data?: Partial<UploadSessionData>;
}
export declare class UploadSessionManager {
    private static instance;
    private messageListeners;
    private readonly STORAGE_PREFIX;
    private readonly MESSAGE_CHANNEL;
    private broadcastChannel?;
    constructor();
    static getInstance(): UploadSessionManager;
    /**
     * Initialize cross-tab synchronization using BroadcastChannel
     */
    private initializeCrossTabSync;
    /**
     * Handle cross-tab messages
     */
    private handleCrossTabMessage;
    /**
     * Generate storage key for upload session
     */
    private getStorageKey;
    /**
     * Create a new upload session
     */
    createSession(projectId: string, sessionId: string, uploadData: {
        uploadId: string;
        key: string;
        fileName: string;
        fileSize: number;
        totalParts: number;
        assetId?: string;
    }): UploadSessionData;
    /**
     * Update upload progress for a session
     */
    updateProgress(projectId: string, sessionId: string, progress: {
        progress: number;
        partNumber: number;
        completedParts?: number[];
    }): void;
    /**
     * Update upload status
     */
    updateStatus(projectId: string, sessionId: string, status: UploadSessionData['status'], error?: string): void;
    /**
     * Get upload session data
     */
    getSession(projectId: string, sessionId: string): UploadSessionData | null;
    /**
     * Get all upload sessions for a project
     */
    getProjectSessions(projectId: string): UploadSessionData[];
    /**
     * Get every upload session across ALL projects (scans the whole localStorage
     * prefix, not a single project). Used by app-level guards that need a global
     * "is anything uploading right now" answer without knowing the project id.
     */
    getAllSessions(): UploadSessionData[];
    /**
     * True when at least one upload is genuinely in flight anywhere in the app.
     *
     * "In flight" = status `uploading`/`completing` AND updated within `staleMs`.
     * The freshness window matters: a tab that crashed mid-upload leaves an
     * `uploading` row in localStorage forever (it never reaches a terminal
     * status). Progress ticks bump `timestamp` on every part, so a real upload
     * stays fresh; a dead one goes stale and stops counting — otherwise a stale
     * row would block app refreshes/navigation indefinitely.
     *
     * @param staleMs How long since the last progress update still counts as
     *   active. Default 2 minutes — comfortably longer than a single part PUT on
     *   a slow connection, short enough that a crashed upload clears quickly.
     */
    hasActiveUploads(staleMs?: number): boolean;
    /**
     * Save session to localStorage
     */
    private saveSession;
    /**
     * Remove upload session
     */
    removeSession(projectId: string, sessionId: string): void;
    /**
     * Clean up old or completed sessions
     */
    cleanupSessions(projectId: string, olderThanMs?: number): void;
    /**
     * Register a listener for cross-tab messages
     */
    onMessage(listenerId: string, callback: (message: CrossTabMessage) => void): void;
    /**
     * Unregister a message listener
     */
    offMessage(listenerId: string): void;
    /**
     * Broadcast a message to other tabs
     */
    private broadcastMessage;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
export declare const uploadSessionManager: UploadSessionManager;
//# sourceMappingURL=uploadSessionManager.d.ts.map
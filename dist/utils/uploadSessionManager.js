/**
 * Upload Session Manager for Nurama SDK
 *
 * Provides upload progress persistence and cross-tab synchronization
 * - Persists upload progress to localStorage with project isolation
 * - Syncs upload state across multiple browser tabs
 * - Automatic cleanup of completed/failed uploads
 */
export class UploadSessionManager {
    constructor() {
        this.messageListeners = new Map();
        this.STORAGE_PREFIX = 'nurama_upload_session_';
        this.MESSAGE_CHANNEL = 'nurama_upload_sync';
        this.initializeCrossTabSync();
    }
    static getInstance() {
        if (!UploadSessionManager.instance) {
            UploadSessionManager.instance = new UploadSessionManager();
        }
        return UploadSessionManager.instance;
    }
    /**
     * Initialize cross-tab synchronization using BroadcastChannel
     */
    initializeCrossTabSync() {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            try {
                this.broadcastChannel = new BroadcastChannel(this.MESSAGE_CHANNEL);
                this.broadcastChannel.addEventListener('message', this.handleCrossTabMessage.bind(this));
            }
            catch (error) {
                console.warn('[UploadSessionManager] BroadcastChannel not available:', error);
            }
        }
    }
    /**
     * Handle cross-tab messages
     */
    handleCrossTabMessage(event) {
        const message = event.data;
        if (message && message.type && message.projectId && message.sessionId) {
            // Notify registered listeners
            this.messageListeners.forEach(listener => {
                try {
                    listener(message);
                }
                catch (error) {
                    console.error('[UploadSessionManager] Error in message listener:', error);
                }
            });
        }
    }
    /**
     * Generate storage key for upload session
     */
    getStorageKey(projectId, sessionId) {
        return `${this.STORAGE_PREFIX}${projectId}_${sessionId}`;
    }
    /**
     * Create a new upload session
     */
    createSession(projectId, sessionId, uploadData) {
        const session = {
            sessionId,
            projectId,
            uploadId: uploadData.uploadId,
            key: uploadData.key,
            assetId: uploadData.assetId,
            progress: 0,
            partNumber: 1,
            totalParts: uploadData.totalParts,
            completedParts: [],
            fileName: uploadData.fileName,
            fileSize: uploadData.fileSize,
            timestamp: Date.now(),
            status: 'uploading'
        };
        this.saveSession(session);
        this.broadcastMessage('upload_status_change', projectId, sessionId, session);
        return session;
    }
    /**
     * Update upload progress for a session
     */
    updateProgress(projectId, sessionId, progress) {
        const session = this.getSession(projectId, sessionId);
        if (!session) {
            console.warn(`[UploadSessionManager] Session not found: ${sessionId}`);
            return;
        }
        const updatedSession = {
            ...session,
            progress: progress.progress,
            partNumber: progress.partNumber,
            completedParts: progress.completedParts || session.completedParts,
            timestamp: Date.now()
        };
        this.saveSession(updatedSession);
        this.broadcastMessage('upload_progress_update', projectId, sessionId, {
            progress: progress.progress,
            partNumber: progress.partNumber,
            completedParts: progress.completedParts,
            timestamp: updatedSession.timestamp
        });
    }
    /**
     * Update upload status
     */
    updateStatus(projectId, sessionId, status, error) {
        const session = this.getSession(projectId, sessionId);
        if (!session) {
            console.warn(`[UploadSessionManager] Session not found: ${sessionId}`);
            return;
        }
        const updatedSession = {
            ...session,
            status,
            error,
            timestamp: Date.now()
        };
        this.saveSession(updatedSession);
        this.broadcastMessage('upload_status_change', projectId, sessionId, {
            status,
            error,
            timestamp: updatedSession.timestamp
        });
    }
    /**
     * Get upload session data
     */
    getSession(projectId, sessionId) {
        if (typeof window === 'undefined')
            return null;
        try {
            const key = this.getStorageKey(projectId, sessionId);
            const data = localStorage.getItem(key);
            if (data) {
                const session = JSON.parse(data);
                // Validate session data
                if (session.projectId === projectId && session.sessionId === sessionId) {
                    return session;
                }
            }
        }
        catch (error) {
            console.warn(`[UploadSessionManager] Failed to get session ${sessionId}:`, error);
        }
        return null;
    }
    /**
     * Get all upload sessions for a project
     */
    getProjectSessions(projectId) {
        if (typeof window === 'undefined')
            return [];
        const sessions = [];
        const prefix = `${this.STORAGE_PREFIX}${projectId}_`;
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        try {
                            const session = JSON.parse(data);
                            if (session.projectId === projectId) {
                                sessions.push(session);
                            }
                        }
                        catch (error) {
                            console.warn(`[UploadSessionManager] Invalid session data in ${key}:`, error);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.warn('[UploadSessionManager] Failed to get project sessions:', error);
        }
        // Sort by timestamp (most recent first)
        return sessions.sort((a, b) => b.timestamp - a.timestamp);
    }
    /**
     * Get every upload session across ALL projects (scans the whole localStorage
     * prefix, not a single project). Used by app-level guards that need a global
     * "is anything uploading right now" answer without knowing the project id.
     */
    getAllSessions() {
        if (typeof window === 'undefined')
            return [];
        const sessions = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.STORAGE_PREFIX)) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        try {
                            sessions.push(JSON.parse(data));
                        }
                        catch (error) {
                            console.warn(`[UploadSessionManager] Invalid session data in ${key}:`, error);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.warn('[UploadSessionManager] Failed to enumerate sessions:', error);
        }
        return sessions.sort((a, b) => b.timestamp - a.timestamp);
    }
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
    hasActiveUploads(staleMs = 2 * 60 * 1000) {
        const cutoff = Date.now() - staleMs;
        return this.getAllSessions().some((s) => (s.status === 'uploading' || s.status === 'completing') &&
            s.timestamp >= cutoff);
    }
    /**
     * Save session to localStorage
     */
    saveSession(session) {
        if (typeof window === 'undefined')
            return;
        try {
            const key = this.getStorageKey(session.projectId, session.sessionId);
            localStorage.setItem(key, JSON.stringify(session));
        }
        catch (error) {
            console.warn(`[UploadSessionManager] Failed to save session ${session.sessionId}:`, error);
        }
    }
    /**
     * Remove upload session
     */
    removeSession(projectId, sessionId) {
        if (typeof window === 'undefined')
            return;
        try {
            const key = this.getStorageKey(projectId, sessionId);
            localStorage.removeItem(key);
            this.broadcastMessage('upload_cleanup', projectId, sessionId);
        }
        catch (error) {
            console.warn(`[UploadSessionManager] Failed to remove session ${sessionId}:`, error);
        }
    }
    /**
     * Clean up old or completed sessions
     */
    cleanupSessions(projectId, olderThanMs = 24 * 60 * 60 * 1000) {
        const sessions = this.getProjectSessions(projectId);
        const cutoff = Date.now() - olderThanMs;
        sessions.forEach(session => {
            // Remove old sessions or completed/failed/cancelled sessions older than 1 hour
            const shouldRemove = session.timestamp < cutoff ||
                (['completed', 'failed', 'cancelled'].includes(session.status) &&
                    session.timestamp < (Date.now() - 60 * 60 * 1000));
            if (shouldRemove) {
                this.removeSession(projectId, session.sessionId);
            }
        });
    }
    /**
     * Register a listener for cross-tab messages
     */
    onMessage(listenerId, callback) {
        this.messageListeners.set(listenerId, callback);
    }
    /**
     * Unregister a message listener
     */
    offMessage(listenerId) {
        this.messageListeners.delete(listenerId);
    }
    /**
     * Broadcast a message to other tabs
     */
    broadcastMessage(type, projectId, sessionId, data) {
        if (this.broadcastChannel) {
            try {
                const message = {
                    type,
                    projectId,
                    sessionId,
                    data
                };
                this.broadcastChannel.postMessage(message);
            }
            catch (error) {
                console.warn('[UploadSessionManager] Failed to broadcast message:', error);
            }
        }
    }
    /**
     * Cleanup resources
     */
    destroy() {
        if (this.broadcastChannel) {
            this.broadcastChannel.close();
            this.broadcastChannel = undefined;
        }
        this.messageListeners.clear();
    }
}
// Export a singleton instance for convenience
export const uploadSessionManager = UploadSessionManager.getInstance();
//# sourceMappingURL=uploadSessionManager.js.map
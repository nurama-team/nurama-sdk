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
  uploadId: string;          // S3 multipart upload ID
  key: string;               // S3 object key
  assetId?: string;          // Backend asset ID (once available)
  
  // Progress tracking
  progress: number;          // Overall progress (0-100)
  partNumber: number;        // Current part being uploaded
  totalParts: number;        // Total number of parts
  completedParts: number[];  // Array of completed part numbers
  
  // Metadata
  fileName: string;
  fileSize: number;
  timestamp: number;         // Last update timestamp
  status: 'uploading' | 'completing' | 'completed' | 'failed' | 'cancelled';
  
  // Optional error information
  error?: string;
}

export interface CrossTabMessage {
  type: 'upload_progress_update' | 'upload_status_change' | 'upload_cleanup';
  projectId: string;
  sessionId: string;
  data?: Partial<UploadSessionData>;
}

export class UploadSessionManager {
  private static instance: UploadSessionManager;
  private messageListeners: Map<string, (message: CrossTabMessage) => void> = new Map();
  private readonly STORAGE_PREFIX = 'nurama_upload_session_';
  private readonly MESSAGE_CHANNEL = 'nurama_upload_sync';
  private broadcastChannel?: BroadcastChannel;

  constructor() {
    this.initializeCrossTabSync();
  }

  public static getInstance(): UploadSessionManager {
    if (!UploadSessionManager.instance) {
      UploadSessionManager.instance = new UploadSessionManager();
    }
    return UploadSessionManager.instance;
  }

  /**
   * Initialize cross-tab synchronization using BroadcastChannel
   */
  private initializeCrossTabSync(): void {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(this.MESSAGE_CHANNEL);
        this.broadcastChannel.addEventListener('message', this.handleCrossTabMessage.bind(this));
      } catch (error) {
        console.warn('[UploadSessionManager] BroadcastChannel not available:', error);
      }
    }
  }

  /**
   * Handle cross-tab messages
   */
  private handleCrossTabMessage(event: MessageEvent<CrossTabMessage>): void {
    const message = event.data;
    if (message && message.type && message.projectId && message.sessionId) {
      // Notify registered listeners
      this.messageListeners.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          console.error('[UploadSessionManager] Error in message listener:', error);
        }
      });
    }
  }

  /**
   * Generate storage key for upload session
   */
  private getStorageKey(projectId: string, sessionId: string): string {
    return `${this.STORAGE_PREFIX}${projectId}_${sessionId}`;
  }

  /**
   * Create a new upload session
   */
  public createSession(
    projectId: string, 
    sessionId: string, 
    uploadData: {
      uploadId: string;
      key: string;
      fileName: string;
      fileSize: number;
      totalParts: number;
      assetId?: string;
    }
  ): UploadSessionData {
    const session: UploadSessionData = {
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
  public updateProgress(
    projectId: string, 
    sessionId: string, 
    progress: {
      progress: number;
      partNumber: number;
      completedParts?: number[];
    }
  ): void {
    const session = this.getSession(projectId, sessionId);
    if (!session) {
      console.warn(`[UploadSessionManager] Session not found: ${sessionId}`);
      return;
    }

    const updatedSession: UploadSessionData = {
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
  public updateStatus(
    projectId: string, 
    sessionId: string, 
    status: UploadSessionData['status'],
    error?: string
  ): void {
    const session = this.getSession(projectId, sessionId);
    if (!session) {
      console.warn(`[UploadSessionManager] Session not found: ${sessionId}`);
      return;
    }

    const updatedSession: UploadSessionData = {
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
  public getSession(projectId: string, sessionId: string): UploadSessionData | null {
    if (typeof window === 'undefined') return null;

    try {
      const key = this.getStorageKey(projectId, sessionId);
      const data = localStorage.getItem(key);
      if (data) {
        const session = JSON.parse(data) as UploadSessionData;
        // Validate session data
        if (session.projectId === projectId && session.sessionId === sessionId) {
          return session;
        }
      }
    } catch (error) {
      console.warn(`[UploadSessionManager] Failed to get session ${sessionId}:`, error);
    }

    return null;
  }

  /**
   * Get all upload sessions for a project
   */
  public getProjectSessions(projectId: string): UploadSessionData[] {
    if (typeof window === 'undefined') return [];

    const sessions: UploadSessionData[] = [];
    const prefix = `${this.STORAGE_PREFIX}${projectId}_`;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const session = JSON.parse(data) as UploadSessionData;
              if (session.projectId === projectId) {
                sessions.push(session);
              }
            } catch (error) {
              console.warn(`[UploadSessionManager] Invalid session data in ${key}:`, error);
            }
          }
        }
      }
    } catch (error) {
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
  public getAllSessions(): UploadSessionData[] {
    if (typeof window === 'undefined') return [];

    const sessions: UploadSessionData[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              sessions.push(JSON.parse(data) as UploadSessionData);
            } catch (error) {
              console.warn(`[UploadSessionManager] Invalid session data in ${key}:`, error);
            }
          }
        }
      }
    } catch (error) {
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
  public hasActiveUploads(staleMs: number = 2 * 60 * 1000): boolean {
    const cutoff = Date.now() - staleMs;
    return this.getAllSessions().some(
      (s) =>
        (s.status === 'uploading' || s.status === 'completing') &&
        s.timestamp >= cutoff
    );
  }

  /**
   * Save session to localStorage
   */
  private saveSession(session: UploadSessionData): void {
    if (typeof window === 'undefined') return;

    try {
      const key = this.getStorageKey(session.projectId, session.sessionId);
      localStorage.setItem(key, JSON.stringify(session));
    } catch (error) {
      console.warn(`[UploadSessionManager] Failed to save session ${session.sessionId}:`, error);
    }
  }

  /**
   * Remove upload session
   */
  public removeSession(projectId: string, sessionId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const key = this.getStorageKey(projectId, sessionId);
      localStorage.removeItem(key);
      this.broadcastMessage('upload_cleanup', projectId, sessionId);
    } catch (error) {
      console.warn(`[UploadSessionManager] Failed to remove session ${sessionId}:`, error);
    }
  }

  /**
   * Clean up old or completed sessions
   */
  public cleanupSessions(projectId: string, olderThanMs: number = 24 * 60 * 60 * 1000): void {
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
  public onMessage(listenerId: string, callback: (message: CrossTabMessage) => void): void {
    this.messageListeners.set(listenerId, callback);
  }

  /**
   * Unregister a message listener
   */
  public offMessage(listenerId: string): void {
    this.messageListeners.delete(listenerId);
  }

  /**
   * Broadcast a message to other tabs
   */
  private broadcastMessage(
    type: CrossTabMessage['type'], 
    projectId: string, 
    sessionId: string, 
    data?: Partial<UploadSessionData>
  ): void {
    if (this.broadcastChannel) {
      try {
        const message: CrossTabMessage = {
          type,
          projectId,
          sessionId,
          data
        };
        this.broadcastChannel.postMessage(message);
      } catch (error) {
        console.warn('[UploadSessionManager] Failed to broadcast message:', error);
      }
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = undefined;
    }
    this.messageListeners.clear();
  }
}

// Export a singleton instance for convenience
export const uploadSessionManager = UploadSessionManager.getInstance();
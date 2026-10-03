import type { ObjectId } from './common';

/**
 * Per-project AI feature flags. Stored as JSON on `Project.settings`.
 *
 * Each value is tri-state:
 *   - `null` (or absent) — inherit from workspace.settings
 *   - `true` / `false` / typed value — project-level override
 *
 * Resolved server-side via `aiSettings.service.getEffectiveAiSettings`
 * during AI requests (workspace → project per-key merge).
 */
export interface ProjectSettings {
  allowAiFeatures?: boolean | null;
  aiPolishEnabled?: boolean | null;
  aiCustomPreprompt?: string | null;
}

/**
 * Represents a project within a workspace.
 */
export interface Project {
  /**
   * @format objectId
   */
  id: ObjectId;
  /**
   * Id of workspace project belongs to.
   * @format objectId
   */
  workspaceId: ObjectId;
  /**
   * @maxLength 100
   */
  name: string;
  slug?: string;
  status?: 'active' | 'inactive' | 'pendingDelete';
  /**
   * The timestamp when the project was created.
   * @format int64
   */
  createdAt?: number;
  /**
   * The timestamp when the project was last updated.
   * @format int64
   */
  updatedAt?: number;
  /**
   * Per-project setting overrides. Keys not set here inherit from
   * workspace.settings. See `ProjectSettings`.
   */
  settings?: ProjectSettings;
}
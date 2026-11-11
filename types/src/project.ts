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
  /**
   * Automatic pruning of originals. Null (or absent) leaves it off. Set per
   * project; there is no workspace-wide policy.
   */
  originalPruning?: OriginalPruningPolicy | null;
}

/**
 * A project's automatic pruning of originals: deleting the uploaded file once
 * post-processing has finished, keeping every processed version. Omitted
 * fields take their defaults.
 */
export interface OriginalPruningPolicy {
  enabled: boolean;
  /** Media types the policy prunes. Defaults to every prunable type but documents. */
  mediaTypes?: Array<'video' | 'audio' | 'image' | '3d' | 'document'>;
  /** Days after post-processing finishes before an asset is pruned (0–90, default 7). */
  graceDays?: number;
  /** Leave alone assets reviewers, public links or public collections can see (default true). */
  skipPublished?: boolean;
  /** Leave alone assets included in a submission (default true). */
  skipInSubmissions?: boolean;
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
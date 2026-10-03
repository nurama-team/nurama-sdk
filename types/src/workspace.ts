import type { ObjectId } from './common';

/**
 * Represents a workspace.
 */
export interface Workspace {
  /**
   * @format objectId
   */
  id: ObjectId;
  /**
   * @maxLength 100
   */
  name: string;
  /**
   * @maxLength 350
   */
  description?: string;
  /**
   * URL to logo
   */
  logo?: string;
  /**
   * URL to icon
   */
  icon?: string;
  /**
   * color code.
   */
  color?: string;
  slug?: string;
  status?: 'active' | 'inactive' | 'locked' | 'pendingDelete';
  /**
   * The timestamp when the workspace was created.
   * @format int64
   */
  createdAt?: number;
  /**
   * The timestamp when the workspace was last updated.
   * @format int64
   */
  updatedAt?: number;
  /**
   * Effective capability tokens for the workspace's current subscription
   * (auto-granted ∪ enabled-and-available). Used by the FE to preempt UI
   * for gated surfaces (e.g. Public file systems) and surface upgrade
   * prompts without a failing round-trip. Source of truth for enforcement
   * is the BE `requireCapability` middleware. Only present on responses
   * from `getWorkspace`.
   */
  capabilities?: string[];
}

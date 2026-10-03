import type { ObjectId } from './common';
import type { Task } from './task';

/**
 * Represents a kanban board within a project.
 */
export interface Board {
  /** Unique identifier */
  id: ObjectId;
  /** Project this board belongs to */
  projectId: ObjectId;
  /** User who created the board */
  creatorId: ObjectId;
  /** Board name */
  name: string;
  /** Optional board description */
  description?: string;
  /** Visibility settings - who can see this board */
  visibility: ('creator' | 'reviewer')[];
  /** Board status */
  status: 'active' | 'archived';
  /** Sort order among boards in a project */
  sortOrder: number;
  /** Columns on this board */
  columns?: BoardColumn[];
  /** @format int64 */
  createdAt?: number;
  /** @format int64 */
  updatedAt?: number;
}

/**
 * Represents a column within a kanban board.
 */
export interface BoardColumn {
  /** Unique identifier */
  id: ObjectId;
  /** Board this column belongs to */
  boardId: ObjectId;
  /** Column name */
  name: string;
  /** Optional column description */
  description?: string | null;
  /** Sort order within the board */
  sortOrder: number;
  /** Column color (hex) */
  color?: string;
  /** Whether new tasks land in this column by default */
  isDefault: boolean;
  /** Optional task status to auto-set when a task is moved to this column */
  taskStatus?: 'pending' | 'inProgress' | 'complete' | null;
  /** Number of tasks in this column */
  taskCount?: number;
}

/**
 * Board with tasks grouped by column.
 */
export interface BoardWithTasks extends Board {
  columns: (BoardColumn & { tasks: Task[] })[];
}

/**
 * Represents a link between two related tasks.
 */
export interface TaskLink {
  /** Unique identifier */
  id: ObjectId;
  /** Source task ID */
  taskId: ObjectId;
  /** Linked task ID */
  linkedTaskId: ObjectId;
  /** Type of relationship */
  linkType: 'related' | 'blocks' | 'blockedBy' | 'duplicate';
  /** The linked task object (populated) */
  linkedTask?: Task;
  /** @format int64 */
  createdAt?: number;
}

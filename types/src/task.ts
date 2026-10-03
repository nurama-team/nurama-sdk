import type { ObjectId } from './common';
import type { PaginatedResult } from './pagination';
import type { TaskLink } from './board';
import type { PublicUser } from './user';

/**
 * Represents a task entity.
 */
export interface Task {
  /**
   * The unique identifier of the task
   * @format objectId
   */
  id: ObjectId;
  /**
   * The creators user ID.
   * @format objectId
   */
  creatorId?: ObjectId;
  /**
   * The ID of the project the task belongs to.
   * @format objectId
   */
  projectId?: ObjectId;
  /**
   * The ID of the resource where the task was created.
   * @format objectId
   */
  originId?: ObjectId;
  /**
   * The type of resource the task originated from.
   */
  originType?: string;
  /**
   * The ID of the resource the task is related to.
   * For example if the task was related to a particular asset this would be the asset ID.
   * @format objectId
   */
  relatedToId?: ObjectId;
  /**
   * The type of resource the task is related to.
   */
  relatedToType?: string;
  /**
   * Status of the task.
   */
  status?: string;
  /**
   * Short description of the task.
   */
  subject?: string;
  /**
   * Body of the task.
   */
  body?: string;
  /**
   * Rich description for board tasks.
   */
  description?: string;
  /**
   * Auto-incrementing task number per project (#1, #2, ...).
   */
  taskNumber?: number;
  /**
   * Board ID this task belongs to (null for legacy mention tasks).
   * @format objectId
   */
  boardId?: ObjectId;
  /**
   * Column ID on the board.
   * @format objectId
   */
  columnId?: ObjectId;
  /**
   * Sort order within a column.
   */
  sortOrder?: number;
  /**
   * User ID assigned to this task.
   * @format objectId
   */
  assignedToId?: ObjectId;
  /**
   * Populated assigned user object.
   */
  assignedTo?: PublicUser;
  /**
   * Linked tasks.
   */
  links?: TaskLink[];
  /**
   * The timestamp when the task was created.
   * @format int64
   */
  createdAt?: number;
  /**
   * The timestamp when the task was last updated.
   * @format int64
   */
  updatedAt?: number;
}

/**
 * Represents a paginated list of Task items.
 */
export type Tasks = PaginatedResult & {
  results?: Task[];
}; 
import NuramaClient from '../NuramaClient.js';
import {
  type Board,
  type BoardColumn,
  type BoardWithTasks,
  type Task,
} from '@nurama/types';

// --- Request Body Interfaces ---

export interface CreateBoardData {
  projectId: string;
  name: string;
  description?: string;
  visibility?: ('creator' | 'reviewer')[];
  columns?: {
    name: string;
    description?: string;
    color?: string;
    isDefault?: boolean;
    taskStatus?: 'pending' | 'inProgress' | 'complete' | 'closed' | null;
    sortOrder?: number;
  }[];
}

export interface UpdateBoardData {
  name?: string;
  description?: string | null;
  visibility?: ('creator' | 'reviewer')[];
  status?: 'active' | 'archived';
  sortOrder?: number;
  /**
   * When narrowing visibility, opt into automatic cleanup of dependent tasks,
   * assignees, and relations. If omitted (or false) and dependents exist, the
   * server returns 409 with a structured `errorData.blockers` payload.
   */
  cascade?: boolean;
}

export interface AddColumnData {
  name: string;
  description?: string;
  color?: string;
  isDefault?: boolean;
  taskStatus?: 'pending' | 'inProgress' | 'complete' | 'closed' | null;
  sortOrder?: number;
  /** When true, reviewer-role users may create tasks in this column on a reviewer-visibility board. */
  reviewersCanContribute?: boolean;
}

export interface UpdateColumnData {
  name?: string;
  description?: string | null;
  color?: string | null;
  isDefault?: boolean;
  taskStatus?: 'pending' | 'inProgress' | 'complete' | 'closed' | null;
  sortOrder?: number;
  /** When true, reviewer-role users may create tasks in this column on a reviewer-visibility board. */
  reviewersCanContribute?: boolean;
}

export interface ReorderColumnsData {
  columns: { id: string; sortOrder: number }[];
}

export interface CreateBoardTaskData {
  subject: string;
  description?: string;
  assignedToId?: string;
  columnId?: string;
  /** Optional announce flag. When supplied, after the task is created
   *  the server posts a Nu reply in `chatId` threaded under `messageId`
   *  with this task as a single taskCard and links them via TaskRelation.
   *  Mirrors the same flag on `tasks.bulkCreate`. */
  announce?: {
    chatId: string;
    messageId: string;
  };
}

export interface AddExistingTaskData {
  taskId: string;
  columnId?: string;
}

export interface MoveTaskData {
  /** Required for same-board moves; optional when `targetBoardId` is
   *  set (server defaults to the target board's default column). */
  columnId?: string;
  sortOrder?: number;
  /** When supplied AND different from the URL `boardId`, the server
   *  performs a cross-board move — `boardId` and `columnId` are
   *  updated together. Omit for the original same-board move. */
  targetBoardId?: string;
}

export interface UpdateTaskDetailsData {
  subject?: string;
  description?: string | null;
  assignedToId?: string | null;
}

export interface LinkTaskData {
  linkedTaskId: string;
  linkType?: 'related' | 'blocks' | 'blockedBy' | 'duplicate';
}

// --- Method Definitions ---

export default function createBoardMethods(client: NuramaClient) {
  return {
    // ========================================================================
    // Board CRUD
    // ========================================================================

    /**
     * Create a new board inside a project. If `columns` are omitted the
     * server seeds the standard four-column layout.
     */
    async createBoard(data: CreateBoardData): Promise<Board> {
      if (!data.projectId) throw new Error('projectId is required.');
      if (!data.name) throw new Error('name is required.');
      return client._request<Board>({
        method: 'POST',
        endpoint: '/v1/boards/',
        body: data,
        sendJWT: true,
      });
    },

    /**
     * List boards in a project. Filters by visibility, free-text search,
     * and tag ids.
     */
    async getProjectBoards(projectId: string, params?: { visibility?: string; search?: string; tags?: string[] }): Promise<Board[]> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<Board[]>({
        method: 'GET',
        endpoint: `/v1/boards/project/${projectId}`,
        params,
        sendJWT: true,
      });
    },

    /**
     * List every task in a project across all boards. Use `boardId:
     * 'unassigned'` to fetch only tasks not yet placed on a board.
     */
    async getProjectTasks(projectId: string, params?: {
      search?: string;
      status?: string;
      boardId?: string | 'unassigned';
      columnId?: string;
      assignedToId?: string;
      visibility?: string;
      tags?: string[];
      page?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
    }): Promise<any> {
      if (!projectId) throw new Error('projectId is required.');
      return client._request<any>({
        method: 'GET',
        endpoint: `/v1/boards/project/${projectId}/tasks`,
        params,
        sendJWT: true,
      });
    },

    /** Fetch a board with its columns and tasks populated. */
    async getBoard(boardId: string): Promise<BoardWithTasks> {
      if (!boardId) throw new Error('boardId is required.');
      return client._request<BoardWithTasks>({
        method: 'GET',
        endpoint: `/v1/boards/${boardId}`,
        sendJWT: true,
      });
    },

    /**
     * Update a board's metadata. Set `cascade: true` to opt into
     * automatic cleanup of dependent tasks when narrowing visibility;
     * otherwise the server returns 409 with a `blockers` payload.
     */
    async updateBoard(boardId: string, data: UpdateBoardData): Promise<Board> {
      if (!boardId) throw new Error('boardId is required.');
      return client._request<Board>({
        method: 'PUT',
        endpoint: `/v1/boards/${boardId}`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Delete a board. `disposition` controls what happens to its tasks:
     * `unassign` (default — tasks survive boardless), `delete`, or
     * `reassign` to another board/column.
     */
    async deleteBoard(
      boardId: string,
      body?: {
        disposition?: 'unassign' | 'delete' | 'reassign';
        targetBoardId?: string;
        targetColumnId?: string;
      }
    ): Promise<{ message: string; disposition: string; deletedTaskIds: string[]; reassignedTaskIds: string[] }> {
      if (!boardId) throw new Error('boardId is required.');
      return client._request({
        method: 'DELETE',
        endpoint: `/v1/boards/${boardId}`,
        body: body && Object.keys(body).length > 0 ? body : undefined,
        sendJWT: true,
      });
    },

    // ========================================================================
    // Column Operations
    // ========================================================================

    /** Add a column to a board. Appended at the end unless `sortOrder` is provided. */
    async addColumn(boardId: string, data: AddColumnData): Promise<BoardColumn> {
      if (!boardId) throw new Error('boardId is required.');
      if (!data.name) throw new Error('name is required.');
      return client._request<BoardColumn>({
        method: 'POST',
        endpoint: `/v1/boards/${boardId}/columns`,
        body: data,
        sendJWT: true,
      });
    },

    /** Reorder a board's columns. The request must include every column id. */
    async reorderColumns(boardId: string, data: ReorderColumnsData): Promise<BoardColumn[]> {
      if (!boardId) throw new Error('boardId is required.');
      return client._request<BoardColumn[]>({
        method: 'PUT',
        endpoint: `/v1/boards/${boardId}/columns/reorder`,
        body: data,
        sendJWT: true,
      });
    },

    /** Update column metadata (name, color, task-status mapping, etc.). */
    async updateColumn(boardId: string, columnId: string, data: UpdateColumnData): Promise<BoardColumn> {
      if (!boardId) throw new Error('boardId is required.');
      if (!columnId) throw new Error('columnId is required.');
      return client._request<BoardColumn>({
        method: 'PUT',
        endpoint: `/v1/boards/${boardId}/columns/${columnId}`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Delete a column. If the column holds tasks, pass `targetColumnId`
     * to move them; otherwise the call fails.
     */
    async deleteColumn(boardId: string, columnId: string, targetColumnId?: string): Promise<void> {
      if (!boardId) throw new Error('boardId is required.');
      if (!columnId) throw new Error('columnId is required.');
      return client._request<void>({
        method: 'DELETE',
        endpoint: `/v1/boards/${boardId}/columns/${columnId}`,
        body: targetColumnId ? { targetColumnId } : undefined,
        sendJWT: true,
      });
    },

    // ========================================================================
    // Board Task Operations
    // ========================================================================

    /** List tasks on a board, optionally narrowed by column / assignee / tag / status / search. */
    async getBoardTasks(
      boardId: string,
      params?: {
        columnId?: string;
        search?: string;
        status?: string;
        assignedToId?: string;
        tags?: string[];
      }
    ): Promise<Task[]> {
      if (!boardId) throw new Error('boardId is required.');
      return client._request<Task[]>({
        method: 'GET',
        endpoint: `/v1/boards/${boardId}/tasks`,
        params,
        sendJWT: true,
      });
    },

    /**
     * Create a task directly on a board. When `announce` is supplied the
     * server also posts a Nu reply in the named chat threaded under the
     * given message, with this task linked via TaskRelation.
     */
    async createBoardTask(boardId: string, data: CreateBoardTaskData): Promise<Task> {
      if (!boardId) throw new Error('boardId is required.');
      if (!data.subject) throw new Error('subject is required.');
      return client._request<Task>({
        method: 'POST',
        endpoint: `/v1/boards/${boardId}/tasks`,
        body: data,
        sendJWT: true,
      });
    },

    /** Attach an existing project task to a board (no new task is created). */
    async addExistingTaskToBoard(boardId: string, data: AddExistingTaskData): Promise<Task> {
      if (!boardId) throw new Error('boardId is required.');
      if (!data.taskId) throw new Error('taskId is required.');
      return client._request<Task>({
        method: 'POST',
        endpoint: `/v1/boards/${boardId}/tasks/add`,
        body: data,
        sendJWT: true,
      });
    },

    /** Move a task to a different column on the same board. */
    async moveTask(boardId: string, taskId: string, data: MoveTaskData): Promise<Task> {
      if (!boardId) throw new Error('boardId is required.');
      if (!taskId) throw new Error('taskId is required.');
      if (!data.columnId) throw new Error('columnId is required.');
      return client._request<Task>({
        method: 'PUT',
        endpoint: `/v1/boards/${boardId}/tasks/${taskId}/move`,
        body: data,
        sendJWT: true,
      });
    },

    /** Detach a task from a board. The task itself is preserved as boardless. */
    async removeTaskFromBoard(boardId: string, taskId: string): Promise<Task> {
      if (!boardId) throw new Error('boardId is required.');
      if (!taskId) throw new Error('taskId is required.');
      return client._request<Task>({
        method: 'DELETE',
        endpoint: `/v1/boards/${boardId}/tasks/${taskId}`,
        sendJWT: true,
      });
    },

    // ========================================================================
    // Task Detail Operations
    // ========================================================================

    // ========================================================================
    // Task Link Operations
    // ========================================================================

    // ========================================================================
    // Tagging
    // ========================================================================

    /** Attach a tag to a board. */
    async tagBoard(boardId: string, tagId: string): Promise<Board> {
      return client._request<Board>({
        method: 'PUT',
        endpoint: `/v1/boards/${boardId}/tag`,
        body: { tagId },
        sendJWT: true,
      });
    },

    /** Detach a tag from a board. */
    async untagBoard(boardId: string, tagId: string): Promise<Board> {
      return client._request<Board>({
        method: 'PUT',
        endpoint: `/v1/boards/${boardId}/untag`,
        body: { tagId },
        sendJWT: true,
      });
    },

    // ========================================================================
    // Following
    // ========================================================================

    /** Follow a board to receive notifications about its tasks. */
    async followBoard(boardId: string): Promise<Board> {
      if (!boardId) throw new Error('boardId is required.');
      return client._request<Board>({
        method: 'PUT',
        endpoint: `/v1/boards/${boardId}/follow`,
        sendJWT: true,
      });
    },

    /** Stop following a board. */
    async unfollowBoard(boardId: string): Promise<Board> {
      if (!boardId) throw new Error('boardId is required.');
      return client._request<Board>({
        method: 'PUT',
        endpoint: `/v1/boards/${boardId}/unfollow`,
        sendJWT: true,
      });
    },
  };
}

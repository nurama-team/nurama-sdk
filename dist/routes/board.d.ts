import NuramaClient from '../NuramaClient.js';
import { type Board, type BoardColumn, type BoardWithTasks, type Task } from '@nurama/types';
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
    columns: {
        id: string;
        sortOrder: number;
    }[];
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
export default function createBoardMethods(client: NuramaClient): {
    /**
     * Create a new board inside a project. If `columns` are omitted the
     * server seeds the standard four-column layout.
     */
    createBoard(data: CreateBoardData): Promise<Board>;
    /**
     * List boards in a project. Filters by visibility, free-text search,
     * and tag ids.
     */
    getProjectBoards(projectId: string, params?: {
        visibility?: string;
        search?: string;
        tags?: string[];
    }): Promise<Board[]>;
    /**
     * List every task in a project across all boards. Use `boardId:
     * 'unassigned'` to fetch only tasks not yet placed on a board.
     */
    getProjectTasks(projectId: string, params?: {
        search?: string;
        status?: string;
        boardId?: string | "unassigned";
        columnId?: string;
        assignedToId?: string;
        visibility?: string;
        tags?: string[];
        page?: number;
        limit?: number;
        sort?: Record<string, 1 | -1>;
    }): Promise<any>;
    /** Fetch a board with its columns and tasks populated. */
    getBoard(boardId: string): Promise<BoardWithTasks>;
    /**
     * Update a board's metadata. Set `cascade: true` to opt into
     * automatic cleanup of dependent tasks when narrowing visibility;
     * otherwise the server returns 409 with a `blockers` payload.
     */
    updateBoard(boardId: string, data: UpdateBoardData): Promise<Board>;
    /**
     * Delete a board. `disposition` controls what happens to its tasks:
     * `unassign` (default — tasks survive boardless), `delete`, or
     * `reassign` to another board/column.
     */
    deleteBoard(boardId: string, body?: {
        disposition?: "unassign" | "delete" | "reassign";
        targetBoardId?: string;
        targetColumnId?: string;
    }): Promise<{
        message: string;
        disposition: string;
        deletedTaskIds: string[];
        reassignedTaskIds: string[];
    }>;
    /** Add a column to a board. Appended at the end unless `sortOrder` is provided. */
    addColumn(boardId: string, data: AddColumnData): Promise<BoardColumn>;
    /** Reorder a board's columns. The request must include every column id. */
    reorderColumns(boardId: string, data: ReorderColumnsData): Promise<BoardColumn[]>;
    /** Update column metadata (name, color, task-status mapping, etc.). */
    updateColumn(boardId: string, columnId: string, data: UpdateColumnData): Promise<BoardColumn>;
    /**
     * Delete a column. If the column holds tasks, pass `targetColumnId`
     * to move them; otherwise the call fails.
     */
    deleteColumn(boardId: string, columnId: string, targetColumnId?: string): Promise<void>;
    /** List tasks on a board, optionally narrowed by column / assignee / tag / status / search. */
    getBoardTasks(boardId: string, params?: {
        columnId?: string;
        search?: string;
        status?: string;
        assignedToId?: string;
        tags?: string[];
    }): Promise<Task[]>;
    /**
     * Create a task directly on a board. When `announce` is supplied the
     * server also posts a Nu reply in the named chat threaded under the
     * given message, with this task linked via TaskRelation.
     */
    createBoardTask(boardId: string, data: CreateBoardTaskData): Promise<Task>;
    /** Attach an existing project task to a board (no new task is created). */
    addExistingTaskToBoard(boardId: string, data: AddExistingTaskData): Promise<Task>;
    /** Move a task to a different column on the same board. */
    moveTask(boardId: string, taskId: string, data: MoveTaskData): Promise<Task>;
    /** Detach a task from a board. The task itself is preserved as boardless. */
    removeTaskFromBoard(boardId: string, taskId: string): Promise<Task>;
    /** Attach a tag to a board. */
    tagBoard(boardId: string, tagId: string): Promise<Board>;
    /** Detach a tag from a board. */
    untagBoard(boardId: string, tagId: string): Promise<Board>;
    /** Follow a board to receive notifications about its tasks. */
    followBoard(boardId: string): Promise<Board>;
    /** Stop following a board. */
    unfollowBoard(boardId: string): Promise<Board>;
};
//# sourceMappingURL=board.d.ts.map
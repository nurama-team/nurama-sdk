import NuramaClient from '../NuramaClient.js';
import { type UpdateTaskDetailsData, type LinkTaskData } from './board.js';
import { type Task, // Import Task type
type PaginatedResult, // Import pagination types
type CursorPaginatedResult, type TaskLink } from '@nurama/types';
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
    results?: T[];
};
export interface SortParams {
    sort?: Record<string, 1 | -1>;
}
export type TaskVisibility = 'creator' | 'reviewer';
export type TaskStatus = 'pending' | 'complete' | 'cancelled';
export interface GetTasksBaseParams extends SortParams {
    projectId?: string;
    creatorId?: string;
    relatedToId?: string;
    visibility?: TaskVisibility;
    acknowledged?: boolean;
    /** `'chatMessage'` returns only mention-tasks; without it, board tasks assigned to you come too. */
    originType?: 'chatMessage';
    limit?: number;
}
export interface GetTasksIndexParams extends GetTasksBaseParams {
    paginate?: 'index';
    page?: number;
    createdBefore?: number | string;
    createdAfter?: number | string;
}
export interface GetTasksCursorParams extends GetTasksBaseParams {
    paginate: 'cursor';
    cursor?: string;
    paginateReverse?: boolean;
    includeCounts?: boolean;
    includeCursorRecord?: boolean;
    startAt?: string;
    includeStartAtRecord?: boolean;
}
export type GetTasksParams = GetTasksIndexParams | GetTasksCursorParams;
export interface UpdateTaskStatusData {
    status: TaskStatus;
}
export type GetTasksResponse = PaginatedResponse<Task>;
export interface UnacknowledgedTaskCountResponse {
    total: number;
    creator: number;
    reviewer: number;
}
export interface AcknowledgeAllTasksResponse {
    /** Number of tasks that were acknowledged by this call. */
    acknowledged: number;
    /** The user's remaining unacknowledged count for the project (should be all-zero). */
    unacknowledgedCount: UnacknowledgedTaskCountResponse;
}
export interface TaskEventActor {
    id: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    color?: string;
    avatar?: unknown;
}
export interface TaskEvent {
    id: string;
    taskId: string;
    projectId: string;
    eventType: string;
    detail?: Record<string, unknown>;
    createdAt: string;
    actor: TaskEventActor | null;
}
export interface GetTaskEventsParams {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    eventType?: string;
}
export type GetTaskEventsResponse = PaginatedResponse<TaskEvent>;
/**
 * Defines task-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the task-related methods.
 */
export interface BulkTaskDraft {
    /** FE-assigned id; echoed back in `results` so the caller can map a
     *  per-task outcome onto the originating draft. */
    clientId: string;
    boardId: string;
    columnId?: string;
    subject: string;
    description?: string | null;
    assignedToId?: string;
    tagIds?: string[];
}
export interface BulkCreateTasksRequest {
    projectId: string;
    tasks: BulkTaskDraft[];
    /** When present, the server posts a single Nu reply in the chat after
     *  the batch creates, threaded as `replyToId = messageId` and carrying
     *  every newly-created task as a taskCard. Replaces the standalone
     *  `ai.announceTasksFromMessage` endpoint we shipped previously. */
    announce?: {
        chatId: string;
        messageId: string;
    };
}
export interface BulkCreateTaskResult {
    clientId: string;
    status: 'created' | 'error';
    task?: Task;
    error?: {
        code: string;
        message: string;
    };
}
export interface BulkCreateTasksResponse {
    results: BulkCreateTaskResult[];
    announce?: {
        posted: boolean;
        messageId: string | null;
    };
}
export default function createTaskMethods(client: NuramaClient): {
    /**
         * Retrieves tasks assigned to the currently authenticated user.
         * Supports filtering, sorting, and both index and cursor pagination.
         * @param {GetTasksParams} [params] - Optional query parameters for filtering, sorting, and pagination.
         * @returns {Promise<GetTasksResponse>} Paginated list of tasks.
         */
    getMyTasks(params?: GetTasksParams): Promise<GetTasksResponse>;
    /**
     * Bulk-create one or more tasks under a single project — single
     * round-trip replacement for the per-draft create loop the
     * EnhancedTaskCreatorModal used to drive. Per-task partial success
     * is returned in `results[]`; if `announce` is set and at least
     * one task creates, the server also posts a Nu reply linking the
     * new tasks back to the source message and rendering them as
     * inline taskCards.
     */
    bulkCreate(data: BulkCreateTasksRequest): Promise<BulkCreateTasksResponse>;
    /**
         * Updates the status of a specific task.
         * Requires authentication and permission.
         * @param {string} taskId - The ID of the task to update.
         * @param {UpdateTaskStatusData} data - The new status for the task.
         * @returns {Promise<Task>} The updated task object.
         */
    updateTaskStatus(taskId: string, data: UpdateTaskStatusData): Promise<Task>;
    /**
         * Toggles the acknowledgement status of a specific task.
         * Requires authentication and permission.
         * @param {string} taskId - The ID of the task to acknowledge/unacknowledge.
         * @returns {Promise<Task>} The updated task object with the new acknowledgement status.
         */
    acknowledgeTask(taskId: string): Promise<Task>;
    /**
         * Retrieves the count of unacknowledged tasks for the current user within a specific project,
         * or across every project when none is given. Requires authentication.
         * @param {string} [projectId] - The ID of the project; omit for every project.
         * @returns {Promise<UnacknowledgedTaskCountResponse>} An object containing total, creator, and reviewer unacknowledged task counts.
         */
    getUnacknowledgedTaskCount(projectId?: string): Promise<UnacknowledgedTaskCountResponse>;
    /**
         * Acknowledge every unacknowledged mention-task the current user has in a
         * project, or in every project when none is given. Idempotent server-side.
         * @param {string} [projectId] - The ID of the project; omit for every project.
         * @returns {Promise<AcknowledgeAllTasksResponse>} The number acknowledged and the remaining unacknowledged count.
         */
    acknowledgeAllTasks(projectId?: string): Promise<AcknowledgeAllTasksResponse>;
    /**
     * Add the calling user to a task's `followers` list.
     * Idempotent server-side — following an already-followed task is a no-op
     * and still returns the current task.
     * @param taskId - The ID of the task to follow.
     * @returns The updated task with the new followers array.
     */
    followTask(taskId: string): Promise<Task>;
    /**
     * Remove the calling user from a task's `followers` list.
     * Idempotent server-side — unfollowing a task you don't follow is a
     * no-op and still returns the current task.
     * @param taskId - The ID of the task to unfollow.
     * @returns The updated task with the new followers array.
     */
    unfollowTask(taskId: string): Promise<Task>;
    /**
     * Permanently delete a task. Gated server-side by
     * `canRemove{Visibility}BoardTask` for at least one of the parent
     * board's visibility tiers (see `boardPermission('Remove', 'BoardTask')`).
     *
     * Returns void; the server responds with 204 No Content.
     *
     * @param taskId - The ID of the task to delete.
     */
    deleteTask(taskId: string): Promise<void>;
    /**
     * Retrieves the event log for a specific task.
     * Returns paginated events in reverse chronological order with populated actor info.
     * @param {string} taskId - The ID of the task.
     * @param {GetTaskEventsParams} [params] - Optional pagination, sort, search, and filter params.
     * @returns {Promise<GetTaskEventsResponse>} Paginated list of task events.
     */
    getTaskEvents(taskId: string, params?: GetTaskEventsParams): Promise<GetTaskEventsResponse>;
    /**
     * Update a board task's subject, description, assignee or status.
     * Requires the boards capability and board-task write permission.
     * @param {string} taskId - The task ID.
     * @param {UpdateTaskDetailsData} data - Fields to change.
     * @returns {Promise<Task>} The updated task.
     * @throws {Error} 'taskId is required.' when `taskId` is falsy.
     */
    updateTaskDetails(taskId: string, data: UpdateTaskDetailsData): Promise<Task>;
    /**
     * Link two tasks with a typed relation (related, blocks, blockedBy, duplicate).
     * The link is symmetrical: both tasks reflect the relationship.
     * @param {string} taskId - The task ID.
     * @param {LinkTaskData} data - `linkedTaskId` and `type`.
     * @returns {Promise<TaskLink>} The created link.
     * @throws {Error} 'taskId is required.' or 'linkedTaskId is required.'.
     */
    linkTask(taskId: string, data: LinkTaskData): Promise<TaskLink>;
    /**
     * Remove a task-to-task link.
     * @param {string} taskId - The task ID.
     * @param {string} linkedTaskId - The other task in the link.
     * @returns {Promise<void>} Resolves once removed.
     * @throws {Error} 'taskId is required.' or 'linkedTaskId is required.'.
     */
    unlinkTask(taskId: string, linkedTaskId: string): Promise<void>;
    /**
     * List the tasks linked to a task, with the relation type of each link.
     * @param {string} taskId - The task ID.
     * @returns {Promise<TaskLink[]>} The task's links.
     * @throws {Error} 'taskId is required.' when `taskId` is falsy.
     */
    getTaskLinks(taskId: string): Promise<TaskLink[]>;
    /**
     * Attach a project tag to a task.
     * @param {string} taskId - The task ID.
     * @param {string} tagId - The tag ID.
     * @returns {Promise<Task>} The updated task.
     * @throws {Error} 'taskId is required.' or 'tagId is required.'.
     */
    tagTask(taskId: string, tagId: string): Promise<Task>;
    /**
     * Detach a project tag from a task.
     * @param {string} taskId - The task ID.
     * @param {string} tagId - The tag ID.
     * @returns {Promise<Task>} The updated task.
     * @throws {Error} 'taskId is required.' or 'tagId is required.'.
     */
    untagTask(taskId: string, tagId: string): Promise<Task>;
};
//# sourceMappingURL=task.d.ts.map
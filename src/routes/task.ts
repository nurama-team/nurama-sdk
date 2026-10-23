import NuramaClient from '../NuramaClient.js';
import { type UpdateTaskDetailsData, type LinkTaskData } from './board.js';
import {
  type Task, // Import Task type
  type PaginatedResult, // Import pagination types
  type CursorPaginatedResult,
  type TaskLink,
} from '@nurama/types';

// Combine pagination metadata with a results array
// (Should be defined centrally or imported if used across multiple route files)
export type PaginatedResponse<T> = (PaginatedResult | CursorPaginatedResult) & {
  results?: T[];
};

// --- Common Interfaces ---
export interface SortParams {
    sort?: Record<string, 1 | -1>;
}

export type TaskVisibility = 'creator' | 'reviewer';
export type TaskStatus = 'pending' | 'complete' | 'cancelled'; // Based on standard status types, adjust if needed

// --- Query Parameter Interfaces ---
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
    createdBefore?: number | string; // Timestamp or ObjectId string
    createdAfter?: number | string; // Timestamp or ObjectId string
}

export interface GetTasksCursorParams extends GetTasksBaseParams {
    paginate: 'cursor';
    cursor?: string;
    paginateReverse?: boolean;
    includeCounts?: boolean;
    includeCursorRecord?: boolean;
    startAt?: string; // ObjectId string
    includeStartAtRecord?: boolean;
}

export type GetTasksParams = GetTasksIndexParams | GetTasksCursorParams;

// --- Request Body Interfaces ---
export interface UpdateTaskStatusData {
    status: TaskStatus;
}

// --- Response Interfaces ---
// Task type is imported from nurama-types

export type GetTasksResponse = PaginatedResponse<Task>;

// Keep local definition as it's not in nurama-types
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

// --- Event Interfaces ---
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

// --- Method Definitions ---

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
  error?: { code: string; message: string };
}

export interface BulkCreateTasksResponse {
  results: BulkCreateTaskResult[];
  announce?: {
    posted: boolean;
    messageId: string | null;
  };
}

export default function createTaskMethods(client: NuramaClient) {
  return {
    /**
         * Retrieves tasks assigned to the currently authenticated user.
         * Supports filtering, sorting, and both index and cursor pagination.
         * @param {GetTasksParams} [params] - Optional query parameters for filtering, sorting, and pagination.
         * @returns {Promise<GetTasksResponse>} Paginated list of tasks.
         */
    async getMyTasks(params?: GetTasksParams): Promise<GetTasksResponse> {
      return client._request<GetTasksResponse>({
        method: 'GET',
        endpoint: '/v1/tasks/',
        params: params,
        sendJWT: true,
      });
    },

    /**
     * Bulk-create one or more tasks under a single project — single
     * round-trip replacement for the per-draft create loop the
     * EnhancedTaskCreatorModal used to drive. Per-task partial success
     * is returned in `results[]`; if `announce` is set and at least
     * one task creates, the server also posts a Nu reply linking the
     * new tasks back to the source message and rendering them as
     * inline taskCards.
     */
    async bulkCreate(data: BulkCreateTasksRequest): Promise<BulkCreateTasksResponse> {
      if (!data?.projectId) throw new Error('projectId is required.');
      if (!Array.isArray(data?.tasks) || data.tasks.length === 0) {
        throw new Error('tasks is required and must contain at least one draft.');
      }
      return client._request<BulkCreateTasksResponse>({
        method: 'POST',
        endpoint: '/v1/tasks/bulk-create',
        body: data,
        sendJWT: true,
      });
    },

    /**
         * Updates the status of a specific task.
         * Requires authentication and permission.
         * @param {string} taskId - The ID of the task to update.
         * @param {UpdateTaskStatusData} data - The new status for the task.
         * @returns {Promise<Task>} The updated task object.
         */
    async updateTaskStatus(taskId: string, data: UpdateTaskStatusData): Promise<Task> {
      if (!taskId) throw new Error('taskId is required.');
      if (!data || !data.status) throw new Error('status is required in the request body.');
      return client._request<Task>({
        method: 'PUT',
        endpoint: `/v1/tasks/${taskId}`,
        body: data,
        sendJWT: true,
      });
    },

    /**
         * Toggles the acknowledgement status of a specific task.
         * Requires authentication and permission.
         * @param {string} taskId - The ID of the task to acknowledge/unacknowledge.
         * @returns {Promise<Task>} The updated task object with the new acknowledgement status.
         */
    async acknowledgeTask(taskId: string): Promise<Task> {
      if (!taskId) throw new Error('taskId is required.');
      return client._request<Task>({
        method: 'PUT',
        endpoint: `/v1/tasks/acknowledge/${taskId}`,
        sendJWT: true,
      });
    },

    /**
         * Retrieves the count of unacknowledged tasks for the current user within a specific project,
         * or across every project when none is given. Requires authentication.
         * @param {string} [projectId] - The ID of the project; omit for every project.
         * @returns {Promise<UnacknowledgedTaskCountResponse>} An object containing total, creator, and reviewer unacknowledged task counts.
         */
    async getUnacknowledgedTaskCount(projectId?: string): Promise<UnacknowledgedTaskCountResponse> {
      return client._request<UnacknowledgedTaskCountResponse>({
        method: 'GET',
        endpoint: projectId ? `/v1/tasks/unacknowledged/${projectId}` : '/v1/tasks/unacknowledged',
        sendJWT: true,
      });
    },

    /**
         * Acknowledge every unacknowledged mention-task the current user has in a
         * project, or in every project when none is given. Idempotent server-side.
         * @param {string} [projectId] - The ID of the project; omit for every project.
         * @returns {Promise<AcknowledgeAllTasksResponse>} The number acknowledged and the remaining unacknowledged count.
         */
    async acknowledgeAllTasks(projectId?: string): Promise<AcknowledgeAllTasksResponse> {
      return client._request<AcknowledgeAllTasksResponse>({
        method: 'PUT',
        endpoint: projectId ? `/v1/tasks/acknowledge-all/${projectId}` : '/v1/tasks/acknowledge-all',
        sendJWT: true,
      });
    },

    /**
     * Add the calling user to a task's `followers` list.
     * Idempotent server-side — following an already-followed task is a no-op
     * and still returns the current task.
     * @param taskId - The ID of the task to follow.
     * @returns The updated task with the new followers array.
     */
    async followTask(taskId: string): Promise<Task> {
      if (!taskId) throw new Error('taskId is required.');
      return client._request<Task>({
        method: 'PUT',
        endpoint: `/v1/tasks/${taskId}/follow`,
        sendJWT: true,
      });
    },

    /**
     * Remove the calling user from a task's `followers` list.
     * Idempotent server-side — unfollowing a task you don't follow is a
     * no-op and still returns the current task.
     * @param taskId - The ID of the task to unfollow.
     * @returns The updated task with the new followers array.
     */
    async unfollowTask(taskId: string): Promise<Task> {
      if (!taskId) throw new Error('taskId is required.');
      return client._request<Task>({
        method: 'PUT',
        endpoint: `/v1/tasks/${taskId}/unfollow`,
        sendJWT: true,
      });
    },

    /**
     * Permanently delete a task. Gated server-side by
     * `canRemove{Visibility}BoardTask` for at least one of the parent
     * board's visibility tiers (see `boardPermission('Remove', 'BoardTask')`).
     *
     * Returns void; the server responds with 204 No Content.
     *
     * @param taskId - The ID of the task to delete.
     */
    async deleteTask(taskId: string): Promise<void> {
      if (!taskId) throw new Error('taskId is required.');
      return client._request<void>({
        method: 'DELETE',
        endpoint: `/v1/tasks/${taskId}`,
        sendJWT: true,
      });
    },

    /**
     * Retrieves the event log for a specific task.
     * Returns paginated events in reverse chronological order with populated actor info.
     * @param {string} taskId - The ID of the task.
     * @param {GetTaskEventsParams} [params] - Optional pagination, sort, search, and filter params.
     * @returns {Promise<GetTaskEventsResponse>} Paginated list of task events.
     */
    async getTaskEvents(taskId: string, params?: GetTaskEventsParams): Promise<GetTaskEventsResponse> {
      if (!taskId) throw new Error('taskId is required.');
      return client._request<GetTaskEventsResponse>({
        method: 'GET',
        endpoint: `/v1/tasks/${taskId}/events`,
        params,
        sendJWT: true,
      });
    },

    // ========================================================================
    // Task details, links and tags
    // ========================================================================

    /**
     * Update a board task's subject, description, assignee or status.
     * Requires the boards capability and board-task write permission.
     * @param {string} taskId - The task ID.
     * @param {UpdateTaskDetailsData} data - Fields to change.
     * @returns {Promise<Task>} The updated task.
     * @throws {Error} 'taskId is required.' when `taskId` is falsy.
     */
    async updateTaskDetails(taskId: string, data: UpdateTaskDetailsData): Promise<Task> {
      if (!taskId) throw new Error('taskId is required.');
      return client._request<Task>({
        method: 'PUT',
        endpoint: `/v1/tasks/${taskId}/details`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Link two tasks with a typed relation (related, blocks, blockedBy, duplicate).
     * The link is symmetrical: both tasks reflect the relationship.
     * @param {string} taskId - The task ID.
     * @param {LinkTaskData} data - `linkedTaskId` and `type`.
     * @returns {Promise<TaskLink>} The created link.
     * @throws {Error} 'taskId is required.' or 'linkedTaskId is required.'.
     */
    async linkTask(taskId: string, data: LinkTaskData): Promise<TaskLink> {
      if (!taskId) throw new Error('taskId is required.');
      if (!data.linkedTaskId) throw new Error('linkedTaskId is required.');
      return client._request<TaskLink>({
        method: 'POST',
        endpoint: `/v1/tasks/${taskId}/links`,
        body: data,
        sendJWT: true,
      });
    },

    /**
     * Remove a task-to-task link.
     * @param {string} taskId - The task ID.
     * @param {string} linkedTaskId - The other task in the link.
     * @returns {Promise<void>} Resolves once removed.
     * @throws {Error} 'taskId is required.' or 'linkedTaskId is required.'.
     */
    async unlinkTask(taskId: string, linkedTaskId: string): Promise<void> {
      if (!taskId) throw new Error('taskId is required.');
      if (!linkedTaskId) throw new Error('linkedTaskId is required.');
      await client._request<void>({
        method: 'DELETE',
        endpoint: `/v1/tasks/${taskId}/links/${linkedTaskId}`,
        sendJWT: true,
      });
    },

    /**
     * List the tasks linked to a task, with the relation type of each link.
     * @param {string} taskId - The task ID.
     * @returns {Promise<TaskLink[]>} The task's links.
     * @throws {Error} 'taskId is required.' when `taskId` is falsy.
     */
    async getTaskLinks(taskId: string): Promise<TaskLink[]> {
      if (!taskId) throw new Error('taskId is required.');
      return client._request<TaskLink[]>({
        method: 'GET',
        endpoint: `/v1/tasks/${taskId}/links`,
        sendJWT: true,
      });
    },

    /**
     * Attach a project tag to a task.
     * @param {string} taskId - The task ID.
     * @param {string} tagId - The tag ID.
     * @returns {Promise<Task>} The updated task.
     * @throws {Error} 'taskId is required.' or 'tagId is required.'.
     */
    async tagTask(taskId: string, tagId: string): Promise<Task> {
      if (!taskId) throw new Error('taskId is required.');
      if (!tagId) throw new Error('tagId is required.');
      return client._request<Task>({
        method: 'PUT',
        endpoint: `/v1/tasks/${taskId}/tag`,
        body: { tagId },
        sendJWT: true,
      });
    },

    /**
     * Detach a project tag from a task.
     * @param {string} taskId - The task ID.
     * @param {string} tagId - The tag ID.
     * @returns {Promise<Task>} The updated task.
     * @throws {Error} 'taskId is required.' or 'tagId is required.'.
     */
    async untagTask(taskId: string, tagId: string): Promise<Task> {
      if (!taskId) throw new Error('taskId is required.');
      if (!tagId) throw new Error('tagId is required.');
      return client._request<Task>({
        method: 'PUT',
        endpoint: `/v1/tasks/${taskId}/untag`,
        body: { tagId },
        sendJWT: true,
      });
    },
  };
}

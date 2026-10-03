export default function createTaskMethods(client) {
    return {
        /**
             * Retrieves tasks assigned to the currently authenticated user.
             * Supports filtering, sorting, and both index and cursor pagination.
             * @param {GetTasksParams} [params] - Optional query parameters for filtering, sorting, and pagination.
             * @returns {Promise<GetTasksResponse>} Paginated list of tasks.
             */
        async getMyTasks(params) {
            return client._request({
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
        async bulkCreate(data) {
            if (!data?.projectId)
                throw new Error('projectId is required.');
            if (!Array.isArray(data?.tasks) || data.tasks.length === 0) {
                throw new Error('tasks is required and must contain at least one draft.');
            }
            return client._request({
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
        async updateTaskStatus(taskId, data) {
            if (!taskId)
                throw new Error('taskId is required.');
            if (!data || !data.status)
                throw new Error('status is required in the request body.');
            return client._request({
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
        async acknowledgeTask(taskId) {
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/tasks/acknowledge/${taskId}`,
                sendJWT: true,
            });
        },
        /**
             * Retrieves the count of unacknowledged tasks for the current user within a specific project.
             * Requires authentication.
             * @param {string} projectId - The ID of the project.
             * @returns {Promise<UnacknowledgedTaskCountResponse>} An object containing total, creator, and reviewer unacknowledged task counts.
             */
        async getUnacknowledgedTaskCount(projectId) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/tasks/unacknowledged/${projectId}`,
                sendJWT: true,
            });
        },
        /**
             * Acknowledge every unacknowledged mention-task the current user has in a
             * project. Idempotent server-side.
             * @param {string} projectId - The ID of the project.
             * @returns {Promise<AcknowledgeAllTasksResponse>} The number acknowledged and the remaining unacknowledged count.
             */
        async acknowledgeAllTasks(projectId) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/tasks/acknowledge-all/${projectId}`,
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
        async followTask(taskId) {
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
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
        async unfollowTask(taskId) {
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
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
        async deleteTask(taskId) {
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
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
        async getTaskEvents(taskId, params) {
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
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
        async updateTaskDetails(taskId, data) {
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
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
        async linkTask(taskId, data) {
            if (!taskId)
                throw new Error('taskId is required.');
            if (!data.linkedTaskId)
                throw new Error('linkedTaskId is required.');
            return client._request({
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
        async unlinkTask(taskId, linkedTaskId) {
            if (!taskId)
                throw new Error('taskId is required.');
            if (!linkedTaskId)
                throw new Error('linkedTaskId is required.');
            await client._request({
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
        async getTaskLinks(taskId) {
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
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
        async tagTask(taskId, tagId) {
            if (!taskId)
                throw new Error('taskId is required.');
            if (!tagId)
                throw new Error('tagId is required.');
            return client._request({
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
        async untagTask(taskId, tagId) {
            if (!taskId)
                throw new Error('taskId is required.');
            if (!tagId)
                throw new Error('tagId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/tasks/${taskId}/untag`,
                body: { tagId },
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=task.js.map
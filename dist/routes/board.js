// --- Method Definitions ---
export default function createBoardMethods(client) {
    return {
        // ========================================================================
        // Board CRUD
        // ========================================================================
        /**
         * Create a new board inside a project. If `columns` are omitted the
         * server seeds the standard four-column layout.
         */
        async createBoard(data) {
            if (!data.projectId)
                throw new Error('projectId is required.');
            if (!data.name)
                throw new Error('name is required.');
            return client._request({
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
        async getProjectBoards(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
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
        async getProjectTasks(projectId, params) {
            if (!projectId)
                throw new Error('projectId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/boards/project/${projectId}/tasks`,
                params,
                sendJWT: true,
            });
        },
        /** Fetch a board with its columns and tasks populated. */
        async getBoard(boardId) {
            if (!boardId)
                throw new Error('boardId is required.');
            return client._request({
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
        async updateBoard(boardId, data) {
            if (!boardId)
                throw new Error('boardId is required.');
            return client._request({
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
        async deleteBoard(boardId, body) {
            if (!boardId)
                throw new Error('boardId is required.');
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
        async addColumn(boardId, data) {
            if (!boardId)
                throw new Error('boardId is required.');
            if (!data.name)
                throw new Error('name is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/boards/${boardId}/columns`,
                body: data,
                sendJWT: true,
            });
        },
        /** Reorder a board's columns. The request must include every column id. */
        async reorderColumns(boardId, data) {
            if (!boardId)
                throw new Error('boardId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/boards/${boardId}/columns/reorder`,
                body: data,
                sendJWT: true,
            });
        },
        /** Update column metadata (name, color, task-status mapping, etc.). */
        async updateColumn(boardId, columnId, data) {
            if (!boardId)
                throw new Error('boardId is required.');
            if (!columnId)
                throw new Error('columnId is required.');
            return client._request({
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
        async deleteColumn(boardId, columnId, targetColumnId) {
            if (!boardId)
                throw new Error('boardId is required.');
            if (!columnId)
                throw new Error('columnId is required.');
            return client._request({
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
        async getBoardTasks(boardId, params) {
            if (!boardId)
                throw new Error('boardId is required.');
            return client._request({
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
        async createBoardTask(boardId, data) {
            if (!boardId)
                throw new Error('boardId is required.');
            if (!data.subject)
                throw new Error('subject is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/boards/${boardId}/tasks`,
                body: data,
                sendJWT: true,
            });
        },
        /** Attach an existing project task to a board (no new task is created). */
        async addExistingTaskToBoard(boardId, data) {
            if (!boardId)
                throw new Error('boardId is required.');
            if (!data.taskId)
                throw new Error('taskId is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/boards/${boardId}/tasks/add`,
                body: data,
                sendJWT: true,
            });
        },
        /** Move a task to a different column on the same board. */
        async moveTask(boardId, taskId, data) {
            if (!boardId)
                throw new Error('boardId is required.');
            if (!taskId)
                throw new Error('taskId is required.');
            if (!data.columnId)
                throw new Error('columnId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/boards/${boardId}/tasks/${taskId}/move`,
                body: data,
                sendJWT: true,
            });
        },
        /** Detach a task from a board. The task itself is preserved as boardless. */
        async removeTaskFromBoard(boardId, taskId) {
            if (!boardId)
                throw new Error('boardId is required.');
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
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
        async tagBoard(boardId, tagId) {
            return client._request({
                method: 'PUT',
                endpoint: `/v1/boards/${boardId}/tag`,
                body: { tagId },
                sendJWT: true,
            });
        },
        /** Detach a tag from a board. */
        async untagBoard(boardId, tagId) {
            return client._request({
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
        async followBoard(boardId) {
            if (!boardId)
                throw new Error('boardId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/boards/${boardId}/follow`,
                sendJWT: true,
            });
        },
        /** Stop following a board. */
        async unfollowBoard(boardId) {
            if (!boardId)
                throw new Error('boardId is required.');
            return client._request({
                method: 'PUT',
                endpoint: `/v1/boards/${boardId}/unfollow`,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=board.js.map
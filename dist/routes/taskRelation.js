export default function createTaskRelationMethods(client) {
    return {
        /**
         * List the relations attached to a task — chat messages, chats, or
         * other resources that reference this task as context.
         */
        async getTaskRelations(taskId, params) {
            if (!taskId)
                throw new Error('taskId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/tasks/${taskId}/relations`,
                params,
                sendJWT: true,
            });
        },
        /**
         * Attach a related resource (chat message, chat, etc.) to a task,
         * so the task surface shows the originating context.
         */
        async createTaskRelation(taskId, data) {
            if (!taskId)
                throw new Error('taskId is required.');
            if (!data?.resourceId)
                throw new Error('resourceId is required.');
            if (!data?.resourceType)
                throw new Error('resourceType is required.');
            return client._request({
                method: 'POST',
                endpoint: `/v1/tasks/${taskId}/relations`,
                body: data,
                sendJWT: true,
            });
        },
        /** Detach a related resource from a task. */
        async deleteTaskRelation(taskId, relationId) {
            if (!taskId)
                throw new Error('taskId is required.');
            if (!relationId)
                throw new Error('relationId is required.');
            return client._request({
                method: 'DELETE',
                endpoint: `/v1/tasks/${taskId}/relations/${relationId}`,
                sendJWT: true,
            });
        },
        /** List task relations referencing a chat (reverse lookup). */
        async getRelationsForChat(chatId, params) {
            if (!chatId)
                throw new Error('chatId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chats/${chatId}/relations`,
                params,
                sendJWT: true,
            });
        },
        /** List task relations referencing a specific chat message (reverse lookup). */
        async getRelationsForMessage(messageId, params) {
            if (!messageId)
                throw new Error('messageId is required.');
            return client._request({
                method: 'GET',
                endpoint: `/v1/chat-messages/${messageId}/relations`,
                params,
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=taskRelation.js.map
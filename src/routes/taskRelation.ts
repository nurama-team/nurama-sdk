import NuramaClient from '../NuramaClient.js';

export type RelationResourceType = 'chat' | 'chatMessage';

export interface TaskRelation {
  id: string;
  taskId: string;
  resourceId: string;
  resourceType: RelationResourceType;
  creatorId: string;
  createdAt: string;
  relatedBy?: any;
  chat?: {
    id: string;
    topicId: string;
    topicType: string;
    visibility: string;
    chatType: string;
    subject?: string | null;
    publicId?: string | null;
  } | null;
  asset?: any | null;
  submission?: { id: string; name: string } | null;
  publicLink?: { id: string; name: string } | null;
  message?: {
    id: string;
    chatId: string;
    content: string | null;
    authorId: string | null;
    author: any;
    mentions: string[];
    assetMentions: string[];
    folderMentions: string[];
    createdAt: string;
  } | null;
}

export interface PaginatedTaskRelations {
  results: TaskRelation[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export default function createTaskRelationMethods(client: NuramaClient) {
  return {
    /**
     * List the relations attached to a task — chat messages, chats, or
     * other resources that reference this task as context.
     */
    async getTaskRelations(
      taskId: string,
      params?: { page?: number; limit?: number }
    ): Promise<PaginatedTaskRelations> {
      if (!taskId) throw new Error('taskId is required.');
      return client._request<PaginatedTaskRelations>({
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
    async createTaskRelation(
      taskId: string,
      data: { resourceId: string; resourceType: RelationResourceType }
    ): Promise<TaskRelation> {
      if (!taskId) throw new Error('taskId is required.');
      if (!data?.resourceId) throw new Error('resourceId is required.');
      if (!data?.resourceType) throw new Error('resourceType is required.');
      return client._request<TaskRelation>({
        method: 'POST',
        endpoint: `/v1/tasks/${taskId}/relations`,
        body: data,
        sendJWT: true,
      });
    },

    /** Detach a related resource from a task. */
    async deleteTaskRelation(taskId: string, relationId: string): Promise<void> {
      if (!taskId) throw new Error('taskId is required.');
      if (!relationId) throw new Error('relationId is required.');
      return client._request<void>({
        method: 'DELETE',
        endpoint: `/v1/tasks/${taskId}/relations/${relationId}`,
        sendJWT: true,
      });
    },

    /** List task relations referencing a chat (reverse lookup). */
    async getRelationsForChat(
      chatId: string,
      params?: { page?: number; limit?: number }
    ): Promise<PaginatedTaskRelations> {
      if (!chatId) throw new Error('chatId is required.');
      return client._request<PaginatedTaskRelations>({
        method: 'GET',
        endpoint: `/v1/chats/${chatId}/relations`,
        params,
        sendJWT: true,
      });
    },

    /** List task relations referencing a specific chat message (reverse lookup). */
    async getRelationsForMessage(
      messageId: string,
      params?: { page?: number; limit?: number }
    ): Promise<PaginatedTaskRelations> {
      if (!messageId) throw new Error('messageId is required.');
      return client._request<PaginatedTaskRelations>({
        method: 'GET',
        endpoint: `/v1/chat-messages/${messageId}/relations`,
        params,
        sendJWT: true,
      });
    },
  };
}

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
    submission?: {
        id: string;
        name: string;
    } | null;
    publicLink?: {
        id: string;
        name: string;
    } | null;
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
export default function createTaskRelationMethods(client: NuramaClient): {
    /**
     * List the relations attached to a task — chat messages, chats, or
     * other resources that reference this task as context.
     */
    getTaskRelations(taskId: string, params?: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedTaskRelations>;
    /**
     * Attach a related resource (chat message, chat, etc.) to a task,
     * so the task surface shows the originating context.
     */
    createTaskRelation(taskId: string, data: {
        resourceId: string;
        resourceType: RelationResourceType;
    }): Promise<TaskRelation>;
    /** Detach a related resource from a task. */
    deleteTaskRelation(taskId: string, relationId: string): Promise<void>;
    /** List task relations referencing a chat (reverse lookup). */
    getRelationsForChat(chatId: string, params?: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedTaskRelations>;
    /** List task relations referencing a specific chat message (reverse lookup). */
    getRelationsForMessage(messageId: string, params?: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedTaskRelations>;
};
//# sourceMappingURL=taskRelation.d.ts.map
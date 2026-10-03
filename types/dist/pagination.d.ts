import type { Asset } from './asset';
import type { Chat } from './chat';
import type { Folder } from './folder';
/**
 * Represents the standard structure for paginated results using page and limit.
 */
export interface PaginatedResult {
    /**
     * The current page number.
     */
    page: number;
    /**
     * The maximum number of results per page.
     */
    limit: number;
    /**
     * The total number of pages.
     */
    totalPages: number;
    /**
     * The total number of results across all pages.
     */
    totalResults: number;
    /**
     * Timestamp of query.
     * @format int64
     */
    queryAt?: number;
}
/**
 * Represents the structure for cursor-based paginated results.
 */
export interface CursorPaginatedResult {
    /**
     * Cursor pointing to the next set of results, null if none.
     */
    nextCursor: string | null;
    /**
     * Cursor pointing to the previous set of results, null if none.
     */
    prevCursor: string | null;
    /**
     * Indicates if there is a next page.
     */
    hasNextPage: boolean;
    /**
     * Indicates if there is a previous page.
     */
    hasPrevPage: boolean;
    /**
     * Total number of results matching the query (may be approximate or unavailable depending on pagination settings).
     */
    totalResults?: number | null;
    /**
     * Estimated number of results before the current page.
     */
    totalPreviousResults?: number | null;
    /**
     * Estimated number of results after the current page.
     */
    totalNextResults?: number | null;
    /**
     * Timestamp of when the query was executed.
     * @format int64
     */
    queryAt?: number;
}
/**
 * Represents a cursor-paginated feed combining Asset and Chat information.
 */
export type CursorPaginatedFeed = CursorPaginatedResult & {
    results?: (Asset & {
        chat?: Chat;
    })[];
};
/**
 * Represents a cursor-paginated list of Folders.
 */
export type CursorPaginatedFolders = CursorPaginatedResult & {
    results?: Folder[];
};
/**
 * Represents an index-paginated list of Folders (likely legacy or specific use case).
 */
export type IndexPaginatedFolders = PaginatedResult & {
    results?: Folder[];
};

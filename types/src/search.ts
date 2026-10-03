import type { Asset } from './asset';
import type { ChatMessage } from './chat';
import type { Task } from './task';
import type { PaginatedResult } from './pagination';

/**
 * Content types that can be searched in a project.
 */
export type SearchContentType = 'asset' | 'chatMessage' | 'task';

/**
 * Sort order for search results.
 * - `relevance` (default): ts_rank score descending, then createdAt desc.
 * - `dateDesc` / `dateAsc`: createdAt only.
 */
export type SearchSortBy = 'relevance' | 'dateDesc' | 'dateAsc';

/**
 * Query parameters accepted by GET /v1/projects/:projectId/search.
 */
export interface SearchProjectParams {
  /** Search term. Required. 1–200 chars. Parsed via Postgres `websearch_to_tsquery`. */
  q: string;
  /** Restrict to one or more content types. Omit to include all. */
  contentTypes?: SearchContentType | SearchContentType[];
  /** ISO 8601 — return results created on/after this date. */
  dateFrom?: string;
  /** ISO 8601 — return results created on/before this date. */
  dateTo?: string;
  /** Restrict to content authored by this user. */
  creatorId?: string;
  /** Sort order. Defaults to `relevance`. */
  sortBy?: SearchSortBy;
  /** 1-based page number. Defaults to 1. */
  page?: number;
  /** Page size, 1–100. Defaults to 20. */
  limit?: number;
}

/**
 * A single search hit.
 *
 * Scalars (`title`, `snippet`, `chatId`, `creatorId`) are derived directly
 * from the search SQL and are present whether or not the populated `record`
 * is needed. The `record` field carries the same populated shape the
 * content type's native list view returns:
 * - `asset`  → Asset with `creator`, `publisher`, `inheritance`, flat `tags[]`.
 * - `chatMessage` → ChatMessage with author, mentions, attachments, replyTo, etc.
 * - `task`  → Task with `creator`, `assignedTo`, `project`, `origin`, `relatedTo`, `inheritance`.
 */
export interface SearchResult {
  /** UUID of the matched record. */
  id: string;
  /** Which underlying entity this hit refers to. */
  contentType: SearchContentType;
  /** Asset.name / Task.subject. Null for chat messages (use `snippet`). */
  title: string | null;
  /** ts_headline excerpt with `<mark>...</mark>` highlights. Null for assets. */
  snippet: string | null;
  /** Authoring user UUID (Asset.creatorId / ChatMessage.authorId / Task.creatorId). */
  creatorId: string | null;
  /** Set only on `chatMessage` hits — the parent chat's UUID. */
  chatId: string | null;
  /** Record creation timestamp (ISO 8601 string in JSON). */
  createdAt: string;
  /** ts_rank score; higher = better match. */
  relevance: number;
  /** Fully-populated record, shaped per the content type's list view. */
  record: Asset | ChatMessage | Task | null;
}

/**
 * Paginated response from GET /v1/projects/:projectId/search.
 */
export type SearchResponse = PaginatedResult & {
  results: SearchResult[];
};

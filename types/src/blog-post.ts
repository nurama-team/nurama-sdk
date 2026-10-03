/**
 * Nurama News blog posts — sourced from the platform's external Ghost
 * CMS via the backend's `/v1/blog-posts` proxy. Authoring happens in
 * Ghost admin; the in-app surface is read-only.
 *
 * The proxy normalises Ghost's payload into the small `BlogPost`
 * envelope below so the FE doesn't depend on Ghost specifics and can be
 * pointed at a different CMS later without changing the renderer.
 */

/**
 * A single news / blog post as returned by `GET /v1/blog-posts`.
 *
 * `bodyHtml` is rendered HTML with a constrained sanitisation policy
 * applied server-side — it's safe to inject via the FE renderer's
 * controlled HTML primitive (e.g. `dangerouslySetInnerHTML` inside a
 * Radix Dialog body). The sanitiser preserves images, links, lists,
 * inline emphasis, and iframes from a known set of video providers
 * (YouTube, Vimeo, Wistia); everything else is dropped.
 */
export interface BlogPost {
  /** Ghost post id. Stable for the life of the post in Ghost. */
  id: string;
  /** Ghost slug — usable as a route segment if needed. */
  slug: string;
  /** Display title. Capped server-side at the configured max title length. */
  title: string;
  /**
   * One-line lede shown on the card. Falls back through
   * `custom_excerpt` → `excerpt` → empty string. Capped server-side.
   */
  lede: string;
  /** Sanitized rendered HTML for the modal. May be empty. */
  bodyHtml: string;
  /** Ghost `feature_image` URL — used as the hero on the card. */
  heroImageUrl: string | null;
  /** Optional alt text for the hero. */
  heroImageAlt: string | null;
  /** ISO-8601 publication timestamp (Ghost `published_at`). */
  publishedAt: string | null;
  /** Canonical Ghost URL for the post — used by the modal's "open in browser" footer. */
  externalUrl: string | null;
  /** Tag slugs the post carries in Ghost. */
  tags: string[];
}

/**
 * Pagination envelope mirrored from Ghost's Content API. The proxy passes
 * it through (mostly) untouched so the FE can drive `next` / `prev` if
 * we ever add a paginated view; the current `/news` page renders one page.
 */
export interface BlogPostPagination {
  page: number;
  limit: number;
  pages: number;
  total: number;
  next: number | null;
  prev: number | null;
}

export interface BlogPostListResponse {
  posts: BlogPost[];
  meta: { pagination: BlogPostPagination };
}

export interface BlogPostListParams {
  /** Page number, 1-indexed. Default 1. */
  page?: number;
  /** Posts per page (1–50). Default 20. */
  limit?: number;
}

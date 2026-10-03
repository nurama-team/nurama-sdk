import NuramaClient from '../NuramaClient.js';
import type { BlogPostListParams, BlogPostListResponse } from '@nurama/types';
/**
 * Read-only blog feed (Nurama News on the /news page) sourced via the
 * backend's Ghost Content API proxy. Auth: any signed-in user. No
 * workspace coupling — the feed is platform-level, identical for every
 * user.
 *
 * The proxy normalises Ghost's payload and sanitises post HTML
 * server-side, so the returned `bodyHtml` is safe to render via the
 * FE's controlled HTML primitive inside a modal.
 */
export default function createBlogPostsMethods(client: NuramaClient): {
    /** List the most recent Nurama News posts. */
    listBlogPosts(params?: BlogPostListParams): Promise<BlogPostListResponse>;
};
//# sourceMappingURL=blogPosts.d.ts.map
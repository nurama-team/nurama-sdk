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
export default function createBlogPostsMethods(client) {
    return {
        /** List the most recent Nurama News posts. */
        async listBlogPosts(params = {}) {
            const search = new URLSearchParams();
            if (params.limit != null)
                search.set('limit', String(params.limit));
            if (params.page != null)
                search.set('page', String(params.page));
            const query = search.toString();
            return client._request({
                endpoint: `/v1/blog-posts${query ? `?${query}` : ''}`,
                method: 'GET',
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=blogPosts.js.map
/**
 * Support tickets. A ticket carries the metadata + a backing Chat thread; the
 * conversation itself is sent/read through the regular chat endpoints:
 *
 *   - send: `nuramaClient.chat.createMessage(ticket.chatId, …)`
 *   - read: `nuramaClient.chat.getMessages(ticket.chatId, …)`
 *
 * Nurama customer service replies (as the support persona) from the admin site.
 */
export default function createSupportTicketMethods(client) {
    const buildQuery = (params = {}) => {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null || value === '')
                continue;
            search.set(key, String(value));
        }
        const query = search.toString();
        return query ? `?${query}` : '';
    };
    return {
        /** Create a ticket. The opening message body becomes the first thread entry. */
        async createSupportTicket(data) {
            if (!data?.scopeType)
                throw new Error('scopeType is required.');
            if (data.scopeType !== 'user' && !data.scopeId) {
                throw new Error('scopeId is required for workspace/project scope.');
            }
            if (!data?.subject)
                throw new Error('subject is required.');
            if (!data?.body)
                throw new Error('body is required.');
            return client._request({ endpoint: '/v1/support-tickets', method: 'POST', body: data, sendJWT: true });
        },
        /** List the caller's own tickets + (for resource admins) tickets in their scope. */
        async listSupportTickets(params = {}) {
            return client._request({ endpoint: `/v1/support-tickets${buildQuery(params)}`, method: 'GET', sendJWT: true });
        },
        async getSupportTicket(ticketId) {
            if (!ticketId)
                throw new Error('ticketId is required.');
            return client._request({
                endpoint: `/v1/support-tickets/${encodeURIComponent(ticketId)}`,
                method: 'GET',
                sendJWT: true,
            });
        },
        /** Workspaces/projects the caller may scope a new ticket to. */
        async getSupportTicketScopeOptions() {
            return client._request({ endpoint: '/v1/support-tickets/scope-options', method: 'GET', sendJWT: true });
        },
    };
}
//# sourceMappingURL=supportTicket.js.map
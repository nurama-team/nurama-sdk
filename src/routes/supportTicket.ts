import NuramaClient from '../NuramaClient.js';

export type SupportTicketScope = 'user' | 'workspace' | 'project';
export type SupportTicketStatus = 'open' | 'pending' | 'resolved' | 'closed';

export interface CreateSupportTicketRequest {
  scopeType: SupportTicketScope;
  /** Required for workspace/project scope; ignored for user scope. */
  scopeId?: string;
  subject: string;
  body: string;
  /** Browser/app/device snapshot collected at submit time. */
  deviceInfo?: Record<string, unknown>;
  /**
   * `true` when the ticket was drafted by Nu via the
   * `create_support_ticket` chat tool and submitted by the user from
   * the pre-populated SupportTicketCreateModal. Stamped onto the
   * `SupportTicket` row for ops analytics; the FE sets this when the
   * modal was opened by an AI-draft CTA.
   */
  aiGenerated?: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: number;
  subject: string;
  scopeType: SupportTicketScope;
  scopeId: string | null;
  creatorId: string;
  status: SupportTicketStatus;
  priority: string;
  chatId: string;
  deviceInfo: Record<string, unknown>;
  /** True for tickets drafted by Nu's `create_support_ticket` tool. */
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketListParams {
  status?: SupportTicketStatus;
  page?: number;
  limit?: number;
}

export interface SupportTicketListResponse {
  results: SupportTicket[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

/** A logo asset (thumbnail-ready) attached to a scope for avatar rendering. */
export type SupportTicketScopeLogo = { files?: unknown[]; [key: string]: unknown } | null;

export interface SupportTicketScopeOptions {
  workspaces: { id: string; name: string; slug: string; color?: string | null; logo?: SupportTicketScopeLogo }[];
  projects: { id: string; name: string; slug: string | null; workspaceId: string; color?: string | null; logo?: SupportTicketScopeLogo }[];
}

/**
 * Support tickets. A ticket carries the metadata + a backing Chat thread; the
 * conversation itself is sent/read through the regular chat endpoints:
 *
 *   - send: `nuramaClient.chat.createMessage(ticket.chatId, …)`
 *   - read: `nuramaClient.chat.getMessages(ticket.chatId, …)`
 *
 * Nurama customer service replies (as the support persona) from the admin site.
 */
export default function createSupportTicketMethods(client: NuramaClient) {
  const buildQuery = (params: Record<string, unknown> = {}): string => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      search.set(key, String(value));
    }
    const query = search.toString();
    return query ? `?${query}` : '';
  };

  return {
    /** Create a ticket. The opening message body becomes the first thread entry. */
    async createSupportTicket(data: CreateSupportTicketRequest): Promise<SupportTicket> {
      if (!data?.scopeType) throw new Error('scopeType is required.');
      if (data.scopeType !== 'user' && !data.scopeId) {
        throw new Error('scopeId is required for workspace/project scope.');
      }
      if (!data?.subject) throw new Error('subject is required.');
      if (!data?.body) throw new Error('body is required.');
      return client._request({ endpoint: '/v1/support-tickets', method: 'POST', body: data, sendJWT: true });
    },

    /** List the caller's own tickets + (for resource admins) tickets in their scope. */
    async listSupportTickets(params: SupportTicketListParams = {}): Promise<SupportTicketListResponse> {
      return client._request({ endpoint: `/v1/support-tickets${buildQuery(params as Record<string, unknown>)}`, method: 'GET', sendJWT: true });
    },

    async getSupportTicket(ticketId: string): Promise<SupportTicket> {
      if (!ticketId) throw new Error('ticketId is required.');
      return client._request({
        endpoint: `/v1/support-tickets/${encodeURIComponent(ticketId)}`,
        method: 'GET',
        sendJWT: true,
      });
    },

    /** Workspaces/projects the caller may scope a new ticket to. */
    async getSupportTicketScopeOptions(): Promise<SupportTicketScopeOptions> {
      return client._request({ endpoint: '/v1/support-tickets/scope-options', method: 'GET', sendJWT: true });
    },
  };
}

import NuramaClient from '../NuramaClient.js';
import { type ObjectId, type ReadState, type ListUserFeedParams, type CursorPaginatedUserFeed, type UserFeedEntry, type UserFeedSummary } from '@nurama/types';
/**
 * Defines the methods for the caller's own cross-project feed: project
 * activity from every project they can read, and the things waiting on them.
 * Every call is scoped to the signed-in user.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the user feed methods.
 */
export default function createUserFeedMethods(client: NuramaClient): {
    /**
     * Gets one page of your feed, most recent first. Pass `category` for only
     * project activity or only action items; dismissed items are left out
     * unless `states` asks for them.
     * @returns {Promise<CursorPaginatedUserFeed>}
     */
    getFeed(params?: ListUserFeedParams): Promise<CursorPaginatedUserFeed>;
    /**
     * Gets every badge the app shows: open action items, project activity since
     * you last caught up, and that activity broken down by project in
     * `byProject` — one row per project with something new, for the badge on
     * its icon. The two totals stop at 100.
     *
     * The totals and `byProject` move independently: the totals are measured
     * against your feed-wide marker, each `byProject` row against that
     * project's own. So catching up in the feed does not clear project badges,
     * and reading one project does not clear the feed's own count.
     * @returns {Promise<UserFeedSummary>}
     */
    getSummary(): Promise<UserFeedSummary>;
    /**
     * Gets your reading position in your feed's project activity.
     * @returns {Promise<ReadState>}
     */
    getReadState(): Promise<ReadState>;
    /**
     * Marks your feed's project activity as caught up. Pass `lastReadAt`
     * (epoch ms) to catch up to the newest card you had loaded; omit it to
     * catch up to now. The marker only moves forward.
     * @returns {Promise<ReadState>}
     */
    markCaughtUp(lastReadAt?: number): Promise<ReadState>;
    /**
     * Clears one of your action items (`dismissed`), or brings a cleared one
     * back (`open`).
     * @returns {Promise<UserFeedEntry>} The updated item.
     */
    setEntryState(entryId: ObjectId, state: "dismissed" | "open"): Promise<UserFeedEntry>;
    /**
     * Clears every open action item up to `before` (epoch ms) — the newest one
     * you had loaded — so one that arrived since stays. Omit it to clear
     * everything open now.
     * @returns {Promise<{ dismissed: number }>}
     */
    dismissAll(before?: number): Promise<{
        dismissed: number;
    }>;
};
//# sourceMappingURL=userFeed.d.ts.map
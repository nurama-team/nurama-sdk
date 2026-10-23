/**
 * How far one person has read through something whose activity is time-ordered.
 *
 * Generic: a project's event feed, a member chat, a list of highlights. The
 * shape is the same whatever is being read, so one response type covers all of
 * them.
 *
 * `lastReadAt` is a boundary on that resource's own activity time, not a pointer
 * at the last thing read. In the feed it is compared against
 * `FeedEvent.lastActivityAt`, which MOVES when a card gets new activity: a card
 * you had read that someone comments on drops below the line and is new again.
 */
export interface ReadState {
  /** Epoch ms. Null when this person has never recorded a position here. */
  lastReadAt: number | null;
  /**
   * Activity newer than `lastReadAt`, excluding anything this person is
   * themselves the actor on. 0 when `lastReadAt` is null.
   */
  unreadCount: number;
}

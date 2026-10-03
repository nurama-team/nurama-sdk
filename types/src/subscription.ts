import type { ObjectId } from './common';
import type { PublicUser } from './user';
import type { Workspace } from './workspace';
import type { Product } from './product';

/**
 * Represents a product within a subscription.
 */
export interface SubscriptionProduct {
  /**
   * The product ID.
   * @format objectId
   */
  productId: ObjectId;
  /**
   * The populated product details.
   */
  product?: Product;
  /**
   * Quantity of this product in the subscription.
   */
  quantity?: number;
}

/**
 * Represents a user's or workspace's subscription.
 */
export interface Subscription {
  /**
   * Unique identifier for the subscription.
   * @format objectId
   */
  _id?: ObjectId;
  /**
   * The owner of the subscription.
   * @format objectId
   */
  ownerId: ObjectId;
  /**
   * The populated owner (user) details.
   */
  owner?: PublicUser;
  /**
   * The resource this subscription applies to.
   * @format objectId
   */
  resourceId: ObjectId;
  /**
   * The populated resource details.
   */
  resource?: Workspace;
  /**
   * The type of resource the subscription applies to.
   */
  resourceType: 'workspace';
  /**
   * Whether this subscription is managed by the payment provider.
   */
  paymentProviderManaged?: boolean;
  /**
   * The billing period for the subscription.
   */
  billingPeriod?: 'month' | 'year';
  /**
   * The currency of the subscription.
   */
  currency: 'usd' | 'gbp';
  /**
   * The payment provider for this subscription.
   */
  paymentProvider: 'stripe' | 'manualInvoice' | 'testProvider' | 'free';
  /**
   * The payment provider specific subscription ID.
   */
  paymentProviderId?: string;
  /**
   * Whether the subscription expires.
   * @default true
   */
  expires?: boolean;
  /**
   * Subscription start date.
   * @format date-time
   */
  startDate?: string;
  /**
   * Subscription end date.
   * @format date-time
   */
  endDate?: string;
  /**
   * Number of user seats included.
   * @default 0
   */
  seats?: number;
  /**
   * Storage size in gigabytes included.
   * @default 0
   */
  storageSizeInGB?: number;
  /**
   * Nurama Credits included with the subscription. Field name retains the
   * legacy `credits` shape for wire-level back-compat; the underlying pool
   * is the service-agnostic Nurama Credit balance, spendable on AI today and
   * additional services in future.
   * @default 0
   */
  credits?: number;
  /**
   * Current subscription status.
   */
  status: 'active' | 'pending' | 'canceled' | 'expired' | 'pastDue' | 'paused' | 'paymentFailed' | 'unpaid';
  /**
   * Whether to cancel at the end of the current period.
   * @default false
   */
  cancelAtPeriodEnd?: boolean;
  /**
   * Date when cancellation is scheduled.
   * @format date-time
   */
  scheduledCancellationDate?: string;
  /**
   * Products included in this subscription.
   */
  products?: SubscriptionProduct[];
  /**
   * Subscription creation timestamp.
   * @format date-time
   */
  createdAt?: string;
  /**
   * Subscription last update timestamp.
   * @format date-time
   */
  updatedAt?: string;
}
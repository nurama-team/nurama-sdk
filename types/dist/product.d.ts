import type { ObjectId } from './common';
/**
 * Represents price information for a product.
 */
export interface ProductPrice {
    /**
     * Payment provider specific price ID.
     */
    providerId?: string;
    /**
     * The currency for this price.
     */
    currency: 'usd' | 'gbp';
    /**
     * The price amount.
     */
    price: number;
    /**
     * The billing period for this price.
     */
    billingPeriod?: 'month' | 'year';
}
/**
 * Represents payment provider configuration for a product.
 */
export interface ProductPaymentProviders {
    stripe?: string;
    manualInvoice?: string;
    testProvider?: string;
    free?: string;
}
/**
 * Represents resource restrictions for a product.
 */
export interface ProductRestriction {
    /**
     * The type of resource this restriction applies to.
     */
    resourceType: 'user' | 'workspace';
    /**
     * The ID of the specific resource.
     * @format objectId
     */
    resourceId: ObjectId;
}
/**
 * Represents a product that can be purchased.
 */
export interface Product {
    /**
     * Unique identifier for the product.
     * @format objectId
     */
    _id?: ObjectId;
    /**
     * Machine readable camelCase name.
     */
    token: string;
    /**
     * Human readable name.
     */
    name: string;
    /**
     * The type of product.
     */
    productType: 'basePlan' | 'addSeat' | 'addStorage' | 'addCredits';
    /**
     * Payment provider configurations.
     */
    paymentProviders?: ProductPaymentProviders;
    /**
     * Payment provider specific product ID.
     */
    providerId?: string;
    /**
     * Internal notes about the product (private field).
     */
    notes?: string;
    /**
     * Resource restrictions for this product (private field).
     */
    restrictTo?: ProductRestriction[];
    /**
     * Available prices for this product.
     */
    prices: ProductPrice[];
    /**
     * Number of seats included.
     * @default 0
     */
    seats: number;
    /**
     * Storage size included in GB.
     * @default 0
     */
    storageSizeInGB: number;
    /**
     * Nurama Credits included with this product. Field name kept as `credits`
     * for wire-level back-compat; the underlying pool is service-agnostic.
     * @default 0
     */
    credits: number;
    /**
     * Per-product project cap. `null` / `undefined` means unlimited.
     */
    maxProjects?: number | null;
    /**
     * Per-product creator-member cap. `null` / `undefined` means unlimited.
     */
    maxCreators?: number | null;
    /**
     * Per-product reviewer-member cap. `null` / `undefined` means unlimited.
     */
    maxReviewers?: number | null;
    /**
     * Product status.
     */
    status: 'active' | 'inactive';
    /**
     * Product creation timestamp.
     * @format date-time
     */
    createdAt?: string;
    /**
     * Product last update timestamp.
     * @format date-time
     */
    updatedAt?: string;
}

import NuramaClient from '../NuramaClient.js';
export interface StripeCheckoutRequest {
    resourceId: string;
    productId: string;
    currency: 'usd' | 'gbp';
    billingPeriod: 'month' | 'year';
}
export interface ManualCheckoutRequest {
    resourceId: string;
    productId: string;
    currency: 'usd' | 'gbp';
    billingPeriod: 'month' | 'year';
}
export interface StripeCheckoutResponse {
    url: string;
}
export interface StripeCustomerResponse {
    customerId: string;
}
export interface StripePortalResponse {
    url: string;
}
/**
 * Defines payment-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the payment-related methods.
 */
export default function createPaymentMethods(client: NuramaClient): {
    /**
     * Create a Stripe subscription checkout session.
     * Requires authentication and permission.
     * @param {StripeCheckoutRequest} checkoutData - The checkout request data.
     * @returns {Promise<StripeCheckoutResponse>} Object containing the Stripe checkout session URL.
     */
    createStripeCheckout(checkoutData: StripeCheckoutRequest): Promise<StripeCheckoutResponse>;
    /**
     * Create a manual subscription without Stripe processing.
     * Requires authentication and permission.
     * @param {ManualCheckoutRequest} checkoutData - The manual checkout request data.
     * @returns {Promise<any>} The created subscription object.
     */
    createManualCheckout(checkoutData: ManualCheckoutRequest): Promise<any>;
    /**
     * Create a new Stripe customer for the authenticated user.
     * Requires authentication and permission.
     * @returns {Promise<StripeCustomerResponse>} Object containing the Stripe customer ID.
     */
    createStripeCustomer(): Promise<StripeCustomerResponse>;
    /**
     * Generate a URL for the Stripe customer portal for subscription management.
     * Requires authentication and permission.
     * @returns {Promise<StripePortalResponse>} Object containing the Stripe portal session URL.
     */
    getStripePortalUrl(): Promise<StripePortalResponse>;
};
//# sourceMappingURL=payment.d.ts.map
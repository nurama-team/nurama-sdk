import NuramaClient from '../NuramaClient.js';

// --- Request Body Interfaces ---
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

// --- Response Interfaces ---
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
export default function createPaymentMethods(client: NuramaClient) {
  return {
    /**
     * Create a Stripe subscription checkout session.
     * Requires authentication and permission.
     * @param {StripeCheckoutRequest} checkoutData - The checkout request data.
     * @returns {Promise<StripeCheckoutResponse>} Object containing the Stripe checkout session URL.
     */
    async createStripeCheckout(checkoutData: StripeCheckoutRequest): Promise<StripeCheckoutResponse> {
      if (!checkoutData.resourceId) throw new Error('resourceId is required.');
      if (!checkoutData.productId) throw new Error('productId is required.');
      if (!checkoutData.currency) throw new Error('currency is required.');
      if (!checkoutData.billingPeriod) throw new Error('billingPeriod is required.');
      
      return client._request<StripeCheckoutResponse>({
        method: 'POST',
        endpoint: '/v1/payments/stripe/checkout',
        body: checkoutData,
        sendJWT: true,
      });
    },

    /**
     * Create a manual subscription without Stripe processing.
     * Requires authentication and permission.
     * @param {ManualCheckoutRequest} checkoutData - The manual checkout request data.
     * @returns {Promise<any>} The created subscription object.
     */
    async createManualCheckout(checkoutData: ManualCheckoutRequest): Promise<any> {
      if (!checkoutData.resourceId) throw new Error('resourceId is required.');
      if (!checkoutData.productId) throw new Error('productId is required.');
      if (!checkoutData.currency) throw new Error('currency is required.');
      if (!checkoutData.billingPeriod) throw new Error('billingPeriod is required.');
      
      return client._request<any>({
        method: 'POST',
        endpoint: '/v1/payments/manual/checkout',
        body: checkoutData,
        sendJWT: true,
      });
    },

    /**
     * Create a new Stripe customer for the authenticated user.
     * Requires authentication and permission.
     * @returns {Promise<StripeCustomerResponse>} Object containing the Stripe customer ID.
     */
    async createStripeCustomer(): Promise<StripeCustomerResponse> {
      return client._request<StripeCustomerResponse>({
        method: 'POST',
        endpoint: '/v1/payments/stripe/customer',
        sendJWT: true,
      });
    },

    /**
     * Generate a URL for the Stripe customer portal for subscription management.
     * Requires authentication and permission.
     * @returns {Promise<StripePortalResponse>} Object containing the Stripe portal session URL.
     */
    async getStripePortalUrl(): Promise<StripePortalResponse> {
      return client._request<StripePortalResponse>({
        method: 'GET',
        endpoint: '/v1/payments/stripe/portal',
        sendJWT: true,
      });
    },
  };
}
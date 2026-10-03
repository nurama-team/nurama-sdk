/**
 * Defines payment-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the payment-related methods.
 */
export default function createPaymentMethods(client) {
    return {
        /**
         * Create a Stripe subscription checkout session.
         * Requires authentication and permission.
         * @param {StripeCheckoutRequest} checkoutData - The checkout request data.
         * @returns {Promise<StripeCheckoutResponse>} Object containing the Stripe checkout session URL.
         */
        async createStripeCheckout(checkoutData) {
            if (!checkoutData.resourceId)
                throw new Error('resourceId is required.');
            if (!checkoutData.productId)
                throw new Error('productId is required.');
            if (!checkoutData.currency)
                throw new Error('currency is required.');
            if (!checkoutData.billingPeriod)
                throw new Error('billingPeriod is required.');
            return client._request({
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
        async createManualCheckout(checkoutData) {
            if (!checkoutData.resourceId)
                throw new Error('resourceId is required.');
            if (!checkoutData.productId)
                throw new Error('productId is required.');
            if (!checkoutData.currency)
                throw new Error('currency is required.');
            if (!checkoutData.billingPeriod)
                throw new Error('billingPeriod is required.');
            return client._request({
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
        async createStripeCustomer() {
            return client._request({
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
        async getStripePortalUrl() {
            return client._request({
                method: 'GET',
                endpoint: '/v1/payments/stripe/portal',
                sendJWT: true,
            });
        },
    };
}
//# sourceMappingURL=payment.js.map
import NuramaClient from '../NuramaClient.js';
import { type Product } from '@nurama/types';
export interface GetWorkspaceProductsParams {
    productType?: 'basePlan' | 'addSeat' | 'addStorage' | 'addCredits' | 'enableBoards';
    paymentProvider?: 'stripe' | 'manualInvoice';
}
export type ProductResponse = Product;
/**
 * Defines product-related methods for the NuramaClient.
 * @param {NuramaClient} client - The NuramaClient instance.
 * @returns {object} An object containing the product-related methods.
 */
export default function createProductMethods(client: NuramaClient): {
    /**
     * Retrieves available products for a specific workspace, considering restrictions.
     * Requires authentication and permission.
     * @param {string} workspaceId - The ID of the workspace.
     * @param {GetWorkspaceProductsParams} [params] - Optional query parameters.
     * @returns {Promise<ProductResponse[]>} An array of available product objects.
     */
    getWorkspaceProducts(workspaceId: string, params?: GetWorkspaceProductsParams): Promise<ProductResponse[]>;
    /**
     * List active starter-package "plans" available to the caller,
     * scoped by user-level restrictions but NOT bound to a workspace.
     * Used by the post-signup plan-selection overlay before any
     * workspace exists.
     * @returns {Promise<ProductResponse[]>} Active starter-package plans.
     */
    listPlans(): Promise<ProductResponse[]>;
    /**
     * Suggested billing currency for the caller, derived server-side from
     * the CDN geo header. A *default* for the currency selector only — the
     * user can override. Falls back to `usd` with no geo header.
     */
    getSuggestedCurrency(): Promise<{
        currency: SupportedCurrency;
        country: string | null;
        locked?: boolean;
        supported: SupportedCurrency[];
    }>;
};
export type SupportedCurrency = 'gbp' | 'usd' | 'eur';
//# sourceMappingURL=product.d.ts.map
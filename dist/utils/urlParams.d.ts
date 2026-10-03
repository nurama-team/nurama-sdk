/**
 * Utility functions for handling URL parameters
 */
/**
 * Converts a parameter object to URL-safe query parameters.
 * Arrays are serialized as comma-separated values, using bracket notation, or as repeated parameters.
 * Objects are serialized as JSON strings.
 *
 * @param params - The parameter object to convert
 * @param options - Options for serialization
 * @returns An array of [key, value] pairs suitable for URLSearchParams
 */
export interface UrlParamsOptions {
    /** How to handle arrays: 'comma' for comma-separated, 'brackets' for key[]=value&key[]=value2, 'repeat' for key=value1&key=value2 */
    arrayFormat?: 'comma' | 'brackets' | 'repeat';
    /** How to handle nested objects: 'json' to stringify, 'dot' for dot notation, 'bracket' for key[subkey]=value */
    objectFormat?: 'json' | 'dot' | 'bracket';
    /** Whether to encode values (default: true) */
    encode?: boolean;
}
export declare function parseUrlParams(params: Record<string, any>, options?: UrlParamsOptions): Array<[string, string]>;
/**
 * Converts parsed URL parameters back to a URLSearchParams object
 * @param params - The parsed parameters as key-value pairs
 * @returns URLSearchParams object
 */
export declare function createUrlSearchParams(params: Array<[string, string]>): URLSearchParams;
/**
 * Convenience function that combines parseUrlParams and createUrlSearchParams
 * @param params - The parameter object to convert
 * @param options - Options for serialization
 * @returns URLSearchParams object
 */
export declare function paramsToUrlSearchParams(params: Record<string, any>, options?: UrlParamsOptions): URLSearchParams;
//# sourceMappingURL=urlParams.d.ts.map
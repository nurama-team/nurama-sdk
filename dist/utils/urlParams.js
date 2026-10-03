/**
 * Utility functions for handling URL parameters
 */
export function parseUrlParams(params, options = {}) {
    const { arrayFormat = 'repeat', // Changed default to repeat for backend compatibility
    objectFormat = 'bracket', // Changed default to bracket for API compatibility
    encode = true // Changed default to true as requested
     } = options;
    const result = [];
    const encodeValue = (value) => {
        return encode ? encodeURIComponent(value) : value;
    };
    const processValue = (key, value) => {
        if (value === null || value === undefined) {
            return; // Skip null/undefined values
        }
        if (Array.isArray(value)) {
            if (arrayFormat === 'comma') {
                // Convert array to comma-separated string
                result.push([key, encodeValue(value.join(','))]);
            }
            else if (arrayFormat === 'brackets') {
                // Use bracket notation: key[]=value1&key[]=value2
                const bracketKey = `${key}[]`;
                value.forEach((item) => {
                    result.push([bracketKey, encodeValue(String(item))]);
                });
            }
            else if (arrayFormat === 'repeat') {
                // Use repeated key: key=value1&key=value2
                value.forEach((item) => {
                    result.push([key, encodeValue(String(item))]);
                });
            }
        }
        else if (value instanceof Date) {
            // Handle Date objects specifically
            result.push([key, encodeValue(value.toString())]);
        }
        else if (typeof value === 'object') {
            if (objectFormat === 'json') {
                // Stringify objects as JSON
                result.push([key, encodeValue(JSON.stringify(value))]);
            }
            else if (objectFormat === 'dot') {
                // Use dot notation for nested objects
                flattenObject(value, key, result, encodeValue);
            }
            else if (objectFormat === 'bracket') {
                // Use bracket notation for nested objects
                flattenObjectBracket(value, key, result, encodeValue);
            }
        }
        else if (typeof value === 'boolean') {
            result.push([key, encodeValue(value.toString())]);
        }
        else if (typeof value === 'number') {
            result.push([key, encodeValue(value.toString())]);
        }
        else if (typeof value === 'string') {
            result.push([key, encodeValue(value)]);
        }
        else {
            // For any other type, convert to string
            result.push([key, encodeValue(String(value))]);
        }
    };
    // Process each parameter
    Object.entries(params).forEach(([key, value]) => {
        processValue(key, value);
    });
    return result;
}
/**
 * Flattens nested objects using dot notation
 * @param obj - The object to flatten
 * @param prefix - The current key prefix
 * @param result - The result array to populate
 * @param encodeValue - Function to encode values
 */
function flattenObject(obj, prefix, result, encodeValue) {
    Object.entries(obj).forEach(([key, value]) => {
        const newKey = `${prefix}.${key}`;
        if (value === null || value === undefined) {
            return;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            flattenObject(value, newKey, result, encodeValue);
        }
        else if (Array.isArray(value)) {
            result.push([newKey, encodeValue(value.join(','))]);
        }
        else {
            result.push([newKey, encodeValue(String(value))]);
        }
    });
}
/**
 * Flattens nested objects using bracket notation
 * @param obj - The object to flatten
 * @param prefix - The current key prefix
 * @param result - The result array to populate
 * @param encodeValue - Function to encode values
 */
function flattenObjectBracket(obj, prefix, result, encodeValue) {
    Object.entries(obj).forEach(([key, value]) => {
        const newKey = `${prefix}[${key}]`;
        if (value === null || value === undefined) {
            return;
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            flattenObjectBracket(value, newKey, result, encodeValue);
        }
        else if (Array.isArray(value)) {
            result.push([newKey, encodeValue(value.join(','))]);
        }
        else {
            result.push([newKey, encodeValue(String(value))]);
        }
    });
}
/**
 * Converts parsed URL parameters back to a URLSearchParams object
 * @param params - The parsed parameters as key-value pairs
 * @returns URLSearchParams object
 */
export function createUrlSearchParams(params) {
    const searchParams = new URLSearchParams();
    params.forEach(([key, value]) => {
        searchParams.append(key, value);
    });
    return searchParams;
}
/**
 * Convenience function that combines parseUrlParams and createUrlSearchParams
 * @param params - The parameter object to convert
 * @param options - Options for serialization
 * @returns URLSearchParams object
 */
export function paramsToUrlSearchParams(params, options) {
    // Force encode: false because URLSearchParams.toString() handles encoding.
    // Pre-encoding here would cause double-encoding (e.g. space → %20 → %2520).
    const parsedParams = parseUrlParams(params, { ...options, encode: false });
    return createUrlSearchParams(parsedParams);
}
//# sourceMappingURL=urlParams.js.map
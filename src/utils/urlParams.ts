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

export function parseUrlParams(
  params: Record<string, any>, 
  options: UrlParamsOptions = {}
): Array<[string, string]> {
  const {
    arrayFormat = 'repeat', // Changed default to repeat for backend compatibility
    objectFormat = 'bracket', // Changed default to bracket for API compatibility
    encode = true // Changed default to true as requested
  } = options;

  const result: Array<[string, string]> = [];

  const encodeValue = (value: string): string => {
    return encode ? encodeURIComponent(value) : value;
  };

  const processValue = (key: string, value: any): void => {
    if (value === null || value === undefined) {
      return; // Skip null/undefined values
    }

    if (Array.isArray(value)) {
      if (arrayFormat === 'comma') {
        // Convert array to comma-separated string
        result.push([key, encodeValue(value.join(','))]);
      } else if (arrayFormat === 'brackets') {
        // Use bracket notation: key[]=value1&key[]=value2
        const bracketKey = `${key}[]`;
        value.forEach((item: any) => {
          result.push([bracketKey, encodeValue(String(item))]);
        });
      } else if (arrayFormat === 'repeat') {
        // Use repeated key: key=value1&key=value2
        value.forEach((item: any) => {
          result.push([key, encodeValue(String(item))]);
        });
      }
    } else if (value instanceof Date) {
      // Handle Date objects specifically
      result.push([key, encodeValue(value.toString())]);
    } else if (typeof value === 'object') {
      if (objectFormat === 'json') {
        // Stringify objects as JSON
        result.push([key, encodeValue(JSON.stringify(value))]);
      } else if (objectFormat === 'dot') {
        // Use dot notation for nested objects
        flattenObject(value, key, result, encodeValue);
      } else if (objectFormat === 'bracket') {
        // Use bracket notation for nested objects
        flattenObjectBracket(value, key, result, encodeValue);
      }
    } else if (typeof value === 'boolean') {
      result.push([key, encodeValue(value.toString())]);
    } else if (typeof value === 'number') {
      result.push([key, encodeValue(value.toString())]);
    } else if (typeof value === 'string') {
      result.push([key, encodeValue(value)]);
    } else {
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
function flattenObject(
  obj: Record<string, any>, 
  prefix: string, 
  result: Array<[string, string]>,
  encodeValue: (value: string) => string
): void {
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = `${prefix}.${key}`;
    
    if (value === null || value === undefined) {
      return;
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, result, encodeValue);
    } else if (Array.isArray(value)) {
      result.push([newKey, encodeValue(value.join(','))]);
    } else {
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
function flattenObjectBracket(
  obj: Record<string, any>, 
  prefix: string, 
  result: Array<[string, string]>,
  encodeValue: (value: string) => string
): void {
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = `${prefix}[${key}]`;
    
    if (value === null || value === undefined) {
      return;
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      flattenObjectBracket(value, newKey, result, encodeValue);
    } else if (Array.isArray(value)) {
      result.push([newKey, encodeValue(value.join(','))]);
    } else {
      result.push([newKey, encodeValue(String(value))]);
    }
  });
}

/**
 * Converts parsed URL parameters back to a URLSearchParams object
 * @param params - The parsed parameters as key-value pairs
 * @returns URLSearchParams object
 */
export function createUrlSearchParams(params: Array<[string, string]>): URLSearchParams {
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
export function paramsToUrlSearchParams(
  params: Record<string, any>,
  options?: UrlParamsOptions
): URLSearchParams {
  // Force encode: false because URLSearchParams.toString() handles encoding.
  // Pre-encoding here would cause double-encoding (e.g. space → %20 → %2520).
  const parsedParams = parseUrlParams(params, { ...options, encode: false });
  return createUrlSearchParams(parsedParams);
} 

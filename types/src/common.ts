/**
 * Represents a MongoDB-style ObjectId, typically a 24-character hexadecimal string.
 * @pattern ^[0-9a-fA-F]{24}$
 */
export type ObjectId = string;

/**
 * Represents an error response structure.
 */
export interface ErrorResponse {
  /**
   * The type identifier for the error.
   */
  type: string;
  /**
   * The HTTP status code associated with the error.
   */
  code: number;
  /**
   * A human-readable message describing the error.
   */
  message: string;
} 
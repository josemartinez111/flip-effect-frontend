// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//    LIB > UTILS > ERROR-HANDLING >> TRY-CATCH-HANDLER.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export interface AsyncActionParams<TData> {
  asyncActionCallback: () => Promise<TData>;
  errorContext?: string;  // Optional context identifier for error messages
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
/**
 * A generic error handler for asynchronous operations.
 * Provides consistent error handling and logging across the application.
 *
 * @template TData - The type of data returned by the async operation
 * @param {AsyncActionParams<TData>} params - Object containing the async callback and error context
 * @param {() => Promise<TData>} params.asyncActionCallback - The async operation to execute
 * @param {string} [params.errorContext='GENERAL'] - Context identifier for error messages
 * @returns {Promise<TData | undefined>} - The result of the async operation or undefined
 * @throws {Error} Rethrows the caught error after logging
 *
 * @example
 * // Basic usage with error context
 * await tryCatchHandler({
 *   asyncActionCallback: async () => {
 *     const response = await fetch('https://api.example.com/data');
 *     return response.json();
 *   },
 *   errorContext: 'FETCH_USER_DATA'
 * });
 * // Error output: [ERROR FETCH_USER_DATA]: Network error
 *
 * @example
 * // Usage with typed return data and error context
 * interface UserData {
 *   id: number;
 *   name: string;
 * }
 *
 * const result = await tryCatchHandler<UserData>({
 *   asyncActionCallback: async () => {
 *     const response = await fetch('https://api.example.com/user');
 *     return response.json();
 *   },
 *   errorContext: 'USER_API'
 * });
 * // Error output: [ERROR USER_API]: Invalid JSON
 *
 * @example
 * // Error handling with default context
 * await tryCatchHandler({
 *   asyncActionCallback: async () => {
 *     throw new Error('Custom error message');
 *   }
 * });
 * // Error output: [ERROR GENERAL]: Custom error message
 *
 * @example
 * // TypeScript inference with void returns
 * await tryCatchHandler({
 *   asyncActionCallback: async () => {
 *     await fetch('https://api.example.com/action');
 *   },
 *   errorContext: 'NOTIFICATION_API'
 * });
 * // Error output: [ERROR NOTIFICATION_API]: Request failed
 *
 * @example
 * // Real-world usage with PayPal redirect
 * await tryCatchHandler({
 *   asyncActionCallback: async () => {
 *     await fetch(paypalUrl);
 *     window.location.href = paypalUrl;
 *   },
 *   errorContext: 'PAYPAL_REDIRECT'
 * });
 * // Error output: [ERROR PAYPAL_REDIRECT]: Failed to redirect
 */
// TODO: Add file to template!!!
export async function tryCatchHandler<TData>({
  asyncActionCallback,
  errorContext = 'GENERAL',
}: AsyncActionParams<TData>): Promise<TData | undefined> {
  try {
    const result = await asyncActionCallback();
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? `[ERROR ${ errorContext }]: ${ error.message }`
      : `[UNKNOWN ERROR ${ errorContext }]: ${ JSON.stringify(error) }`;
    
    console.error(errorMessage);
    // Instead of throwing, just return undefined so caller can handle it
    return undefined;
  }
}

// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

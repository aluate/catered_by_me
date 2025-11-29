// apps/web/src/lib/errors.ts

/**
 * Central error handling and user-friendly message translation
 */

export function apiErrorToMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("failed to fetch") ||
      message.includes("networkerror")
    ) {
      return "We couldn't reach the server. Check your connection and try again.";
    }
    
    // Authentication errors
    if (
      message.includes("jwt") ||
      message.includes("auth") ||
      message.includes("unauthorized") ||
      message.includes("401") ||
      message.includes("session expired")
    ) {
      return "Your session expired. Please sign in again.";
    }
    
    // Not found errors
    if (message.includes("not found") || message.includes("404")) {
      return "That item wasn't found. It may have been deleted.";
    }
    
    // Server errors
    if (message.includes("500") || message.includes("internal server error")) {
      return "Something went wrong on our end. Please try again in a moment.";
    }
    
    // Rate limiting
    if (message.includes("rate limit") || message.includes("429")) {
      return "You're making requests a bit too quickly. Take a breath and try again in a minute.";
    }
    
    // Validation errors
    if (message.includes("validation") || message.includes("invalid")) {
      return "Please check your input and try again.";
    }
    
    // Generic API errors - try to extract detail
    if (message.includes("api error")) {
      // Try to extract the actual error message
      const match = error.message.match(/api error: \d+ - (.+)/i);
      if (match) {
        return match[1];
      }
      return "Something went wrong. Please try again.";
    }
    
    // If it's a user-friendly message already, return it
    if (!message.includes("error") && !message.includes("failed")) {
      return error.message;
    }
    
    // Default fallback
    return "Something went wrong. Please try again.";
  }
  
  // Non-Error objects
  if (typeof error === "string") {
    return error;
  }
  
  return "An unexpected error occurred. Please try again.";
}

/**
 * Check if an error is retryable (network errors, 5xx errors)
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("500") ||
      message.includes("503") ||
      message.includes("502")
    );
  }
  return false;
}

/**
 * Get a retry delay in milliseconds (exponential backoff)
 */
export function getRetryDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10 seconds
}


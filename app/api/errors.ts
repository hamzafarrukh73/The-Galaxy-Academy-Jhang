/**
 * API Error Handling Service
 * Centralized error classification and formatting
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public field?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public fields: Record<string, string> = {}) {
    super(message, 'VALIDATION_ERROR', 422)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access forbidden') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND_ERROR', 404)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Server error') {
    super(message, 'SERVER_ERROR', 500)
    this.name = 'ServerError'
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network error') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

/**
 * Parse API error response and return typed error instance
 */
export function parseApiError(error: unknown): ApiError {
  if (!error) {
    return new NetworkError('Unknown error occurred')
  }

  const errorObj = error as Record<string, unknown>
  const status = (errorObj.status || errorObj.statusCode) as number | undefined
  const data = (errorObj.data || error) as Record<string, unknown>

  // Handle API response errors
  if (data && typeof data === 'object') {
    if (status === 401) {
      return new AuthenticationError(
        (data.message as string) || 'Your session has expired. Please login again.'
      )
    }

    if (status === 403) {
      return new AuthorizationError(
        (data.message as string) || 'You do not have permission to perform this action.'
      )
    }

    if (status === 404) {
      return new NotFoundError((data.message as string) || 'Resource not found')
    }

    if (status === 422 || (data.errors && Object.keys(data.errors as object).length > 0)) {
      return new ValidationError(
        (data.message as string) || 'Validation failed',
        (data.errors as Record<string, string>) || {}
      )
    }

    if (status !== undefined && status >= 500) {
      return new ServerError(
        (data.message as string) || 'Server error. Please try again later.'
      )
    }

    // Generic API error
    return new ApiError(
      (data.message as string) || 'Request failed',
      'API_ERROR',
      status
    )
  }

  // Handle network or parse errors
  const errorMessage = (errorObj.message as string) || ''
  if (errorMessage.includes('fetch')) {
    return new NetworkError(errorMessage)
  }

  return new NetworkError(errorMessage || 'An error occurred')
}

/**
 * Format error for toast notification
 */
export function formatErrorForToast(error: ApiError): {
  title: string
  description: string
  color: 'error' | 'warning'
} {
  if (error instanceof ValidationError) {
    return {
      title: 'Validation Error',
      description: Object.entries(error.fields)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join('\n'),
      color: 'error'
    }
  }

  if (error instanceof AuthenticationError) {
    return {
      title: 'Authentication Error',
      description: error.message,
      color: 'error'
    }
  }

  if (error instanceof AuthorizationError) {
    return {
      title: 'Access Denied',
      description: error.message,
      color: 'error'
    }
  }

  if (error instanceof ServerError) {
    return {
      title: 'Server Error',
      description: error.message,
      color: 'error'
    }
  }

  if (error instanceof NetworkError) {
    return {
      title: 'Connection Error',
      description: error.message,
      color: 'error'
    }
  }

  return {
    title: 'Error',
    description: error.message,
    color: 'error'
  }
}

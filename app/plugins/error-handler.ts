/**
 * Error Handler Plugin
 * Centralizes all API error types, parsing and toast formatting.
 * Provides $parseError and $formatError globally.
 */

// --- ERROR CLASSES ---

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
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
  constructor(message: string = 'Session expired. Please log in again.') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'You do not have permission to perform this action.') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found.') {
    super(message, 'NOT_FOUND_ERROR', 404)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Something went wrong. Please try again later.') {
    super(message, 'SERVER_ERROR', 500)
    this.name = 'ServerError'
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Check your connection.') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

// --- PARSER ---

export function parseApiError(error: unknown): ApiError {
  if (!error) return new NetworkError()

  const e = error as Record<string, unknown>
  const status = (e.status ?? e.statusCode) as number | undefined
  const data = (e.data ?? error) as Record<string, unknown>

  if (typeof data === 'object' && data !== null) {
    const message = (data.message ?? data.detail) as string | undefined

    if (status === 401) return new AuthenticationError(message)
    if (status === 403) return new AuthorizationError(message)
    if (status === 404) return new NotFoundError(message)
    if (status === 422 || (data.errors && Object.keys(data.errors as object).length > 0)) {
      return new ValidationError(message ?? 'Validation failed', data.errors as Record<string, string>)
    }
    if (status !== undefined && status >= 500) return new ServerError(message)

    return new ApiError(message ?? 'Request failed', 'API_ERROR', status)
  }

  const msg = (e.message as string) ?? ''
  return msg.includes('fetch') ? new NetworkError(msg) : new NetworkError(msg || undefined)
}

// --- TOAST FORMATTER ---

type ToastPayload = { title: string, description?: string, color: 'error' | 'warning' | 'neutral' }

export function formatErrorForToast(error: ApiError): ToastPayload {
  const map: [new (...args: never[]) => ApiError, string, ToastPayload['color']][] = [
    [ValidationError, 'Validation Error', 'error'],
    [AuthenticationError, 'Authentication Error', 'error'],
    [AuthorizationError, 'Access Denied', 'error'],
    [ServerError, 'Server Error', 'error'],
    [NetworkError, 'Connection Error', 'error']
  ]

  const match = map.find(([Cls]) => error instanceof Cls)
  return {
    title: match ? match[1] : 'Error',
    description: error.message,
    color: match ? match[2] : 'error'
  }
}

// --- PLUGIN ---

export default defineNuxtPlugin(() => {
  return {
    provide: {
      parseError: parseApiError,
      formatError: formatErrorForToast
    }
  }
})

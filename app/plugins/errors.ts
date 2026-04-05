import type { PostgrestError } from '@supabase/supabase-js'

/**
 * Standard Application Error codes for classification
 */
export enum ErrorCode {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  NETWORK = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

/**
 * Enhanced Error class for better stack traces and metadata
 */
export class AppError extends Error {
  public code: string
  public status?: number
  public details?: unknown
  public originalError?: unknown

  constructor(message: string, options: {
    code?: string | ErrorCode
    status?: number
    details?: unknown
    originalError?: unknown
  } = {}) {
    super(message)
    this.name = this.constructor.name
    this.code = options.code || ErrorCode.UNKNOWN
    this.status = options.status
    this.details = options.details
    this.originalError = options.originalError

    // Maintain correct stack trace (relevant for V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

/**
 * API specific errors (Inherited from AppError)
 */
export class ApiError extends AppError {
  constructor(message: string, options: {
    code?: string | ErrorCode
    status?: number
    details?: unknown
    originalError?: unknown
  } = {}) {
    super(message, { ...options, code: options.code || ErrorCode.API_ERROR })
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public fields: Record<string, string> = {}) {
    super(message, { code: ErrorCode.VALIDATION, status: 422, details: fields })
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Session expired. Please log in again.') {
    super(message, { code: ErrorCode.AUTHENTICATION, status: 401 })
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'You do not have permission to perform this action.') {
    super(message, { code: ErrorCode.AUTHORIZATION, status: 403 })
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found.') {
    super(message, { code: ErrorCode.NOT_FOUND, status: 404 })
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Something went wrong. Please try again later.') {
    super(message, { code: ErrorCode.SERVER, status: 500 })
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Check your connection.') {
    super(message, { code: ErrorCode.NETWORK, status: 0 })
  }
}

/**
 * Intelligent Error Parser
 * Handles Supabase (Postgrest & Auth), Nuxt Fetch, and Generic errors
 */
export function parseError(error: unknown): AppError {
  if (error instanceof AppError) return error

  // 1. Supabase Postgrest Errors
  if (error && typeof error === 'object' && 'code' in error && 'message' in error && 'details' in error) {
    const pgError = error as PostgrestError
    let code: string = ErrorCode.API_ERROR
    let status = (error as Record<string, unknown>).status as number | undefined || 500

    // Map PostgreSql error codes to our internal ErrorCodes
    if (pgError.code === 'PGRST116') {
      code = ErrorCode.NOT_FOUND
      status = 404
    } else if (pgError.code === '42501') {
      code = ErrorCode.AUTHORIZATION
      status = 403
    } else if (pgError.code.startsWith('23')) {
      code = ErrorCode.VALIDATION
      status = 400
    } else if (pgError.code === '23505') {
      code = ErrorCode.CONFLICT
      status = 409
    }

    return new AppError(pgError.message, { code, status, details: pgError.details, originalError: error })
  }

  // 2. Supabase Auth Errors (usually have .name)
  const errObj = error as Record<string, unknown>
  if (errObj && typeof errObj.name === 'string' && (errObj.name.includes('Auth') || errObj.name === 'AuthApiError')) {
    const status = (errObj.status as number) || 400
    let code: string = ErrorCode.API_ERROR
    if (status === 401) code = ErrorCode.AUTHENTICATION
    if (status === 403) code = ErrorCode.AUTHORIZATION

    return new AppError((errObj.message as string) || 'Auth error', { code, status, originalError: error })
  }

  // 3. Nuxt / Fetch Error (H3Error shape)
  if (errObj && errObj.data && typeof errObj.data === 'object' && errObj.data !== null) {
    const status = (errObj.status as number) || (errObj.statusCode as number)
    const errData = errObj.data as Record<string, unknown>
    const message = (errData.message as string) || (errObj.message as string) || 'API request failed'
    let code: string = ErrorCode.API_ERROR

    if (status === 401) code = ErrorCode.AUTHENTICATION
    if (status === 403) code = ErrorCode.AUTHORIZATION
    if (status === 404) code = ErrorCode.NOT_FOUND
    if (status === 422) code = ErrorCode.VALIDATION

    return new AppError(message, {
      code,
      status,
      details: errData.errors || errData.details,
      originalError: error
    })
  }

  // 4. Generic Standard Error
  if (error instanceof Error) {
    return new AppError(error.message, { originalError: error })
  }

  // 5. Fallback for strings or unknown shapes
  return new AppError(String(error || 'An unexpected error occurred'), {
    code: ErrorCode.UNKNOWN
  })
}

/**
 * Formatter for UI (Toasts). Returns a payload compatible with @nuxt/ui useToast().add()
 */
export function formatError(error: unknown) {
  const parsed = parseError(error)

  const titles: Record<string, string> = {
    [ErrorCode.VALIDATION]: 'Validation Failed',
    [ErrorCode.AUTHENTICATION]: 'Authentication Error',
    [ErrorCode.AUTHORIZATION]: 'Access Denied',
    [ErrorCode.NOT_FOUND]: 'Resource Not Found',
    [ErrorCode.NETWORK]: 'Connection Lost',
    [ErrorCode.SERVER]: 'Server Error',
    [ErrorCode.API_ERROR]: 'Service Error',
    [ErrorCode.CONFLICT]: 'Conflict Detected',
    [ErrorCode.UNKNOWN]: 'Error Occurred'
  }

  const isClientError = parsed.status && parsed.status < 500

  return {
    title: titles[parsed.code as ErrorCode] || titles[ErrorCode.UNKNOWN],
    description: parsed.message,
    color: isClientError ? 'warning' : ('error' as const),
    icon: isClientError ? 'i-lucide-alert-triangle' : 'i-lucide-alert-circle'
  } as const
}

declare module '#app' {
  interface NuxtApp {
    $parseError: typeof parseError
    $formatError: typeof formatError
    $handleError: (error: unknown, options?: { notify?: boolean }) => AppError
    $notifyError: (error: unknown) => AppError
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $parseError: typeof parseError
    $formatError: typeof formatError
    $handleError: (error: unknown, options?: { notify?: boolean }) => AppError
    $notifyError: (error: unknown) => AppError
  }
}

export default defineNuxtPlugin(() => {
  const toast = useToast()

  /**
   * Helper to both parse and optionally notify via toast
   */
  const handleAndNotify = (error: unknown, options: { notify?: boolean } = { notify: true }) => {
    const parsed = parseError(error)
    if (options.notify && toast) {
      toast.add(formatError(parsed))
    }
    return parsed
  }

  return {
    provide: {
      parseError,
      formatError,
      handleError: handleAndNotify, // Backward compatibility & reporting
      notifyError: (err: unknown) => handleAndNotify(err, { notify: true })
    }
  }
})

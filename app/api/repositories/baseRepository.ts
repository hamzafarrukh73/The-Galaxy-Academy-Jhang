/**
 * Base Repository - Generic CRUD operations
 * Integrated with OpenAPI auto-generated types
 *
 * @example
 * // Using with OpenAPI generated types
 * import type { components } from '../types'
 * type Item = components['schemas']['Item']
 * export const itemRepository = new BaseRepository<Item>('/api/items/')
 *
 * // Or with custom types
 * interface User { id: number; name: string }
 * export const userRepository = new BaseRepository<User>('/api/users/')
 */

import { apiRequest } from '../client'

/**
 * Base entity interface - all entities should have at minimum an id
 * OpenAPI schemas are automatically compatible with this constraint
 */
export interface BaseEntity {
  id?: number | string
}

/**
 * Generic repository class for CRUD operations
 * Works seamlessly with both OpenAPI-generated types and custom types
 */
export class BaseRepository<T extends BaseEntity = BaseEntity> {
  constructor(
    protected endpoint: string,
    protected requiresAuth: boolean = false
  ) {}

  /**
   * Get single item by ID
   */
  async get(id: number | string): Promise<T> {
    return apiRequest<T>(`${this.endpoint}${id}/`, {
      method: 'GET'
    })
  }

  /**
   * List all items with optional filters
   * Handles both direct array responses and paginated responses (with results property)
   */
  async list(params?: Record<string, string | number | boolean>): Promise<T[]> {
    const queryString = params
      ? `?${new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString()}`
      : ''
    const response = await apiRequest<T[] | { results: T[] }>(`${this.endpoint}${queryString}`, {
      method: 'GET'
    })

    // Handle both direct array response and nested results (paginated)
    return Array.isArray(response) ? response : (response.results || [])
  }

  /**
   * Create new item
   */
  async create(data: Partial<T>): Promise<T> {
    return apiRequest<T>(this.endpoint, {
      method: 'POST',
      body: data
    })
  }

  /**
   * Update existing item (full replacement)
   */
  async update(id: number | string, data: Partial<T>): Promise<T> {
    return apiRequest<T>(`${this.endpoint}${id}/`, {
      method: 'PUT',
      body: data
    })
  }

  /**
   * Partially update item
   */
  async patch(id: number | string, data: Partial<T>): Promise<T> {
    return apiRequest<T>(`${this.endpoint}${id}/`, {
      method: 'PATCH',
      body: data
    })
  }

  /**
   * Delete item
   */
  async delete(id: number | string): Promise<void> {
    await apiRequest(`${this.endpoint}${id}/`, {
      method: 'DELETE'
    })
  }
}

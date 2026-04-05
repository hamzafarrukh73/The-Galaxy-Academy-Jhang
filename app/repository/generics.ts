import type { Tables } from './index'
import type { NuxtSupabaseClient } from '~/plugins/api'

import { BaseRepository } from './base'

export class GenericAPI<T extends keyof Tables> extends BaseRepository {
  protected tableKey: T

  constructor(client: NuxtSupabaseClient, tableKey: T) {
    super(client)
    this.tableKey = tableKey
  }

  protected get query() {
    return this.client.from(this.tableKey)
  }

  /**
   * Fetch a single record by ID
   */
  async get(id: string | number): Promise<Tables[T]['Row'] | null> {
    return await this.request<Tables[T]['Row']>(
      this.query.select('*').eq('id', id as never).maybeSingle()
    )
  }

  /**
   * Fetch a list of records with optional filtering
   */
  async list(options: {
    select?: string
    limit?: number
    sortBy?: string
    ascending?: boolean
    offset?: number
  } = {}): Promise<Tables[T]['Row'][]> {
    let query = this.query.select(options.select || '*')

    if (options.sortBy) {
      query = query.order(options.sortBy as never, { ascending: options.ascending ?? true })
    }

    if (options.limit !== undefined) {
      const from = options.offset ?? 0
      const to = from + options.limit - 1
      query = query.range(from, to)
    }

    return await this.request<Tables[T]['Row'][]>(query as never)
  }

  /**
   * Create a new record
   */
  async create(data: Tables[T]['Insert']): Promise<Tables[T]['Row']> {
    return await this.request<Tables[T]['Row']>(
      this.query.insert(data as never).select().single()
    )
  }

  /**
   * Update an existing record
   */
  async update(id: string | number, data: Tables[T]['Update']): Promise<Tables[T]['Row']> {
    return await this.request<Tables[T]['Row']>(
      this.query.update(data as never).eq('id', id as never).select().single()
    )
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string | number): Promise<void> {
    await this.request(
      this.query.delete().eq('id', id as never)
    )
  }

  /**
   * Upsert a record
   */
  async upsert(data: Tables[T]['Insert']): Promise<Tables[T]['Row']> {
    return await this.request<Tables[T]['Row']>(
      this.query.upsert(data as never).select().single()
    )
  }

  /**
   * Count records in the table
   */
  async count(): Promise<number> {
    const { count, error } = await this.query
      .select('*', { count: 'exact', head: true })

    if (error) {
      const { $handleError } = useNuxtApp()
      throw $handleError(error)
    }

    return count || 0
  }
}

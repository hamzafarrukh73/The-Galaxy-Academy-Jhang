/**
 * Options for listing records
 */
export interface ListOptions<T> {
  limit?: number
  offset?: number
  sortBy?: keyof T & string
  ascending?: boolean
}

/**
 * Base Repository
 * Provides generic CRUD operations using Supabase.
 */
export class BaseRepository<T extends string, M = unknown> {
  constructor(protected table: T) { }

  /**
   * Internal helpers to access Nuxt app provided services.
   * Note: These are getters to ensure they are called within the Nuxt context.
   */
  protected get supabase() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (useNuxtApp() as any).$api
  }

  protected get request() {
    return useNuxtApp().$supabaseRequest
  }

  /**
   * Fetch a single record by ID.
   * Throws if not found (default Supabase behavior with .single()).
   */
  async get(id: string | number): Promise<M> {
    const q = this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single()

    return await this.request<M>(q as PromiseLike<{ data: M | null, error: unknown }>)
  }

  /**
   * Fetch a single record by ID, or return null if not found.
   */
  async findOne(id: string | number): Promise<M | null> {
    const q = this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    return await this.request<M | null>(q as PromiseLike<{ data: M | null, error: unknown }>)
  }

  /**
   * Fetch a list of records with optional querying, pagination and sorting.
   */
  async list(options: ListOptions<M> = {}): Promise<M[]> {
    let q = this.supabase.from(this.table).select('*')

    if (options.sortBy) {
      q = q.order(options.sortBy as string, { ascending: options.ascending ?? true })
    }

    if (options.limit !== undefined) {
      const from = options.offset ?? 0
      const to = from + options.limit - 1
      q = q.range(from, to)
    }

    return await this.request<M[]>(q as PromiseLike<{ data: M[] | null, error: unknown }>)
  }

  /**
   * Create a new record
   */
  async create(data: Record<string, unknown>): Promise<M> {
    const q = this.supabase
      .from(this.table)
      .insert(data)
      .select()
      .single()

    return await this.request<M>(q as PromiseLike<{ data: M | null, error: unknown }>)
  }

  /**
   * Update an existing record
   */
  async update(id: string | number, data: Record<string, unknown>): Promise<M> {
    const q = this.supabase
      .from(this.table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    return await this.request<M>(q as PromiseLike<{ data: M | null, error: unknown }>)
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string | number): Promise<void> {
    const q = this.supabase
      .from(this.table)
      .delete()
      .eq('id', id)

    await this.request<null>(q as PromiseLike<{ data: null | null, error: unknown }>)
  }

  /**
   * Count records in the table
   */
  async count(): Promise<number> {
    const q = this.supabase
      .from(this.table)
      .select('*', { count: 'exact', head: true })

    const { count, error } = await (q as PromiseLike<{ count: number | null, error: unknown }>)

    if (error) {
      const { $parseError } = useNuxtApp()
      throw $parseError(error)
    }

    return count || 0
  }

  /**
   * Check if a record exists
   */
  async exists(id: string | number): Promise<boolean> {
    const item = await this.findOne(id)
    return !!item
  }
}

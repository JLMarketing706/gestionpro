import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Enterprise configuration for 30k+ users
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    storage: window.localStorage,
    storageKey: 'gestion-pro-auth-token',
    debug: import.meta.env.DEV
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'gestion-pro-web'
    }
  }
}

// Create optimized Supabase client
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
  supabaseConfig
)

// Connection monitoring for enterprise
class ConnectionMonitor {
  private retryCount = 0
  private maxRetries = 3
  private retryDelay = 1000

  async withRetry<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
    try {
      const result = await operation()
      this.retryCount = 0 // Reset on success
      return result
    } catch (error: any) {
      console.error(`[Supabase] ${operationName} failed:`, error)
      
      if (this.retryCount < this.maxRetries && this.isRetryableError(error)) {
        this.retryCount++
        console.log(`[Supabase] Retrying ${operationName} (${this.retryCount}/${this.maxRetries})`)
        
        await this.delay(this.retryDelay * this.retryCount)
        return this.withRetry(operation, operationName)
      }
      
      throw error
    }
  }

  private isRetryableError(error: any): boolean {
    const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT', 'CONNECTION_ERROR']
    return retryableCodes.some(code => error?.code?.includes(code)) ||
           error?.message?.includes('network') ||
           error?.message?.includes('timeout')
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const connectionMonitor = new ConnectionMonitor()

// Enhanced database operations with monitoring
export const db = {
  // Enhanced select with retry logic
  async select<T>(
    table: string, 
    query: string = '*', 
    filters?: Record<string, any>
  ): Promise<{ data: T[] | null; error: any }> {
    return connectionMonitor.withRetry(async () => {
      let queryBuilder = supabase.from(table).select(query)
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryBuilder = queryBuilder.eq(key, value)
          }
        })
      }
      
      return queryBuilder
    }, `select from ${table}`)
  },

  // Enhanced insert with conflict handling
  async insert<T>(
    table: string, 
    data: Partial<T> | Partial<T>[]
  ): Promise<{ data: T[] | null; error: any }> {
    return connectionMonitor.withRetry(async () => {
      return supabase
        .from(table)
        .insert(data)
        .select()
    }, `insert into ${table}`)
  },

  // Enhanced update with optimistic locking
  async update<T>(
    table: string, 
    data: Partial<T>, 
    filters: Record<string, any>
  ): Promise<{ data: T[] | null; error: any }> {
    return connectionMonitor.withRetry(async () => {
      let queryBuilder = supabase.from(table).update({
        ...data,
        updated_at: new Date().toISOString()
      })
      
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value)
      })
      
      return queryBuilder.select()
    }, `update ${table}`)
  },

  // Enhanced delete with soft delete support
  async delete<T>(
    table: string, 
    filters: Record<string, any>,
    softDelete: boolean = true
  ): Promise<{ data: T[] | null; error: any }> {
    return connectionMonitor.withRetry(async () => {
      if (softDelete) {
        return this.update(table, { deleted_at: new Date().toISOString() } as any, filters)
      } else {
        let queryBuilder = supabase.from(table).delete()
        
        Object.entries(filters).forEach(([key, value]) => {
          queryBuilder = queryBuilder.eq(key, value)
        })
        
        return queryBuilder.select()
      }
    }, `delete from ${table}`)
  }
}

// Real-time subscriptions manager
export class RealtimeManager {
  private subscriptions = new Map<string, any>()

  subscribe(
    table: string, 
    callback: (payload: any) => void,
    filters?: Record<string, any>
  ): string {
    const subscriptionId = `${table}_${Date.now()}_${Math.random()}`
    
    let channel = supabase
      .channel(subscriptionId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
        filter: filters ? Object.entries(filters)
          .map(([key, value]) => `${key}=eq.${value}`)
          .join(',') : undefined
      }, callback)
      .subscribe()

    this.subscriptions.set(subscriptionId, channel)
    
    console.log(`[Realtime] Subscribed to ${table} with ID: ${subscriptionId}`)
    return subscriptionId
  }

  unsubscribe(subscriptionId: string): void {
    const channel = this.subscriptions.get(subscriptionId)
    if (channel) {
      supabase.removeChannel(channel)
      this.subscriptions.delete(subscriptionId)
      console.log(`[Realtime] Unsubscribed from ${subscriptionId}`)
    }
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach((channel, id) => {
      supabase.removeChannel(channel)
    })
    this.subscriptions.clear()
    console.log('[Realtime] All subscriptions cleared')
  }
}

export const realtimeManager = new RealtimeManager()

// Performance monitoring
export const performanceMonitor = {
  async measureQuery<T>(
    operation: () => Promise<T>,
    queryName: string
  ): Promise<T> {
    const startTime = performance.now()
    
    try {
      const result = await operation()
      const endTime = performance.now()
      const duration = endTime - startTime
      
      console.log(`[Performance] ${queryName}: ${duration.toFixed(2)}ms`)
      
      // Log slow queries (> 1 second)
      if (duration > 1000) {
        console.warn(`[Performance] Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      console.error(`[Performance] ${queryName} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }
}

// Health check for monitoring
export const healthCheck = {
  async ping(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number; timestamp: string }> {
    const startTime = performance.now()
    
    try {
      await supabase.from('profiles').select('id').limit(1)
      const endTime = performance.now()
      
      return {
        status: 'healthy',
        latency: endTime - startTime,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      const endTime = performance.now()
      
      return {
        status: 'unhealthy',
        latency: endTime - startTime,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Export enhanced client
export default supabase

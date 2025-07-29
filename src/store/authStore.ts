import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '@/services/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'admin' | 'supervisor' | 'vendedor' | 'contador' | 'inventario'
  plan: 'emprendedor' | 'comercios' | 'pymes'
  sucursal_id?: string
  config: {
    base_currency: 'ARS' | 'USD'
    active_plan: string
    permissions: string[]
    theme: 'light' | 'dark'
    language: 'es' | 'en'
  }
  created_at: string
  updated_at: string
}

interface AuthState {
  // State
  user: UserProfile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: UserProfile | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  refreshSession: () => Promise<void>
  
  // Getters
  hasPermission: (permission: string) => boolean
  canAccessModule: (module: string) => boolean
  isPlanActive: (feature: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      // Actions
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        })
      },

      setSession: (session) => {
        set({ session })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (error) throw error

          if (data.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()

            if (profile) {
              const userProfile: UserProfile = {
                id: data.user.id,
                email: data.user.email!,
                full_name: profile.full_name || data.user.email!,
                avatar_url: profile.avatar_url,
                role: profile.role || 'vendedor',
                plan: profile.plan || 'emprendedor',
                sucursal_id: profile.sucursal_id,
                config: profile.config || {
                  base_currency: 'ARS',
                  active_plan: 'emprendedor',
                  permissions: [],
                  theme: 'light',
                  language: 'es'
                },
                created_at: profile.created_at,
                updated_at: profile.updated_at
              }

              set({ 
                user: userProfile, 
                session: data.session,
                isAuthenticated: true,
                isLoading: false 
              })
            }
          }

          return { success: true }
        } catch (error: any) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.message || 'Error al iniciar sesión' 
          }
        }
      },

      loginWithGoogle: async () => {
        try {
          set({ isLoading: true })
          
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
          })

          if (error) throw error

          return { success: true }
        } catch (error: any) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.message || 'Error al iniciar sesión con Google' 
          }
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut()
          set({ 
            user: null, 
            session: null, 
            isAuthenticated: false,
            isLoading: false 
          })
        } catch (error) {
          console.error('Error al cerrar sesión:', error)
        }
      },

      updateProfile: async (updates) => {
        try {
          const { user } = get()
          if (!user) throw new Error('Usuario no autenticado')

          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)

          if (error) throw error

          set({ 
            user: { ...user, ...updates, updated_at: new Date().toISOString() }
          })

          return { success: true }
        } catch (error: any) {
          return { 
            success: false, 
            error: error.message || 'Error al actualizar perfil' 
          }
        }
      },

      refreshSession: async () => {
        try {
          const { data } = await supabase.auth.refreshSession()
          if (data.session) {
            set({ session: data.session })
          }
        } catch (error) {
          console.error('Error al refrescar sesión:', error)
        }
      },

      // Getters
      hasPermission: (permission: string) => {
        const { user } = get()
        return user?.config.permissions.includes(permission) || false
      },

      canAccessModule: (module: string) => {
        const { user } = get()
        if (!user) return false

        const modulePermissions: Record<string, string[]> = {
          'ventas': ['emprendedor', 'comercios', 'pymes'],
          'facturacion': ['comercios', 'pymes'],
          'integraciones': ['pymes'],
          'api': ['pymes'],
          'reportes_avanzados': ['comercios', 'pymes']
        }

        return modulePermissions[module]?.includes(user.plan) || false
      },

      isPlanActive: (feature: string) => {
        const { user } = get()
        if (!user) return false

        const planFeatures: Record<string, string[]> = {
          'emprendedor': ['ventas', 'productos', 'clientes', 'presupuestos'],
          'comercios': ['ventas', 'productos', 'clientes', 'presupuestos', 'facturacion', 'mercadopago'],
          'pymes': ['ventas', 'productos', 'clientes', 'presupuestos', 'facturacion', 'mercadopago', 'integraciones', 'api', 'reportes_avanzados']
        }

        return planFeatures[user.plan]?.includes(feature) || false
      }
    }),
    {
      name: 'gestion-pro-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Auto-initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  const { setSession, setUser, setLoading } = useAuthStore.getState()
  
  setSession(session)
  setLoading(false)
  
  if (event === 'SIGNED_OUT') {
    setUser(null)
  }
})

import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { supabase } from '@/services/supabase'

// Lazy loading para performance
const LoginPage = lazy(() => import('@/components/auth/LoginPage'))
const Dashboard = lazy(() => import('@/components/dashboard/Dashboard'))
const VentasPage = lazy(() => import('@/components/ventas/VentasPage'))
const ClientesPage = lazy(() => import('@/components/clientes/ClientesPage'))
const ProductosPage = lazy(() => import('@/components/productos/ProductosPage'))
const InventarioPage = lazy(() => import('@/components/inventario/InventarioPage'))
const ReportesPage = lazy(() => import('@/components/reportes/ReportesPage'))
const ConfiguracionPage = lazy(() => import('@/components/configuracion/ConfiguracionPage'))
const PerfilPage = lazy(() => import('@/components/perfil/PerfilPage'))

// Loading fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Cargando...</p>
    </div>
  </div>
)

const App: React.FC = () => {
  const { isLoading, isAuthenticated, user, setLoading, setUser, setSession } = useAuthStore()

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (session && mounted) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile && mounted) {
            const userProfile = {
              id: session.user.id,
              email: session.user.email!,
              full_name: profile.full_name || session.user.email!,
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

            setUser(userProfile)
            setSession(session)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event)
        
        setSession(session)
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Fetch fresh profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile && mounted) {
            const userProfile = {
              id: session.user.id,
              email: session.user.email!,
              full_name: profile.full_name || session.user.email!,
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

            setUser(userProfile)
          }
        }
        
        setLoading(false)
      }
    )

    // Initialize
    initializeAuth()

    // Cleanup
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setLoading, setUser, setSession])

  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
                } 
              />
              
              {/* Protected routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ventas" 
                element={
                  <ProtectedRoute>
                    <VentasPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/clientes" 
                element={
                  <ProtectedRoute>
                    <ClientesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/productos" 
                element={
                  <ProtectedRoute>
                    <ProductosPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/inventario" 
                element={
                  <ProtectedRoute requiredPermission="inventario">
                    <InventarioPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/reportes" 
                element={
                  <ProtectedRoute requiredRole={['admin', 'supervisor', 'contador']}>
                    <ReportesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/configuracion" 
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <ConfiguracionPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <PerfilPage />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all - redirect to dashboard or login */}
              <Route 
                path="*" 
                element={
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                } 
              />
            </Routes>
          </Suspense>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App

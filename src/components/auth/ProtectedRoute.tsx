import React, { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/common/LoadingScreen'
import { motion } from 'framer-motion'
import type { UserRole, SubscriptionPlan } from '@/types/database'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPlan?: SubscriptionPlan | SubscriptionPlan[]
  requiredPermission?: string | string[]
  fallbackPath?: string
  showUpgradePrompt?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPlan,
  requiredPermission,
  fallbackPath = '/login',
  showUpgradePrompt = true
}) => {
  const location = useLocation()
  const { 
    isAuthenticated, 
    user, 
    isLoading,
    hasPermission,
    canAccessModule,
    isPlanActive 
  } = useAuthStore()
  
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Small delay to ensure auth state is fully initialized
    const timer = setTimeout(() => {
      setChecking(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Still loading auth state
  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // Check role requirements
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(user.role)) {
      return (
        <AccessDenied 
          reason="role"
          requiredRoles={roles}
          userRole={user.role}
          showUpgradePrompt={showUpgradePrompt}
        />
      )
    }
  }

  // Check plan requirements
  if (requiredPlan) {
    const plans = Array.isArray(requiredPlan) ? requiredPlan : [requiredPlan]
    if (!plans.includes(user.plan)) {
      return (
        <AccessDenied 
          reason="plan"
          requiredPlans={plans}
          userPlan={user.plan}
          showUpgradePrompt={showUpgradePrompt}
        />
      )
    }
  }

  // Check permission requirements
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]
    const hasRequiredPermission = permissions.some(permission => hasPermission(permission))
    
    if (!hasRequiredPermission) {
      return (
        <AccessDenied 
          reason="permission"
          requiredPermissions={permissions}
          showUpgradePrompt={showUpgradePrompt}
        />
      )
    }
  }

  // All checks passed - render children
  return <>{children}</>
}

// Access Denied Component
interface AccessDeniedProps {
  reason: 'role' | 'plan' | 'permission'
  requiredRoles?: UserRole[]
  requiredPlans?: SubscriptionPlan[]
  requiredPermissions?: string[]
  userRole?: UserRole
  userPlan?: SubscriptionPlan
  showUpgradePrompt?: boolean
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  reason,
  requiredRoles,
  requiredPlans,
  requiredPermissions,
  userRole,
  userPlan,
  showUpgradePrompt = true
}) => {
  const { user } = useAuthStore()

  const getReasonMessage = () => {
    switch (reason) {
      case 'role':
        return {
          title: 'Acceso restringido por rol',
          description: `Tu rol actual (${userRole}) no tiene permisos para acceder a esta sección.`,
          details: `Roles requeridos: ${requiredRoles?.join(', ')}`,
          actionText: 'Contactar administrador',
          actionType: 'contact' as const
        }
      
      case 'plan':
        return {
          title: 'Función no disponible en tu plan',
          description: `Tu plan actual (${userPlan}) no incluye esta funcionalidad.`,
          details: `Planes requeridos: ${requiredPlans?.join(', ')}`,
          actionText: 'Actualizar plan',
          actionType: 'upgrade' as const
        }
      
      case 'permission':
        return {
          title: 'Permisos insuficientes',
          description: 'No tienes los permisos necesarios para acceder a esta función.',
          details: `Permisos requeridos: ${requiredPermissions?.join(', ')}`,
          actionText: 'Solicitar permisos',
          actionType: 'contact' as const
        }
    }
  }

  const reasonInfo = getReasonMessage()

  const handleAction = () => {
    if (reasonInfo.actionType === 'upgrade') {
      // Redirect to upgrade page or show upgrade modal
      window.location.href = '/configuracion/plan'
    } else {
      // Show contact information or open support
      alert('Contacta al administrador del sistema para solicitar los permisos necesarios.')
    }
  }

  const goToDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Access Denied Icon */}
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-3xl">🚫</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            {reasonInfo.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-4"
          >
            {reasonInfo.description}
          </motion.p>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-100 rounded-lg p-3 mb-6 text-sm text-gray-700"
          >
            {reasonInfo.details}
          </motion.div>

          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-lg p-3 mb-6 text-sm"
          >
            <p className="text-blue-800">
              <strong>Usuario:</strong> {user?.full_name}
            </p>
            <p className="text-blue-700">
              <strong>Rol:</strong> {user?.role} | <strong>Plan:</strong> {user?.plan}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            {/* Primary Action */}
            {showUpgradePrompt && (
              <button
                onClick={handleAction}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  reasonInfo.actionType === 'upgrade'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {reasonInfo.actionText}
              </button>
            )}

            {/* Go to Dashboard */}
            <button
              onClick={goToDashboard}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
            >
              🏠 Ir al dashboard
            </button>
          </motion.div>

          {/* Plan Comparison (for plan restrictions) */}
          {reason === 'plan' && showUpgradePrompt && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-xs text-gray-500"
            >
              <p className="mb-2"><strong>Beneficios al actualizar:</strong></p>
              <ul className="text-left space-y-1">
                <li>✅ Acceso a todas las funciones</li>
                <li>✅ Facturación electrónica</li>
                <li>✅ Integraciones avanzadas</li>
                <li>✅ Reportes profesionales</li>
                <li>✅ Soporte prioritario</li>
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// HOC for protecting components
export const withProtection = <P extends object>(
  Component: React.ComponentType<P>,
  protectionConfig: Omit<ProtectedRouteProps, 'children'>
) => {
  const ProtectedComponent = (props: P) => (
    <ProtectedRoute {...protectionConfig}>
      <Component {...props} />
    </ProtectedRoute>
  )

  ProtectedComponent.displayName = `withProtection(${Component.displayName || Component.name})`
  
  return ProtectedComponent
}

export default ProtectedRoute

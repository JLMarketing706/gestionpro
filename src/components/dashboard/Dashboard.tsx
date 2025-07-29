import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/common/LoadingScreen'
import toast from 'react-hot-toast'

// Dashboard interfaces
interface MetricCard {
  id: string
  title: string
  value: string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: string
  color: string
  bgColor: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  color: string
  action: () => void
}

interface RecentActivity {
  id: string
  type: 'sale' | 'client' | 'product' | 'payment'
  description: string
  time: string
  amount?: number
  status?: 'success' | 'pending' | 'warning'
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock metrics data
        const mockMetrics: MetricCard[] = [
          {
            id: '1',
            title: 'Ventas Hoy',
            value: '$47,250',
            change: 12.5,
            changeType: 'increase',
            icon: '💰',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            id: '2',
            title: 'Clientes Nuevos',
            value: '23',
            change: 8.2,
            changeType: 'increase',
            icon: '👥',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            id: '3',
            title: 'Productos Vendidos',
            value: '156',
            change: -3.1,
            changeType: 'decrease',
            icon: '📦',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          },
          {
            id: '4',
            title: 'Facturación Mensual',
            value: '$1,245,890',
            change: 15.8,
            changeType: 'increase',
            icon: '📈',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ]

        // Mock activities
        const mockActivities: RecentActivity[] = [
          {
            id: '1',
            type: 'sale',
            description: 'Nueva venta - Factura #001234',
            time: '5 min',
            amount: 15750,
            status: 'success'
          },
          {
            id: '2',
            type: 'client',
            description: 'Cliente nuevo registrado: María González',
            time: '12 min',
            status: 'success'
          },
          {
            id: '3',
            type: 'payment',
            description: 'Pago recibido - Cliente: Tech Solutions',
            time: '25 min',
            amount: 85000,
            status: 'success'
          },
          {
            id: '4',
            type: 'product',
            description: 'Stock bajo: Laptop Dell Inspiron',
            time: '1 hora',
            status: 'warning'
          }
        ]

        setMetrics(mockMetrics)
        setActivities(mockActivities)
      } catch (error) {
        toast.error('Error al cargar datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Nueva Venta',
      description: 'Crear factura o presupuesto',
      icon: '🧾',
      color: 'bg-blue-600',
      action: () => toast.success('Dirigiendo a Nueva Venta...')
    },
    {
      id: '2',
      title: 'Agregar Cliente',
      description: 'Registrar nuevo cliente',
      icon: '👤',
      color: 'bg-green-600',
      action: () => toast.success('Dirigiendo a Clientes...')
    },
    {
      id: '3',
      title: 'Inventario',
      description: 'Gestionar productos',
      icon: '📦',
      color: 'bg-orange-600',
      action: () => toast.success('Dirigiendo a Inventario...')
    },
    {
      id: '4',
      title: 'Reportes',
      description: 'Ver estadísticas',
      icon: '📊',
      color: 'bg-purple-600',
      action: () => toast.success('Dirigiendo a Reportes...')
    }
  ]

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', active: true },
    { id: 'ventas', label: 'Ventas', icon: '🧾' },
    { id: 'clientes', label: 'Clientes', icon: '👥' },
    { id: 'productos', label: 'Productos', icon: '📦' },
    { id: 'inventario', label: 'Inventario', icon: '📊' },
    { id: 'reportes', label: 'Reportes', icon: '📈' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
  ]

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'sale': return '💰'
      case 'client': return '👤'
      case 'product': return '📦'
      case 'payment': return '💳'
      default: return '📄'
    }
  }

  const getStatusColor = (status?: RecentActivity['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'warning': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 lg:relative lg:inset-auto"
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">📊</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">Gestión Pro</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">{user?.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role} • {user?.plan}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <motion.li key={item.id} whileHover={{ x: 4 }}>
                      <button
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          item.active
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span className="mr-3 text-lg">🚪</span>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              >
                ☰
              </button>
              <div className="ml-2 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-800">
                  {getGreeting()}, {user?.full_name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800">Plan {user?.plan}</p>
                <p className="text-xs text-gray-500">Activo</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-lg">🟢</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                    <span className="text-2xl">{metric.icon}</span>
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    metric.changeType === 'increase' ? 'text-green-600' : 
                    metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <span className="mr-1">
                      {metric.changeType === 'increase' ? '↗️' : 
                       metric.changeType === 'decrease' ? '↘️' : '➡️'}
                    </span>
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-left group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <span className="text-lg">{action.icon}</span>
                  </div>
                  <p className="font-medium text-gray-800 mb-1">{action.title}</p>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Actividad Reciente</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver todo
              </button>
            </div>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">Hace {activity.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">
                        ${activity.amount.toLocaleString()}
                      </span>
                    )}
                    {activity.status && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard

import React from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  message?: string
  showLogo?: boolean
  fullScreen?: boolean
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Iniciando Gestión Pro...",
  showLogo = true,
  fullScreen = true 
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center"
    : "flex items-center justify-center p-8"

  return (
    <div className={`${containerClasses} bg-gradient-to-br from-blue-50 via-white to-indigo-50`}>
      <div className="text-center">
        {/* Logo animado */}
        {showLogo && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">📊</span>
            </div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 text-2xl font-bold text-gray-800"
            >
              Gestión Pro
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-600 text-sm mt-1"
            >
              Sistema profesional de facturación
            </motion.p>
          </motion.div>
        )}

        {/* Spinner principal */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative mb-6"
        >
          {/* Anillo exterior */}
          <div className="w-16 h-16 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-4 border-gray-200 rounded-full"
            />
            
            {/* Anillo interior giratorio */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full"
            />
            
            {/* Punto central */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"
            />
          </div>
        </motion.div>

        {/* Mensaje de carga */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-2"
        >
          <p className="text-gray-700 font-medium">{message}</p>
          
          {/* Barra de progreso animada */}
          <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatDelay: 0.5 
              }}
              className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            />
          </div>
        </motion.div>

        {/* Puntos animados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center space-x-1 mt-4"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3] 
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2 
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </motion.div>

        {/* Tips de carga (opcional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 max-w-sm mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              💡 <strong>Tip:</strong> Gestión Pro funciona offline. Tus datos se sincronizan automáticamente cuando vuelves online.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Variante compacta para uso en modales o componentes
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({ 
  size = 'md',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-${color}-600 rounded-full`}
      />
    </div>
  )
}

// Loading skeleton para listas
export const LoadingSkeleton: React.FC<{ rows?: number; height?: string }> = ({ 
  rows = 3,
  height = 'h-4'
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${height} bg-gray-200 rounded animate-pulse`}
        />
      ))}
    </div>
  )
}

export default LoadingScreen

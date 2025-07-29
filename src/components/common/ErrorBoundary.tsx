import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId: string
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null
  private maxRetries = 3

  public state: State = {
    hasError: false,
    errorId: '',
    retryCount: 0
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retryCount: 0
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Log error to external service (in production)
    this.logErrorToService(error, errorInfo)

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, send to error tracking service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem('user_id'),
        sessionId: sessionStorage.getItem('session_id'),
        errorId: this.state.errorId
      }

      // Example: Send to error tracking service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // })

      console.log('📊 Error report prepared:', errorReport)
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError)
    }
  }

  private handleRetry = () => {
    const { retryCount } = this.state

    if (retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1
      })

      // Auto-retry after delay if still failing
      this.retryTimeoutId = setTimeout(() => {
        if (this.state.hasError && this.state.retryCount < this.maxRetries) {
          this.handleRetry()
        }
      }, 2000 * (retryCount + 1)) // Exponential backoff
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/dashboard'
  }

  private copyErrorDetails = () => {
    const errorDetails = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    }

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => alert('Detalles del error copiados al portapapeles'))
      .catch(() => console.error('Failed to copy error details'))
  }

  public componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-3xl">⚠️</span>
              </motion.div>

              {/* Error Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                ¡Ups! Algo salió mal
              </motion.h1>

              {/* Error Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                No te preocupes, nuestro equipo ha sido notificado. 
                Puedes intentar recargar la página o volver al inicio.
              </motion.p>

              {/* Error ID */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-100 rounded-lg p-3 mb-6 text-sm"
              >
                <p className="text-gray-500">ID del error:</p>
                <p className="font-mono text-gray-700 break-all">{this.state.errorId}</p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                {/* Retry Button */}
                {this.state.retryCount < this.maxRetries && (
                  <button
                    onClick={this.handleRetry}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    🔄 Intentar de nuevo ({this.maxRetries - this.state.retryCount} intentos restantes)
                  </button>
                )}

                {/* Reload Button */}
                <button
                  onClick={this.handleReload}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  🔄 Recargar página
                </button>

                {/* Go Home Button */}
                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  🏠 Ir al inicio
                </button>

                {/* Copy Error Details */}
                <button
                  onClick={this.copyErrorDetails}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 text-sm"
                >
                  📋 Copiar detalles técnicos
                </button>
              </motion.div>

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-xs text-gray-500"
              >
                <p>Si el problema persiste, contacta a soporte técnico</p>
                <p className="mt-1">
                  📧 soporte@gestionpro.com | 📞 +54 11 1234-5678
                </p>
              </motion.div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.details
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 text-left"
                >
                  <summary className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700">
                    🔧 Detalles técnicos (solo en desarrollo)
                  </summary>
                  <div className="mt-2 p-3 bg-red-50 rounded border text-xs">
                    <div className="font-semibold text-red-800 mb-2">Error:</div>
                    <pre className="whitespace-pre-wrap text-red-700 mb-3">
                      {this.state.error.message}
                    </pre>
                    
                    <div className="font-semibold text-red-800 mb-2">Stack:</div>
                    <pre className="whitespace-pre-wrap text-red-600 text-xs overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </motion.details>
              )}
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook-based error boundary for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary

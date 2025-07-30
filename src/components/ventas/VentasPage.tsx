import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/common/LoadingScreen'
import toast from 'react-hot-toast'

// Types
interface Product {
  id: string
  codigo_interno: string
  nombre: string
  descripcion?: string
  precio_venta: number
  stock_actual: number
  categoria?: string
  imagen_url?: string
  codigo_barras?: string
}

interface Cliente {
  id: string
  nombre: string
  email?: string
  telefono?: string
  condicion_iva: string
  saldo_cuenta_corriente: number
}

interface CartItem {
  id: string
  producto: Product
  cantidad: number
  precio_unitario: number
  descuento_porcentaje: number
  subtotal: number
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
  enabled: boolean
}

export const VentasPage: React.FC = () => {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')
  const [exchangeRate] = useState(350.50)
  const [loading, setLoading] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  // Mock data
  const [products] = useState<Product[]>([
    {
      id: '1',
      codigo_interno: 'LAPTOP001',
      nombre: 'Laptop Dell Inspiron 15',
      descripcion: 'Laptop Dell Inspiron 15 - Intel i5, 8GB RAM, 256GB SSD',
      precio_venta: 125000,
      stock_actual: 15,
      categoria: 'Computadoras',
      codigo_barras: '7891234567890'
    },
    {
      id: '2',
      codigo_interno: 'MOUSE001',
      nombre: 'Mouse Logitech MX Master 3',
      descripcion: 'Mouse inalámbrico profesional con tecnología MagSpeed',
      precio_venta: 8500,
      stock_actual: 45,
      categoria: 'Accesorios',
      codigo_barras: '7891234567891'
    },
    {
      id: '3',
      codigo_interno: 'KEYBOARD001',
      nombre: 'Teclado Mecánico Corsair K95',
      descripcion: 'Teclado mecánico RGB con switches Cherry MX',
      precio_venta: 15000,
      stock_actual: 8,
      categoria: 'Accesorios',
      codigo_barras: '7891234567892'
    },
    {
      id: '4',
      codigo_interno: 'MONITOR001',
      nombre: 'Monitor Samsung 27" 4K',
      descripcion: 'Monitor curvo 27 pulgadas resolución 4K HDR',
      precio_venta: 85000,
      stock_actual: 12,
      categoria: 'Monitores',
      codigo_barras: '7891234567893'
    },
    {
      id: '5',
      codigo_interno: 'PHONE001',
      nombre: 'iPhone 15 Pro 128GB',
      descripción: 'Smartphone Apple iPhone 15 Pro 128GB Titanio Natural',
      precio_venta: 450000,
      stock_actual: 6,
      categoria: 'Smartphones',
      codigo_barras: '7891234567894'
    }
  ])

  const [clients] = useState<Cliente[]>([
    {
      id: '1',
      nombre: 'Consumidor Final',
      condicion_iva: 'consumidor_final',
      saldo_cuenta_corriente: 0
    },
    {
      id: '2',
      nombre: 'Tech Solutions S.A.',
      email: 'contacto@techsolutions.com',
      telefono: '+54 11 4567-8901',
      condicion_iva: 'responsable_inscripto',
      saldo_cuenta_corriente: -25000
    },
    {
      id: '3',
      nombre: 'María González',
      email: 'maria.gonzalez@email.com',
      telefono: '+54 11 2345-6789',
      condicion_iva: 'monotributista',
      saldo_cuenta_corriente: 15000
    }
  ])

  const paymentMethods: PaymentMethod[] = [
    { id: 'efectivo', name: 'Efectivo', icon: '💵', enabled: true },
    { id: 'tarjeta_debito', name: 'Tarjeta Débito', icon: '💳', enabled: true },
    { id: 'tarjeta_credito', name: 'Tarjeta Crédito', icon: '💳', enabled: true },
    { id: 'transferencia', name: 'Transferencia', icon: '🏦', enabled: true },
    { id: 'mercado_pago', name: 'Mercado Pago', icon: '💙', enabled: user?.plan !== 'emprendedor' },
    { id: 'cuenta_corriente', name: 'Cuenta Corriente', icon: '📋', enabled: true }
  ]

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo_interno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo_barras?.includes(searchTerm)
  )

  // Add product to cart
  const addToCart = useCallback((product: Product) => {
    if (product.stock_actual <= 0) {
      toast.error('Producto sin stock')
      return
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      
      if (existingItem) {
        if (existingItem.cantidad >= product.stock_actual) {
          toast.error('Stock insuficiente')
          return prevCart
        }
        
        const updatedCart = prevCart.map(item =>
          item.id === product.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                subtotal: (item.cantidad + 1) * item.precio_unitario * (1 - item.descuento_porcentaje / 100)
              }
            : item
        )
        return updatedCart
      } else {
        const newItem: CartItem = {
          id: product.id,
          producto: product,
          cantidad: 1,
          precio_unitario: product.precio_venta,
          descuento_porcentaje: 0,
          subtotal: product.precio_venta
        }
        return [...prevCart, newItem]
      }
    })
    
    toast.success(`${product.nombre} agregado al carrito`)
  }, [])

  // Update cart item quantity
  const updateCartItem = useCallback((itemId: string, updates: Partial<CartItem>) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...updates }
          updatedItem.subtotal = updatedItem.cantidad * updatedItem.precio_unitario * (1 - updatedItem.descuento_porcentaje / 100)
          return updatedItem
        }
        return item
      })
    )
  }, [])

  // Remove from cart
  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }, [])

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
    const impuestos = subtotal * 0.21 // IVA 21%
    const total = subtotal + impuestos
    
    return {
      subtotal,
      impuestos,
      total,
      totalUSD: total / exchangeRate
    }
  }, [cart, exchangeRate])

  const totals = calculateTotals()

  // Process sale
  const processSale = async (type: 'factura' | 'presupuesto' | 'reserva') => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    if (!selectedClient) {
      toast.error('Selecciona un cliente')
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const saleData = {
        cliente: selectedClient,
        items: cart,
        totals,
        currency,
        type,
        timestamp: new Date().toISOString()
      }
      
      console.log('Venta procesada:', saleData)
      
      // Clear cart and reset
      setCart([])
      setSelectedClient(clients[0]) // Reset to Consumidor Final
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generada exitosamente`)
      
    } catch (error) {
      toast.error('Error al procesar la venta')
    } finally {
      setLoading(false)
      setShowPaymentModal(false)
    }
  }

  // Initialize with default client
  useEffect(() => {
    if (!selectedClient && clients.length > 0) {
      setSelectedClient(clients[0])
    }
  }, [clients, selectedClient])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">🧾 Punto de Venta</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Vendedor</p>
              <p className="font-medium">{user?.full_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Moneda</p>
              <div className="flex space-x-1">
                {(['ARS', 'USD'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-3 py-1 text-sm rounded ${
                      currency === curr
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar productos por nombre, código o código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => addToCart(product)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                    {product.nombre}
                  </h3>
                  
                  <p className="text-xs text-gray-500 mb-2">
                    {product.codigo_interno}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {currency === 'ARS' 
                          ? `$${product.precio_venta.toLocaleString()}`
                          : `$${(product.precio_venta / exchangeRate).toFixed(2)}`
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {product.stock_actual}
                      </p>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        product.stock_actual > 0
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock_actual <= 0}
                    >
                      +
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Client Selection */}
          <div className="p-4 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <button
              onClick={() => setShowClientModal(true)}
              className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedClient?.nombre}</p>
                  {selectedClient?.email && (
                    <p className="text-xs text-gray-500">{selectedClient.email}</p>
                  )}
                </div>
                <span className="text-gray-400">👤</span>
              </div>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-semibold text-gray-800 mb-4">
              Carrito ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>
            
            <div className="space-y-3">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.producto.nombre}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartItem(item.id, { cantidad: Math.max(1, item.cantidad - 1) })}
                          className="w-6 h-6 bg-gray-300 rounded text-sm hover:bg-gray-400"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateCartItem(item.id, { cantidad: Math.min(item.producto.stock_actual, item.cantidad + 1) })}
                          className="w-6 h-6 bg-gray-300 rounded text-sm hover:bg-gray-400"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {currency === 'ARS' 
                            ? `$${item.subtotal.toLocaleString()}`
                            : `$${(item.subtotal / exchangeRate).toFixed(2)}`
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {currency === 'ARS' 
                            ? `$${item.precio_unitario.toLocaleString()}`
                            : `$${(item.precio_unitario / exchangeRate).toFixed(2)}`
                          } c/u
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>
                  {currency === 'ARS' 
                    ? `$${totals.subtotal.toLocaleString()}`
                    : `$${totals.totalUSD.toFixed(2)}`
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (21%):</span>
                <span>
                  {currency === 'ARS' 
                    ? `$${totals.impuestos.toLocaleString()}`
                    : `$${(totals.impuestos / exchangeRate).toFixed(2)}`
                  }
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">
                  {currency === 'ARS' 
                    ? `$${totals.total.toLocaleString()}`
                    : `$${totals.totalUSD.toFixed(2)}`
                  }
                </span>
              </div>
              {currency === 'USD' && (
                <p className="text-xs text-gray-500 text-right">
                  ARS ${totals.total.toLocaleString()} (TC: ${exchangeRate})
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={cart.length === 0 || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="sm" /> : '💳 Facturar'}
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => processSale('presupuesto')}
                  disabled={cart.length === 0 || loading}
                  className="bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  📋 Presupuesto
                </button>
                <button
                  onClick={() => processSale('reserva')}
                  disabled={cart.length === 0 || loading}
                  className="bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  📦 Reserva
                </button>
              </div>
              
              <button
                onClick={() => setCart([])}
                className="w-full bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200"
              >
                🗑️ Limpiar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Client Selection Modal */}
      <AnimatePresence>
        {showClientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowClientModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Seleccionar Cliente</h3>
              
              <div className="space-y-2 mb-4">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client)
                      setShowClientModal(false)
                    }}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedClient?.id === client.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium">{client.nombre}</p>
                    {client.email && (
                      <p className="text-sm text-gray-500">{client.email}</p>
                    )}
                    <p className="text-xs text-gray-400 capitalize">
                      {client.condicion_iva.replace('_', ' ')}
                    </p>
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClientModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Add new client functionality
                    toast.success('Función "Agregar Cliente" próximamente')
                    setShowClientModal(false)
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  + Nuevo Cliente
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Forma de Pago</h3>
              
              <div className="mb-6">
                <p className="text-2xl font-bold text-blue-600 text-center">
                  Total: {currency === 'ARS' 
                    ? `$${totals.total.toLocaleString()}`
                    : `$${totals.totalUSD.toFixed(2)}`
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    disabled={!method.enabled}
                    onClick={() => processSale('factura')}
                    className={`p-4 rounded-lg border text-center ${
                      method.enabled
                        ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-2xl mb-1">{method.icon}</div>
                    <div className="text-sm font-medium">{method.name}</div>
                    {!method.enabled && (
                      <div className="text-xs text-orange-600 mt-1">
                        Plan {user?.plan} requerido
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => processSale('factura')}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Procesar Venta'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VentasPage

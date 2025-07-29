export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Core database schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'supervisor' | 'vendedor' | 'contador' | 'inventario'
          plan: 'emprendedor' | 'comercios' | 'pymes'
          sucursal_id: string | null
          config: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'supervisor' | 'vendedor' | 'contador' | 'inventario'
          plan?: 'emprendedor' | 'comercios' | 'pymes'
          sucursal_id?: string | null
          config?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'supervisor' | 'vendedor' | 'contador' | 'inventario'
          plan?: 'emprendedor' | 'comercios' | 'pymes'
          sucursal_id?: string | null
          config?: Json
          updated_at?: string
          deleted_at?: string | null
        }
      }
      clientes: {
        Row: {
          id: string
          nombre: string
          email: string | null
          telefono: string | null
          direccion: string | null
          cuit_cuil: string | null
          condicion_iva: 'responsable_inscripto' | 'monotributista' | 'exento' | 'consumidor_final'
          tipo_documento: 'dni' | 'cuit' | 'cuil' | 'pasaporte' | 'cedula'
          numero_documento: string
          saldo_cuenta_corriente: number
          limite_credito: number | null
          sucursal_id: string
          usuario_creador_id: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          cuit_cuil?: string | null
          condicion_iva?: 'responsable_inscripto' | 'monotributista' | 'exento' | 'consumidor_final'
          tipo_documento?: 'dni' | 'cuit' | 'cuil' | 'pasaporte' | 'cedula'
          numero_documento: string
          saldo_cuenta_corriente?: number
          limite_credito?: number | null
          sucursal_id: string
          usuario_creador_id: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          cuit_cuil?: string | null
          condicion_iva?: 'responsable_inscripto' | 'monotributista' | 'exento' | 'consumidor_final'
          tipo_documento?: 'dni' | 'cuit' | 'cuil' | 'pasaporte' | 'cedula'
          numero_documento?: string
          saldo_cuenta_corriente?: number
          limite_credito?: number | null
          sucursal_id?: string
          usuario_creador_id?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      productos: {
        Row: {
          id: string
          codigo_interno: string
          nombre: string
          descripcion: string | null
          categoria: string | null
          subcategoria: string | null
          unidad_medida: string
          precio_costo: number
          precio_venta: number
          margen_ganancia: number
          stock_actual: number
          stock_minimo: number
          stock_maximo: number | null
          activo: boolean
          imagen_url: string | null
          codigo_barras: string | null
          trazabilidad: boolean
          sucursal_id: string
          usuario_creador_id: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          codigo_interno?: string
          nombre: string
          descripcion?: string | null
          categoria?: string | null
          subcategoria?: string | null
          unidad_medida?: string
          precio_costo: number
          precio_venta: number
          margen_ganancia?: number
          stock_actual?: number
          stock_minimo?: number
          stock_maximo?: number | null
          activo?: boolean
          imagen_url?: string | null
          codigo_barras?: string | null
          trazabilidad?: boolean
          sucursal_id: string
          usuario_creador_id: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          codigo_interno?: string
          nombre?: string
          descripcion?: string | null
          categoria?: string | null
          subcategoria?: string | null
          unidad_medida?: string
          precio_costo?: number
          precio_venta?: number
          margen_ganancia?: number
          stock_actual?: number
          stock_minimo?: number
          stock_maximo?: number | null
          activo?: boolean
          imagen_url?: string | null
          codigo_barras?: string | null
          trazabilidad?: boolean
          sucursal_id?: string
          usuario_creador_id?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      ventas: {
        Row: {
          id: string
          numero_comprobante: string
          tipo_comprobante: 'factura' | 'presupuesto' | 'reserva' | 'nota_credito' | 'nota_debito'
          cliente_id: string
          vendedor_id: string
          sucursal_id: string
          fecha_venta: string
          fecha_vencimiento: string | null
          moneda: 'ARS' | 'USD'
          tipo_cambio: number
          subtotal: number
          descuento_porcentaje: number
          descuento_monto: number
          impuestos_monto: number
          total: number
          estado: 'borrador' | 'confirmada' | 'facturada' | 'cancelada' | 'anulada'
          estado_pago: 'pendiente' | 'parcial' | 'pagada' | 'vencida'
          forma_pago: string
          observaciones: string | null
          cae: string | null
          fecha_vencimiento_cae: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          numero_comprobante?: string
          tipo_comprobante: 'factura' | 'presupuesto' | 'reserva' | 'nota_credito' | 'nota_debito'
          cliente_id: string
          vendedor_id: string
          sucursal_id: string
          fecha_venta?: string
          fecha_vencimiento?: string | null
          moneda?: 'ARS' | 'USD'
          tipo_cambio?: number
          subtotal: number
          descuento_porcentaje?: number
          descuento_monto?: number
          impuestos_monto?: number
          total: number
          estado?: 'borrador' | 'confirmada' | 'facturada' | 'cancelada' | 'anulada'
          estado_pago?: 'pendiente' | 'parcial' | 'pagada' | 'vencida'
          forma_pago: string
          observaciones?: string | null
          cae?: string | null
          fecha_vencimiento_cae?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          numero_comprobante?: string
          tipo_comprobante?: 'factura' | 'presupuesto' | 'reserva' | 'nota_credito' | 'nota_debito'
          cliente_id?: string
          vendedor_id?: string
          sucursal_id?: string
          fecha_venta?: string
          fecha_vencimiento?: string | null
          moneda?: 'ARS' | 'USD'
          tipo_cambio?: number
          subtotal?: number
          descuento_porcentaje?: number
          descuento_monto?: number
          impuestos_monto?: number
          total?: number
          estado?: 'borrador' | 'confirmada' | 'facturada' | 'cancelada' | 'anulada'
          estado_pago?: 'pendiente' | 'parcial' | 'pagada' | 'vencida'
          forma_pago?: string
          observaciones?: string | null
          cae?: string | null
          fecha_vencimiento_cae?: string | null
          updated_at?: string
          deleted_at?: string | null
        }
      }
      ventas_items: {
        Row: {
          id: string
          venta_id: string
          producto_id: string
          cantidad: number
          precio_unitario: number
          descuento_porcentaje: number
          descuento_monto: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          venta_id: string
          producto_id: string
          cantidad: number
          precio_unitario: number
          descuento_porcentaje?: number
          descuento_monto?: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          venta_id?: string
          producto_id?: string
          cantidad?: number
          precio_unitario?: number
          descuento_porcentaje?: number
          descuento_monto?: number
          subtotal?: number
        }
      }
      sucursales: {
        Row: {
          id: string
          nombre: string
          direccion: string
          telefono: string | null
          email: string | null
          codigo_postal: string | null
          ciudad: string
          provincia: string
          pais: string
          activa: boolean
          configuracion: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          direccion: string
          telefono?: string | null
          email?: string | null
          codigo_postal?: string | null
          ciudad: string
          provincia: string
          pais?: string
          activa?: boolean
          configuracion?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string
          telefono?: string | null
          email?: string | null
          codigo_postal?: string | null
          ciudad?: string
          provincia?: string
          pais?: string
          activa?: boolean
          configuracion?: Json
          updated_at?: string
          deleted_at?: string | null
        }
      }
      movimientos_stock: {
        Row: {
          id: string
          producto_id: string
          sucursal_id: string
          tipo_movimiento: 'ingreso' | 'egreso' | 'transferencia' | 'ajuste'
          cantidad: number
          motivo: string
          documento_referencia: string | null
          usuario_id: string
          fecha_movimiento: string
          created_at: string
        }
        Insert: {
          id?: string
          producto_id: string
          sucursal_id: string
          tipo_movimiento: 'ingreso' | 'egreso' | 'transferencia' | 'ajuste'
          cantidad: number
          motivo: string
          documento_referencia?: string | null
          usuario_id: string
          fecha_movimiento?: string
          created_at?: string
        }
        Update: {
          id?: string
          producto_id?: string
          sucursal_id?: string
          tipo_movimiento?: 'ingreso' | 'egreso' | 'transferencia' | 'ajuste'
          cantidad?: number
          motivo?: string
          documento_referencia?: string | null
          usuario_id?: string
          fecha_movimiento?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'supervisor' | 'vendedor' | 'contador' | 'inventario'
      subscription_plan: 'emprendedor' | 'comercios' | 'pymes'
      document_type: 'factura' | 'presupuesto' | 'reserva' | 'nota_credito' | 'nota_debito'
      payment_status: 'pendiente' | 'parcial' | 'pagada' | 'vencida'
      currency: 'ARS' | 'USD'
    }
  }
}

// Helper types for better development experience
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Cliente = Database['public']['Tables']['clientes']['Row']
export type ClienteInsert = Database['public']['Tables']['clientes']['Insert']
export type ClienteUpdate = Database['public']['Tables']['clientes']['Update']

export type Producto = Database['public']['Tables']['productos']['Row']
export type ProductoInsert = Database['public']['Tables']['productos']['Insert']
export type ProductoUpdate = Database['public']['Tables']['productos']['Update']

export type Venta = Database['public']['Tables']['ventas']['Row']
export type VentaInsert = Database['public']['Tables']['ventas']['Insert']
export type VentaUpdate = Database['public']['Tables']['ventas']['Update']

export type VentaItem = Database['public']['Tables']['ventas_items']['Row']
export type VentaItemInsert = Database['public']['Tables']['ventas_items']['Insert']
export type VentaItemUpdate = Database['public']['Tables']['ventas_items']['Update']

export type Sucursal = Database['public']['Tables']['sucursales']['Row']
export type SucursalInsert = Database['public']['Tables']['sucursales']['Insert']
export type SucursalUpdate = Database['public']['Tables']['sucursales']['Update']

export type MovimientoStock = Database['public']['Tables']['movimientos_stock']['Row']
export type MovimientoStockInsert = Database['public']['Tables']['movimientos_stock']['Insert']
export type MovimientoStockUpdate = Database['public']['Tables']['movimientos_stock']['Update']

// Enums
export type UserRole = Database['public']['Enums']['user_role']
export type SubscriptionPlan = Database['public']['Enums']['subscription_plan']
export type DocumentType = Database['public']['Enums']['document_type']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type Currency = Database['public']['Enums']['currency']

// Complex types for business logic
export interface VentaCompleta extends Venta {
  cliente: Cliente
  vendedor: Profile
  sucursal: Sucursal
  items: (VentaItem & { producto: Producto })[]
}

export interface ProductoConStock extends Producto {
  stock_por_sucursal: {
    sucursal_id: string
    sucursal_nombre: string
    stock_actual: number
  }[]
  movimientos_recientes: MovimientoStock[]
}

export interface ClienteConSaldo extends Cliente {
  facturas_pendientes: Venta[]
  ultimo_pago: string | null
  dias_sin_comprar: number
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
  status: 'success' | 'error' | 'loading'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  plan: SubscriptionPlan
}

export interface ClienteForm {
  nombre: string
  email?: string
  telefono?: string
  direccion?: string
  cuit_cuil?: string
  condicion_iva: string
  tipo_documento: string
  numero_documento: string
}

export interface ProductoForm {
  nombre: string
  descripcion?: string
  categoria?: string
  precio_costo: number
  precio_venta: number
  stock_minimo: number
  codigo_barras?: string
}

export interface VentaForm {
  cliente_id: string
  tipo_comprobante: DocumentType
  moneda: Currency
  forma_pago: string
  observaciones?: string
  items: {
    producto_id: string
    cantidad: number
    precio_unitario: number
    descuento_porcentaje?: number
  }[]
}

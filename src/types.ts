import type { UserRole, AccentTone, ProductStatus, OrderStatus } from './constants'

export type { UserRole, AccentTone, ProductStatus, OrderStatus }


export interface DemoUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  memberSince: string
  city: string
}

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: string
  title: string
  category: string
  brand: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  stock: number
  badge: string
  accent: AccentTone
  featured: boolean
  sku: string
  sales: number
  rating: number
  reviewCount: number
  shipping: string
  installments: string
  status: ProductStatus
  features: string[]
  specs: ProductSpec[]
  imageUrl: string
}

export interface ProductDraft {
  id: string | null
  title: string
  category: string
  brand: string
  description: string
  longDescription: string
  price: string
  originalPrice: string
  stock: string
  badge: string
  accent: AccentTone
  featured: boolean
  status: ProductStatus
  shipping: string
  installments: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartEntry {
  product: Product
  quantity: number
  total: number
}

export interface ProductSalesEntry {
  productId: string
  title: string
  units: number
  revenue: number
}

export interface LoginIntent {
  action: 'add' | 'buy' | 'cart' | 'account'
  productId?: string
  redirectTo?: string
  reason: string
}

export interface OrderItem {
  productId: string
  title: string
  quantity: number
  price: number
}

export interface TrackingStep {
  label: string
  date: string
  done: boolean
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  createdAt: string
  status: OrderStatus
  channel: string
  paymentLabel: string
  addressLabel: string
  items: OrderItem[]
  total: number
  tracking: TrackingStep[]
}

export interface PaymentMethod {
  id: string
  userId: string
  label: string
  brand: string
  last4: string
  expiry: string
  holder: string
  primary: boolean
}

export interface Address {
  id: string
  userId: string
  label: string
  recipient: string
  street: string
  city: string
  state: string
  zipCode: string
}

export const APP_TYPES_MODULE = true

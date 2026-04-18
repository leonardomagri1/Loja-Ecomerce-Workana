import type { Product, Order, CartItem } from '../types'
import { initialProducts, initialOrders, demoUsers } from '../mockData'
import {
  isRecord,
  safeString,
  toFiniteNumber,
  parseFiniteNumber,
  clamp,
  normalizeAccent,
  normalizeProductStatus,
  normalizeOrderStatus,
  normalizeStringArray,
  normalizeProductSpecs,
} from './helpers'
import { buildSku, buildInstallmentsLabel } from './formatters'
import {
  buildDefaultProductSpecs,
  buildDefaultProductFeatures,
  buildTrackingTimeline,
} from './productHelpers'

export function normalizeProduct(rawProduct: unknown, index: number): Product {
  const source = isRecord(rawProduct) ? rawProduct : {}
  const sourceId = safeString(source.id)
  const baseProduct = initialProducts.find((p) => p.id === sourceId) ?? null

  const title = safeString(source.title, baseProduct?.title ?? 'Produto em destaque')
  const category = safeString(source.category, baseProduct?.category ?? 'Coleção')
  const brand = safeString(source.brand, baseProduct?.brand ?? 'demo Loja Online')
  const description = safeString(
    source.description,
    baseProduct?.description ?? 'Produto com apresentação pronta para venda online.',
  )
  const longDescription = safeString(
    source.longDescription,
    baseProduct?.longDescription ?? description,
  )
  const price = Math.max(toFiniteNumber(source.price, baseProduct?.price ?? 0), 0)
  const parsedOriginalPrice = parseFiniteNumber(source.originalPrice)
  const originalPrice =
    parsedOriginalPrice && parsedOriginalPrice > price
      ? parsedOriginalPrice
      : baseProduct?.originalPrice

  const stock = Math.max(Math.round(toFiniteNumber(source.stock, baseProduct?.stock ?? 0)), 0)
  const sales = Math.max(Math.round(toFiniteNumber(source.sales, baseProduct?.sales ?? 0)), 0)
  const rating = clamp(toFiniteNumber(source.rating, baseProduct?.rating ?? 4.8), 0, 5)
  const reviewCount = Math.max(
    Math.round(toFiniteNumber(source.reviewCount, baseProduct?.reviewCount ?? Math.max(sales * 2, 24))),
    0,
  )

  const defaultSpecs = buildDefaultProductSpecs(category, brand, stock)

  return {
    id: safeString(source.id, baseProduct?.id ?? `product-legacy-${index + 1}`),
    title,
    category,
    brand,
    description,
    longDescription,
    price,
    originalPrice,
    stock,
    badge: safeString(source.badge, baseProduct?.badge ?? 'Destaque'),
    accent: normalizeAccent(
      source.accent,
      baseProduct?.accent ?? (['peach', 'cyan', 'gold', 'berry'][index % 4] as any),
    ),
    featured:
      typeof source.featured === 'boolean'
        ? source.featured
        : baseProduct?.featured ?? index < 4,
    sku: safeString(source.sku, baseProduct?.sku ?? buildSku(title)),
    sales,
    rating,
    reviewCount,
    shipping: safeString(source.shipping, baseProduct?.shipping ?? 'Entrega nacional com rastreio'),
    installments: safeString(source.installments, baseProduct?.installments ?? buildInstallmentsLabel(price)),
    status: normalizeProductStatus(source.status, baseProduct?.status ?? 'Disponivel'),
    features: normalizeStringArray(source.features, baseProduct?.features ?? buildDefaultProductFeatures()),
    specs: normalizeProductSpecs(source.specs, baseProduct?.specs ?? defaultSpecs),
    imageUrl: safeString(source.imageUrl, baseProduct?.imageUrl ?? ''),
  }
}

export function normalizeProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) {
    return initialProducts
  }
  return value.map((product, index) => normalizeProduct(product, index))
}

export function normalizeOrderItems(value: unknown): Order['items'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.reduce<Order['items']>((accumulator, entry) => {
    if (!isRecord(entry)) {
      return accumulator
    }

    const productId = safeString(entry.productId)
    const baseProduct = initialProducts.find((p) => p.id === productId) ?? null
    const quantity = Math.max(Math.round(toFiniteNumber(entry.quantity, 1)), 1)
    const price = Math.max(toFiniteNumber(entry.price, baseProduct?.price ?? 0), 0)

    accumulator.push({
      productId: productId || baseProduct?.id || `product-item-${accumulator.length + 1}`,
      title: safeString(entry.title, baseProduct?.title ?? 'Produto'),
      quantity,
      price,
    })

    return accumulator
  }, [])
}

export function normalizeDateString(value: unknown, fallback: string) {
  const normalizedValue = safeString(value, fallback)
  return Number.isNaN(Date.parse(normalizedValue)) ? fallback : normalizedValue
}

export function normalizeTrackingSteps(
  value: unknown,
  createdAt: string,
  status: Order['status'],
): Order['tracking'] {
  if (Array.isArray(value)) {
    const normalizedTracking = value.reduce<Order['tracking']>((accumulator, entry) => {
      if (!isRecord(entry)) {
        return accumulator
      }

      const label = safeString(entry.label)
      const date = safeString(entry.date, 'Atualizando')

      if (label) {
        accumulator.push({
          label,
          date,
          done: Boolean(entry.done),
        })
      }

      return accumulator
    }, [])

    if (normalizedTracking.length > 0) {
      return normalizedTracking
    }
  }

  return buildTrackingTimeline(createdAt, status)
}

export function normalizeOrder(rawOrder: unknown, index: number): Order {
  const source = isRecord(rawOrder) ? rawOrder : {}
  const sourceId = safeString(source.id)
  const baseOrder = initialOrders.find((o) => o.id === sourceId) ?? null
  const customerId = safeString(source.customerId, baseOrder?.customerId ?? demoUsers[1]?.id ?? '')
  const matchedUser = demoUsers.find((u) => u.id === customerId) ?? null
  const items = normalizeOrderItems(source.items)
  const createdAt = normalizeDateString(source.createdAt, baseOrder?.createdAt ?? new Date().toISOString())
  const status = normalizeOrderStatus(source.status, baseOrder?.status ?? 'Pagamento aprovado')
  const computedTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return {
    id: safeString(source.id, baseOrder?.id ?? `PED-${5201 + index}`),
    customerId,
    customerName: safeString(source.customerName, baseOrder?.customerName ?? matchedUser?.name ?? 'Cliente Premium'),
    createdAt,
    status,
    channel: safeString(source.channel, baseOrder?.channel ?? 'Site'),
    paymentLabel: safeString(source.paymentLabel, baseOrder?.paymentLabel ?? 'Pagamento digital'),
    addressLabel: safeString(source.addressLabel, baseOrder?.addressLabel ?? 'Endereco principal'),
    items,
    total: Math.max(toFiniteNumber(source.total, baseOrder?.total ?? computedTotal), 0),
    tracking: normalizeTrackingSteps(source.tracking, createdAt, status),
  }
}

export function normalizeOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) {
    return initialOrders
  }
  return value.map((order, index) => normalizeOrder(order, index))
}

export function normalizeCartStore(value: unknown): Record<string, CartItem[]> {
  if (!isRecord(value)) {
    return {}
  }

  return Object.entries(value).reduce<Record<string, CartItem[]>>((accumulator, [userId, cartItems]) => {
    if (!Array.isArray(cartItems)) {
      return accumulator
    }

    const normalizedItems = cartItems.reduce<CartItem[]>((items, entry) => {
      if (!isRecord(entry)) {
        return items
      }

      const productId = safeString(entry.productId)
      const quantity = Math.max(Math.round(toFiniteNumber(entry.quantity, 1)), 1)

      if (productId) {
        items.push({ productId, quantity })
      }

      return items
    }, [])

    accumulator[userId] = normalizedItems
    return accumulator
  }, {})
}

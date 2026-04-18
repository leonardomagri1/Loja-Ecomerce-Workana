import type { Product, Order } from '../types'
import { formatDate, buildInstallmentsLabel } from './formatters'
import {
  toFiniteNumber,
  safeString,
  clamp,
  normalizeStringArray,
  normalizeProductSpecs,
} from './helpers'

export function getProductImage(product: Product) {
  if (product.imageUrl && product.imageUrl.startsWith('http') && !product.imageUrl.includes('placeholder')) {
    return product.imageUrl
  }

  // Fallback map with high-quality specific Unsplash IDs
  const fallbackMap: Record<string, string> = {
    'Casa & Decor': 'photo-1583847268964-b28dc8f51f92',
    'Bem-estar': 'photo-1602928321679-560bb453f190',
    'Moda': 'photo-1539106604-2425ae3b5c2a',
    'Beleza': 'photo-1612817288484-6f916006741a',
    'Presentes': 'photo-1549465220-1a8b9238cd48',
    'Utilidades': 'photo-1591129841117-3adfd313e34f',
    'Iluminação': 'photo-1534073828943-f801091bb18c',
  }

  const photoId = fallbackMap[product.category] || 'photo-1493663284031-b7e3aefcae8e'
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=800`
}

export function buildDefaultProductSpecs(
  category: string,
  brand: string,
  stock: number,
): Product['specs'] {
  return [
    { label: 'Categoria', value: category },
    { label: 'Marca', value: brand },
    { label: 'Estoque', value: `${stock} unidades` },
  ]
}

export function buildDefaultProductFeatures() {
  return ['Curadoria premium', 'Compra segura', 'Envio nacional']
}

export function getProductDisplayMeta(product: Product) {
  const price = Math.max(toFiniteNumber(product.price, 0), 0)
  const sales = Math.max(Math.round(toFiniteNumber(product.sales, 0)), 0)
  const stock = Math.max(Math.round(toFiniteNumber(product.stock, 0)), 0)
  const category = safeString(product.category, 'Coleção')
  const brand = safeString(product.brand, 'demo Loja Online')


  return {
    price,
    rating: clamp(toFiniteNumber(product.rating, 4.8), 0, 5),
    reviewCount: Math.max(
      Math.round(toFiniteNumber(product.reviewCount, Math.max(sales * 2, 24))),
      0,
    ),
    installments: safeString(
      product.installments,
      buildInstallmentsLabel(price),
    ),
    shipping: safeString(product.shipping, 'Entrega nacional com rastreio'),
    features: normalizeStringArray(
      product.features,
      buildDefaultProductFeatures(),
    ),
    specs: normalizeProductSpecs(
      product.specs,
      buildDefaultProductSpecs(category, brand, stock),
    ),
  }
}

export function buildTrackingTimeline(
  createdAt: string,
  status: Order['status'] = 'Pagamento aprovado',
) {
  const trackingSteps: Order['tracking'] = [
    {
      label: 'Pagamento aprovado',
      date: formatDate(createdAt),
      done: true,
    },
    {
      label: 'Preparação do pedido',
      date: status === 'Pagamento aprovado' ? 'Em andamento' : formatDate(createdAt),
      done: status !== 'Pagamento aprovado',
    },
    {
      label: 'Transporte',
      date:
        status === 'Em transporte' || status === 'Entregue'
          ? formatDate(createdAt)
          : 'Aguardando expedição',
      done: status === 'Em transporte' || status === 'Entregue',
    },
  ]

  if (status === 'Entregue') {
    trackingSteps.push({
      label: 'Entrega concluída',
      date: formatDate(createdAt),
      done: true,
    })
  }

  return trackingSteps
}

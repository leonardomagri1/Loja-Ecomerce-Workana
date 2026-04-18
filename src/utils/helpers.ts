import type { AccentTone, ProductStatus, Order, Product } from '../types'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function safeString(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function parseFiniteNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const sanitized = value
    .trim()
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.')

  if (!sanitized) {
    return null
  }

  const parsed = Number(sanitized)
  return Number.isFinite(parsed) ? parsed : null
}

export function toFiniteNumber(value: unknown, fallback: number) {
  return parseFiniteNumber(value) ?? fallback
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function normalizeAccent(value: unknown, fallback: AccentTone) {
  return value === 'peach' || value === 'cyan' || value === 'gold' || value === 'berry'
    ? value
    : fallback
}

export function normalizeProductStatus(value: unknown, fallback: ProductStatus = 'Disponivel') {
  if (value === 'Pausado') {
    return 'Pausado'
  }

  if (value === 'Disponivel') {
    return 'Disponivel'
  }

  return fallback
}

export function normalizeOrderStatus(
  value: unknown,
  fallback: Order['status'] = 'Pagamento aprovado',
): Order['status'] {
  const normalizedValue = safeString(value).toLowerCase()

  if (
    normalizedValue === 'pagamento aprovado' ||
    normalizedValue === 'pago' ||
    normalizedValue === 'pagamento confirmado'
  ) {
    return 'Pagamento aprovado'
  }

  if (
    normalizedValue === 'em separação' ||
    normalizedValue === 'em separacao' ||
    normalizedValue === 'separando' ||
    normalizedValue === 'preparacao do pedido' ||
    normalizedValue === 'preparação do pedido'
  ) {
    return 'Em separação'
  }

  if (
    normalizedValue === 'em transporte' ||
    normalizedValue === 'enviado' ||
    normalizedValue === 'saiu para entrega' ||
    normalizedValue === 'saiu para transporte'
  ) {
    return 'Em transporte'
  }

  if (
    normalizedValue === 'entregue' ||
    normalizedValue === 'concluido' ||
    normalizedValue === 'concluído'
  ) {
    return 'Entregue'
  }

  return fallback
}

export function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const normalizedValues = value.reduce<string[]>((accumulator, entry) => {
    const normalizedEntry = safeString(entry)

    if (normalizedEntry) {
      accumulator.push(normalizedEntry)
    }

    return accumulator
  }, [])

  return normalizedValues.length > 0 ? normalizedValues : fallback
}

export function normalizeProductSpecs(
  value: unknown,
  fallback: Product['specs'],
): Product['specs'] {
  if (!Array.isArray(value)) {
    return fallback
  }

  const normalizedSpecs = value.reduce<Product['specs']>((accumulator, entry) => {
    if (!isRecord(entry)) {
      return accumulator
    }

    const label = safeString(entry.label)
    const specValue = safeString(entry.value)

    if (label && specValue) {
      accumulator.push({
        label,
        value: specValue,
      })
    }

    return accumulator
  }, [])

  return normalizedSpecs.length > 0 ? normalizedSpecs : fallback
}

export const STORAGE_KEYS = {
  carts: 'casavitrine.carts',
  orders: 'casavitrine.orders',
  products: 'casavitrine.products',
  session: 'casavitrine.session',
}

export function readStorageValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    if (typeof window.localStorage.getItem !== 'function') {
      return fallback
    }

    const storedValue = window.localStorage.getItem(key)

    if (!storedValue) {
      return fallback
    }

    return JSON.parse(storedValue) as T
  } catch {
    return fallback
  }
}

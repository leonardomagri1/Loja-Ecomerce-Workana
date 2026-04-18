export const ACCENT_TONES = ['peach', 'cyan', 'gold', 'berry'] as const
export type AccentTone = (typeof ACCENT_TONES)[number]

export const PRODUCT_STATUSES = ['Disponivel', 'Pausado'] as const
export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

export const ORDER_STATUSES = [
  'Pagamento aprovado',
  'Em separação',
  'Em transporte',
  'Entregue',
] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const USER_ROLES = ['manager', 'customer'] as const
export type UserRole = (typeof USER_ROLES)[number]

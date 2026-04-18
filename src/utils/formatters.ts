export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function getFirstName(name: string | undefined | null) {
  if (!name || typeof name !== 'string') {
    return 'Usuário'
  }
  return name.split(' ')[0]
}

export function buildSku(title: string) {
  const seed = title
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 3)

  return `DO-${seed || 'NOV'}-${Math.floor(Math.random() * 900 + 100)}`
}

export function buildInstallmentsLabel(price: number) {
  if (price <= 0) {
    return 'Parcelamento disponivel'
  }

  return `ou 4x de ${formatCurrency(Number((price / 4).toFixed(2)))} sem juros`
}

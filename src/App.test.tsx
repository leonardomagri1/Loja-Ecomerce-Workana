import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('renders a public home page with production-ready content', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /descubra produtos para casa/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /explorar coleções/i }),
    ).toBeInTheDocument()

    expect(screen.getAllByText(/tapete boucle nuvem/i).length).toBeGreaterThan(0)
  })

  it('lets visitors open a product and asks for login only when trying to buy', () => {
    window.history.pushState({}, '', '/produto/product-difusor-lume')
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /difusor de ceramica lume/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /comprar agora/i }))

    expect(
      screen.getByRole('heading', { name: /entre para continuar\./i }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(/entre para concluir a compra deste produto\./i),
    ).toBeInTheDocument()
  })

  it('normalizes legacy products from localStorage before rendering the catalog', () => {
    window.localStorage.setItem(
      'casavitrine.products',
      JSON.stringify([
        {
          id: 'product-legado',
          title: 'Edicao Atelier',
          category: 'Casa & Decor',
          description: 'Item salvo antes da versao nova.',
          price: 149.9,
          stock: 5,
          badge: 'Destaque',
          accent: 'peach',
          featured: true,
          sku: 'LEG-001',
          sales: 12,
          status: 'Disponivel',
        },
      ]),
    )

    render(<App />)

    expect(screen.getAllByRole('link', { name: /edicao atelier/i }).length).toBeGreaterThan(0)

    expect(screen.getByText(/4\.8/i)).toBeInTheDocument()
  })

  it('allows a customer to sign in after choosing a product and continue to cart and account', () => {
    window.history.pushState({}, '', '/produto/product-bolsa-siena')
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /comprar agora/i }))
    fireEvent.click(screen.getByRole('button', { name: /rafael lemos/i }))

    expect(
      screen.getByRole('heading', {
        name: /revise seus produtos antes de finalizar a compra\./i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /bolsa everyday siena/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: /^conta$/i }))

    expect(
      screen.getByRole('heading', { name: /bem-vindo, rafael\./i }),
    ).toBeInTheDocument()
  })

  it('shows the management center only for the account with store access and edits via modal', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    fireEvent.click(screen.getByRole('button', { name: /helena duarte/i }))

    fireEvent.click(screen.getByRole('link', { name: /central da loja/i }))

    expect(
      screen.getByRole('heading', {
        name: /catalogo, produtos vendidos e pedidos organizados em uma unica area\./i,
      }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /editar/i })[0])

    expect(
      screen.getByRole('heading', { name: /editar produto/i }),
    ).toBeInTheDocument()
  })
})

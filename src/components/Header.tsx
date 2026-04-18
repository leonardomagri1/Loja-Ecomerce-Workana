import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FormEvent } from 'react'
import type { DemoUser } from '../types'
import { getFirstName } from '../utils/formatters'
import './Header.css'

interface HeaderProps {
  currentUser: DemoUser | null
  cartItemCount: number
  canManage: boolean
  catalogSearch: string
  onSearchChange: (value: string) => void
  onLogout: () => void
  onLoginOpen: (reason: string) => void
}

export function Header({
  currentUser,
  cartItemCount,
  canManage,
  catalogSearch,
  onSearchChange,
  onLogout,
  onLoginOpen,
}: HeaderProps) {
  const navigate = useNavigate()

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/catalogo')
  }

  return (
    <header className="site-header">
      <div className="announcement-bar">
        <div className="container announcement-bar__content">
          <span>Frete grátis acima de R$ 199</span>
          <span className="hide-mobile">Entrega segura em todo o Brasil</span>
          <span>Parcelamento em até 12x</span>
        </div>
      </div>

      <div className="site-header__main container">
        <Link className="brand" to="/">
          <div className="brand__logo" />
          <div className="brand__info">
            <span className="brand__name">demo Loja Online</span>
            <span className="brand__tagline">Curadoria & Design</span>
          </div>
        </Link>

        <form className="header-search" onSubmit={handleSearchSubmit}>
          <div className="header-search__field">
            <input
              aria-label="Buscar produtos"
              placeholder="O que você procura hoje?"
              type="search"
              value={catalogSearch}
              onChange={(e) => onSearchChange(e.currentTarget.value)}
            />
            <button className="search-btn" type="submit" aria-label="Buscar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </form>

        <nav className="header-actions">
          <div className="header-nav-links hide-tablet">
            <NavLink className="header-link" to="/catalogo">Produtos</NavLink>
            {canManage && <NavLink className="header-link" to="/painel">Gestão</NavLink>}
          </div>

          <div className="header-divider hide-tablet" />

          <div className="header-utils">
            {currentUser ? (
              <div className="user-menu">
                <Link className="user-profile-link" to="/conta" title="Minha Conta">
                  <div className="user-avatar-mini">
                    {getFirstName(currentUser.name).charAt(0)}
                  </div>
                  <span className="user-name-label hide-mobile">
                    {getFirstName(currentUser.name)}
                  </span>
                </Link>
                <button className="header-logout-btn" onClick={onLogout} title="Sair">
                  Sair
                </button>
              </div>
            ) : (
              <button 
                className="header-icon-btn" 
                onClick={() => onLoginOpen('Entre para acessar sua experiência premium.')}
                title="Entrar"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="btn-label hide-mobile">Entrar</span>
              </button>
            )}

            <Link className="cart-pill" to="/carrinho">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-pill__count">{cartItemCount}</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

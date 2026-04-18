import { Link } from 'react-router-dom'
import type { CartEntry } from '../types'
import { getProductImage } from '../utils/productHelpers'
import { formatCurrency } from '../utils/formatters'
import './Pages.css'
import './CartPage.css'

interface CartPageProps {
  cartEntries: CartEntry[]
  cartSubtotal: number
  shippingCost: number
  cartTotal: number
  isAuthenticated: boolean
  onLoginRequest: () => void
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onCheckout: () => void
}

export function CartPage({
  cartEntries,
  cartSubtotal,
  shippingCost,
  cartTotal,
  isAuthenticated,
  onLoginRequest,
  onQuantityChange,
  onRemove,
  onCheckout,
}: CartPageProps) {
  if (!isAuthenticated) {
    return (
      <section className="section container">
        <div className="access-gate" data-reveal>
          <div className="access-gate__content">
            <span className="eyebrow">Checkout Seguro</span>
            <h1>Acesse sua conta para continuar.</h1>
            <p>
              Para garantir a segurança dos seus dados e agilizar sua entrega, 
              precisamos que você se identifique antes de concluir o pedido.
            </p>
            <button className="btn btn--primary btn--lg" onClick={onLoginRequest}>
              Entrar ou Criar Conta
            </button>
          </div>
          <div className="access-gate__visual">
             <div className="visual-circle" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="cart-page-wrapper">
      <section className="section container">
        <header className="section-header">
           <h1 className="section-title">Seu Carrinho</h1>
           <span className="cart-count__badge">{cartEntries.length} Itens</span>
        </header>

        {cartEntries.length === 0 ? (
          <div className="empty-state" data-reveal>
            <div className="empty-state__icon">🛍️</div>
            <strong>Seu carrinho está vazio.</strong>
            <p>Que tal explorar nossas novas coleções e encontrar algo especial?</p>
            <Link className="btn btn--primary" to="/catalogo" style={{ marginTop: '32px' }}>
              Voltar ao Catálogo
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-list" data-reveal>
              {cartEntries.map((entry) => (
                <article className="cart-item-card" key={entry.product.id}>
                  <div className="cart-item__thumb">
                    <img src={getProductImage(entry.product)} alt={entry.product.title} />
                  </div>
                  
                  <div className="cart-item__main">
                    <div className="cart-item__info">
                      <span className="cart-item__cat">{entry.product.category}</span>
                      <Link className="cart-item__name" to={`/produto/${entry.product.id}`}>
                        {entry.product.title}
                      </Link>
                      <span className="cart-item__price">{formatCurrency(entry.product.price)}</span>
                    </div>

                    <div className="cart-item__actions">
                      <div className="quantity-ctrl">
                        <button onClick={() => onQuantityChange(entry.product.id, entry.quantity - 1)}>-</button>
                        <span>{entry.quantity}</span>
                        <button onClick={() => onQuantityChange(entry.product.id, entry.quantity + 1)}>+</button>
                      </div>
                      
                      <div className="cart-item__subtotal">
                         <strong>{formatCurrency(entry.total)}</strong>
                         <button className="remove-btn" onClick={() => onRemove(entry.product.id)}>Remover</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary" data-reveal>
               <div className="summary-card">
                  <h3 className="summary-title">Resumo do Pedido</h3>
                  
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <strong>{formatCurrency(cartSubtotal)}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Frete</span>
                      <strong className={shippingCost === 0 ? 'free' : ''}>
                        {shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}
                      </strong>
                    </div>
                    <div className="summary-row summary-row--total">
                      <span>Total</span>
                      <strong className="total-amount">{formatCurrency(cartTotal)}</strong>
                    </div>
                  </div>

                  <button className="btn btn--primary btn--full btn--lg" onClick={onCheckout}>
                    Finalizar Compra
                  </button>
                  
                  <div className="summary-trust">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>Ambiente 100% seguro e criptografado</span>
                  </div>
               </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  )
}

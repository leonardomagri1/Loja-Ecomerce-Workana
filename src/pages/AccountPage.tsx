import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { DemoUser, Order, PaymentMethod, Address } from '../types'
import { getFirstName, formatDate, formatCurrency } from '../utils/formatters'
import './Pages.css'
import './AccountPage.css'

interface AccountPageProps {
  user: DemoUser | null
  canManage: boolean
  orders: Order[]
  paymentMethods: PaymentMethod[]
  addresses: Address[]
  onLoginRequest: () => void
}

export function AccountPage({
  user,
  canManage,
  orders,
  paymentMethods,
  addresses,
  onLoginRequest,
}: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<'painel' | 'pedidos' | 'enderecos' | 'pagamentos'>('painel')

  if (!user) {
    return (
      <section className="section container">
        <div className="access-gate" data-reveal>
          <div className="access-gate__content">
            <span className="eyebrow">Experiência Personalizada</span>
            <h1>Sua conta, suas escolhas.</h1>
            <p>
              Acompanhe seus pedidos, gerencie seus endereços e salve seus métodos 
              de pagamento para um checkout em um clique.
            </p>
            <button className="btn btn--primary btn--lg" onClick={onLoginRequest}>
              Acessar Minha Conta
            </button>
          </div>
          <div className="access-gate__visual" />
        </div>
      </section>
    )
  }

  return (
    <div className="account-page-wrapper">
      <section className="section container">
        <div className="account-layout">
          <aside className="account-sidebar" data-reveal>
            <div className="account-sidebar__user">
              <div className="user-avatar">{getFirstName(user.name).charAt(0)}</div>
              <div className="user-info">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>

            <nav className="account-nav">
              <button 
                className={`account-nav__item ${activeTab === 'painel' ? 'active' : ''}`}
                onClick={() => setActiveTab('painel')}
              >
                Visão Geral
              </button>
              <button 
                className={`account-nav__item ${activeTab === 'pedidos' ? 'active' : ''}`}
                onClick={() => setActiveTab('pedidos')}
              >
                Meus Pedidos
              </button>
              <button 
                className={`account-nav__item ${activeTab === 'enderecos' ? 'active' : ''}`}
                onClick={() => setActiveTab('enderecos')}
              >
                Endereços
              </button>
              <button 
                className={`account-nav__item ${activeTab === 'pagamentos' ? 'active' : ''}`}
                onClick={() => setActiveTab('pagamentos')}
              >
                Pagamento
              </button>
            </nav>

            {canManage && (
              <div className="account-sidebar__admin">
                <span className="eyebrow">Gestão</span>
                <Link className="btn btn--secondary btn--full" to="/painel">
                  Painel Administrativo
                </Link>
              </div>
            )}
          </aside>

          <main className="account-content" data-reveal>
            {activeTab === 'painel' && (
              <div className="account-pane">
                <header className="account-pane__header">
                  <h1>Olá, {getFirstName(user.name)}</h1>
                  <p>Bem-vindo ao seu espaço exclusivo na demo Loja Online.</p>
                </header>

                <div className="account-overview-grid">
                  <div className="overview-card">
                    <h3>Último Pedido</h3>
                    {orders.length > 0 ? (
                      <div className="mini-order">
                        <strong>{orders[0].id}</strong>
                        <span>Status: <span className="status-label">{orders[0].status}</span></span>
                        <button className="text-link" onClick={() => setActiveTab('pedidos')}>Ver todos os pedidos</button>
                      </div>
                    ) : (
                      <p>Nenhum pedido realizado ainda.</p>
                    )}
                  </div>

                  <div className="overview-card">
                    <h3>Endereço Principal</h3>
                    {addresses.length > 0 ? (
                      <div className="mini-address">
                        <strong>{addresses[0].label}</strong>
                        <p>{addresses[0].street}, {addresses[0].city}</p>
                        <button className="text-link" onClick={() => setActiveTab('enderecos')}>Gerenciar endereços</button>
                      </div>
                    ) : (
                      <p>Nenhum endereço cadastrado.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pedidos' && (
              <div className="account-pane">
                 <header className="account-pane__header">
                  <h2>Meus Pedidos</h2>
                  <p>Acompanhe o status e histórico de suas compras.</p>
                </header>

                <div className="orders-list">
                  {orders.length === 0 ? (
                    <div className="empty-pane">
                      <p>Você ainda não possui pedidos.</p>
                      <Link className="btn btn--secondary" to="/catalogo">Explorar Produtos</Link>
                    </div>
                  ) : (
                    orders.map(order => (
                      <article className="order-item-card" key={order.id}>
                        <div className="order-item__header">
                           <div className="order-id">
                              <strong>Pedido {order.id}</strong>
                              <span>{formatDate(order.createdAt)}</span>
                           </div>
                           <div className="order-status">
                              <span className="status-badge">{order.status}</span>
                              <strong className="order-total">{formatCurrency(order.total)}</strong>
                           </div>
                        </div>

                        <div className="order-timeline">
                           {order.tracking.map(step => (
                             <div key={step.label} className={`timeline-step ${step.done ? 'done' : ''}`}>
                                <div className="step-dot" />
                                <span className="step-label">{step.label}</span>
                             </div>
                           ))}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'enderecos' && (
               <div className="account-pane">
                  <header className="account-pane__header">
                    <h2>Endereços de Entrega</h2>
                  </header>
                  <div className="addresses-stack">
                    {addresses.map(addr => (
                      <div className="address-card" key={addr.id}>
                        <div className="address-card__info">
                           <strong>{addr.label}</strong>
                           <p>{addr.street} · {addr.city}, {addr.state}</p>
                           <span>CEP: {addr.zipCode}</span>
                        </div>
                        <button className="icon-btn">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                           </svg>
                        </button>
                      </div>
                    ))}
                    <button className="btn btn--secondary btn--full" style={{ marginTop: '20px' }}>
                      Adicionar Novo Endereço
                    </button>
                  </div>
               </div>
            )}

            {activeTab === 'pagamentos' && (
               <div className="account-pane">
                  <header className="account-pane__header">
                    <h2>Métodos de Pagamento</h2>
                  </header>
                  <div className="payments-stack">
                    {paymentMethods.map(method => (
                      <div className="payment-method-card" key={method.id}>
                        <div className="payment-method__brand">
                           <div className="card-icon">💳</div>
                           <div className="card-info">
                              <strong>{method.label}</strong>
                              <span>{method.brand} · Final {method.last4}</span>
                           </div>
                        </div>
                        <span className="card-expiry">Expira em {method.expiry}</span>
                      </div>
                    ))}
                    <button className="btn btn--secondary btn--full" style={{ marginTop: '20px' }}>
                      Adicionar Novo Cartão
                    </button>
                  </div>
               </div>
            )}
          </main>
        </div>
      </section>
    </div>
  )
}

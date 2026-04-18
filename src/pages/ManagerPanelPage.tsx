import type { Product, ProductSalesEntry, Order } from '../types'
import { formatCurrency, formatDate } from '../utils/formatters'
import './Pages.css'
import './ManagerPanel.css'

interface ManagerPanelPageProps {
  products: Product[]
  orders: Order[]
  salesStats: ProductSalesEntry[]
  onEditProduct: (product: Product) => void
  onNewProduct: () => void
  onToggleStatus: (productId: string) => void
}

export function ManagerPanelPage({
  products,
  orders,
  salesStats,
  onEditProduct,
  onNewProduct,
  onToggleStatus,
}: ManagerPanelPageProps) {
  const totalRevenue = salesStats.reduce((sum, s) => sum + s.revenue, 0)
  const totalUnits = salesStats.reduce((sum, s) => sum + s.units, 0)

  return (
    <div className="manager-page-wrapper">
      <section className="section container">
        <header className="section-header manager-header">
           <div className="section-header__info">
              <span className="eyebrow">Administração</span>
              <h1 className="section-title">Centro de Gestão</h1>
           </div>
           <button className="btn btn--primary btn--lg" onClick={onNewProduct}>
              + Novo Produto
           </button>
        </header>

        <div className="manager-stats-grid" data-reveal>
           <div className="stat-card">
              <span className="stat-label">Receita Total</span>
              <strong className="stat-value">{formatCurrency(totalRevenue)}</strong>
           </div>
           <div className="stat-card">
              <span className="stat-label">Unidades Vendidas</span>
              <strong className="stat-value">{totalUnits}</strong>
           </div>
           <div className="stat-card">
              <span className="stat-label">Pedidos Ativos</span>
              <strong className="stat-value">{orders.filter(o => o.status !== 'Entregue').length}</strong>
           </div>
           <div className="stat-card">
              <span className="stat-label">Ticket Médio</span>
              <strong className="stat-value">{formatCurrency(totalRevenue / (orders.length || 1))}</strong>
           </div>
        </div>

        <div className="manager-content-layout">
           <section className="manager-section" data-reveal>
              <div className="manager-section__header">
                 <h2>Inventário de Produtos</h2>
                 <span>{products.length} itens no catálogo</span>
              </div>

              <div className="manager-table-wrapper">
                 <table className="manager-table">
                    <thead>
                       <tr>
                          <th>Produto</th>
                          <th>Categoria</th>
                          <th>Preço</th>
                          <th>Estoque</th>
                          <th>Status</th>
                          <th>Ações</th>
                       </tr>
                    </thead>
                    <tbody>
                       {products.map(product => (
                         <tr key={product.id}>
                            <td>
                               <div className="table-product">
                                  <strong>{product.title}</strong>
                                  <span>SKU: {product.sku}</span>
                               </div>
                            </td>
                            <td>{product.category}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>
                               <span className={`stock-indicator ${product.stock < 5 ? 'low' : ''}`}>
                                  {product.stock} un
                               </span>
                            </td>
                            <td>
                               <button 
                                 className={`status-toggle ${product.status.toLowerCase()}`}
                                 onClick={() => onToggleStatus(product.id)}
                               >
                                 {product.status}
                               </button>
                            </td>
                            <td>
                               <button className="icon-btn" onClick={() => onEditProduct(product)}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </section>

           <section className="manager-section" data-reveal>
              <div className="manager-section__header">
                 <h2>Pedidos Recentes</h2>
              </div>

              <div className="manager-table-wrapper">
                 <table className="manager-table">
                    <thead>
                       <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Data</th>
                          <th>Total</th>
                          <th>Status</th>
                       </tr>
                    </thead>
                    <tbody>
                       {orders.slice(0, 10).map(order => (
                         <tr key={order.id}>
                            <td><strong>{order.id}</strong></td>
                            <td>{order.customerName}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>{formatCurrency(order.total)}</td>
                            <td><span className="status-badge">{order.status}</span></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </section>
        </div>
      </section>
    </div>
  )
}

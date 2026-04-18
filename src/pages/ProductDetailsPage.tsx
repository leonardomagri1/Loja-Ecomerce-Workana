import { useParams } from 'react-router-dom'
import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { getProductImage, getProductDisplayMeta } from '../utils/productHelpers'
import { formatCurrency } from '../utils/formatters'
import './Pages.css'
import './ProductDetails.css'

interface ProductDetailsPageProps {
  products: Product[]
  relatedProducts: Product[]
  onAddToCart: (productId: string, action: 'add' | 'buy') => void
  onBuyNow: (productId: string, action: 'add' | 'buy') => void
}

export function ProductDetailsPage({
  products,
  relatedProducts,
  onAddToCart,
  onBuyNow,
}: ProductDetailsPageProps) {
  const { productId } = useParams()
  const product = products.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="container section">
        <div className="empty-state">
           <strong>Produto não encontrado.</strong>
           <p>O item solicitado não está mais disponível ou foi removido.</p>
        </div>
      </div>
    )
  }

  const meta = getProductDisplayMeta(product)
  const imageUrl = getProductImage(product)

  return (
    <div className="product-details-page">
      <section className="section container product-main">
        <div className="product-gallery" data-reveal>
          <div className="product-gallery__stage">
            <img src={imageUrl} alt={product.title} />
            {product.badge && <span className="product-badge">{product.badge}</span>}
          </div>
          
          <div className="product-highlights">
             {meta.features.map(feature => (
               <div key={feature} className="feature-chip">{feature}</div>
             ))}
          </div>
        </div>

        <div className="product-info" data-reveal>
          <header className="product-info__header">
            <span className="eyebrow">{product.category}</span>
            <h1 className="product-title">{product.title}</h1>
            <div className="product-rating">
              <span className="star-icon">★</span>
              <strong>{meta.rating.toFixed(1)}</strong>
              <span>({meta.reviewCount} avaliações)</span>
            </div>
          </header>

          <p className="product-description">{product.longDescription}</p>

          <div className="product-price-section">
            <div className="price-group">
              {product.originalPrice && (
                <span className="price-old">{formatCurrency(product.originalPrice)}</span>
              )}
              <strong className="price-current">{formatCurrency(meta.price)}</strong>
            </div>
            <em className="installments-text">{meta.installments}</em>
          </div>

          <div className="product-utility-grid">
             <div className="utility-item">
                <span className="label">Marca</span>
                <strong>{product.brand}</strong>
             </div>
             <div className="utility-item">
                <span className="label">Expedição</span>
                <strong>{meta.shipping}</strong>
             </div>
             <div className="utility-item">
                <span className="label">Disponibilidade</span>
                <strong>{product.stock > 0 ? 'Em estoque' : 'Indisponível'}</strong>
             </div>
          </div>

          <div className="product-actions">
            <button 
              className="btn btn--primary btn--lg" 
              onClick={() => onBuyNow(product.id, 'buy')}
              disabled={product.stock <= 0}
            >
              Comprar Agora
            </button>
            <button 
              className="btn btn--secondary btn--lg" 
              onClick={() => onAddToCart(product.id, 'add')}
              disabled={product.stock <= 0}
            >
              Adicionar ao Carrinho
            </button>
          </div>

          <div className="product-specs">
             <h3 className="specs-title">Especificações Técnicas</h3>
             <div className="specs-list">
                {meta.specs.map(spec => (
                  <div key={spec.label} className="spec-row">
                    <span>{spec.label}</span>
                    <strong>{spec.value}</strong>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <header className="section-header">
           <h2 className="section-title">Você também pode gostar</h2>
        </header>
        <div className="product-grid">
           {relatedProducts
            .filter(p => p.id !== product.id)
            .slice(0, 4)
            .map(p => (
              <ProductCard key={p.id} product={p} />
           ))}
        </div>
      </section>
    </div>
  )
}

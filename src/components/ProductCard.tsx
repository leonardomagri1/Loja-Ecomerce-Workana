import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatCurrency } from '../utils/formatters'
import { getProductImage, getProductDisplayMeta } from '../utils/productHelpers'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string, action: 'add' | 'buy') => void
  onBuyNow?: (productId: string, action: 'add' | 'buy') => void
  showActionButtons?: boolean
}

export function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  showActionButtons = false,
}: ProductCardProps) {
  const meta = getProductDisplayMeta(product)
  const imageUrl = getProductImage(product)

  return (
    <article className={`product-card product-card--${product.accent}`} data-reveal>
      <Link className="product-card__visual" to={`/produto/${product.id}`}>
        <img src={imageUrl} alt={product.title} className="product-card__image" loading="lazy" />
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
      </Link>

      <div className="product-card__body">
        <header className="product-card__header">
          <span className="product-card__category">{product.category}</span>
          <Link className="product-card__title" to={`/produto/${product.id}`}>
            {product.title}
          </Link>
        </header>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__price-box">
          <div className="product-card__prices">
            {product.originalPrice && (
              <span className="product-card__price-old">{formatCurrency(product.originalPrice)}</span>
            )}
            <strong className="product-card__price-current">{formatCurrency(meta.price)}</strong>
          </div>
          <em className="product-card__installments">{meta.installments}</em>
        </div>

        <div className="product-card__footer">
          <div className="product-card__rating">
            <span className="star-icon">★</span>
            <strong>{meta.rating.toFixed(1)}</strong>
            <span>({meta.reviewCount})</span>
          </div>

          {showActionButtons && onAddToCart && onBuyNow ? (
            <div className="product-card__actions">
              <button
                className="btn btn--secondary btn--sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product.id, 'add');
                }}
              >
                + Carrinho
              </button>
              <button
                className="btn btn--primary btn--sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onBuyNow(product.id, 'buy');
                }}
              >
                Comprar
              </button>
            </div>
          ) : (
            <Link className="btn btn--ghost btn--sm btn--full" to={`/produto/${product.id}`}>
              Ver Detalhes
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

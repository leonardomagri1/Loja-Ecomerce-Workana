import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { CategoryNav } from '../components/CategoryNav'
import './Pages.css'

interface CatalogPageProps {
  activeCategory: string
  products: Product[]
  categories: string[]
  searchValue: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onAddToCart: (productId: string, action: 'add' | 'buy') => void
  onBuyNow: (productId: string, action: 'add' | 'buy') => void
}

export function CatalogPage({
  activeCategory,
  products,
  categories,
  searchValue,
  onSearchChange,
  onCategoryChange,
  onAddToCart,
  onBuyNow,
}: CatalogPageProps) {
  return (
    <div className="catalog-page">
      <section className="section container catalog-header" data-reveal>
        <div className="section-header">
          <span className="eyebrow">Nosso Portfólio</span>
          <h1 className="section-title">Explore a Curadoria</h1>
          <p className="catalog-header__text">
            Itens selecionados para elevar seu estilo de vida, do design funcional ao bem-estar absoluto.
          </p>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-search-bar">
             <input
                placeholder="Buscar por nome, marca ou categoria..."
                type="search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.currentTarget.value)}
              />
          </div>
          <CategoryNav 
            categories={categories} 
            activeCategory={activeCategory} 
            onCategoryChange={onCategoryChange} 
          />
        </div>
      </section>

      <section className="section container">
        <div className="catalog-info" data-reveal>
          <span className="catalog-count">Mostrando {products.length} {products.length === 1 ? 'produto' : 'produtos'}</span>
        </div>

        {products.length === 0 ? (
          <div className="empty-state" data-reveal>
            <div className="empty-state__icon">🔍</div>
            <strong>Nenhum item encontrado.</strong>
            <p>Tente outros termos de busca ou limpe os filtros para ver mais opções.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                showActionButtons
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

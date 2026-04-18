import type { Product } from '../types'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import './Pages.css'

interface HomePageProps {
  featuredProducts: Product[]
  onCategorySelect: (category: string) => void
}

export function HomePage({ featuredProducts, onCategorySelect }: HomePageProps) {
  return (
    <div className="home-page">
      <Hero onExplore={() => onCategorySelect('Casa & Decor')} />

      <section className="section container">
        <header className="section-header" data-reveal>
          <div className="section-header__info">
            <span className="eyebrow">Curadoria Especial</span>
            <h2 className="section-title">Destaques da Temporada</h2>
          </div>
          <p className="section-header__text">
            Uma seleção exclusiva de produtos que combinam funcionalidade 
            com o melhor do design contemporâneo.
          </p>
        </header>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showActionButtons={false}
            />
          ))}
        </div>
      </section>

      <section className="section section--accent container">
        <div className="promo-banner" data-reveal>
          <div className="promo-banner__content">
            <span className="eyebrow">Lifestyle Premium</span>
            <h2>Experiência demo Loja Online</h2>
            <p>
              Mais do que uma loja, somos uma vitrine de inspirações para 
              quem valoriza o bem-estar e a estética em cada detalhe.
            </p>
            <div className="promo-banner__features">
              <div className="feature-item">
                <span className="icon">✓</span>
                <span>Produtos selecionados a mão</span>
              </div>
              <div className="feature-item">
                <span className="icon">✓</span>
                <span>Garantia de autenticidade</span>
              </div>
              <div className="feature-item">
                <span className="icon">✓</span>
                <span>Suporte premium dedicado</span>
              </div>
            </div>
          </div>
          <div className="promo-banner__image">
             <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000" alt="Lifestyle" />
          </div>
        </div>
      </section>
    </div>
  )
}

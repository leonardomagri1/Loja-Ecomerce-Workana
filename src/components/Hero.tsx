import { Link } from 'react-router-dom'
import './Hero.css'

interface HeroProps {
  onExplore: () => void
}

export function Hero({ onExplore }: HeroProps) {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__content" data-reveal>
          <span className="eyebrow">Qualidade & Design Exclusivo</span>
          <h1 className="hero__title">
            Transforme sua casa em um <span className="highlight">refúgio de sofisticação.</span>
          </h1>
          <p className="hero__description">
            Curadoria selecionada de objetos de decoração, rituais de autocuidado e 
            presentes inesquecíveis para uma rotina extraordinária.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/catalogo">Explorar Coleções</Link>
            <button className="btn btn--secondary" onClick={onExplore}>Ver Tendências</button>
          </div>
          
          <div className="hero__metrics">
            <div className="metric">
              <strong>24h</strong>
              <span>Envio prioritário</span>
            </div>
            <div className="metric">
              <strong>12x</strong>
              <span>Parcelamento sem juros</span>
            </div>
            <div className="metric">
              <strong>10%</strong>
              <span>Primeira compra</span>
            </div>
          </div>
        </div>

        <div className="hero__visual" data-reveal>
          <div className="hero__image-container">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200" 
              alt="Ambiente decorado premium" 
              className="hero__image"
            />
            <div className="hero__floating-card">
              <span className="badge">Lançamento</span>
              <strong>Coleção Minimalista</strong>
              <p>Novas texturas e cores neutras.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

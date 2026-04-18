import { Link } from 'react-router-dom'
import './Footer.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link className="brand" to="/">
            <div className="brand__logo" />
            <span className="brand__name">demo Loja Online</span>
          </Link>
          <p className="site-footer__about">
            Sua curadoria definitiva de lifestyle, com foco em design, 
            qualidade e uma experiência de compra sem atritos.
          </p>
        </div>

        <div className="site-footer__nav">
          <div className="footer-col">
            <h4 className="footer-title">Institucional</h4>
            <ul className="footer-links">
              <li><Link to="/catalogo">Coleções</Link></li>
              <li><Link to="/sobre">Nossa Curadoria</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Suporte</h4>
            <ul className="footer-links">
              <li><Link to="/envio">Envio & Entrega</Link></li>
              <li><Link to="/trocas">Trocas & Devoluções</Link></li>
              <li><Link to="/privacidade">Privacidade</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Newsletter</h4>
            <p className="footer-text">Receba novidades e lançamentos exclusivos.</p>
            <form className="footer-newsletter">
              <input type="email" placeholder="Seu melhor e-mail" />
              <button type="button">Assinar</button>
            </form>
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span className="copyright">© {currentYear} demo Loja Online. Todos os direitos reservados.</span>
        <div className="social-links">
          {/* Placeholder for social links icons if needed */}
        </div>
      </div>
    </footer>
  )
}

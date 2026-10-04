import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="header__logo" aria-label="ZeroDispute LeaseOS home">
              <span className="header__logo-mark" aria-hidden="true">T</span>
              Tenancy<span className="header__logo-accent">OS</span>
            </Link>
            <p className="footer__brand-desc">Your tenancy, run.</p>
          </div>

          <div>
            <h4 className="footer__col-title">Product</h4>
            <a href="/#how-it-works" className="footer__link" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }}>How it works</a>
            <a href="/#live-demo" className="footer__link" onClick={(e) => { e.preventDefault(); document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' }) }}>Live demo</a>
            <a href="/#architecture" className="footer__link" onClick={(e) => { e.preventDefault(); document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' }) }}>Architecture</a>
            <Link to="/start" className="footer__link">Start</Link>
          </div>

          <div>
            <h4 className="footer__col-title">Legal</h4>
            <Link to="/privacy" className="footer__link">Privacy Policy</Link>
            <Link to="/terms" className="footer__link">Terms of Service</Link>
          </div>

          <div>
            <h4 className="footer__col-title">Contact</h4>
            <a href="mailto:hello@zerodisputeleaseos.in" className="footer__link">hello@zerodisputeleaseos.in</a>
            <a href="mailto:support@zerodisputeleaseos.in" className="footer__link">support@zerodisputeleaseos.in</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__concept">Concept product for the NoBroker ecosystem</span>
          <span className="footer__copy">ZeroDispute LeaseOS 2026. Strategic product concept.</span>
        </div>
      </div>
    </footer>
  )
}

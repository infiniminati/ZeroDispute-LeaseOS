import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Live demo', href: '/#live-demo' },
  { label: 'Architecture', href: '/#architecture' },
  { label: 'Trust', href: '/#trust' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    setMenuOpen(false)

    if (href.startsWith('/#')) {
      const id = href.substring(2)
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location.pathname, navigate])

  return (
    <>
      <header className="header" role="banner">
        <div className="header__inner">
          <Link to="/" className="header__logo" aria-label="ZeroDispute LeaseOS home">
            <span className="header__logo-mark" aria-hidden="true">Z</span>
            ZeroDispute <span className="header__logo-accent">LeaseOS</span>
          </Link>

          <nav className="header__nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="header__nav-link"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Link to="/start" className="btn btn--primary btn--small header__cta">
            Start your tenancy
          </Link>

          <button
            className={`header__menu-btn ${menuOpen ? 'header__menu-btn--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="header__menu-icon" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`} role="navigation" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="mobile-menu__link"
            onClick={(e) => handleNavClick(e, item.href)}
          >
            {item.label}
          </a>
        ))}
        <div className="mobile-menu__cta">
          <Link
            to="/start"
            className="btn btn--primary btn--full"
            onClick={() => setMenuOpen(false)}
          >
            Start your tenancy
          </Link>
        </div>
      </div>
    </>
  )
}

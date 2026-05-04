import { Link, useLocation } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const { pathname } = useLocation()

  const nav = [
    { path: '/', label: 'Acasă', icon: '🏠' },
    { path: '/raporteaza', label: 'Raportează', icon: '📢' },
    { path: '/harta', label: 'Hartă', icon: '🗺️' },
  ]

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">CiviQ</span>
          </Link>
          <nav className="desktop-nav">
            {nav.map(n => (
              <Link key={n.path} to={n.path} className={`nav-link ${pathname === n.path ? 'active' : ''}`}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {nav.map(n => (
          <Link key={n.path} to={n.path} className={`mobile-nav-item ${pathname === n.path ? 'active' : ''}`}>
            <span className="mobile-nav-icon">{n.icon}</span>
            <span className="mobile-nav-label">{n.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}

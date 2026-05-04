import { useParams, Link } from 'react-router-dom'
import './Success.css'

export default function Success() {
  const { id } = useParams()
  const short = id?.slice(0, 8).toUpperCase()

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-card card fade-up">
          <div className="success-icon">✅</div>
          <h1>Sesizare înregistrată!</h1>
          <p>Mulțumim că ai contribuit la îmbunătățirea orașului.</p>

          <div className="ticket-id">
            <span className="ticket-label">ID sesizare</span>
            <span className="ticket-num">#{short}</span>
          </div>

          <div className="next-steps">
            <div className="next-step">
              <span>📬</span>
              <span>Sesizarea ta a fost salvată și va fi vizibilă pe hartă.</span>
            </div>
            <div className="next-step">
              <span>🔔</span>
              <span>Dacă ai furnizat emailul, vei primi notificări la actualizări.</span>
            </div>
            <div className="next-step">
              <span>📋</span>
              <span>Lucrăm la trimiterea automată către autoritatea competentă.</span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/raporteaza" className="btn btn-primary">
              + Raportează altă problemă
            </Link>
            <Link to="/harta" className="btn btn-secondary">
              🗺️ Vezi harta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

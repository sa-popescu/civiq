import { Link } from 'react-router-dom'
import './Home.css'

const features = [
  { icon: '🧠', title: 'AI inteligent', desc: 'Descrie problema cum vrei — sistemul o clasifică și găsește autoritatea potrivită automat.' },
  { icon: '📬', title: 'Sesizare formală', desc: 'Generăm textul oficial al sesizării, gata de trimis, conform cerințelor fiecărei instituții.' },
  { icon: '🗺️', title: 'Hartă publică', desc: 'Toate problemele raportate vizibile pe o hartă live a orașului.' },
  { icon: '🔔', title: 'Urmărire status', desc: 'Creează un cont opțional și urmărești evoluția sesizărilor tale.' },
]

const problemTypes = [
  { icon: '🕳️', label: 'Gropi în asfalt' },
  { icon: '🚧', label: 'Indicatoare' },
  { icon: '🌳', label: 'Spații verzi' },
  { icon: '💡', label: 'Iluminat' },
  { icon: '🚌', label: 'Transport' },
  { icon: '🗑️', label: 'Salubritate' },
]

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">🇷🇴 Civic · Gratuit · Deschis</div>
          <h1>Orașul tău,<br /><span className="hero-accent">vocea ta.</span></h1>
          <p className="hero-sub">
            Raportează probleme urbane în câteva secunde. CiviQ le clasifică automat
            și le trimite autorității competente — fără birocrație.
          </p>
          <div className="hero-actions">
            <Link to="/raporteaza" className="btn btn-primary btn-lg">
              📢 Raportează acum
            </Link>
            <Link to="/harta" className="btn btn-secondary btn-lg">
              Vezi harta
            </Link>
          </div>

          {/* Problem type pills */}
          <div className="type-pills">
            {problemTypes.map(t => (
              <div key={t.label} className="type-pill">
                <span>{t.icon}</span> {t.label}
              </div>
            ))}
            <div className="type-pill type-pill-more">+ altele</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how">
        <div className="container">
          <h2>Cum funcționează</h2>
          <div className="steps">
            {[
              { n: '1', label: 'Descrie problema', desc: 'În cuvinte proprii, cât de simplu vrei.' },
              { n: '2', label: 'AI clasifică', desc: 'Tipul problemei și autoritatea sunt detectate automat.' },
              { n: '3', label: 'Trimiți sesizarea', desc: 'Un singur click. Textul formal e generat pentru tine.' },
            ].map(s => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <div>
                  <div className="step-title">{s.label}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card card fade-up">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box card">
            <h2>Gata să raportezi?</h2>
            <p>Durează mai puțin de 60 de secunde.</p>
            <Link to="/raporteaza" className="btn btn-primary btn-lg">
              Începe acum →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

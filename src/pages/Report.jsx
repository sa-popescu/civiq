import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { classifyReport } from '../lib/classify'
import { supabase, AUTHORITY_MAP } from '../lib/supabase'
import './Report.css'

const STEPS = ['describe', 'review', 'details', 'confirm']

export default function Report() {
  const navigate = useNavigate()
  const [step, setStep] = useState('describe')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [classified, setClassified] = useState(null)
  const [error, setError] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [extraFields, setExtraFields] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Step 1: Send description to AI
  async function handleClassify() {
    if (!description.trim() || description.length < 10) {
      setError('Te rugăm să descrii problema în cel puțin 10 caractere.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const result = await classifyReport(description)
      if (result.error) { setError(result.error); return }
      setClassified(result)
      setStep('review')
    } catch {
      setError('Eroare de conexiune. Verifică internetul și încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Submit to Supabase
  async function handleSubmit() {
    setSubmitting(true)
    try {
      const { data, error: dbErr } = await supabase.from('reports').insert([{
        description,
        problem_type: classified.type,
        title: classified.titlu,
        formal_text: classified.sesizare_formala,
        urgency: classified.urgenta,
        address: classified.adresa_extrasa || extraFields.adresa || null,
        sector: classified.sector || null,
        authority_name: classified.authority?.name,
        authority_email: classified.authority?.email,
        user_email: userEmail || null,
        status: 'nou',
        ...extraFields
      }]).select().single()

      if (dbErr) throw dbErr
      navigate(`/succes/${data.id}`)
    } catch (e) {
      setError('Eroare la salvarea sesizării: ' + e.message)
      setSubmitting(false)
    }
  }

  const urgencyClass = classified ? `urgency-${classified.urgenta}` : ''
  const typeInfo = classified ? AUTHORITY_MAP[classified.type] : null
  const extraFieldDefs = typeInfo?.fields?.filter(f => !['adresa'].includes(f)) || []

  return (
    <div className="report-page">
      <div className="container">

        {/* Progress */}
        <div className="progress-bar">
          {['Descrie', 'Verifică', 'Detalii', 'Trimite'].map((label, i) => {
            const stepKey = STEPS[i]
            const idx = STEPS.indexOf(step)
            return (
              <div key={label} className={`progress-step ${i <= idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}>
                <div className="progress-dot">{i < idx ? '✓' : i + 1}</div>
                <div className="progress-label">{label}</div>
              </div>
            )
          })}
        </div>

        {/* ── STEP 1: Describe ── */}
        {step === 'describe' && (
          <div className="step-panel fade-up">
            <h2>Ce problemă ai observat?</h2>
            <p>Descrie cu propriile cuvinte. AI-ul se ocupă de restul.</p>

            <div className="describe-box">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Pe strada Mihai Eminescu nr. 14, lângă trecerea de pietoni, există o groapă mare în asfalt care pune în pericol mașinile și motocicletele..."
                rows={5}
                maxLength={1000}
              />
              <div className="char-count">{description.length}/1000</div>
            </div>

            <div className="hint-row">
              <span className="hint">💡 Poți menționa strada, sectorul, tipul problemei.</span>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleClassify}
              disabled={loading || description.length < 10}
            >
              {loading ? <><div className="spinner" /> Analizez...</> : 'Analizează →'}
            </button>
          </div>
        )}

        {/* ── STEP 2: Review AI result ── */}
        {step === 'review' && classified && (
          <div className="step-panel fade-up">
            <h2>Am identificat problema</h2>
            <p>Verifică dacă clasificarea este corectă.</p>

            <div className={`classified-card card ${urgencyClass}`}>
              <div className="classified-header">
                <span className="classified-icon">{typeInfo?.icon}</span>
                <div>
                  <div className="classified-type">{typeInfo?.label}</div>
                  <div className="classified-explain">{classified.explicatie}</div>
                </div>
                <span className="urgency-pill">{classified.urgenta}</span>
              </div>

              <div className="divider" />

              <div className="authority-row">
                <div className="authority-label">📬 Autoritate competentă</div>
                <div className="authority-name">{classified.authority?.name}</div>
                <div className="authority-email">{classified.authority?.email}</div>
              </div>

              {typeInfo?.tip && (
                <div className="tip-box">ℹ️ {typeInfo.tip}</div>
              )}
            </div>

            <div className="formal-preview card">
              <div className="formal-label">✍️ Textul sesizării generate</div>
              <div className="formal-text">{classified.sesizare_formala}</div>
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => { setStep('describe'); setClassified(null) }}>
                ← Modifică descrierea
              </button>
              <button className="btn btn-primary" onClick={() => setStep('details')}>
                Continuă →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Extra details ── */}
        {step === 'details' && (
          <div className="step-panel fade-up">
            <h2>Detalii adiționale</h2>
            <p>Toate câmpurile sunt opționale, dar ajută la procesarea mai rapidă.</p>

            <div className="form-group">
              <label>Adresă exactă</label>
              <input type="text" placeholder="Stradă, număr, sector..."
                value={extraFields.adresa || classified?.adresa_extrasa || ''}
                onChange={e => setExtraFields(p => ({...p, adresa: e.target.value}))} />
            </div>

            {!classified?.sector && (
              <div className="form-group">
                <label>Sector</label>
                <select onChange={e => setExtraFields(p => ({...p, sector: e.target.value}))}>
                  <option value="">— Selectează sectorul —</option>
                  {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Sectorul {s}</option>)}
                </select>
              </div>
            )}

            {extraFieldDefs.includes('pericol_imediat') && (
              <div className="form-group">
                <label>Reprezintă pericol imediat?</label>
                <select onChange={e => setExtraFields(p => ({...p, pericol_imediat: e.target.value}))}>
                  <option value="nu">Nu</option>
                  <option value="da">Da</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Email (opțional — pentru a urmări statusul)</label>
              <input type="email" placeholder="email@exemplu.ro"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)} />
              <span style={{fontSize:'12px',color:'var(--gray-400)'}}>Nu vom trimite spam. Folosit doar pentru notificări despre această sesizare.</span>
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep('review')}>← Înapoi</button>
              <button className="btn btn-primary" onClick={() => setStep('confirm')}>Continuă →</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Confirm & Send ── */}
        {step === 'confirm' && (
          <div className="step-panel fade-up">
            <h2>Ești gata să trimiți?</h2>

            <div className="confirm-summary card">
              <div className="summary-row">
                <span className="summary-key">Tip problemă</span>
                <span className="summary-val">{typeInfo?.icon} {typeInfo?.label}</span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Autoritate</span>
                <span className="summary-val">{classified?.authority?.name}</span>
              </div>
              {(extraFields.adresa || classified?.adresa_extrasa) && (
                <div className="summary-row">
                  <span className="summary-key">Adresă</span>
                  <span className="summary-val">{extraFields.adresa || classified?.adresa_extrasa}</span>
                </div>
              )}
              <div className="summary-row">
                <span className="summary-key">Urgență</span>
                <span className={`badge ${classified?.urgenta === 'ridicată' ? 'badge-red' : classified?.urgenta === 'medie' ? 'badge-amber' : 'badge-green'}`}>
                  {classified?.urgenta}
                </span>
              </div>
              {userEmail && (
                <div className="summary-row">
                  <span className="summary-key">Notificări la</span>
                  <span className="summary-val">{userEmail}</span>
                </div>
              )}
            </div>

            <div className="info-box">
              <strong>📋 Ce se întâmplă după trimitere?</strong><br />
              Sesizarea va fi salvată în baza noastră de date și vizibilă pe hartă.
              Vom lucra la trimiterea automată către autorități în versiunile viitoare.
            </div>

            {error && <div className="error-box">{error}</div>}

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep('details')}>← Înapoi</button>
              <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><div className="spinner" /> Se trimite...</> : '📬 Trimite sesizarea'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

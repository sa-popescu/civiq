import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { supabase, AUTHORITY_MAP } from '../lib/supabase'
import { Link } from 'react-router-dom'
import './Map.css'

const URGENCY_COLORS = { ridicată: '#ef4444', medie: '#f59e0b', scăzută: '#10b981' }

export default function Map() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('reports')
        .select('id, title, problem_type, urgency, lat, lng, address, created_at, status')
        .not('lat', 'is', null)
        .order('created_at', { ascending: false })
        .limit(200)
      setReports(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all' ? reports : reports.filter(r => r.problem_type === filter)

  return (
    <div className="map-page">
      <div className="map-header">
        <div className="container">
          <h2>Harta sesizărilor</h2>
          <div className="filter-row">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              Toate ({reports.length})
            </button>
            {Object.entries(AUTHORITY_MAP).slice(0, 5).map(([key, val]) => (
              <button
                key={key}
                className={`filter-btn ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {val.icon} {val.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="map-loading">Se încarcă harta...</div>
      ) : reports.filter(r => r.lat).length === 0 ? (
        <div className="map-empty">
          <div className="container">
            <div className="empty-state card">
              <div style={{fontSize:'48px'}}>🗺️</div>
              <h3>Nicio sesizare cu locație GPS încă</h3>
              <p>Sesizările fără coordonate GPS nu apar pe hartă. Adaugă locația la următoarea raportare.</p>
              <Link to="/raporteaza" className="btn btn-primary">Raportează acum</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="map-container">
          <MapContainer center={[44.4268, 26.1025]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            />
            {filtered.filter(r => r.lat && r.lng).map(r => (
              <CircleMarker
                key={r.id}
                center={[r.lat, r.lng]}
                radius={8}
                pathOptions={{
                  color: URGENCY_COLORS[r.urgency] || '#64748b',
                  fillColor: URGENCY_COLORS[r.urgency] || '#64748b',
                  fillOpacity: 0.8,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="popup">
                    <div className="popup-icon">{AUTHORITY_MAP[r.problem_type]?.icon}</div>
                    <div className="popup-title">{r.title || r.problem_type}</div>
                    {r.address && <div className="popup-addr">📍 {r.address}</div>}
                    <div className={`popup-status status-${r.status}`}>{r.status}</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Legend */}
      <div className="map-legend">
        {Object.entries(URGENCY_COLORS).map(([label, color]) => (
          <div key={label} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            <span>Urgență {label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

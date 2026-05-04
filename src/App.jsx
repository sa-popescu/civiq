import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import Map from './pages/Map'
import Success from './pages/Success'
import Header from './components/Header'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/raporteaza" element={<Report />} />
            <Route path="/harta" element={<Map />} />
            <Route path="/succes/:id" element={<Success />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

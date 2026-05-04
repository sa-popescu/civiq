# ◈ CiviQ — Platformă Civică Urbană

Raportează probleme urbane în câteva secunde. CiviQ clasifică automat sesizarea și o direcționează către autoritatea competentă — fără birocrație.

## Stack

- **Frontend**: React + Vite (PWA instalabilă)
- **Hosting**: Vercel / Netlify (gratuit)
- **Backend / DB**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI**: Claude API (Haiku) — clasificare automată + generare text sesizare
- **Hartă**: Leaflet.js + OpenStreetMap

## Setup local

### 1. Clonează repo-ul

```bash
git clone https://github.com/sa-popescu/civiq.git
cd civiq
npm install
```

### 2. Configurează Supabase

1. Creează un proiect nou pe [supabase.com](https://supabase.com)
2. Mergi în **SQL Editor** și rulează conținutul fișierului `supabase-schema.sql`
3. Copiază **Project URL** și **anon public key** din Settings > API

### 3. Configurează variabilele de mediu

```bash
cp .env.example .env.local
```

Editează `.env.local` cu valorile tale:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Pornește aplicația

```bash
npm run dev
```

Deschide [http://localhost:5173](http://localhost:5173)

## Deploy pe Vercel

1. Importă repo-ul pe [vercel.com](https://vercel.com)
2. Adaugă variabilele din `.env.local` în **Settings > Environment Variables**
3. Deploy automat la fiecare push pe `main`

## Structura proiectului

```
src/
├── components/
│   ├── Header.jsx       # Navigare desktop + mobile bottom nav
│   └── Header.css
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── Report.jsx       # Flux raportare în 4 pași (AI-powered)
│   ├── Map.jsx          # Hartă interactivă sesizări
│   └── Success.jsx      # Confirmare după trimitere
├── lib/
│   ├── supabase.js      # Client Supabase + mapare autorități
│   └── classify.js      # Integrare Claude API
└── index.css            # Design system global
supabase-schema.sql      # Schema bază de date
```

## Roadmap

- [x] MVP: raportare + clasificare AI + stocare
- [ ] Hartă cu sesizări GPS
- [ ] Autentificare opțională + dashboard personal
- [ ] Trimitere automată email către autorități
- [ ] Generare PDF sesizare formală
- [ ] Panel admin moderare
- [ ] Statistici publice

## Licență

MIT — contribuțiile sunt binevenite.

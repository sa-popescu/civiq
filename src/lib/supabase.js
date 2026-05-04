import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Mapare tipuri sesizare → autoritate competentă ───────────────────────────
export const AUTHORITY_MAP = {
  carosabil: {
    label: 'Carosabil deteriorat / gropi',
    icon: '🕳️',
    authority: (sector) => sector
      ? { name: `Primăria Sectorului ${sector}`, email: `sesizari@sector${sector}.ro` }
      : { name: 'PMB — Direcția Drumuri', email: 'drumuri@pmb.ro' },
    fields: ['adresa', 'sector', 'dimensiune', 'pericol_imediat'],
    tip: 'Pentru artere principale (Magheru, Victoriei, etc.) autoritatea este PMB.'
  },
  indicatoare: {
    label: 'Indicatoare deteriorate / lipsă',
    icon: '🚧',
    authority: () => ({ name: 'Poliția Rutieră București', email: 'sesizari@politiarutiera-b.ro' }),
    fields: ['adresa', 'tip_indicator', 'descriere'],
    tip: 'Indicatoarele rutiere sunt în responsabilitatea Poliției Rutiere.'
  },
  marcaje: {
    label: 'Marcaje rutiere lipsă / degradate',
    icon: '🛣️',
    authority: (sector) => sector
      ? { name: `Primăria Sectorului ${sector}`, email: `sesizari@sector${sector}.ro` }
      : { name: 'PMB — Direcția Drumuri', email: 'drumuri@pmb.ro' },
    fields: ['adresa', 'sector', 'tip_marcaj', 'lungime_aproximativa'],
    tip: null
  },
  spatii_verzi: {
    label: 'Spații verzi deteriorate',
    icon: '🌳',
    authority: (sector) => ({ name: `Primăria Sectorului ${sector || '?'}`, email: `spatiiverzi@sector${sector || 'x'}.ro` }),
    fields: ['adresa', 'sector', 'tip_problema', 'suprafata_aproximativa'],
    tip: 'Spațiile verzi sunt administrate exclusiv de primăriile de sector.'
  },
  iluminat: {
    label: 'Iluminat stradal defect',
    icon: '💡',
    authority: () => ({ name: 'PMB — ELEC Distribuție', email: 'avarii@elec-distributie.ro' }),
    fields: ['adresa', 'numar_stalpi', 'descriere'],
    tip: null
  },
  transport: {
    label: 'Probleme transport în comun',
    icon: '🚌',
    authority: () => ({ name: 'STB SA', email: 'sesizari@stb.ro' }),
    fields: ['adresa', 'linie_transport', 'tip_problema'],
    tip: 'Include stații deteriorate, panouri defecte, probleme cu vehiculele.'
  },
  salubritate: {
    label: 'Salubritate / deșeuri ilegale',
    icon: '🗑️',
    authority: (sector) => ({ name: `Primăria Sectorului ${sector || '?'}`, email: `salubritate@sector${sector || 'x'}.ro` }),
    fields: ['adresa', 'sector', 'tip_deseuri', 'cantitate_aproximativa'],
    tip: null
  },
  avarie_termica: {
    label: 'Avariere termică / apă caldă',
    icon: '♨️',
    authority: () => ({ name: 'Termoenergetica SA', email: 'avarii@termoenergetica.ro' }),
    fields: ['adresa', 'tip_avarie', 'nr_imobil_afectat'],
    tip: 'Include spargeri de conducte, gropi după lucrări termice.'
  },
  altele: {
    label: 'Altă problemă',
    icon: '📌',
    authority: () => ({ name: 'PMB — Direcția Generală', email: 'sesizari@pmb.ro' }),
    fields: ['adresa', 'descriere'],
    tip: null
  }
}

export const PROBLEM_TYPES = Object.entries(AUTHORITY_MAP).map(([key, val]) => ({
  key,
  label: val.label,
  icon: val.icon
}))

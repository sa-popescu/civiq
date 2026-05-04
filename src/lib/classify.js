import { AUTHORITY_MAP } from '../lib/supabase'

/**
 * Trimite descrierea utilizatorului către Claude API
 * și primește: tipul problemei, sectorul, câmpurile necesare, textul sesizării
 */
export async function classifyReport(userDescription) {
  const systemPrompt = `Ești asistentul platformei CiviQ, o aplicație civică pentru raportarea problemelor urbane din România.

Analizează descrierea problemei și răspunde STRICT în JSON cu structura de mai jos, fără text adițional:

{
  "type": "<una din: carosabil | indicatoare | marcaje | spatii_verzi | iluminat | transport | salubritate | avarie_termica | altele>",
  "sector": <număr 1-6 sau null dacă nu se poate determina>,
  "adresa_extrasa": "<adresa extrasă din descriere sau null>",
  "titlu": "<titlu scurt al sesizării, max 60 caractere>",
  "sesizare_formala": "<text formal complet al sesizării, 3-5 propoziții, la persoana I, gata de trimis autorității>",
  "urgenta": "<scăzută | medie | ridicată>",
  "explicatie": "<1 propoziție despre de ce ai ales acest tip>"
}

Tipuri de probleme disponibile: carosabil (gropi, denivelări), indicatoare (rutiere lipsă/deteriorate), marcaje (rutiere), spatii_verzi (parcuri, copaci, gazon), iluminat (stâlpi, becuri), transport (STB, stații), salubritate (gunoi ilegal, containere), avarie_termica (RADET, Termoenergetica), altele.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userDescription }]
    })
  })

  const data = await response.json()
  const text = data.content?.[0]?.text || '{}'

  try {
    const parsed = JSON.parse(text)
    const authorityFn = AUTHORITY_MAP[parsed.type]?.authority
    const authority = authorityFn ? authorityFn(parsed.sector) : null
    return { ...parsed, authority, error: null }
  } catch {
    return { error: 'Nu am putut analiza descrierea. Încearcă din nou.' }
  }
}

/**
 * nlp.js
 * ──────────────────────────────────────────────────────────────
 * Motor NLP ligero, 100% client-side.
 *
 * Estrategia de detección (en orden):
 *  1. Normaliza el texto (minúsculas, sin acentos, sin puntuación)
 *  2. Busca keywords de cada intent en el mensaje
 *  3. Calcula un score basado en coincidencias + prioridad
 *  4. Devuelve el intent ganador o 'errores' como fallback
 * ──────────────────────────────────────────────────────────────
 */

import { INTENTS } from './knowledge.js';

/** Elimina acentos y pasa a minúsculas */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detecta la/s intención/es en un mensaje.
 *
 * @param {string} message   Texto del usuario
 * @returns {{ primary: string, all: string[], scores: Object }}
 */
export function detectIntent(message) {
  const norm = normalize(message);
  const words = norm.split(' ');
  const scores = {};

  for (const intent of INTENTS) {
    if (intent.id === 'errores') continue; // fallback manual
    let score = 0;

    for (const kw of intent.keywords) {
      const kwNorm = normalize(kw);
      // Coincidencia de frase completa vale más que palabra suelta
      if (norm.includes(kwNorm)) {
        score += kwNorm.includes(' ') ? 3 : 1;
      }
    }

    if (score > 0) {
      // Amplificamos con la prioridad del intent
      scores[intent.id] = score * (1 + intent.priority * 0.1);
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0]?.[0] ?? 'errores';
  const all     = sorted.map(([id]) => id);

  return { primary, all, scores };
}

/**
 * Chips de sugerencia para el intent dado.
 */
export function getSuggestions(intentId) {
  const intent = INTENTS.find(i => i.id === intentId);
  return intent?.chips ?? [];
}

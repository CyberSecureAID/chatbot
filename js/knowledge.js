/**
 * knowledge.js
 * ──────────────────────────────────────────────────────────────
 * Carga los archivos .txt de data/ y construye el índice de
 * intenciones en memoria.  100% client-side, sin backend.
 *
 * CÓMO AÑADIR CONTENIDO
 *  1. Crea una carpeta en data/  (ej: data/precios)
 *  2. Añade la intención a INTENTS (más abajo)
 *  3. Coloca archivos .txt en esa carpeta con las respuestas
 * ──────────────────────────────────────────────────────────────
 */

/**
 * MAPA DE INTENCIONES
 * ─────────────────────────────────────────────────────────────
 * Cada entrada define:
 *   folder   → subcarpeta dentro de data/
 *   files    → lista de archivos .txt con respuestas
 *   keywords → palabras/frases que activan esta intención
 *   priority → mayor número = mayor prioridad al resolver conflictos
 *   chips    → sugerencias visibles para el usuario (opcionales)
 *
 * Orden de keywords: van de más específicas a más generales.
 * ─────────────────────────────────────────────────────────────
 */
export const INTENTS = [
  {
    id: 'saludos',
    folder: 'data/saludos',
    files: ['respuestas.txt'],
    keywords: ['hola','buenos días','buenas tardes','buenas noches','hey','saludos','qué tal','cómo estás','ey','hi','hello'],
    priority: 1,
    chips: ['¿Qué puedes hacer?','¿Tienen soporte?','Horarios']
  },
  {
    id: 'despedidas',
    folder: 'data/despedidas',
    files: ['respuestas.txt'],
    keywords: ['adiós','hasta luego','chao','nos vemos','hasta pronto','bye','hasta mañana','chau'],
    priority: 2,
    chips: ['Volver al inicio']
  },
  {
    id: 'agradecimientos',
    folder: 'data/agradecimientos',
    files: ['respuestas.txt'],
    keywords: ['gracias','muchas gracias','te agradezco','mil gracias','thank you','genial gracias','perfecto gracias'],
    priority: 2,
    chips: ['¿Algo más?','Contactar soporte']
  },
  {
    id: 'faq',
    folder: 'data/faq',
    files: ['generales.txt','pagos.txt'],
    keywords: ['pregunta frecuente','duda','consulta','cómo funciona','qué es','para qué sirve','cómo puedo','me puedes decir'],
    priority: 3,
    chips: ['Ver precios','Soporte técnico','Contacto']
  },
  {
    id: 'soporte',
    folder: 'data/soporte',
    files: ['tecnico.txt','comunes.txt'],
    keywords: ['error','problema','no funciona','falla','bug','issue','ayuda técnica','soporte','no puedo','se cayó','crash','lento','tarda'],
    priority: 5,
    chips: ['Reportar error','Ver FAQ','Contactar']
  },
  {
    id: 'productos',
    folder: 'data/productos',
    files: ['catalogo.txt'],
    keywords: ['producto','artículo','item','catálogo','qué venden','qué ofrecen','tienes','tienen','disponible','inventario','precio de'],
    priority: 3,
    chips: ['Ver servicios','Solicitar cotización']
  },
  {
    id: 'servicios',
    folder: 'data/servicios',
    files: ['lista.txt'],
    keywords: ['servicio','servicios','qué hacen','en qué ayudan','soluciones','planes','plan','suscripción','contratar','adquirir'],
    priority: 3,
    chips: ['Ver productos','¿Cuánto cuesta?']
  },
  {
    id: 'empresa',
    folder: 'data/empresa',
    files: ['info.txt'],
    keywords: ['empresa','compañía','quiénes son','sobre ustedes','acerca de','historia','misión','visión','quién eres','qué empresa es'],
    priority: 2,
    chips: ['Horarios','Contacto']
  },
  {
    id: 'horarios',
    folder: 'data/horarios',
    files: ['atencion.txt'],
    keywords: ['horario','horarios','hora','abren','cierran','atención','cuándo','abierto','cerrado','disponibilidad','días','lunes','viernes'],
    priority: 3,
    chips: ['Contacto','Ver servicios']
  },
  {
    id: 'contacto',
    folder: 'data/contacto',
    files: ['canales.txt'],
    keywords: ['contacto','contactar','hablar','email','correo','teléfono','whatsapp','llamar','escribir','dirección','ubicación','dónde están'],
    priority: 3,
    chips: ['Horarios','Soporte técnico']
  },
  {
    id: 'errores',
    folder: 'data/errores',
    files: ['mensajes.txt'],
    keywords: [],          // activada internamente cuando no hay match
    priority: 0,
    chips: ['Saludos','FAQ','Contacto']
  }
];

/**
 * BASE_URL — ajusta si tu repo tiene subcarpeta en GitHub Pages
 * Ej: si tu URL es  usuario.github.io/mi-chatbot/
 *     pon: '/mi-chatbot'
 */
const BASE_URL = '';

// ─── Cache en memoria ───────────────────────────────────────
const _cache = {};

/**
 * Carga un archivo .txt y devuelve sus líneas no vacías.
 * Las líneas que empiezan con # son comentarios y se ignoran.
 */
async function fetchLines(path) {
  if (_cache[path]) return _cache[path];
  try {
    const res = await fetch(`${BASE_URL}/${path}`);
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'));
    _cache[path] = lines;
    return lines;
  } catch {
    return [];
  }
}

/**
 * Precarga todas las carpetas definidas en INTENTS.
 * Llama esto al inicializar el widget.
 */
export async function preloadKnowledge() {
  const promises = INTENTS.flatMap(intent =>
    intent.files.map(file => fetchLines(`${intent.folder}/${file}`))
  );
  await Promise.allSettled(promises);
}

/**
 * Devuelve todas las respuestas disponibles para un intent.
 */
export async function getResponses(intentId) {
  const intent = INTENTS.find(i => i.id === intentId);
  if (!intent) return [];
  const arrays = await Promise.all(
    intent.files.map(file => fetchLines(`${intent.folder}/${file}`))
  );
  return arrays.flat();
}

/**
 * Elige una respuesta aleatoria de un intent.
 * Si no hay respuestas, devuelve null.
 */
export async function pickResponse(intentId) {
  const responses = await getResponses(intentId);
  if (!responses.length) return null;
  return responses[Math.floor(Math.random() * responses.length)];
}

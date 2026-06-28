/**
 * main.js v5
 * ──────────────────────────────────────────────────────────────
 * Punto de entrada del chatbot.
 * Conecta: ChatWidget  ←→  NLP  ←→  KnowledgeBase
 * ──────────────────────────────────────────────────────────────
 */

import { ChatWidget }                     from './widget.js';
import { detectIntent, getSuggestions }   from './nlp.js';
import { pickResponse, preloadKnowledge } from './knowledge.js';

/* ══════════════════════════════════════════
   CONFIGURACIÓN
══════════════════════════════════════════ */
const CONFIG = {
  botName: 'Asistente Virtual',
  powered: true,

  /** Mensajes de bienvenida por idioma */
  welcome: {
    es: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
    en: 'Hi! 👋 I\'m your virtual assistant. How can I help you today?',
  },

  /** Chips iniciales */
  welcomeChips: [],

  /** Delay simulado de "escritura" en ms */
  typingDelay: 900,

  /** Abrir el chat automáticamente al cargar */
  autoOpen: false,
  autoOpenDelay: 3,
};

/* ══════════════════════════════════════════
   INICIALIZACIÓN
══════════════════════════════════════════ */
const root = document.getElementById('chatbot-root');
if (!root) { console.warn('[ChatBot] No se encontró #chatbot-root'); }

const widget = new ChatWidget(root, {
  botName: CONFIG.botName,
  powered: CONFIG.powered,
  onSend:  handleUserMessage,
});

/* Precarga del knowledge base */
preloadKnowledge();

/* Mensaje de bienvenida en el idioma activo */
let welcomed = false;
const originalToggle = widget.toggle.bind(widget);
widget.toggle = function () {
  originalToggle();
  if (widget.isOpen && !welcomed) {
    welcomed = true;
    const msg = CONFIG.welcome[widget.lang] ?? CONFIG.welcome.es;
    widget.addMessage('bot', msg);
    if (CONFIG.welcomeChips.length) {
      widget.setChips(CONFIG.welcomeChips);
    }
  }
};

/* Auto-open opcional */
if (CONFIG.autoOpen) {
  setTimeout(() => widget.open(), CONFIG.autoOpenDelay * 1000);
}

/* ══════════════════════════════════════════
   LÓGICA PRINCIPAL
══════════════════════════════════════════ */
async function handleUserMessage(text) {
  const { primary, all } = detectIntent(text);
  widget.showTyping();

  let response = await pickResponse(primary);

  if (!response) {
    for (const intentId of all.slice(1)) {
      response = await pickResponse(intentId);
      if (response) break;
    }
  }

  if (!response) response = await pickResponse('errores');

  if (!response) {
    response = widget.lang === 'en'
      ? 'I couldn\'t find information about that. You can write to us at contact@company.com'
      : 'No encontré información sobre eso. Puedes escribirnos a contacto@empresa.com';
  }

  await delay(CONFIG.typingDelay);
  widget.hideTyping();
  widget.addMessage('bot', response);

  const chips = getSuggestions(primary);
  if (chips.length) widget.setChips(chips);
}

const delay = ms => new Promise(r => setTimeout(r, ms));

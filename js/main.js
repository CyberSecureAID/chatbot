/**
 * main.js
 * ──────────────────────────────────────────────────────────────
 * Punto de entrada del chatbot.
 * Conecta: ChatWidget  ←→  NLP  ←→  KnowledgeBase
 *
 * CONFIGURACIÓN RÁPIDA
 *  Edita el objeto CONFIG de abajo para personalizar el bot
 *  sin tocar el resto del código.
 * ──────────────────────────────────────────────────────────────
 */

import { ChatWidget }                   from './widget.js';
import { detectIntent, getSuggestions } from './nlp.js';
import { pickResponse, preloadKnowledge } from './knowledge.js';

/* ══════════════════════════════════════════
   CONFIGURACIÓN
══════════════════════════════════════════ */
const CONFIG = {
  botName:       'Asistente Virtual',
  tagline:       'En línea · respuesta inmediata',
  powered:       true,

  /** Mensaje de bienvenida al abrir el chat por primera vez */
  welcome: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',

  /** Chips iniciales */
  welcomeChips: ['Saludos', 'FAQ', 'Soporte', 'Contacto', 'Horarios'],

  /** Delay simulado de "escritura" en ms */
  typingDelay: 900,

  /** Abrir el chat automáticamente al cargar (true/false) */
  autoOpen: false,

  /** Segundos de espera antes de abrir auto (si autoOpen=true) */
  autoOpenDelay: 3,
};

/* ══════════════════════════════════════════
   INICIALIZACIÓN
══════════════════════════════════════════ */
const root = document.getElementById('chatbot-root');
if (!root) { console.warn('[ChatBot] No se encontró #chatbot-root'); }

const widget = new ChatWidget(root, {
  botName:  CONFIG.botName,
  tagline:  CONFIG.tagline,
  powered:  CONFIG.powered,
  onSend:   handleUserMessage,
});

/* Precarga del knowledge base en segundo plano */
preloadKnowledge();

/* Mensaje de bienvenida (primera apertura) */
let welcomed = false;
const originalToggle = widget.toggle.bind(widget);
widget.toggle = function () {
  originalToggle();
  if (widget.isOpen && !welcomed) {
    welcomed = true;
    widget.addMessage('bot', CONFIG.welcome);
    widget.setChips(CONFIG.welcomeChips);
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
  /* 1. Detectar intención */
  const { primary, all } = detectIntent(text);

  /* 2. Indicador de escritura */
  widget.showTyping();

  /* 3. Obtener respuesta */
  let response = await pickResponse(primary);

  /* 4. Fallback: si no hay respuesta en el intent principal, prueba los siguientes */
  if (!response) {
    for (const intentId of all.slice(1)) {
      response = await pickResponse(intentId);
      if (response) break;
    }
  }

  /* 5. Último fallback: intent 'errores' */
  if (!response) {
    response = await pickResponse('errores');
  }

  /* 6. Último recurso absoluto */
  if (!response) {
    response = 'Lo siento, no encontré una respuesta para eso. ¿Puedes reformular tu pregunta?';
  }

  /* 7. Mostrar con delay realista */
  await delay(CONFIG.typingDelay);
  widget.hideTyping();
  widget.addMessage('bot', response);

  /* 8. Chips de sugerencia */
  const chips = getSuggestions(primary);
  if (chips.length) widget.setChips(chips);
}

const delay = ms => new Promise(r => setTimeout(r, ms));

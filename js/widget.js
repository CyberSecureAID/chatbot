/**
 * widget.js v5
 * UI del chatbot — sin lógica de negocio.
 * Agrega: panel de ajustes con toggle tema y selector de idioma.
 */

const SVG_BOT = `<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="7" width="16" height="11" rx="3" fill="currentColor"/><path d="M7 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="7.5" cy="12.5" r="1.2" fill="white"/><circle cx="12.5" cy="12.5" r="1.2" fill="white"/><path d="M8 15.5h4" stroke="white" stroke-width="1.2" stroke-linecap="round"/></svg>`;
const SVG_USER = `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="7" r="3.5"/><path d="M3 18c0-3.5 3.1-6 7-6s7 2.5 7 6"/></svg>`;
const SVG_CHAT = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>`;
const SVG_CLOSE = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const SVG_SEND = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none"/></svg>`;
const SVG_SETTINGS = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.69.07-1.08s-.03-.73-.07-1.08l2.33-1.82a.56.56 0 0 0 .13-.71l-2.21-3.82a.55.55 0 0 0-.68-.24l-2.74 1.1c-.57-.44-1.18-.81-1.86-1.09l-.42-2.92A.54.54 0 0 0 14 2h-4a.54.54 0 0 0-.54.46L9.04 5.38C8.36 5.66 7.75 6.03 7.18 6.47L4.44 5.37a.54.54 0 0 0-.68.24L1.55 9.43c-.14.24-.07.54.13.71l2.33 1.82C3.97 12.3 3.94 12.65 3.94 13s.03.7.07 1.05l-2.33 1.82a.54.54 0 0 0-.13.71l2.21 3.82c.14.25.44.34.68.24l2.74-1.1c.57.44 1.18.81 1.86 1.09l.42 2.92c.06.27.29.45.54.45h4c.25 0 .48-.18.54-.46l.42-2.92c.68-.28 1.29-.65 1.86-1.09l2.74 1.1c.24.1.54.01.68-.24l2.21-3.82a.54.54 0 0 0-.13-.71l-2.33-1.82z"/></svg>`;
const SVG_ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`;
const SVG_SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

/** Textos por idioma */
const I18N = {
  es: {
    status:       'En línea · respuesta inmediata',
    placeholder:  'Escribe un mensaje…',
    powered:      'Powered by ChatBot Engine',
    settings:     'Ajustes',
    themeLabel:   'Modo claro',
    themeDesc:    'Cambia entre modo oscuro y claro',
    langLabel:    'Idioma',
    langDesc:     'Selecciona el idioma del chat',
    ariaOpen:     'Abrir chat',
    ariaClose:    'Cerrar chat',
    ariaSettings: 'Ajustes',
    ariaBack:     'Volver al chat',
    ariaSend:     'Enviar mensaje',
    ariaInput:    'Escribe tu mensaje',
    ariaMsgs:     'Mensajes',
    ariaChips:    'Sugerencias rápidas',
  },
  en: {
    status:       'Online · instant reply',
    placeholder:  'Type a message…',
    powered:      'Powered by ChatBot Engine',
    settings:     'Settings',
    themeLabel:   'Light mode',
    themeDesc:    'Switch between dark and light mode',
    langLabel:    'Language',
    langDesc:     'Select the chat language',
    ariaOpen:     'Open chat',
    ariaClose:    'Close chat',
    ariaSettings: 'Settings',
    ariaBack:     'Back to chat',
    ariaSend:     'Send message',
    ariaInput:    'Type your message',
    ariaMsgs:     'Messages',
    ariaChips:    'Quick suggestions',
  }
};

function hhmm() {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function esc(t) {
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

export class ChatWidget {
  constructor(root, opts = {}) {
    this.root    = root;
    this.isOpen  = false;
    this.onSend  = opts.onSend  ?? (() => {});
    this.name    = opts.botName ?? 'Asistente Virtual';
    this.powered = opts.powered ?? true;

    /* Estado persistente */
    this._lang  = localStorage.getItem('cb-lang')  ?? 'es';
    this._theme = localStorage.getItem('cb-theme') ?? 'dark'; // dark por defecto

    this._applyTheme();
    this._build();
    this._bind();
  }

  /* ── Helpers de estado ── */
  get _t() { return I18N[this._lang] ?? I18N.es; }

  _applyTheme() {
    if (this._theme === 'light') {
      this.root.setAttribute('data-cb-theme', 'light');
    } else {
      this.root.removeAttribute('data-cb-theme');
    }
  }

  /* ── Construcción del DOM ── */
  _build() {
    const t = this._t;
    this.root.innerHTML = `
      <button id="cb-toggle" aria-label="${t.ariaOpen}" aria-expanded="false">
        <span class="cb-icon-chat">${SVG_CHAT}</span>
        <span class="cb-icon-close">${SVG_CLOSE}</span>
        <span id="cb-badge" aria-hidden="true"></span>
      </button>

      <div id="cb-panel" role="dialog" aria-modal="true" aria-label="Chat con ${esc(this.name)}">

        <!-- ─── Header principal ─── -->
        <div id="cb-header">
          <div class="cb-hdr-avatar">${SVG_BOT}</div>
          <div class="cb-hdr-info">
            <div class="cb-hdr-name">${esc(this.name)}</div>
            <div class="cb-hdr-status" id="cb-hdr-status">
              <span class="cb-dot-live" aria-hidden="true"></span>
              <span>${esc(t.status)}</span>
            </div>
          </div>
          <button class="cb-hdr-btn settings-btn" id="cb-settings-btn" aria-label="${t.ariaSettings}">
            ${SVG_SETTINGS}
          </button>
          <button class="cb-hdr-btn" id="cb-close" aria-label="${t.ariaClose}">
            ${SVG_CLOSE}
          </button>
        </div>

        <!-- ─── Panel de Ajustes (overlay) ─── -->
        <div id="cb-settings-panel" role="dialog" aria-modal="true" aria-label="${t.settings}">
          <div class="cb-settings-header">
            <button class="cb-hdr-btn" id="cb-settings-back" aria-label="${t.ariaBack}" style="background:rgba(255,255,255,.18);">
              ${SVG_ARROW}
            </button>
            <span id="cb-settings-title">${t.settings}</span>
          </div>
          <div class="cb-settings-body">

            <!-- Tema -->
            <div class="cb-setting-row">
              <div class="cb-setting-label">
                <strong id="cb-theme-label">${t.themeLabel}</strong>
                <span id="cb-theme-desc">${t.themeDesc}</span>
              </div>
              <label class="cb-switch" aria-label="${t.themeLabel}">
                <input type="checkbox" id="cb-theme-toggle" ${this._theme === 'light' ? 'checked' : ''}>
                <span class="cb-switch-track"></span>
              </label>
            </div>

            <!-- Idioma -->
            <div class="cb-setting-row">
              <div class="cb-setting-label">
                <strong id="cb-lang-label">${t.langLabel}</strong>
                <span id="cb-lang-desc">${t.langDesc}</span>
              </div>
              <div class="cb-lang-selector" role="group" aria-label="${t.langLabel}">
                <button class="cb-lang-btn ${this._lang === 'es' ? 'active' : ''}" data-lang="es">ES</button>
                <button class="cb-lang-btn ${this._lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
              </div>
            </div>

          </div>
        </div>

        <!-- ─── Mensajes ─── -->
        <div id="cb-messages" role="log" aria-live="polite" aria-label="${t.ariaMsgs}"></div>

        <!-- ─── Chips ─── -->
        <div id="cb-chips" role="group" aria-label="${t.ariaChips}"></div>

        <!-- ─── Input ─── -->
        <div id="cb-bar">
          <textarea
            id="cb-input"
            rows="1"
            placeholder="${t.placeholder}"
            aria-label="${t.ariaInput}"
            autocomplete="off"
            autocorrect="off"
            spellcheck="true"
          ></textarea>
          <button id="cb-send" aria-label="${t.ariaSend}">${SVG_SEND}</button>
        </div>

        ${this.powered ? `<div id="cb-foot" aria-hidden="true" id="cb-powered">${t.powered}</div>` : ''}
      </div>
    `;

    this.$toggle   = this.root.querySelector('#cb-toggle');
    this.$panel    = this.root.querySelector('#cb-panel');
    this.$msgs     = this.root.querySelector('#cb-messages');
    this.$chips    = this.root.querySelector('#cb-chips');
    this.$input    = this.root.querySelector('#cb-input');
    this.$send     = this.root.querySelector('#cb-send');
    this.$badge    = this.root.querySelector('#cb-badge');
    this.$settings = this.root.querySelector('#cb-settings-panel');
  }

  _bind() {
    /* Toggle principal */
    this.$toggle.addEventListener('click', () => this.toggle());
    this.root.querySelector('#cb-close').addEventListener('click', () => this.close());

    /* Envío */
    this.$send.addEventListener('click', () => this._submit());
    this.$input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._submit(); }
    });
    this.$input.addEventListener('input', () => {
      this.$input.style.height = 'auto';
      this.$input.style.height = Math.min(this.$input.scrollHeight, 96) + 'px';
    });

    /* Ajustes: abrir / cerrar */
    this.root.querySelector('#cb-settings-btn').addEventListener('click', () => {
      this.$settings.classList.add('open');
    });
    this.root.querySelector('#cb-settings-back').addEventListener('click', () => {
      this.$settings.classList.remove('open');
    });

    /* Toggle de tema */
    this.root.querySelector('#cb-theme-toggle').addEventListener('change', e => {
      this._theme = e.target.checked ? 'light' : 'dark';
      localStorage.setItem('cb-theme', this._theme);
      this._applyTheme();
    });

    /* Selector de idioma */
    this.root.querySelectorAll('.cb-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this._lang = btn.dataset.lang;
        localStorage.setItem('cb-lang', this._lang);
        this._updateI18n();
        /* Marcar activo */
        this.root.querySelectorAll('.cb-lang-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });
  }

  /* Actualiza textos de UI cuando cambia el idioma */
  _updateI18n() {
    const t = this._t;
    const q = id => this.root.querySelector(`#${id}`);
    q('cb-toggle').setAttribute('aria-label', t.ariaOpen);
    q('cb-close').setAttribute('aria-label', t.ariaClose);
    q('cb-settings-btn').setAttribute('aria-label', t.ariaSettings);
    q('cb-settings-back').setAttribute('aria-label', t.ariaBack);
    q('cb-send').setAttribute('aria-label', t.ariaSend);
    q('cb-input').setAttribute('aria-label', t.ariaInput);
    q('cb-input').placeholder = t.placeholder;
    q('cb-messages').setAttribute('aria-label', t.ariaMsgs);
    q('cb-chips').setAttribute('aria-label', t.ariaChips);
    q('cb-settings-title').textContent = t.settings;
    q('cb-theme-label').textContent = t.themeLabel;
    q('cb-theme-desc').textContent = t.themeDesc;
    q('cb-lang-label').textContent = t.langLabel;
    q('cb-lang-desc').textContent = t.langDesc;
    const statusSpan = q('cb-hdr-status').querySelector('span:last-child');
    if (statusSpan) statusSpan.textContent = t.status;
    const foot = this.root.querySelector('#cb-foot');
    if (foot) foot.textContent = t.powered;
  }

  /* ── API pública ── */
  toggle() {
    this.isOpen = !this.isOpen;
    this.$panel.classList.toggle('open', this.isOpen);
    this.$toggle.classList.toggle('open', this.isOpen);
    this.$toggle.setAttribute('aria-expanded', String(this.isOpen));
    if (this.isOpen) {
      this._clearBadge();
      setTimeout(() => this.$input.focus(), 230);
    }
  }
  open()  { if (!this.isOpen) this.toggle(); }
  close() { if (this.isOpen)  this.toggle(); }

  /** Devuelve el idioma activo: 'es' | 'en' */
  get lang() { return this._lang; }

  _submit() {
    const txt = this.$input.value.trim();
    if (!txt) return;
    this.$input.value = '';
    this.$input.style.height = 'auto';
    this.clearChips();
    this.addMessage('user', txt);
    this.onSend(txt);
  }

  addMessage(role, text) {
    const row = document.createElement('div');
    row.className = `cb-row ${role}`;
    const av = role === 'bot' ? SVG_BOT : SVG_USER;
    const time = hhmm();
    row.innerHTML = `
      <div class="cb-av" aria-hidden="true">${av}</div>
      <div class="cb-col">
        <div class="cb-bubble">${esc(text)}</div>
        <div class="cb-ts" aria-label="enviado a las ${time}">${time}</div>
      </div>`;
    this.$msgs.appendChild(row);
    this._scroll();
    if (!this.isOpen) this._bump();
    return row;
  }

  showTyping() {
    if (this.root.querySelector('#_cbt')) return;
    const row = document.createElement('div');
    row.className = 'cb-row bot cb-typing';
    row.id = '_cbt';
    row.setAttribute('aria-label', 'El asistente está escribiendo');
    row.innerHTML = `
      <div class="cb-av" aria-hidden="true">${SVG_BOT}</div>
      <div class="cb-col">
        <div class="cb-bubble" aria-hidden="true">
          <span class="cb-dot"></span>
          <span class="cb-dot"></span>
          <span class="cb-dot"></span>
        </div>
      </div>`;
    this.$msgs.appendChild(row);
    this._scroll();
  }

  hideTyping() { this.root.querySelector('#_cbt')?.remove(); }

  setChips(list = []) {
    this.$chips.innerHTML = '';
    list.forEach(label => {
      const b = document.createElement('button');
      b.className = 'cb-chip';
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', () => {
        this.$input.value = label;
        this._submit();
      });
      this.$chips.appendChild(b);
    });
  }

  clearChips() { this.$chips.innerHTML = ''; }

  _bump() {
    const n = (parseInt(this.$badge.textContent) || 0) + 1;
    this.$badge.textContent = n;
    this.$badge.classList.add('on');
  }
  _clearBadge() {
    this.$badge.textContent = '';
    this.$badge.classList.remove('on');
  }
  _scroll() {
    requestAnimationFrame(() => { this.$msgs.scrollTop = this.$msgs.scrollHeight; });
  }
}

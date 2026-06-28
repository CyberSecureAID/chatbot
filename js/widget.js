/**
 * widget.js  v2
 * Componente UI del chatbot — corrige burbujas cortadas y mejora diseño.
 */

const ICON_CHAT  = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>`;
const ICON_CLOSE = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const ICON_BOT   = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="8" width="18" height="12" rx="3" fill="currentColor"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="9" cy="14" r="1.3" fill="white"/><circle cx="15" cy="14" r="1.3" fill="white"/><path d="M10 17.5h4" stroke="white" stroke-width="1.3" stroke-linecap="round"/></svg>`;
const ICON_USER  = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
const ICON_SEND  = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;

function now() {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

export class ChatWidget {
  constructor(root, options = {}) {
    this.root    = root;
    this.isOpen  = false;
    this.onSend  = options.onSend  ?? (() => {});
    this.name    = options.botName ?? 'Asistente';
    this.tagline = options.tagline ?? 'En línea · responde al instante';
    this.powered = options.powered ?? true;
    this._build();
    this._bind();
  }

  _build() {
    this.root.innerHTML = `
      <button id="cb-toggle" aria-label="Abrir chat" aria-expanded="false">
        <span class="cb-icon-chat">${ICON_CHAT}</span>
        <span class="cb-icon-close">${ICON_CLOSE}</span>
        <span id="cb-badge" aria-hidden="true"></span>
      </button>

      <div id="cb-panel" role="dialog" aria-label="Chat de soporte" aria-modal="true">
        <div id="cb-header">
          <div class="cb-avatar">${ICON_BOT}</div>
          <div class="cb-header-info">
            <strong>${this.name}</strong>
            <span><span class="cb-status-dot"></span>${this.tagline}</span>
          </div>
        </div>

        <div id="cb-messages" aria-live="polite" aria-atomic="false"></div>

        <div id="cb-suggestions"></div>

        <div id="cb-inputbar">
          <textarea id="cb-input" placeholder="Escribe tu mensaje…" rows="1" aria-label="Mensaje"></textarea>
          <button id="cb-send" aria-label="Enviar">${ICON_SEND}</button>
        </div>

        ${this.powered ? '<div id="cb-footer">Powered by ChatBot Engine</div>' : ''}
      </div>
    `;

    this.$toggle = this.root.querySelector('#cb-toggle');
    this.$panel  = this.root.querySelector('#cb-panel');
    this.$msgs   = this.root.querySelector('#cb-messages');
    this.$input  = this.root.querySelector('#cb-input');
    this.$send   = this.root.querySelector('#cb-send');
    this.$chips  = this.root.querySelector('#cb-suggestions');
    this.$badge  = this.root.querySelector('#cb-badge');
  }

  _bind() {
    this.$toggle.addEventListener('click', () => this.toggle());
    this.$send.addEventListener('click',   () => this._submit());
    this.$input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._submit(); }
    });
    this.$input.addEventListener('input', () => {
      this.$input.style.height = 'auto';
      this.$input.style.height = Math.min(this.$input.scrollHeight, 100) + 'px';
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.$panel.classList.toggle('open', this.isOpen);
    this.$toggle.classList.toggle('open', this.isOpen);
    this.$toggle.setAttribute('aria-expanded', String(this.isOpen));
    if (this.isOpen) {
      this._clearBadge();
      setTimeout(() => this.$input.focus(), 240);
    }
  }

  open()  { if (!this.isOpen) this.toggle(); }
  close() { if (this.isOpen)  this.toggle(); }

  _submit() {
    const text = this.$input.value.trim();
    if (!text) return;
    this.$input.value = '';
    this.$input.style.height = 'auto';
    this.addMessage('user', text);
    this._clearChips();
    this.onSend(text);
  }

  /* ─── Añadir burbuja ───────────────────────────────────────
     CORRECCIÓN: envuelve burbuja + hora en .cb-msg-body con
     min-width:0 para que el texto nunca se parta por letras.
  ─────────────────────────────────────────────────────────── */
  addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `cb-msg ${role}`;

    const avatarSvg = role === 'bot' ? ICON_BOT : ICON_USER;

    div.innerHTML = `
      <div class="cb-msg-avatar">${avatarSvg}</div>
      <div class="cb-msg-body">
        <div class="cb-bubble">${this._escapeHtml(text)}</div>
        <div class="cb-time">${now()}</div>
      </div>`;

    this.$msgs.appendChild(div);
    this._scrollBottom();
    if (!this.isOpen) this._setBadge();
    return div;
  }

  showTyping() {
    const div = document.createElement('div');
    div.className = 'cb-msg bot cb-typing';
    div.id = '_cb-typing';
    div.innerHTML = `
      <div class="cb-msg-avatar">${ICON_BOT}</div>
      <div class="cb-msg-body">
        <div class="cb-bubble">
          <span class="cb-dot"></span>
          <span class="cb-dot"></span>
          <span class="cb-dot"></span>
        </div>
      </div>`;
    this.$msgs.appendChild(div);
    this._scrollBottom();
  }

  hideTyping() { this.root.querySelector('#_cb-typing')?.remove(); }

  setChips(chips = []) {
    this.$chips.innerHTML = '';
    chips.forEach(label => {
      const btn = document.createElement('button');
      btn.className   = 'cb-chip';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        this.$input.value = label;
        this._submit();
      });
      this.$chips.appendChild(btn);
    });
  }

  _clearChips() { this.$chips.innerHTML = ''; }

  _setBadge() {
    const n = (parseInt(this.$badge.textContent) || 0) + 1;
    this.$badge.textContent = n;
    this.$badge.classList.add('visible');
  }
  _clearBadge() {
    this.$badge.textContent = '';
    this.$badge.classList.remove('visible');
  }

  _scrollBottom() {
    requestAnimationFrame(() => { this.$msgs.scrollTop = this.$msgs.scrollHeight; });
  }

  _escapeHtml(text) {
    return text
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/\n/g, '<br>');
  }
}

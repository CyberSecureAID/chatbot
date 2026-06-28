/**
 * widget.js v3 — Layout correcto: bot izquierda, usuario derecha
 */

const SVG_BOT = `<svg viewBox="0 0 20 20"><rect x="2" y="7" width="16" height="11" rx="3"/><path d="M7 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="7.5" cy="12.5" r="1.2" fill="white"/><circle cx="12.5" cy="12.5" r="1.2" fill="white"/><path d="M8 15.5h4" stroke="white" stroke-width="1.2" stroke-linecap="round"/></svg>`;
const SVG_USER = `<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="7" r="3.5"/><path d="M3 18c0-3.5 3.1-6 7-6s7 2.5 7 6"/></svg>`;
const SVG_CHAT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>`;
const SVG_CLOSE = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const SVG_SEND = `<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
const SVG_X = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

function hhmm() {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

export class ChatWidget {
  constructor(root, opts = {}) {
    this.root    = root;
    this.isOpen  = false;
    this.onSend  = opts.onSend  ?? (() => {});
    this.name    = opts.botName ?? 'Asistente Virtual';
    this.status  = opts.tagline ?? 'En línea · respuesta inmediata';
    this.powered = opts.powered ?? true;
    this._build();
    this._bind();
  }

  _build() {
    this.root.innerHTML = `
      <button id="cb-toggle" aria-label="Abrir chat" aria-expanded="false">
        <span class="cb-icon-chat">${SVG_CHAT}</span>
        <span class="cb-icon-close">${SVG_CLOSE}</span>
        <span id="cb-badge"></span>
      </button>

      <div id="cb-panel" role="dialog" aria-modal="true" aria-label="Chat">
        <div id="cb-header">
          <div class="cb-hdr-avatar">${SVG_BOT}</div>
          <div class="cb-hdr-info">
            <div class="cb-hdr-name">${this.name}</div>
            <div class="cb-hdr-status">
              <span class="cb-dot-live"></span>${this.status}
            </div>
          </div>
          <button class="cb-hdr-close" id="cb-close" aria-label="Cerrar">${SVG_X}</button>
        </div>

        <div id="cb-messages" aria-live="polite"></div>
        <div id="cb-chips"></div>

        <div id="cb-bar">
          <textarea id="cb-input" rows="1" placeholder="Escribe un mensaje…" aria-label="Mensaje"></textarea>
          <button id="cb-send" aria-label="Enviar">${SVG_SEND}</button>
        </div>

        ${this.powered ? '<div id="cb-foot">Powered by ChatBot Engine</div>' : ''}
      </div>
    `;

    this.$toggle = this.root.querySelector('#cb-toggle');
    this.$panel  = this.root.querySelector('#cb-panel');
    this.$msgs   = this.root.querySelector('#cb-messages');
    this.$chips  = this.root.querySelector('#cb-chips');
    this.$input  = this.root.querySelector('#cb-input');
    this.$send   = this.root.querySelector('#cb-send');
    this.$badge  = this.root.querySelector('#cb-badge');
  }

  _bind() {
    this.$toggle.addEventListener('click', () => this.toggle());
    this.root.querySelector('#cb-close').addEventListener('click', () => this.close());
    this.$send.addEventListener('click', () => this._submit());
    this.$input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._submit(); }
    });
    this.$input.addEventListener('input', () => {
      this.$input.style.height = 'auto';
      this.$input.style.height = Math.min(this.$input.scrollHeight, 96) + 'px';
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.$panel.classList.toggle('open', this.isOpen);
    this.$toggle.classList.toggle('open', this.isOpen);
    this.$toggle.setAttribute('aria-expanded', String(this.isOpen));
    if (this.isOpen) {
      this._clearBadge();
      setTimeout(() => this.$input.focus(), 220);
    }
  }
  open()  { if (!this.isOpen) this.toggle(); }
  close() { if (this.isOpen)  this.toggle(); }

  _submit() {
    const txt = this.$input.value.trim();
    if (!txt) return;
    this.$input.value = '';
    this.$input.style.height = 'auto';
    this.clearChips();
    this.addMessage('user', txt);
    this.onSend(txt);
  }

  /**
   * Añadir mensaje.
   * role = 'bot' | 'user'
   * Bot   → alineado a la IZQUIERDA (.cb-row.bot)
   * User  → alineado a la DERECHA  (.cb-row.user)
   */
  addMessage(role, text) {
    const row = document.createElement('div');
    row.className = `cb-row ${role}`;

    const avatarSvg = role === 'bot' ? SVG_BOT : SVG_USER;

    row.innerHTML = `
      <div class="cb-av">${avatarSvg}</div>
      <div class="cb-col">
        <div class="cb-bubble">${this._esc(text)}</div>
        <div class="cb-ts">${hhmm()}</div>
      </div>`;

    this.$msgs.appendChild(row);
    this._scroll();
    if (!this.isOpen) this._bump();
    return row;
  }

  showTyping() {
    const row = document.createElement('div');
    row.className = 'cb-row bot cb-typing';
    row.id = '_cbt';
    row.innerHTML = `
      <div class="cb-av">${SVG_BOT}</div>
      <div class="cb-col">
        <div class="cb-bubble">
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
      b.textContent = label;
      b.addEventListener('click', () => { this.$input.value = label; this._submit(); });
      this.$chips.appendChild(b);
    });
  }
  clearChips() { this.$chips.innerHTML = ''; }

  _bump() {
    const n = (parseInt(this.$badge.textContent) || 0) + 1;
    this.$badge.textContent = n;
    this.$badge.classList.add('on');
  }
  _clearBadge() { this.$badge.textContent = ''; this.$badge.classList.remove('on'); }
  _scroll() { requestAnimationFrame(() => { this.$msgs.scrollTop = this.$msgs.scrollHeight; }); }
  _esc(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }
}

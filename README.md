# ChatBot Engine 🤖

Chatbot 100% client-side para GitHub Pages. Sin servidores, sin APIs de pago, sin bases de datos.

---

## Estructura del proyecto

```
chatbot/
├── index.html              ← Página demo / punto de entrada
├── css/
│   └── widget.css          ← Estilos del widget (personalizable via CSS vars)
├── js/
│   ├── main.js             ← Orquestador principal (configuración aquí)
│   ├── widget.js           ← Componente de interfaz
│   ├── nlp.js              ← Motor de detección de intenciones
│   └── knowledge.js        ← Cargador de base de conocimiento + mapa de intenciones
└── data/
    ├── saludos/
    │   └── respuestas.txt
    ├── despedidas/
    │   └── respuestas.txt
    ├── agradecimientos/
    │   └── respuestas.txt
    ├── faq/
    │   ├── generales.txt
    │   └── pagos.txt
    ├── soporte/
    │   ├── tecnico.txt
    │   └── comunes.txt
    ├── productos/
    │   └── catalogo.txt
    ├── servicios/
    │   └── lista.txt
    ├── empresa/
    │   └── info.txt
    ├── horarios/
    │   └── atencion.txt
    ├── contacto/
    │   └── canales.txt
    └── errores/
        └── mensajes.txt    ← Fallback cuando no hay match
```

---

## Instalación en GitHub Pages

1. Sube toda la carpeta al repositorio.
2. En Settings → Pages, selecciona la rama `main` y la carpeta raíz.
3. El chatbot estará disponible en `https://usuario.github.io/repo/`.

### Incrustar en cualquier página

```html
<!-- Estilos -->
<link rel="stylesheet" href="ruta/css/widget.css" />

<!-- Widget -->
<div id="chatbot-root"></div>
<script type="module" src="ruta/js/main.js"></script>
```

Si tu repo tiene subcarpeta en GitHub Pages, edita `BASE_URL` en `js/knowledge.js`:

```js
const BASE_URL = '/nombre-de-tu-repo';
```

---

## Personalización rápida

### Colores y tema — `css/widget.css`

```css
:root {
  --cb-primary:       #2563eb;   /* Color principal */
  --cb-primary-dark:  #1d4ed8;   /* Hover/activo */
  --cb-primary-light: #dbeafe;   /* Fondo chips y avatares */
  --cb-bg:            #ffffff;   /* Fondo del panel */
}
```

### Nombre y mensajes del bot — `js/main.js`

```js
const CONFIG = {
  botName:       'Tu Asistente',
  tagline:       'En línea · respuesta inmediata',
  welcome:       '¡Hola! ¿En qué puedo ayudarte?',
  welcomeChips:  ['Productos', 'Soporte', 'Contacto'],
  typingDelay:   900,   // ms de delay simulado
  autoOpen:      false, // abrir automáticamente
  autoOpenDelay: 3,     // segundos antes de abrir
};
```

---

## Ampliar la base de conocimiento

### Añadir respuestas a una intención existente

Edita el `.txt` correspondiente en `data/`. Cada línea = una respuesta posible:

```
¡Nueva respuesta aleatoria 1!
¡Nueva respuesta aleatoria 2!
```

Las líneas que empiezan con `#` son comentarios ignorados.

### Crear una nueva categoría/intención

1. **Crea la carpeta** `data/nueva-categoria/`
2. **Añade archivos `.txt`** con las respuestas
3. **Registra la intención** en `js/knowledge.js`:

```js
{
  id: 'nueva-categoria',
  folder: 'data/nueva-categoria',
  files: ['respuestas.txt'],
  keywords: ['palabra clave', 'sinónimo', 'frase de ejemplo'],
  priority: 3,          // mayor = más prioridad al resolver conflictos
  chips: ['Sugerencia 1', 'Sugerencia 2']
}
```

### Cargar documentación externa

Para incorporar manuales o documentos largos:
- Divide el contenido en párrafos cortos
- Guarda cada párrafo como línea en un `.txt`
- Crea una intención con keywords relacionadas al tema

---

## Cómo funciona el NLP

1. El texto del usuario se normaliza (minúsculas, sin acentos, sin puntuación)
2. Se compara contra las `keywords` de cada intención
3. Se calcula un score: frases completas valen 3x más que palabras sueltas
4. El score se amplifica por la `priority` del intent
5. El intent con mayor score gana; si hay empate, se usa la prioridad
6. Si no hay match, se activa el intent `errores` (fallback)

---

## Roadmap de extensiones

| Feature | Dónde implementar |
|---|---|
| Múltiples idiomas | Añadir `data/en/`, `data/pt/`; detectar idioma en `nlp.js` |
| Búsqueda semántica | Añadir TF-IDF o embeddings locales en `nlp.js` |
| Historial de conversación | `localStorage` en `widget.js` |
| Modo agente humano | Webhook en `main.js` al detectar escalamiento |
| Temas/colores dinámicos | `CONFIG.theme` en `main.js` que sobreescriba vars CSS |
| Analytics | Event listeners en `widget.js` → `gtag` o `plausible` |

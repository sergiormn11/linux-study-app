/* =====================================================================
   Terminal de Estudio · Linux — Lógica de la aplicación
   ---------------------------------------------------------------------
   Todo el estado (módulos, apuntes, progreso, tema) se guarda en el
   navegador con localStorage. No hay servidor: la app funciona 100%
   abriendo index.html en el navegador.

   Estructura de datos guardada bajo la clave "linuxStudyApp":
   {
     modules: [ { id, num, name, completed } ],
     notes:   [ { id, moduleId, type, title, body, answer,
                  difficulty, tags: [] } ],
     theme:   "dark" | "light",
     activeModuleId: string
   }
   ===================================================================== */

const STORAGE_KEY = 'linuxStudyApp';

/* ---------------------------------------------------------------------
   1 y 2. DATOS DE LA GUÍA
   ---------------------------------------------------------------------
   Los módulos y apuntes viven en data.js (cargado antes que este
   archivo). Ahí es donde se añaden apuntes nuevos. Si por lo que sea
   data.js no se cargara, se usan estos arrays vacíos como respaldo.
   ------------------------------------------------------------------- */
const DEFAULT_MODULES = (typeof window !== 'undefined' && window.STUDY_MODULES) ? window.STUDY_MODULES : [];
const DEFAULT_NOTES   = (typeof window !== 'undefined' && window.STUDY_NOTES)   ? window.STUDY_NOTES   : [];

/* ---------------------------------------------------------------------
   3. ESTADO Y PERSISTENCIA
   ------------------------------------------------------------------- */
let state = null;

/** Carga el estado desde localStorage, o crea uno nuevo con los datos por defecto. */
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const dataVersion = (typeof window !== 'undefined' && window.STUDY_DATA_VERSION) || 1;

  if (raw) {
    try {
      const saved = JSON.parse(raw);

      // ¿Hay una versión más reciente de la guía en data.js?
      // Si es así, incorporamos los apuntes nuevos SIN borrar lo tuyo:
      // se conserva tu progreso (módulos completados) y tus apuntes propios.
      const savedVersion = saved.dataVersion || 0;
      if (dataVersion > savedVersion && window.STUDY_NOTES) {
        return mergeGuideUpdate(saved, dataVersion);
      }
      return saved;
    } catch (e) {
      console.error('Datos corruptos en localStorage, se reinicia:', e);
    }
  }

  // Estado inicial por defecto (primera vez que se abre la app)
  return {
    modules: structuredClone(DEFAULT_MODULES),
    notes: structuredClone(DEFAULT_NOTES),
    theme: 'dark',
    activeModuleId: (DEFAULT_MODULES[0] && DEFAULT_MODULES[0].id) || 'm01',
    dataVersion,
  };
}

/**
 * Fusiona una guía nueva (data.js) con el estado guardado, sin pisar
 * el trabajo del usuario:
 * - Añade módulos nuevos que no existieran.
 * - Conserva el estado "completado" de los módulos que ya tenías.
 * - Añade apuntes de la guía cuyo id no esté ya presente.
 * - Conserva intactos los apuntes que tú hayas creado o editado.
 */
function mergeGuideUpdate(saved, dataVersion) {
  const savedModuleById = new Map((saved.modules || []).map(m => [m.id, m]));
  const mergedModules = window.STUDY_MODULES.map(mod => {
    const prev = savedModuleById.get(mod.id);
    return prev ? { ...mod, completed: prev.completed } : { ...mod };
  });
  // Conserva también módulos personalizados que el usuario tuviera y no estén en la guía
  (saved.modules || []).forEach(m => {
    if (!mergedModules.some(mm => mm.id === m.id)) mergedModules.push(m);
  });

  const savedNoteIds = new Set((saved.notes || []).map(n => n.id));
  const mergedNotes = [...(saved.notes || [])];
  window.STUDY_NOTES.forEach(note => {
    if (!savedNoteIds.has(note.id)) mergedNotes.push(structuredClone(note));
  });

  const merged = {
    modules: mergedModules,
    notes: mergedNotes,
    theme: saved.theme || 'dark',
    activeModuleId: saved.activeModuleId || mergedModules[0]?.id,
    dataVersion,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

/**
 * Restaura la guía completa desde data.js, descartando cambios locales.
 * Se usa desde el botón "Restaurar guía". Pide confirmación.
 */
function restoreGuide() {
  if (!window.STUDY_MODULES || !window.STUDY_NOTES) {
    alert('No se encontró data.js. Asegúrate de que está en la misma carpeta.');
    return;
  }
  if (!confirm('Esto restaurará la guía original y descartará los cambios que hayas hecho (apuntes propios, ediciones y progreso). ¿Continuar?')) {
    return;
  }
  state = {
    modules: structuredClone(window.STUDY_MODULES),
    notes: structuredClone(window.STUDY_NOTES),
    theme: state.theme || 'dark',
    activeModuleId: window.STUDY_MODULES[0]?.id || 'm01',
    dataVersion: (window.STUDY_DATA_VERSION) || 1,
  };
  saveState();
  applyTheme();
  renderModules();
  renderContent();
  showToast('Guía restaurada');
}

/** Guarda el estado completo en localStorage. Se llama tras cada cambio. */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------------------------------------------------------------------
   4. REFERENCIAS AL DOM
   ------------------------------------------------------------------- */
const $ = (sel) => document.querySelector(sel);

const moduleList       = $('#moduleList');
const notesContainer   = $('#notesContainer');
const moduleTitle      = $('#moduleTitle');
const moduleEyebrow    = $('#moduleEyebrow');
const addNoteBtn       = $('#addNoteBtn');
const completedWrap    = $('#completedWrap');
const completedCheck   = $('#completedCheck');
const searchInput      = $('#searchInput');
const difficultyFilter = $('#difficultyFilter');
const progressFill     = $('#progressFill');
const progressLabel    = $('#progressLabel');
const themeToggle      = $('#themeToggle');

// Modal
const noteModal    = $('#noteModal');
const noteForm     = $('#noteForm');
const modalTitle   = $('#modalTitle');
const noteIdField  = $('#noteId');
const noteType     = $('#noteType');
const noteTitle    = $('#noteTitle');
const noteBody     = $('#noteBody');
const noteAnswer   = $('#noteAnswer');
const answerBlock  = $('#answerBlock');
const noteDifficulty = $('#noteDifficulty');
const noteTags     = $('#noteTags');

// Import / export
const exportBtn  = $('#exportBtn');
const importBtn  = $('#importBtn');
const importFile = $('#importFile');

const toast = $('#toast');

/* ---------------------------------------------------------------------
   5. UTILIDADES
   ------------------------------------------------------------------- */

/** Genera un id único simple. */
function makeId() {
  return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Escapa HTML para evitar inyección al renderizar texto del usuario. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Convierte el texto de un apunte en HTML seguro:
 * - Bloques de código delimitados por ``` → <pre class="code-block">.
 * - Tablas Markdown (| col | col |) → <table>.
 * - `código en línea` → <code>. **negrita** → <strong>.
 * - Líneas que empiezan por "- " → lista con viñetas.
 * - El resto → párrafos.
 */
function renderMarkdownLite(text) {
  if (!text) return '';
  const parts = text.split(/```/);        // separa por bloques de código
  let html = '';

  parts.forEach((chunk, i) => {
    if (i % 2 === 1) {
      // Índice impar = interior de un bloque de código
      const lines = escapeHtml(chunk.replace(/^\n/, '').replace(/\n$/, ''))
        .split('\n')
        .map(line => line.replace(/^(\$|#)\s/, '<span class="prompt">$1 </span>'))
        .join('\n');
      html += `<pre class="code-block">${lines}</pre>`;
    } else {
      html += renderTextBlock(chunk);
    }
  });
  return html;
}

/** Da formato en línea: **negrita** y `código`. Recibe texto YA escapado. */
function inlineFormat(safe) {
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/`([^`]+?)`/g, '<code>$1</code>');
  return safe;
}

/** Procesa un bloque de texto normal (fuera de ```), línea a línea,
 *  agrupando tablas y listas. */
function renderTextBlock(chunk) {
  const rawLines = chunk.split('\n');
  let html = '';
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    // ---- Tabla Markdown: línea con | seguida de una fila separadora |---|
    const isTableRow = /^\s*\|.*\|\s*$/.test(line);
    const nextIsSep = i + 1 < rawLines.length && /^\s*\|[\s:|-]+\|\s*$/.test(rawLines[i + 1]);
    if (isTableRow && nextIsSep) {
      const headerCells = splitRow(line);
      i += 2; // saltamos cabecera y separador
      const bodyRows = [];
      while (i < rawLines.length && /^\s*\|.*\|\s*$/.test(rawLines[i])) {
        bodyRows.push(splitRow(rawLines[i]));
        i++;
      }
      html += '<table class="md-table"><thead><tr>' +
        headerCells.map(c => `<th>${inlineFormat(escapeHtml(c))}</th>`).join('') +
        '</tr></thead><tbody>' +
        bodyRows.map(r => '<tr>' + r.map(c => `<td>${inlineFormat(escapeHtml(c))}</td>`).join('') + '</tr>').join('') +
        '</tbody></table>';
      continue;
    }

    // ---- Lista con viñetas: líneas consecutivas que empiezan por "- "
    if (/^\s*-\s+/.test(line)) {
      const items = [];
      while (i < rawLines.length && /^\s*-\s+/.test(rawLines[i])) {
        items.push(rawLines[i].replace(/^\s*-\s+/, ''));
        i++;
      }
      html += '<ul class="md-list">' +
        items.map(it => `<li>${inlineFormat(escapeHtml(it))}</li>`).join('') +
        '</ul>';
      continue;
    }

    // ---- Línea normal → párrafo (si no está vacía)
    if (line.trim() !== '') {
      html += `<p>${inlineFormat(escapeHtml(line))}</p>`;
    }
    i++;
  }
  return html;
}

/** Divide una fila de tabla Markdown en celdas, quitando los | de los extremos. */
function splitRow(row) {
  return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}

/** Muestra un aviso emergente breve. */
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => (toast.hidden = true), 250);
  }, 2200);
}

/** Etiqueta legible para cada tipo de apunte. */
const TYPE_LABELS = {
  teoria: 'Teoría', comando: 'Comando', ejemplo: 'Ejemplo',
  error: 'Error común', tip: 'Tip', pregunta: 'Pregunta', ejercicio: 'Ejercicio',
};

/* ---------------------------------------------------------------------
   6. RENDER: barra lateral de módulos + progreso
   ------------------------------------------------------------------- */
function renderModules() {
  moduleList.innerHTML = '';

  state.modules.forEach(mod => {
    const btn = document.createElement('button');
    btn.className = 'module-item';
    if (mod.id === state.activeModuleId) btn.classList.add('is-active');
    if (mod.completed) btn.classList.add('is-completed');

    btn.innerHTML = `
      <span class="module-item__num">${String(mod.num).padStart(2, '0')}</span>
      <span class="module-item__name">${escapeHtml(mod.name)}</span>
      <span class="module-item__check">✔</span>
    `;
    btn.addEventListener('click', () => {
      state.activeModuleId = mod.id;
      saveState();
      renderModules();
      renderContent();
    });
    moduleList.appendChild(btn);
  });

  renderProgress();
}

function renderProgress() {
  const total = state.modules.length;
  const done = state.modules.filter(m => m.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  progressFill.style.width = pct + '%';
  progressLabel.textContent = pct + '%';
}

/* ---------------------------------------------------------------------
   7. RENDER: contenido (título del módulo + apuntes filtrados)
   ------------------------------------------------------------------- */
function renderContent() {
  const mod = state.modules.find(m => m.id === state.activeModuleId);
  if (!mod) return;

  // Cabecera del módulo
  moduleEyebrow.textContent = `Módulo ${String(mod.num).padStart(2, '0')}`;
  moduleTitle.textContent = mod.name;
  addNoteBtn.hidden = false;
  completedWrap.hidden = false;
  completedCheck.checked = mod.completed;

  // Filtrado de apuntes: por módulo + búsqueda + dificultad
  const query = searchInput.value.trim().toLowerCase();
  const diff = difficultyFilter.value;

  let notes = state.notes.filter(n => n.moduleId === mod.id);

  if (diff !== 'all') {
    notes = notes.filter(n => n.difficulty === diff);
  }
  if (query) {
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.body.toLowerCase().includes(query) ||
      (n.tags || []).some(t => t.toLowerCase().includes(query))
    );
  }

  renderNotes(notes, query);
}

function renderNotes(notes, query) {
  notesContainer.innerHTML = '';

  if (notes.length === 0) {
    const msg = query
      ? `No hay apuntes que coincidan con «${escapeHtml(query)}» en este módulo.`
      : 'Este módulo aún no tiene apuntes. Pulsa «+ Añadir apunte» para crear el primero.';
    notesContainer.innerHTML = `
      <div class="empty">
        <div class="empty__mark">~/</div>
        <h2 class="empty__title">Nada por aquí todavía</h2>
        <p>${msg}</p>
      </div>`;
    return;
  }

  notes.forEach(note => notesContainer.appendChild(buildNoteCard(note)));
}

/** Construye la tarjeta HTML de un apunte concreto. */
function buildNoteCard(note) {
  const card = document.createElement('article');
  card.className = 'note-card';
  card.dataset.type = note.type;

  const tagsHtml = (note.tags && note.tags.length)
    ? `<div class="note-card__tags">${note.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  // Bloque desplegable para preguntas y ejercicios
  let revealHtml = '';
  if ((note.type === 'pregunta' || note.type === 'ejercicio') && note.answer) {
    const label = note.type === 'pregunta' ? 'Mostrar respuesta' : 'Mostrar solución';
    revealHtml = `
      <div class="reveal">
        <button class="reveal__btn" type="button">${label}</button>
        <div class="reveal__content" hidden>${renderMarkdownLite(note.answer)}</div>
      </div>`;
  }

  card.innerHTML = `
    <div class="note-card__head">
      <h3 class="note-card__title">
        <span class="note-card__badge">${TYPE_LABELS[note.type] || note.type}</span>
        ${escapeHtml(note.title)}
      </h3>
      <div class="note-card__actions">
        <button class="icon-btn" data-action="edit" title="Editar">✎</button>
        <button class="icon-btn icon-btn--danger" data-action="delete" title="Borrar">🗑</button>
      </div>
    </div>
    <div class="note-card__body">${renderMarkdownLite(note.body)}</div>
    ${tagsHtml}
    ${revealHtml}
  `;

  // Botón de mostrar/ocultar respuesta
  const revealBtn = card.querySelector('.reveal__btn');
  if (revealBtn) {
    const content = card.querySelector('.reveal__content');
    revealBtn.addEventListener('click', () => {
      const isHidden = content.hidden;
      content.hidden = !isHidden;
      revealBtn.textContent = isHidden
        ? 'Ocultar'
        : (note.type === 'pregunta' ? 'Mostrar respuesta' : 'Mostrar solución');
    });
  }

  // Editar y borrar
  card.querySelector('[data-action="edit"]').addEventListener('click', () => openModal(note.id));
  card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteNote(note.id));

  return card;
}

/* ---------------------------------------------------------------------
   8. MODAL: añadir / editar apuntes
   ------------------------------------------------------------------- */

/** Abre el modal. Si se pasa un id, entra en modo edición. */
function openModal(noteId = null) {
  noteForm.reset();
  noteIdField.value = '';

  if (noteId) {
    const note = state.notes.find(n => n.id === noteId);
    if (!note) return;
    modalTitle.textContent = 'Editar apunte';
    noteIdField.value = note.id;
    noteType.value = note.type;
    noteTitle.value = note.title;
    noteBody.value = note.body;
    noteAnswer.value = note.answer || '';
    noteDifficulty.value = note.difficulty;
    noteTags.value = (note.tags || []).join(', ');
  } else {
    modalTitle.textContent = 'Nuevo apunte';
  }

  updateAnswerVisibility();
  noteModal.hidden = false;
  noteTitle.focus();
}

function closeModal() {
  noteModal.hidden = true;
}

/** Muestra u oculta el campo de respuesta según el tipo elegido. */
function updateAnswerVisibility() {
  const needsAnswer = (noteType.value === 'pregunta' || noteType.value === 'ejercicio');
  answerBlock.hidden = !needsAnswer;
}

/** Guarda el apunte (nuevo o editado) al enviar el formulario. */
function handleFormSubmit(e) {
  e.preventDefault();

  const tags = noteTags.value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  const data = {
    type: noteType.value,
    title: noteTitle.value.trim(),
    body: noteBody.value.trim(),
    answer: noteAnswer.value.trim(),
    difficulty: noteDifficulty.value,
    tags,
  };

  const editingId = noteIdField.value;

  if (editingId) {
    // Editar apunte existente
    const idx = state.notes.findIndex(n => n.id === editingId);
    if (idx !== -1) {
      state.notes[idx] = { ...state.notes[idx], ...data };
    }
    showToast('Apunte actualizado');
  } else {
    // Crear apunte nuevo en el módulo activo
    state.notes.push({
      id: makeId(),
      moduleId: state.activeModuleId,
      ...data,
    });
    showToast('Apunte añadido');
  }

  saveState();
  closeModal();
  renderContent();
}

/** Borra un apunte tras confirmación. */
function deleteNote(noteId) {
  const note = state.notes.find(n => n.id === noteId);
  if (!note) return;
  if (!confirm(`¿Borrar el apunte «${note.title}»? Esta acción no se puede deshacer.`)) return;

  state.notes = state.notes.filter(n => n.id !== noteId);
  saveState();
  renderContent();
  showToast('Apunte borrado');
}

/* ---------------------------------------------------------------------
   9. MARCAR MÓDULO COMO COMPLETADO
   ------------------------------------------------------------------- */
function toggleModuleCompleted() {
  const mod = state.modules.find(m => m.id === state.activeModuleId);
  if (!mod) return;
  mod.completed = completedCheck.checked;
  saveState();
  renderModules();
}

/* ---------------------------------------------------------------------
   10. TEMA CLARO / OSCURO
   ------------------------------------------------------------------- */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  themeToggle.textContent = state.theme === 'dark' ? '◐' : '◑';
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveState();
  applyTheme();
}

/* ---------------------------------------------------------------------
   11. IMPORTAR / EXPORTAR JSON
   ------------------------------------------------------------------- */
function exportData() {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `apuntes-linux-${date}.json`;
  a.click();

  URL.revokeObjectURL(url);
  showToast('Apuntes exportados');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      // Validación mínima de estructura
      if (!imported.modules || !imported.notes) {
        throw new Error('El archivo no tiene el formato esperado.');
      }
      if (!confirm('Importar reemplazará tus apuntes actuales. ¿Continuar?')) return;

      state = imported;
      // Asegura que existan campos esperados aunque el JSON sea antiguo
      state.theme = state.theme || 'dark';
      state.activeModuleId = state.activeModuleId || state.modules[0]?.id;

      saveState();
      applyTheme();
      renderModules();
      renderContent();
      showToast('Apuntes importados correctamente');
    } catch (err) {
      alert('No se pudo importar el archivo: ' + err.message);
    }
  };
  reader.readAsText(file);
}

/* ---------------------------------------------------------------------
   12. EVENTOS
   ------------------------------------------------------------------- */
function bindEvents() {
  addNoteBtn.addEventListener('click', () => openModal());
  noteForm.addEventListener('submit', handleFormSubmit);
  noteType.addEventListener('change', updateAnswerVisibility);
  completedCheck.addEventListener('change', toggleModuleCompleted);

  // Cierre del modal: botones marcados y clic en el fondo
  document.querySelectorAll('[data-close-modal]').forEach(el =>
    el.addEventListener('click', closeModal)
  );
  // Cerrar modal con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !noteModal.hidden) closeModal();
  });

  // Búsqueda y filtro: vuelven a renderizar el contenido en vivo
  searchInput.addEventListener('input', renderContent);
  difficultyFilter.addEventListener('change', renderContent);

  // Tema
  themeToggle.addEventListener('click', toggleTheme);

  // Exportar / importar / restaurar
  exportBtn.addEventListener('click', exportData);
  importBtn.addEventListener('click', () => importFile.click());
  const restoreBtn = document.querySelector('#restoreBtn');
  if (restoreBtn) restoreBtn.addEventListener('click', restoreGuide);
  importFile.addEventListener('change', (e) => {
    if (e.target.files.length) importData(e.target.files[0]);
    importFile.value = ''; // permite reimportar el mismo archivo
  });
}

/* ---------------------------------------------------------------------
   13. ARRANQUE
   ------------------------------------------------------------------- */
function init() {
  state = loadState();
  applyTheme();
  renderModules();
  renderContent();
  bindEvents();
}

// Espera a que el DOM esté listo antes de arrancar
document.addEventListener('DOMContentLoaded', init);

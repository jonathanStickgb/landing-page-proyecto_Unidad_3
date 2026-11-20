/**
 * =====================================================================
 * JAVA & AI DAY BOYACÁ 2026 — LÓGICA JAVASCRIPT OFICIAL
 * Proyecto Unidad 3 · UPTC Tunja
 * Autores: María Medina, Natalia Cruz, Jonathan Stick Fuentes
 * ---------------------------------------------------------------------
 * Arquitectura: cada snippet es una IIFE con namespace propio (LP*),
 * sin variables ni funciones globales y sin manejadores inline en el HTML.
 *   LPModal   -> abrir/cerrar ventanas modales
 *   LPUi      -> reveal-on-scroll, cuenta regresiva y menú móvil
 *   LPForm    -> formulario: borrador local, envío a la API (MariaDB) y Formspree
 *   LPAdmin   -> panel de administración conectado a la API (MariaDB)
 * =====================================================================
 */

/* URL de la API MARIAB, sin barra final. Se elige sola según dónde se abra la página:
   - En tu computador (localhost / 127.0.0.1) usa la API local.
   - En el sitio publicado usa MARIAB_API_URL_PRODUCCION. Al desplegar la API, cambia SOLO esa
     línea (por ejemplo 'https://mariab-api.onrender.com'). Vacía = sin API: el formulario envía
     únicamente a Formspree y el panel de administrador queda deshabilitado. */
const MARIAB_API_URL_LOCAL = 'http://localhost:3000';
const MARIAB_API_URL_PRODUCCION = '';
const MARIAB_API_URL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
  ? MARIAB_API_URL_LOCAL
  : MARIAB_API_URL_PRODUCCION;

/* ---------- LPModal: ventanas modales ---------- */
const LPModal = (() => {
  'use strict';
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  }

  function closeAllModals() {
    ['registerModal', 'adminLoginModal', 'editModal'].forEach(closeModal);
  }
  return { open: openModal, close: closeModal, closeAll: closeAllModals };
})();

/* ---------- LPUi: animaciones, cuenta regresiva y menú móvil ---------- */
const LPUi = (() => {
  'use strict';
  /**
   * REQUERIMIENTO #2: API IntersectionObserver
   * Aplica clases .reveal-card y .revealed con delay escalonado al entrar en viewport
   */
  function initScrollAnimations() {
    const cards = document.querySelectorAll('.reveal-card');
    if (!cards.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((c) => c.classList.add('revealed'));
      return;
    }

    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const delay = target.dataset.delay || 0;
          setTimeout(() => {
            target.classList.add('revealed');
          }, parseInt(delay, 10));
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    cards.forEach((card, index) => {
      card.dataset.delay = (index % 4) * 120;
      observer.observe(card);
    });
  }

  /**
   * Cuenta regresiva dinámica al inicio oficial: 4 de Diciembre de 2026, 08:00 AM (COT)
   */
  function initCountdown() {
    const targetTime = new Date('2026-12-04T08:00:00-05:00').getTime();

    function tick() {
      const now = new Date().getTime();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const elDays = document.getElementById('cd-days');
      const elHours = document.getElementById('cd-hours');
      const elMins = document.getElementById('cd-mins');

      if (elDays) elDays.textContent = days;
      if (elHours) elHours.textContent = hours;
      if (elMins) elMins.textContent = mins;
    }

    tick();
    setInterval(tick, 60000);
  }

  /**
   * Menú móvil (hamburguesa). Se alterna la clase "hidden" y aria-expanded.
   */
  function initMobileMenu() {
    const btn = document.getElementById('menuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    const setOpen = (open) => {
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    };
    btn.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }
  return { init() { initMobileMenu(); initScrollAnimations(); initCountdown(); } };
})();

/**
 * =====================================================================
 * MÓDULO LPForm — Persistencia del formulario de acreditación (IIFE)
 * ---------------------------------------------------------------------
 *  - Autoguardado en localStorage al escribir (evento input/change)
 *  - Restauración automática al cargar la página
 *  - Envío real por POST a Formspree
 *  - Detección de "usuario ya convertido" + limpieza del borrador
 * Claves con namespace: lp_jai2026_*
 * =====================================================================
 */
const LPForm = (() => {
  'use strict';

  // Reemplaza por tu endpoint: https://formspree.io/f/xxxxxxxx (formspree.io → New Form)
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xljbnvdl';
  // La URL de la API se define arriba (MARIAB_API_URL). Vacío = no se usa la API.
  const API_URL = MARIAB_API_URL;
  const NS = 'lp_jai2026_';
  const CONVERTED_KEY = NS + 'convertido';
  // id del campo en el HTML -> sufijo de la clave de almacenamiento
  const FIELDS = {
    formName: 'nombre',
    formEmail: 'correo',
    formRole: 'rol',
    formAttendance: 'modalidad',
    formOrg: 'organizacion'
  };
  const CONSENT_KEY = NS + 'consentimiento';

  // Acceso seguro a localStorage (puede estar bloqueado por el navegador)
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } },
    remove(k) { try { localStorage.removeItem(k); } catch (e) { /* sin almacenamiento */ } }
  };
  const $ = (id) => document.getElementById(id);

  // Guarda el valor de un campo en localStorage
  function saveField(id) {
    const el = $(id);
    if (el) store.set(NS + FIELDS[id], el.value);
  }

  // Restaura todos los campos guardados al cargar
  function restore() {
    Object.keys(FIELDS).forEach((id) => {
      const saved = store.get(NS + FIELDS[id]);
      const el = $(id);
      if (el && saved !== null) el.value = saved;
    });
    const consent = $('formConsent');
    if (consent) consent.checked = store.get(CONSENT_KEY) === '1';
  }

  // Borra el borrador (se usa tras un envío exitoso)
  function clearDraft() {
    Object.values(FIELDS).forEach((k) => store.remove(NS + k));
    store.remove(CONSENT_KEY);
  }

  // Muestra un mensaje de estado accesible (aria-live) bajo el formulario
  function setStatus(msg, isError) {
    const el = $('formStatus');
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('hidden', !msg);
    el.classList.toggle('text-red-400', Boolean(isError));
    el.classList.toggle('text-[#00e676]', !isError);
  }

  // Validación propia, complementaria a la nativa del navegador
  function validate() {
    const name = $('formName')?.value.trim() || '';
    const email = $('formEmail')?.value.trim() || '';
    if (name.length < 3) { setStatus('Escribe tu nombre completo (mínimo 3 caracteres).', true); $('formName')?.focus(); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setStatus('Escribe un correo electrónico válido.', true); $('formEmail')?.focus(); return false; }
    if (!$('formConsent')?.checked) { setStatus('Debes autorizar el tratamiento de tus datos para continuar.', true); $('formConsent')?.focus(); return false; }
    if ($('formHoneypot')?.value) return false; // campo trampa para bots
    setStatus('', false);
    return true;
  }

  // Envío de datos: API MARIAB (base de datos) y/o Formspree (correo). Devuelve el ticket si lo da la API.
  async function send(payload) {
    const formspreeOn = !FORMSPREE_ENDPOINT.includes('REEMPLAZAR');
    if (!API_URL && !formspreeOn) {
      throw new Error('El envío aún no está configurado: define API_URL o el endpoint de Formspree en script.js.');
    }
    setStatus('Enviando…', false);
    let ticket = null;

    if (API_URL) {
      let res;
      try {
        res = await fetch(`${API_URL}/api/attendees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, consentimiento: $('formConsent')?.checked === true, _gotcha: $('formHoneypot')?.value || '' })
        });
      } catch (e) {
        throw new Error('No pudimos contactar el servidor. Tus datos siguen guardados; inténtalo de nuevo.');
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No pudimos registrar tus datos. Inténtalo de nuevo.');
      ticket = data.ticket || null;
    }

    if (formspreeOn) {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, ticket })
      });
      // Si la API ya guardó el registro, un fallo del correo no debe bloquear al usuario
      if (!res.ok && !API_URL) throw new Error('No pudimos enviar tu registro. Tus datos siguen guardados; inténtalo de nuevo.');
    }
    setStatus('', false);
    return ticket;
  }

  // Alterna entre formulario y mensaje de agradecimiento
  function showThanks(name, ticket) {
    $('thanksName').textContent = name; // textContent: sin riesgo de XSS
    if ($('thanksTicket')) $('thanksTicket').textContent = ticket || '';
    $('thanksTicketBox')?.classList.toggle('hidden', !ticket);
    $('formThanks')?.classList.remove('hidden');
    $('attendeeForm')?.classList.add('hidden');
  }
  function showForm() {
    $('formThanks')?.classList.add('hidden');
    $('attendeeForm')?.classList.remove('hidden');
  }

  // Usuario convertido: guarda la marca, limpia el borrador y agradece
  function markConverted(name, ticket) {
    clearDraft();
    store.set(CONVERTED_KEY, JSON.stringify({ nombre: name, ticket: ticket || null, fecha: new Date().toISOString() }));
    showThanks(name, ticket);
  }

  function init() {
    const form = $('attendeeForm');
    if (!form) return;
    // Autoguardado en tiempo real
    Object.keys(FIELDS).forEach((id) => {
      $(id)?.addEventListener('input', () => saveField(id));
      $(id)?.addEventListener('change', () => saveField(id));
    });
    $('formConsent')?.addEventListener('change', (e) => store.set(CONSENT_KEY, e.target.checked ? '1' : '0'));
    // Permite registrar a otra persona
    $('formAnother')?.addEventListener('click', () => { store.remove(CONVERTED_KEY); showForm(); });
    // Restauración + detección de usuario ya convertido
    restore();
    const converted = store.get(CONVERTED_KEY);
    if (converted) {
      try { const c = JSON.parse(converted); showThanks(c.nombre || '', c.ticket); } catch (e) { store.remove(CONVERTED_KEY); }
    }
  }

  return { init, validate, send, setStatus, markConverted, clearDraft };
})();

/* ---------- LPAdmin: panel de administración conectado a la API MARIAB (MariaDB) ---------- */
const LPAdmin = (() => {
  'use strict';
  const { open: openModal, close: closeModal } = LPModal;

  /**
   * =====================================================================
   * PANEL DE ADMINISTRACIÓN (datos reales en MariaDB, a través de la API)
   * ---------------------------------------------------------------------
   * - Listar, editar, hacer check-in y eliminar se hace contra la API.
   * - La API exige el ADMIN_TOKEN (archivo api/.env) en el encabezado
   *   Authorization. Ese token NO está en este archivo: lo escribe el
   *   administrador en el modal y se guarda solo en sessionStorage
   *   (se borra al cerrar la pestaña).
   * - La seguridad real la aplica el servidor; esta pantalla solo muestra
   *   u oculta botones.
   * =====================================================================
   */
  const TOKEN_KEY = 'MARIAB_ADMIN_TOKEN';
  const LEGACY_LOCAL_KEY = 'MARIAB_DB_ATTENDEES_2026'; // datos de demostración antiguos
  let adminToken = '';
  let isAdmin = false;
  let attendees = [];
  let searchTimer = null;

  class ApiError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status;
    }
  }

  const $ = (id) => document.getElementById(id);

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function readToken() {
    try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }
  function saveToken(token) {
    try {
      if (token) sessionStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) { /* sin almacenamiento: la sesión dura hasta recargar */ }
  }

  // Llamada a la API con el token de administrador
  async function api(path, { method = 'GET', body, token = adminToken } = {}) {
    if (!MARIAB_API_URL) throw new ApiError(0, 'La API aún no está desplegada: el panel de administrador no está disponible en este sitio.');
    const headers = { Authorization: 'Bearer ' + token };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    let res;
    try {
      res = await fetch(MARIAB_API_URL + path, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined
      });
    } catch (e) {
      throw new ApiError(0, 'No se pudo contactar la API. Verifica que esté encendida y que este sitio tenga permiso (CORS).');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(res.status, data.error || 'Error ' + res.status);
    return data;
  }

  /* ---------- Tabla ---------- */
  function setCount(value) {
    const el = $('recordCount');
    if (el) el.textContent = value;
  }

  function renderMessage(text) {
    const tbody = $('attendeesTableBody');
    if (!tbody) return;
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-[#a8998a] font-mono text-xs">${escapeHtml(text)}</td>
      </tr>`;
  }

  function statusClass(status) {
    if (status === 'checkin') return 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30';
    if (status === 'cancelado') return 'bg-red-500/10 text-red-400 border border-red-400/30';
    return 'bg-[#f89820]/10 text-[#f89820] border border-[#f89820]/30';
  }

  function rowHtml(item) {
    const id = escapeHtml(item.id);
    const presencial = item.attendance_type === 'presencial';
    return `
      <tr class="hover:bg-white/[0.03] transition-colors border-b border-white/5">
        <td class="py-3 px-4 font-mono font-bold text-[#f89820] text-xs">${escapeHtml(item.ticket_number)}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-[#fbf7f2] text-xs">${escapeHtml(item.full_name)}</div>
          <div class="text-[11px] text-[#a8998a] font-mono">${escapeHtml(item.email)}</div>
        </td>
        <td class="py-3 px-4 text-xs">
          <div>${escapeHtml(item.role)}</div>
          <div class="text-[11px] text-[#a8998a]">${escapeHtml(item.organization)}</div>
        </td>
        <td class="py-3 px-4 text-xs font-mono uppercase text-[11px]">
          <span class="${presencial ? 'text-[#f89820]' : 'text-[#5382a1]'}">${escapeHtml(item.attendance_type)}</span>
        </td>
        <td class="py-3 px-4 text-xs">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
        </td>
        <td class="py-3 px-4 text-right text-xs">
          <button data-action="checkin" data-id="${id}" class="px-2 py-1 text-[11px] font-mono text-[#00e676] hover:underline">
            ${item.status === 'checkin' ? 'Check-out' : 'Check-in'}
          </button>
          <button data-action="edit" data-id="${id}" class="px-2 py-1 text-[11px] font-mono text-[#f89820] hover:underline ml-2">Editar</button>
          <button data-action="delete" data-id="${id}" class="px-2 py-1 text-[11px] font-mono text-red-400 hover:underline ml-2">Eliminar</button>
        </td>
      </tr>`;
  }

  function renderTable() {
    const tbody = $('attendeesTableBody');
    if (!tbody) return;
    if (!isAdmin) {
      setCount('—');
      renderMessage('Inicia sesión como administrador para ver los registros guardados en MariaDB.');
      return;
    }
    setCount(attendees.length);
    if (!attendees.length) {
      renderMessage('No se encontraron registros en la base de datos.');
      return;
    }
    tbody.innerHTML = attendees.map(rowHtml).join('');
  }

  // Carga los registros desde la API (el filtro de búsqueda lo aplica el servidor)
  async function loadAttendees() {
    if (!isAdmin) {
      attendees = [];
      renderTable();
      return;
    }
    const q = ($('searchInput')?.value || '').trim();
    renderMessage('Cargando registros…');
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (q) params.set('q', q);
      const data = await api('/api/attendees?' + params.toString());
      attendees = Array.isArray(data.data) ? data.data : [];
      renderTable();
    } catch (e) {
      if (e.status === 401) {
        setAdminMode(false);
        renderMessage('La sesión de administrador no es válida. Vuelve a iniciar sesión.');
        return;
      }
      attendees = [];
      setCount('—');
      renderMessage(e.message);
    }
  }

  function filterAttendees() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadAttendees, 300);
  }

  // Ejecuta una acción contra la API y recarga la tabla. Devuelve true si salió bien.
  async function runAction(fn, hint500) {
    try {
      await fn();
      await loadAttendees();
      return true;
    } catch (e) {
      if (e.status === 401) {
        setAdminMode(false);
        alert('Tu sesión de administrador no es válida. Vuelve a iniciar sesión.');
      } else if (e.status === 500 && hint500) {
        alert(hint500);
      } else {
        alert(e.message || 'No se pudo completar la acción.');
      }
      return false;
    }
  }

  async function toggleCheckin(id) {
    if (!isAdmin) return;
    const item = attendees.find((a) => a.id === id);
    if (!item) return;
    const status = item.status === 'checkin' ? 'confirmado' : 'checkin';
    await runAction(() => api('/api/attendees/' + encodeURIComponent(id), { method: 'PATCH', body: { status } }));
  }

  async function deleteAttendee(id) {
    if (!isAdmin) return;
    if (!confirm('¿Eliminar esta acreditación de la base de datos MARIAB?')) return;
    await runAction(() => api('/api/attendees/' + encodeURIComponent(id), { method: 'DELETE' }));
  }

  /* ---------- Registro público (formulario) ---------- */
  async function handleFormSubmit(event) {
    event.preventDefault();
    const name = $('formName')?.value.trim();
    const email = $('formEmail')?.value.trim();
    const role = $('formRole')?.value;
    const attendance = $('formAttendance')?.value;
    const org = $('formOrg')?.value.trim() || 'UPTC Tunja';

    // Validación de campos (mensajes en pantalla, sin alert)
    if (!LPForm.validate()) return;

    // Envío a la API (MariaDB) y a Formspree. Si falla, se conservan los datos del borrador.
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    let ticket = null;
    try {
      ticket = await LPForm.send({ nombre: name, correo: email, rol: role, modalidad: attendance, organizacion: org });
    } catch (err) {
      LPForm.setStatus(err.message || 'No pudimos enviar tu registro. Tus datos siguen guardados; inténtalo de nuevo.', true);
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
    if (submitBtn) submitBtn.disabled = false;

    // Si el administrador tiene la sesión abierta, la tabla muestra el nuevo registro
    if (isAdmin) loadAttendees();

    // Limpia el borrador, marca al usuario como convertido y muestra el agradecimiento
    event.target.reset();
    LPForm.markConverted(name, ticket);
  }

  /* ---------- Modo administrador ---------- */
  function initAdminSession() {
    adminToken = readToken();
    isAdmin = Boolean(adminToken);
    updateAdminUI();
  }

  function setAdminMode(active) {
    isAdmin = active;
    if (!active) {
      adminToken = '';
      saveToken('');
      attendees = [];
    }
    updateAdminUI();
    loadAttendees();
  }

  function updateAdminUI() {
    const badge = $('adminBadge');
    const btn = $('adminToggleBtn');
    if (badge) badge.classList.toggle('hidden', !isAdmin);
    if (btn) btn.textContent = isAdmin ? '🔓 Cerrar sesión' : '🔒 Acceso Administrador';
  }

  function handleAdminButton() {
    if (isAdmin) {
      if (confirm('¿Cerrar la sesión de administrador?')) setAdminMode(false);
      return;
    }
    const input = $('adminPassword');
    const error = $('adminLoginError');
    if (input) input.value = '';
    if (error) error.classList.add('hidden');
    openModal('adminLoginModal');
    input?.focus();
  }

  async function handleAdminLogin(event) {
    event.preventDefault();
    const input = $('adminPassword');
    const error = $('adminLoginError');
    const submit = event.target.querySelector('button[type="submit"]');
    const showError = (msg) => {
      if (error) {
        error.textContent = msg;
        error.classList.remove('hidden');
      }
    };

    const token = input?.value || '';
    if (!token) { showError('Escribe el token de administrador.'); return; }

    if (submit) submit.disabled = true;
    try {
      // Si la API acepta el token, la sesión queda iniciada
      await api('/api/attendees?limit=1', { token });
      adminToken = token;
      saveToken(token);
      if (input) input.value = '';
      if (error) error.classList.add('hidden');
      closeModal('adminLoginModal');
      setAdminMode(true);
    } catch (e) {
      showError(e.status === 401 ? 'Token incorrecto. Inténtalo de nuevo.' : e.message);
      if (e.status === 401) input?.select();
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function openEditModal(id) {
    if (!isAdmin) return;
    const item = attendees.find((a) => a.id === id);
    if (!item) return;

    $('editId').value = item.id;
    $('editTicketLabel').textContent = item.ticket_number;
    $('editName').value = item.full_name;
    $('editEmail').value = item.email;
    $('editRole').value = item.role;
    $('editAttendance').value = item.attendance_type;
    $('editOrg').value = item.organization;
    $('editStatus').value = item.status;
    openModal('editModal');
  }

  async function handleEditSubmit(event) {
    event.preventDefault();
    if (!isAdmin) return;

    const id = $('editId').value;
    const name = $('editName').value.trim();
    const email = $('editEmail').value.trim();
    if (name.length < 3 || !email) {
      alert('El nombre debe tener al menos 3 caracteres y el correo es obligatorio.');
      return;
    }

    const body = {
      nombre: name,
      correo: email,
      rol: $('editRole').value,
      modalidad: $('editAttendance').value,
      organizacion: $('editOrg').value.trim() || 'UPTC Tunja',
      status: $('editStatus').value
    };
    const ok = await runAction(
      () => api('/api/attendees/' + encodeURIComponent(id), { method: 'PATCH', body }),
      'No se pudo guardar. Revisa que el correo no esté repetido en otro asistente.'
    );
    if (ok) closeModal('editModal');
  }

  // Acciones disparadas por delegación de eventos desde el bootstrap
  const actions = {
    checkin: toggleCheckin,
    delete: deleteAttendee,
    edit: openEditModal,
    'admin-toggle': handleAdminButton,
    filter: filterAttendees
  };
  return {
    init() {
      try { localStorage.removeItem(LEGACY_LOCAL_KEY); } catch (e) { /* sin almacenamiento */ }
      initAdminSession();
      loadAttendees();
    },
    act(name, id) { if (actions[name]) actions[name](id); },
    onRegisterSubmit: handleFormSubmit,
    onLoginSubmit: handleAdminLogin,
    onEditSubmit: handleEditSubmit
  };
})();

/* ---------- Arranque: un solo punto de entrada y delegación de eventos ---------- */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    LPUi.init();
    LPForm.init();
    LPAdmin.init();

    // Vincula formularios (sustituye a los onsubmit inline)
    document.getElementById('attendeeForm')?.addEventListener('submit', LPAdmin.onRegisterSubmit);
    document.getElementById('adminLoginForm')?.addEventListener('submit', LPAdmin.onLoginSubmit);
    document.getElementById('editForm')?.addEventListener('submit', LPAdmin.onEditSubmit);
    document.getElementById('searchInput')?.addEventListener('input', () => LPAdmin.act('filter'));

    // Clics: modales (data-open-modal / data-close-modal) y acciones (data-action)
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-open-modal],[data-close-modal],[data-action]');
      if (!el) return;
      if (el.dataset.openModal) LPModal.open(el.dataset.openModal);
      if (el.dataset.closeModal) LPModal.close(el.dataset.closeModal);
      if (el.dataset.action) LPAdmin.act(el.dataset.action, el.dataset.id);
    });

    // Tecla Escape cierra los modales
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') LPModal.closeAll(); });
  });
})();

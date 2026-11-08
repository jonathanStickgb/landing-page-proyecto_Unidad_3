/**
 * =====================================================================
 * JAVA & AI DAY BOYACÁ 2026 — LÓGICA JAVASCRIPT OFICIAL
 * Proyecto Unidad 3 · UPTC Tunja
 * Autores: María Medina, Natalia Cruz, Jonathan Stick Fuentes
 * =====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. REQUERIMIENTO #2: IntersectionObserver Reveal-on-Scroll en tarjetas de ponentes
  initScrollAnimations();

  // 2. Contador Regresivo para el 4 de Diciembre de 2026
  initCountdown();

  // 3. Restaurar la sesión de administrador (antes de pintar la tabla)
  initAdminSession();

  // 4. Inicializar Base de Datos MARIAB en LocalStorage
  initMariaBStorage();

  // 5. Atajo de teclado para cerrar modales con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
});

/**
 * REQUERIMIENTO #2: API IntersectionObserver
 * Aplica clases .reveal-card y .revealed con delay escalonado al entrar en viewport
 */
function initScrollAnimations() {
  const cards = document.querySelectorAll('.reveal-card');
  if (!cards.length) return;

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
 * =====================================================================
 * BASE DE DATOS MARIAB (Persistencia Local en Navegador)
 * =====================================================================
 */
const MARIAB_STORAGE_KEY = 'MARIAB_DB_ATTENDEES_2026';
let mariaBAttendees = [];

const INITIAL_MARIAB_SEEDS = [
  {
    id: 'seed-1',
    ticketNumber: 'JAI-BOY-2026-1042',
    fullName: 'Ing. Julián Camilo Vargas',
    email: 'julian.vargas@uptc.edu.co',
    role: 'Desarrollador / Ingeniero',
    organization: 'UPTC - Grupo SInC',
    attendanceType: 'presencial',
    status: 'confirmado',
    track: 'Ambos (Java + IA)'
  },
  {
    id: 'seed-2',
    ticketNumber: 'JAI-BOY-2026-1088',
    fullName: 'Laura Marcela Pinzón',
    email: 'laura.pinzon@tunja-tech.org',
    role: 'Estudiante UPTC',
    organization: 'Escuela de Sistemas UPTC',
    attendanceType: 'presencial',
    status: 'checkin',
    track: 'Core Java & Loom'
  },
  {
    id: 'seed-3',
    ticketNumber: 'JAI-BOY-2026-1120',
    fullName: 'David Esteban Roa',
    email: 'david.roa@boyacadevs.org',
    role: 'Líder Tech / Empresa',
    organization: 'Boyacá Devs',
    attendanceType: 'presencial',
    status: 'confirmado',
    track: 'IA Generativa & LangChain4j'
  },
  {
    id: 'seed-4',
    ticketNumber: 'JAI-BOY-2026-1155',
    fullName: 'Dra. María Elena Castañeda',
    email: 'maria.castaneda@uptc.edu.co',
    role: 'Docente / Investigador',
    organization: 'Facultad de Ingeniería UPTC',
    attendanceType: 'presencial',
    status: 'confirmado',
    track: 'Ambos (Java + IA)'
  }
];

function initMariaBStorage() {
  const raw = localStorage.getItem(MARIAB_STORAGE_KEY);
  if (raw) {
    try {
      mariaBAttendees = JSON.parse(raw);
    } catch (e) {
      mariaBAttendees = [...INITIAL_MARIAB_SEEDS];
    }
  } else {
    mariaBAttendees = [...INITIAL_MARIAB_SEEDS];
    saveMariaBStorage();
  }
  renderMariaBTable(mariaBAttendees);
}

function saveMariaBStorage() {
  localStorage.setItem(MARIAB_STORAGE_KEY, JSON.stringify(mariaBAttendees));
  updateCounts();
}

function updateCounts() {
  const countEl = document.getElementById('recordCount');
  if (countEl) countEl.textContent = mariaBAttendees.length;
}

function renderMariaBTable(data) {
  const tbody = document.getElementById('attendeesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  updateCounts();

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-[#a8998a] font-mono text-xs">
          No se encontraron registros en la base de datos MARIAB.
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((item) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-white/[0.03] transition-colors border-b border-white/5';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-[#f89820] text-xs">${item.ticketNumber}</td>
      <td class="py-3 px-4">
        <div class="font-bold text-[#fbf7f2] text-xs">${escapeHtml(item.fullName)}</div>
        <div class="text-[11px] text-[#a8998a] font-mono">${escapeHtml(item.email)}</div>
      </td>
      <td class="py-3 px-4 text-xs">
        <div>${escapeHtml(item.role)}</div>
        <div class="text-[11px] text-[#a8998a]">${escapeHtml(item.organization)}</div>
      </td>
      <td class="py-3 px-4 text-xs font-mono uppercase text-[11px]">
        <span class="${item.attendanceType === 'presencial' ? 'text-[#f89820]' : 'text-[#5382a1]'}">
          ${item.attendanceType}
        </span>
      </td>
      <td class="py-3 px-4 text-xs">
        <span class="px-2 py-0.5 rounded text-[10px] font-mono ${
          item.status === 'checkin'
            ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30'
            : 'bg-[#f89820]/10 text-[#f89820] border border-[#f89820]/30'
        }">
          ${item.status}
        </span>
      </td>
      <td class="py-3 px-4 text-right text-xs">
        <button onclick="toggleCheckin('${item.id}')" class="px-2 py-1 text-[11px] font-mono text-[#00e676] hover:underline">
          ${item.status === 'checkin' ? 'Check-out' : 'Check-in'}
        </button>
        ${
          isAdmin
            ? `<button onclick="openEditModal('${item.id}')" class="px-2 py-1 text-[11px] font-mono text-[#f89820] hover:underline ml-2">
                 Editar
               </button>
               <button onclick="deleteAttendee('${item.id}')" class="px-2 py-1 text-[11px] font-mono text-red-400 hover:underline ml-2">
                 Eliminar
               </button>`
            : ''
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterAttendees() {
  const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const filtered = mariaBAttendees.filter(
    (a) =>
      a.fullName.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query) ||
      a.ticketNumber.toLowerCase().includes(query) ||
      a.organization.toLowerCase().includes(query)
  );
  renderMariaBTable(filtered);
}

function toggleCheckin(id) {
  const item = mariaBAttendees.find((a) => a.id === id);
  if (item) {
    item.status = item.status === 'checkin' ? 'confirmado' : 'checkin';
    saveMariaBStorage();
    filterAttendees();
  }
}

function deleteAttendee(id) {
  if (!isAdmin) return;
  if (confirm('¿Eliminar esta acreditación de la base de datos MARIAB?')) {
    mariaBAttendees = mariaBAttendees.filter((a) => a.id !== id);
    saveMariaBStorage();
    filterAttendees();
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('formName')?.value.trim();
  const email = document.getElementById('formEmail')?.value.trim();
  const role = document.getElementById('formRole')?.value;
  const attendance = document.getElementById('formAttendance')?.value;
  const org = document.getElementById('formOrg')?.value.trim() || 'UPTC Tunja';

  if (!name || !email) {
    alert('Por favor completa todos los campos requeridos.');
    return;
  }

  const randomSeq = Math.floor(1000 + Math.random() * 9000);
  const newRecord = {
    id: 'reg-' + Date.now(),
    ticketNumber: `JAI-BOY-2026-${randomSeq}`,
    fullName: name,
    email: email,
    role: role,
    organization: org,
    attendanceType: attendance,
    status: 'confirmado',
    track: 'Ambos (Java + IA)'
  };

  mariaBAttendees.unshift(newRecord);
  saveMariaBStorage();
  filterAttendees();
  closeModal('registerModal');
  document.getElementById('attendeeForm')?.reset();

  alert(`¡Registro guardado con éxito en la base de datos MARIAB!\nTicket Asignado: ${newRecord.ticketNumber}`);
}

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

/**
 * =====================================================================
 * MODO ADMINISTRADOR (editar y eliminar registros)
 * ---------------------------------------------------------------------
 * Nota: es un sitio estático en GitHub Pages, así que este acceso es
 * una protección de interfaz para la demo, no una seguridad real.
 * La contraseña no se guarda en texto plano: se compara su hash SHA-256.
 * Para cambiarla, ejecuta en la consola del navegador:
 *   await sha256('tu-nueva-clave')
 * y pega el resultado en ADMIN_PASSWORD_HASH.
 * =====================================================================
 */
const ADMIN_PASSWORD_HASH = '4348565feaa25a1eacb3bd5b004362d7b5245caa0f29d54b2f88575a1d68f166';
const ADMIN_SESSION_KEY = 'MARIAB_ADMIN_SESSION';
let isAdmin = false;

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function initAdminSession() {
  try {
    isAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch (e) {
    isAdmin = false;
  }
  updateAdminUI();
}

function setAdminMode(active) {
  isAdmin = active;
  try {
    if (active) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {
    // Si el navegador bloquea sessionStorage, el modo dura hasta recargar.
  }
  updateAdminUI();
  filterAttendees();
}

function updateAdminUI() {
  const badge = document.getElementById('adminBadge');
  const btn = document.getElementById('adminToggleBtn');
  if (badge) badge.classList.toggle('hidden', !isAdmin);
  if (btn) btn.textContent = isAdmin ? '🔓 Cerrar sesión' : '🔒 Acceso Administrador';
}

function handleAdminButton() {
  if (isAdmin) {
    if (confirm('¿Cerrar la sesión de administrador?')) {
      setAdminMode(false);
    }
    return;
  }

  const input = document.getElementById('adminPassword');
  const error = document.getElementById('adminLoginError');
  if (input) input.value = '';
  if (error) error.classList.add('hidden');
  openModal('adminLoginModal');
  input?.focus();
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const input = document.getElementById('adminPassword');
  const error = document.getElementById('adminLoginError');
  const showError = (msg) => {
    if (error) {
      error.textContent = msg;
      error.classList.remove('hidden');
    }
  };

  if (!window.crypto?.subtle) {
    showError('Tu navegador no permite verificar la contraseña en este contexto.');
    return;
  }

  const hash = await sha256(input?.value || '');
  if (hash === ADMIN_PASSWORD_HASH) {
    setAdminMode(true);
    closeModal('adminLoginModal');
    if (input) input.value = '';
  } else {
    showError('Contraseña incorrecta. Inténtalo de nuevo.');
    input?.select();
  }
}

function openEditModal(id) {
  if (!isAdmin) return;
  const item = mariaBAttendees.find((a) => a.id === id);
  if (!item) return;

  document.getElementById('editId').value = item.id;
  document.getElementById('editTicketLabel').textContent = item.ticketNumber;
  document.getElementById('editName').value = item.fullName;
  document.getElementById('editEmail').value = item.email;
  document.getElementById('editRole').value = item.role;
  document.getElementById('editAttendance').value = item.attendanceType;
  document.getElementById('editOrg').value = item.organization;
  document.getElementById('editStatus').value = item.status;
  openModal('editModal');
}

function handleEditSubmit(event) {
  event.preventDefault();
  if (!isAdmin) return;

  const id = document.getElementById('editId').value;
  const item = mariaBAttendees.find((a) => a.id === id);
  if (!item) return;

  const name = document.getElementById('editName').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  if (!name || !email) {
    alert('Por favor completa todos los campos requeridos.');
    return;
  }

  item.fullName = name;
  item.email = email;
  item.role = document.getElementById('editRole').value;
  item.attendanceType = document.getElementById('editAttendance').value;
  item.organization = document.getElementById('editOrg').value.trim() || 'UPTC Tunja';
  item.status = document.getElementById('editStatus').value;

  saveMariaBStorage();
  filterAttendees();
  closeModal('editModal');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

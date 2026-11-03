/* =====================================================================
 * MARIAB → Firebase Firestore (capa de sincronización)
 * Java & AI Day Boyacá 2026 · UPTC Tunja
 *
 * Qué hace (sin modificar el código existente de la página):
 *  - Cada vez que la página guarda en localStorage (clave MARIAB_*),
 *    este módulo replica el cambio en Firestore (colección "attendees").
 *  - Cualquier visitante puede CREAR su registro. Solo el administrador
 *    (inicio de sesión con Google) puede leer todos, editar y eliminar.
 *  - Botón flotante "☁ Admin Firebase": inicia sesión y sincroniza,
 *    trayendo los registros de TODOS los asistentes a esta tabla.
 *
 * Uso: agregar antes de </body> en index.html:
 *   <script type="module" src="./mariab-firestore.js"></script>
 * ===================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore, doc, setDoc, deleteDoc, collection, getDocs, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  projectId: "gen-lang-client-0670177882",
  appId: "1:321736566620:web:0b4e8c2469958896754399",
  apiKey: "AIzaSyAIaxhHyu08XJsrsG9nJ5h_K4eevyzTCe0",
  authDomain: "gen-lang-client-0670177882.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-javaaidayboyac20-f45643e8-ac0a-4348-830d-e9486039d09b",
};

const COLLECTION = "attendees";
const MAIN_KEY = "MARIAB_ATTENDEES_STORE_2026";
const SEED_IDS = new Set(["1", "2", "3", "4"]); // datos de ejemplo: no se suben
const STATUSES = ["confirmado", "pendiente", "checkin", "cancelado"];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

const origSetItem = Storage.prototype.setItem;
const isMariaKey = (k) => typeof k === "string" && k.startsWith("MARIAB");
const safeId = (id) => String(id).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 128);

/* ---------- utilidades ---------- */
function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText =
    "position:fixed;left:50%;bottom:72px;transform:translateX(-50%);z-index:70;max-width:90vw;" +
    "padding:10px 16px;border-radius:10px;background:#120d0a;color:#fbf7f2;" +
    "border:1px solid rgba(248,152,32,.5);font:12px ui-monospace,monospace;";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 6000);
}

function toRemote(a) {
  return {
    fullName: String(a.fullName || "").slice(0, 100),
    email: String(a.email || "").slice(0, 120),
    role: a.role,
    organization: String(a.organization || "UPTC Tunja").slice(0, 120),
    attendanceType: a.attendanceType === "streaming" ? "streaming" : "presencial",
    primaryTrack: a.primaryTrack || "Ambos (Java + IA)",
    ticketNumber: String(a.ticketNumber || "").slice(0, 64),
    status: STATUSES.includes(a.status) ? a.status : "confirmado",
    updatedAt: serverTimestamp(),
  };
}

function readLocal() {
  const key = localStorage.getItem(MAIN_KEY) !== null
    ? MAIN_KEY
    : Object.keys(localStorage).find(isMariaKey) || MAIN_KEY;
  try { return { key, list: JSON.parse(localStorage.getItem(key)) || [] }; }
  catch { return { key, list: [] }; }
}

let warned = false;
function reportError(e) {
  console.warn("[MARIAB→Firestore]", e);
  if (warned) return;
  warned = true;
  toast("Guardado solo en este navegador (no se pudo sincronizar: " + (e.code || e.message) + ")");
}

/* ---------- replicar cambios locales en Firestore ---------- */
let snapshot = new Map(); // id → JSON del registro ya enviado

async function upsert(a) {
  await setDoc(doc(db, COLLECTION, safeId(a.id)), toRemote(a));
}

function onLocalChange(list) {
  if (!Array.isArray(list)) return;
  const next = new Map();
  list.forEach((a) => {
    if (a && a.id !== undefined && !SEED_IDS.has(String(a.id))) next.set(String(a.id), a);
  });
  for (const [id, a] of next) {
    const json = JSON.stringify(a);
    if (snapshot.get(id) !== json) upsert(a).catch(reportError);
  }
  for (const id of snapshot.keys()) {
    if (!next.has(id)) deleteDoc(doc(db, COLLECTION, safeId(id))).catch(reportError);
  }
  snapshot = new Map([...next].map(([id, a]) => [id, JSON.stringify(a)]));
}

Storage.prototype.setItem = function (key, value) {
  origSetItem.apply(this, arguments);
  if (this === window.localStorage && isMariaKey(key)) {
    try { onLocalChange(JSON.parse(value)); } catch { /* valor no válido */ }
  }
};

/* ---------- sincronización completa (solo administrador) ---------- */
async function syncAll() {
  const { key, list } = readLocal();
  const merged = new Map(list.map((a) => [String(a.id), a]));

  // 1) subir lo local
  await Promise.allSettled(
    list.filter((a) => !SEED_IDS.has(String(a.id))).map(upsert)
  );
  // 2) traer todo lo de Firestore
  const snap = await getDocs(collection(db, COLLECTION));
  snap.forEach((d) => {
    const r = d.data();
    merged.set(d.id, {
      ...(merged.get(d.id) || {}),
      id: d.id,
      ticketNumber: r.ticketNumber,
      fullName: r.fullName,
      email: r.email,
      role: r.role,
      organization: r.organization,
      attendanceType: r.attendanceType,
      status: r.status,
    });
  });
  const result = [...merged.values()];
  origSetItem.call(localStorage, key, JSON.stringify(result));
  toast("Sincronizado: " + snap.size + " registros en Firebase. Recargando…");
  setTimeout(() => location.reload(), 900);
}

/* ---------- botón flotante de administrador ---------- */
function buildUI() {
  const box = document.createElement("div");
  box.style.cssText =
    "position:fixed;left:16px;bottom:16px;z-index:40;display:flex;gap:8px;align-items:center;" +
    "font:12px ui-monospace,monospace;";
  const style =
    "padding:8px 12px;border-radius:10px;border:1px solid rgba(248,152,32,.45);" +
    "background:#120d0a;color:#f89820;cursor:pointer;font:inherit;";
  const mk = (txt, fn) => {
    const b = document.createElement("button");
    b.textContent = txt; b.style.cssText = style; b.onclick = fn; return b;
  };
  const wrap = (fn) => async () => {
    try { await fn(); } catch (e) { toast("Error: " + (e.code || e.message)); console.error(e); }
  };

  const loginBtn = mk("☁ Admin Firebase", wrap(() => signInWithPopup(auth, new GoogleAuthProvider())));
  const syncBtn = mk("☁ Sincronizar", wrap(syncAll));
  const outBtn = mk("Salir", wrap(() => signOut(auth)));
  const who = document.createElement("span");
  who.style.color = "#a8998a";

  box.append(loginBtn, syncBtn, outBtn, who);
  document.body.appendChild(box);

  onAuthStateChanged(auth, (user) => {
    loginBtn.style.display = user ? "none" : "";
    syncBtn.style.display = user ? "" : "none";
    outBtn.style.display = user ? "" : "none";
    who.textContent = user ? user.email : "";
  });
}

buildUI();

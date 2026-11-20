/**
 * API MARIAB — manejador HTTP sin dependencias (solo módulos nativos de Node).
 * Recibe la base de datos por inyección (db.query) para poder probarlo sin MariaDB.
 */
import { timingSafeEqual, randomInt } from 'node:crypto';

const ROLES = ['Estudiante UPTC', 'Estudiante Otra Universidad', 'Desarrollador / Ingeniero', 'Docente / Investigador', 'Líder Tech / Empresa'];
const MODES = ['presencial', 'streaming'];
const STATUSES = ['confirmado', 'checkin', 'pendiente', 'cancelado'];
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BODY = 10 * 1024; // 10 KB

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const str = (v) => (typeof v === 'string' ? v.trim() : '');

/** Valida el cuerpo del registro público. Devuelve { error } o { value }. */
export function validateRegistration(b = {}) {
  const nombre = str(b.nombre);
  const correo = str(b.correo).toLowerCase();
  const rol = str(b.rol) || ROLES[0];
  const modalidad = str(b.modalidad) || MODES[0];
  const organizacion = str(b.organizacion) || 'UPTC Tunja';
  if (nombre.length < 3 || nombre.length > 100) return { error: 'El nombre debe tener entre 3 y 100 caracteres.' };
  if (correo.length > 120 || !EMAIL_RE.test(correo)) return { error: 'El correo electrónico no es válido.' };
  if (!ROLES.includes(rol)) return { error: 'Rol no permitido.' };
  if (!MODES.includes(modalidad)) return { error: 'Modalidad no permitida.' };
  if (organizacion.length > 120) return { error: 'La organización supera 120 caracteres.' };
  if (b.consentimiento !== true) return { error: 'Debes autorizar el tratamiento de datos personales.' };
  return { value: { nombre, correo, rol, modalidad, organizacion } };
}

export function createApp({ db, config }) {
  const { allowedOrigins = [], adminToken = '', rateLimit = { max: 10, windowMs: 60_000 }, trustProxy = false } = config;
  const hits = new Map(); // ip -> { count, resetAt }

  const clientIp = (req) => (trustProxy && req.headers['x-forwarded-for']?.split(',')[0].trim()) || req.socket.remoteAddress || 'unknown';

  function limited(ip) {
    const now = Date.now();
    // Limpieza de entradas vencidas para que el mapa no crezca sin límite
    if (hits.size > 1000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    const h = hits.get(ip);
    if (!h || h.resetAt <= now) { hits.set(ip, { count: 1, resetAt: now + rateLimit.windowMs }); return false; }
    h.count += 1;
    return h.count > rateLimit.max;
  }

  function send(res, status, body) {
    if (status === 204) { res.writeHead(204); return res.end(); }
    const json = JSON.stringify(body);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(json) });
    res.end(json);
  }

  async function readJson(req) {
    if (!String(req.headers['content-type'] || '').includes('application/json')) throw new HttpError(415, 'Content-Type debe ser application/json.');
    let size = 0; const chunks = [];
    for await (const c of req) {
      size += c.length;
      if (size > MAX_BODY) throw new HttpError(413, 'Cuerpo demasiado grande.');
      chunks.push(c);
    }
    try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch { throw new HttpError(400, 'JSON inválido.'); }
  }

  function requireAdmin(req) {
    if (adminToken.length < 20) throw new HttpError(503, 'Rutas de administración deshabilitadas (falta ADMIN_TOKEN).');
    const got = Buffer.from((req.headers.authorization || '').replace(/^Bearer /, ''));
    const want = Buffer.from(adminToken);
    if (got.length !== want.length || !timingSafeEqual(got, want)) throw new HttpError(401, 'No autorizado.');
  }

  async function createAttendee(req, res) {
    if (limited(clientIp(req))) throw new HttpError(429, 'Demasiadas solicitudes. Intenta de nuevo en un minuto.');
    const body = await readJson(req);
    if (body._gotcha) return send(res, 201, { ok: true }); // bot: respuesta falsa, no se guarda
    const { error, value: v } = validateRegistration(body);
    if (error) throw new HttpError(400, error);
    for (let i = 0; i < 5; i++) {
      const ticket = `JAI-BOY-2026-${randomInt(1000, 10000)}`;
      try {
        await db.query(
          'INSERT INTO attendees (full_name, email, role, organization, attendance_type, ticket_number) VALUES (?, ?, ?, ?, ?, ?)',
          [v.nombre, v.correo, v.rol, v.organizacion, v.modalidad, ticket]
        );
        return send(res, 201, { ok: true, ticket, estado: 'confirmado' });
      } catch (e) {
        const dup = e.errno === 1062 || e.code === 'ER_DUP_ENTRY';
        if (!dup) throw e;
        if (/ticket/i.test(e.sqlMessage || e.message)) continue; // choque de ticket: reintenta
        throw new HttpError(409, 'Este correo ya está registrado.');
      }
    }
    throw new HttpError(503, 'No se pudo generar un ticket único. Intenta de nuevo.');
  }

  async function listAttendees(url, res) {
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit'), 10) || 50, 1), 200);
    const offset = Math.max(parseInt(url.searchParams.get('offset'), 10) || 0, 0);
    const q = `%${str(url.searchParams.get('q')).slice(0, 60).replace(/[\\%_]/g, '\\$&')}%`;
    const where = 'WHERE full_name LIKE ? OR email LIKE ? OR ticket_number LIKE ?';
    const [{ total }] = await db.query(`SELECT COUNT(*) AS total FROM attendees ${where}`, [q, q, q]);
    const rows = await db.query(
      `SELECT id, ticket_number, full_name, email, role, organization, attendance_type, status, created_at
         FROM attendees ${where}
         ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      [q, q, q]
    );
    send(res, 200, { ok: true, total: Number(total), limit, offset, data: rows });
  }

  async function updateAttendee(req, res, id) {
    const b = await readJson(req);
    const map = { status: ['status', STATUSES], rol: ['role', ROLES], modalidad: ['attendance_type', MODES], organizacion: ['organization'], nombre: ['full_name'], correo: ['email'], notas: ['notes'] };
    const sets = []; const params = [];
    for (const [key, [col, allowed]] of Object.entries(map)) {
      if (b[key] === undefined) continue;
      const val = key === 'correo' ? str(b[key]).toLowerCase() : str(b[key]);
      if (allowed && !allowed.includes(val)) throw new HttpError(400, `Valor no permitido para ${key}.`);
      if (key === 'correo' && !EMAIL_RE.test(val)) throw new HttpError(400, 'Correo inválido.');
      if (key === 'nombre' && val.length < 3) throw new HttpError(400, 'Nombre demasiado corto.');
      sets.push(`${col} = ?`); params.push(val);
    }
    if (!sets.length) throw new HttpError(400, 'No hay campos para actualizar.');
    let r;
    try {
      r = await db.query(`UPDATE attendees SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);
    } catch (e) {
      if (e.errno === 1062 || e.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Este correo ya está registrado.');
      throw e;
    }
    if (!r.affectedRows) throw new HttpError(404, 'Registro no encontrado.');
    send(res, 200, { ok: true });
  }

  async function deleteAttendee(res, id) {
    const r = await db.query('DELETE FROM attendees WHERE id = ?', [id]);
    if (!r.affectedRows) throw new HttpError(404, 'Registro no encontrado.');
    send(res, 200, { ok: true });
  }

  return async function handler(req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    const origin = req.headers.origin;
    const originOk = origin && allowedOrigins.includes(origin);
    if (originOk) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Max-Age', '600');
    }
    try {
      if (req.method === 'OPTIONS') return originOk ? send(res, 204) : send(res, 403, { ok: false, error: 'Origen no permitido.' });
      const url = new URL(req.url, 'http://localhost');
      const path = url.pathname.replace(/\/+$/, '') || '/';

      if (req.method === 'GET' && path === '/api/health') {
        await db.query('SELECT 1');
        return send(res, 200, { ok: true });
      }
      if (req.method === 'POST' && path === '/api/attendees') return await createAttendee(req, res);

      if (path === '/api/attendees' && req.method === 'GET') { requireAdmin(req); return await listAttendees(url, res); }
      const m = path.match(/^\/api\/attendees\/([^/]+)$/);
      if (m && ['PATCH', 'DELETE'].includes(req.method)) {
        requireAdmin(req);
        if (!UUID_RE.test(m[1])) throw new HttpError(400, 'Identificador inválido.');
        return req.method === 'PATCH' ? await updateAttendee(req, res, m[1]) : await deleteAttendee(res, m[1]);
      }
      throw new HttpError(404, 'Ruta no encontrada.');
    } catch (e) {
      if (e instanceof HttpError) return send(res, e.status, { ok: false, error: e.message });
      console.error('[API] Error interno:', e.message);
      send(res, 500, { ok: false, error: 'Error interno del servidor.' });
    }
  };
}

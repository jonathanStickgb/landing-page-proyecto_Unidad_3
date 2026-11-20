import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp, validateRegistration } from '../src/app.js';

// Base de datos falsa en memoria (misma interfaz: db.query)
function fakeDb() {
  const rows = [];
  return {
    rows,
    async query(sql, p = []) {
      if (sql.startsWith('SELECT 1')) return [{ 1: 1 }];
      if (sql.startsWith('INSERT INTO attendees')) {
        if (rows.some((r) => r.email === p[1])) throw Object.assign(new Error("Duplicate entry for key 'uq_attendees_email'"), { errno: 1062 });
        rows.push({ id: '11111111-1111-1111-1111-111111111111', full_name: p[0], email: p[1], ticket_number: p[5], status: 'confirmado' });
        return { affectedRows: 1 };
      }
      if (sql.startsWith('SELECT COUNT(*)')) return [{ total: rows.length }];
      if (sql.includes('FROM attendees')) return rows;
      if (sql.startsWith('UPDATE')) {
        if (this.dupOnUpdate) throw Object.assign(new Error("Duplicate entry for key 'uq_attendees_email'"), { errno: 1062 });
        return { affectedRows: rows.length ? 1 : 0 };
      }
      if (sql.startsWith('DELETE')) return { affectedRows: rows.length ? 1 : 0 };
      throw new Error('SQL inesperado: ' + sql);
    }
  };
}

async function boot(overrides = {}) {
  const db = fakeDb();
  const config = { allowedOrigins: ['https://ok.example'], adminToken: 'a'.repeat(24), rateLimit: { max: 3, windowMs: 60_000 }, ...overrides };
  const server = http.createServer(createApp({ db, config }));
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  return { db, base, close: () => { server.closeAllConnections(); server.close(); } };
}
const post = (base, body, headers = {}) => fetch(base + '/api/attendees', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const valid = { nombre: 'Ana Prueba', correo: 'ana@example.com', rol: 'Estudiante UPTC', modalidad: 'presencial', organizacion: 'UPTC', consentimiento: true };

test('health responde ok', async () => {
  const s = await boot(); const r = await fetch(s.base + '/api/health');
  assert.equal(r.status, 200); s.close();
});
test('registro válido devuelve ticket con formato JAI-BOY-2026-NNNN', async () => {
  const s = await boot(); const r = await post(s.base, valid); const j = await r.json();
  assert.equal(r.status, 201); assert.match(j.ticket, /^JAI-BOY-2026-\d{4}$/); assert.equal(s.db.rows.length, 1); s.close();
});
test('rechaza sin consentimiento, correo inválido y rol inventado', async () => {
  const s = await boot({ rateLimit: { max: 100, windowMs: 60_000 } });
  for (const bad of [{ ...valid, consentimiento: false }, { ...valid, correo: 'x' }, { ...valid, rol: 'Admin' }, { ...valid, nombre: 'Al' }]) {
    assert.equal((await post(s.base, bad)).status, 400);
  }
  assert.equal(s.db.rows.length, 0); s.close();
});
test('correo duplicado devuelve 409', async () => {
  const s = await boot(); await post(s.base, valid);
  assert.equal((await post(s.base, valid)).status, 409); s.close();
});
test('honeypot no guarda nada', async () => {
  const s = await boot(); await post(s.base, { ...valid, _gotcha: 'bot' });
  assert.equal(s.db.rows.length, 0); s.close();
});
test('inyección SQL en nombre se guarda como texto (consulta preparada) o se valida', async () => {
  const s = await boot(); const r = await post(s.base, { ...valid, nombre: "x'); DROP TABLE attendees;--" });
  assert.equal(r.status, 201); assert.equal(s.db.rows[0].full_name, "x'); DROP TABLE attendees;--"); s.close();
});
test('rate limit: la 4.ª solicitud devuelve 429', async () => {
  const s = await boot(); let last;
  for (let i = 0; i < 4; i++) last = await post(s.base, { ...valid, correo: `u${i}@example.com` });
  assert.equal(last.status, 429); s.close();
});
test('rutas admin exigen token', async () => {
  const s = await boot();
  assert.equal((await fetch(s.base + '/api/attendees')).status, 401);
  assert.equal((await fetch(s.base + '/api/attendees', { headers: { Authorization: 'Bearer ' + 'b'.repeat(24) } })).status, 401);
  assert.equal((await fetch(s.base + '/api/attendees', { headers: { Authorization: 'Bearer ' + 'a'.repeat(24) } })).status, 200);
  s.close();
});
test('admin deshabilitado si no hay ADMIN_TOKEN', async () => {
  const s = await boot({ adminToken: '' });
  assert.equal((await fetch(s.base + '/api/attendees')).status, 503); s.close();
});
test('PATCH valida estado y uuid', async () => {
  const s = await boot(); await post(s.base, valid);
  const h = { Authorization: 'Bearer ' + 'a'.repeat(24), 'Content-Type': 'application/json' };
  const id = '11111111-1111-1111-1111-111111111111';
  assert.equal((await fetch(`${s.base}/api/attendees/${id}`, { method: 'PATCH', headers: h, body: JSON.stringify({ status: 'checkin' }) })).status, 200);
  assert.equal((await fetch(`${s.base}/api/attendees/${id}`, { method: 'PATCH', headers: h, body: JSON.stringify({ status: 'hack' }) })).status, 400);
  assert.equal((await fetch(`${s.base}/api/attendees/no-uuid`, { method: 'DELETE', headers: h })).status, 400); s.close();
});
test('PATCH con correo duplicado devuelve 409 y normaliza a minúsculas', async () => {
  const s = await boot(); await post(s.base, valid);
  const h = { Authorization: 'Bearer ' + 'a'.repeat(24), 'Content-Type': 'application/json' };
  const url = `${s.base}/api/attendees/11111111-1111-1111-1111-111111111111`;
  s.db.dupOnUpdate = true;
  assert.equal((await fetch(url, { method: 'PATCH', headers: h, body: JSON.stringify({ correo: 'Otro@Example.com' }) })).status, 409);
  s.close();
});
test('GET listado devuelve el total real, limit y offset', async () => {
  const s = await boot(); await post(s.base, valid);
  const r = await fetch(s.base + '/api/attendees?limit=1&offset=0', { headers: { Authorization: 'Bearer ' + 'a'.repeat(24) } });
  const j = await r.json();
  assert.equal(r.status, 200); assert.equal(j.total, 1); assert.equal(j.limit, 1); assert.equal(j.offset, 0); s.close();
});
test('CORS: permite el origen configurado y bloquea otros en preflight', async () => {
  const s = await boot();
  const ok = await fetch(s.base + '/api/attendees', { method: 'OPTIONS', headers: { Origin: 'https://ok.example' } });
  assert.equal(ok.status, 204); assert.equal(ok.headers.get('access-control-allow-origin'), 'https://ok.example');
  const no = await fetch(s.base + '/api/attendees', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } });
  assert.equal(no.status, 403); s.close();
});
test('rechaza Content-Type incorrecto y cuerpo gigante', async () => {
  const s = await boot();
  assert.equal((await fetch(s.base + '/api/attendees', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'x' })).status, 415);
  assert.equal((await post(s.base, { ...valid, nombre: 'a'.repeat(20000) })).status, 413); s.close();
});
test('validateRegistration normaliza el correo a minúsculas', () => {
  assert.equal(validateRegistration({ ...valid, correo: 'ANA@Example.com' }).value.correo, 'ana@example.com');
});

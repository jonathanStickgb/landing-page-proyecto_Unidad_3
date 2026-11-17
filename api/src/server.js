import http from 'node:http';
import { createApp } from './app.js';
import { createDb } from './db.js';

const env = process.env;
const config = {
  allowedOrigins: (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
  adminToken: env.ADMIN_TOKEN || '',
  trustProxy: env.TRUST_PROXY === 'true'
};
if (config.adminToken.length < 20) console.warn('[API] ADMIN_TOKEN ausente o corto: las rutas de administración quedan deshabilitadas.');

const db = createDb(env);
const port = Number(env.PORT || 3000);
http.createServer(createApp({ db, config })).listen(port, () => console.log(`[API] MARIAB escuchando en http://localhost:${port}`));

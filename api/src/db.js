/** Conexión a MariaDB/MySQL con mysql2 (consultas preparadas). */
import mysql from 'mysql2/promise';

export function createDb(env = process.env) {
  const pool = mysql.createPool({
    host: env.DB_HOST || '127.0.0.1',
    port: Number(env.DB_PORT || 3306),
    user: env.DB_USER || 'mariab_api',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'mariab',
    charset: 'utf8mb4',
    connectionLimit: 5,
    waitForConnections: true
  });
  return { query: async (sql, params = []) => (await pool.execute(sql, params))[0], close: () => pool.end() };
}

# API MARIAB (Node.js + MariaDB)

API REST mínima que recibe los registros de la landing y los guarda en MariaDB (`docs/db/schema_MARIAB.sql`).
Sin frameworks: solo módulos nativos de Node y el conector `mysql2` (versión fija).

## Requisitos
Node.js 22.9 o superior y una base `mariab` creada con el esquema.

## Puesta en marcha
```bash
# 1. Base de datos y usuario con permisos mínimos
mariadb -uroot -p < docs/db/schema_MARIAB.sql
#    edita la clave en docs/db/create_api_user.sql y ejecútalo:
mariadb -uroot -p < docs/db/create_api_user.sql

# 2. API
cd api
cp .env.example .env        # completa DB_PASSWORD y ADMIN_TOKEN
npm install
npm test                    # 13 pruebas (no requieren base de datos)
npm start                   # http://localhost:3000
```

## Endpoints
| Método y ruta | Acceso | Descripción |
|---|---|---|
| `GET /api/health` | Público | Verifica la conexión con la base |
| `POST /api/attendees` | Público (10 por minuto por IP) | Registra un asistente; devuelve `{ ticket }` |
| `GET /api/attendees?q=&limit=&offset=` | `Authorization: Bearer <ADMIN_TOKEN>` | Lista y busca |
| `PATCH /api/attendees/:id` | Bearer | Actualiza `status`, `rol`, `modalidad`, `organizacion`, `nombre`, `correo`, `notas` |
| `DELETE /api/attendees/:id` | Bearer | Elimina un registro |

Cuerpo de `POST /api/attendees` (JSON):
```json
{ "nombre": "Ana Prueba", "correo": "ana@correo.com", "rol": "Estudiante UPTC",
  "modalidad": "presencial", "organizacion": "UPTC Tunja", "consentimiento": true }
```
Errores: `400` validación, `409` correo repetido, `415` tipo de contenido, `413` cuerpo grande, `429` límite de solicitudes, `401/503` administración.

## Seguridad incluida
Consultas preparadas (sin SQL concatenado), validación con listas cerradas, CORS solo para `ALLOWED_ORIGINS`, límite de tamaño y de solicitudes, comparación del token en tiempo constante, usuario de BD sin permisos de DDL, honeypot anti-bots y mensajes de error genéricos.

## Conectar la landing
1. Publica la API con **HTTPS** (GitHub Pages es HTTPS; el navegador bloquea llamadas a HTTP). Opciones: Render, Railway o un VPS con Nginx. La base debe ser accesible desde ese servidor.
2. En `.env` del servidor: `ALLOWED_ORIGINS=https://jonathanstickgb.github.io`.
3. En `script.js` (módulo `LPForm`) escribe la URL en `API_URL`.

El panel de administración de la página sigue siendo una demo local: **no pongas el token de administrador en el navegador**. Usa los endpoints `GET/PATCH/DELETE` con Postman o `curl`.

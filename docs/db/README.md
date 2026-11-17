# Base de datos MARIAB (referencia)

Esquemas de apoyo del proyecto. **No se conectan a la landing page**: GitHub Pages solo sirve archivos estáticos.

| Archivo | Motor | Uso |
|---|---|---|
| `schema_MARIAB.sql` | PostgreSQL 16 | Esquema completo con triggers de auditoría |
| `schema_MARIAB_mariadb.sql` | MariaDB/MySQL (XAMPP) | Misma estructura; importar desde phpMyAdmin |
| `setup_manual_mariab.sh` | PostgreSQL (Docker o `psql`) | `export DB_PASS=...` y luego `bash setup_manual_mariab.sh` |

## Cómo persiste datos la landing page hoy
- **Borrador del formulario:** `localStorage`, claves `lp_jai2026_*` (se borra al enviar).
- **Usuario convertido:** `lp_jai2026_convertido`.
- **Recepción del registro:** servicio externo Formspree (POST).
- **Panel de demostración:** `MARIAB_DB_ATTENDEES_2026` en `localStorage`, solo visible en el navegador de quien lo usa.

Para conectar una base real haría falta un backend (API) entre la página y el motor SQL.

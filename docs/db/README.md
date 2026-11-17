# Base de datos MARIAB (MariaDB, referencia)

Esquema de apoyo del proyecto. **No se conecta a la landing page**: GitHub Pages solo sirve archivos estáticos.

| Archivo | Uso |
|---|---|
| `schema_MARIAB.sql` | Esquema MariaDB 10.5+ / XAMPP: tabla `attendees`, auditoría con triggers y datos semilla ficticios |
| `create_api_user.sql` | Crea el usuario `mariab_api` con permisos mínimos para la API |
| `setup_manual_mariab.sh` | Crea la base con Docker (`mariadb:11`) o con el cliente `mariadb`/`mysql` local |

## Cómo crearla
```bash
export DB_PASS="tu_clave_segura"
bash docs/db/setup_manual_mariab.sh
```
O en XAMPP: phpMyAdmin → Importar → `schema_MARIAB.sql`.

## Cómo persiste datos la landing page hoy
- **Borrador del formulario:** `localStorage`, claves `lp_jai2026_*` (se borra al enviar).
- **Usuario convertido:** `lp_jai2026_convertido`.
- **Recepción del registro:** servicio externo Formspree (POST).
- **Panel de demostración:** `MARIAB_DB_ATTENDEES_2026` en `localStorage`, visible solo en ese navegador.

Para conectar esta base con la página se usa la API de la carpeta `api/` (ver `api/README.md`).

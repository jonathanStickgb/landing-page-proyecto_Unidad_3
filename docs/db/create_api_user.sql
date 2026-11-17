-- Usuario de BD con permisos mínimos para la API (no usa root).
-- Ejecutar como root DESPUÉS de schema_MARIAB.sql y cambiando la clave:
--   mariadb -uroot -p < docs/db/create_api_user.sql
CREATE USER IF NOT EXISTS 'mariab_api'@'localhost' IDENTIFIED BY 'CAMBIA_ESTA_CLAVE';
GRANT SELECT, INSERT, UPDATE, DELETE ON mariab.attendees TO 'mariab_api'@'localhost';
-- Los triggers de auditoría escriben en attendee_audit_log con los permisos de su definer (root).
FLUSH PRIVILEGES;

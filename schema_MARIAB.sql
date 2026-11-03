-- =====================================================================
-- JAVA & AI DAY BOYACÁ 2026 - BASE DE DATOS: MARIAB
-- Sede: Auditorio Paraninfo San Jerónimo · UPTC Tunja
-- Fechas Oficiales: 4 y 5 de Diciembre, 2026
-- Proyecto Unidad 3 UPTC: María Medina, Natalia Cruz, Jonathan Stick GB
-- =====================================================================
-- INSTRUCCIONES DE EJECUCIÓN MANUAL:
--
-- Opción A: Vía psql con PostgreSQL local instalado:
--   psql -U postgres -c "CREATE DATABASE \"MARIAB\";"
--   psql -U postgres -d MARIAB -f schema_MARIAB.sql
--
-- Opción B: Vía Docker (un solo comando):
--   docker run --name postgres-mariab -e POSTGRES_DB=MARIAB -e POSTGRES_USER=mariab_admin -e POSTGRES_PASSWORD=mariab_tech_2026 -p 5432:5432 -d postgres:16-alpine
--   docker exec -i postgres-mariab psql -U mariab_admin -d MARIAB < schema_MARIAB.sql
-- =====================================================================

-- 1. Habilitar extensión para identificadores universales (UUIDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Limpieza preventiva controlada
DROP TABLE IF EXISTS attendee_audit_log CASCADE;
DROP TABLE IF EXISTS attendees CASCADE;
DROP TYPE IF EXISTS attendee_role CASCADE;
DROP TYPE IF EXISTS attendance_type CASCADE;
DROP TYPE IF EXISTS primary_track CASCADE;
DROP TYPE IF EXISTS attendee_status CASCADE;

-- 3. Tipos enumerados estrictos para integridad de dominio
CREATE TYPE attendee_role AS ENUM (
    'Estudiante UPTC',
    'Estudiante Otra Universidad',
    'Desarrollador / Ingeniero',
    'Docente / Investigador',
    'Líder Tech / Empresa'
);

CREATE TYPE attendance_type AS ENUM (
    'presencial',
    'streaming'
);

CREATE TYPE primary_track AS ENUM (
    'Ambos (Java + IA)',
    'Core Java & Loom',
    'IA Generativa & LangChain4j'
);

CREATE TYPE attendee_status AS ENUM (
    'confirmado',
    'checkin',
    'pendiente',
    'cancelado'
);

-- 4. Tabla principal de Asistentes y Acreditaciones (Base de Datos MARIAB)
CREATE TABLE attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL CHECK (char_length(trim(full_name)) >= 3),
    email VARCHAR(120) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    role attendee_role NOT NULL DEFAULT 'Estudiante UPTC',
    organization VARCHAR(120) NOT NULL DEFAULT 'UPTC',
    attendance_type attendance_type NOT NULL DEFAULT 'presencial',
    primary_track primary_track NOT NULL DEFAULT 'Ambos (Java + IA)',
    ticket_number VARCHAR(64) NOT NULL UNIQUE CHECK (ticket_number ~ '^JAI-BOY-2026-[0-9]{4}$'),
    status attendee_status NOT NULL DEFAULT 'confirmado',
    notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
    user_id VARCHAR(128) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Índices de alto rendimiento para el control de acceso en Diciembre 2026
CREATE INDEX idx_attendees_email ON attendees(email);
CREATE INDEX idx_attendees_ticket ON attendees(ticket_number);
CREATE INDEX idx_attendees_status ON attendees(status);
CREATE INDEX idx_attendees_created_at ON attendees(created_at DESC);

-- 6. Trigger para actualización automática del campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_attendees_updated_at
BEFORE UPDATE ON attendees
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 7. Tabla de Auditoría de Cambios (Audit Trail en BD MARIAB)
CREATE TABLE attendee_audit_log (
    audit_id SERIAL PRIMARY KEY,
    attendee_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    changed_by VARCHAR(120) DEFAULT CURRENT_USER,
    old_data JSONB,
    new_data JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION audit_attendee_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO attendee_audit_log (attendee_id, action, new_data)
        VALUES (NEW.id, 'INSERT', to_jsonb(NEW));
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO attendee_audit_log (attendee_id, action, old_data, new_data)
        VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO attendee_audit_log (attendee_id, action, old_data)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_attendees
AFTER INSERT OR UPDATE OR DELETE ON attendees
FOR EACH ROW EXECUTE FUNCTION audit_attendee_changes();

-- 8. Seguridad a nivel de fila (Row Level Security - RLS)
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_read_attendees ON attendees
    FOR SELECT
    USING (true);

CREATE POLICY policy_insert_attendees ON attendees
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY policy_update_attendees ON attendees
    FOR UPDATE
    USING (true);

-- 9. Datos Semilla Oficiales - 4 y 5 de Diciembre 2026 (UPTC Tunja)
INSERT INTO attendees (full_name, email, role, organization, attendance_type, primary_track, ticket_number, status, notes)
VALUES
    ('Ing. Julián Camilo Vargas', 'julian.vargas@uptc.edu.co', 'Desarrollador / Ingeniero', 'UPTC - Grupo SInC', 'presencial', 'Ambos (Java + IA)', 'JAI-BOY-2026-1042', 'confirmado', 'Participante del track de Inteligencia Artificial.'),
    ('Laura Marcela Pinzón', 'laura.pinzon@tunja-tech.org', 'Estudiante UPTC', 'Escuela de Sistemas UPTC', 'presencial', 'Core Java & Loom', 'JAI-BOY-2026-1088', 'checkin', 'Acreditación presencial verificada en Paraninfo San Jerónimo.'),
    ('David Esteban Roa', 'david.roa@boyacadevs.org', 'Líder Tech / Empresa', 'Boyacá Devs / Sogamoso Lab', 'presencial', 'IA Generativa & LangChain4j', 'JAI-BOY-2026-1120', 'confirmado', 'Coordinador del track de innovación abierta.'),
    ('Dra. María Elena Castañeda', 'maria.castaneda@uptc.edu.co', 'Docente / Investigador', 'Facultad de Ingeniería UPTC', 'presencial', 'Ambos (Java + IA)', 'JAI-BOY-2026-1155', 'confirmado', 'Docente titular en Sistemas Distribuidos.');

-- 10. Consulta de Verificación
SELECT id, full_name, role, ticket_number, status, created_at FROM attendees;

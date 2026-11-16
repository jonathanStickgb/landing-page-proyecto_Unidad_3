-- =====================================================================
-- JAVA & AI DAY BOYACÁ 2026 - BASE DE DATOS: MARIAB (versión MariaDB/MySQL para XAMPP)
-- Adaptada desde la versión PostgreSQL. Importar desde phpMyAdmin > Importar.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS mariab
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE mariab;

-- Limpieza preventiva
DROP TRIGGER IF EXISTS trg_audit_attendees_insert;
DROP TRIGGER IF EXISTS trg_audit_attendees_update;
DROP TRIGGER IF EXISTS trg_audit_attendees_delete;
DROP TABLE IF EXISTS attendee_audit_log;
DROP TABLE IF EXISTS attendees;

-- Tabla principal de asistentes (los ENUM de PostgreSQL pasan a ser ENUM de columna)
CREATE TABLE attendees (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    role ENUM(
        'Estudiante UPTC',
        'Estudiante Otra Universidad',
        'Desarrollador / Ingeniero',
        'Docente / Investigador',
        'Líder Tech / Empresa'
    ) NOT NULL DEFAULT 'Estudiante UPTC',
    organization VARCHAR(120) NOT NULL DEFAULT 'UPTC',
    attendance_type ENUM('presencial', 'streaming') NOT NULL DEFAULT 'presencial',
    primary_track ENUM(
        'Ambos (Java + IA)',
        'Core Java & Loom',
        'IA Generativa & LangChain4j'
    ) NOT NULL DEFAULT 'Ambos (Java + IA)',
    ticket_number VARCHAR(64) NOT NULL,
    status ENUM('confirmado', 'checkin', 'pendiente', 'cancelado') NOT NULL DEFAULT 'confirmado',
    notes TEXT NULL,
    user_id VARCHAR(128) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_attendees_ticket (ticket_number),
    CONSTRAINT chk_full_name CHECK (CHAR_LENGTH(TRIM(full_name)) >= 3),
    CONSTRAINT chk_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_ticket CHECK (ticket_number REGEXP '^JAI-BOY-2026-[0-9]{4}$'),
    CONSTRAINT chk_notes CHECK (notes IS NULL OR CHAR_LENGTH(notes) <= 500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Índices
CREATE INDEX idx_attendees_email ON attendees(email);
CREATE INDEX idx_attendees_status ON attendees(status);
CREATE INDEX idx_attendees_created_at ON attendees(created_at);

-- Tabla de auditoría
CREATE TABLE attendee_audit_log (
    audit_id INT NOT NULL AUTO_INCREMENT,
    attendee_id CHAR(36) NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by VARCHAR(120) NOT NULL DEFAULT '',
    old_data LONGTEXT NULL,
    new_data LONGTEXT NULL,
    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (audit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Triggers de auditoría (MariaDB necesita uno por evento)
DELIMITER $$

CREATE TRIGGER trg_audit_attendees_insert
AFTER INSERT ON attendees
FOR EACH ROW
BEGIN
    INSERT INTO attendee_audit_log (attendee_id, action, changed_by, new_data)
    VALUES (NEW.id, 'INSERT', CURRENT_USER(),
        JSON_OBJECT('id', NEW.id, 'full_name', NEW.full_name, 'email', NEW.email,
                    'role', NEW.role, 'organization', NEW.organization,
                    'attendance_type', NEW.attendance_type, 'primary_track', NEW.primary_track,
                    'ticket_number', NEW.ticket_number, 'status', NEW.status, 'notes', NEW.notes));
END$$

CREATE TRIGGER trg_audit_attendees_update
AFTER UPDATE ON attendees
FOR EACH ROW
BEGIN
    INSERT INTO attendee_audit_log (attendee_id, action, changed_by, old_data, new_data)
    VALUES (NEW.id, 'UPDATE', CURRENT_USER(),
        JSON_OBJECT('id', OLD.id, 'full_name', OLD.full_name, 'email', OLD.email,
                    'role', OLD.role, 'organization', OLD.organization,
                    'attendance_type', OLD.attendance_type, 'primary_track', OLD.primary_track,
                    'ticket_number', OLD.ticket_number, 'status', OLD.status, 'notes', OLD.notes),
        JSON_OBJECT('id', NEW.id, 'full_name', NEW.full_name, 'email', NEW.email,
                    'role', NEW.role, 'organization', NEW.organization,
                    'attendance_type', NEW.attendance_type, 'primary_track', NEW.primary_track,
                    'ticket_number', NEW.ticket_number, 'status', NEW.status, 'notes', NEW.notes));
END$$

CREATE TRIGGER trg_audit_attendees_delete
AFTER DELETE ON attendees
FOR EACH ROW
BEGIN
    INSERT INTO attendee_audit_log (attendee_id, action, changed_by, old_data)
    VALUES (OLD.id, 'DELETE', CURRENT_USER(),
        JSON_OBJECT('id', OLD.id, 'full_name', OLD.full_name, 'email', OLD.email,
                    'role', OLD.role, 'organization', OLD.organization,
                    'attendance_type', OLD.attendance_type, 'primary_track', OLD.primary_track,
                    'ticket_number', OLD.ticket_number, 'status', OLD.status, 'notes', OLD.notes));
END$$

DELIMITER ;

-- Nota: Row Level Security (RLS) no existe en MariaDB; el control de acceso
-- (solo el administrador edita/elimina) se hará en la capa PHP o con usuarios de BD.

-- Datos semilla
INSERT INTO attendees (full_name, email, role, organization, attendance_type, primary_track, ticket_number, status, notes)
VALUES
    ('Ing. Julián Camilo Vargas', 'julian.vargas@uptc.edu.co', 'Desarrollador / Ingeniero', 'UPTC - Grupo SInC', 'presencial', 'Ambos (Java + IA)', 'JAI-BOY-2026-1042', 'confirmado', 'Participante del track de Inteligencia Artificial.'),
    ('Laura Marcela Pinzón', 'laura.pinzon@tunja-tech.org', 'Estudiante UPTC', 'Escuela de Sistemas UPTC', 'presencial', 'Core Java & Loom', 'JAI-BOY-2026-1088', 'checkin', 'Acreditación presencial verificada en Paraninfo San Jerónimo.'),
    ('David Esteban Roa', 'david.roa@boyacadevs.org', 'Líder Tech / Empresa', 'Boyacá Devs / Sogamoso Lab', 'presencial', 'IA Generativa & LangChain4j', 'JAI-BOY-2026-1120', 'confirmado', 'Coordinador del track de innovación abierta.'),
    ('Dra. María Elena Castañeda', 'maria.castaneda@uptc.edu.co', 'Docente / Investigador', 'Facultad de Ingeniería UPTC', 'presencial', 'Ambos (Java + IA)', 'JAI-BOY-2026-1155', 'confirmado', 'Docente titular en Sistemas Distribuidos.');

-- Verificación
SELECT id, full_name, role, ticket_number, status, created_at FROM attendees;

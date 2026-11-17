#!/usr/bin/env bash
# =====================================================================
# SCRIPT DE GENERACIÓN MANUAL - BASE DE DATOS MARIAB (MariaDB)
# Evento: Java & AI Day Boyacá 2026 (4 y 5 de Diciembre, 2026)
# Proyecto Unidad 3 UPTC: María Medina, Natalia Cruz, Jonathan Stick GB
#
# Uso:  export DB_PASS="tu_clave_segura"  &&  bash setup_manual_mariab.sh
# Con Docker crea un contenedor mariadb:11; sin Docker usa el cliente
# "mariadb"/"mysql" del sistema (por ejemplo, el de XAMPP) con el usuario root.
# =====================================================================

set -e
cd "$(dirname "$0")"

DB_NAME="mariab"
DB_PASS="${DB_PASS:?Define DB_PASS antes de ejecutar: export DB_PASS=tu_clave_segura}"
DB_PORT="${DB_PORT:-3306}"
CONTAINER_NAME="mariadb-mariab"
SQL_FILE="schema_MARIAB.sql"

echo "=========================================================="
echo " Generación de la base de datos: ${DB_NAME} (MariaDB)"
echo " Java & AI Day Boyacá 2026 · UPTC Tunja"
echo "=========================================================="

if command -v docker >/dev/null 2>&1; then
    echo "[1/3] Docker detectado. Verificando contenedor existente..."
    if [ "$(docker ps -aq -f name=^${CONTAINER_NAME}$)" ]; then
        echo "      Iniciando contenedor existente ${CONTAINER_NAME}..."
        docker start "${CONTAINER_NAME}" >/dev/null || true
    else
        echo "      Creando contenedor ${CONTAINER_NAME} con MariaDB 11..."
        docker run --name "${CONTAINER_NAME}" \
          -e MARIADB_ROOT_PASSWORD="${DB_PASS}" \
          -p "${DB_PORT}:3306" -d mariadb:11 >/dev/null
    fi

    echo "      Esperando a que MariaDB acepte conexiones..."
    for _ in $(seq 1 30); do
        docker exec -e MYSQL_PWD="${DB_PASS}" "${CONTAINER_NAME}" mariadb -uroot -e "SELECT 1" >/dev/null 2>&1 && break
        sleep 2
    done

    echo "[2/3] Aplicando ${SQL_FILE}..."
    docker exec -i -e MYSQL_PWD="${DB_PASS}" "${CONTAINER_NAME}" mariadb -uroot < "${SQL_FILE}"

    echo "[3/3] Verificando registros insertados:"
    docker exec -i -e MYSQL_PWD="${DB_PASS}" "${CONTAINER_NAME}" mariadb -uroot -D "${DB_NAME}" \
      -e "SELECT ticket_number, full_name, role, status FROM attendees;"
    echo ""
    echo "¡Base de datos ${DB_NAME} generada con éxito!"
    echo "Conexión JDBC: jdbc:mariadb://localhost:${DB_PORT}/${DB_NAME}  (usuario: root)"
else
    CLIENT=""
    for c in mariadb mysql; do command -v "$c" >/dev/null 2>&1 && CLIENT="$c" && break; done
    if [ -z "$CLIENT" ]; then
        echo "ERROR: No se detectó Docker ni el cliente mariadb/mysql en el PATH."
        echo "Importa ${SQL_FILE} desde phpMyAdmin (XAMPP) o desde DBeaver."
        exit 1
    fi
    echo "[1/2] Cliente ${CLIENT} detectado. Ejecutando ${SQL_FILE}..."
    MYSQL_PWD="${DB_PASS}" "$CLIENT" -uroot < "${SQL_FILE}"
    echo "[2/2] Verificando registros:"
    MYSQL_PWD="${DB_PASS}" "$CLIENT" -uroot -D "${DB_NAME}" -e "SELECT ticket_number, full_name, role, status FROM attendees;"
    echo "¡Base de datos ${DB_NAME} generada con éxito!"
fi

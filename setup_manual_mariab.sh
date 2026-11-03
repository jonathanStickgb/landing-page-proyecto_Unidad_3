#!/usr/bin/env bash
# =====================================================================
# SCRIPT DE GENERACIÓN MANUAL - BASE DE DATOS MARIAB
# Evento: Java & AI Day Boyacá 2026 (4 y 5 de Diciembre, 2026)
# Proyecto Unidad 3 UPTC: María Medina, Natalia Cruz, Jonathan Stick GB
# =====================================================================

set -e

DB_NAME="MARIAB"
DB_USER="mariab_admin"
DB_PASS="mariab_tech_2026"
DB_PORT="5432"
CONTAINER_NAME="postgres-mariab"
SQL_FILE="schema_MARIAB.sql"

echo "=========================================================="
echo " Invocando Generación Manual de Base de Datos: ${DB_NAME}"
echo " Java & AI Day Boyacá 2026 · UPTC Tunja"
echo "=========================================================="

if command -v docker >/dev/null 2>&1; then
    echo "[1/3] Docker detectado. Verificando contenedor existente..."
    if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
        echo "      Reiniciando contenedor existente ${CONTAINER_NAME}..."
        docker start ${CONTAINER_NAME} || true
    else
        echo "      Creando nuevo contenedor ${CONTAINER_NAME} con PostgreSQL 16..."
        docker run --name ${CONTAINER_NAME} \
          -e POSTGRES_DB=${DB_NAME} \
          -e POSTGRES_USER=${DB_USER} \
          -e POSTGRES_PASSWORD=${DB_PASS} \
          -p ${DB_PORT}:5432 -d postgres:16-alpine
        echo "      Esperando 4 segundos a que PostgreSQL inicialice..."
        sleep 4
    fi

    echo "[2/3] Aplicando DDL ${SQL_FILE} sobre ${DB_NAME}..."
    docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} < "${SQL_FILE}"

    echo "[3/3] Verificando registros insertados:"
    docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT ticket_number, full_name, role, status FROM attendees;"

    echo ""
    echo "¡Base de datos ${DB_NAME} generada con éxito!"
    echo "URL de Conexión JDBC: jdbc:postgresql://localhost:5432/${DB_NAME}"
    echo "Usuario: ${DB_USER}  |  Contraseña: ${DB_PASS}"
elif command -v psql >/dev/null 2>&1; then
    echo "[1/2] psql detectado en el sistema anfitrión. Creando base de datos ${DB_NAME}..."
    psql -U postgres -c "CREATE DATABASE \"${DB_NAME}\";" || echo "La base de datos ya existía."
    echo "[2/2] Ejecutando ${SQL_FILE}..."
    psql -U postgres -d "${DB_NAME}" -f "${SQL_FILE}"
    echo "¡Base de datos ${DB_NAME} generada manualmente con éxito!"
else
    echo "ERROR: No se detectó ni Docker ni psql en el PATH."
    echo "Por favor instale PostgreSQL o Docker para ejecutar este script automáticamente,"
    echo "o ejecute manualmente el contenido de schema_MARIAB.sql en su cliente SQL (DBeaver, pgAdmin, DataGrip)."
    exit 1
fi

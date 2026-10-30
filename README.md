# Java & AI Day Boyacá 2026 — Proyecto Unidad 3 (UPTC)

> **Repositorio Oficial:** `jonathanStickgb/landing-page-proyecto_Unidad_3`  
> **Rama Principal:** `main`  
> **Institución:** Universidad Pedagógica y Tecnológica de Colombia (UPTC) — Sede Central Tunja  
> **Facultad:** Facultad de Ingeniería  
> **Escuela:** Escuela de Ingeniería de Sistemas y Computación  
> **Evento:** Java & AI Day Boyacá 2026  
> **Fechas Oficiales:** 4 y 5 de Diciembre, 2026  
> **Lugar:** Auditorio Paraninfo San Jerónimo, Tunja, Boyacá  

---

## 👥 Equipo de Desarrollo y Roles (Git Flow)

| Desarrollador / Estudiante | Usuario GitHub | Rol Principal & Responsabilidades |
| :--- | :--- | :--- |
| **María Medina** | [`@mariamedina-cmd`](https://github.com/mariamedina-cmd) | **Arquitectura HTML, Accesibilidad (WCAG AA) & SEO**: Maquetación semántica, metaetiquetas Open Graph, contraste visual y estructura base. |
| **Natalia Cruz** | [`@nataliacruzmoreno`](https://github.com/nataliacruzmoreno) | **Interactividad JS, Animaciones & Estilos**: API `IntersectionObserver` (`.reveal-card`, `.revealed`), sistema de variables CSS y diseño responsive. |
| **Jonathan Stick Fuentes** | [`@jonathanStickgb`](https://github.com/jonathanStickgb) | **DevOps, Despliegue & Git Flow**: Administración del repositorio, flujo de ramas (*Feature Branch Workflow*), metodología Kanban y GitHub Pages. |

---

## 🚀 Características del Proyecto

1. **Paleta Temática Java & IA (Dark Theme Espresso)**:
   - Fondo oscuro café tostado `#0a0705` y `#120d0a`.
   - Acentos Java naranja `#f89820` y verde neón IA `#00e676`.
   - Malla sutil decorativa estilo IDE/código.
2. **Animaciones Reveal-on-Scroll**:
   - Tarjetas de ponentes animadas dinámicamente mediante la API nativa de JavaScript `IntersectionObserver` (sin dependencias externas pesadas).
3. **Sección "Organizan y Apoyan"**:
   - Tarjetas con bordes segmentados (*dashed*) dorados sobre fondo espresso/crema tenue, destacando la UPTC, Boyacá Devs y JUG Colombia.
4. **Base de Datos Independiente `MARIAB`**:
   - Persistencia local en el navegador mediante `localStorage` con soporte CRUD para acreditar participantes presenciales (Paraninfo) y virtuales.
   - Script SQL standalone (`schema_MARIAB.sql`) compatible con PostgreSQL / MariaDB para despliegue en servidor.
5. **Generación Manual**:
   - Totalmente ejecutable de manera local haciendo doble clic en `index.html` o levantando un servidor estático.

---

## 📂 Estructura de la Carpeta

```text
github_repo_ready/
├── index.html              # Documento HTML5 semántico accesible
├── styles.css              # Hojas de estilo con tokens CSS y animaciones
├── script.js               # Lógica interactiva, IntersectionObserver y BD MARIAB
├── schema_MARIAB.sql       # Script DDL de PostgreSQL con RLS y datos de prueba
├── setup_manual_mariab.sh  # Script bash automatizado para Docker / psql
├── README.md               # Esta documentación técnica
├── .gitignore              # Configuración de exclusión de Git
└── LICENSE                 # Licencia MIT de código abierto
```

---

## 🛠️ Cómo Ejecutar este Proyecto

### 1. Ejecución Frontend Inmediata
Simplemente abre el archivo `index.html` en tu navegador web favorito (Google Chrome, Firefox, Edge, Safari). No requiere `node_modules` ni instalación previa.

O usando un servidor local rápido:
```bash
# Con Python 3
python -m http.server 8080

# Con npx serve
npx serve .
```

### 2. Generación Manual de la Base de Datos MARIAB
Puedes crear la base de datos PostgreSQL localmente en 1 segundo usando Docker:

```bash
# 1. Levantar contenedor con base de datos MARIAB
docker run --name postgres-mariab \
  -e POSTGRES_DB=MARIAB \
  -e POSTGRES_USER=mariab_admin \
  -e POSTGRES_PASSWORD=mariab_tech_2026 \
  -p 5432:5432 -d postgres:16-alpine

# 2. Ejecutar el script DDL
docker exec -i postgres-mariab psql -U mariab_admin -d MARIAB < schema_MARIAB.sql
```

O si tienes `psql` instalado en tu máquina:
```bash
psql -U postgres -c "CREATE DATABASE \"MARIAB\";"
psql -U postgres -d MARIAB -f schema_MARIAB.sql
```

---

## 🌐 Despliegue en GitHub Pages

1. Sube estos archivos a la rama `main` de tu repositorio:
   ```bash
   git add .
   git commit -m "feat: landing page final Java & AI Day Boyacá 2026 con BD MARIAB"
   git push origin main
   ```
2. En GitHub, ve a **Settings** > **Pages**.
3. En **Source**, selecciona `Deploy from a branch` y escoge la rama `main` (carpeta `/root`).
4. Guarda los cambios. Tu sitio estará disponible en:  
   `https://jonathanstickgb.github.io/landing-page-proyecto_Unidad_3/`

---

## 📜 Licencia
Este proyecto fue desarrollado con fines educativos y comunitarios bajo la licencia MIT. © 2026 Universidad Pedagógica y Tecnológica de Colombia (UPTC).

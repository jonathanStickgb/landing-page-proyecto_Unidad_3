# Landing Page - Proyecto Unidad 3 (UPTC)
## Java & AI Day Boyacá 2026

![GitHub Pages Status](https://img.shields.io/badge/GitHub%20Pages-Active-success?style=flat-square&logo=github)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

> *Repositorio:* jonathanStickgb/landing-page-proyecto_Unidad_3
> *Rama principal:* main
> *Institución:* Universidad Pedagógica y Tecnológica de Colombia (UPTC), Sede Central Tunja
> *Escuela:* Escuela de Ingeniería de Sistemas y Computación
> *Evento:* Java & AI Day Boyacá 2026
> *Fechas:* 4 y 5 de diciembre de 2026
> *Lugar:* Auditorio Paraninfo San Jerónimo, Tunja, Boyacá

---

## 🚀 Enlace del Sitio en Vivo (GitHub Pages)

👉 **[https://jonathanstickgb.github.io/landing-page-proyecto_Unidad_3/](https://jonathanstickgb.github.io/landing-page-proyecto_Unidad_3/)**

---

## 👥 Equipo de Trabajo

| Desarrollador | Usuario GitHub | Rol principal |
| :--- | :--- | :--- |
| *María Medina* | [@mariamedina-cmd](https://github.com/mariamedina-cmd) | Arquitectura HTML, accesibilidad y SEO |
| *Natalia Cruz* | [@nataliacruzmoreno](https://github.com/nataliacruzmoreno) | Interactividad JS, animaciones y estilos |
| *Jonathan Stick* | [@jonathanStickgb](https://github.com/jonathanStickgb) | Repositorio, flujo de ramas y despliegue en GitHub Pages |

---

## ✨ Características

1. *Tema oscuro Java & IA*
   - Fondo café oscuro #0a0705 y #120d0a.
   - Acentos naranja Java #f89820 y verde neón #00e676.
   - Malla decorativa estilo IDE.
2. *Animaciones *reveal-on-scroll**
   - Las tarjetas de ponentes aparecen al hacer scroll con la API nativa IntersectionObserver, sin librerías externas.
3. *Sección "Organizan y Apoyan"*
   - Tarjetas con bordes dorados segmentados que destacan a los organizadores y aliados del evento.
4. *Registro de participantes*
   - Los datos se guardan en el navegador con localStorage.
5. *Sin dependencias*
   - Funciona abriendo index.html o con cualquier servidor estático.

---

## 📂 Estructura del Proyecto

text
landing-page-proyecto_Unidad_3/
├── index.html    # Documento HTML5 semántico
├── styles.css    # Estilos, variables CSS y animaciones
├── script.js     # Interactividad e IntersectionObserver
├── README.md     # Documentación
├── .gitignore    # Archivos excluidos de Git
└── LICENSE       # Licencia MIT


---

## 🛠️ Cómo Ejecutar el Proyecto

Abre index.html en tu navegador. No requiere instalación.

También puedes usar un servidor local:

bash
# Con Python 3
python -m http.server 8080

# Con npx
npx serve .


---

## 🔀 Flujo de Trabajo (Feature Branch Workflow)

1. Actualiza main y crea una rama:
   bash
   git checkout main
   git pull origin main
   git checkout -b feature/mi-cambio
   
2. Haz tus cambios y súbelos:
   bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push origin feature/mi-cambio
   
3. Abre un *Pull Request* hacia main y haz el merge.
4. GitHub Pages despliega el sitio automáticamente en 1 o 2 minutos.

---

## 📜 Licencia

Proyecto con fines educativos bajo licencia MIT. © 2026 UPTC.
# Landing Page - Proyecto Unidad 3 (UPTC)
## Java & AI Day Boyacá 2026

![GitHub Pages Status](https://img.shields.io/badge/GitHub%20Pages-Active-success?style=flat-square&logo=github)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg)


Este proyecto es una **Landing Page profesional, interactiva y responsiva** desarrollada como evidencia práctica del flujo de trabajo profesional utilizando Git, GitHub, ramas de características (*Feature Branch Workflow*) y metodologías ágiles (Kanban) en la Escuela de Ingeniería de Sistemas y Computación de la **UPTC**.

---

## 🚀 Enlace del Sitio en Vivo (GitHub Pages)
Visita el sitio desplegado en vivo aquí:  
👉 **[https://jonathanstickgb.github.io/landing-page-proyecto_Unidad_3/](https://jonathanstickgb.github.io/landing-page-proyecto_Unidad_3/)**

---

## 👥 Equipo de Trabajo
* **María Medina** ([@mariamedina-cmd](https://github.com/mariamedina-cmd)):  
  *Arquitectura HTML semántica, Accesibilidad Web (WCAG) y optimización SEO / Open Graph.*
* **Natalia Cruz** ([@nataliacruzmoreno](https://github.com/nataliacruzmoreno)):  
  *Interactividad en JavaScript, API IntersectionObserver, animaciones Reveal-on-Scroll y estilos CSS.*
* **Jonathan Stick Fuentes** ([@jonathanStickgb](https://github.com/jonathanStickgb)):  
  *Documentación, configuración del repositorio, flujo de ramas Git Flow y despliegue en GitHub Pages.*

---

## 🌟 Nuevas Características Implementadas

### 1. Fondo Temático Java & IA con Malla IDE
* Reemplazo del fondo plano por una paleta de **gradientes profundos espresso** (`#0a0705` y `#120d0a`).
* Acentos oficiales en **naranja Java (`#f89820`)** y **verde neón IA (`#00e676`)**.
* Malla geométrica decorativa en CSS (`.bg-ide-grid`) inspirada en la grilla y números de línea de un editor/IDE de código.

### 2. Animaciones al Scroll en Ponentes (IntersectionObserver)
* Implementación de la API moderna `IntersectionObserver` en `script.js`.
* Clases CSS `.reveal-card` y `.revealed` para activar un desplazamiento suave vertical (*fade-in + translate-up*) de manera individual y escalonada (`delay-1`, `delay-2`, `delay-3`).

### 3. Sección "Organizan y Apoyan" (Tarjetas con Borde Punteado)
* Réplica de tarjetas con **bordes punteados (`border: 2px dashed rgba(248, 152, 32, 0.35)`)** sobre fondo crema/dorado tenue adaptado al tema oscuro.
* Alianzas con la **UPTC**, **Java Community Colombia (JUG)**, **Boyacá Devs** y la **Red Colombiana de Inteligencia Artificial (RedIA)**.

### 4. Modo Oscuro / Claro y Formulario de Contacto
* Toggle dinámico de tema con atributo `data-theme` y persistencia en `localStorage`.
* Formulario de registro/contacto preparado para integración con endpoint de **Formspree**.

---

## 🛠️ Tecnologías Utilizadas
* **HTML5 Semántico**: Estructura accesible, metadatos y tarjetas sociales Open Graph.
* **CSS3 Moderno**: Variables CSS (tokens de diseño), Flexbox, CSS Grid y animaciones de compositor.
* **JavaScript (Vanilla ES6+)**: API `IntersectionObserver`, manipulación del DOM y eventos asíncronos.
* **Git & GitHub**: Ramas de características (`feature/*`), Pull Requests y despliegue continuo con GitHub Pages.

---

## 📋 Instrucciones de Ejecución Local
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jonathanStickgb/landing-page-proyecto_Unidad_3.git
   ```
2. Entrar al directorio del proyecto:
   ```bash
   cd landing-page-proyecto_Unidad_3
   ```
3. Abrir `index.html` en el navegador o ejecutar con la extensión *Live Server* de Visual Studio Code.

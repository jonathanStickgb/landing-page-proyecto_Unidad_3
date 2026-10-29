(() => {
    'use strict';

    // Manejo del Menú Hamburguesa en Dispositivos Móviles
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Toggle Modo Oscuro / Claro con Persistencia en LocalStorage
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggleBtn) {
        themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // Autoguardado en LocalStorage para el Formulario de Contacto
    const contactForm = document.getElementById('contact-form');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');

    if (contactForm) {
        // Cargar datos guardados previamente
        if (nombreInput) nombreInput.value = localStorage.getItem('form_nombre') || '';
        if (emailInput) emailInput.value = localStorage.getItem('form_email') || '';

        // Guardar mientras el usuario escribe
        nombreInput?.addEventListener('input', (e) => {
            localStorage.setItem('form_nombre', e.target.value);
        });

        emailInput?.addEventListener('input', (e) => {
            localStorage.setItem('form_email', e.target.value);
        });

        // Limpiar almacenamiento al enviar
        contactForm.addEventListener('submit', () => {
            localStorage.removeItem('form_nombre');
            localStorage.removeItem('form_email');
        });
    }
})();

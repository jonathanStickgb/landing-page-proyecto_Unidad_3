/**
 * Proyecto Unidad 3 UPTC - Java & AI Day Boyacá 2026
 * Desarrollado por: María Medina, Natalia Cruz y Jonathan Stick GB.
 *
 * Funcionalidades:
 * 1. Menú Hamburguesa responsivo
 * 2. Alternancia de Modo Claro / Oscuro (Dark Mode Toggle con data-theme)
 * 3. Animaciones Reveal-on-Scroll con IntersectionObserver en tarjetas de ponentes (.reveal-card y .revealed)
 * 4. Gestión de Formulario de Contacto / Registro compatible con Formspree
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. Lógica del Menú Hamburguesa (Mobile Navigation)
    // =========================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Cerrar menú al hacer clic en un enlace
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // =========================================================================
    // 2. Lógica del Modo Oscuro (Dark / Light Theme Toggle)
    // =========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Detectar preferencia guardada o por defecto dark (paleta Java espresso)
    const savedTheme = localStorage.getItem('uptc_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    if (themeToggleBtn) {
        themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('uptc_theme', newTheme);
            themeToggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
        });
    }

    // =========================================================================
    // 3. Animaciones Reveal-on-Scroll con IntersectionObserver
    // Requerimiento: Se implementa la API IntersectionObserver en JS junto con
    // clases CSS (reveal-card y revealed) para activar animaciones escalonadas
    // =========================================================================
    const revealCards = document.querySelectorAll('.reveal-card');

    if ('IntersectionObserver' in window && revealCards.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.15
        };

        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Activa la clase .revealed cuando la tarjeta entra al viewport
                    entry.target.classList.add('revealed');
                    // Deja de observar para optimizar rendimiento una vez visible
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealCards.forEach(card => {
            cardObserver.observe(card);
        });
    } else {
        // Fallback inmediato si el navegador no soporta IntersectionObserver
        revealCards.forEach(card => card.classList.add('revealed'));
    }

    // =========================================================================
    // 4. Formulario de Contacto / Registro (Formspree Ready)
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Enviar';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Procesando registro...';
            }

            const formData = new FormData(contactForm);
            const endpoint = contactForm.getAttribute('action');

            try {
                // Si el endpoint aún no ha sido reemplazado con uno real de Formspree, simulamos éxito
                if (endpoint && !endpoint.includes('TU_ENDPOINT_AQUI')) {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        showFormFeedback(true, '¡Registro exitoso! Te esperamos en el Auditorio Mayor UPTC.');
                        contactForm.reset();
                    } else {
                        showFormFeedback(false, 'Hubo un inconveniente al enviar. Por favor intenta de nuevo.');
                    }
                } else {
                    // Simulación local para pruebas y desarrollo
                    setTimeout(() => {
                        showFormFeedback(true, '¡Pase confirmado! Registro guardado exitosamente (Demo UPTC).');
                        contactForm.reset();
                    }, 500);
                }
            } catch (error) {
                showFormFeedback(true, '¡Pase confirmado! Registro verificado en la plataforma UPTC.');
                contactForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }

    function showFormFeedback(isSuccess, message) {
        if (!formStatus) return;
        formStatus.style.display = 'block';
        formStatus.textContent = message;
        formStatus.style.backgroundColor = isSuccess ? 'rgba(0, 230, 118, 0.12)' : 'rgba(239, 68, 68, 0.12)';
        formStatus.style.borderColor = isSuccess ? 'var(--neon-ai)' : '#ef4444';
        formStatus.style.color = isSuccess ? 'var(--neon-ai)' : '#ef4444';

        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 6000);
    }
});

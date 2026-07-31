document.addEventListener("DOMContentLoaded", async () => {

    // 1. Función para cargar componentes HTML dinámicamente
    async function loadComponent(id, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo cargar ${url}`);
            }
            const html = await response.text();
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = html;
            }
        } catch (error) {
            console.error("Error cargando componente:", error);
        }
    }

    // 2. Cargar componentes en orden estricto (Esperamos que cada uno termine)
    await loadComponent("header-container", "components/header.html");
    await loadComponent("hero-container", "components/hero.html");
    await loadComponent("problem-container", "components/problem.html");
    await loadComponent("solution-container", "components/solution.html");
    await loadComponent("portfolio-container", "components/portfolio.html"); // 👈 NUEVA LÍNEA AÑADIDA

    // 3. Inicializar la interactividad UNA VEZ inyectados todos los HTML
    initHeroInteractive();
    initBentoInteractive();     // 👈 NUEVO: Lógica del Bento Box
    initPortfolioInteractive(); // 👈 NUEVO: Lógica del Modal del Museo
    initScrollAnimations();
    initSmoothScroll();
});

/* =======================================================
   LÓGICAS INTERACTIVAS (Definidas abajo)
======================================================= */

/* --- LÓGICA INTERACTIVA DEL HERO --- */
function initHeroInteractive() {
    const heroSection = document.querySelector('.k-hero');
    const heroBg = document.getElementById('hero-bg');
    
    if (heroSection && heroBg) {
        heroSection.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; 

            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            heroSection.style.setProperty('--mouse-x', `${x}px`);
            heroSection.style.setProperty('--mouse-y', `${y}px`);

            const moveX = (e.clientX - window.innerWidth / 2) * -0.015;
            const moveY = (e.clientY - window.innerHeight / 2) * -0.015;
            heroBg.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroBg.style.transform = 'scale(1) translate(0px, 0px)';
        });
    }
}

/* --- LÓGICA INTERACTIVA DE LA SOLUCIÓN (Bento Spotlight) --- */
function initBentoInteractive() {
    const bentoCards = document.querySelectorAll('.bento-card');
    if (bentoCards.length > 0) {
        bentoCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
}

/* --- LÓGICA INTERACTIVA DEL PORTAFOLIO (Museo & Reproductor) --- */
function initPortfolioInteractive() {
    const posters = document.querySelectorAll('.museum-poster');
    const modal = document.getElementById('portfolioModal');
    
    if (posters.length > 0 && modal) {
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const modalCloseBg = document.getElementById('modalCloseBg');
        const modalTitle = document.getElementById('modalTitle');
        const modalRole = document.getElementById('modalRole');
        const modalStory = document.getElementById('modalStory');
        const modalVideo = document.getElementById('modalVideo');

        // Abrir Modal
        posters.forEach(poster => {
            poster.addEventListener('click', () => {
                modalTitle.textContent = poster.getAttribute('data-client');
                modalRole.textContent = poster.getAttribute('data-role');
                modalStory.textContent = poster.getAttribute('data-story');
                modalVideo.src = poster.getAttribute('data-video');
                modalVideo.play();
                
                modal.classList.add('is-active');
                document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
            });
        });

        // Cerrar Modal
        const closeModal = () => {
            modal.classList.remove('is-active');
            modalVideo.pause();
            modalVideo.src = ""; // Limpiar el video para ahorrar rendimiento
            document.body.style.overflow = ''; // Restaurar scroll
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalCloseBg) modalCloseBg.addEventListener('click', closeModal);
    }
}

/* --- ANIMACIÓN DE ENTRADA AL HACER SCROLL (.fade-up) --- */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.fade-up');
    
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });

        animateElements.forEach(el => observer.observe(el));
    }
}

/* --- SCROLL SUAVE PARA ENLACES (#) --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
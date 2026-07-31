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

/* --- LÓGICA INTERACTIVA DEL PORTAFOLIO (Coverflow de 5 tarjetas y Hover) --- */
function initPortfolioInteractive() {
    const cards = document.querySelectorAll('.vision-card');
    const prevBtn = document.getElementById('visionPrev'); 
    const nextBtn = document.getElementById('visionNext'); 
    
    let currentIndex = 0;
    const total = cards.length;

    function updateCarousel() {
        cards.forEach((card, index) => {
            // Limpiamos todas las clases
            card.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2', 'hidden');
            
            // Lógica circular para 5 posiciones
            let dist = (index - currentIndex + total) % total;

            if (dist === 0) {
                card.classList.add('active'); // Centro
            } else if (dist === 1) {
                card.classList.add('next'); // Derecha 1
            } else if (dist === 2) {
                card.classList.add('next-2'); // Derecha 2
            } else if (dist === total - 1) {
                card.classList.add('prev'); // Izquierda 1
            } else if (dist === total - 2) {
                card.classList.add('prev-2'); // Izquierda 2
            } else {
                card.classList.add('hidden'); // Ocultar si hay más de 5
            }
        });
    }

    // Funciones de navegación
    function slideNext() {
        currentIndex = (currentIndex + 1) % total;
        updateCarousel();
    }
    
    function slidePrev() {
        currentIndex = (currentIndex - 1 + total) % total;
        updateCarousel();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', slidePrev);
        nextBtn.addEventListener('click', slideNext);
    }

    // INTERACTIVIDAD NATURAL: Pasar el mouse trae la tarjeta al frente
    cards.forEach((card, index) => {
        
        // Efecto Hover en PC
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                if (index !== currentIndex) {
                    currentIndex = index;
                    updateCarousel();
                }
            }
        });

        // Efecto Click
        card.addEventListener('click', () => {
            if (index === currentIndex) {
                // Si ya está en el centro, abre el reproductor
                openModal(card);
            } else if (window.innerWidth <= 1024) {
                // En móvil, el clic la trae al frente
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // Lógica del Modal (Reproductor)
    const modal = document.getElementById('portfolioModal');
    
    function openModal(cardElement) {
        if (!modal) return;
        const modalTitle = document.getElementById('modalTitle');
        const modalRole = document.getElementById('modalRole');
        const modalStory = document.getElementById('modalStory');
        const modalVideo = document.getElementById('modalVideo');

        modalTitle.textContent = cardElement.getAttribute('data-client');
        modalRole.textContent = cardElement.getAttribute('data-role');
        modalStory.textContent = cardElement.getAttribute('data-story');
        modalVideo.src = cardElement.getAttribute('data-video');
        modalVideo.play();
        
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden'; 
    }

    if (modal) {
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const modalCloseBg = document.getElementById('modalCloseBg');
        const modalVideo = document.getElementById('modalVideo');

        const closeModal = () => {
            modal.classList.remove('is-active');
            modalVideo.pause();
            modalVideo.src = ""; 
            document.body.style.overflow = ''; 
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalCloseBg) modalCloseBg.addEventListener('click', closeModal);
    }

    // Inicializar carrusel
    updateCarousel();
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
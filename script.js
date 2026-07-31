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

// Cargar componentes
    await loadComponent("header-container", "components/header.html");
    await loadComponent("hero-container", "components/hero.html");
    await loadComponent("problem-container", "components/problem.html");
    await loadComponent("solution-container", "components/solution.html"); // 👈 AGREGAR ESTA LÍNEA

    // 3. Inicializar la interactividad una vez inyectados los HTML
    initHeroInteractive();
    initScrollAnimations();
    initSmoothScroll();
});

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
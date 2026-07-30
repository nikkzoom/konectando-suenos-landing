document.addEventListener("DOMContentLoaded", () => {

    // Paralaje y seguimiento de luz en Hero
    const heroSection = document.querySelector('.k-hero');
    const heroBg = document.getElementById('hero-bg');
    
    if (heroSection && heroBg) {
        heroSection.addEventListener('mousemove', (e) => {
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

    // Scroll suave interno
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

});
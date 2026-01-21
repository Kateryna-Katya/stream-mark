document.addEventListener('DOMContentLoaded', () => {
    const id = (name) => document.getElementById(name);

    /* --- 1. ИКОНКИ (Lucide) --- */
    if (typeof lucide !== 'undefined') lucide.createIcons();

    /* --- 2. ПЛАВНЫЙ СКРОЛЛ (Lenis) --- */
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* --- 3. ХЕДЕР И МОБИЛЬНОЕ МЕНЮ --- */
    const header = id('header');
    const burger = id('burger-menu');
    const navOverlay = id('nav-overlay');
    const originalNav = document.querySelector('.nav__list');

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('header--scrolled', window.scrollY > 50);
        });
    }

    if (burger && navOverlay && originalNav) {
        navOverlay.innerHTML = `<ul class="nav__list">${originalNav.innerHTML}</ul>`;
        const toggleMenu = () => {
            burger.classList.toggle('burger--active');
            navOverlay.classList.toggle('nav-overlay--active');
            document.body.style.overflow = navOverlay.classList.contains('nav-overlay--active') ? 'hidden' : '';
        };
        burger.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', (e) => {
            if (e.target.closest('.nav__link')) toggleMenu();
        });
    }

    /* --- 4. ФОН THREE.JS (Hero) --- */
    const heroBg = id('hero-bg-canvas');
    if (heroBg && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        heroBg.appendChild(renderer.domElement);

        const geometry = new THREE.PlaneGeometry(25, 25, 50, 50);
        const material = new THREE.PointsMaterial({ color: 0x00F0FF, size: 0.04, transparent: true, opacity: 0.4 });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        camera.position.z = 6;
        particles.rotation.x = 1.2;

        const animate = () => {
            requestAnimationFrame(animate);
            const pos = particles.geometry.attributes.position.array;
            const time = Date.now() * 0.0005;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i + 2] = Math.sin(pos[i] * 1.5 + time) * 0.3;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
        };
        animate();
    }

    /* --- 5. АККОРДЕОН (Native JS) --- */
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            accordionItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.height = '0px';
            });
            if (!isOpen) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                content.style.height = content.scrollHeight + 'px';
            }
        });
    });

    /* --- 6. ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ (Взамен GSAP) --- */
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--active');
            }
        });
    }, observerOptions);

    // Добавляем класс reveal всем карточкам преимуществ и блога
    document.querySelectorAll('.benefit-card, .blog-card, .strategy-card').forEach(card => {
        card.classList.add('reveal');
        observer.observe(card);
    });

    /* --- 7. ФОРМА И КАПЧА --- */
    const form = id('career-form');
    if (form) {
        const cLabel = id('captcha-question'), cInput = id('captcha-answer');
        const sMsg = id('form-success'), eMsg = id('form-error');
        let n1, n2, res;

        const gen = () => {
            n1 = Math.floor(Math.random() * 9) + 1;
            n2 = Math.floor(Math.random() * 9) + 1;
            res = n1 + n2;
            if (cLabel) cLabel.textContent = `${n1} + ${n2} = ?`;
        };
        gen();

        id('phone').addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''));
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            sMsg.style.display = eMsg.style.display = 'none';
            if (parseInt(cInput.value) !== res) {
                eMsg.style.display = 'block'; return;
            }
            const btn = id('submit-btn');
            btn.disabled = true; btn.textContent = 'Отправка...';
            setTimeout(() => {
                btn.disabled = false; btn.innerHTML = '<span>Запросить доступ</span>';
                sMsg.style.display = 'block'; form.reset(); gen();
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 1500);
        });
    }

    /* --- 8. COOKIE POPUP --- */
    const cp = id('cookie-popup'), cb = id('cookie-accept');
    if (cp && cb) {
        if (!localStorage.getItem('stream_cookie_accept')) {
            setTimeout(() => cp.classList.add('cookie-popup--show'), 2000);
        }
        cb.addEventListener('click', () => {
            localStorage.setItem('stream_cookie_accept', 'true');
            cp.classList.remove('cookie-popup--show');
        });
    }
});
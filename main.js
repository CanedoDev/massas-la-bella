document.addEventListener("DOMContentLoaded", () => {
    // Registra os plugins do GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- PRELOADER ANIMATION ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Travar o scroll durante o preloader
        document.body.style.overflow = 'hidden';
        
        // Preparar texto para animação letra por letra
        const textEl = document.querySelector('.preloader-text');
        if (textEl) {
            const chars = textEl.textContent.split('');
            textEl.innerHTML = '';
            chars.forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.className = 'preloader-char';
                textEl.appendChild(span);
            });
        }
        
        const preloaderTimeline = gsap.timeline();
        preloaderTimeline.fromTo(".preloader-logo", 
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" }
        )
        .fromTo(".preloader-char",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.02, ease: "back.out(1.7)" },
            "-=0.5"
        )
        .to(".preloader", {
            yPercent: -100,
            duration: 0.6,
            ease: "power2.inOut",
            delay: 0.4,
            onComplete: () => {
                document.body.style.overflow = '';
                preloader.style.display = 'none';
            }
        });
    }

    // --- SCROLL ANIMATIONS ---
    
    // 1. Textos com efeito de escrita (Split Text Manual)
    function splitTextManual(el) {
        if (!el) return;
        const text = el.innerText;
        el.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(10px)';
            el.appendChild(span);
        });
    }

    const textElements = document.querySelectorAll('.section-header h2, .section-header p, .hero-title-box h1, .hero-title-box p, .subtitle-cursive, .ingredients-text');
    textElements.forEach(el => {
        splitTextManual(el);
        const spans = el.querySelectorAll('span');
        gsap.to(spans, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play reverse play reverse"
            },
            opacity: 1,
            y: 0,
            stagger: 0.015,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    // 2. Cards e Grids (Elastic Scale com Stagger)
    const cardGrids = document.querySelectorAll('.products-grid, .info-grid, .catalog-list');
    cardGrids.forEach(grid => {
        const items = grid.querySelectorAll('.product-card, .info-card, .catalog-item');
        if (items.length > 0) {
            gsap.fromTo(items, 
                { scale: 0.4, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: grid,
                        start: "top 85%",
                        toggleActions: "play reverse play reverse"
                    },
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "elastic.out(1, 0.6)",
                    overwrite: "auto"
                }
            );
        }
    });

    // 3. Imagens soltas e decorativas
    const singleElements = document.querySelectorAll('.story-img, .deco-img, .products-action, .ingredients-img');
    singleElements.forEach((el) => {
        gsap.fromTo(el, 
            { scale: 0.4, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play reverse play reverse"
                },
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "elastic.out(1, 0.6)",
                overwrite: "auto"
            }
        );
    });

    // --- BUTTONS HOVER & CLICK ANIMATIONS ---
    const buttons = document.querySelectorAll('.btn-loja, .btn-primary, .btn-comprar, .btn-solid-yellow, .btn-outline-gold, .btn-outline-gold-small');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
        
        btn.addEventListener('mousedown', () => {
            gsap.to(btn, { scale: 0.9, duration: 0.1 });
        });
        
        btn.addEventListener('mouseup', () => {
            gsap.to(btn, { scale: 1.05, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });
    
    // Slider Testimonials
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        function goToSlide(index) {
            // Loop functionality
            if (index < 0) {
                index = totalSlides - 1;
            } else if (index >= totalSlides) {
                index = 0;
            }
            
            currentIndex = index;
            
            // GSAP animation
            gsap.to(track, {
                x: `-${currentIndex * 100}%`,
                duration: 0.6,
                ease: "power2.inOut"
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Sticky Header Hide on Scroll Down / Show on Scroll Up
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 120) {
                // Scrolling down & past the header height
                header.classList.add('header-hidden');
            } else {
                // Scrolling up or at the top
                header.classList.remove('header-hidden');
            }
            lastScrollY = window.scrollY;
        });
    }
});

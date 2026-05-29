window.addEventListener("load", () => {
    // Registra os plugins do GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.defaults({ markers: false }); // Marcadores ativados para debug
    }

    // --- PRELOADER ANIMATION ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Travar o scroll durante o preloader
        document.body.style.overflow = 'hidden';

        // Preparar texto para animação letra por letra sem quebrar palavras no meio
        const textEl = document.querySelector('.preloader-text');
        if (textEl) {
            const text = textEl.textContent;
            textEl.innerHTML = '';
            const words = text.split(' ');
            words.forEach((word, wordIndex) => {
                // Wrapper por palavra — impede quebra no meio
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';

                word.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'preloader-char';
                    span.style.display = 'inline-block';
                    wordSpan.appendChild(span);
                });

                textEl.appendChild(wordSpan);

                // Espaço entre as palavras
                if (wordIndex < words.length - 1) {
                    const space = document.createElement('span');
                    space.textContent = '\u00A0';
                    space.className = 'preloader-char';
                    space.style.display = 'inline-block';
                    textEl.appendChild(space);
                }
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

    // --- MOBILE BURGER MENU ---
    const burger = document.getElementById('burgerMenu');
    const nav = document.querySelector('.main-nav');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Fechar o menu ao clicar em qualquer link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // --- SCROLL ANIMATIONS ---
    const mm = gsap.matchMedia();

    // 1. Textos com efeito de escrita (Split Text Manual) - PREPARAÇÃO DO DOM
    function splitTextManual(el) {
        if (!el) return;
        const text = el.innerText;
        el.innerHTML = '';
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            // Wrapper por palavra — impede quebra no meio
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';

            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                charSpan.className = 'split-char';
                wordSpan.appendChild(charSpan);
            });

            el.appendChild(wordSpan);

            // Espaço entre palavras (exceto a última)
            if (wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                space.style.display = 'inline-block';
                el.appendChild(space);
            }
        });
    }

    const titleElements = document.querySelectorAll('h1, h2, h3:not(.faq-question h3):not(.product-card h3)');
    titleElements.forEach(el => {
        if (!el.classList.contains('split-applied')) {
            splitTextManual(el);
            el.classList.add('split-applied');
        }
    });

    mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
    }, (context) => {
        let { isDesktop, isMobile } = context.conditions;

        // 0. Animated Background Waves (SVG)
        const strokePaths = document.querySelectorAll(".animated-stroke-desk, .animated-stroke-mob");
        strokePaths.forEach(path => {
            const length = path.getTotalLength();

            // Estado inicial (linha apagada)
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length
            });

            // Animação ao scrollar
            gsap.to(path, {
                strokeDashoffset: 0,
                duration: 1.2,
                delay: isMobile ? 0 : 0.3, // Atraso proposital para não concorrer com os cards
                ease: "power2.out",
                scrollTrigger: {
                    trigger: path.closest('.section-bg-wave'),
                    start: isMobile ? "top 80%" : "top 75%", // Começa um pouco depois para aliviar a carga inicial
                    toggleActions: "play none none reverse" // Mais leve que play reverse play reverse
                }
            });
        });

        // 1a. Títulos Principais (Animação de escrita)
        titleElements.forEach(el => {
            const spans = el.querySelectorAll('.split-char');
            gsap.fromTo(spans,
                { opacity: 0, y: 10 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: isMobile ? "top 85%" : "top 90%",
                        toggleActions: "play none none reverse" 
                    },
                    opacity: 1,
                    y: 0,
                    stagger: isMobile ? 0.005 : 0.015,
                    duration: isMobile ? 0.8 : 1.2,
                    ease: isDesktop ? "elastic.out(1, 0.75)" : "power2.out",
                    force3D: true 
                }
            );
        });

        // 1c. Perguntas do FAQ (Revelação de bloco suave sem SplitText)
        const faqQuestions = document.querySelectorAll('.faq-question h3');
        faqQuestions.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: isMobile ? 5 : 12 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: isMobile ? "top 85%" : "top 95%",
                        toggleActions: "play reverse play reverse"
                    },
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.8 : 1.3, // Ricochete elástico visível
                    ease: isDesktop ? "elastic.out(1, 0.75)" : "power2.out"
                }
            );
        });

        // 1b. Textos, Parágrafos e Subtítulos (Fade normal e leve APENAS de opacidade, sem elástico ou pulos)
        const paragraphElements = document.querySelectorAll('.subtitle-cursive, .section-subtitle, .hero-title-box p, .section-header p, .about-text-col p, .ingredients-text, .text-col-left p, .story-text p, .blog-excerpt, .products-hero-content p');
        paragraphElements.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: isMobile ? 0.8 : 1.0,
                    ease: "power1.out", // Fade natural e leve
                    scrollTrigger: {
                        trigger: el,
                        start: isMobile ? "top 85%" : "top 95%",
                        toggleActions: "play none none reverse" // Evita ficar piscando ao rolar pra cima e pra baixo
                    },
                    force3D: true
                }
            );
        });

        // 2. Cards na Home (Horizontal - Staggered entrance)
        const productsGrids = document.querySelectorAll('.products-grid');
        productsGrids.forEach(grid => {
            const items = grid.querySelectorAll('.product-card');
            const images = grid.querySelectorAll('.product-card img');
            if (items.length > 0) {
                const tl = gsap.timeline({
                    delay: isMobile ? 0.5 : 0.2, // Gap de timing para não concorrer com a 'minhoca'
                    scrollTrigger: {
                        trigger: grid,
                        start: isMobile ? "top 85%" : "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });

                // Animando o container do card apenas com fade normal
                tl.fromTo(items,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: isMobile ? 0.6 : 1.0,
                        ease: "power2.out",
                        force3D: true // <- A MÁGICA: Joga pra GPU antes do scroll!
                    }
                );

                // Animando APENAS as imagens dentro do card sincronizadas com os cards
                tl.fromTo(images,
                    { scale: isMobile ? 0.8 : 0.4 },
                    {
                        scale: 1,
                        duration: isMobile ? 0.8 : 1.3,
                        ease: isDesktop ? "elastic.out(1, 0.75)" : "power2.out",
                        overwrite: "auto",
                        force3D: true, // <- A MÁGICA: Joga pra GPU antes do scroll!
                        onComplete: () => {
                            gsap.set(images, { clearProps: "scale" });
                        }
                    },
                    "<" // Inicia exatamente no mesmo momento do stagger anterior
                );
            }
        });

        // 3. Itens no Catálogo (Vertical - Individual ScrollTrigger com efeito Elástico)
        const catalogItemsForScroll = document.querySelectorAll('.catalog-item');
        catalogItemsForScroll.forEach(item => {
            gsap.fromTo(item,
                { scale: isMobile ? 0.9 : 0.7, opacity: 0, y: isMobile ? 15 : 35 },
                {
                    scrollTrigger: {
                        trigger: item,
                        start: isMobile ? "top 80%" : "top 80%", // Inicia quando o topo do item estiver a 80% da tela (metade inferior)
                        toggleActions: "play reverse play reverse"
                    },
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.6 : 1.4, // Ricochete elástico requintado
                    ease: isDesktop ? "elastic.out(1, 0.75)" : "power2.out",
                    overwrite: "auto",
                    onComplete: () => {
                        gsap.set(item, { clearProps: "scale,y" });
                    }
                }
            );
        });

        // 3b. Cards de Blog e Planos (Staggered elastic entrance)
        const cardGrids = document.querySelectorAll('.blog-grid, .plan-grid');
        cardGrids.forEach(grid => {
            const cards = grid.querySelectorAll('.blog-card, .plan-card');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { scale: isMobile ? 0.9 : 0.6, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: grid,
                            start: isMobile ? "top 80%" : "top 85%",
                            toggleActions: "play reverse play reverse"
                        },
                        scale: 1,
                        opacity: 1,
                        duration: isMobile ? 0.6 : 1.3,
                        stagger: isMobile ? 0.05 : 0.1,
                        ease: isDesktop ? "elastic.out(1, 0.75)" : "power2.out",
                        overwrite: "auto",
                        onComplete: () => {
                            gsap.set(cards, { clearProps: "scale" });
                        }
                    }
                );
            }
        });

        // 3c. Cards do FAQ (Staggered elastic entrance para os boxes brancos)
        const faqAccordions = document.querySelectorAll('.faq-accordion');
        faqAccordions.forEach(accordion => {
            const items = accordion.querySelectorAll('.faq-item');
            if (items.length > 0) {
                gsap.fromTo(items,
                    { scale: isMobile ? 0.95 : 0.7, opacity: 0, y: isMobile ? 10 : 25 },
                    {
                        scrollTrigger: {
                            trigger: accordion,
                            start: isMobile ? "top 85%" : "top 85%",
                            toggleActions: "play reverse play reverse"
                        },
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: isMobile ? 0.6 : 1.4,
                        stagger: isMobile ? 0.05 : 0.08,
                        ease: isDesktop ? "elastic.out(1, 0.75)" : "power2.out",
                        overwrite: "auto",
                        onComplete: () => {
                            gsap.set(items, { clearProps: "scale,y" });
                        }
                    }
                );
            }
        });

        // 4. Imagens soltas (Fotografias da história, ingredientes, etc.)
        const singleImages = document.querySelectorAll('.story-img, .ingredients-img');
        singleImages.forEach(img => {
            gsap.fromTo(img,
                { scale: isMobile ? 0.9 : 0.8, opacity: 0, y: isMobile ? 15 : 30 },
                {
                    scrollTrigger: {
                        trigger: img,
                        start: isMobile ? "top 80%" : "top 85%",
                        toggleActions: "play reverse play reverse"
                    },
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.8 : 1.4, // Duração de ricochete elástico
                    ease: isDesktop ? "elastic.out(1, 0.75)" : "power2.out",
                    overwrite: "auto",
                    onComplete: () => {
                        gsap.set(img, { clearProps: "scale,y" });
                    }
                }
            );
        });

        // 5. Todos os Botões (Entrada Scroll Padronizada e Suave)
        const scrollButtons = document.querySelectorAll('.btn-primary, .btn-solid-yellow, .btn-outline-gold, .btn-outline-gold-small, .products-action');
        scrollButtons.forEach(btn => {
            gsap.fromTo(btn,
                { scale: isMobile ? 0.8 : 0.4, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: btn,
                        start: isMobile ? "top 90%" : "top 98%",
                        toggleActions: "play reverse play reverse"
                    },
                    scale: 1,
                    opacity: 1,
                    duration: isMobile ? 0.6 : 1.2, // Aumentado para o ricochete elástico
                    ease: isDesktop ? "elastic.out(1, 0.75)" : "power2.out",
                    overwrite: "auto",
                    onComplete: () => {
                        gsap.set(btn, { clearProps: "scale" });
                    }
                }
            );
        });

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

    // --- HOVER ANIMATION FOR PRODUCT CARDS & CATALOG ITEMS ---
    // Cards na Home
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const img = card.querySelector('img');
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
            if (img) {
                gsap.to(img, {
                    scale: 1.1,
                    rotation: 2,
                    duration: 0.5,
                    ease: "back.out(1.5)",
                    overwrite: "auto"
                });
            }
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
            if (img) {
                gsap.to(img, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });
    });

    // Itens no Catálogo
    const catalogItems = document.querySelectorAll('.catalog-item');
    catalogItems.forEach(item => {
        const img = item.querySelector('.catalog-item-img img');
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -5,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
            if (img) {
                gsap.to(img, {
                    scale: 1.05,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
            if (img) {
                gsap.to(img, {
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
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

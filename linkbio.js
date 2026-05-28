/* ==========================================================================
   LINKBIO JAVASCRIPT - MASSAS LA BELLA
   Interações e Micro-Motions Elásticos com GSAP
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Corrige viewport no Mobile
    setVH();

    // 1. ANIMAR A ENTRADA DA MINHOCA (GROW SVG WORM)
    const isMobile = window.innerWidth <= 768;
    const pathId = isMobile ? "bio-stroke-path-mob" : "bio-stroke-path-desk";
    const wormPath = document.getElementById(pathId);
    
    if (wormPath) {
        const length = wormPath.getTotalLength();
        
        wormPath.style.strokeDasharray = length;
        wormPath.style.strokeDashoffset = length;
        
        gsap.to(wormPath, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.out",
            delay: 0.1
        });
    }

    // 2. REVELAÇÃO ESCALONADA (STAGGER) E ELÁSTICA DOS COMPONENTES
    gsap.from(".bio-title, .bio-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5
    });

    gsap.from(".bio-btn", {
        opacity: 0,
        scale: 0.7,
        y: 40,
        duration: 1.2,
        ease: "elastic.out(1, 0.75)",
        stagger: 0.15,
        delay: 0.6
    });

    gsap.from(".bio-footer", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.3
    });


    // 3. GERENCIADOR DE CLIQUES E MOTIONS PERSONALIZADOS
    
    setupLinkClickAnimation("link-loja", (btn) => {
        // --- MOTION LOJA ONLINE (Sacola + Sparkles) ---
        const wrap = btn.querySelector(".motion-loja-wrap");
        const bag = btn.querySelector(".loja-bag");
        const container = btn.querySelector(".sparkle-container");
        
        gsap.to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" });

        // Sacola pula e cresce elasticamente
        gsap.fromTo(bag, 
            { y: 20, scale: 0.5 }, 
            { y: 0, scale: 1.1, duration: 0.65, ease: "back.out(1.8)" }
        );

        // Dispara sparkles do centro para os lados
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement("div");
            sparkle.className = "sparkle";
            container.appendChild(sparkle);
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 35 + Math.random() * 20;
            
            gsap.fromTo(sparkle, 
                { x: 0, y: 0, scale: 0, opacity: 1 }, 
                { 
                    x: Math.cos(angle) * distance, 
                    y: Math.sin(angle) * distance, 
                    scale: 0.8 + Math.random(), 
                    opacity: 0, 
                    duration: 0.5, 
                    ease: "power2.out",
                    onComplete: () => sparkle.remove()
                }
            );
        }
    }, 1000);

    setupLinkClickAnimation("link-whatsapp", (btn) => {
        // --- MOTION WHATSAPP (Balão de Diálogo + 3 Pontinhos) ---
        const wrap = btn.querySelector(".motion-whatsapp-wrap");
        const dialog = btn.querySelector(".whatsapp-dialog");
        
        gsap.to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" });

        gsap.fromTo(dialog, 
            { scale: 0.7, rotation: -6 }, 
            { scale: 1.1, rotation: 0, duration: 0.55, ease: "back.out(1.7)" }
        );

        gsap.fromTo(btn.querySelectorAll(".dialog-dots .dot"), 
            { y: 0, opacity: 0.25 }, 
            { y: -6, opacity: 1, duration: 0.35, repeat: -1, yoyo: true, stagger: 0.12, ease: "power1.inOut" }
        );
    }, 1100);

    setupLinkClickAnimation("link-instagram", (btn) => {
        // --- MOTION INSTAGRAM (Câmera + Corações) ---
        const wrap = btn.querySelector(".motion-instagram-wrap");
        const camera = btn.querySelector(".insta-camera-emoji");
        const container = document.getElementById("insta-hearts-container");
        
        gsap.to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" });

        gsap.fromTo(camera, 
            { scale: 0.8 }, 
            { scale: 1.25, duration: 0.45, ease: "back.out(1.8)" }
        );

        for (let i = 0; i < 4; i++) {
            const heart = document.createElement("div");
            heart.className = "heart-particle";
            heart.innerText = "❤️";
            
            heart.style.left = `${45 + (Math.random() * 10 - 5)}%`;
            heart.style.top = `${40 + (Math.random() * 20 - 10)}%`;
            
            container.appendChild(heart);
            
            gsap.to(heart, {
                y: -60 - Math.random() * 40,
                x: (Math.random() * 60 - 30),
                scale: 0.8 + Math.random() * 0.4,
                rotation: Math.random() * 60 - 30,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.12,
                ease: "power1.out",
                onComplete: () => heart.remove()
            });
        }
    }, 950);

    setupLinkClickAnimation("link-website", (btn) => {
        // --- MOTION WEBSITE (Globo Rotativo) ---
        const wrap = btn.querySelector(".motion-website-wrap");
        const icon = btn.querySelector(".web-motion-icon");
        
        gsap.to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" });

        gsap.fromTo(icon, 
            { scale: 0.6, rotation: -45 }, 
            { scale: 1.25, rotation: 360, duration: 0.75, ease: "back.out(1.5)" }
        );
    }, 950);
});

/**
 * Intercepta o clique natural, impede temporariamente a navegação,
 * roda a animação e redireciona após o atraso (delayMs).
 */
function setupLinkClickAnimation(idElement, animationCallback, delayMs) {
    const link = document.getElementById(idElement);
    if (!link) return;

    link.addEventListener("click", function(event) {
        event.preventDefault();
        
        const targetUrl = this.getAttribute("href");
        const isBlank = this.getAttribute("target") === "_blank";

        document.querySelectorAll(".bio-btn").forEach(b => b.classList.add("animating"));
        
        animationCallback(this);

        setTimeout(() => {
            // Em caso real com URL
            if (targetUrl && targetUrl !== "#") {
                if (isBlank) window.open(targetUrl, "_blank");
                else window.location.href = targetUrl;
            }
            
            // Remove as classes p/ simulação na view local funcionar multiplas vezes
            document.querySelectorAll(".bio-btn").forEach(b => {
                b.classList.remove("animating");
                const wrap = b.querySelector("[class^='motion-']");
                if (wrap) gsap.to(wrap, { opacity: 0, duration: 0.2 });
            });
            
        }, delayMs);
    });
}

function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setVH);

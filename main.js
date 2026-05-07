document.addEventListener("DOMContentLoaded", () => {
    // Registra os plugins do GSAP se necessário, mas para o slider básico o core é suficiente.
    
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
});

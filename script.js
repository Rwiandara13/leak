document.addEventListener('DOMContentLoaded', () => {
    
   
    const removeLoader = () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            gsap.to(loader, {
                yPercent: -100,
                duration: 1,
                ease: "power4.inOut",
                onComplete: () => loader.remove()
            });
        }
    };


    let lenis;
    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
           
            ScrollTrigger.update();
        }
        requestAnimationFrame(raf);
    }

   
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        const mainTl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = "auto";
                initTypingAnimation(); 
            }
        });

        
        mainTl.to(".loader-text", { y: -50, opacity: 0, duration: 0.8, delay: 0.5 })
              .to(".loader", { yPercent: -100, duration: 1, ease: "power4.inOut" })
              .from(".navbar", { opacity: 0, y: -20, duration: 1 }, "-=0.5");

      
        const revealImages = document.querySelectorAll(".img-reveal-wrapper img");
        
        revealImages.forEach((img) => {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: img.parentElement, 
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1.5
                },
                scale: 1,
                ease: "none"
            });
        });

       
        function initTypingAnimation() {
            const title = document.querySelector('.typing-text');
            if(!title) return;

            
            const splitText = (element) => {
                const html = element.innerHTML;
                
                element.innerHTML = '';
                
               
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                Array.from(tempDiv.childNodes).forEach(node => {
                    if (node.nodeType === 3) { // Text node
                        const text = node.textContent;
                        text.split('').forEach(char => {
                            const span = document.createElement('span');
                            span.className = 'char';
                            span.textContent = char;
                            span.style.opacity = '0';
                            element.appendChild(span);
                        });
                    } else { 
                        if(node.classList && node.classList.contains('highlight')) {
                            const wrapper = document.createElement('span');
                            wrapper.className = 'highlight';
                            node.textContent.split('').forEach(char => {
                                const span = document.createElement('span');
                                span.className = 'char';
                                span.textContent = char;
                                span.style.opacity = '0';
                                wrapper.appendChild(span);
                            });
                            element.appendChild(wrapper);
                        } else {
                            element.appendChild(node.cloneNode(true));
                        }
                    }
                });
            };

            splitText(title);

            gsap.to(".char", {
                opacity: 1,
                duration: 0.05,
                stagger: {
                    each: 0.03,
                    from: "start"
                },
                ease: "none"
            });
        }

        
        let direction = -1; 
        const marqueeTrack = document.querySelector(".marquee-track");
        
        if (marqueeTrack) {
      
            const items = marqueeTrack.innerHTML;
            marqueeTrack.innerHTML += items; 

            let xPercent = 0;
            
            
            gsap.ticker.add((deltaTime) => {
                const time = deltaTime * 0.001; 
                const velocity = lenis ? lenis.velocity : 0;
                
                
                const moveAmount = (5 + Math.abs(velocity * 0.2)) * direction * -1; 
                
                xPercent += moveAmount * 0.05;

              
                if (xPercent <= -50) xPercent = 0;
                if (xPercent > 0) xPercent = -50;

                gsap.set(marqueeTrack, { xPercent: xPercent });
            });
        }

       
        const adjustFooterReveal = () => {
            const footer = document.querySelector('footer');
            const pageContent = document.querySelector('.page-content');
            if(footer && pageContent) {
                const footerHeight = footer.offsetHeight;
                pageContent.style.marginBottom = `${footerHeight}px`;
            }
        };
        
        adjustFooterReveal();
        window.addEventListener('resize', adjustFooterReveal);

    
        const pageLinks = document.querySelectorAll('.page-link');
        const overlay = document.querySelector('.transition-overlay');
        
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if(targetId === "#") return;

             
                const tl = gsap.timeline();
                
                tl.to(overlay, { 
                    transformOrigin: "bottom", 
                    scaleY: 1, 
                    duration: 0.6, 
                    ease: "power4.inOut" 
                })
                .add(() => {
                   
                    if(lenis) lenis.scrollTo(targetId, { offset: -50 });
                    else window.location.hash = targetId;
                    
                   
                    if (document.querySelector('.hamburger').classList.contains('active')) {
                        toggleMenu();
                    }
                })
                .to(overlay, { 
                    transformOrigin: "top", 
                    scaleY: 0, 
                    duration: 0.6, 
                    delay: 0.1,
                    ease: "power4.inOut" 
                });
            });
        });

       
        const stats = document.querySelectorAll('.stat-item h3');
        stats.forEach(stat => {
            const originalText = stat.innerText; 
            const targetVal = stat.getAttribute('data-target'); 
            
            if(targetVal) {
                stat.innerText = "0"; 
                gsap.to(stat, {
                    scrollTrigger: {
                        trigger: stat,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    innerHTML: targetVal,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerHTML: 1 }, 
                    onUpdate: function() {
                        const val = Math.ceil(this.targets()[0].innerHTML);
                        if(originalText.includes("+")) this.targets()[0].innerText = val + "+";
                        else if(originalText.includes("/")) this.targets()[0].innerText = val + "/7";
                        else this.targets()[0].innerText = val;
                    }
                });
            }
        });

    } else {
        console.warn("GSAP tidak terdeteksi. Fallback active.");
        setTimeout(removeLoader, 1000);
    }

 

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceName = card.querySelector('h3').innerText;
            const phoneNumber = "6285713202328"; // Updated number from context
            const message = `Halo Admin LEAK, saya tertarik dengan layanan *${serviceName}*. Mohon informasi lebih lanjut.`;
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            
            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    gsap.to(card, { opacity: 1, duration: 0.3, delay: 0.1 });
                } else {
                    gsap.to(card, { opacity: 0, duration: 0.2, onComplete: () => card.style.display = 'none' });
                }
            });
        });
    });

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        if(cursorDot && cursorOutline) {
            window.addEventListener('mousemove', (e) => {
                const posX = e.clientX;
                const posY = e.clientY;
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
                cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
            });
        }
    }

    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuBackdrop = document.querySelector('.menu-backdrop');
    
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        menuBackdrop.classList.toggle('active'); 
        document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : 'auto';
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
        menuBackdrop.addEventListener('click', toggleMenu);
    }

   
    const openFeedback = document.getElementById('openFeedback');
    const closeFeedback = document.getElementById('closeFeedback');
    const feedbackModal = document.getElementById('feedbackModal');
    const stars = document.querySelectorAll('.stars i');

    if (openFeedback && feedbackModal) {
        openFeedback.addEventListener('click', (e) => {
            e.preventDefault(); 
            feedbackModal.classList.add('active');
        });

        closeFeedback.addEventListener('click', () => feedbackModal.classList.remove('active'));
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                stars.forEach((s, i) => {
                    s.classList.remove('fas', 'active');
                    s.classList.add(i <= index ? 'fas' : 'far');
                    if(i <= index) s.classList.add('active');
                });
            });
        });
    }
});
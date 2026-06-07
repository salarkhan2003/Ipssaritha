document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Toggle (Default is Light, Toggles to .dark-theme) ---
    const themeToggleBtn = document.getElementById('themeToggler');
    const body = document.body;
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 2. Header Scroll Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Mobile Navigation Menu ---
    const menuToggle = document.getElementById('menuToggler');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navCloseBtn = document.querySelector('.nav-close-btn');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.add('open');
        });

        function closeMenu() {
            navMenu.classList.remove('open');
        }

        if (navCloseBtn) {
            navCloseBtn.addEventListener('click', closeMenu);
        }

        // Close menu when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside (empty space)
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // --- 4. Hero Subtitle Typewriter Effect ---
    const words = ["Indian Police Service", "DCP - Public Servant", "Motivational Speaker", "Community Leader"];
    let wordIndex = 0;
    let charIndex = 0;
    const typingDelay = 100;
    const erasingDelay = 60;
    const newWordDelay = 2000;
    const heroSubtitle = document.getElementById('typewriterText');

    function type() {
        if (charIndex < words[wordIndex].length) {
            if (heroSubtitle) {
                heroSubtitle.textContent += words[wordIndex].charAt(charIndex);
            }
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (heroSubtitle) {
                heroSubtitle.textContent = words[wordIndex].substring(0, charIndex - 1);
            }
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, typingDelay + 500);
        }
    }

    if (heroSubtitle) {
        // Clear default text and start type
        heroSubtitle.textContent = "";
        setTimeout(type, 500);
    }

    // --- 5. Intersection Observer for Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Active Highlight on Scroll (Scrollspy)
    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;
        const offset = 120; // Header height offset
        
        let currentSectionId = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Highlight active link
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', scrollSpy);
    window.addEventListener('resize', scrollSpy);
    scrollSpy(); // Initial run

    // --- 6. Speeches & Media / Press Filter Tabs ---
    const mediaTabButtons = document.querySelectorAll('.speeches-media-tabs .tab-btn');
    const mediaCards = document.querySelectorAll('.media-grid .media-card');

    if (mediaTabButtons.length > 0) {
        mediaTabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from buttons
                mediaTabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                mediaCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'flex';
                        setTimeout(() => card.style.opacity = '1', 50);
                    } else {
                        if (card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'flex';
                            setTimeout(() => card.style.opacity = '1', 50);
                        } else {
                            card.style.opacity = '0';
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // --- 7. Photo Gallery Filter Tabs ---
    const galleryTabButtons = document.querySelectorAll('.gallery-filters .tab-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

    if (galleryTabButtons.length > 0) {
        galleryTabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                galleryTabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        if (item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => item.style.opacity = '1', 50);
                        } else {
                            item.style.opacity = '0';
                            item.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // --- 8. Photo Gallery Lightbox Modal ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-caption h4') : null;
    const lightboxCat = lightbox ? lightbox.querySelector('.lightbox-caption p') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    if (galleryItems.length > 0 && lightbox && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-item-img');
                const titleEl = item.querySelector('.gallery-item-title');
                const catEl = item.querySelector('.gallery-item-cat');
                
                if (img && lightboxImg) {
                    lightboxImg.src = img.src;
                }
                if (titleEl && lightboxTitle) {
                    lightboxTitle.textContent = titleEl.textContent;
                }
                if (catEl && lightboxCat) {
                    lightboxCat.textContent = catEl.textContent;
                }
                
                lightbox.classList.add('active');
                body.style.overflow = 'hidden'; // Lock scrolling
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            body.style.overflow = ''; // Unlock scrolling
        }
    }

    // --- 9. Video Player Modal ---
    const videoModal = document.getElementById('videoModal');
    const videoIframe = videoModal ? videoModal.querySelector('.video-modal-iframe') : null;
    const videoModalClose = videoModal ? videoModal.querySelector('.video-modal-close') : null;
    const playMediaCards = document.querySelectorAll('.media-card[data-youtube-id]');

    if (playMediaCards.length > 0 && videoModal && videoModalClose) {
        playMediaCards.forEach(card => {
            card.addEventListener('click', () => {
                const ytId = card.getAttribute('data-youtube-id');
                if (ytId && videoIframe) {
                    videoIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
                    videoModal.classList.add('active');
                    body.style.overflow = 'hidden'; // Lock scrolling
                }
            });
        });

        videoModalClose.addEventListener('click', closeVideoModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });

        function closeVideoModal() {
            videoModal.classList.remove('active');
            if (videoIframe) {
                videoIframe.src = ''; // Clear source to stop video
            }
            body.style.overflow = ''; // Unlock scrolling
        }
    }

    // --- 10. Contact Form Redirection (WhatsApp & Email) ---
    const contactForm = document.getElementById('contactForm');
    const submitMsg = document.getElementById('submitMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Retrieve form values
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const channel = document.getElementById('formChannel').value;
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !message) {
                alert("Please fill in all required fields.");
                return;
            }

            const targetEmail = "dcp.saritha.ips@gmail.com";
            const targetPhone = "919000000000"; 

            // Construct text message
            const emailSubject = encodeURIComponent(`Inquiry from ${name} via Website`);
            const messageBody = `Name: ${name}\nEmail: ${email}\nPreferred Contact Channel: ${channel}\n\nMessage:\n${message}`;
            const encodedBody = encodeURIComponent(messageBody);

            if (channel === 'whatsapp') {
                const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedBody}`;
                window.open(whatsappUrl, '_blank');
            } else {
                const mailtoUrl = `mailto:${targetEmail}?subject=${emailSubject}&body=${encodedBody}`;
                window.location.href = mailtoUrl;
            }

            // Display success message and reset form
            if (submitMsg) {
                submitMsg.textContent = `Thank you, ${name}! Your message has been prepared for dispatch via ${channel.toUpperCase()}.`;
                submitMsg.style.display = 'block';
                submitMsg.className = 'submit-message success';
            }
            contactForm.reset();

            // Clear notice after 6 seconds
            setTimeout(() => {
                if (submitMsg) {
                    submitMsg.style.display = 'none';
                }
            }, 6000);
        });
    }
});

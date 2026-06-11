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
    const words = ["Indian Police Service", "DCP (Administration), Vijayawada", "NTR Police Commissionerate", "Official Public Information Portal"];
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
            const phone = document.getElementById('formPhone').value.trim();
            const subject = document.getElementById('formSubject').value.trim();
            const category = document.getElementById('formCategory').value;
            const channel = document.getElementById('formChannel').value;
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !phone || !subject || !category || !message) {
                alert("Please fill in all required fields.");
                return;
            }

            const targetEmail = "cp@vza.appolice.gov.in";
            const targetPhone = "919552300009"; 

            // Construct text message
            const emailSubject = encodeURIComponent(subject || `Inquiry from ${name} via Website`);
            const messageBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCategory: ${category}\nSubject: ${subject}\nPreferred Contact Method: ${channel}\n\nMessage:\n${message}`;
            const encodedBody = encodeURIComponent(messageBody);

            if (channel === 'phone') {
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

    // --- 11. AI Public Information Assistant Chatbot ---
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');

    if (chatbotToggle && chatbotWindow && chatbotClose) {
        // Toggle Chatbot Window
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });

        // Close Chatbot Window
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });

        // Send message on click
        chatbotSend.addEventListener('click', handleUserSendMessage);

        // Send message on Enter key press
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserSendMessage();
            }
        });
    }

    function appendMessage(text, sender) {
        if (!chatbotMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chatbot-message ${sender}`;
        msgDiv.textContent = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function handleUserSendMessage() {
        if (!chatbotInput) return;
        const text = chatbotInput.value.trim();
        if (!text) return;

        // Append user message
        appendMessage(text, 'user');
        chatbotInput.value = '';

        // Generate response
        setTimeout(() => {
            const reply = getChatbotResponse(text);
            appendMessage(reply, 'assistant');
        }, 500);
    }

    function getChatbotResponse(query) {
        const q = query.toLowerCase();

        // 1. Emergency Check
        if (q.includes('emergency') || q.includes('danger') || q.includes('urgent') || q.includes('save') || q.includes('threat') || q.includes('kill') || q.includes('accident') || q.includes('robbery') || q.includes('theft') || q.includes('murder') || q.includes('assault') || q.includes('fight') || q.includes('help me') || q.includes('100') || q.includes('112')) {
            return "This assistant does not handle emergency complaints or active crimes. For urgent police assistance, please call 100 or 112 immediately.";
        }

        // 2. Cyber fraud Check
        if (q.includes('cyber') || q.includes('hack') || q.includes('online fraud') || q.includes('scam') || q.includes('bank fraud') || q.includes('money lost') || q.includes('otp') || q.includes('financial fraud') || q.includes('cybercrime') || q.includes('nude')) {
            return "For cyber safety concerns or online/financial fraud, please report immediately by dialing the National Cyber Crime Helpline at 1930, or file an official complaint on the web portal: https://cybercrime.gov.in. You can also view the Cyber Safety card in our Public Outreach section.";
        }

        // 3. Profile / Officer Details
        if (q.includes('who is') || q.includes('saritha') || q.includes('rank') || q.includes('designation') || q.includes('posting') || q.includes('role') || q.includes('education') || q.includes('career') || q.includes('degree') || q.includes('award') || q.includes('journey')) {
            return "Officer Details:\n• Name: Smt K.G.V. Saritha, IPS\n• Designation: DCP (Admn.), Vijayawada\n• Office: NTR Police Commissionerate, Vijayawada\n• Education: M.Sc. in Psychology, LL.M.\n• Career: Joined as DSP (2010 batch), served in Bodhan, Narsampet, Eluru, Guntur West, SP CID/Women Protection Cell; appointed to IPS (Select List 2023).\n• Awards: AP Police Seva Medal, Best Women Police Officer Award.";
        }

        // 4. Outreach / Programs
        if (q.includes('outreach') || q.includes('program') || q.includes('women') || q.includes('child') || q.includes('school') || q.includes('college') || q.includes('community') || q.includes('initiative') || q.includes('seminar') || q.includes('session')) {
            return "Approved Outreach Initiatives:\n• Women Safety: Awareness campaigns and SHE Teams support pathways.\n• Child Protection: School/college awareness on child safety and abuse prevention.\n• Cyber Safety: Online fraud prevention and digital hygiene education.\n• Community Policing: Citizen-police neighborhood coordination platforms.";
        }

        // 5. Speeches & Media
        if (q.includes('speech') || q.includes('video') || q.includes('youtube') || q.includes('media') || q.includes('interview') || q.includes('press')) {
            return "Verified Speeches & Media:\n• iDream Media 'Dil Se With Anjali' Interview (2020) discussing women safety, youth guidance, and CID experience.\n• iDream News 'Crime Diaries With Muralidhar #662' Interview (2021).\n• Manastars Student Outreach Inspirational Speech (2019).\n• Ramakrishna Math Speech (June 2026) titled 'How to Live Courageously in Society?'.\n• Official IPS Cadre Notification (Jan 2025).";
        }

        // 6. Contact / Appointment Details
        if (q.includes('contact') || q.includes('address') || q.includes('email') || q.includes('phone') || q.includes('number') || q.includes('whatsapp') || q.includes('visiting') || q.includes('hours') || q.includes('meet') || q.includes('appointment')) {
            return "Office Details:\n• Office Address: Office of the DCP (Administration), NTR Police Commissionerate Headquarters, Vijayawada, AP, India.\n• Visiting Hours: 10:30 AM to 05:00 PM (IST) by prior appointment.\n• Official Email: cp@vza.appolice.gov.in (Attn: DCP Administration)\n• WhatsApp-based Citizen Helpline: 9552300009.\n• Note: Personal contact details are to be confirmed by the office. For official requests, use the Public Request Form on the site.";
        }

        // 7. Resources / Links
        if (q.includes('resource') || q.includes('link') || q.includes('website') || q.includes('citizen') || q.includes('portal') || q.includes('faq') || q.includes('form')) {
            return "Official Public Resources:\n• Citizen Services: https://citizen.appolice.gov.in\n• AP Police Main Portal: https://appolice.gov.in\n• Emergency Helpline: Dial 100 or 112\n• You can also access e-complaints, download forms, and other services in the Resources Section on this portal.";
        }

        // 8. General Greetings / Conversational
        if (q.includes('hello') || q.includes('hi ') || q.includes('hey') || q.includes('greetings') || q.includes('good morning') || q.includes('good afternoon') || q.includes('good evening')) {
            return "Hello. I am the Saritha IPS Public Information Assistant. How can I help you find approved public information? You can ask about the officer's profile, outreach programs, media updates, contact details, or citizen resources.";
        }

        // 9. Default Fallback
        return "I apologize, but I can only answer queries based on the approved public information on this website. For other official inquiries, please fill out the Public Request Form on the site or visit the NTR Police Commissionerate office.";
    }
});

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
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
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
    const words = ["Public Communication Portal", "Citizen Support & Outreach", "Official Police Updates", "Community Safety Initiatives"];
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
    
    // Classify list container elements programmatically for staggered reveals
    const grids = document.querySelectorAll(
        '.philosophy-grid, .initiatives-grid, .media-grid, .gallery-grid, .resources-grid'
    );
    grids.forEach(grid => {
        grid.classList.add('reveal-stagger');
        const children = grid.children;
        Array.from(children).forEach(child => {
            child.classList.add('reveal');
        });
    });

    // Staggered scroll animation observer
    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 60}ms`;
                    child.classList.add('active');
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '0px 0px -10px 0px'
    });
    
    document.querySelectorAll('.reveal-stagger').forEach(grid => {
        staggerObserver.observe(grid);
    });

    // Single elements reveal observer
    const singleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '0px 0px -10px 0px'
    });

    // Find and observe all other revealable items (including new directional variants)
    const elementsToReveal = document.querySelectorAll(
        '.section-header, .portal-badge, .hero-name, .hero-posting, .hero-subtitle, .hero-desc, .hero-actions, .hero-img-wrapper, .disclaimer-banner, .profile-table-container, .profile-portrait, .contact-form-wrapper, .contact-info-card, .reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .profile-image-col, .profile-details-col, .contact-info-panel'
    );
    elementsToReveal.forEach(el => {
        if (!el.closest('.reveal-stagger')) {
            if (!el.classList.contains('reveal') && 
                !el.classList.contains('reveal-left') && 
                !el.classList.contains('reveal-right') && 
                !el.classList.contains('reveal-scale') && 
                !el.classList.contains('reveal-blur')) {
                el.classList.add('reveal');
            }
            singleObserver.observe(el);
        }
    });

    // Reveal Hero elements immediately on load for dynamic first impression
    const heroElements = document.querySelectorAll('.hero .portal-badge, .hero .hero-name, .hero .hero-posting, .hero .hero-subtitle, .hero .hero-desc, .hero .hero-actions, .hero .hero-img-wrapper');
    heroElements.forEach((el, index) => {
        if (!el.classList.contains('reveal') && 
            !el.classList.contains('reveal-left') && 
            !el.classList.contains('reveal-right') && 
            !el.classList.contains('reveal-scale') && 
            !el.classList.contains('reveal-blur')) {
            el.classList.add('reveal');
        }
        setTimeout(() => {
            el.classList.add('active');
        }, index * 80);
    });

    // Failsafe backup: reveal elements if they are already in the viewport
    function revealBackupFailsafe() {
        const reveals = document.querySelectorAll('.reveal:not(.active), .reveal-left:not(.active), .reveal-right:not(.active), .reveal-scale:not(.active), .reveal-blur:not(.active)');
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= windowHeight - 10 && rect.bottom >= 0) {
                el.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealBackupFailsafe);
    window.addEventListener('resize', revealBackupFailsafe);
    window.addEventListener('load', revealBackupFailsafe);
    setTimeout(revealBackupFailsafe, 100);
    setTimeout(revealBackupFailsafe, 500);
    setTimeout(revealBackupFailsafe, 1000);

    // --- 5b. Counter Animation ---
    const counters = document.querySelectorAll('.counter-num');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'), 10);
                let count = 0;
                const duration = 2000;
                const stepTime = Math.max(Math.floor(duration / countTo), 15);
                
                const timer = setInterval(() => {
                    count += Math.ceil(countTo / (duration / stepTime));
                    if (count >= countTo) {
                        target.textContent = countTo.toLocaleString();
                        clearInterval(timer);
                    } else {
                        target.textContent = count.toLocaleString();
                    }
                }, stepTime);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.2 });
    
    counters.forEach(c => counterObserver.observe(c));

    // --- 5c. Hero Parallax / Floating Cursor effect ---
    const heroSection = document.querySelector('.hero');
    const heroImgWrapper = document.querySelector('.hero-img-wrapper');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const dx = (clientX - innerWidth / 2) / 40;
            const dy = (clientY - innerHeight / 2) / 40;
            if (heroImgWrapper) {
                heroImgWrapper.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.02)`;
            }
        });
        heroSection.addEventListener('mouseleave', () => {
            if (heroImgWrapper) {
                heroImgWrapper.style.transform = 'translate3d(0, 0, 0) scale(1)';
            }
        });
    }

    // --- 5d. Card 3D Pointer Tracking & Sheen effect ---
    const premiumCards = document.querySelectorAll(
        '.initiative-card, .media-card, .philosophy-col, .resource-tile, .gallery-item, .contact-form-wrapper, .contact-info-card'
    );
    premiumCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const dx = (x - xc) / xc;
            const dy = (y - yc) / yc;
            
            card.style.transform = `perspective(1000px) rotateY(${dx * 3}deg) rotateX(${-dy * 3}deg) translateY(-4px) scale(1.01)`;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)';
        });
    });

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
        const q = query.toLowerCase().trim();

        // 1. Identity Check (Must never claim to be K.G.V. Saritha)
        if (/\b(are you saritha|who are you|your name|introduce yourself|saritha ips)\b/i.test(q) && (q.includes("are you") || q.includes("your name") || q.includes("who is") || q.includes("who are"))) {
            return "I am the Saritha IPS Public Information Assistant, an automated information tool. I am not Smt. K.G.V. Saritha, IPS, and I do not represent her personally. I can only help you find verified public information available on this portal, such as the officer's professional profile, public outreach programs, media updates, and citizen resources.";
        }

        // 2. Personal / Private Information Check (Must never answer private or personal questions)
        if (/\b(personal|private|home|family|husband|children|salary|marriage|kids|age|birth|hobby|hobbies|personal contact|phone number|mobile number|email address|religion|caste)\b/i.test(q) && !q.includes("office") && !q.includes("work") && !q.includes("career")) {
            return "I apologize, but I am programmed to only share verified public-service information. I cannot answer private or personal questions about the officer's family, age, personal contact numbers, or private life.";
        }

        // 3. Emergency Checks (Redirect to 100/112, never handle complaints/emergencies)
        if (/\b(emergency|danger|urgent|threat|save|kill|accident|robbery|theft|murder|assault|fight|help|attack|abuse|violence|crime|police help|hostage|100|112)\b/i.test(q)) {
            return "CRITICAL NOTICE: This assistant cannot handle emergencies, register complaints, or log FIRs.\n\n" +
                   "• For immediate emergencies or urgent police assistance, please call 100 or 112 immediately.\n" +
                   "• To register an official complaint or file an FIR, please visit your local police station or log in to the Andhra Pradesh Police Citizen Portal (https://citizen.appolice.gov.in).";
        }

        // 4. Cyber Crime / Financial Fraud Checks (Redirect to 1930 and cybercrime portal)
        if (/\b(cyber|hack|online|scam|fraud|money|otp|bank|phishing|nude|harass|website|password|card|cybercrime|1930)\b/i.test(q)) {
            return "CYBER SAFETY ADVISORY:\n\n" +
                   "• For online or financial frauds (e.g., OTP scams, unauthorized bank withdrawals, cyber extortion), report immediately to the National Cyber Crime Helpline by dialing 1930.\n" +
                   "• You can register official cyber complaints online at the National Cyber Crime Reporting Portal: https://cybercrime.gov.in\n" +
                   "• For cyber safety resources, check the links listed in our Resources section.";
        }

        // 5. Operation Swechha
        if (/\b(swechha|swecha|child|children|rescue|labor|labour|kid|kids|school)\b/i.test(q)) {
            return "OPERATION SWECHHA DETAILS:\n\n" +
                   "Operation Swechha is a verified statewide child protection campaign led by K.G.V. Saritha, IPS during her tenure at CID in 2023.\n" +
                   "• Total Rescues: 1,500+ child labor victims rescued and liberated from exploitation.\n" +
                   "• Single-Phase Impact: 326 child rescues executed in a single phase of operations.\n" +
                   "• School Reintegration: Hundreds of rescued children were successfully re-admitted to government schools to secure their education.";
        }

        // 6. Educational Qualifications
        if (/\b(education|qualification|degree|university|college|study|topper|gold medal|psychology|law|llm|msc)\b/i.test(q)) {
            return "ACADEMIC QUALIFICATIONS:\n\n" +
                   "• M.Sc. in Psychology: University Topper (informs emotional intelligence and victim assistance in policing).\n" +
                   "• LL.M (Master of Laws): Gold Medallist from Osmania University (grounding administrative choices in legal structure and justice).\n" +
                   "• Academic Distinctions: Recipient of multiple gold medals and academic honors.";
        }

        // 7. Postings / Career Timeline
        if (/\b(career|posting|timeline|promotion|history|join|dsp|sp|dcp|rank|role|assignment|experience|eluru|guntur|bodhan|narsampet|cid)\b/i.test(q)) {
            return "OFFICIAL SERVICE TIMELINE & POSTINGS:\n\n" +
                   "• 2010 – 2020: Early Field Leadership as Deputy Superintendent of Police (DSP - 2010 Batch). Postings include SDPO Bodhan, SDPO Narsampet, SDPO Eluru, and SDPO Guntur West.\n" +
                   "• Women Protection Cell, CID: Additional SP / SP. Supervised state anti-human trafficking units and child safety campaigns.\n" +
                   "• January 2025 – Present: Deputy Commissioner of Police (Administration), NTR District Police Commissionerate, Vijayawada. Leading staff welfare, transparency, and administrative optimizations.";
        }

        // 8. Awards and Honors
        if (/\b(award|medal|honor|honour|recognition|seva|commendation|cm|chief minister|dgp)\b/i.test(q)) {
            return "DECORATIONS & HONORS:\n\n" +
                   "• Andhra Pradesh Police Seva Medal.\n" +
                   "• DGP Commendation Badge.\n" +
                   "• Chief Minister’s Award.\n" +
                   "• NGO & Child Protection Recognition Honors (for anti-trafficking and child rescue contributions).";
        }

        // 9. Contact Details, Appointments, Visiting Hours
        if (/\b(contact|address|office|visit|hours|meet|appointment|email|phone|number|whatsapp|location|office address)\b/i.test(q)) {
            return "OFFICE LOCATION & CONNECT PATHWAYS:\n\n" +
                   "• Office Address: Office of the DCP (Administration), NTR Police Commissionerate Headquarters, Vijayawada, Andhra Pradesh, India.\n" +
                   "• Office Hours: 10:30 AM to 05:00 PM (IST) (Visiting hours by prior appointment).\n" +
                   "• Official Email: Pending official confirmation.\n" +
                   "• Official WhatsApp & Helpline: 9552300009 (AP Police Citizen Services).\n" +
                   "• Public Request: To request a meeting, speech invitation, or coordination, please use the Public Request Form on this portal.";
        }

        // 10. Citizen Services & Resources Section
        if (/\b(resource|link|services|portal|website|faq|form|e-complaint|complaint|download)\b/i.test(q)) {
            return "CITIZEN RESOURCE PORTALS:\n\n" +
                   "You can click on the following verified portals in our Resources section:\n" +
                   "• AP Police Citizen Services: https://citizen.appolice.gov.in (For FIR status, complaints, NOCs)\n" +
                   "• AP Police Main Portal: https://appolice.gov.in\n" +
                   "• For e-complaints or form downloads, go to the 'Official Resources' grid at the bottom of this page.";
        }

        // 11. Speeches / Videos / YouTube
        if (/\b(speech|video|youtube|media|interview|press|anjali|dil se|muralidhar|crime diaries|manastars|speech to students)\b/i.test(q)) {
            return "VERIFIED SPEECHES & VIDEOS:\n\n" +
                   "You can watch these verified public records directly in our Speeches & Media section:\n" +
                   "1. iDream Media 'Dil Se With Anjali' Interview (2020) – Discussing CID operations, women's safety, and policing.\n" +
                   "2. iDream News 'Crime Diaries with Muralidhar #662' Interview (2021) – In-depth case investigations discussions.\n" +
                   "3. Manastars Inspirational Speech to Students (2019) – Value education and discipline talk.\n" +
                   "4. Ramakrishna Math Speech (June 2026) – 'How to Live Courageously in Society?'";
        }

        // 12. General Police Queries (FIR copy, Passport Verification, NOC status, Police Station location)
        if (/\b(fir|passport|noc|verification|station|lodge complaint|file fir|status|police station|general query)\b/i.test(q)) {
            return "GENERAL POLICE SERVICE DESK:\n\n" +
                   "This website is the personal public information portal for the DCP (Administration), Vijayawada, and does not host regional police desk databases.\n" +
                   "• For checking Passport Verification status, NOC applications, FIR downloads, or registering general complaints, please visit the AP Police Citizen Services Portal: https://citizen.appolice.gov.in\n" +
                   "• Alternatively, visit the nearest police station in your jurisdiction.";
        }

        // 13. Greetings
        if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|thanks|thank you|welcome|bye|goodbye|who are you|about you)\b/i.test(q)) {
            if (q.includes('thank') || q.includes('thanks')) {
                return "You are welcome. Please let me know if you need any other official public information regarding K.G.V. Saritha, IPS or AP Police Citizen Resources.";
            }
            if (q.includes('bye') || q.includes('goodbye')) {
                return "Thank you for visiting the portal. Have a safe day ahead.";
            }
            return "Hello! I am the Saritha IPS Public Information Assistant.\n\n" +
                   "You can ask me questions about:\n" +
                   "• Academic credentials (Psychology, LL.M Gold Medal)\n" +
                   "• Career postings & history\n" +
                   "• Operation Swechha (Child rescue statistics)\n" +
                   "• Office address, appointment hours & contact info\n" +
                   "• Speeches, videos, and media interviews\n" +
                   "• AP Police citizen resources & safety helplines";
        }

        // 14. Fallback
        return "I apologize, but I do not have a verified answer for that query. For direct assistance, you may submit a request through the Public Request Form on this page, and the office will review it.\n\n" +
               "• To access the form, scroll down to the 'Official Public Request Form' section.\n" +
               "• For general police services or complaints, please use the official AP Police Citizen Portal at: https://citizen.appolice.gov.in";
    }

    // --- 11. Photo Gallery Carousel / Slider Logic ---
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewSlideshowBtn = document.getElementById('viewSlideshowBtn');
    const galleryGrid = document.querySelector('.gallery-grid');
    const gallerySliderWrapper = document.getElementById('gallerySliderWrapper');
    const gallerySlider = document.getElementById('gallerySlider');
    const sliderPrevBtn = document.getElementById('sliderPrevBtn');
    const sliderNextBtn = document.getElementById('sliderNextBtn');
    const sliderDotsContainer = document.getElementById('sliderDots');

    let currentSlide = 0;
    let slidesCount = 0;
    let autoPlayInterval = null;

    function buildSlides() {
        if (!gallerySlider) return;
        
        // Clear previous slides and dots
        gallerySlider.innerHTML = '';
        if (sliderDotsContainer) {
            sliderDotsContainer.innerHTML = '';
        }
        
        // Find visible gallery items (respecting the active filter)
        const visibleGalleryItems = Array.from(document.querySelectorAll('.gallery-grid .gallery-item')).filter(item => {
            return window.getComputedStyle(item).display !== 'none';
        });

        slidesCount = visibleGalleryItems.length;
        currentSlide = 0;

        if (slidesCount === 0) {
            gallerySlider.innerHTML = '<div style="flex: 0 0 100%; display: flex; align-items: center; justify-content: center; height: 300px; color: var(--text-muted);">No images found in this category.</div>';
            return;
        }

        visibleGalleryItems.forEach((item, index) => {
            const imgEl = item.querySelector('.gallery-item-img');
            const titleEl = item.querySelector('.gallery-item-title');
            const catEl = item.querySelector('.gallery-item-cat');
            const sourceEl = item.querySelector('span[style*="font-size: 0.75rem"]');

            const imgSrc = imgEl ? imgEl.src : '';
            const imgAlt = imgEl ? imgEl.alt : '';
            const titleText = titleEl ? titleEl.textContent : '';
            const catText = catEl ? catEl.textContent : '';
            const sourceText = sourceEl ? sourceEl.textContent : '';

            // Create slide element
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';
            slide.innerHTML = `
                <img src="${imgSrc}" alt="${imgAlt}" class="gallery-slide-img">
                <div class="gallery-slide-overlay">
                    <span class="gallery-slide-cat">${catText}</span>
                    <h4 class="gallery-slide-title">${titleText}</h4>
                    <span class="gallery-slide-source">${sourceText}</span>
                </div>
            `;
            
            // Connect to lightbox modal
            slide.addEventListener('click', () => {
                const lightbox = document.getElementById('lightbox');
                const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
                const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-caption h4') : null;
                const lightboxCat = lightbox ? lightbox.querySelector('.lightbox-caption p') : null;
                
                if (imgSrc && lightboxImg) {
                    lightboxImg.src = imgSrc;
                }
                if (titleText && lightboxTitle) {
                    lightboxTitle.textContent = titleText;
                }
                if (catText && lightboxCat) {
                    lightboxCat.textContent = catText;
                }
                if (lightbox) {
                    lightbox.classList.add('active');
                }
                document.body.style.overflow = 'hidden';
            });
            gallerySlider.appendChild(slide);

            // Create pagination dot
            if (sliderDotsContainer) {
                const dot = document.createElement('button');
                dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetAutoPlay();
                });
                sliderDotsContainer.appendChild(dot);
            }
        });

        updateSliderPosition();
    }

    function goToSlide(index) {
        if (index < 0) {
            currentSlide = slidesCount - 1;
        } else if (index >= slidesCount) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        updateSliderPosition();
    }

    function updateSliderPosition() {
        if (gallerySlider) {
            gallerySlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Update active class on dots
        const dots = sliderDotsContainer ? sliderDotsContainer.querySelectorAll('.slider-dot') : [];
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 4000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function resetAutoPlay() {
        if (gallerySliderWrapper && gallerySliderWrapper.style.display !== 'none') {
            startAutoPlay();
        }
    }

    if (viewGridBtn && viewSlideshowBtn && galleryGrid && gallerySliderWrapper) {
        viewGridBtn.addEventListener('click', () => {
            viewGridBtn.classList.add('active');
            viewSlideshowBtn.classList.remove('active');
            galleryGrid.style.display = 'grid';
            gallerySliderWrapper.style.display = 'none';
            stopAutoPlay();
        });

        viewSlideshowBtn.addEventListener('click', () => {
            viewSlideshowBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
            galleryGrid.style.display = 'none';
            gallerySliderWrapper.style.display = 'block';
            buildSlides();
            startAutoPlay();
        });

        if (sliderPrevBtn) {
            sliderPrevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetAutoPlay();
            });
        }

        if (sliderNextBtn) {
            sliderNextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetAutoPlay();
            });
        }

        // Hover events to pause slideshow
        gallerySliderWrapper.addEventListener('mouseenter', stopAutoPlay);
        gallerySliderWrapper.addEventListener('mouseleave', resetAutoPlay);

        // Listen to tab filters to rebuild slides dynamically if currently active
        const galleryFilters = document.querySelectorAll('.gallery-filters .tab-btn');
        galleryFilters.forEach(filterBtn => {
            filterBtn.addEventListener('click', () => {
                setTimeout(() => {
                    if (gallerySliderWrapper.style.display !== 'none') {
                        buildSlides();
                        resetAutoPlay();
                    }
                }, 100);
            });
        });
    }
});

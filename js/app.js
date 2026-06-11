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
        const q = query.toLowerCase().trim();

        // 1. Emergency Checks
        if (/\b(emergency|danger|urgent|threat|save|kill|accident|robbery|theft|murder|assault|fight|help|attack|abuse|violence|crime|police help|100|112)\b/i.test(q)) {
            return "NOTICE: This assistant cannot register complaints, log FIRs, or respond to active crimes.\n\n" +
                   "• For immediate emergencies or life-threatening situations, please call 100 or 112 immediately.\n" +
                   "• To register an official complaint or file an FIR, please visit your local police station or log in to the Andhra Pradesh Police Citizen Portal (https://citizen.appolice.gov.in).";
        }

        // 2. Cyber Crime / Financial Fraud Checks
        if (/\b(cyber|hack|online|scam|fraud|money|otp|bank|phishing|nude|harass|website|password|card)\b/i.test(q)) {
            return "CYBER SAFETY ADVISORY:\n\n" +
                   "• For online or financial frauds (e.g., OTP scams, unauthorized bank withdrawals, hacking), please report immediately to the National Cyber Crime Helpline by dialing 1930.\n" +
                   "• You can register official cyber complaints online at: https://cybercrime.gov.in\n" +
                   "• For cyber security guidance, check the resources listed on our website.";
        }

        // 3. Operation Swechha
        if (/\b(swechha|swecha|child|children|rescue|labor|labour|kid|kids|school)\b/i.test(q)) {
            return "OPERATION SWECHHA DETAILS:\n\n" +
                   "Operation Swechha is a verified statewide child protection campaign led by K.G.V. Saritha, IPS during tenure at CID in 2023.\n" +
                   "• Total Rescues: 1,500+ child labor victims rescued and liberated from exploitation.\n" +
                   "• Single-Phase Impact: 326 child rescues executed in a single phase of operations.\n" +
                   "• School Reintegration: Hundreds of rescued children were successfully re-admitted to government schools to secure their futures.";
        }

        // 4. Educational Qualifications
        if (/\b(education|qualification|degree|university|college|study|topper|gold medal|psychology|law|llm|msc)\b/i.test(q)) {
            return "ACADEMIC QUALIFICATIONS:\n\n" +
                   "• M.Sc. in Psychology: University Topper (informs emotional intelligence and victim assistance in policing).\n" +
                   "• LL.M (Master of Laws): Gold Medallist from Osmania University (grounding administrative choices in legal structure and justice).\n" +
                   "• Academic Distinctions: Recipient of multiple gold medals and academic honors.";
        }

        // 5. Postings / Career Timeline
        if (/\b(career|posting|timeline|promotion|history|join|dsp|sp|dcp|rank|role|assignment|experience|eluru|guntur|bodhan|narsampet|cid)\b/i.test(q)) {
            return "OFFICIAL SERVICE TIMELINE & POSTINGS:\n\n" +
                   "• 2010 – 2020: Early Field Leadership as Deputy Superintendent of Police (DSP - 2010 Batch). Postings include SDPO Bodhan, SDPO Narsampet, SDPO Eluru, and SDPO Guntur West.\n" +
                   "• Women Protection Cell, CID: Additional SP / SP. Supervised state anti-human trafficking units and child safety campaigns.\n" +
                   "• January 2025 – Present: Deputy Commissioner of Police (Administration), NTR District Police Commissionerate, Vijayawada. Leading staff welfare, transparency, and administrative optimizations.";
        }

        // 6. Awards and Honors
        if (/\b(award|medal|honor|honour|recognition|seva|commendation|cm|chief minister|dgp)\b/i.test(q)) {
            return "DECORATIONS & HONORS:\n\n" +
                   "• Andhra Pradesh Police Seva Medal.\n" +
                   "• DGP Commendation Badge.\n" +
                   "• Chief Minister’s Award.\n" +
                   "• NGO & Child Protection Recognition Honors (for anti-trafficking and child rescue contributions).";
        }

        // 7. Contact Details, Appointments, Visiting Hours
        if (/\b(contact|address|office|visit|hours|meet|appointment|email|phone|number|whatsapp|location|office address)\b/i.test(q)) {
            return "OFFICE LOCATION & CONNECT PATHWAYS:\n\n" +
                   "• Office Address: Office of the DCP (Administration), NTR Police Commissionerate Headquarters, Vijayawada, Andhra Pradesh, India.\n" +
                   "• Office Hours: 10:30 AM to 05:00 PM (IST) (Visiting hours by prior appointment).\n" +
                   "• Official Email: cp@vza.appolice.gov.in (Mark attention: 'DCP Administration').\n" +
                   "• Official WhatsApp & Helpline: 9552300009 (AP Police Citizen Services).\n" +
                   "• Public Request: To request a meeting, speech invitation, or coordination, please use the Public Request Form on this portal.";
        }

        // 8. Citizen Services & Resources Section
        if (/\b(resource|link|services|portal|website|faq|form|e-complaint|complaint|download)\b/i.test(q)) {
            return "CITIZEN RESOURCE PORTALS:\n\n" +
                   "You can click on the following verified portals in our Resources section:\n" +
                   "• AP Police Citizen Services: https://citizen.appolice.gov.in (For FIR status, complaints, NOCs)\n" +
                   "• AP Police Main Portal: https://appolice.gov.in\n" +
                   "• For e-complaints or form downloads, go to the 'Official Resources' grid at the bottom of this page.";
        }

        // 9. Speeches / Videos / YouTube
        if (/\b(speech|video|youtube|media|interview|press|anjali|dil se|muralidhar|crime diaries|manastars|speech to students)\b/i.test(q)) {
            return "VERIFIED SPEECHES & VIDEOS:\n\n" +
                   "You can watch these verified public records directly in our Speeches & Media section:\n" +
                   "1. iDream Media 'Dil Se With Anjali' Interview (2020) – Discussing CID operations, women's safety, and policing.\n" +
                   "2. iDream News 'Crime Diaries with Muralidhar #662' Interview (2021) – In-depth case investigations discussions.\n" +
                   "3. Manastars Inspirational Speech to Students (2019) – Value education and discipline talk.\n" +
                   "4. Ramakrishna Math Speech (June 2026) – 'How to Live Courageously in Society?'";
        }

        // 10. General Police Queries (FIR copy, Passport Verification, NOC status, Police Station location)
        if (/\b(fir|passport|noc|verification|station|lodge complaint|file fir|status|police station|general query)\b/i.test(q)) {
            return "GENERAL POLICE SERVICE DESK:\n\n" +
                   "This website is the personal public information portal for the DCP (Administration), Vijayawada, and does not host regional police desk databases.\n" +
                   "• For checking Passport Verification status, NOC applications, FIR downloads, or registering general complaints, please visit the AP Police Citizen Services Portal: https://citizen.appolice.gov.in\n" +
                   "• Alternatively, visit the nearest police station in your jurisdiction.";
        }

        // 11. Greetings
        if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|thanks|thank you|welcome|bye|goodbye|who are you|about you)\b/i.test(q)) {
            if (q.includes('thank') || q.includes('thanks')) {
                return "You are welcome. Please let me know if you need any other official public information regarding K.G.V. Saritha, IPS or AP Police Citizen Resources.";
            }
            if (q.includes('bye') || q.includes('goodbye')) {
                return "Thank you for visiting the portal. Have a safe day ahead.";
            }
            return "Hello! I am the K.G.V. Saritha IPS Public Information Assistant.\n\n" +
                   "You can ask me questions about:\n" +
                   "• Academic credentials (Psychology, LL.M Gold Medal)\n" +
                   "• Career postings & history\n" +
                   "• Operation Swechha (Child rescue statistics)\n" +
                   "• Office address, appointment hours & contact info\n" +
                   "• Speeches, videos, and media interviews\n" +
                   "• AP Police citizen resources & safety helplines";
        }

        // 12. Fallback
        return "I apologize, but I can only answer queries directly relating to the verified public information available on this portal.\n\n" +
               "• For official meeting requests, academic session invitations, or administrative queries, please use the Public Request Form on this page.\n" +
               "• For general police services or complaints, please use the official AP Police Citizen Portal at: https://citizen.appolice.gov.in";
    }
});

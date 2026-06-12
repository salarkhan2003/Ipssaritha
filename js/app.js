document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon-sun') : null;
    const moonIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon-moon') : null;

    // Load saved preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
    } else {
        document.body.classList.remove('light-mode');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            if (isLight) {
                if (sunIcon) sunIcon.classList.add('hidden');
                if (moonIcon) moonIcon.classList.remove('hidden');
            } else {
                if (sunIcon) sunIcon.classList.remove('hidden');
                if (moonIcon) moonIcon.classList.add('hidden');
            }
        });
    }

    // --- 1. Navbar Scroll glassmorphism effect ---
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- 2. Simple Parallax logic for cards & content ---
    const heroWrapper = document.getElementById('hero-content-wrapper');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Parallax cards scroll offset
        document.querySelectorAll('.parallax-card-up').forEach(el => {
            el.style.setProperty('--scroll-offset-up', `${scrolled * -0.05}px`);
        });
        document.querySelectorAll('.parallax-card-down').forEach(el => {
            el.style.setProperty('--scroll-offset-down', `${scrolled * 0.05}px`);
        });

        // Parallax hero content fading/moving
        if (heroWrapper && scrolled < 1000) {
            heroWrapper.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroWrapper.style.opacity = Math.max(0, 1 - scrolled / 600);
        }
    });

    // --- 3. Digital clock in Vijayawada Timezone (IST) ---
    function updateTime() {
        const clockEl = document.getElementById('current-time');
        if (!clockEl) return;
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
        clockEl.textContent = now.toLocaleTimeString('en-US', options);
    }
    setInterval(updateTime, 1000);
    updateTime();

    // --- 4. Hero Subtitle Typewriter Effect ---
    const words = ["Public Information Portal", "Citizen Support & Outreach", "Official Police Updates", "Community Safety Cell"];
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
        heroSubtitle.textContent = "";
        setTimeout(type, 500);
    }

    // --- 5. Intersection Observer for Scroll Animations ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Staggered observer backup helper
    function revealBackupFailsafe() {
        const reveals = document.querySelectorAll('.reveal:not(.active)');
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= windowHeight - 10 && rect.bottom >= 0) {
                el.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', revealBackupFailsafe);
    window.addEventListener('load', revealBackupFailsafe);
    setTimeout(revealBackupFailsafe, 200);

    // --- 6. Counter Animation ---
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
    }, { threshold: 0.1 });
    
    counters.forEach(c => counterObserver.observe(c));

    // --- 7. Speeches & Media / Press Filter Tabs ---
    const mediaTabButtons = document.querySelectorAll('.speeches-media-tabs .tab-btn');
    const mediaCards = document.querySelectorAll('.media-grid .media-card');

    if (mediaTabButtons.length > 0) {
        mediaTabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                mediaTabButtons.forEach(b => {
                    b.classList.remove('active', 'bg-white', 'text-black');
                    b.classList.add('bg-white/5', 'text-gray-400');
                });
                btn.classList.add('active', 'bg-white', 'text-black');
                btn.classList.remove('bg-white/5', 'text-gray-400');

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

    // --- 8. Photo Gallery Filter Tabs ---
    const galleryTabButtons = document.querySelectorAll('.gallery-filters .tab-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

    if (galleryTabButtons.length > 0) {
        galleryTabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                galleryTabButtons.forEach(b => {
                    b.classList.remove('active', 'bg-[#FF4500]', 'text-white');
                    b.classList.add('bg-white/5', 'text-gray-400');
                });
                btn.classList.add('active', 'bg-[#FF4500]', 'text-white');
                btn.classList.remove('bg-white/5', 'text-gray-400');

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
                
                // Rebuild slideshow if active
                if (gallerySliderWrapper && gallerySliderWrapper.style.display !== 'none') {
                    buildSlides();
                }
            });
        });
    }

    // --- 9. Photo Gallery Lightbox Modal ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-caption h4') : null;
    const lightboxCat = lightbox ? lightbox.querySelector('.lightbox-caption p') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    if (galleryItems.length > 0 && lightbox && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const titleEl = item.querySelector('h4');
                const catEl = item.querySelector('span');
                
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
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.lightbox-close')) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // --- 10. Video Player Modal ---
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
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        videoModalClose.addEventListener('click', closeVideoModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal || e.target.closest('.video-modal-close')) {
                closeVideoModal();
            }
        });

        function closeVideoModal() {
            videoModal.classList.remove('active');
            if (videoIframe) {
                videoIframe.src = '';
            }
            document.body.style.overflow = '';
        }
    }

    // --- 11. Contact Form Redirection (WhatsApp & Email) ---
    const contactForm = document.getElementById('contactForm');
    const submitMsg = document.getElementById('submitMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

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

            if (submitMsg) {
                submitMsg.textContent = `Thank you, ${name}! Your message has been prepared for dispatch via ${channel.toUpperCase()}.`;
                submitMsg.style.display = 'block';
                submitMsg.classList.remove('hidden', 'bg-red-500/20', 'text-red-300');
                submitMsg.classList.add('bg-green-500/20', 'text-green-300');
            }
            contactForm.reset();

            setTimeout(() => {
                if (submitMsg) {
                    submitMsg.style.display = 'none';
                    submitMsg.classList.add('hidden');
                }
            }, 6000);
        });
    }

    // --- 12. AI Public Information Assistant Chatbot ---
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');

    if (chatbotToggle && chatbotWindow && chatbotClose) {
        chatbotToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow.classList.toggle('active');
            chatbotWindow.classList.toggle('opacity-0');
            chatbotWindow.classList.toggle('scale-95');
            chatbotWindow.classList.toggle('pointer-events-none');
            if (chatbotMessages) {
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            chatbotWindow.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        });

        chatbotSend.addEventListener('click', handleUserSendMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserSendMessage();
            }
        });

        // Close chatbot when clicking outside the widget window
        document.addEventListener('click', (e) => {
            if (chatbotWindow.classList.contains('active')) {
                if (!chatbotWindow.contains(e.target) && !chatbotToggle.contains(e.target)) {
                    chatbotWindow.classList.remove('active');
                    chatbotWindow.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                }
            }
        });
    }

    function appendMessage(text, sender) {
        if (!chatbotMessages) return;
        const msgDiv = document.createElement('div');
        if (sender === 'user') {
            msgDiv.className = 'bg-[#FF4500] text-white rounded-2xl p-3 max-w-[85%] self-end text-sm';
            msgDiv.textContent = text;
        } else {
            msgDiv.className = 'bg-white/5 border border-white/5 rounded-2xl p-3 text-gray-300 max-w-[85%] self-start text-sm';
            
            // Simple markdown parser to support formatting/links in replies
            let formattedText = text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="underline text-[#FF4500] hover:text-white">$1</a>');
            msgDiv.innerHTML = formattedText;
        }
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function handleUserSendMessage() {
        if (!chatbotInput) return;
        const text = chatbotInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        chatbotInput.value = '';

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'bg-white/5 border border-white/5 rounded-2xl p-3 text-gray-400 max-w-[85%] self-start text-sm animate-pulse italic';
        typingIndicator.innerText = 'Typing...';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        setTimeout(() => {
            typingIndicator.remove();
            const reply = getChatbotResponse(text);
            appendMessage(reply, 'assistant');
        }, 600);
    }

    function renderPreloadedQuestions() {
        if (!chatbotMessages) return;
        if (chatbotMessages.querySelector('.preloaded-chips-container')) return;

        const preloadedQA = [
            { question: "Cyber Fraud?", key: "cyber" },
            { question: "Office Location?", key: "contact" },
            { question: "Online Portal?", key: "resource" },
            { question: "WhatsApp Helpline?", key: "whatsapp" },
            { question: "Swechha Campaign?", key: "swechha" }
        ];

        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'flex flex-wrap gap-2 my-2 preloaded-chips-container';
        
        preloadedQA.forEach((qa) => {
            const chip = document.createElement('button');
            chip.className = 'px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-[#FF4500]/10 hover:border-[#FF4500] text-xs text-gray-300 hover:text-white transition duration-300 text-left';
            chip.innerText = qa.question;
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                if (chatbotInput) {
                    chatbotInput.value = qa.question;
                    handleUserSendMessage();
                }
            });
            chipsContainer.appendChild(chip);
        });
        
        chatbotMessages.appendChild(chipsContainer);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    if (chatbotMessages) {
        setTimeout(renderPreloadedQuestions, 1000);
    }

    function getChatbotResponse(query) {
        const q = query.toLowerCase().trim();

        if (/\b(are you saritha|who are you|your name|introduce yourself|saritha ips)\b/i.test(q) && (q.includes("are you") || q.includes("your name") || q.includes("who is") || q.includes("who are"))) {
            return "I am the Saritha IPS Public Information Assistant, an automated information tool. I am not Smt. K.G.V. Saritha, IPS, and I do not represent her personally. I can only help you find verified public information available on this portal.";
        }

        if (/\b(personal|private|home|family|husband|children|salary|marriage|kids|age|birth|hobby|hobbies|personal contact|phone number|mobile number|email address|religion|caste)\b/i.test(q) && !q.includes("office") && !q.includes("work") && !q.includes("career")) {
            return "I apologize, but I am programmed to only share verified public-service information. I cannot answer private or personal questions about the officer's family, age, personal contact numbers, or private life.";
        }

        if (/\b(emergency|danger|urgent|threat|save|kill|accident|robbery|theft|murder|assault|fight|help|attack|abuse|violence|crime|police help|hostage|100|112)\b/i.test(q)) {
            return "CRITICAL NOTICE: This assistant cannot handle emergencies, register complaints, or log FIRs.\n\n• For immediate emergencies or urgent police assistance, please call 100 or 112 immediately.\n• To register an official complaint or file an FIR, please visit your local police station or log in to the Andhra Pradesh Police Citizen Portal (https://citizen.appolice.gov.in).";
        }

        if (/\b(cyber|hack|online|scam|fraud|money|otp|bank|phishing|nude|harass|website|password|card|cybercrime|1930)\b/i.test(q)) {
            return "CYBER SAFETY ADVISORY:\n\n• For online or financial frauds, report immediately to the National Cyber Crime Helpline by dialing 1930.\n• You can register official cyber complaints online at: https://cybercrime.gov.in";
        }

        if (/\b(swechha|swecha|child|children|rescue|labor|labour|kid|kids|school)\b/i.test(q)) {
            return "OPERATION SWECHHA DETAILS:\n\nOperation Swechha is a verified statewide child protection campaign led by K.G.V. Saritha, IPS during her tenure at CID in 2023.\n• Total Rescues: 1,500+ child labor victims rescued.\n• Single-Phase Impact: 326 child rescues executed in a single phase.\n• School Reintegration: Rescued children were successfully re-admitted to government schools.";
        }

        if (/\b(education|qualification|degree|university|college|study|topper|gold medal|psychology|law|llm|msc)\b/i.test(q)) {
            return "ACADEMIC QUALIFICATIONS:\n\n• M.Sc. in Psychology: University Topper.\n• LL.M (Master of Laws): Gold Medallist from Osmania University.\n• Academic Distinctions: Recipient of multiple gold medals and academic honors.";
        }

        if (/\b(career|posting|timeline|promotion|history|join|dsp|sp|dcp|rank|role|assignment|experience|eluru|guntur|bodhan|narsampet|cid)\b/i.test(q)) {
            return "OFFICIAL SERVICE TIMELINE & POSTINGS:\n\n• 2010 – 2020: Early Field Leadership as DSP. Postings include SDPO Bodhan, SDPO Narsampet, SDPO Eluru, and SDPO Guntur West.\n• Women Protection Cell, CID: Additional SP / SP. Supervised state anti-human trafficking units.\n• January 2025 – Present: Deputy Commissioner of Police (Administration), NTR District Police Commissionerate, Vijayawada.";
        }

        if (/\b(award|medal|honor|honour|recognition|seva|commendation|cm|chief minister|dgp)\b/i.test(q)) {
            return "DECORATIONS & HONORS:\n\n• Andhra Pradesh Police Seva Medal.\n• DGP Commendation Badge.\n• Chief Minister’s Award.";
        }

        if (/\b(contact|address|office|visit|hours|meet|appointment|email|phone|number|whatsapp|location|office address)\b/i.test(q)) {
            return "OFFICE LOCATION & CONNECT PATHWAYS:\n\n• Office Address: Office of the DCP (Administration), NTR Police Commissionerate Headquarters, Vijayawada, AP, India.\n• Office Hours: 10:30 AM to 05:00 PM (Visiting hours by prior appointment).\n• Official Whatsapp: 9552300009.\n• Public Request: To request a meeting or invite the officer, please use the Public Request Form on this portal.";
        }

        if (/\b(resource|link|services|portal|website|faq|form|e-complaint|complaint|download)\b/i.test(q)) {
            return "CITIZEN RESOURCE PORTALS:\n\n• AP Police Citizen Services: https://citizen.appolice.gov.in\n• AP Police Main Portal: https://appolice.gov.in\n• For e-complaints or form downloads, go to the 'Official Resources' grid at the bottom of this page.";
        }

        if (/\b(speech|video|youtube|media|interview|press|anjali|dil se|muralidhar|crime diaries|manastars|speech to students)\b/i.test(q)) {
            return "VERIFIED SPEECHES & VIDEOS:\n\nYou can watch these verified public records in our Speeches & Media section:\n1. iDream Media 'Dil Se With Anjali' Interview (2020)\n2. iDream News 'Crime Diaries with Muralidhar' Interview (2021)\n3. Manastars Inspirational Speech to Students (2019)\n4. Ramakrishna Math Speech (June 2026)";
        }

        if (/\b(fir|passport|noc|verification|station|lodge complaint|file fir|status|police station|general query)\b/i.test(q)) {
            return "GENERAL POLICE SERVICES:\n\n• For checking Passport Verification status, NOC applications, FIR downloads, or registering general complaints, please visit the AP Police Citizen Services Portal: https://citizen.appolice.gov.in";
        }

        if (/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|thanks|thank you|welcome|bye|goodbye|who are you|about you)\b/i.test(q)) {
            if (q.includes('thank') || q.includes('thanks')) {
                return "You are welcome. Please let me know if you need any other official public information.";
            }
            if (q.includes('bye') || q.includes('goodbye')) {
                return "Thank you for visiting the portal. Have a safe day ahead.";
            }
            return "Hello! I am the Saritha IPS Public Information Assistant.\n\nYou can ask me about:\n• Academic credentials\n• Career postings & history\n• Operation Swechha (Child rescue statistics)\n• Office address & contact info\n• Speeches, videos, and media interviews\n• AP Police resources & safety helplines";
        }

        return "I apologize, but I do not have a verified answer for that query. For direct assistance, you may submit a request through the Public Request Form on this page, and the office will review it.\n\n• To access the form, scroll down to the 'Official Public Request Form' section.";
    }

    // --- 13. Photo Gallery Carousel / Slideshow Slider Logic ---
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
        
        gallerySlider.innerHTML = '';
        if (sliderDotsContainer) {
            sliderDotsContainer.innerHTML = '';
        }
        
        // Find visible gallery items (respecting filters)
        const visibleGalleryItems = Array.from(document.querySelectorAll('.gallery-grid .gallery-item')).filter(item => {
            return window.getComputedStyle(item).display !== 'none';
        });

        slidesCount = visibleGalleryItems.length;
        currentSlide = 0;

        if (slidesCount === 0) {
            gallerySlider.innerHTML = '<div style="flex: 0 0 100%; display: flex; align-items: center; justify-content: center; height: 300px; color: #555;">No images found in this category.</div>';
            return;
        }

        visibleGalleryItems.forEach((item, index) => {
            const imgEl = item.querySelector('img');
            const titleEl = item.querySelector('h4');
            const catEl = item.querySelector('span');

            const imgSrc = imgEl ? imgEl.src : '';
            const imgAlt = imgEl ? imgEl.alt : '';
            const titleText = titleEl ? titleEl.textContent : '';
            const catText = catEl ? catEl.textContent : '';

            // Create slide element
            const slide = document.createElement('div');
            slide.className = 'gallery-slide flex-shrink-0 w-full aspect-video relative cursor-pointer';
            slide.innerHTML = `
                <img src="${imgSrc}" alt="${imgAlt}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 flex flex-col justify-end">
                    <span class="text-[#FF4500] text-xs font-mono uppercase mb-2">${catText}</span>
                    <h4 class="text-2xl font-serif text-white font-medium">${titleText}</h4>
                </div>
            `;
            
            // Connect to lightbox
            slide.addEventListener('click', () => {
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

            // Create dot
            if (sliderDotsContainer) {
                const dot = document.createElement('button');
                dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-[#FF4500] w-4' : 'bg-white/20 hover:bg-white/40'}`;
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
        if (!gallerySlider) return;
        gallerySlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        gallerySlider.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        
        // Update dots styling
        if (sliderDotsContainer) {
            const dots = sliderDotsContainer.children;
            Array.from(dots).forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.className = 'w-4 h-2 rounded-full bg-[#FF4500] transition-all duration-300';
                } else {
                    dot.className = 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 transition-all duration-300';
                }
            });
        }
    }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    if (viewGridBtn && viewSlideshowBtn && galleryGrid && gallerySliderWrapper) {
        viewGridBtn.addEventListener('click', () => {
            viewGridBtn.classList.add('active', 'bg-white/5');
            viewSlideshowBtn.classList.remove('active', 'bg-white/5');
            galleryGrid.style.display = 'grid';
            gallerySliderWrapper.style.display = 'none';
            stopAutoPlay();
        });

        viewSlideshowBtn.addEventListener('click', () => {
            viewSlideshowBtn.classList.add('active', 'bg-white/5');
            viewGridBtn.classList.remove('active', 'bg-white/5');
            galleryGrid.style.display = 'none';
            gallerySliderWrapper.style.display = 'block';
            buildSlides();
            startAutoPlay();
        });
    }

    if (sliderPrevBtn && sliderNextBtn) {
        sliderPrevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoPlay();
        });
        sliderNextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoPlay();
        });
    }});

/**
 * PMK Landing Page - Interactive JavaScript Functions
 * - Mobile navigation menu toggling
 * - Accordion logic for Rules & Criteria
 * - FAQ Accordion toggling
 * - Click analytics tracking (ready for Google Tag Manager / Meta Pixel)
 * - Smooth navigation highlights
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Send Page View Event to Console Analytics
    logAnalyticsEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = menuToggle.querySelector('.material-symbols-outlined');
            if (mobileMenu.classList.contains('open')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });

        // Close menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.querySelector('.material-symbols-outlined').textContent = 'menu';
            });
        });
    }

    // 3. Detail Accordion (Syarat/Ketentuan & Kriteria Penilaian Lomba)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const wrapper = header.parentElement;
            const content = wrapper.querySelector('.accordion-content');
            
            // Toggle active class on header
            header.classList.toggle('active');
            
            // Toggle content expansion
            if (header.classList.contains('active')) {
                content.classList.add('show');
                content.style.maxHeight = content.scrollHeight + 'px';
                
                // Clear any existing timeout and set max-height to none after transition
                if (content.dataset.timeoutId) {
                    clearTimeout(parseInt(content.dataset.timeoutId));
                }
                const tid = setTimeout(() => {
                    if (header.classList.contains('active')) {
                        content.style.maxHeight = 'none';
                    }
                }, 300);
                content.dataset.timeoutId = tid;
            } else {
                // If it was 'none', set it to scrollHeight first to animate properly
                if (content.style.maxHeight === 'none' || !content.style.maxHeight) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.offsetHeight; // Force reflow
                }
                
                setTimeout(() => {
                    content.style.maxHeight = '0px';
                }, 10);

                if (content.dataset.timeoutId) {
                    clearTimeout(parseInt(content.dataset.timeoutId));
                }
                const tid = setTimeout(() => {
                    if (!header.classList.contains('active')) {
                        content.classList.remove('show');
                    }
                }, 300);
                content.dataset.timeoutId = tid;
            }
        });
    });

    // 4. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question-btn');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const answer = faqItem.querySelector('.faq-answer-content');
            
            // Close other FAQs (Accordion behavior)
            faqQuestions.forEach(otherBtn => {
                if (otherBtn !== btn && otherBtn.classList.contains('active')) {
                    otherBtn.classList.remove('active');
                    const otherAnswer = otherBtn.parentElement.querySelector('.faq-answer-content');
                    
                    if (otherAnswer.style.maxHeight === 'none' || !otherAnswer.style.maxHeight) {
                        otherAnswer.style.maxHeight = otherAnswer.scrollHeight + 'px';
                        otherAnswer.offsetHeight;
                    }
                    setTimeout(() => {
                        otherAnswer.style.maxHeight = '0px';
                    }, 10);
                    
                    setTimeout(() => {
                        if (!otherBtn.classList.contains('active')) {
                            otherAnswer.classList.remove('show');
                        }
                    }, 300);
                }
            });

            // Toggle current FAQ
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                answer.classList.add('show');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
                if (answer.dataset.timeoutId) {
                    clearTimeout(parseInt(answer.dataset.timeoutId));
                }
                const tid = setTimeout(() => {
                    if (btn.classList.contains('active')) {
                        answer.style.maxHeight = 'none';
                    }
                }, 300);
                answer.dataset.timeoutId = tid;
            } else {
                if (answer.style.maxHeight === 'none' || !answer.style.maxHeight) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.offsetHeight;
                }
                setTimeout(() => {
                    answer.style.maxHeight = '0px';
                }, 10);
                
                if (answer.dataset.timeoutId) {
                    clearTimeout(parseInt(answer.dataset.timeoutId));
                }
                const tid = setTimeout(() => {
                    if (!btn.classList.contains('active')) {
                        answer.classList.remove('show');
                    }
                }, 300);
                answer.dataset.timeoutId = tid;
            }
        });
    });

    // 5. Track Interactive Clicks
    const trackableElements = document.querySelectorAll('[data-track-click]');
    
    trackableElements.forEach(el => {
        el.addEventListener('click', () => {
            const eventName = el.getAttribute('data-track-click');
            const targetUrl = el.getAttribute('href') || el.getAttribute('action') || 'N/A';
            const elementText = el.textContent.trim().replace(/\s+/g, ' ');

            // Map custom analytics tracking payload
            logAnalyticsEvent(eventName, {
                element_text: elementText,
                target_url: targetUrl,
                timestamp: new Date().toISOString()
            });

            // If it's a registration button, also trigger registration_start event and Meta Pixel InitiateCheckout
            if (targetUrl.includes('bit.ly/') || eventName.includes('register') || eventName.includes('cta_hero') || eventName.includes('sticky_cta')) {
                logAnalyticsEvent('registration_start', {
                    source: eventName,
                    destination: 'Google Form'
                });
                
                // Meta Pixel InitiateCheckout
                if (typeof fbq === 'function') {
                    fbq('track', 'InitiateCheckout');
                }
            }
        });
    });

    // 6. Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id], div[id], header');
    const navLinks = document.querySelectorAll('.navbar-links .nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Offset for sticky navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}` || (currentSectionId === null && href === '#')) {
                link.classList.add('active-nav');
            }
        });
    });
});

/**
 * Analytics log helper
 * @param {string} eventName Name of the event tracked
 * @param {object} properties Metadata attributes related to the event
 */
function logAnalyticsEvent(eventName, properties) {
    console.log(`[Analytics Tracking] Event: "${eventName}"`, properties);
    
    // Developer Hooks for Meta Pixel / GTM:
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({ event: eventName, ...properties });
    // if (typeof fbq === 'function') fbq('trackCustom', eventName, properties);
}

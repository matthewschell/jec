/* components.js - Enhanced Validation & Cloudflare Integration */
/* Production Build - Final V4 */

// ==========================================
// 1. SHARED HTML COMPONENTS
// ==========================================

const SHARED_HEADER = `
<div class="container nav-wrapper">
    <a href="/" class="logo">
        <img src="pai/logos/logo.webp" alt="JEC Logo" width="50" height="50">
        <div class="logo-text-group">
            <span class="logo-name">JOHNSTON</span>
            <span class="logo-tagline">ELECTRICAL & CONTRACTING</span>
        </div>
    </a>

    <button class="mobile-menu-btn" aria-label="Toggle navigation menu" aria-expanded="false">
        <i class="fas fa-bars"></i>
    </button>

    <ul class="nav-links">
        <li><a href="/#services">Services</a></li>
        <li><a href="/#projects">Our Work</a></li>
        <li><a href="/#reviews">Reviews</a></li>
        <li><a href="/#faq">FAQ</a></li>
        <li><button class="btn btn-primary nav-cta" data-action="open-modal">Get a Quote</button></li>
    </ul>
</div>
`;

const SHARED_FOOTER = `
<div class="container">
    <div class="services-grid footer-grid">
        <div>
            <h4>Johnston Electrical & Contracting</h4>
            <p>
                Family Owned & Operated.
                <br><strong class="text-white">Proudly Canadian</strong> 
                <i class="fab fa-canadian-maple-leaf canadian-flag"></i>
                <br><strong>Serving:</strong> Kawartha Lakes • Woodville • <a href="/lindsay-electrician.html">Lindsay</a> • Little Britain • Cannington • Fenelon Falls • Beaverton • Manilla and Surrounding Areas
            </p>
            <p class="license-text">
                <strong>ECRA/ESA License # 7015677</strong><br> Fully Insured & WSIB Compliant
            </p>
            <div class="footer-logos">
                <img src="pai/logos/esa-logo.webp" alt="ECRA ESA Licensed Electrical Contractor" class="footer-logo-img logo-white-bg" loading="lazy" width="100" height="50">
                <img src="pai/logos/baeumler-logo.webp" alt="Baeumler Approved" class="footer-logo-img" loading="lazy" width="100" height="50">
            </div>
        </div>
        <div>
            <h4>Quick Links</h4>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/#services">Services</a></li>
                <li><a href="/#projects">Gallery</a></li>
                <li><a href="/#reviews">Reviews</a></li>
                <li><a href="/#community">Community</a></li>
                <li><a href="/#faq">FAQ</a></li>
            </ul>
        </div>
        <div>
            <h4>Contact Us</h4>
            <ul>
                <li><i class="fas fa-phone"></i> <a href="tel:7053447770">Call Us: 705-344-7770</a></li>
                <li><i class="fas fa-envelope"></i> <a href="mailto:office@jecgroup.ca">office@jecgroup.ca</a></li>
                <li><i class="fas fa-map-marker-alt"></i> Kawartha Lakes, ON</li>
            </ul>
        </div>
    </div>
    <div class="text-center footer-copyright">
        <div class="social-links">
            <a href="https://www.facebook.com/JohnstonEC" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page">
                <i class="fab fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/johnstonelectricalcontracting" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page">
                <i class="fab fa-instagram"></i>
            </a>
        </div>
        <p>&copy; 2025 Johnston Electrical & Contracting. <br/>All Rights Reserved. | <a href="/privacy-policy.html" style="color: #ccc; text-decoration: underline;">Privacy Policy</a></p>
    </div>
</div>
`;

// ==========================================
// 2. INJECTION & NAVIGATION LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Inject Header & Footer
    const headerEl = document.querySelector('header');
    if (headerEl) headerEl.innerHTML = SHARED_HEADER;

    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.innerHTML = SHARED_FOOTER;
        footerEl.classList.remove('simple-footer');
    }

    // Smart Link Logic
    const path = window.location.pathname;
    const isHomePage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    
    if (isHomePage) {
        document.querySelectorAll('a[href^="index.html#"]').forEach(link => {
            const newHref = link.getAttribute('href').replace('index.html', '');
            link.setAttribute('href', newHref);
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', isExpanded);
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });          
     
        document.querySelectorAll('.nav-links a, .nav-links button').forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // Modal Logic
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close-modal');
    
    window.openModal = function() { 
        if (modal) {
            modal.style.display = 'flex';
        } else {
            window.location.href = "/?openquote=true"; 
        }
    };

    if (new URLSearchParams(window.location.search).get('openquote') === 'true') {
        setTimeout(() => {
            window.openModal(); 
            window.history.replaceState(null, null, "/");
        }, 300); 
    }

    document.querySelectorAll('[data-action="open-modal"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.openModal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal) modal.style.display = 'none'; });


    // ==========================================
    // 3. FORM VALIDATION & SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        const submitBtn = contactForm.querySelector('#submitBtn');
        const btnText = contactForm.querySelector('.btn-text');
        const btnLoader = contactForm.querySelector('.btn-loader');
        const statusDiv = contactForm.querySelector('#form-status');
        const charCounter = document.getElementById('message-counter');
        const messageInput = document.getElementById('message');

        // Character counter for textarea
        if (messageInput && charCounter) {
            messageInput.addEventListener('input', function() {
                const currentLength = this.value.length;
                const maxLength = this.getAttribute('maxlength');
                charCounter.textContent = `${currentLength}/${maxLength}`;
                
                if (currentLength >= maxLength) {
                    charCounter.classList.add('danger');
                } else {
                    charCounter.classList.remove('danger');
                }
            });
        }

        // Real-time validation function
const validateInput = (input) => {
            const errorSpan = document.getElementById(`${input.id}-error`);
            
            // 1. Reset custom errors before re-checking
            input.setCustomValidity("");

            // 2. Strict Email Check (Forces a .com, .ca, etc.)
            if (input.type === 'email' && input.value !== "") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.setCustomValidity("Please enter a valid email address (e.g. name@domain.com).");
                }
            }

            // 3. Strict Phone Check (Must have at least 10 numbers)
            if (input.type === 'tel' && input.value !== "") {
                // This strips out all dashes, spaces, and brackets, counting ONLY the numbers
                const digitCount = input.value.replace(/\D/g, '').length;
                if (digitCount < 10) {
                    input.setCustomValidity("Please enter a valid 10-digit phone number.");
                }
            }

            // 4. File Size Check
            if (input.type === 'file' && input.files.length > 0) {
                if (input.files[0].size > 5 * 1024 * 1024) { // 5MB
                    input.setCustomValidity("File must be smaller than 5MB.");
                }
            }

            // 5. Final check based on the rules above
            let isValid = input.checkValidity();

            if (isValid || (!input.required && input.value === "")) {
                input.classList.remove('invalid', 'shake');
                input.classList.add('valid');
                if (errorSpan) {
                    errorSpan.textContent = '';
                    errorSpan.classList.remove('show');
                }
                return true;
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
                
                input.classList.remove('shake');
                void input.offsetWidth; // Trigger reflow for animation
                input.classList.add('shake');

                if (errorSpan) {
                    // This will now display the exact error messages we set above
                    errorSpan.textContent = input.validationMessage || 'This field is required.';
                    errorSpan.classList.add('show');
                }
                return false;
            }
        };

        // Attach validation on blur and input
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) validateInput(input);
            });
        });

        // Form Submit Handler
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            // Validate all fields before sending
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                statusDiv.textContent = "Please correct the errors above before submitting.";
                statusDiv.style.color = "#dc3545";
                return;
            }

            // Verify Turnstile has been completed
            const formData = new FormData(contactForm);
            if (!formData.get('cf-turnstile-response')) {
                statusDiv.textContent = "Please complete the security check.";
                statusDiv.style.color = "#dc3545";
                return;
            }

            // Set UI to loading
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            statusDiv.textContent = "";

            try {
                // Post to Cloudflare Function
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    window.location.href = '/thank-you.html';
                } else {
                    const result = await response.json();
                    statusDiv.textContent = result.error || "Something went wrong. Please try again.";
                    statusDiv.style.color = "#dc3545";
                    
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline-block';
                    btnLoader.style.display = 'none';
                    
                    // Reset Turnstile if it fails
                    if (typeof turnstile !== 'undefined') turnstile.reset();
                }
            } catch (error) {
                statusDiv.textContent = "Network error. Please check your connection and try again.";
                statusDiv.style.color = "#dc3545";
                
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                
                if (typeof turnstile !== 'undefined') turnstile.reset();
            }
        });
    }

    // ==========================================
    // 4. CAROUSEL & EXTRAS
    // ==========================================
    const track = document.querySelector('.carousel-track');
    if (track) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let autoPlayInterval;

        window.moveSlide = function(direction) {
            currentSlide += direction;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            else if (currentSlide >= totalSlides) currentSlide = 0;
            track.style.transform = `translateX(${-currentSlide * 100}%)`;
        };
        
        const startAutoPlay = () => { autoPlayInterval = setInterval(() => { window.moveSlide(1); }, 6000); };
        const stopAutoPlay = () => { if (autoPlayInterval) clearInterval(autoPlayInterval); };
        
        startAutoPlay();
        
        document.querySelector('.prev-btn')?.addEventListener('click', () => { window.moveSlide(-1); stopAutoPlay(); startAutoPlay(); });
        document.querySelector('.next-btn')?.addEventListener('click', () => { window.moveSlide(1); stopAutoPlay(); startAutoPlay(); });
        track.parentElement.addEventListener('mouseenter', stopAutoPlay);
        track.parentElement.addEventListener('mouseleave', startAutoPlay);
    }

    window.toggleAward = function(headerElement) { headerElement.parentElement.classList.toggle('closed-year'); };
    window.toggleTooltip = function(event) {
        if (event.target.classList.contains('tooltip-close')) return;
        document.getElementById('baeumlerTooltip')?.classList.toggle('tooltip-visible');
    };
    window.closeTooltip = function(event) {
        event.stopPropagation();
        document.getElementById('baeumlerTooltip')?.classList.remove('tooltip-visible');
    };

    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');

    window.openLightbox = function(src) {
        if (lightbox && lightboxImg) {
            lightbox.style.display = 'flex';
            lightboxImg.src = src;
            document.body.style.overflow = 'hidden';
        }
    };
    window.closeLightbox = function(event) {
        if (event.target.id === 'lightboxModal' || event.target.classList.contains('close-modal')) {
            if (lightbox) { lightbox.style.display = 'none'; document.body.style.overflow = ''; }
        }
    };
});
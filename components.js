/* components.js */

// ==========================================
// 1. SHARED HTML COMPONENTS
// ==========================================

const SHARED_HEADER = `
<div class="container nav-wrapper">
    <a href="/" class="logo">
        <img src="pai/logos/logo.webp" alt="JEC Logo">
        <div class="logo-text-group">
            <span class="logo-name">JOHNSTON</span>
            <span class="logo-tagline">ELECTRICAL & CONTRACTING</span>
        </div>
    </a>

    <button class="mobile-menu-btn" aria-label="Toggle navigation menu">
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
                <img src="pai/logos/esa-logo.webp" alt="ECRA ESA Licensed Electrical Contractor" class="footer-logo-img logo-white-bg">
                <img src="pai/logos/baeumler-logo.webp" alt="Baeumler Approved" class="footer-logo-img">
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
                <li><i class="fas fa-envelope"></i> <a href="mailto:johnstonelectricalcontracting@outlook.com">johnstonelectricalcontracting@outlook.com</a></li>
                <li><i class="fas fa-map-marker-alt"></i> Kawartha Lakes, ON</li>
            </ul>
        </div>
    </div>
    
        <div class="text-center footer-copyright">
        <div class="social-links">
            <a href="https://www.facebook.com/JohnstonEC" target="_blank" aria-label="Facebook">
                <i class="fab fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/johnstonelectricalcontracting" target="_blank" aria-label="Instagram">
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
    
    // --- Inject Header ---
    const headerEl = document.querySelector('header');
    if (headerEl) {
        headerEl.innerHTML = SHARED_HEADER;
    }

    // --- Inject Footer ---
    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.innerHTML = SHARED_FOOTER;
        footerEl.classList.remove('simple-footer'); // Ensure full footer styles apply
    }

    // --- Smart Link Logic (Fix "index.html" prefix) ---
    const path = window.location.pathname;
    const isHomePage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    
    if (isHomePage) {
        document.querySelectorAll('a[href^="index.html#"]').forEach(link => {
            const newHref = link.getAttribute('href').replace('index.html', '');
            link.setAttribute('href', newHref);
        });
    }

    // ==========================================
    // 3. GLOBAL EVENT LISTENERS
    // ==========================================

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', isExpanded);
        });          
     
        // Close menu when a link is clicked
        const menuItems = document.querySelectorAll('.nav-links a, .nav-links button');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (navLinks.classList.contains('active')) {
                const isClickInside = navLinks.contains(event.target);
                const isClickOnBtn = menuBtn.contains(event.target);

                if (!isClickInside && !isClickOnBtn) {
                    navLinks.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });  
    }

    // --- Modal Logic (Open/Close) ---
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Smart "Open Modal" Function
    window.openModal = function() { 
        const modalCheck = document.getElementById('contactModal');

        if (modalCheck) {
            // YES: We are on the Home Page. Open the box!
            modalCheck.style.display = 'flex';
        } else {
            // NO: We are on Thank You / 404. Redirect to Home with the "Secret Signal"
            window.location.href = "/?openquote=true"; 
        }
    };

    // Check for the "Secret Signal" on page load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openquote') === 'true') {
        setTimeout(() => {
            window.openModal(); 
        }, 300); 
        // Clean the URL
        window.history.replaceState(null, null, "/");
    }

    // Listen for any button with data-action="open-modal"
    document.querySelectorAll('[data-action="open-modal"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.openModal();
        });
    });

    // --- Close Modal Logic ---
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
             const modalCheck = document.getElementById('contactModal');
             if (modalCheck) modalCheck.style.display = 'none';
        });
    }

    // Close when clicking outside the modal
    window.addEventListener('click', (e) => {
        const modalCheck = document.getElementById('contactModal');
        if (e.target === modalCheck) {
            modalCheck.style.display = 'none';
        }
    });

    // --- Dynamic Subject Line (Form) ---
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.querySelector('input[name="_subject"]');
    if (phoneInput && subjectInput) {
        phoneInput.addEventListener('input', function() {
            if(this.value.trim() !== "") {
                subjectInput.value = "New Website Lead: " + this.value; 
            } else {
                subjectInput.value = "New Website Lead!"; 
            }
        });
    }

    // --- Safe Smooth Scroll ---
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (navLinks) navLinks.classList.remove('active');
            }
        }
    });

    // ==========================================
    // 4. HOMEPAGE SPECIFIC LOGIC
    // ==========================================

    // --- Carousel Logic ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;

        window.moveSlide = function(direction) {
            currentSlide += direction;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            else if (currentSlide >= totalSlides) currentSlide = 0;
            track.style.transform = `translateX(${-currentSlide * 100}%)`;
        };
        
        setInterval(() => { window.moveSlide(1); }, 6000);
        
        document.querySelector('.prev-btn')?.addEventListener('click', () => window.moveSlide(-1));
        document.querySelector('.next-btn')?.addEventListener('click', () => window.moveSlide(1));
    }

    // --- Awards Accordion ---
    window.toggleAward = function(headerElement) {
        const card = headerElement.parentElement;
        card.classList.toggle('closed-year');
    };

    // --- Tooltip Logic ---
    window.toggleTooltip = function(event) {
        if (event.target.classList.contains('tooltip-close')) return;
        const tooltip = document.getElementById('baeumlerTooltip');
        if (tooltip) tooltip.classList.toggle('tooltip-visible');
    };

    window.closeTooltip = function(event) {
        event.stopPropagation();
        const tooltip = document.getElementById('baeumlerTooltip');
        if (tooltip) tooltip.classList.remove('tooltip-visible');
    };

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');

    window.openLightbox = function(src) {
        if (lightbox && lightboxImg) {
            lightbox.style.display = 'flex';
            lightboxImg.src = src;
        }
    };

    window.closeLightbox = function(event) {
        if (event.target.id === 'lightboxModal' || event.target.classList.contains('close-modal')) {
            if (lightbox) lightbox.style.display = 'none';
        }
    };

}); 

// ==========================================
// 5. SERVICE WORKER CLEANUP (Kill the Zombie)
// ==========================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log("Zombie Service Worker Unregistered - Cache Cleared");
        } 
    });
}
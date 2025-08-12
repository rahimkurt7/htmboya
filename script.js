// Loading Screen Management
const loadingScreen = document.getElementById('loading-screen');

// Hide loading screen when page is fully loaded
window.addEventListener('load', () => {
    // Add a small delay for better UX
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (loadingScreen && loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }
    }, 1000);
});

// Fallback: Hide loading screen if load event doesn't fire
setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }
}, 5000);

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const contactForm = document.querySelector('.contact-form form');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.remove('active'));
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe all sections and cards for animation
document.querySelectorAll('section, .service-card, .product-category, .stat-item').forEach(el => {
    el.classList.add('loading');
    observer.observe(el);
});

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Create WhatsApp message
        const whatsappMessage = createWhatsAppMessage(formObject);
        
        // Ask user preference
        const userChoice = confirm('Mesajınızı nasıl göndermek istiyorsunuz?\n\n"Tamam" = WhatsApp\'ta hazırla\n"İptal" = E-posta ile gönder');
        
        if (userChoice) {
            // Open WhatsApp with the message
            const whatsappUrl = `https://api.whatsapp.com/send?phone=905334952776&text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            showNotification('WhatsApp açılıyor... Mesajınız hazırlandı! "Gönder" butonuna basın.', 'success');
        } else {
            // Send via email
            const emailSubject = 'Elektrik Boya - Yeni Müşteri Talebi';
            const emailBody = whatsappMessage.replace(/\*/g, ''); // Remove markdown
            const emailUrl = `mailto:info@htmelektrostatik.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.open(emailUrl, '_blank');
            
            // Show success message
            showNotification('E-posta uygulamanız açılıyor... Mesajınızı gönderebilirsiniz.', 'success');
        }
        
        // Reset form
        this.reset();
    });
}

// Create WhatsApp message from form data
function createWhatsAppMessage(formData) {
    const currentDate = new Date().toLocaleDateString('tr-TR');
    const currentTime = new Date().toLocaleTimeString('tr-TR');
    
    let message = `🖼️ *Elektrik Boya - Yeni Müşteri Talebi*\n\n`;
    message += `📅 *Tarih:* ${currentDate}\n`;
    message += `⏰ *Saat:* ${currentTime}\n\n`;
    message += `👤 *Müşteri Bilgileri:*\n`;
    
    // Form alanlarını kontrol et ve mesaja ekle
    if (formData.name) {
        message += `• *Ad Soyad:* ${formData.name}\n`;
    }
    if (formData.email) {
        message += `• *E-posta:* ${formData.email}\n`;
    }
    if (formData.phone) {
        message += `• *Telefon:* ${formData.phone}\n`;
    }
    if (formData.service) {
        message += `• *Hizmet:* ${formData.service}\n`;
    }
    if (formData.message) {
        message += `\n💬 *Mesaj:*\n${formData.message}\n`;
    }
    
    message += `\n🏢 *Firma:* HTM Elektrostatik Boya\n`;
    message += `📍 *Konum:* İzmir, Çiğli AOSB\n`;
    message += `\n---\n`;
    message += `Bu mesaj web sitesi üzerinden otomatik olarak gönderilmiştir.`;
    
    return message;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is visible
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Product category hover effects
document.querySelectorAll('.product-category').forEach(category => {
    category.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    category.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form validation
document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#2563eb';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '#2563eb';
        }
    });
});

// Add CSS for notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background-color 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .nav-toggle span.active:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle span.active:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle span.active:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(notificationStyles);

// Initialize tooltips for better UX
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    });
    
    element.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

console.log('Elektrik Boya web sitesi yüklendi! 🎨');

// Photo Slider Functionality
class PhotoSlider {
    constructor() {
        this.sliderTrack = document.querySelector('.slider-track');
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.slider-btn.prev-btn');
        this.nextBtn = document.querySelector('.slider-btn.next-btn');
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.sliderTrack) return;
        
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateDots();
    }
    
    setupEventListeners() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoPlay();
            });
        }
        
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
        }
        
        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });
        
        // Pause auto-play on hover
        this.sliderTrack.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });
        
        this.sliderTrack.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoPlay();
            }
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.updateDots();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateSlider();
        this.updateDots();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.updateSlider();
        this.updateDots();
    }
    
    updateSlider() {
        const translateX = -this.currentSlide * 100;
        this.sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // 4 saniyede bir değişir
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
}

// Video Slider Functionality
class VideoSlider {
    constructor() {
        this.sliderTrack = document.querySelector('.video-slider-track');
        this.slides = document.querySelectorAll('.video-slide');
        this.dots = document.querySelectorAll('.video-dot');
        this.prevBtn = document.querySelector('.video-slider-btn.prev-btn');
        this.nextBtn = document.querySelector('.video-slider-btn.next-btn');
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        
        this.init();
    }
    
    init() {
        if (!this.sliderTrack) return;
        
        this.setupEventListeners();
        this.updateDots();
    }
    
    setupEventListeners() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }
        
        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Video event listeners
        this.slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (video) {
                // Video oynatıldığında hiçbir şey yapma (manuel kontrol)
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.updateDots();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateSlider();
        this.updateDots();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.updateSlider();
        this.updateDots();
    }
    
    updateSlider() {
        const translateX = -this.currentSlide * 100;
        this.sliderTrack.style.transform = `translateX(${translateX}%)`;
        
        // Tüm videoları durdur ve sadece aktif olanı oynat
        this.slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (video) {
                if (index === this.currentSlide) {
                    // Aktif video için hiçbir şey yapma (kullanıcı kontrol edebilir)
                } else {
                    // Diğer videoları durdur ve başa sar
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// Function to hide video cover overlay
function hideVideoCover() {
    const coverOverlay = document.getElementById('videoCoverOverlay');
    if (coverOverlay) {
        coverOverlay.classList.add('hidden');
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM yüklendi, slider\'lar başlatılıyor...');
    
    const photoSlider = new PhotoSlider();
    const videoSlider = new VideoSlider();
    
    console.log('Photo Slider:', photoSlider);
    console.log('Video Slider:', videoSlider);
    
    // Test button functionality
    const photoPrevBtn = document.querySelector('.slider-btn.prev-btn');
    const photoNextBtn = document.querySelector('.slider-btn.next-btn');
    const videoPrevBtn = document.querySelector('.video-slider-btn.prev-btn');
    const videoNextBtn = document.querySelector('.video-slider-btn.next-btn');
    
    console.log('Photo Prev Button:', photoPrevBtn);
    console.log('Photo Next Button:', photoNextBtn);
    console.log('Video Prev Button:', videoPrevBtn);
    console.log('Video Next Button:', videoNextBtn);
}); 
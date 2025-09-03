async function downloadScribd(url) {
    try {
        const apikey = 'key-dmaz';
        const apiUrl = `https://api.ferdev.my.id/downloader/scribd?link=${encodeURIComponent(url)}&apikey=${apikey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success && data.result) {
            return {
                downloadUrl: data.result,
                fileName: 'document.pdf'
            };
        } else {
            throw new Error('Gagal memproses link Scribd atau struktur data tidak valid');
        }
    } catch (error) {
        console.error('Error di downloadScribd:', error.message);
        throw error;
    }
}

async function mixEmojis(emoji1, emoji2) {
    try {
        const apikey = 'key-dmaz';
        const apiUrl = `https://api.ferdev.my.id/maker/emojimix?e1=${encodeURIComponent(emoji1)}&e2=${encodeURIComponent(emoji2)}&apikey=${apikey}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch emoji mix');
        }
        
        return await response.arrayBuffer();
    } catch (error) {
        console.error('Error di mixEmojis:', error.message);
        throw error;
    }
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
        }
    });
}, observerOptions);

// Observe all tool cards
document.addEventListener('DOMContentLoaded', () => {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        observer.observe(card);
    });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.tool-btn, .cta-button, .submit-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Memproses...';
                
                // Re-enable after 3 seconds (fallback)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
                }, 3000);
            }
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close modal
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
    
    // Ctrl/Cmd + K to focus search (if we add search later)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus on first input in modal if open
        const firstInput = modal.querySelector('input, textarea');
        if (firstInput && modal.style.display === 'block') {
            firstInput.focus();
        }
    }
});

// Error handling for network issues
window.addEventListener('online', () => {
    console.log('Connection restored');
    // You could show a notification here
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    // You could show a notification here
});

// Performance optimization: Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add theme toggle functionality (optional)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Add service worker for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics and tracking (optional)
function trackEvent(action, category, label) {
    // You can integrate with Google Analytics or other tracking services
    console.log(`Event tracked: ${action} - ${category} - ${label}`);
}

// Track tool usage
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
        const toolType = card.getAttribute('data-tool');
        trackEvent('tool_opened', 'tools', toolType);
    });
});

// Add copy to clipboard functionality
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form validation helpers
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function validateEmoji(text) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(text);
}

// Enhanced form validation
document.addEventListener('DOMContentLoaded', () => {
    // Real-time validation for URL inputs
    document.addEventListener('input', (e) => {
        if (e.target.type === 'url') {
            const isValid = validateUrl(e.target.value);
            e.target.style.borderColor = e.target.value === '' ? '#e1e1e1' : (isValid ? '#4CAF50' : '#f44336');
        }
        
        // Emoji validation
        if (e.target.id === 'emoji1' || e.target.id === 'emoji2') {
            const isValid = validateEmoji(e.target.value) || e.target.value === '';
            e.target.style.borderColor = e.target.value === '' ? '#e1e1e1' : (isValid ? '#4CAF50' : '#f44336');
        }
    });
});

// Add back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DMAZ Tools loaded successfully!');
    
    // Add any initialization code here
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Selamat datang di DMAZ Tools! 🛠️', 'success');
    }, 1000);
});

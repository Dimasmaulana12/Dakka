// DOM Elements
const preloader = document.getElementById('preloader');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const platformTabs = document.querySelectorAll('.platform-tab');
const platformContents = document.querySelectorAll('.platform-content');
const loadingOverlay = document.getElementById('loading-overlay');
const resultSection = document.getElementById('result-section');
const resultContent = document.getElementById('result-content');
const toast = document.getElementById('toast');

// API Configuration
const API_BASE_URL = 'https://api.ferdev.my.id/downloader';
const API_KEY = 'key-dmaz';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2000);

    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
});

// Event Listeners
function initializeEventListeners() {
    // Mobile navigation toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Platform tabs
    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.dataset.platform;
            switchPlatform(platform);
        });
    });

    // Download buttons
    document.getElementById('tiktok-download-btn').addEventListener('click', () => {
        const url = document.getElementById('tiktok-url').value;
        if (validateUrl(url, 'tiktok')) {
            downloadTikTok(url);
        }
    });

    document.getElementById('facebook-download-btn').addEventListener('click', () => {
        const url = document.getElementById('facebook-url').value;
        if (validateUrl(url, 'facebook')) {
            downloadFacebook(url);
        }
    });

    document.getElementById('scribd-download-btn').addEventListener('click', () => {
        const url = document.getElementById('scribd-url').value;
        if (validateUrl(url, 'scribd')) {
            downloadScribd(url);
        }
    });

    // Footer platform links
    document.querySelectorAll('[data-platform]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.dataset.platform;
            switchPlatform(platform);
            document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Enter key support for inputs
    document.querySelectorAll('.url-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const platform = input.id.split('-')[0];
                document.getElementById(`${platform}-download-btn`).click();
            }
        });
    });
}

// Platform switching
function switchPlatform(platform) {
    // Update tabs
    platformTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.platform === platform) {
            tab.classList.add('active');
        }
    });

    // Update content
    platformContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${platform}-content`) {
            content.classList.add('active');
        }
    });

    // Hide previous results
    hideResults();
}

// URL Validation
function validateUrl(url, platform) {
    if (!url.trim()) {
        showToast('error', 'Silakan masukkan URL terlebih dahulu!');
        return false;
    }

    let isValid = false;
    switch (platform) {
        case 'tiktok':
            isValid = url.includes('tiktok.com') || url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com');
            break;
        case 'facebook':
            isValid = url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com');
            break;
        case 'scribd':
            isValid = url.includes('scribd.com');
            break;
    }

    if (!isValid) {
        showToast('error', `URL ${platform} tidak valid!`);
        return false;
    }

    return true;
}

// Download Functions
async function downloadTikTok(url) {
    const btn = document.getElementById('tiktok-download-btn');
    
    try {
        setButtonLoading(btn, true);
        showLoading('Mengambil data video TikTok...', 'Mohon tunggu sebentar');

        const response = await fetch(`${API_BASE_URL}/tiktok?link=${encodeURIComponent(url)}&apikey=${API_KEY}`);
        const data = await response.json();

        hideLoading();
        setButtonLoading(btn, false);

        if (data.success && data.data) {
            displayTikTokResult(data.data);
            showToast('success', 'Video TikTok berhasil diproses!');
        } else {
            throw new Error(data.message || 'Gagal memproses video TikTok');
        }
    } catch (error) {
        hideLoading();
        setButtonLoading(btn, false);
        showToast('error', 'Gagal mengunduh video TikTok: ' + error.message);
        console.error('TikTok download error:', error);
    }
}

async function downloadFacebook(url) {
    const btn = document.getElementById('facebook-download-btn');
    
    try {
        setButtonLoading(btn, true);
        showLoading('Mengambil data video Facebook...', 'Mohon tunggu sebentar');

        const response = await fetch(`${API_BASE_URL}/facebook?link=${encodeURIComponent(url)}&apikey=${API_KEY}`);
        const data = await response.json();

        hideLoading();
        setButtonLoading(btn, false);

        if (data.success && data.data) {
            displayFacebookResult(data.data);
            showToast('success', 'Video Facebook berhasil diproses!');
        } else {
            throw new Error(data.message || 'Gagal memproses video Facebook');
        }
    } catch (error) {
        hideLoading();
        setButtonLoading(btn, false);
        showToast('error', 'Gagal mengunduh video Facebook: ' + error.message);
        console.error('Facebook download error:', error);
    }
}

async function downloadScribd(url) {
    const btn = document.getElementById('scribd-download-btn');
    
    try {
        setButtonLoading(btn, true);
        showLoading('Mengambil dokumen Scribd...', 'Mohon tunggu sebentar');

        const response = await fetch(`${API_BASE_URL}/scribd?link=${encodeURIComponent(url)}&apikey=${API_KEY}`);
        const data = await response.json();

        hideLoading();
        setButtonLoading(btn, false);

        if (data.success && data.result) {
            displayScribdResult(data.result, url);
            showToast('success', 'Dokumen Scribd berhasil diproses!');
        } else {
            throw new Error(data.message || 'Gagal memproses dokumen Scribd');
        }
    } catch (error) {
        hideLoading();
        setButtonLoading(btn, false);
        showToast('error', 'Gagal mengunduh dokumen Scribd: ' + error.message);
        console.error('Scribd download error:', error);
    }
}

// Display Result Functions
function displayTikTokResult(data) {
    const resultHTML = `
        <div class="result-card">
            <div class="video-info">
                <div class="video-thumbnail">
                    <img src="${data.cover || '/api/placeholder/200/250'}" alt="Video Thumbnail" onerror="this.src='/api/placeholder/200/250'">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-details">
                    <h3>${data.title || 'Video TikTok'}</h3>
                    <div class="video-stats">
                        <span><i class="fas fa-eye"></i> ${formatNumber(data.play_count || 0)} views</span>
                        <span><i class="fas fa-heart"></i> ${formatNumber(data.digg_count || 0)} likes</span>
                        <span><i class="fas fa-share"></i> ${formatNumber(data.share_count || 0)} shares</span>
                        <span><i class="fas fa-clock"></i> ${data.duration || 'N/A'}s</span>
                    </div>
                    <div class="author-info">
                        <img src="${data.author?.avatar || '/api/placeholder/50/50'}" alt="Author" onerror="this.src='/api/placeholder/50/50'">
                        <div>
                            <p class="author-name">@${data.author?.unique_id || 'Unknown'}</p>
                            <p class="author-nickname">${data.author?.nickname || 'TikTok User'}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="download-options">
                ${data.video ? `
                <div class="option-card">
                    <div class="option-info">
                        <h4><i class="fas fa-video"></i> Video HD (MP4)</h4>
                        <p>Download video TikTok dalam kualitas HD tanpa watermark</p>
                        <span class="file-size">HD Quality</span>
                    </div>
                    <button class="download-option-btn" onclick="window.open('${data.video}', '_blank')">
                        <i class="fas fa-download"></i>
                        Download Video
                    </button>
                </div>` : ''}
                
                ${data.video_hd ? `
                <div class="option-card">
                    <div class="option-info">
                        <h4><i class="fas fa-video"></i> Video HD+ (MP4)</h4>
                        <p>Download video TikTok dalam kualitas tertinggi</p>
                        <span class="file-size">Best Quality</span>
                    </div>
                    <button class="download-option-btn" onclick="window.open('${data.video_hd}', '_blank')">
                        <i class="fas fa-download"></i>
                        Download HD+
                    </button>
                </div>` : ''}
                
                ${data.music ? `
                <div class="option-card">
                    <div class="option-info">
                        <h4><i class="fas fa-music"></i> Audio (MP3)</h4>
                        <p>Download audio/musik dari video TikTok</p>
                        <span class="file-size">Audio Only</span>
                    </div>
                    <button class="download-option-btn" onclick="window.open('${data.music}', '_blank')">
                        <i class="fas fa-download"></i>
                        Download Audio
                    </button>
                </div>` : ''}
            </div>
        </div>
    `;
    
    showResults(resultHTML);
}

function displayFacebookResult(data) {
    const resultHTML = `
        <div class="result-card">
            <div class="video-info">
                <div class="video-thumbnail">
                    <img src="/api/placeholder/200/250" alt="Facebook Video">
                    <div class="play-button">
                        <i class="fab fa-facebook"></i>
                    </div>
                </div>
                <div class="video-details">
                    <h3>${data.title || 'Video Facebook'}</h3>
                    <div class="video-stats">
                        <span><i class="fas fa-link"></i> Facebook Video</span>
                        <span><i class="fas fa-clock"></i> Ready to download</span>
                    </div>
                    <div class="author-info">
                        <img src="/api/placeholder/50/50" alt="Facebook">
                        <div>
                            <p class="author-name">Facebook Video</p>
                            <p class="author-nickname">Social Media Content</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="download-options">
                ${data.hd ? `
                <div class="option-card">
                    <div class="option-info">
                        <h4><i class="fas fa-video"></i> Video HD (MP4)</h4>
                        <p>Download video Facebook dalam kualitas HD</p>
                        <span class="file-size">HD Quality</span>
                    </div>
                    <button class="download-option-btn" onclick="window.open('${data.hd}', '_blank')">
                        <i class="fas fa-download"></i>
                        Download HD
                    </button>
                </div>` : ''}
                
                ${data.sd ? `
                <div class="option-card">
                    <div class="option-info">
                        <h4><i class="fas fa-video"></i> Video SD (MP4)</h4>
                        <p>Download video Facebook dalam kualitas standar</p>
                        <span class="file-size">SD Quality</span>
                    </div>
                    <button class="download-option-btn" onclick="window.open('${data.sd}', '_blank')">
                        <i class="fas fa-download"></i>
                        Download SD
                    </button>
                </div>` : ''}
            </div>
        </div>
    `;
    
    showResults(resultHTML);
}

function displayScribdResult(downloadUrl, originalUrl) {
    const fileName = extractFileNameFromUrl(originalUrl);
    const resultHTML = `
        <div class="result-card">
            <div class="scribd-result">
                <div class="file-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <h3>${fileName}</h3>
                <p>Dokumen Scribd berhasil diproses dan siap untuk didownload dalam format PDF</p>
                
                <div class="download-options">
                    <div class="option-card">
                        <div class="option-info">
                            <h4><i class="fas fa-file-pdf"></i> PDF Document</h4>
                            <p>Download dokumen Scribd dalam format PDF</p>
                            <span class="file-size">PDF Format</span>
                        </div>
                        <button class="download-option-btn" onclick="window.open('${downloadUrl}', '_blank')">
                            <i class="fas fa-download"></i>
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showResults(resultHTML);
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function extractFileNameFromUrl(url) {
    try {
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const fileName = lastPart.split('-').slice(1).join('-') || 'Dokumen Scribd';
        return decodeURIComponent(fileName);
    } catch (error) {
        return 'Dokumen Scribd';
    }
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('btn-loading');
        button.disabled = true;
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
    }
}

function showLoading(title, description) {
    document.getElementById('loading-text').textContent = title;
    document.getElementById('loading-description').textContent = description;
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
}

function showResults(html) {
    resultContent.innerHTML = html;
    resultSection.classList.add('show');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResults() {
    resultSection.classList.remove('show');
}

function showToast(type, message) {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    if (type === 'success') {
        toastIcon.className = 'toast-icon fas fa-check-circle';
        toast.className = 'toast success';
    } else if (type === 'error') {
        toastIcon.className = 'toast-icon fas fa-exclamation-circle';
        toast.className = 'toast error';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.style.animationFillMode = 'both';
                entry.target.style.animationName = 'fadeInUp';
                entry.target.style.animationDuration = '0.6s';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step, .platform-tab').forEach(el => {
        observer.observe(el);
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 15, 0.98)';
        header.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.1)';
    } else {
        header.style.background = 'rgba(10, 10, 15, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Particles effect
function createParticles() {
    const particles = document.querySelector('.hero-particles');
    if (!particles) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(102, 126, 234, ${Math.random() * 0.5})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        particles.appendChild(particle);
    }
}

// Initialize particles on load
window.addEventListener('load', createParticles);

// Error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = '/api/placeholder/400/300';
    }
}, true);

// PWA support
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const activeInput = document.querySelector('.platform-content.active .url-input');
        if (activeInput) {
            activeInput.focus();
        }
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Theme switcher (optional)
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', 'Link berhasil disalin!');
    }).catch(() => {
        showToast('error', 'Gagal menyalin link!');
    });
}

// Download progress tracking
function trackDownload(platform, type) {
    // Analytics tracking could be implemented here
    console.log(`Download tracked: ${platform} - ${type}`);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Auto-clear input after successful download
function clearInputAfterDownload(platform) {
    setTimeout(() => {
        const input = document.getElementById(`${platform}-url`);
        if (input) {
            input.value = '';
        }
    }, 3000);
}

// Update download functions to include auto-clear
const originalDownloadTikTok = downloadTikTok;
downloadTikTok = async function(url) {
    await originalDownloadTikTok(url);
    clearInputAfterDownload('tiktok');
};

const originalDownloadFacebook = downloadFacebook;
downloadFacebook = async function(url) {
    await originalDownloadFacebook(url);
    clearInputAfterDownload('facebook');
};

const originalDownloadScribd = downloadScribd;
downloadScribd = async function(url) {
    await originalDownloadScribd(url);
    clearInputAfterDownload('scribd');
};

// ===== GLOBAL VARIABLES =====
const CONFIG = {
    API_BASE_URL: 'https://api.ferdev.my.id/downloader',
    API_KEY: 'key-dmaz',
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 4000,
    PRELOADER_DURATION: 2500
};

// DOM Elements Cache
const DOM = {
    preloader: null,
    header: null,
    navToggle: null,
    navMenu: null,
    themeToggle: null,
    platformTabs: null,
    platformContents: null,
    loadingOverlay: null,
    resultSection: null,
    resultContent: null,
    toastContainer: null,
    backToTop: null
};

// State Management
const STATE = {
    currentPlatform: 'tiktok',
    isLoading: false,
    isDarkMode: true,
    hasScrolled: false,
    loadingStep: 0
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeDOM();
    initializePreloader();
    initializeEventListeners();
    initializeAnimations();
    initializeScrollEffects();
    initializeCounters();
    
    // Hide preloader after content is loaded
    setTimeout(() => {
        hidePreloader();
    }, CONFIG.PRELOADER_DURATION);
});

// ===== DOM INITIALIZATION =====
function initializeDOM() {
    DOM.preloader = document.getElementById('preloader');
    DOM.header = document.getElementById('header');
    DOM.navToggle = document.getElementById('nav-toggle');
    DOM.navMenu = document.getElementById('nav-menu');
    DOM.themeToggle = document.getElementById('theme-toggle');
    DOM.platformTabs = document.querySelectorAll('.platform-tab');
    DOM.platformContents = document.querySelectorAll('.platform-content');
    DOM.loadingOverlay = document.getElementById('loading-overlay');
    DOM.resultSection = document.getElementById('result-section');
    DOM.resultContent = document.getElementById('result-content');
    DOM.toastContainer = document.getElementById('toast-container');
    DOM.backToTop = document.getElementById('back-to-top');
}

// ===== PRELOADER =====
function initializePreloader() {
    if (!DOM.preloader) return;
    
    const progressFill = DOM.preloader.querySelector('.progress-fill');
    const loadingText = DOM.preloader.querySelector('.loading-text');
    
    if (progressFill && loadingText) {
        const loadingSteps = [
            'Memuat komponen...',
            'Menyiapkan interface...',
            'Menginisialisasi tools...',
            'Hampir selesai...'
        ];
        
        let step = 0;
        const interval = setInterval(() => {
            if (step < loadingSteps.length) {
                loadingText.textContent = loadingSteps[step];
                step++;
            } else {
                clearInterval(interval);
            }
        }, 600);
    }
}

function hidePreloader() {
    if (DOM.preloader) {
        DOM.preloader.classList.add('hidden');
        setTimeout(() => {
            DOM.preloader.style.display = 'none';
        }, 500);
    }
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Navigation Events
    initializeNavigationEvents();
    
    // Platform Tab Events
    initializePlatformEvents();
    
    // Download Events
    initializeDownloadEvents();
    
    // Scroll Events
    initializeScrollEvents();
    
    // Keyboard Events
    initializeKeyboardEvents();
    
    // Resize Events
    window.addEventListener('resize', handleWindowResize);
}

function initializeNavigationEvents() {
    // Mobile navigation toggle
    if (DOM.navToggle && DOM.navMenu) {
        DOM.navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Theme toggle
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (DOM.navMenu && DOM.navMenu.classList.contains('active') && 
            !DOM.navMenu.contains(e.target) && !DOM.navToggle.contains(e.target)) {
            closeMobileNav();
        }
    });
}

function initializePlatformEvents() {
    DOM.platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.dataset.platform;
            switchPlatform(platform);
        });
    });
    
    // Footer platform links
    document.querySelectorAll('[data-platform]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.dataset.platform;
            switchPlatform(platform);
            scrollToSection('tools');
        });
    });
}

function initializeDownloadEvents() {
    // Download buttons with improved error handling
    const downloadButtons = [
        { id: 'tiktok-download-btn', platform: 'tiktok', inputId: 'tiktok-url' },
        { id: 'facebook-download-btn', platform: 'facebook', inputId: 'facebook-url' },
        { id: 'scribd-download-btn', platform: 'scribd', inputId: 'scribd-url' }
    ];
    
    downloadButtons.forEach(({ id, platform, inputId }) => {
        const btn = document.getElementById(id);
        const input = document.getElementById(inputId);
        
        if (btn && input) {
            btn.addEventListener('click', () => handleDownload(platform, input.value));
            
            // Add input validation on blur
            input.addEventListener('blur', () => validateUrlInput(input, platform));
            input.addEventListener('input', () => clearInputErrors(input));
        }
    });
}

function initializeScrollEvents() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Back to top button
    if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', scrollToTop);
    }
}

function initializeKeyboardEvents() {
    // Enter key support for inputs
    document.querySelectorAll('.url-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const platform = input.id.split('-')[0];
                const downloadBtn = document.getElementById(`${platform}-download-btn`);
                if (downloadBtn) downloadBtn.click();
            }
        });
    });
    
    // Escape key to close modals/overlays
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (DOM.loadingOverlay && DOM.loadingOverlay.classList.contains('show')) {
                hideLoading();
            }
            if (DOM.navMenu && DOM.navMenu.classList.contains('active')) {
                closeMobileNav();
            }
        }
    });
}

// ===== NAVIGATION FUNCTIONS =====
function toggleMobileNav() {
    DOM.navMenu.classList.toggle('active');
    DOM.navToggle.classList.toggle('active');
    document.body.style.overflow = DOM.navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileNav() {
    DOM.navMenu.classList.remove('active');
    DOM.navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

function handleNavLinkClick(e) {
    const href = e.target.getAttribute('href');
    
    if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        scrollToSection(targetId);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Close mobile menu
        closeMobileNav();
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== THEME TOGGLE =====
function toggleTheme() {
    STATE.isDarkMode = !STATE.isDarkMode;
    document.body.classList.toggle('light-theme', !STATE.isDarkMode);
    
    const icon = DOM.themeToggle.querySelector('i');
    if (icon) {
        icon.className = STATE.isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Save theme preference
    localStorage.setItem('theme', STATE.isDarkMode ? 'dark' : 'light');
    
    showToast('success', `Tema ${STATE.isDarkMode ? 'gelap' : 'terang'} diaktifkan`);
}

// ===== PLATFORM SWITCHING =====
function switchPlatform(platform) {
    if (STATE.currentPlatform === platform) return;
    
    STATE.currentPlatform = platform;
    
    // Update tabs with animation
    DOM.platformTabs.forEach((tab, index) => {
        tab.classList.remove('active');
        if (tab.dataset.platform === platform) {
            setTimeout(() => {
                tab.classList.add('active');
            }, index * 100);
        }
    });
    
    // Update content with fade effect
    DOM.platformContents.forEach(content => {
        if (content.classList.contains('active')) {
            content.style.opacity = '0';
            setTimeout(() => {
                content.classList.remove('active');
                
                const targetContent = document.getElementById(`${platform}-content`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    setTimeout(() => {
                        targetContent.style.opacity = '1';
                    }, 50);
                }
            }, 200);
        }
    });
    
    // Hide previous results
    hideResults();
    
    // Clear inputs
    clearAllInputs();
}

function clearAllInputs() {
    document.querySelectorAll('.url-input').forEach(input => {
        input.value = '';
        clearInputErrors(input);
    });
}

// ===== INPUT VALIDATION =====
function validateUrlInput(input, platform) {
    const url = input.value.trim();
    if (!url) return true;
    
    const isValid = validateUrl(url, platform);
    const inputGroup = input.closest('.input-group');
    
    if (!isValid) {
        inputGroup.classList.add('error');
        showInputError(input, `URL ${platform} tidak valid`);
    } else {
        inputGroup.classList.remove('error');
        clearInputErrors(input);
    }
    
    return isValid;
}

function showInputError(input, message) {
    clearInputErrors(input);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error';
    errorElement.textContent = message;
    
    const inputContainer = input.closest('.input-container');
    if (inputContainer) {
        inputContainer.appendChild(errorElement);
    }
}

function clearInputErrors(input) {
    const inputContainer = input.closest('.input-container');
    const errorElement = inputContainer?.querySelector('.input-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    const inputGroup = input.closest('.input-group');
    if (inputGroup) {
        inputGroup.classList.remove('error');
    }
}

function validateUrl(url, platform) {
    if (!url.trim()) return false;
    
    const validators = {
        tiktok: (url) => {
            return url.includes('tiktok.com') || 
                   url.includes('vm.tiktok.com') || 
                   url.includes('vt.tiktok.com') ||
                   url.includes('m.tiktok.com');
        },
        facebook: (url) => {
            return url.includes('facebook.com') || 
                   url.includes('fb.watch') || 
                   url.includes('fb.com') ||
                   url.includes('m.facebook.com');
        },
        scribd: (url) => {
            return url.includes('scribd.com');
        }
    };
    
    return validators[platform] ? validators[platform](url) : false;
}

// ===== DOWNLOAD FUNCTIONS =====
async function handleDownload(platform, url) {
    if (STATE.isLoading) return;
    
    if (!validateUrl(url, platform)) {
        showToast('error', `Silakan masukkan URL ${platform} yang valid!`);
        return;
    }
    
    const downloadFunctions = {
        tiktok: downloadTikTok,
        facebook: downloadFacebook,
        scribd: downloadScribd
    };
    
    const downloadFunction = downloadFunctions[platform];
    if (downloadFunction) {
        await downloadFunction(url);
    }
}

async function downloadTikTok(url) {
    const btn = document.getElementById('tiktok-download-btn');
    
    try {
        setButtonLoading(btn, true);
        showLoadingWithSteps('TikTok', [
            'Menganalisis URL TikTok...',
            'Mengambil data video...',
            'Memproses kualitas video...',
            'Menyiapkan download...'
        ]);
        
        const response = await fetchWithRetry(
            `${CONFIG.API_BASE_URL}/tiktok?link=${encodeURIComponent(url)}&apikey=${CONFIG.API_KEY}`
        );
        
        const data = await response.json();
        
        hideLoading();
        setButtonLoading(btn, false);
        
        if (data.success && data.data) {
            displayTikTokResult(data.data);
            showToast('success', 'Video TikTok berhasil diproses!');
            scrollToResults();
        } else {
            throw new Error(data.message || 'Gagal memproses video TikTok');
        }
    } catch (error) {
        hideLoading();
        setButtonLoading(btn, false);
        handleDownloadError('TikTok', error);
    }
}

async function downloadFacebook(url) {
    const btn = document.getElementById('facebook-download-btn');
    
    try {
        setButtonLoading(btn, true);
        showLoadingWithSteps('Facebook', [
            'Menganalisis URL Facebook...',
            'Mengambil data video...',
            'Memproses kualitas video...',
            'Menyiapkan download...'
        ]);
        
        const response = await fetchWithRetry(
            `${CONFIG.API_BASE_URL}/facebook?link=${encodeURIComponent(url)}&apikey=${CONFIG.API_KEY}`
        );
        
        const data = await response.json();
        
        hideLoading();
        setButtonLoading(btn, false);
        
        if (data.success && data.data) {
            displayFacebookResult(data.data);
            showToast('success', 'Video Facebook berhasil diproses!');
            scrollToResults();
        } else {
            throw new Error(data.message || 'Gagal memproses video Facebook');
        }
    } catch (error) {
        hideLoading();
        setButtonLoading(btn, false);
        handleDownloadError('Facebook', error);
    }
}

async function downloadScribd(url) {
    const btn = document.getElementById('scribd-download-btn');
    
    try {
        setButtonLoading(btn, true);
        showLoadingWithSteps('Scribd', [
            'Menganalisis URL Scribd...',
            'Mengambil data dokumen...',
            'Memproses halaman dokumen...',
            'Menyiapkan PDF...'
        ]);
        
        const response = await fetchWithRetry(
            `${CONFIG.API_BASE_URL}/scribd?link=${encodeURIComponent(url)}&apikey=${CONFIG.API_KEY}`
        );
        
        const data = await response.json();
        
        hideLoading();
        setButtonLoading(btn, false);
        
        if (data.success && data.result) {
            displayScribdResult(data.result, url);
            showToast('success', 'Dokumen Scribd berhasil diproses!');
            scrollToResults();
        } else {
            throw new Error(data.message || 'Gagal memproses dokumen Scribd');
        }
    } catch (error) {
        hideLoading();
        setButtonLoading(btn, false);
        handleDownloadError('Scribd', error);
    }
}

// ===== UTILITY FUNCTIONS =====
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                timeout: 30000
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

function handleDownloadError(platform, error) {
    console.error(`${platform} download error:`, error);
    
    let errorMessage = `Gagal mengunduh ${platform}`;
    
    if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Koneksi internet bermasalah. Silakan coba lagi.';
    } else if (error.message.includes('HTTP 429')) {
        errorMessage = 'Terlalu banyak permintaan. Silakan tunggu sebentar.';
    } else if (error.message.includes('HTTP 503')) {
        errorMessage = 'Server sedang maintenance. Silakan coba lagi nanti.';
    } else if (error.message) {
        errorMessage = error.message;
    }
    
    showToast('error', errorMessage);
}

// ===== LOADING FUNCTIONS =====
function showLoadingWithSteps(platform, steps) {
    STATE.isLoading = true;
    STATE.loadingStep = 0;
    
    const loadingText = document.getElementById('loading-text');
    const loadingDescription = document.getElementById('loading-description');
    const stepItems = document.querySelectorAll('.step-item');
    
    if (loadingText) loadingText.textContent = `Memproses ${platform}...`;
    if (loadingDescription) loadingDescription.textContent = steps[0] || 'Mohon tunggu sebentar';
    
    // Reset all steps
    stepItems.forEach(item => item.classList.remove('active'));
    
    // Show loading overlay
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.add('show');
    }
    
    // Animate steps
    const stepInterval = setInterval(() => {
        if (STATE.loadingStep < steps.length) {
            // Update description
            if (loadingDescription) {
                loadingDescription.textContent = steps[STATE.loadingStep];
            }
            
            // Update step indicators
            if (stepItems[STATE.loadingStep]) {
                stepItems[STATE.loadingStep].classList.add('active');
            }
            
            STATE.loadingStep++;
        } else {
            clearInterval(stepInterval);
        }
    }, 1000);
}

function hideLoading() {
    STATE.isLoading = false;
    
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.remove('show');
    }
    
    // Reset loading steps
    document.querySelectorAll('.step-item').forEach(item => {
        item.classList.remove('active');
    });
}

function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// ===== RESULT DISPLAY FUNCTIONS =====
function displayTikTokResult(data) {
    const videoInfo = {
        title: data.title || 'Video TikTok',
        author: data.author || {},
        thumbnail: data.cover || data.wmplay || 'https://via.placeholder.com/200x250?text=TikTok+Video',
        stats: {
            playCount: data.play_count || 0,
            shareCount: data.share_count || 0,
            downloadCount: data.download_count || 0,
            likeCount: data.digg_count || 0,
            commentCount: data.comment_count || 0
        }
    };

    let downloadOptions = '';

    // Enhanced download options with better quality detection
    const videoOptions = [
        { url: data.play, label: 'Video HD (Tanpa Watermark)', quality: 'HD', type: 'video', icon: 'fas fa-video' },
        { url: data.hdplay, label: 'Video Ultra HD', quality: 'Ultra HD', type: 'video', icon: 'fas fa-video' },
        { url: data.wmplay, label: 'Video (Dengan Watermark)', quality: 'Original', type: 'video', icon: 'fas fa-video' }
    ];

    videoOptions.forEach((option, index) => {
        if (option.url && option.url !== videoOptions[0]?.url) {
            downloadOptions += createDownloadOption(
                option.icon,
                option.label,
                `Kualitas ${option.quality} - Format MP4`,
                option.quality,
                option.url,
                `tiktok-video-${index + 1}.mp4`
            );
        }
    });

    // Audio option
    if (data.music || data.music_info?.play) {
        const audioUrl = data.music || data.music_info?.play;
        downloadOptions += createDownloadOption(
            'fas fa-music',
            'Audio (MP3)',
            'Ekstrak audio dari video TikTok',
            'MP3 Audio',
            audioUrl,
            'tiktok-audio.mp3'
        );
    }

    const resultHTML = createVideoResultHTML(videoInfo, downloadOptions, 'TikTok');
    DOM.resultContent.innerHTML = resultHTML;
    showResults();
}

function displayFacebookResult(data) {
    const videoInfo = {
        title: data.title || 'Video Facebook',
        thumbnail: data.thumbnail || 'https://via.placeholder.com/200x250?text=Facebook+Video',
        stats: {
            duration: data.duration || 0
        }
    };

    let downloadOptions = '';

    // Facebook video options
    if (data.hd) {
        downloadOptions += createDownloadOption(
            'fas fa-video',
            'Video HD',
            'Download video Facebook kualitas HD',
            'MP4 - HD',
            data.hd,
            'facebook-video-hd.mp4'
        );
    }

    if (data.sd) {
        downloadOptions += createDownloadOption(
            'fas fa-video',
            'Video SD',
            'Download video Facebook kualitas SD',
            'MP4 - SD',
            data.sd,
            'facebook-video-sd.mp4'
        );
    }

    const resultHTML = createVideoResultHTML(videoInfo, downloadOptions, 'Facebook');
    DOM.resultContent.innerHTML = resultHTML;
    showResults();
}

function displayScribdResult(downloadUrl, originalUrl) {
    const fileName = extractFileNameFromUrl(originalUrl) || 'document';
    
    const resultHTML = `
        <div class="result-card scribd-result" data-aos="fade-up">
            <div class="file-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <h3>Dokumen Scribd Siap Diunduh</h3>
            <p>Dokumen telah berhasil diproses dan siap untuk diunduh dalam format PDF berkualitas tinggi.</p>
            
            <div class="document-info">
                <div class="info-item">
                    <i class="fas fa-file"></i>
                    <span>Format: PDF</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-download"></i>
                    <span>Siap Download</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-shield-check"></i>
                    <span>Aman & Terpercaya</span>
                </div>
            </div>
            
            <div class="download-options">
                ${createDownloadOption(
                    'fas fa-file-pdf',
                    'Dokumen PDF',
                    'Download dokumen Scribd dalam format PDF',
                    'PDF Document',
                    downloadUrl,
                    `${fileName}.pdf`
                )}
            </div>
        </div>
    `;

    DOM.resultContent.innerHTML = resultHTML;
    showResults();
}

function createDownloadOption(icon, title, description, fileSize, url, filename) {
    return `
        <div class="option-card" data-aos="fade-up" data-aos-delay="100">
            <div class="option-info">
                <h4><i class="${icon}"></i> ${title}</h4>
                <p>${description}</p>
                <span class="file-size">${fileSize}</span>
            </div>
            <button class="download-option-btn" onclick="downloadFile('${url}', '${filename}')">
                <i class="fas fa-download"></i>
                Download
            </button>
        </div>
    `;
}

function createVideoResultHTML(videoInfo, downloadOptions, platform) {
    return `
        <div class="result-card" data-aos="fade-up">
            <div class="video-info">
                <div class="video-thumbnail">
                    <img src="${videoInfo.thumbnail}" alt="Video Thumbnail" onerror="this.src='https://via.placeholder.com/200x250?text=${platform}+Video'">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-details">
                    <h3>${videoInfo.title}</h3>
                    <div class="video-stats">
                        ${videoInfo.stats.playCount ? `<span><i class="fas fa-eye"></i> ${formatNumber(videoInfo.stats.playCount)} views</span>` : ''}
                        ${videoInfo.stats.likeCount ? `<span><i class="fas fa-heart"></i> ${formatNumber(videoInfo.stats.likeCount)} likes</span>` : ''}
                        ${videoInfo.stats.shareCount ? `<span><i class="fas fa-share"></i> ${formatNumber(videoInfo.stats.shareCount)} shares</span>` : ''}
                        ${videoInfo.stats.commentCount ? `<span><i class="fas fa-comment"></i> ${formatNumber(videoInfo.stats.commentCount)} comments</span>` : ''}
                        <span><i class="fab fa-${platform.toLowerCase()}"></i> ${platform} Video</span>
                    </div>
                    ${videoInfo.author.unique_id ? `
                        <div class="author-info">
                            <img src="${videoInfo.author.avatar || 'https://via.placeholder.com/50x50?text=User'}" alt="Author" onerror="this.src='https://via.placeholder.com/50x50?text=User'">
                            <div>
                                <p class="author-name">@${videoInfo.author.unique_id || videoInfo.author.username || 'Unknown'}</p>
                                <p class="author-nickname">${videoInfo.author.nickname || videoInfo.author.name || `${platform} User`}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="download-options">
                ${downloadOptions || `
                    <div class="option-card">
                        <div class="option-info">
                            <h4><i class="fas fa-exclamation-triangle"></i> Tidak Ada Opsi Download</h4>
                            <p>Maaf, tidak dapat menemukan link download untuk video ini</p>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
}

// ===== DOWNLOAD FILE FUNCTION =====
function downloadFile(url, filename) {
    if (!url) {
        showToast('error', 'URL download tidak valid');
        return;
    }
    
    showToast('info', 'Download dimulai...');
    
    // Create download link with improved error handling
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Add to DOM temporarily
    document.body.appendChild(link);
    
    try {
        link.click();
        
        // Show success message after delay
        setTimeout(() => {
            showToast('success', 'File berhasil diunduh!');
        }, 1000);
        
        // Track download analytics
        trackDownload(filename);
        
    } catch (error) {
        showToast('error', 'Gagal mengunduh file');
        console.error('Download error:', error);
    } finally {
        document.body.removeChild(link);
    }
}

function trackDownload(filename) {
    // Simple analytics tracking
    const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
    downloads.push({
        filename,
        timestamp: new Date().toISOString(),
        platform: STATE.currentPlatform
    });
    
    // Keep only last 100 downloads
    if (downloads.length > 100) {
        downloads.splice(0, downloads.length - 100);
    }
    
    localStorage.setItem('downloads', JSON.stringify(downloads));
}

// ===== SCROLL EFFECTS =====
function handleScroll() {
    const scrollY = window.scrollY;
    const shouldShowBackToTop = scrollY > 300;
    const shouldHighlightHeader = scrollY > 100;
    
    // Header scroll effect
    if (DOM.header) {
        DOM.header.classList.toggle('scrolled', shouldHighlightHeader);
    }
    
    // Back to top button
    if (DOM.backToTop) {
        DOM.backToTop.classList.toggle('show', shouldShowBackToTop);
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero && scrollY < window.innerHeight) {
        const parallaxValue = scrollY * 0.5;
        hero.style.transform = `translateY(${parallaxValue}px)`;
    }
    
    // Update active navigation based on scroll position
    updateActiveNavigation();
}

function updateActiveNavigation() {
    const sections = ['home', 'features', 'tools', 'about'];
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (section && navLink) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        }
    });
}

// ===== ANIMATION FUNCTIONS =====
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe elements with data-aos attributes
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Animate elements on page load
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, index * 100);
        });
    }, 500);
}

function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        countObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = formatNumber(Math.floor(current));
    }, 16);
}

// ===== UTILITY FUNCTIONS =====
function formatNumber(num) {
    if (!num) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function extractFileNameFromUrl(url) {
    try {
        const urlPath = new URL(url).pathname;
        const segments = urlPath.split('/');
        const fileName = segments[segments.length - 1];
        return fileName || 'document';
    } catch {
        return 'document';
    }
}

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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== TOAST SYSTEM =====
function showToast(type, message, duration = CONFIG.TOAST_DURATION) {
    if (!DOM.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="toast-icon ${icons[type] || icons.info}"></i>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, CONFIG.ANIMATION_DURATION);
    }, duration);
}

// ===== RESULT FUNCTIONS =====
function showResults() {
    if (DOM.resultSection) {
        DOM.resultSection.classList.add('show');
        
        // Trigger animations for result elements
        setTimeout(() => {
            const resultElements = DOM.resultSection.querySelectorAll('[data-aos]');
            resultElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, index * 100);
            });
        }, 100);
    }
}

function hideResults() {
    if (DOM.resultSection) {
        DOM.resultSection.classList.remove('show');
    }
}

function scrollToResults() {
    setTimeout(() => {
        if (DOM.resultSection) {
            const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
            const targetPosition = DOM.resultSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }, 300);
}

// ===== WINDOW RESIZE HANDLER =====
function handleWindowResize() {
    // Close mobile menu on larger screens
    if (window.innerWidth > 768 && DOM.navMenu?.classList.contains('active')) {
        closeMobileNav();
    }
    
    // Recalculate layout if needed
    debounce(() => {
        // Any layout recalculations can go here
    }, 250)();
}

// ===== INITIALIZATION COMPLETE =====
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showToast('error', 'Terjadi kesalahan. Silakan refresh halaman.');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    showToast('error', 'Terjadi kesalahan jaringan. Silakan coba lagi.');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access if needed
window.DmazTools = {
    downloadFile,
    showToast,
    switchPlatform,
    scrollToSection
};

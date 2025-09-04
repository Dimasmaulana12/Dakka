// ===== GLOBAL VARIABLES =====
let currentGame = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZE APPLICATION =====
function initializeApp() {
    // Hide splash screen
    setTimeout(() => {
        hideSplashScreen();
    }, 2000);

    // Initialize components
    initTheme();
    initNavigation();
    initToolCards();
    initModals();
    initScrollAnimations();
    initBackToTop();
    initMobileMenu();
    initQuickAccess();
    initToolFilters();
    initSmoothScrolling();
    
    console.log('🚀 Dimas Tools loaded successfully!');
}

// ===== SPLASH SCREEN =====
function hideSplashScreen() {
    const splash = document.getElementById('splash');
    if (splash) {
        splash.classList.add('hide');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 500);
    }
}

// ===== THEME MANAGEMENT =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Show toast notification
    showToast(`Tema diubah ke ${currentTheme === 'light' ? 'terang' : 'gelap'}`, 'info');
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling and active state
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active link
        updateActiveNavLink(e.currentTarget);
        
        // Close mobile menu if open
        closeMobileMenu();
    }
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('active', isActive);
            });
        }
    });
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('show');
}

function closeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuToggle?.classList.remove('active');
    navMenu?.classList.remove('show');
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Hero CTA buttons
    const ctaButtons = document.querySelectorAll('[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const href = button.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ===== QUICK ACCESS =====
function initQuickAccess() {
    const quickItems = document.querySelectorAll('.quick-item');
    quickItems.forEach(item => {
        item.addEventListener('click', () => {
            const toolType = item.getAttribute('data-tool');
            if (toolType) {
                openToolModal(toolType);
            }
        });
    });
}

// ===== TOOL FILTERS =====
function initToolFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter tools
            filterTools(filter, toolCards);
        });
    });
}

function filterTools(filter, toolCards) {
    toolCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'slideUp 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== TOOL CARDS =====
function initToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        // Click event
        card.addEventListener('click', () => {
            const toolType = card.getAttribute('data-tool');
            openToolModal(toolType);
        });
        
        // Keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// ===== MODALS =====
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Close button events
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close on overlay click
    modals.forEach(modal => {
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => closeModal(modal));
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function openModal(modal) {
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// ===== TOOL MODAL =====
function openToolModal(toolType) {
    const modal = document.getElementById('toolModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    // Set modal content
    const toolContent = getToolContent(toolType);
    modalTitle.textContent = toolContent.title;
    modalContent.innerHTML = toolContent.html;
    
    // Open modal
    openModal(modal);
    
    // Initialize tool functionality
    initToolFunctionality(toolType);
}

function getToolContent(toolType) {
    const toolConfigs = {
        igstalk: {
            title: 'Instagram Stalk',
            html: `
                <div class="form-group">
                    <label for="igUsername">Instagram Username</label>
                    <input type="text" id="igUsername" placeholder="Enter Instagram username (without @)" />
                </div>
                <button class="btn btn-primary" onclick="processInstagramStalk()">
                    <i class="fas fa-search"></i>
                    <span>Get Profile Info</span>
                </button>
            `
        },
        weather: {
            title: 'Weather Information',
            html: `
                <div class="form-group">
                    <label for="weatherLocation">Location</label>
                    <input type="text" id="weatherLocation" placeholder="Enter city name" />
                </div>
                <button class="btn btn-primary" onclick="processWeather()">
                    <i class="fas fa-cloud-sun"></i>
                    <span>Check Weather</span>
                </button>
            `
        },
        earthquake: {
            title: 'Latest Earthquake Information',
            html: `
                <p>Get the latest earthquake information from BMKG (Indonesian Meteorological, Climatological, and Geophysical Agency).</p>
                <button class="btn btn-primary" onclick="processEarthquake()">
                    <i class="fas fa-mountain"></i>
                    <span>Get Latest Earthquake Info</span>
                </button>
            `
        },
        tiktok: {
            title: 'TikTok Video Downloader',
            html: `
                <div class="form-group">
                    <label for="tiktokUrl">TikTok Video URL</label>
                    <input type="url" id="tiktokUrl" placeholder="Paste TikTok video URL here" />
                </div>
                <button class="btn btn-primary" onclick="processTikTokDownload()">
                    <i class="fab fa-tiktok"></i>
                    <span>Download Video</span>
                </button>
            `
        },
        instagram: {
            title: 'Instagram Media Downloader',
            html: `
                <div class="form-group">
                    <label for="instagramUrl">Instagram Post URL</label>
                    <input type="url" id="instagramUrl" placeholder="Paste Instagram post URL here" />
                </div>
                <button class="btn btn-primary" onclick="processInstagramDownload()">
                    <i class="fab fa-instagram"></i>
                    <span>Download Media</span>
                </button>
            `
        },
        pinterest: {
            title: 'Pinterest Media Downloader',
            html: `
                <div class="form-group">
                    <label for="pinterestUrl">Pinterest URL</label>
                    <input type="url" id="pinterestUrl" placeholder="Paste Pinterest URL here" />
                </div>
                <button class="btn btn-primary" onclick="processPinterestDownload()">
                    <i class="fab fa-pinterest"></i>
                    <span>Download Media</span>
                </button>
            `
        },
        facebook: {
            title: 'Facebook Video Downloader',
            html: `
                <div class="form-group">
                    <label for="facebookUrl">Facebook Video URL</label>
                    <input type="url" id="facebookUrl" placeholder="Paste Facebook video URL here" />
                </div>
                <button class="btn btn-primary" onclick="processFacebookDownload()">
                    <i class="fab fa-facebook"></i>
                    <span>Download Video</span>
                </button>
            `
        },
        gdrive: {
            title: 'Google Drive Downloader',
            html: `
                <div class="form-group">
                    <label for="gdriveUrl">Google Drive File URL</label>
                    <input type="url" id="gdriveUrl" placeholder="Paste Google Drive file URL here" />
                </div>
                <button class="btn btn-primary" onclick="processGDriveDownload()">
                    <i class="fab fa-google-drive"></i>
                    <span>Download File</span>
                </button>
            `
        },
        capcut: {
            title: 'CapCut Video Downloader',
            html: `
                <div class="form-group">
                    <label for="capcutUrl">CapCut Video URL</label>
                    <input type="url" id="capcutUrl" placeholder="Paste CapCut video URL here" />
                </div>
                <button class="btn btn-primary" onclick="processCapCutDownload()">
                    <i class="fas fa-video"></i>
                    <span>Download Video</span>
                </button>
            `
        },
        terabox: {
            title: 'Terabox File Downloader',
            html: `
                <div class="form-group">
                    <label for="teraboxUrl">Terabox File URL</label>
                    <input type="url" id="teraboxUrl" placeholder="Paste Terabox file URL here" />
                </div>
                <button class="btn btn-primary" onclick="processTeraboxDownload()">
                    <i class="fas fa-cloud-download-alt"></i>
                    <span>Download File</span>
                </button>
            `
        },
        scribd: {
            title: 'Scribd Document Downloader',
            html: `
                <div class="form-group">
                    <label for="scribdUrl">Scribd Document URL</label>
                    <input type="url" id="scribdUrl" placeholder="Paste Scribd document URL here" />
                </div>
                                <button class="btn btn-primary" onclick="processScribdDownload()">
                    <i class="fas fa-file-pdf"></i>
                    <span>Download Document</span>
                </button>
            `
        },
        ai: {
            title: 'AI Chat Assistant',
            html: `
                <div class="form-group">
                    <label for="aiQuery">Ask AI Anything</label>
                    <textarea id="aiQuery" rows="4" placeholder="Type your question here..."></textarea>
                </div>
                <button class="btn btn-primary" onclick="processAIChat()">
                    <i class="fas fa-robot"></i>
                    <span>Ask AI</span>
                </button>
            `
        },
        wordgame: {
            title: 'Word Arrangement Game',
            html: `
                <div class="game-container">
                    <p>Test your vocabulary skills by arranging jumbled letters into correct words!</p>
                    <button class="btn btn-primary" onclick="startWordGame()">
                        <i class="fas fa-gamepad"></i>
                        <span>Start New Game</span>
                    </button>
                    <div id="gameContent"></div>
                </div>
            `
        },
        sticker: {
            title: 'Sticker Pack Search',
            html: `
                <div class="form-group">
                    <label for="stickerQuery">Search Keywords</label>
                    <input type="text" id="stickerQuery" placeholder="Enter keywords to search for stickers" />
                </div>
                <button class="btn btn-primary" onclick="processSticker()">
                    <i class="fas fa-smile"></i>
                    <span>Search Stickers</span>
                </button>
            `
        },
        emojimix: {
            title: 'Emoji Mixer',
            html: `
                <div class="form-group">
                    <label for="emoji1">First Emoji</label>
                    <input type="text" id="emoji1" placeholder="🙂" maxlength="2" />
                </div>
                <div class="form-group">
                    <label for="emoji2">Second Emoji</label>
                    <input type="text" id="emoji2" placeholder="😭" maxlength="2" />
                </div>
                <button class="btn btn-primary" onclick="processEmojiMix()">
                    <i class="fas fa-laugh"></i>
                    <span>Mix Emojis</span>
                </button>
            `
        }
    };

    return toolConfigs[toolType] || { 
        title: 'Unknown Tool', 
        html: '<p>Tool not found.</p>' 
    };
}

function initToolFunctionality(toolType) {
    // Add event listeners for Enter key submission
    const modal = document.getElementById('toolModal');
    const inputs = modal.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const button = modal.querySelector('.btn-primary');
                if (button) {
                    button.click();
                }
            }
        });
    });
    
    // Focus first input
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

// ===== RESULT MODAL =====
function showResult(title, content) {
    const resultModal = document.getElementById('resultModal');
    const resultTitle = document.getElementById('resultTitle');
    const resultContent = document.getElementById('resultContent');

    if (!resultModal || !resultTitle || !resultContent) return;

    resultTitle.textContent = title;
    resultContent.innerHTML = content;

    // Close tool modal and show result modal
    const toolModal = document.getElementById('toolModal');
    if (toolModal) {
        closeModal(toolModal);
    }
    
    setTimeout(() => {
        openModal(resultModal);
    }, 300);
}

// ===== LOADING STATES =====
function showLoading(message) {
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

function showProgress(message, progress = 0) {
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <span>${message}</span>
                <div style="width: 100%; background: var(--bg-tertiary); border-radius: var(--radius-lg); margin-top: var(--space-md); height: 8px;">
                    <div style="width: ${progress}%; background: var(--primary-color); height: 100%; border-radius: var(--radius-lg); transition: width 0.3s ease;"></div>
                </div>
                <div style="text-align: center; margin-top: var(--space-sm); font-size: 0.875rem; color: var(--text-secondary);">${progress}%</div>
            </div>
        `;
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--space-sm);">
            <i class="${icon}" style="color: var(--${type === 'error' ? 'error' : type === 'success' ? 'success' : 'info'}-color);"></i>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Remove toast after duration
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    return icons[type] || icons.info;
}

// ===== TOOL PROCESSING FUNCTIONS =====

// Instagram Stalk
async function processInstagramStalk() {
    const username = document.getElementById('igUsername')?.value.trim();
    if (!username) {
        showToast('Please enter a username', 'error');
        return;
    }

    showLoading('Processing Instagram profile...');
    
    try {
        const result = await instagramStalk(username);
        if (result) {
            showResult('Instagram Profile Information', formatInstagramResult(result));
        } else {
            showToast('Failed to fetch profile data. Please check the username.', 'error');
        }
    } catch (error) {
        console.error('Error in processInstagramStalk:', error);
        showToast('An error occurred while processing your request.', 'error');
    }
}

// Weather Info
async function processWeather() {
    const location = document.getElementById('weatherLocation')?.value.trim();
    if (!location) {
        showToast('Please enter a location', 'error');
        return;
    }

    showLoading('Fetching weather information...');
    
    try {
        const result = await getWeatherInfo(location);
        if (result) {
            showResult('Weather Information', formatWeatherResult(result));
        } else {
            showToast('Location not found or weather data unavailable.', 'error');
        }
    } catch (error) {
        console.error('Error in processWeather:', error);
        showToast('An error occurred while fetching weather data.', 'error');
    }
}

// Earthquake Info
async function processEarthquake() {
    showLoading('Fetching latest earthquake information...');
    
    try {
        const result = await getEarthquakeInfo();
        if (result) {
            showResult('Latest Earthquake Information', formatEarthquakeResult(result));
        } else {
            showToast('Failed to fetch earthquake data.', 'error');
        }
    } catch (error) {
        console.error('Error in processEarthquake:', error);
        showToast('An error occurred while fetching earthquake data.', 'error');
    }
}

// TikTok Download
async function processTikTokDownload() {
    const url = document.getElementById('tiktokUrl')?.value.trim();
    if (!url) {
        showToast('Please enter a TikTok URL', 'error');
        return;
    }

    showLoading('Processing TikTok video...');
    
    try {
        const result = await downloadTikTok(url);
        if (result) {
            showResult('TikTok Video Downloaded', formatTikTokResult(result));
        } else {
            showToast('Failed to download video. Please check the URL.', 'error');
        }
    } catch (error) {
        console.error('Error downloading TikTok:', error);
        showToast('An error occurred while downloading the video.', 'error');
    }
}

// Instagram Download
async function processInstagramDownload() {
    const url = document.getElementById('instagramUrl')?.value.trim();
    if (!url) {
        showToast('Please enter an Instagram URL', 'error');
        return;
    }

    showLoading('Processing Instagram media...');
    
    try {
        const result = await downloadInstagram(url);
        if (result) {
            showResult('Instagram Media Downloaded', formatInstagramDownloadResult(result));
        } else {
            showToast('Failed to download media. Please check the URL.', 'error');
        }
    } catch (error) {
        console.error('Error downloading Instagram:', error);
        showToast('An error occurred while downloading the media.', 'error');
    }
}

// Pinterest Download
async function processPinterestDownload() {
    const url = document.getElementById('pinterestUrl')?.value.trim();
    if (!url) {
        showToast('Please enter a Pinterest URL', 'error');
        return;
    }

    showLoading('Processing Pinterest media...');
    
    try {
        const result = await downloadPinterest(url);
        if (result) {
            showResult('Pinterest Media Downloaded', formatDownloadResult(result, result.mediaType));
        } else {
            showToast('Failed to download media. Please check the URL.', 'error');
        }
    } catch (error) {
        console.error('Error downloading Pinterest:', error);
        showToast('An error occurred while downloading the media.', 'error');
    }
}

// Facebook Download
async function processFacebookDownload() {
    const url = document.getElementById('facebookUrl')?.value.trim();
    if (!url) {
        showToast('Please enter a Facebook URL', 'error');
        return;
    }

    showLoading('Processing Facebook video...');
    
    try {
        const result = await downloadFacebook(url);
        if (result) {
            showResult('Facebook Video Downloaded', formatFacebookResult(result));
        } else {
            showToast('Failed to download video. Please check the URL.', 'error');
        }
    } catch (error) {
        console.error('Error downloading Facebook:', error);
        showToast('An error occurred while downloading the video.', 'error');
    }
}

// Google Drive Download
async function processGDriveDownload() {
    const url = document.getElementById('gdriveUrl')?.value.trim();
    if (!url) {
        showToast('Please enter a Google Drive URL', 'error');
        return;
    }

    showLoading('Processing Google Drive file...');
    
    try {
        const result = await downloadGoogleDrive(url);
        if (result) {
            showResult('Google Drive File Processed', formatGDriveResult(result));
        } else {
            showToast('Failed to process file. Please check the URL and permissions.', 'error');
        }
    } catch (error) {
        console.error('Error downloading Google Drive:', error);
        showToast('An error occurred while processing the file.', 'error');
    }
}

// CapCut Download
async function processCapCutDownload() {
    const url = document.getElementById('capcutUrl')?.value.trim();
    if (!url) {
        showToast('Please enter a CapCut URL', 'error');
        return;
    }

    showLoading('Processing CapCut video...');
    
    try {
        const result = await downloadCapcut(url);
        if (result) {
            showResult('CapCut Video Downloaded', formatCapCutResult(result));
        } else {
            showToast('CapCut downloader is currently unavailable. Please try again later or check the URL format.', 'error');
        }
    } catch (error) {
        console.error('Error downloading CapCut:', error);
        showToast('CapCut downloader is temporarily unavailable. Please try again later.', 'error');
    }
}

// Terabox Download
async function processTeraboxDownload() {
    const url = document.getElementById('teraboxUrl')?.value.trim();
    if (!url) {
        showToast('Please enter a Terabox URL', 'error');
        return;
    }

    showLoading('Processing Terabox file...');
    
    try {
        const result = await downloadTerabox(url);
        if (result) {
            showResult('Terabox File Processed', formatTeraboxResult(result));
        } else {
            showToast('Failed to process file. Please check the URL.', 'error');
        }
    } catch (error) {
        console.error('Error downloading Terabox:', error);
        showToast('An error occurred while processing the file.', 'error');
    }
}

// Scribd Download
async function processScribdDownload() {
    const url = document.getElementById('scribdUrl')?.value.trim();
    if (!url) {
        showToast('Please enter a Scribd URL', 'error');
        return;
    }

    showLoading('Processing Scribd document...');
    
    try {
        const result = await downloadScribd(url);
        if (result) {
            showResult('Scribd Document Processed', formatScribdResult(result));
        } else {
            showToast('Failed to process document. Please check the URL.', 'error');
        }
    } catch (error) {
        console.error('Error downloading Scribd:', error);
        showToast('An error occurred while processing the document.', 'error');
    }
}

// AI Chat
async function processAIChat() {
    const query = document.getElementById('aiQuery')?.value.trim();
    if (!query) {
        showToast('Please enter your question', 'error');
        return;
    }

    showLoading('AI is thinking...');
    
    try {
        const result = await getAiResponse(query);
        if (result) {
            showResult('AI Response', formatAIResult(result));
        } else {
            showToast('Failed to get AI response. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error in processAIChat:', error);
        showToast('An error occurred while getting AI response.', 'error');
    }
}

// Word Game
async function startWordGame() {
    showLoading('Loading new word game...');
    
    try {
        const result = await getSusunKata();
        if (result) {
            currentGame = result;
            showWordGame(result);
        } else {
            showToast('Failed to load game. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error starting word game:', error);
        showToast('An error occurred while loading the game.', 'error');
    }
}

function showWordGame(gameData) {
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    
    modalContent.innerHTML = `
        <div class="game-container">
            <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-lg); text-align: center;">
                <h4 style="color: var(--primary-color); margin-bottom: var(--space-md);">Arrange the letters to form a word</h4>
                <div style="font-size: 2rem; font-weight: 700; color: var(--text-primary); letter-spacing: 4px; margin: var(--space-lg) 0;">${gameData.soal}</div>
                <div style="color: var(--text-secondary); font-style: italic;">Hint: ${gameData.tipe}</div>
            </div>
            <div class="form-group">
                <label for="gameAnswer">Your Answer</label>
                <input type="text" id="gameAnswer" placeholder="Enter your answer" />
            </div>
            <div style="display: flex; gap: var(--space-md);">
                <button class="btn btn-primary" onclick="checkAnswer()" style="flex: 1;">
                    <i class="fas fa-check"></i>
                    <span>Submit Answer</span>
                </button>
                <button class="btn btn-outline" onclick="startWordGame()" style="flex: 1;">
                    <i class="fas fa-redo"></i>
                    <span>New Game</span>
                </button>
            </div>
        </div>
    `;

    // Focus on input and add enter key listener
    setTimeout(() => {
        const answerInput = document.getElementById('gameAnswer');
        if (answerInput) {
            answerInput.focus();
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    checkAnswer();
                }
            });
        }
    }, 100);
}

function checkAnswer() {
    const userAnswer = document.getElementById('gameAnswer')?.value.trim().toLowerCase();
    if (!userAnswer) {
        showToast('Please enter your answer', 'error');
        return;
    }
    
    const correctAnswer = currentGame.jawaban.toLowerCase();

    if (userAnswer === correctAnswer) {
        showToast(`🎉 Correct! The answer is "${currentGame.jawaban}"`, 'success');
        setTimeout(() => {
            startWordGame(); // Start new game
        }, 2000);
    } else {
        showToast('Wrong answer! Try again.', 'error');
        const answerInput = document.getElementById('gameAnswer');
        if (answerInput) {
            answerInput.value = '';
            answerInput.focus();
        }
    }
}

// Sticker Search
async function processSticker() {
    const query = document.getElementById('stickerQuery')?.value.trim();
    if (!query) {
        showToast('Please enter search keywords', 'error');
        return;
    }

    showLoading('Searching for stickers...');
    
    try {
        const result = await searchStickerly(query);
        if (result && result.length > 0) {
            showResult('Sticker Search Results', formatStickerResult(result));
        } else {
            showToast('No stickers found for your search.', 'error');
        }
    } catch (error) {
        console.error('Error searching stickers:', error);
        showToast('An error occurred while searching for stickers.', 'error');
    }
}

// Emoji Mix
async function processEmojiMix() {
    const emoji1 = document.getElementById('emoji1')?.value.trim();
    const emoji2 = document.getElementById('emoji2')?.value.trim();
    
    if (!emoji1 || !emoji2) {
        showToast('Please enter both emojis', 'error');
        return;
    }

    showLoading('Mixing emojis...');
    
    try {
        const result = await mixEmojis(emoji1, emoji2);
        if (result) {
            showResult('Mixed Emoji', formatEmojiMixResult(result, emoji1, emoji2));
        } else {
            showToast('Failed to mix emojis. Please try different emojis.', 'error');
        }
    } catch (error) {
        console.error('Error mixing emojis:', error);
        showToast('An error occurred while mixing emojis.', 'error');
    }
}

// ===== API FUNCTIONS =====

// Instagram Stalk API
async function instagramStalk(username) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/stalk/instagram?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        if (!data.status || !data.data) {
            throw new Error('API returned error or empty data');
        }

        const userData = data.data;
        
        return {
            username: userData.username || 'Unknown',
            fullname: userData.full_name || 'No name',
            biography: userData.biography || 'No bio available',
            profilePic: userData.profile_pic_url || '',
            posts: formatNumber(userData.posts_count) || '0',
            followers: formatNumber(userData.followers_count) || '0',
            following: formatNumber(userData.following_count) || '0',
            isVerified: userData.is_verified || false,
            isPrivate: userData.is_private || false,
            isBusiness: userData.is_business_account || false,
            externalUrl: userData.external_url || null,
            bioLinks: userData.bio_links || [],
            postsData: userData.posts || []
        };
    } catch (error) {
        console.error('Error in instagramStalk:', error.message);
        return null;
    }
}

// Weather Info API
async function getWeatherInfo(location) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/info/cuaca?q=${encodeURIComponent(location)}`);
        const data = await response.json();

        if (data.status && data.data.weather && data.data.weather.length > 0) {
            const weatherData = data.data.weather[0];
            const locationInfo = weatherData.lokasi;
            const forecastArrays = weatherData.cuaca;

            const fullLocationName = `${locationInfo.desa}, ${locationInfo.kecamatan}, ${locationInfo.kotkab}`;

            let forecastText = '';
            let count = 0;

            for (const dayArray of forecastArrays) {
                for (const forecast of dayArray) {
                    if (count >= 4) break;

                    const date = new Date(forecast.local_datetime);
                    const time = date.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        timeZone: 'Asia/Jakarta' 
                    });
                    
                    forecastText += `\n\n🕒 Time: ${time} WIB\n`;
                    forecastText += `   - Weather: ${forecast.weather_desc}\n`;
                    forecastText += `   - Temperature: ${forecast.t}°C\n`;
                    forecastText += `   - Humidity: ${forecast.hu}%\n`;
                    forecastText += `   - Wind: ${forecast.ws} km/h ${forecast.wd}`;

                    count++;
                }
                if (count >= 4) break;
            }

            return { fullLocationName, forecastText };
        } else {
            throw new Error('Location not found or invalid data');
        }
    } catch (error) {
        console.error('Error in getWeatherInfo:', error.message);
        return null;
    }
}

// Earthquake Info API
async function getEarthquakeInfo() {
    try {
        const response = await fetch('https://api.siputzx.my.id/api/info/bmkg');
        const data = await response.json();

        if (data.status && data.data && data.data.auto) {
            const gempaInfo = data.data.auto.Infogempa.gempa;
            return {
                tanggal: gempaInfo.Tanggal,
                jam: gempaInfo.Jam,
                magnitude: gempaInfo.Magnitude,
                kedalaman: gempaInfo.Kedalaman,
                wilayah: gempaInfo.Wilayah,
                potensi: gempaInfo.Potensi,
                shakemapUrl: gempaInfo.downloadShakemap
            };
        } else {
            throw new Error('Invalid earthquake API data structure');
        }
    } catch (error) {
        console.error('Error in getEarthquakeInfo:', error.message);
        return null;
    }
}

// TikTok Download API
async function downloadTikTok(url) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status && data.data) {
            return {
                title: data.data.metadata?.title || 'TikTok Video',
                description: data.data.metadata?.description || '',
                creator: data.data.metadata?.creator || 'Unknown',
                videoUrls: data.data.urls || []
            };
        } else {
            throw new Error('Failed to process TikTok link or invalid data structure');
        }
    } catch (error) {
        console.error('Error in downloadTikTok:', error.message);
        return null;
    }
}

// Instagram Download API
async function downloadInstagram(url) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status && data.data && data.data.length > 0) {
            const mediaItem = data.data[0];
            return {
                url: mediaItem.url,
                thumbnail: mediaItem.thumbnail || null
            };
        } else {
            throw new Error('Failed to process Instagram link or invalid data structure');
        }
    } catch (error) {
        console.error('Error in downloadInstagram:', error.message);
        return null;
    }
}

// Pinterest Download API
async function downloadPinterest(url) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status && data.data && data.data.media_urls && data.data.media_urls.length > 0) {
            const originalMedia = data.data.media_urls.find(m => m.quality === 'original') || data.data.media_urls[0];

            return {
                mediaUrl: originalMedia.url,
                mediaType: originalMedia.type
            };
        } else {
            throw new Error('Failed to process Pinterest link or invalid data structure');
        }
    } catch (error) {
        console.error('Error in downloadPinterest:', error.message);
        return null;
    }
}

// Facebook Download API
async function downloadFacebook(url) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status && data.data) {
            const videoOptions = [];
            
            if (data.data.data && Array.isArray(data.data.data)) {
                data.data.data.forEach(item => {
                    if (item.format === 'mp4' && item.resolution !== 'Audio') {
                        videoOptions.push({
                            url: item.url,
                            resolution: item.resolution,
                            format: item.format
                        });
                    }
                });
            }

            return {
                title: data.data.title || 'Facebook Video',
                thumbnail: data.data.thumbnail || null,
                videoOptions: videoOptions
            };
        } else {
            throw new Error('Failed to process Facebook link or invalid data structure');
        }
    } catch (error) {
        console.error('Error in downloadFacebook:', error.message);
        return null;
    }
}

// Google Drive Download API
async function downloadGoogleDrive(url) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status && data.data) {
            return {
                fileName: data.data.name || 'Google Drive File',
                downloadUrl: data.data.download,
                originalLink: data.data.link
            };
        } else {
            throw new Error('Failed to process Google Drive link or invalid data structure');
        }
    } catch (error) {
        console.error('Error in downloadGoogleDrive:', error.message);
        return null;
    }
}

// CapCut Download API
async function downloadCapcut(url) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/capcut?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!data.status) {
            console.warn('CapCut API error:', data.error);
            return null;
        }

        if (data.status && data.data) {
            return {
                title: data.data.title || 'CapCut Video',
                videoUrl: data.data.video_url,
                thumbnail: data.data.thumbnail || '',
                author: data.data.author || 'Unknown'
            };
        } else {
            throw new Error('Failed to process CapCut link or invalid data structure');
        }
    } catch (error) {
        console.error('Error in downloadCapcut:', error.message);
        return null;
    }
}

// Terabox Download API
async function downloadTerabox(url) {
    try {
        const apikey = 'key-dmaz';
        const response = await fetch(`https://api.ferdev.my.id/downloader/terabox?link=${encodeURIComponent(url)}&apikey=${apikey}`);
        const data = await response.json();

        if (data.success && data.result) {
            return {
                fileName: data.result.file_name,
                size: data.result.size,
                sizeBytes: data.result.size_bytes,
                downloadUrl: data.result.direct_link,
                thumbnail: data.result.thumb
            };
        } else {
            throw new Error('Failed to process Terabox link or invalid data structure');
        }
    } catch (error) {
        console.error('Error in downloadTerabox:', error.message);
        return null;
    }
}

// Scribd Download API
async function downloadScribd(url) {
    try {
        const apikey = 'key-dmaz';
        const response = await fetch(`https://api.ferdev.my.id/downloader/scribd?link=${encodeURIComponent(url)}&apikey=${apikey}`);
        const data = await response.json();

        if (data.success && data.result) {
            return {
                downloadUrl: data.result
            };
        } else {
            throw new Error('Failed to process Scribd link or invalid data structure');
        }
    } catch (error) {
        console.error('Error in downloadScribd:', error.message);
        return null;
    }
}

// AI Response API
async function getAiResponse(query) {
    try {
        const systemPrompt = "You are a helpful assistant.";
        const response = await fetch(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(systemPrompt)}&content=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.status && data.data) {
            return data.data;
        } else {
            throw new Error('Failed to get AI response or invalid data structure');
        }
    } catch (error) {
        console.error('Error in getAiResponse:', error.message);
        return null;
    }
}

// Word Game API
async function getSusunKata() {
    try {
        const response = await fetch('https://api.siputzx.my.id/api/games/susunkata');
        const data = await response.json();

        if (data.status && data.data) {
            return {
                soal: data.data.soal,
                tipe: data.data.tipe,
                jawaban: data.data.jawaban
            };
        } else {
            throw new Error('Invalid word game API data structure');
        }
    } catch (error) {
        console.error('Error in getSusunKata:', error.message);
        return null;
    }
}

// Sticker Search API
async function searchStickerly(query) {
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/sticker/stickerly-search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.status && data.data && data.data.length > 0) {
            return data.data;
        } else {
            throw new Error('Stickers not found or invalid data structure');
        }
    } catch (error) {
        console.error('Error in searchStickerly:', error.message);
        return null;
    }
}

// Emoji Mix API
async function mixEmojis(emoji1, emoji2) {
    try {
        const apikey = 'key-dmaz';
        const response = await fetch(`https://api.ferdev.my.id/maker/emojimix?e1=${encodeURIComponent(emoji1)}&e2=${encodeURIComponent(emoji2)}&apikey=${apikey}`, {
            method: 'GET'
        });
        
        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            return arrayBuffer;
        } else {
            throw new Error('Failed to mix emojis');
        }
    } catch (error) {
        console.error('Error in mixEmojis:', error.message);
        return null;
    }
}

// ===== RESULT FORMATTERS =====

// Helper function to format numbers
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Instagram Result Formatter
function formatInstagramResult(result) {
    let postsPreview = '';
    
    if (result.postsData && result.postsData.length > 0) {
        postsPreview = `
            <div style="margin-top: var(--space-lg);">
                <h5 style="margin-bottom: var(--space-md);">Recent Posts (${result.postsData.length} shown):</h5>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-md);">
                    ${result.postsData.slice(0, 6).map(post => `
                        <div style="border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: var(--space-md); background: var(--bg-secondary);">
                            <img src="${post.thumbnail_url}" alt="Post" style="width: 100%; height: 150px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-sm);" />
                            <div style="font-size: 0.875rem; margin-bottom: var(--space-xs);">
                                ${post.is_video ? '<i class="fas fa-video" style="color: var(--error-color);"></i> Video' : '<i class="fas fa-image" style="color: var(--info-color);"></i> Photo'}
                                ${post.view_count ? ` • ${formatNumber(post.view_count)} views` : ''}
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: var(--space-xs);">
                                <i class="fas fa-heart"></i> ${formatNumber(post.like_count)} 
                                <i class="fas fa-comment" style="margin-left: var(--space-sm);"></i> ${formatNumber(post.comment_count)}
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">
                                ${new Date(post.timestamp * 1000).toLocaleDateString()}
                            </div>
                            ${post.caption ? `
                                <div style="font-size: 0.8rem; margin-top: var(--space-sm); color: var(--text-secondary); max-height: 60px; overflow: hidden;">
                                    ${post.caption.length > 100 ? post.caption.substring(0, 100) + '...' : post.caption}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl);">
            <div style="display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-lg);">
                <img src="${result.profilePic}" alt="Profile Picture" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-color);" />
                <div>
                    <h4 style="margin: 0; font-size: 1.5rem;">@${result.username}</h4>
                    <h5 style="margin: var(--space-xs) 0; color: var(--text-secondary); font-weight: 500;">${result.fullname}</h5>
                    <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm); flex-wrap: wrap;">
                        ${result.isVerified ? '<span style="background: var(--info-color); color: white; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-full); font-size: 0.75rem; display: flex; align-items: center; gap: var(--space-xs);"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                        ${result.isPrivate ? '<span style="background: var(--error-color); color: white; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-full); font-size: 0.75rem; display: flex; align-items: center; gap: var(--space-xs);"><i class="fas fa-lock"></i> Private</span>' : '<span style="background: var(--success-color); color: white; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-full); font-size: 0.75rem; display: flex; align-items: center; gap: var(--space-xs);"><i class="fas fa-unlock"></i> Public</span>'}
                        ${result.isBusiness ? '<span style="background: var(--warning-color); color: white; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-full); font-size: 0.75rem; display: flex; align-items: center; gap: var(--space-xs);"><i class="fas fa-briefcase"></i> Business</span>' : ''}
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: var(--space-lg);">
                <strong style="color: var(--text-primary);">Biography:</strong> 
                <p style="margin-top: var(--space-xs); color: var(--text-secondary); line-height: 1.6;">${result.biography}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); margin: var(--space-lg) 0;">
                <div style="text-align: center; padding: var(--space-lg); background: var(--bg-primary); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--info-color);">${result.posts}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: var(--space-xs);">Posts</div>
                </div>
                <div style="text-align: center; padding: var(--space-lg); background: var(--bg-primary); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--error-color);">${result.followers}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: var(--space-xs);">Followers</div>
                </div>
                <div style="text-align: center; padding: var(--space-lg); background: var(--bg-primary); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--success-color);">${result.following}</div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: var(--space-xs);">Following</div>
                </div>
            </div>
            
            ${result.externalUrl ? `
                <div style="margin: var(--space-lg) 0;">
                    <strong style="color: var(--text-primary);">Website:</strong> 
                    <a href="${result.externalUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none; margin-left: var(--space-sm);">${result.externalUrl}</a>
                </div>
            ` : ''}
            
            ${result.bioLinks && result.bioLinks.length > 0 ? `
                <div style="margin: var(--space-lg) 0;">
                    <strong style="color: var(--text-primary);">Bio Links:</strong>
                    <div style="margin-top: var(--space-sm);">
                        ${result.bioLinks.map(link => `
                            <a href="${link.url}" target="_blank" style="display: inline-block; background: var(--primary-color); color: white; padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md); text-decoration: none; margin-right: var(--space-sm); margin-bottom: var(--space-sm);">
                                ${link.title || link.url}
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${postsPreview}
        </div>
    `;
}

// Weather Result Formatter
function formatWeatherResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl);">
            <h4 style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-lg); color: var(--primary-color);">
                <i class="fas fa-map-marker-alt"></i>
                ${result.fullLocationName}
            </h4>
            <div style="white-space: pre-line; font-family: var(--font-mono); background: var(--bg-primary); padding: var(--space-lg); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                ${result.forecastText}
            </div>
        </div>
    `;
}

// Earthquake Result Formatter
function formatEarthquakeResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl);">
            <img src="${result.shakemapUrl}" alt="Earthquake Map" style="width: 100%; max-width: 400px; border-radius: var(--radius-md); margin-bottom: var(--space-lg); display: block; margin-left: auto; margin-right: auto;" />
            <h4 style="text-align: center; margin-bottom: var(--space-lg); color: var(--primary-color);">Latest Earthquake Information</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md);">
                <div style="background: var(--bg-primary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <strong style="color: var(--text-primary);">Date:</strong>
                    <p style="margin-top: var(--space-xs); color: var(--text-secondary);">${result.tanggal}</p>
                </div>
                <div style="background: var(--bg-primary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <strong style="color: var(--text-primary);">Time:</strong>
                    <p style="margin-top: var(--space-xs); color: var(--text-secondary);">${result.jam}</p>
                </div>
                <div style="background: var(--bg-primary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <strong style="color: var(--text-primary);">Magnitude:</strong>
                    <p style="margin-top: var(--space-xs); color: var(--error-color); font-weight: 600;">${result.magnitude}</p>
                </div>
                <div style="background: var(--bg-primary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                    <strong style="color: var(--text-primary);">Depth:</strong>
                    <p style="margin-top: var(--space-xs); color: var(--text-secondary);">${result.kedalaman}</p>
                </div>
                <div style="background: var(--bg-primary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-color); grid-column: 1 / -1;">
                    <strong style="color: var(--text-primary);">Location:</strong>
                    <p style="margin-top: var(--space-xs); color: var(--text-secondary);">${result.wilayah}</p>
                </div>
                <div style="background: var(--bg-primary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-color); grid-column: 1 / -1;">
                    <strong style="color: var(--text-primary);">Potential:</strong>
                    <p style="margin-top: var(--space-xs); color: var(--warning-color); font-weight: 500;">${result.potensi}</p>
                </div>
            </div>
        </div>
    `;
}

// TikTok Result Formatter
function formatTikTokResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl);">
            <h4 style="margin-bottom: var(--space-md); color: var(--text-primary);">${result.title || 'TikTok Video'}</h4>
            <p style="margin-bottom: var(--space-md);"><strong>Creator:</strong> ${result.creator || 'Unknown'}</p>
            ${result.description ? `<p style="margin-bottom: var(--space-lg); color: var(--text-secondary);"><strong>Description:</strong> ${result.description}</p>` : ''}
            
            <div style="margin: var(--space-lg) 0;">
                <h5 style="margin-bottom: var(--space-md); color: var(--primary-color);">Download Options:</h5>
                <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                    ${result.videoUrls.map((url, index) => `
                        <a href="${url}" style="display: flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-md); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition-base);" target="_blank" download onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary-color)'">
                            <i class="fas fa-download"></i>
                            <span>Download Video ${index + 1}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: var(--space-lg); padding: var(--space-md); background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <i class="fas fa-info-circle"></i> Right-click and "Save as..." to download
            </p>
        </div>
    `;
}

// Instagram Download Result Formatter
function formatInstagramDownloadResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center;">
            <h4 style="margin-bottom: var(--space-lg); color: var(--text-primary);">Instagram Media Downloaded</h4>
            ${result.thumbnail ? `<img src="${result.thumbnail}" alt="Media Thumbnail" style="width: 100%; max-width: 300px; border-radius: var(--radius-md); margin-bottom: var(--space-lg);" />` : ''}
            
            <a href="${result.url}" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-md); text-decoration: none; font-weight: 500; transition: var(--transition-base);" target="_blank" download onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary-color)'">
                <i class="fas fa-download"></i>
                <span>Download Media</span>
            </a>
            
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: var(--space-lg); padding: var(--space-md); background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <i class="fas fa-info-circle"></i> Right-click and "Save as..." to download
            </p>
        </div>
    `;
}

// Generic Download Result Formatter
function formatDownloadResult(result, mediaType) {
    if (mediaType === 'video') {
        return `
            <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center;">
                <video controls style="width: 100%; max-width: 400px; border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
                    <source src="${result.videoUrl || result.mediaUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                ${result.title ? `<h4 style="margin-bottom: var(--space-md); color: var(--text-primary);">${result.title}</h4>` : ''}
                ${result.creator ? `<p style="margin-bottom: var(--space-lg);"><strong>Creator:</strong> ${result.creator}</p>` : ''}
                <a href="${result.videoUrl || result.mediaUrl}" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-md); text-decoration: none; font-weight: 500;" download>
                    <i class="fas fa-download"></i>
                    <span>Download Video</span>
                </a>
            </div>
        `;
    } else {
        return `
            <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center;">
                <img src="${result.mediaUrl}" alt="Downloaded Image" style="width: 100%; max-width: 400px; border-radius: var(--radius-md); margin-bottom: var(--space-lg);" />
                <a href="${result.mediaUrl}" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-md); text-decoration: none; font-weight: 500;" download>
                    <i class="fas fa-download"></i>
                    <span>Download Image</span>
                </a>
            </div>
        `;
    }
}

// Facebook Result Formatter
function formatFacebookResult(result) {
    const videoOptions = result.videoOptions || [];
    
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl);">
            ${result.thumbnail ? `<img src="${result.thumbnail}" alt="Video Thumbnail" style="width: 100%; max-width: 400px; border-radius: var(--radius-md); margin-bottom: var(--space-lg); display: block; margin-left: auto; margin-right: auto;" />` : ''}
            <h4 style="text-align: center; margin-bottom: var(--space-lg); color: var(--text-primary);">${result.title || 'Facebook Video'}</h4>
            
            <div style="margin: var(--space-lg) 0;">
                <h5 style="margin-bottom: var(--space-md); color: var(--primary-color);">Download Options:</h5>
                <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                    ${videoOptions.map(option => `
                        <a href="${option.url}" style="display: flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-md); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition-base);" target="_blank" download onmouseover="this.style.background='var(--primary-dark)'" onmouseout="this.style.background='var(--primary-color)'">
                            <i class="fas fa-download"></i>
                            <span>Download ${option.resolution} (${option.format.toUpperCase()})</span>
                        </a>
                    `).join('')}
                </div>
            </div>
            
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: var(--space-lg); padding: var(--space-md); background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <i class="fas fa-info-circle"></i> Right-click and "Save as..." to download
            </p>
        </div>
    `;
}

// Google Drive Result Formatter
function formatGDriveResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center;">
            <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: var(--space-md);">
                <i class="fab fa-google-drive"></i>
            </div>
            <h4 style="margin-bottom: var(--space-md); color: var(--text-primary);">📁 ${result.fileName}</h4>
            <p style="margin-bottom: var(--space-lg);"><strong>Original Link:</strong> <a href="${result.originalLink}" target="_blank" style="color: var(--primary-color);">View on Google Drive</a></p>
            <a href="${result.downloadUrl}" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-md); text-decoration: none; font-weight: 500;" download>
                <i class="fas fa-download"></i>
                <span>Download File</span>
            </a>
        </div>
    `;
}

// CapCut Result Formatter
function formatCapCutResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center;">
            ${result.thumbnail ? `<img src="${result.thumbnail}" alt="Video Thumbnail" style="width: 100%; max-width: 300px; border-radius: var(--radius-md); margin-bottom: var(--space-lg);" />` : ''}
            <h4 style="margin-bottom: var(--space-md); color: var(--text-primary);">${result.title}</h4>
            <p style="margin-bottom: var(--space-lg);"><strong>Author:</strong> ${result.author}</p>
            <video controls style="width: 100%; max-width: 400px; border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
                <source src="${result.videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <a href="${result.videoUrl}" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-md); text-decoration: none; font-weight: 500;" download>
                <i class="fas fa-download"></i>
                <span>Download Video</span>
            </a>
        </div>
    `;
}

// Terabox Result Formatter
function formatTeraboxResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center;">
            ${result.thumbnail ? `<img src="${result.thumbnail}" alt="File Thumbnail" style="width: 100%; max-width: 300px; border-radius: var(--radius-md); margin-bottom: var(--space-lg);" />` : ''}
            <h4 style="margin-bottom: var(--space-md); color: var(--text-primary);">📁 ${result.fileName}</h4>
            <p style="margin-bottom: var(--space-lg);"><strong>Size:</strong> ${result.size}</p>
                        <a href="${result.downloadUrl}" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-md); text-decoration: none; font-weight: 500;" download>
                <i class="fas fa-download"></i>
                <span>Download File</span>
            </a>
        </div>
    `;
}

// Scribd Result Formatter
function formatScribdResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center;">
            <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: var(--space-md);">
                <i class="fas fa-file-pdf"></i>
            </div>
            <h4 style="margin-bottom: var(--space-lg); color: var(--text-primary);">📄 Scribd Document</h4>
            <p style="margin-bottom: var(--space-lg); color: var(--text-secondary);">Document is ready for download</p>
            <a href="${result.downloadUrl}" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-md); text-decoration: none; font-weight: 500;" download>
                <i class="fas fa-download"></i>
                <span>Download PDF</span>
            </a>
        </div>
    `;
}

// AI Result Formatter
function formatAIResult(result) {
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl);">
            <h4 style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-lg); color: var(--primary-color);">
                <i class="fas fa-robot"></i>
                AI Assistant Response
            </h4>
            <div style="white-space: pre-wrap; line-height: 1.6; background: var(--bg-primary); padding: var(--space-lg); border-radius: var(--radius-md); border: 1px solid var(--border-color); font-family: var(--font-sans);">
                ${result}
            </div>
        </div>
    `;
}

// Sticker Result Formatter
function formatStickerResult(results) {
    const topResults = results.slice(0, 6);
    
    let html = `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl);">
            <h4 style="text-align: center; margin-bottom: var(--space-lg); color: var(--primary-color);">Sticker Search Results</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-lg);">
    `;
    
    topResults.forEach(sticker => {
        html += `
            <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: var(--space-lg); text-align: center; transition: var(--transition-base);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                <img src="${sticker.thumbnailUrl}" alt="${sticker.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--space-md);" />
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-xs);">${sticker.name}</div>
                <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-sm);">by ${sticker.author}</div>
                <div style="background: var(--primary-color); color: white; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-full); font-size: 0.8rem; display: inline-block; margin-bottom: var(--space-sm);">${sticker.stickerCount} stickers</div>
                <br>
                <a href="${sticker.url}" target="_blank" style="background: var(--accent-color); color: white; padding: var(--space-sm) var(--space-md); border-radius: var(--radius-full); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: var(--transition-base);" onmouseover="this.style.background='var(--accent-light)'" onmouseout="this.style.background='var(--accent-color)'">
                    View Pack
                </a>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    return html;
}

// Emoji Mix Result Formatter
function formatEmojiMixResult(imageBuffer, emoji1, emoji2) {
    const base64Image = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))}`;
    
    return `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: var(--space-xl); text-align: center;">
            <h4 style="margin-bottom: var(--space-lg); color: var(--primary-color);">🎨 ${emoji1} + ${emoji2}</h4>
            <img src="${base64Image}" alt="Mixed Emoji" style="width: 200px; height: 200px; border-radius: var(--radius-lg); margin-bottom: var(--space-lg); border: 2px solid var(--primary-color);" />
            <br>
            <a href="${base64Image}" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: var(--primary-color); color: white; padding: var(--space-lg) var(--space-xl); border-radius: var(--radius-md); text-decoration: none; font-weight: 500;" download="emoji-mix.png">
                <i class="fas fa-download"></i>
                <span>Download Image</span>
            </a>
        </div>
    `;
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.tool-card, .feature-card, .hero-card-stack, .about-visual');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Retry mechanism for failed requests
async function retryRequest(requestFunction, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFunction();
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            console.log(`Request failed, retrying... (${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

// Handle network errors
function handleNetworkError(error) {
    console.error('Network error:', error);
    showToast('Network error. Please check your internet connection and try again.', 'error');
}

// Debounce function for search inputs
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

// Throttle function for scroll events
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
    }
}

// Check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Check if device is tablet
function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// ===== ACCESSIBILITY =====
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.background = 'var(--primary-color)';
    skipLink.style.color = 'white';
    skipLink.style.padding = '8px';
    skipLink.style.borderRadius = '4px';
    skipLink.style.textDecoration = 'none';
    skipLink.style.zIndex = '10000';
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation for tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.addEventListener('keydown', (e) => {
            let nextIndex;
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    nextIndex = (index + 1) % toolCards.length;
                    toolCards[nextIndex].focus();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    nextIndex = (index - 1 + toolCards.length) % toolCards.length;
                    toolCards[nextIndex].focus();
                    break;
            }
        });
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
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
    
    images.forEach(img => imageObserver.observe(img));

    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    preloadLink.as = 'style';
    document.head.appendChild(preloadLink);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An unexpected error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An error occurred while processing your request.', 'error');
});

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', throttle(() => {
    // Close mobile menu on resize to desktop
    if (!isMobile()) {
        closeMobileMenu();
    }
    
    // Recalculate animations
    const animatedElements = document.querySelectorAll('[style*="transform"]');
    animatedElements.forEach(element => {
        element.style.transition = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.transition = '';
    });
}, 250));

// ===== SERVICE WORKER REGISTRATION =====
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

// ===== ANALYTICS & TRACKING =====
function trackEvent(eventName, properties = {}) {
    // Add your analytics tracking code here
    console.log('Event tracked:', eventName, properties);
}

// Track tool usage
document.addEventListener('click', (e) => {
    const toolCard = e.target.closest('.tool-card');
    if (toolCard) {
        const toolType = toolCard.getAttribute('data-tool');
        trackEvent('tool_opened', { tool: toolType });
    }
});

// ===== INITIALIZATION COMPLETE =====
console.log('🎉 Dimas Tools fully initialized!');

// Add some CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .tool-card {
        will-change: transform;
    }
    
    .hero-card-stack {
        will-change: transform;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .tool-preview-card,
        .shape,
        .loading-dots span,
        .splash-logo {
            animation: none !important;
        }
    }
`;
document.head.appendChild(style);

// ===== FEATURE FLAGS =====
const FEATURES = {
    DARK_MODE: true,
    ANALYTICS: false,
    PWA: true,
    OFFLINE_MODE: false
};

// ===== OFFLINE DETECTION =====
if (FEATURES.OFFLINE_MODE) {
    window.addEventListener('online', () => {
        showToast('You are back online!', 'success');
    });

    window.addEventListener('offline', () => {
        showToast('You are offline. Some features may not work.', 'warning');
    });
}

// ===== PWA INSTALL PROMPT =====
if (FEATURES.PWA) {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button
        const installBtn = document.createElement('button');
        installBtn.textContent = 'Install App';
        installBtn.className = 'btn btn-outline btn-sm';
        installBtn.style.position = 'fixed';
        installBtn.style.bottom = '20px';
        installBtn.style.left = '20px';
        installBtn.style.zIndex = '1000';
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
                document.body.removeChild(installBtn);
            }
        });
        
        document.body.appendChild(installBtn);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (document.body.contains(installBtn)) {
                document.body.removeChild(installBtn);
            }
        }, 10000);
    });
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        showToast,
        openToolModal,
        closeModal,
        isMobile,
        isTablet
    };
}

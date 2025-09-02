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

// Result Display Functions
function displayTikTokResult(data) {
    // Extract video information
    const videoInfo = {
        title: data.title || 'Video TikTok',
        author: data.author || {},
        thumbnail: data.cover || data.wmplay || 'https://via.placeholder.com/200x250?text=TikTok+Video',
        stats: {
            playCount: data.play_count || 0,
            shareCount: data.share_count || 0,
            downloadCount: data.download_count || 0
        }
    };

    // Build download options
    let downloadOptions = '';

    // Video without watermark (priority)
    if (data.play) {
        downloadOptions += `
            <div class="option-card">
                <div class="option-info">
                    <h4><i class="fas fa-video"></i> Video HD (Tanpa Watermark)</h4>
                    <p>Kualitas terbaik tanpa watermark TikTok</p>
                    <span class="file-size">MP4 - HD</span>
                </div>
                <button class="download-option-btn" onclick="downloadFile('${data.play}', 'tiktok-video-hd.mp4')">
                    <i class="fas fa-download"></i>
                    Download Video HD
                </button>
            </div>
        `;
    }

    // Video with watermark (alternative)
    if (data.wmplay) {
        downloadOptions += `
            <div class="option-card">
                <div class="option-info">
                    <h4><i class="fas fa-video"></i> Video (Dengan Watermark)</h4>
                    <p>Video dengan watermark TikTok</p>
                    <span class="file-size">MP4 - Original</span>
                </div>
                <button class="download-option-btn" onclick="downloadFile('${data.wmplay}', 'tiktok-video-wm.mp4')">
                    <i class="fas fa-download"></i>
                    Download Video
                </button>
            </div>
        `;
    }

    // HD Video (if available)
    if (data.hdplay && data.hdplay !== data.play) {
        downloadOptions += `
            <div class="option-card">
                <div class="option-info">
                    <h4><i class="fas fa-video"></i> Video HD</h4>
                    <p>Video kualitas HD tanpa watermark</p>
                    <span class="file-size">MP4 - HD</span>
                </div>
                <button class="download-option-btn" onclick="downloadFile('${data.hdplay}', 'tiktok-video-hd.mp4')">
                    <i class="fas fa-download"></i>
                    Download HD
                </button>
            </div>
        `;
    }

    // Audio option
    if (data.music || data.music_info?.play) {
        const audioUrl = data.music || data.music_info?.play;
        downloadOptions += `
            <div class="option-card">
                <div class="option-info">
                    <h4><i class="fas fa-music"></i> Audio (MP3)</h4>
                    <p>Ekstrak audio dari video TikTok</p>
                    <span class="file-size">MP3 - Audio</span>
                </div>
                <button class="download-option-btn" onclick="downloadFile('${audioUrl}', 'tiktok-audio.mp3')">
                    <i class="fas fa-download"></i>
                    Download Audio
                </button>
            </div>
        `;
    }

    // If no specific video URLs, try using any available video URL
    if (!data.play && !data.wmplay && !data.hdplay) {
        // Check for other possible video URL properties
        const possibleVideoUrls = [
            data.video_url,
            data.url,
            data.download_url,
            data.no_watermark,
            data.watermark
        ].filter(url => url);

        possibleVideoUrls.forEach((url, index) => {
            downloadOptions += `
                <div class="option-card">
                    <div class="option-info">
                        <h4><i class="fas fa-video"></i> Video ${index + 1}</h4>
                        <p>Download video TikTok</p>
                        <span class="file-size">MP4</span>
                    </div>
                    <button class="download-option-btn" onclick="downloadFile('${url}', 'tiktok-video-${index + 1}.mp4')">
                        <i class="fas fa-download"></i>
                        Download Video
                    </button>
                </div>
            `;
        });
    }

    const resultHTML = `
        <div class="result-card">
            <div class="video-info">
                <div class="video-thumbnail">
                    <img src="${videoInfo.thumbnail}" alt="Video Thumbnail" onerror="this.src='https://via.placeholder.com/200x250?text=TikTok+Video'">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-details">
                    <h3>${videoInfo.title}</h3>
                    <div class="video-stats">
                        <span><i class="fas fa-eye"></i> ${formatNumber(videoInfo.stats.playCount)} views</span>
                        <span><i class="fas fa-share"></i> ${formatNumber(videoInfo.stats.shareCount)} shares</span>
                        <span><i class="fas fa-download"></i> ${formatNumber(videoInfo.stats.downloadCount)} downloads</span>
                    </div>
                    <div class="author-info">
                        <img src="${videoInfo.author.avatar || 'https://via.placeholder.com/50x50?text=User'}" alt="Author" onerror="this.src='https://via.placeholder.com/50x50?text=User'">
                        <div>
                            <p class="author-name">@${videoInfo.author.unique_id || videoInfo.author.username || 'Unknown'}</p>
                            <p class="author-nickname">${videoInfo.author.nickname || videoInfo.author.name || 'TikTok User'}</p>
                        </div>
                    </div>
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

    resultContent.innerHTML = resultHTML;
    showResults();
}

function displayFacebookResult(data) {
    const videoInfo = {
        title: data.title || 'Video Facebook',
        thumbnail: data.thumbnail || 'https://via.placeholder.com/200x250?text=Facebook+Video'
    };

    let downloadOptions = '';

    // HD Video
    if (data.hd) {
        downloadOptions += `
            <div class="option-card">
                <div class="option-info">
                    <h4><i class="fas fa-video"></i> Video HD</h4>
                    <p>Download video Facebook kualitas HD</p>
                    <span class="file-size">MP4 - HD</span>
                </div>
                <button class="download-option-btn" onclick="downloadFile('${data.hd}', 'facebook-video-hd.mp4')">
                    <i class="fas fa-download"></i>
                    Download HD
                </button>
            </div>
        `;
    }

    // SD Video
    if (data.sd) {
        downloadOptions += `
            <div class="option-card">
                <div class="option-info">
                    <h4><i class="fas fa-video"></i> Video SD</h4>
                    <p>Download video Facebook kualitas SD</p>
                    <span class="file-size">MP4 - SD</span>
                </div>
                <button class="download-option-btn" onclick="downloadFile('${data.sd}', 'facebook-video-sd.mp4')">
                    <i class="fas fa-download"></i>
                    Download SD
                </button>
            </div>
        `;
    }

    const resultHTML = `
        <div class="result-card">
            <div class="video-info">
                <div class="video-thumbnail">
                    <img src="${videoInfo.thumbnail}" alt="Video Thumbnail" onerror="this.src='https://via.placeholder.com/200x250?text=Facebook+Video'">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-details">
                    <h3>${videoInfo.title}</h3>
                    <div class="video-stats">
                        <span><i class="fab fa-facebook"></i> Facebook Video</span>
                    </div>
                </div>
            </div>
            
            <div class="download-options">
                ${downloadOptions}
            </div>
        </div>
    `;

    resultContent.innerHTML = resultHTML;
    showResults();
}

function displayScribdResult(downloadUrl, originalUrl) {
    const fileName = extractFileNameFromUrl(originalUrl) || 'document';
    
    const resultHTML = `
        <div class="result-card scribd-result">
            <div class="file-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <h3>Dokumen Scribd Siap Diunduh</h3>
            <p>Dokumen telah berhasil diproses dan siap untuk diunduh dalam format PDF.</p>
            
            <div class="download-options">
                <div class="option-card">
                    <div class="option-info">
                        <h4><i class="fas fa-file-pdf"></i> Dokumen PDF</h4>
                        <p>Download dokumen Scribd dalam format PDF</p>
                        <span class="file-size">PDF</span>
                    </div>
                    <button class="download-option-btn" onclick="downloadFile('${downloadUrl}', '${fileName}.pdf')">
                        <i class="fas fa-download"></i>
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    `;

    resultContent.innerHTML = resultHTML;
    showResults();
}

// Utility Functions
function downloadFile(url, filename) {
    // Show download starting toast
    showToast('success', 'Download dimulai...');
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show completion toast after a delay
    setTimeout(() => {
        showToast('success', 'File berhasil diunduh!');
    }, 1000);
}

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
        return segments[segments.length - 1] || 'document';
    } catch {
        return 'document';
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

function showResults() {
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
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Smooth scrolling for navigation links
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

// Initialize animations and scroll effects
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
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step, .platform-tab').forEach(el => {
        observer.observe(el);
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(102, 126, 234, 0.1)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Debug function to log API responses
function debugApiResponse(platform, data) {
    console.log(`${platform} API Response:`, data);
    
    // Log available properties for debugging
    if (data.data) {
        console.log(`Available ${platform} properties:`, Object.keys(data.data));
    }
                                                         }

// API Configuration
const API_BASE_URL = 'https://api.ferdev.my.id/downloader/tiktok';
const API_KEY = 'key-dmaz';

// DOM Elements
const downloadBtn = document.getElementById('download-btn');
const tiktokUrlInput = document.getElementById('tiktok-url');
const loadingElement = document.getElementById('loading');
const resultElement = document.getElementById('result');

// Video elements
const videoCover = document.getElementById('video-cover');
const videoTitle = document.getElementById('video-title');
const playCount = document.getElementById('play-count');
const shareCount = document.getElementById('share-count');
const downloadCount = document.getElementById('download-count');
const authorAvatar = document.getElementById('author-avatar');
const authorName = document.getElementById('author-name');
const authorNickname = document.getElementById('author-nickname');
const videoSize = document.getElementById('video-size');
const downloadVideoBtn = document.getElementById('download-video');
const downloadAudioBtn = document.getElementById('download-audio');

// Global video data
let currentVideoData = null;

// Event Listeners
downloadBtn.addEventListener('click', handleDownload);
tiktokUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleDownload();
    }
});

downloadVideoBtn.addEventListener('click', () => downloadFile(currentVideoData.data.play, 'video'));
downloadAudioBtn.addEventListener('click', () => downloadFile(currentVideoData.data.music, 'audio'));

// Smooth scrolling for navigation links
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

// Main download function
async function handleDownload() {
    const url = tiktokUrlInput.value.trim();
    
    if (!url) {
        showNotification('Masukkan link TikTok terlebih dahulu!', 'error');
        return;
    }
    
    if (!isValidTikTokUrl(url)) {
        showNotification('Link TikTok tidak valid!', 'error');
        return;
    }
    
    try {
        showLoading(true);
        hideResult();
        
        const videoData = await fetchVideoData(url);
        
        if (videoData.success) {
            currentVideoData = videoData;
            displayVideoInfo(videoData);
            showResult();
            showNotification('Video berhasil diproses!', 'success');
        } else {
            throw new Error('Gagal memproses video');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Terjadi kesalahan saat memproses video. Coba lagi!', 'error');
    } finally {
        showLoading(false);
    }
}

// Fetch video data from API
async function fetchVideoData(url) {
    const apiUrl = `${API_BASE_URL}?link=${encodeURIComponent(url)}&apikey=${API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

// Display video information
function displayVideoInfo(videoData) {
    const data = videoData.data;
    
    // Set video thumbnail
    videoCover.src = data.cover;
    videoCover.alt = data.title;
    
    // Set video details
    videoTitle.textContent = data.title || 'TikTok Video';
    playCount.textContent = formatNumber(data.play_count || 0);
    shareCount.textContent = formatNumber(data.share_count || 0);
    downloadCount.textContent = formatNumber(data.download_count || 0);
    
    // Set author info
    if (data.author) {
        authorAvatar.src = data.author.avatar;
        authorName.textContent = `@${data.author.unique_id}`;
        authorNickname.textContent = data.author.nickname;
    }
    
    // Set file size
    if (data.size) {
        videoSize.textContent = formatFileSize(data.size);
    }
}

// Download file function
async function downloadFile(url, type) {
    try {
        showNotification('Memulai download...', 'info');
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `tiktok_${type}_${Date.now()}.${type === 'video' ? 'mp4' : 'mp3'}`;
        link.target = '_blank';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(`${type === 'video' ? 'Video' : 'Audio'} sedang didownload!`, 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Gagal mendownload file. Coba lagi!', 'error');
    }
}

// Utility functions
function isValidTikTokUrl(url) {
    const tiktokRegex = /^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)/i;
    return tiktokRegex.test(url);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showLoading(show) {
    if (show) {
        loadingElement.classList.add('show');
    } else {
        loadingElement.classList.remove('show');
    }
}

function showResult() {
    resultElement.classList.add('show');
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideResult() {
    resultElement.classList.remove('show');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        min-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #00C851, #00A843)',
        error: 'linear-gradient(135deg, #ff3333, #cc0000)',
        warning: 'linear-gradient(135deg, #ffbb33, #ff8800)',
        info: 'linear-gradient(135deg, #33b5e5, #0099cc)'
    };
    return colors[type] || colors.info;
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
});

// Add loading animation to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
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
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .video-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Focus on input when page loads
    tiktokUrlInput.focus();
    
    // Add example URL on demo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            showNotification('Demo mode: Anda dapat menggunakan link TikTok apa saja untuk testing!', 'info');
        }, 1000);
    }
});

// Handle paste event
tiktokUrlInput.addEventListener('paste', (e) => {
    setTimeout(() => {
        const pastedText = e.target.value;
        if (isValidTikTokUrl(pastedText)) {
            showNotification('Link TikTok terdeteksi! Klik download untuk memproses.', 'success');
        }
    }, 100);
});

// Prevent right-click on video elements (optional)
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' && e.target.id === 'video-cover') {
        e.preventDefault();
    }
});

// Copy URL functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Link berhasil disalin!', 'success');
    }).catch(() => {
        showNotification('Gagal menyalin link!', 'error');
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to download
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleDownload();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        tiktokUrlInput.value = '';
        hideResult();
        tiktokUrlInput.focus();
    }
});

// Service Worker registration (optional, for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => {
                console.log('SW registered');
            })
            .catch(() => {
                console.log('SW registration failed');
            });
    });
        }

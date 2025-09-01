// Global variables
let currentFeature = 'chat-ai';
const GEMINI_API_KEY = 'AIzaSyAR2UE1z-QAMFgpKZShxeIn8eouefPlcAY'; // Ganti dengan API key Anda
const TIKTOK_API_KEY = 'key-dmaz'; // Sesuai dengan yang Anda berikan

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatureSelector();
    initializeChatInput();
});

// Feature selector functionality
function initializeFeatureSelector() {
    const featureButtons = document.querySelectorAll('.feature-btn');
    const featureContents = document.querySelectorAll('.feature-content');
    
    featureButtons.forEach(button => {
        button.addEventListener('click', function() {
            const feature = this.dataset.feature;
            switchFeature(feature);
        });
    });
}

function switchFeature(feature) {
    // Update active button
    document.querySelectorAll('.feature-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-feature="${feature}"]`).classList.add('active');
    
    // Update active content
    document.querySelectorAll('.feature-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(feature).classList.add('active');
    
    currentFeature = feature;
}

// Chat AI functionality
function initializeChatInput() {
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Disable send button temporarily
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
        // Call Gemini API
        const response = await callGeminiAPI(message);
        addMessageToChat(response, 'ai');
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        addMessageToChat('Maaf, terjadi kesalahan. Silakan coba lagi.', 'ai');
    }
    
    // Re-enable send button
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
}

async function callGeminiAPI(message) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: message
                }]
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to get response from AI');
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const icon = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${sender === 'ai' ? icon : ''}
            <span>${message}</span>
            ${sender === 'user' ? icon : ''}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message ai-message">
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <span>Chat telah dibersihkan. Ada yang bisa saya bantu?</span>
            </div>
        </div>
    `;
}

// TikTok Downloader functionality
async function downloadTikTok() {
    const urlInput = document.getElementById('tiktokUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Silakan masukkan link TikTok terlebih dahulu');
        return;
    }
    
    if (!isValidTikTokUrl(url)) {
        alert('Link TikTok tidak valid. Pastikan format URL benar.');
        return;
    }
    
    const downloadBtn = document.getElementById('downloadBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const downloadResult = document.getElementById('downloadResult');
    
    // Show loading
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    loadingSpinner.style.display = 'block';
    downloadResult.style.display = 'none';
    
    try {
        const response = await fetch(`https://api.ferdev.my.id/downloader/tiktok?link=${encodeURIComponent(url)}&apikey=${TIKTOK_API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Failed to download video');
        }
        
        const data = await response.json();
        
        if (data.success) {
            displayDownloadResult(data.data);
        } else {
            throw new Error('Failed to process video');
        }
        
    } catch (error) {
        console.error('Error downloading TikTok video:', error);
        alert('Gagal mendownload video. Silakan coba lagi atau periksa link.');
    }
    
    // Hide loading
    loadingSpinner.style.display = 'none';
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
}

function isValidTikTokUrl(url) {
    const tiktokRegex = /^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)/;
    return tiktokRegex.test(url);
}

function displayDownloadResult(data) {
    const downloadResult = document.getElementById('downloadResult');
    
    const formatFileSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };
    
    downloadResult.innerHTML = `
        <div class="video-info">
            <img src="${data.cover}" alt="Video thumbnail" class="video-thumbnail" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA0NVY3NUwyNyA2MEw2MCA0NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'">
            <div class="video-details">
                <h4>${data.title || 'TikTok Video'}</h4>
                <div class="video-stats">
                    <span class="stat"><i class="fas fa-play"></i> ${data.play_count?.toLocaleString() || '0'} views</span>
                    <span class="stat"><i class="fas fa-share"></i> ${data.share_count || '0'} shares</span>
                    <span class="stat"><i class="fas fa-file"></i> ${formatFileSize(data.size || 0)}</span>
                </div>
                <div class="author-info">
                    <strong>@${data.author?.unique_id || 'unknown'}</strong>
                </div>
            </div>
        </div>
        <div class="download-buttons">
            <a href="${data.play}" class="download-btn" download>
                <i class="fas fa-video"></i> Download Video
            </a>
            ${data.music ? `
                <a href="${data.music}" class="download-btn" download>
                    <i class="fas fa-music"></i> Download Audio
                </a>
            ` : ''}
        </div>
    `;
    
    downloadResult.style.display = 'block';
}

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Service worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

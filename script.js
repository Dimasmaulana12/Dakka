// Global variables
let currentFeature = 'chat-ai';
const GEMINI_API_KEY = 'AIzaSyAR2UE1z-QAMFgpKZShxeIn8eouefPlcAY';
const TIKTOK_API_KEY = 'key-dmaz';

// Chat history
let chatHistory = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatureSelector();
    initializeChatInput();
    loadChatHistory();
    updateCharCount();
    
    // Load saved chat history
    const savedHistory = localStorage.getItem('dmaz-chat-history');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
        displayChatHistory();
    }
});

// Feature selector functionality
function initializeFeatureSelector() {
    const featureButtons = document.querySelectorAll('.feature-btn');
    
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
    
    // Hide suggestions if switching away from chat
    if (feature !== 'chat-ai') {
        hideSuggestions();
    } else {
        showSuggestions();
    }
}

// Chat AI functionality
function initializeChatInput() {
    const chatInput = document.getElementById('chatInput');
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    chatInput.addEventListener('input', updateCharCount);
}

function updateCharCount() {
    const chatInput = document.getElementById('chatInput');
    const charCount = document.querySelector('.char-count');
    if (charCount && chatInput) {
        const currentLength = chatInput.value.length;
        charCount.textContent = `${currentLength}/1000`;
        
        if (currentLength > 900) {
            charCount.style.color = '#ef4444';
        } else if (currentLength > 800) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#6b7280';
        }
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Hide suggestions after first message
    hideSuggestions();
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    chatHistory.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
    
    input.value = '';
    updateCharCount();
    
    // Disable send button and show loading
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
        // Show typing indicator
        showTypingIndicator();
        
        // Call Gemini API with improved context
        const response = await callGeminiAPI(message);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        addMessageToChat(response, 'ai', true);
        chatHistory.push({ role: 'ai', content: response, timestamp: new Date().toISOString() });
        
        // Save chat history
        saveChatHistory();
        
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        removeTypingIndicator();
        
        let errorMessage = 'Maaf, terjadi kesalahan saat menghubungi AI. ';
        
        if (error.message.includes('API key')) {
            errorMessage += 'Periksa kembali API key Anda.';
        } else if (error.message.includes('quota')) {
            errorMessage += 'Kuota API habis. Silakan coba lagi nanti.';
        } else if (error.message.includes('network')) {
            errorMessage += 'Periksa koneksi internet Anda.';
        } else {
            errorMessage += 'Silakan coba lagi dalam beberapa saat.';
        }
        
        addMessageToChat(errorMessage, 'ai');
    }
    
    // Re-enable send button
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
}

async function callGeminiAPI(message) {
    // Prepare conversation context
    const conversationContext = chatHistory.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));
    
    // Add current message
    conversationContext.push({
        role: 'user',
        parts: [{ text: message }]
    });
    
    const requestBody = {
        contents: conversationContext,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    };
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        
        if (response.status === 400) {
            throw new Error('Invalid API key atau request format salah');
        } else if (response.status === 429) {
            throw new Error('API quota exceeded');
        } else if (response.status === 403) {
            throw new Error('API key tidak valid atau tidak memiliki akses');
        } else {
            throw new Error(`API Error: ${response.status}`);
        }
    }
    
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API');
    }
    
    return data.candidates[0].content.parts[0].text;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-bubble">
                <div class="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add typing animation CSS if not exists
    if (!document.getElementById('typing-styles')) {
        const style = document.createElement('style');
        style.id = 'typing-styles';
        style.textContent = `
            .typing-animation {
                display: flex;
                gap: 4px;
                padding: 8px 0;
            }
            .typing-animation span {
                width: 8px;
                height: 8px;
                background: #6b7280;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }
            .typing-animation span:nth-child(1) { animation-delay: 0s; }
            .typing-animation span:nth-child(2) { animation-delay: 0.2s; }
            .typing-animation span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30% { transform: translateY(-10px); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function addMessageToChat(message, sender, useTypingEffect = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const avatar = sender === 'ai' 
        ? '<i class="fas fa-robot"></i>' 
        : '<i class="fas fa-user"></i>';
    
    // Format message for better display
    const formattedMessage = formatMessage(message);
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-bubble">
                <p class="message-text">${useTypingEffect && sender === 'ai' ? '' : formattedMessage}</p>
            </div>
        </div>
        <div class="message-time">
            <span>${currentTime}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add typing effect for AI messages
    if (useTypingEffect && sender === 'ai') {
        typeMessage(messageDiv.querySelector('.message-text'), formattedMessage);
    }
}

function typeMessage(element, message) {
    let index = 0;
    const speed = 30; // milliseconds per character
    
    // Add typing indicator
    element.innerHTML = '<span class="typing-cursor">|</span>';
    
    function typeChar() {
        if (index < message.length) {
            element.innerHTML = message.substring(0, index + 1) + '<span class="typing-cursor">|</span>';
            index++;
            setTimeout(typeChar, speed);
        } else {
            // Remove typing cursor when done
            element.innerHTML = message;
        }
    }
    
    setTimeout(typeChar, 500); // Small delay before starting
}

function formatMessage(message) {
    // Basic formatting for better readability
    return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
}

function sendSuggestion(text) {
    const input = document.getElementById('chatInput');
    input.value = text;
    sendMessage();
}

function clearChat() {
    if (confirm('Apakah Anda yakin ingin menghapus semua chat?')) {
        const chatMessages = document.getElementById('chatMessages');
        chatHistory = [];
        
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-content">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-bubble">
                        <p>👋 Chat telah dibersihkan. Ada yang bisa saya bantu hari ini?</p>
                    </div>
                </div>
                <div class="message-time">
                    <span>Baru saja</span>
                </div>
            </div>
        `;
        
        // Clear saved history
        localStorage.removeItem('dmaz-chat-history');
        
        // Show suggestions again
        showSuggestions();
    }
}

function exportChat() {
    if (chatHistory.length === 0) {
        alert('Tidak ada chat untuk diekspor');
        return;
    }
    
    let exportText = 'DMAZ TOOLS - Chat Export\n';
    exportText += '========================\n\n';
    
    chatHistory.forEach((msg, index) => {
        const time = new Date(msg.timestamp).toLocaleString('id-ID');
        const role = msg.role === 'user' ? 'User' : 'AI Assistant';
        exportText += `[${time}] ${role}:\n${msg.content}\n\n`;
    });
    
    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dmaz-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showSuggestions() {
    const suggestions = document.querySelector('.input-suggestions');
    if (suggestions && chatHistory.length === 0) {
        suggestions.style.display = 'flex';
    }
}

function hideSuggestions() {
    const suggestions = document.querySelector('.input-suggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
}

function saveChatHistory() {
    localStorage.setItem('dmaz-chat-history', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('dmaz-chat-history');
    if (saved) {
        chatHistory = JSON.parse(saved);
    }
}

function displayChatHistory() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // Clear existing messages
    
    if (chatHistory.length === 0) {
        // Show welcome message
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-content">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-bubble">
                        <p>👋 Halo! Saya DMAZ AI Assistant. Saya siap membantu Anda dengan berbagai pertanyaan. Ada yang bisa saya bantu hari ini?</p>
                    </div>
                </div>
                <div class="message-time">
                    <span>Baru saja</span>
                </div>
            </div>
        `;
        showSuggestions();
    } else {
        chatHistory.forEach(msg => {
            addMessageToChat(msg.content, msg.role);
        });
        hideSuggestions();
    }
}

function toggleEmojiPicker() {
    // Simple emoji insertion - you can expand this with a proper emoji picker
    const emojis = ['😀', '😊', '😂', '🤔', '👍', '❤️', '🔥', '✨', '💯', '🚀'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const input = document.getElementById('chatInput');
    input.value += randomEmoji;
    input.focus();
    updateCharCount();
}

// TikTok Downloader functionality
async function downloadTikTok() {
    const urlInput = document.getElementById('tiktokUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
        showNotification('Silakan masukkan link TikTok terlebih dahulu', 'warning');
        return;
    }
    
    if (!isValidTikTokUrl(url)) {
        showNotification('Link TikTok tidak valid. Pastikan format URL benar.', 'error');
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
        // Use multiple backup APIs for better reliability
        const apis = [
            `https://api.ferdev.my.id/downloader/tiktok?link=${encodeURIComponent(url)}&apikey=${TIKTOK_API_KEY}`,
            `https://tikwm.com/api/?url=${encodeURIComponent(url)}`,
            `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
        ];
        
        let response;
        let data;
        
        for (let apiUrl of apis) {
            try {
                response = await fetch(apiUrl);
                if (response.ok) {
                    data = await response.json();
                    if (data && (data.success || data.code === 0)) {
                        break;
                    }
                }
            } catch (error) {
                console.log(`API ${apiUrl} failed:`, error);
                continue;
            }
        }
        
        if (!data || (!data.success && data.code !== 0)) {
            throw new Error('Failed to process video from all APIs');
        }
        
        displayDownloadResult(data.data || data);
        showNotification('Video berhasil diproses!', 'success');
        
    } catch (error) {
        console.error('Error downloading TikTok video:', error);
        showNotification('Gagal mendownload video. Silakan coba lagi atau periksa link.', 'error');
    }
    
    // Hide loading
    loadingSpinner.style.display = 'none';
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
}

function isValidTikTokUrl(url) {
    const tiktokRegex = /^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)/;
    return tiktokRegex.test(url);
}

function displayDownloadResult(data) {
    const downloadResult = document.getElementById('downloadResult');
    
    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };
    
    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };
    
    // Handle different API response formats
    const videoData = {
        title: data.title || data.description || 'TikTok Video',
        cover: data.cover || data.thumbnail || data.origin_cover,
        play: data.play || data.hdplay || data.wmplay || data.video,
        music: data.music || data.audio,
        play_count: data.play_count || data.play || 0,
        share_count: data.share_count || data.share || 0,
        size: data.size || 0,
        author: data.author || { unique_id: 'unknown' }
    };
    
    downloadResult.innerHTML = `
        <div class="video-info">
            <img src="${videoData.cover}" alt="Video thumbnail" class="video-thumbnail" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA0NVY3NUwyNyA2MEw2MCA0NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'">
            <div class="video-details">
                <h4>${videoData.title}</h4>
                <div class="video-stats">
                    <span class="stat">
                        <i class="fas fa-play"></i> 
                        ${formatNumber(videoData.play_count)} views
                    </span>
                    <span class="stat">
                        <i class="fas fa-share"></i> 
                        ${formatNumber(videoData.share_count)} shares
                    </span>
                    <span class="stat">
                        <i class="fas fa-file"></i> 
                        ${formatFileSize(videoData.size)}
                    </span>
                </div>
                <div class="author-info">
                    <strong>@${videoData.author.unique_id}</strong>
                </div>
            </div>
        </div>
        <div class="download-buttons">
            <a href="${videoData.play}" class="download-btn" download target="_blank">
                <i class="fas fa-video"></i> Download Video
            </a>
            ${videoData.music ? `
                <a href="${videoData.music}" class="download-btn" download target="_blank">
                    <i class="fas fa-music"></i> Download Audio
                </a>
            ` : ''}
            <button class="download-btn" onclick="shareVideo('${videoData.play}', '${videoData.title}')">
                <i class="fas fa-share-alt"></i> Share
            </button>
        </div>
    `;
    
    downloadResult.style.display = 'block';
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        const input = document.getElementById('tiktokUrl');
        input.value = text;
        input.focus();
        
        // Auto-validate if it's a TikTok URL
        if (isValidTikTokUrl(text)) {
            showNotification('Link berhasil dipaste dan valid!', 'success');
        } else {
            showNotification('Link dipaste, tapi bukan link TikTok yang valid', 'warning');
        }
    } catch (error) {
        showNotification('Gagal mengakses clipboard. Paste manual ya!', 'warning');
    }
}

function shareVideo(videoUrl, title) {
    if (navigator.share) {
        navigator.share({
            title: `DMAZ TOOLS - ${title}`,
            text: 'Video downloaded using DMAZ TOOLS',
            url: videoUrl
        }).catch(console.error);
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(videoUrl).then(() => {
            showNotification('Link video berhasil disalin!', 'success');
        }).catch(() => {
            showNotification('Gagal menyalin link', 'error');
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 1000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid #6366f1;
            }
            .notification-success { border-left-color: #10b981; }
            .notification-error { border-left-color: #ef4444; }
            .notification-warning { border-left-color: #f59e0b; }
            .notification-info { border-left-color: #3b82f6; }
            .notification i:first-child {
                font-size: 1.2rem;
                color: #6366f1;
            }
            .notification-success i:first-child { color: #10b981; }
            .notification-error i:first-child { color: #ef4444; }
            .notification-warning i:first-child { color: #f59e0b; }
            .notification-info i:first-child { color: #3b82f6; }
            .notification span {
                flex: 1;
                color: #374151;
                font-weight: 500;
            }
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .notification-close:hover {
                background: #f3f4f6;
                color: #6b7280;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @media (max-width: 480px) {
                .notification {
                    left: 10px;
                    right: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Utility functions
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Performance monitoring
function trackFeatureUsage(feature) {
    const usage = JSON.parse(localStorage.getItem('dmaz-usage') || '{}');
    usage[feature] = (usage[feature] || 0) + 1;
    localStorage.setItem('dmaz-usage', JSON.stringify(usage));
}

// Service worker registration for PWA
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

// Initialize performance tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track page load
    trackFeatureUsage('page_load');
    
    // Track feature switches
    document.querySelectorAll('.feature-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            trackFeatureUsage(this.dataset.feature);
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus chat input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (currentFeature === 'chat-ai') {
            document.getElementById('chatInput').focus();
        }
    }
    
    // Ctrl/Cmd + L to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        if (currentFeature === 'chat-ai') {
            clearChat();
        }
    }
    
    // Alt + 1/2 to switch features
    if (e.altKey && e.key === '1') {
        e.preventDefault();
        switchFeature('chat-ai');
    }
    if (e.altKey && e.key === '2') {
        e.preventDefault();
        switchFeature('tiktok-downloader');
    }
});

// Initialize tooltips for keyboard shortcuts
function initializeTooltips() {
    const shortcuts = [
        { element: '#chatInput', text: 'Ctrl+K untuk fokus' },
        { element: '.clear-chat-btn', text: 'Ctrl+L untuk clear' },
        { element: '[data-feature="chat-ai"]', text: 'Alt+1' },
        { element: '[data-feature="tiktok-downloader"]', text: 'Alt+2' }
    ];
    
    shortcuts.forEach(shortcut => {
        const element = document.querySelector(shortcut.element);
        if (element) {
            element.title = shortcut.text;
        }
    });
}

// Error boundary for graceful error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('Terjadi kesalahan tak terduga. Silakan refresh halaman.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('Terjadi kesalahan jaringan. Periksa koneksi internet Anda.', 'error');
});

// Initialize tooltips when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTooltips);

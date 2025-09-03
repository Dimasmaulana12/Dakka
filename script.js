// Global Variables
const modal = document.getElementById('toolModal');
const modalTitle = document.getElementById('modalTitle');
const toolContent = document.getElementById('toolContent');
const resultContainer = document.getElementById('result');
const loadingOverlay = document.getElementById('loadingOverlay');
const closeBtn = document.querySelector('.close');

// Navigation Mobile Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth Scrolling for navigation links
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

// Modal Functions
function openModal(toolType, toolName) {
    try {
        if (!modal) {
            console.error('Modal element not found');
            return;
        }
        
        console.log(`Opening modal for: ${toolType}`);
        modal.style.display = 'block';
        modalTitle.textContent = toolName;
        resultContainer.style.display = 'none';
        loadToolContent(toolType);
    } catch (error) {
        console.error('Error opening modal:', error);
        showError('Terjadi kesalahan saat membuka tool.');
    }
}

function closeModal() {
    try {
        if (!modal) {
            console.error('Modal element not found');
            return;
        }
        
        modal.style.display = 'none';
        toolContent.innerHTML = '';
        resultContainer.style.display = 'none';
        console.log('Modal closed');
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Close modal events
closeBtn?.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Tool Card Click Events
document.addEventListener('DOMContentLoaded', () => {
    try {
        const toolCards = document.querySelectorAll('.tool-card');
        console.log(`Found ${toolCards.length} tool cards`);
        
        toolCards.forEach((card, index) => {
            const toolBtn = card.querySelector('.tool-btn');
            const toolType = card.getAttribute('data-tool');
            const toolName = card.querySelector('h3')?.textContent || 'Unknown Tool';
            
            if (!toolBtn) {
                console.warn(`Tool button not found for card ${index}`);
                return;
            }
            
            if (!toolType) {
                console.warn(`Tool type not found for card ${index} (${toolName})`);
                return;
            }
            
            toolBtn.addEventListener('click', (e) => {
                try {
                    e.preventDefault();
                    console.log(`Opening modal for tool: ${toolType} (${toolName})`);
                    openModal(toolType, toolName);
                } catch (error) {
                    console.error(`Error opening modal for ${toolType}:`, error);
                    showError('Terjadi kesalahan saat membuka tool. Silakan coba lagi.');
                }
            });
        });
    } catch (error) {
        console.error('Error setting up tool card events:', error);
    }
});

// Load Tool Content
function loadToolContent(toolType) {
    let content = '';
    
    switch(toolType) {
        case 'igstalk':
            content = `
                <form id="igstalkForm">
                    <div class="form-group">
                        <label for="username">Username Instagram (tanpa @):</label>
                        <input type="text" id="username" name="username" placeholder="Contoh: cristiano" required>
                    </div>
                    <button type="submit" class="submit-btn">Cari Profil</button>
                </form>
            `;
            break;
            
        case 'gempa':
            content = `
                <div class="info-box">
                    <p>Klik tombol di bawah untuk mendapatkan informasi gempa terkini dari BMKG Indonesia.</p>
                    <button id="getGempaBtn" class="submit-btn">Dapatkan Info Gempa</button>
                </div>
            `;
            break;
            
        case 'cuaca':
            content = `
                <form id="cuacaForm">
                    <div class="form-group">
                        <label for="location">Nama Lokasi:</label>
                        <input type="text" id="location" name="location" placeholder="Contoh: Jakarta Pusat" required>
                    </div>
                    <button type="submit" class="submit-btn">Cek Cuaca</button>
                </form>
            `;
            break;
            
        case 'tiktok':
            content = `
                <form id="tiktokForm">
                    <div class="form-group">
                        <label for="tiktokUrl">URL Video TikTok:</label>
                        <input type="url" id="tiktokUrl" name="tiktokUrl" placeholder="https://vt.tiktok.com/..." required>
                    </div>
                    <button type="submit" class="submit-btn">Download Video</button>
                </form>
            `;
            break;
            
        case 'igdl':
            content = `
                <form id="igdlForm">
                    <div class="form-group">
                        <label for="igUrl">URL Post Instagram:</label>
                        <input type="url" id="igUrl" name="igUrl" placeholder="https://www.instagram.com/p/..." required>
                    </div>
                    <button type="submit" class="submit-btn">Download Media</button>
                </form>
            `;
            break;
            
        case 'facebook':
            content = `
                <form id="facebookForm">
                    <div class="form-group">
                        <label for="fbUrl">URL Video Facebook:</label>
                        <input type="url" id="fbUrl" name="fbUrl" placeholder="https://www.facebook.com/..." required>
                    </div>
                    <button type="submit" class="submit-btn">Download Video</button>
                </form>
            `;
            break;
            
        case 'pinterest':
            content = `
                <form id="pinterestForm">
                    <div class="form-group">
                        <label for="pinUrl">URL Pinterest:</label>
                        <input type="url" id="pinUrl" name="pinUrl" placeholder="https://pin.it/..." required>
                    </div>
                    <button type="submit" class="submit-btn">Download Media</button>
                </form>
            `;
            break;
            
        case 'gdrive':
            content = `
                <form id="gdriveForm">
                    <div class="form-group">
                        <label for="gdriveUrl">URL Google Drive:</label>
                        <input type="url" id="gdriveUrl" name="gdriveUrl" placeholder="https://drive.google.com/file/d/..." required>
                    </div>
                    <button type="submit" class="submit-btn">Download File</button>
                </form>
            `;
            break;
            
        case 'capcut':
            content = `
                <form id="capcutForm">
                    <div class="form-group">
                        <label for="capcutUrl">URL CapCut:</label>
                        <input type="url" id="capcutUrl" name="capcutUrl" placeholder="https://www.capcut.com/..." required>
                    </div>
                    <button type="submit" class="submit-btn">Download Video</button>
                </form>
            `;
            break;
            
        case 'terabox':
            content = `
                <form id="teraboxForm">
                    <div class="form-group">
                        <label for="teraboxUrl">URL Terabox:</label>
                        <input type="url" id="teraboxUrl" name="teraboxUrl" placeholder="https://terabox.com/s/..." required>
                    </div>
                    <button type="submit" class="submit-btn">Download File</button>
                </form>
            `;
            break;
            
        case 'ai':
            content = `
                <form id="aiForm">
                    <div class="form-group">
                        <label for="aiQuery">Pertanyaan untuk AI:</label>
                        <textarea id="aiQuery" name="aiQuery" rows="4" placeholder="Tanyakan apa saja..." required></textarea>
                    </div>
                    <button type="submit" class="submit-btn">Tanya AI</button>
                </form>
            `;
            break;
            
        case 'susunkata':
            content = `
                <div class="info-box">
                    <p>Klik tombol di bawah untuk memulai permainan susun kata.</p>
                    <button id="startGameBtn" class="submit-btn">Mulai Game</button>
                </div>
            `;
            break;
            
        case 'sticker':
            content = `
                <form id="stickerForm">
                    <div class="form-group">
                        <label for="stickerQuery">Kata Kunci Sticker:</label>
                        <input type="text" id="stickerQuery" name="stickerQuery" placeholder="Contoh: kucing lucu" required>
                    </div>
                    <button type="submit" class="submit-btn">Cari Sticker</button>
                </form>
            `;
            break;
            
        case 'scribd':
            content = `
                <form id="scribdForm">
                    <div class="form-group">
                        <label for="scribdUrl">URL Dokumen Scribd:</label>
                        <input type="url" id="scribdUrl" name="scribdUrl" placeholder="https://www.scribd.com/document/..." required>
                    </div>
                    <button type="submit" class="submit-btn">Download Dokumen</button>
                </form>
            `;
            break;
            
        case 'emojimix':
            content = `
                <form id="emojimixForm">
                    <div class="form-group">
                        <label for="emoji1">Emoji Pertama:</label>
                        <input type="text" id="emoji1" name="emoji1" placeholder="😂" maxlength="2" required>
                    </div>
                    <div class="form-group">
                        <label for="emoji2">Emoji Kedua:</label>
                        <input type="text" id="emoji2" name="emoji2" placeholder="😭" maxlength="2" required>
                    </div>
                    <button type="submit" class="submit-btn">Mix Emoji</button>
                </form>
            `;
            break;
            
        default:
            content = '<p>Tool ini sedang dalam pengembangan.</p>';
    }
    
    try {
        if (!toolContent) {
            console.error('Tool content container not found');
            return;
        }
        
        toolContent.innerHTML = content;
        console.log(`Loaded content for tool: ${toolType}`);
        attachFormEvents(toolType);
    } catch (error) {
        console.error(`Error loading tool content for ${toolType}:`, error);
        toolContent.innerHTML = '<p>Terjadi kesalahan saat memuat tool. Silakan coba lagi.</p>';
    }
}

// Attach Form Events
function attachFormEvents(toolType) {
    try {
        console.log(`Attaching form events for: ${toolType}`);
        
        switch(toolType) {
            case 'igstalk':
                document.getElementById('igstalkForm')?.addEventListener('submit', handleIgStalk);
                break;
            case 'gempa':
                document.getElementById('getGempaBtn')?.addEventListener('click', handleGempa);
                break;
            case 'cuaca':
                document.getElementById('cuacaForm')?.addEventListener('submit', handleCuaca);
                break;
            case 'tiktok':
                document.getElementById('tiktokForm')?.addEventListener('submit', handleTikTok);
                break;
            case 'igdl':
                document.getElementById('igdlForm')?.addEventListener('submit', handleIgDownload);
                break;
            case 'facebook':
                document.getElementById('facebookForm')?.addEventListener('submit', handleFacebook);
                break;
            case 'pinterest':
                document.getElementById('pinterestForm')?.addEventListener('submit', handlePinterest);
                break;
            case 'gdrive':
                document.getElementById('gdriveForm')?.addEventListener('submit', handleGoogleDrive);
                break;
            case 'capcut':
                document.getElementById('capcutForm')?.addEventListener('submit', handleCapCut);
                break;
            case 'terabox':
                document.getElementById('teraboxForm')?.addEventListener('submit', handleTerabox);
                break;
            case 'ai':
                document.getElementById('aiForm')?.addEventListener('submit', handleAI);
                break;
            case 'susunkata':
                document.getElementById('startGameBtn')?.addEventListener('click', handleSusunKata);
                break;
            case 'sticker':
                document.getElementById('stickerForm')?.addEventListener('submit', handleSticker);
                break;
            case 'scribd':
                document.getElementById('scribdForm')?.addEventListener('submit', handleScribd);
                break;
            case 'emojimix':
                document.getElementById('emojimixForm')?.addEventListener('submit', handleEmojiMix);
                break;
            default:
                console.warn(`No form events defined for tool type: ${toolType}`);
        }
        
        console.log(`Form events attached successfully for: ${toolType}`);
    } catch (error) {
        console.error(`Error attaching form events for ${toolType}:`, error);
    }
}

// Handler Functions
async function handleIgStalk(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/stalk/instagram?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        if (data.status && data.data) {
            displayIgStalkResult(data.data);
        } else {
            showError('Username tidak ditemukan atau terjadi kesalahan.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengambil data.');
    } finally {
        hideLoading();
    }
}

async function handleGempa(e) {
    e.preventDefault();
    
    showLoading();
    try {
        const response = await fetch('https://api.siputzx.my.id/api/info/bmkg');
        const data = await response.json();
        
        if (data.status && data.data && data.data.auto) {
            displayGempaResult(data.data.auto.Infogempa.gempa);
        } else {
            showError('Gagal mengambil data gempa.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengambil data gempa.');
    } finally {
        hideLoading();
    }
}

async function handleCuaca(e) {
    e.preventDefault();
    const location = document.getElementById('location').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/info/cuaca?q=${encodeURIComponent(location)}`);
        const data = await response.json();
        
        if (data.status && data.data.weather && data.data.weather.length > 0) {
            displayCuacaResult(data.data.weather[0]);
        } else {
            showError('Lokasi tidak ditemukan.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengambil data cuaca.');
    } finally {
        hideLoading();
    }
}

async function handleTikTok(e) {
    e.preventDefault();
    const url = document.getElementById('tiktokUrl').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.status && data.data.urls && data.data.urls.length > 0) {
            displayVideoResult(data.data.urls[0], data.data.metadata);
        } else {
            showError('Gagal mengunduh video TikTok.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengunduh video.');
    } finally {
        hideLoading();
    }
}

async function handleIgDownload(e) {
    e.preventDefault();
    const url = document.getElementById('igUrl').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.status && data.data && data.data.length > 0) {
            displayMediaResult(data.data[0].url);
        } else {
            showError('Gagal mengunduh media Instagram.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengunduh media.');
    } finally {
        hideLoading();
    }
}

async function handleFacebook(e) {
    e.preventDefault();
    const url = document.getElementById('fbUrl').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.status && data.data && data.data.data && data.data.data.length > 0) {
            const videoData = data.data.data.find(item => item.format === 'mp4') || data.data.data[0];
            displayVideoResult(videoData.url, { title: data.data.title });
        } else {
            showError('Gagal mengunduh video Facebook.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengunduh video.');
    } finally {
        hideLoading();
    }
}

async function handlePinterest(e) {
    e.preventDefault();
    const url = document.getElementById('pinUrl').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.status && data.data && data.data.media_urls && data.data.media_urls.length > 0) {
            const media = data.data.media_urls.find(m => m.quality === 'original') || data.data.media_urls[0];
            displayMediaResult(media.url);
        } else {
            showError('Gagal mengunduh media Pinterest.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengunduh media.');
    } finally {
        hideLoading();
    }
}

async function handleGoogleDrive(e) {
    e.preventDefault();
    const url = document.getElementById('gdriveUrl').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.status && data.data) {
            displayFileResult(data.data.download, data.data.name);
        } else {
            showError('Gagal mengunduh file Google Drive.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengunduh file.');
    } finally {
        hideLoading();
    }
}

async function handleCapCut(e) {
    e.preventDefault();
    const url = document.getElementById('capcutUrl').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/capcut?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.status && data.data) {
            displayVideoResult(data.data.video_url, { title: data.data.title, author: data.data.author });
        } else {
            showError('Gagal mengunduh video CapCut.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengunduh video.');
    } finally {
        hideLoading();
    }
}

async function handleTerabox(e) {
    e.preventDefault();
    const url = document.getElementById('teraboxUrl').value;
    
    showLoading();
    try {
        const apikey = 'key-dmaz';
        const response = await fetch(`https://api.ferdev.my.id/downloader/terabox?link=${encodeURIComponent(url)}&apikey=${apikey}`);
        const data = await response.json();
        
        if (data.success && data.result) {
            displayFileResult(data.result.direct_link, data.result.file_name);
        } else {
            showError('Gagal mengunduh file Terabox.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengunduh file.');
    } finally {
        hideLoading();
    }
}

async function handleAI(e) {
    e.preventDefault();
    const query = document.getElementById('aiQuery').value;
    
    showLoading();
    try {
        const systemPrompt = "You are a helpful assistant.";
        const response = await fetch(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(systemPrompt)}&content=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.status && data.data) {
            displayAIResult(data.data);
        } else {
            showError('Gagal mendapatkan respons dari AI.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat menghubungi AI.');
    } finally {
        hideLoading();
    }
}

async function handleSusunKata(e) {
    e.preventDefault();
    
    showLoading();
    try {
        const response = await fetch('https://api.siputzx.my.id/api/games/susunkata');
        const data = await response.json();
        
        if (data.status && data.data) {
            displaySusunKataResult(data.data);
        } else {
            showError('Gagal mendapatkan soal susun kata.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengambil soal.');
    } finally {
        hideLoading();
    }
}

async function handleSticker(e) {
    e.preventDefault();
    const query = document.getElementById('stickerQuery').value;
    
    showLoading();
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/sticker/stickerly-search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.status && data.data && data.data.length > 0) {
            displayStickerResult(data.data);
        } else {
            showError('Sticker tidak ditemukan.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mencari sticker.');
    } finally {
        hideLoading();
    }
}

async function handleScribd(e) {
    e.preventDefault();
    const url = document.getElementById('scribdUrl').value;
    
    showLoading();
    try {
        const apikey = 'key-dmaz';
        const response = await fetch(`https://api.ferdev.my.id/downloader/scribd?link=${encodeURIComponent(url)}&apikey=${apikey}`);
        const data = await response.json();
        
        if (data.success && data.result) {
            displayFileResult(data.result, 'document.pdf');
        } else {
            showError('Gagal mengunduh dokumen Scribd.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat mengunduh dokumen.');
    } finally {
        hideLoading();
    }
}

async function handleEmojiMix(e) {
    e.preventDefault();
    const emoji1 = document.getElementById('emoji1').value;
    const emoji2 = document.getElementById('emoji2').value;
    
    showLoading();
    try {
        const apikey = 'key-dmaz';
        const response = await fetch(`https://api.ferdev.my.id/maker/emojimix?e1=${encodeURIComponent(emoji1)}&e2=${encodeURIComponent(emoji2)}&apikey=${apikey}`, {
            method: 'GET'
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            displayImageResult(imageUrl, `Mix dari ${emoji1} + ${emoji2}`);
        } else {
            showError('Gagal menggabungkan emoji.');
        }
    } catch (error) {
        showError('Terjadi kesalahan saat menggabungkan emoji.');
    } finally {
        hideLoading();
    }
}

// Display Result Functions
function displayIgStalkResult(data) {
    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    resultContainer.innerHTML = `
        <h4>Profil Instagram</h4>
        <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
            <img src="${data.profile_pic_url}" alt="Profile Picture" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
            <div>
                <h3>${data.full_name || 'Tidak ada'}</h3>
                <p><strong>@${data.username}</strong></p>
                <p>${data.is_verified ? '✅ Verified' : ''} ${data.is_private ? '🔒 Private' : '🌐 Public'}</p>
            </div>
        </div>
        <p><strong>Bio:</strong> ${data.biography || 'Tidak ada bio'}</p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px;">
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <h4>${formatNumber(data.posts_count)}</h4>
                <p>Posts</p>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <h4>${formatNumber(data.followers_count)}</h4>
                <p>Followers</p>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <h4>${formatNumber(data.following_count)}</h4>
                <p>Following</p>
            </div>
        </div>
    `;
    resultContainer.style.display = 'block';
}

function displayGempaResult(data) {
    resultContainer.innerHTML = `
        <h4>Info Gempa Terkini</h4>
        <img src="${data.downloadShakemap}" alt="Shakemap" style="width: 100%; margin-bottom: 15px; border-radius: 10px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div><strong>Tanggal:</strong> ${data.Tanggal}</div>
            <div><strong>Jam:</strong> ${data.Jam}</div>
            <div><strong>Magnitude:</strong> ${data.Magnitude}</div>
            <div><strong>Kedalaman:</strong> ${data.Kedalaman}</div>
        </div>
        <div style="margin-top: 15px;">
            <div><strong>Wilayah:</strong> ${data.Wilayah}</div>
            <div><strong>Potensi:</strong> ${data.Potensi}</div>
        </div>
    `;
    resultContainer.style.display = 'block';
}

function displayCuacaResult(data) {
    const locationInfo = data.lokasi;
    const forecastArrays = data.cuaca;
    const fullLocationName = `${locationInfo.desa}, ${locationInfo.kecamatan}, ${locationInfo.kotkab}`;
    
    let forecastHtml = '';
    let count = 0;
    
    for (const dayArray of forecastArrays) {
        for (const forecast of dayArray) {
            if (count >= 4) break;
            
            const date = new Date(forecast.local_datetime);
            const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
            
            forecastHtml += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">🕒 ${time} WIB</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <div>Cuaca: ${forecast.weather_desc}</div>
                        <div>Suhu: ${forecast.t}°C</div>
                        <div>Kelembapan: ${forecast.hu}%</div>
                        <div>Angin: ${forecast.ws} km/h ${forecast.wd}</div>
                    </div>
                </div>
            `;
            count++;
        }
        if (count >= 4) break;
    }
    
    resultContainer.innerHTML = `
        <h4>Prakiraan Cuaca</h4>
        <div style="margin-bottom: 20px;">
            <strong>📍 Lokasi:</strong> ${fullLocationName}
        </div>
        ${forecastHtml}
    `;
    resultContainer.style.display = 'block';
}

function displayVideoResult(videoUrl, metadata = {}) {
    resultContainer.innerHTML = `
        <h4>Video berhasil diunduh!</h4>
        ${metadata.title ? `<p><strong>Judul:</strong> ${metadata.title}</p>` : ''}
        ${metadata.creator ? `<p><strong>Kreator:</strong> ${metadata.creator}</p>` : ''}
        ${metadata.author ? `<p><strong>Author:</strong> ${metadata.author}</p>` : ''}
        <video controls style="width: 100%; margin: 15px 0; border-radius: 10px;">
            <source src="${videoUrl}" type="video/mp4">
            Browser Anda tidak mendukung tag video.
        </video>
        <a href="${videoUrl}" download class="download-link">Download Video</a>
    `;
    resultContainer.style.display = 'block';
}

function displayMediaResult(mediaUrl) {
    const isVideo = mediaUrl.includes('.mp4') || mediaUrl.includes('video');
    
    if (isVideo) {
        resultContainer.innerHTML = `
            <h4>Media berhasil diunduh!</h4>
            <video controls style="width: 100%; margin: 15px 0; border-radius: 10px;">
                <source src="${mediaUrl}" type="video/mp4">
                Browser Anda tidak mendukung tag video.
            </video>
            <a href="${mediaUrl}" download class="download-link">Download Video</a>
        `;
    } else {
        resultContainer.innerHTML = `
            <h4>Media berhasil diunduh!</h4>
            <img src="${mediaUrl}" alt="Downloaded Image" style="width: 100%; margin: 15px 0; border-radius: 10px;">
            <a href="${mediaUrl}" download class="download-link">Download Gambar</a>
        `;
    }
    resultContainer.style.display = 'block';
}

function displayFileResult(fileUrl, fileName) {
    resultContainer.innerHTML = `
        <h4>File berhasil diunduh!</h4>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; margin: 15px 0;">
            <div style="font-size: 3rem; margin-bottom: 10px;">📁</div>
            <p><strong>Nama File:</strong> ${fileName}</p>
            <a href="${fileUrl}" download="${fileName}" class="download-link">Download File</a>
        </div>
    `;
    resultContainer.style.display = 'block';
}

function displayImageResult(imageUrl, caption) {
    resultContainer.innerHTML = `
        <h4>Gambar berhasil dibuat!</h4>
        <img src="${imageUrl}" alt="${caption}" style="width: 100%; margin: 15px 0; border-radius: 10px;">
        <p>${caption}</p>
        <a href="${imageUrl}" download class="download-link">Download Gambar</a>
    `;
    resultContainer.style.display = 'block';
}

function displayAIResult(response) {
    resultContainer.innerHTML = `
        <h4>Jawaban AI</h4>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0; line-height: 1.6;">
            ${response.replace(/\n/g, '<br>')}
        </div>
    `;
    resultContainer.style.display = 'block';
}

function displaySusunKataResult(data) {
    resultContainer.innerHTML = `
        <h4>Game Susun Kata</h4>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
            <p><strong>🔤 Soal:</strong> ${data.soal}</p>
            <p><strong>💡 Tipe:</strong> ${data.tipe}</p>
            <p><strong>✅ Jawaban:</strong> ${data.jawaban}</p>
        </div>
    `;
    resultContainer.style.display = 'block';
}

function displayStickerResult(data) {
    const topResults = data.slice(0, 5);
    let html = '<h4>Hasil Pencarian Sticker</h4>';
    
    topResults.forEach((pack, index) => {
        html += `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 10px 0;">
                <div style="display: flex; gap: 15px; align-items: center;">
                    <img src="${pack.thumbnailUrl}" alt="Sticker Pack" style="width: 60px; height: 60px; border-radius: 10px;">
                    <div style="flex: 1;">
                        <h5>${pack.name}</h5>
                        <p><strong>Author:</strong> ${pack.author}</p>
                        <p><strong>Jumlah:</strong> ${pack.stickerCount} stiker</p>
                        <a href="${pack.url}" target="_blank" class="download-link" style="display: inline-block; margin-top: 10px;">Lihat Sticker Pack</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    resultContainer.innerHTML = html;
    resultContainer.style.display = 'block';
}

function showError(message) {
    resultContainer.innerHTML = `
        <div style="background: #ff6b6b; color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h4>❌ Error</h4>
            <p>${message}</p>
        </div>
    `;
    resultContainer.style.display = 'block';
}

// Functions from your original script.js (keep these)
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

// Keep all your existing scroll animations and other features
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
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
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

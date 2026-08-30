class UI {
    static showLoading(text) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML = `<div class="loading" style="padding: 40px 20px; text-align: center; color: #4F46E5; font-weight: 600; font-size: 1.1rem; background: var(--surface-glass); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border); margin-top: 20px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-bottom: 10px; display: block; margin: 0 auto;">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                ${text}
            </div>`;
        }
    }
    static showSuccess(text) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML += `<div class="success" style="color: #059669; background: #D1FAE5; padding: 12px; border-radius: 8px; font-weight: 600; margin-top: 15px; text-align: center; border: 1px solid #10B981;">${text}</div>`;
        }
    }
    static showError(message) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML = `<div class="error" style="color: #DC2626; background: #FEE2E2; padding: 15px; border-radius: 8px; border: 1px solid #EF4444; margin-top: 20px; font-weight: 500;">
                <strong>Error:</strong> ${message}
            </div>`;
        }
    }
    static renderMetadata(data) {
        window.currentMediaUrl = document.getElementById("url-input").value;
        const resultContainer = document.getElementById('result-container');
        
        let videoOptions = data.formats.video.length > 0 
            ? data.formats.video.map(f => `<option value="${f.format_id}">${f.resolution} (${f.ext})</option>`).join('')
            : `<option value="">No Video Available</option>`;
            
        let audioOptions = data.formats.audio.length > 0
            ? data.formats.audio.map(f => `<option value="${f.format_id}">${f.abr}kbps (${f.ext})</option>`).join('')
            : `<option value="">No Audio Available</option>`;
            
        const isPhotoPost = data.formats.video.length === 0 && data.formats.audio.length === 0;
        
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="card result-card" style="margin-top: 24px; padding: 0; overflow: hidden;">
                    <div style="display: flex; flex-direction: column; md:flex-direction: row; gap: 20px; padding: 24px;">
                        
                        <!-- Thumbnail Section -->
                        <div style="flex: 0 0 auto; width: 100%; max-width: 300px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px;">
                            <img src="${data.thumbnail}" alt="Thumbnail" class="result-thumbnail" style="width: 100%; height: auto; max-height: 400px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <button id="download-thumb-btn" style="width: 100%; padding: 10px; border-radius: 8px; background: #E2E8F0; color: #334155; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.9rem;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Download Image / Thumbnail
                            </button>
                        </div>
                        
                        <!-- Details Section -->
                        <div style="flex: 1; min-width: 0; ${isPhotoPost ? 'display: none;' : ''}">
                            <h3 style="margin: 0 0 12px 0; font-size: 1.25rem; font-weight: 700; color: #1E293B; line-height: 1.4;">${data.title}</h3>
                            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                                <span class="badge" style="background: #E2E8F0; color: #475569; padding: 4px 10px; border-radius: 20px; font-size: 0.875rem; font-weight: 600;">Platform: ${data.platform}</span>
                                <span class="badge" style="background: #E0E7FF; color: #4F46E5; padding: 4px 10px; border-radius: 20px; font-size: 0.875rem; font-weight: 600;">Duration: ${data.duration}s</span>
                            </div>
                            
                            <!-- Download Controls -->
                            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
                                <div style="display: flex; flex-direction: column; gap: 15px;">
                                    
                                    <div>
                                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155; font-size: 0.9rem;">Select Video Quality:</label>
                                        <select id="video-format" style="width: 100%; padding: 10px 12px; border: 1px solid #CBD5E1; border-radius: 8px; background: white; font-size: 0.95rem; outline: none;">
                                            ${videoOptions}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155; font-size: 0.9rem;">Select Audio Quality:</label>
                                        <select id="audio-format" style="width: 100%; padding: 10px 12px; border: 1px solid #CBD5E1; border-radius: 8px; background: white; font-size: 0.95rem; outline: none;">
                                            ${audioOptions}
                                        </select>
                                    </div>
                                    
                                    <div class="trim-section" style="background: white; padding: 16px; border-radius: 8px; border: 1px dashed #CBD5E1; margin-top: 5px;">
                                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none;">
                                            <input type="checkbox" id="trim-toggle" style="width: 18px; height: 18px; accent-color: #4F46E5;"> 
                                            <strong style="color: #1E293B;">Trim before download</strong>
                                        </label>
                                        <div id="trim-ui" style="display: none; margin-top: 15px;">
                                            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                                                <div style="flex: 1; min-width: 120px;">
                                                    <label style="display: block; font-size: 0.85rem; color: #64748B; margin-bottom: 4px;">Start (seconds):</label>
                                                    <input type="number" id="trim-start" value="0" min="0" max="${data.duration}" style="width: 100%; padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                                </div>
                                                <div style="flex: 1; min-width: 120px;">
                                                    <label style="display: block; font-size: 0.85rem; color: #64748B; margin-bottom: 4px;">End (seconds):</label>
                                                    <input type="number" id="trim-end" value="${data.duration}" min="0" max="${data.duration}" style="width: 100%; padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <div style="display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
                                    <button id="download-video-btn" class="btn btn-primary" style="flex: 1; min-width: 150px; padding: 12px; border-radius: 8px; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                        Download Video
                                    </button>
                                    <button id="download-audio-btn" style="flex: 1; min-width: 150px; padding: 12px; border-radius: 8px; background: #10B981; color: white; border: none; font-weight: 600; font-size: 1rem; cursor: pointer; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                        Audio Only
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Initialize Trimming
            if (!isPhotoPost) Trimming.init(data.duration);
            
            // Bind buttons
            const dlVideoBtn = document.getElementById('download-video-btn');
            if (dlVideoBtn) {
                dlVideoBtn.addEventListener('click', () => {
                    const formatId = document.getElementById('video-format').value;
                    if (!formatId) { UI.showError("No video format selected."); return; }
                    const trimData = Trimming.getValues();
                    Downloader.downloadMedia('video', window.currentMediaUrl, formatId, trimData.trim, trimData.start_time, trimData.end_time);
                });
            }
            
            const dlAudioBtn = document.getElementById('download-audio-btn');
            if (dlAudioBtn) {
                dlAudioBtn.addEventListener('click', () => {
                    const formatId = document.getElementById('audio-format').value;
                    if (!formatId) { UI.showError("No audio format selected."); return; }
                    const trimData = Trimming.getValues();
                    Downloader.downloadMedia('audio', window.currentMediaUrl, formatId, trimData.trim, trimData.start_time, trimData.end_time);
                });
            }
            
            document.getElementById('download-thumb-btn').addEventListener('click', () => {
                UI.showLoading("Downloading Image...");
                window.location.href = `${CONFIG.API_BASE_URL}/download/image?url=${encodeURIComponent(data.thumbnail)}`;
                setTimeout(() => {
                    UI.showSuccess("Download requested!");
                }, 1000);
            });
        }
    }
}

if (!document.getElementById('spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
}

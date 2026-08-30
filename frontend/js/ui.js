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
        
        const durationText = data.duration > 0 ? `${data.duration}s` : "Unknown";
        const maxAttr = data.duration > 0 ? `max="${data.duration}"` : "";
        
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="card result-card" style="margin-top: 24px; padding: 0; overflow: hidden; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
                    <div style="display: flex; flex-direction: column; md:flex-direction: row; gap: 20px; padding: 30px;">
                        
                        <!-- Thumbnail Section -->
                        <div style="flex: 0 0 auto; width: 100%; max-width: 320px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px;">
                            <div style="position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.15);">
                                <img src="${data.thumbnail}" alt="Thumbnail" class="result-thumbnail" style="width: 100%; height: auto; max-height: 450px; object-fit: cover; display: block;">
                            </div>
                            
                            <button id="download-thumb-btn" style="width: 100%; padding: 12px; border-radius: 10px; background: #F1F5F9; color: #0F172A; border: 1px solid #E2E8F0; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem; transition: all 0.2s;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Download Image / Thumbnail
                            </button>
                        </div>
                        
                        <!-- Details Section -->
                        <div style="flex: 1; min-width: 0; ${isPhotoPost ? 'display: none;' : ''}">
                            <h3 style="margin: 0 0 15px 0; font-size: 1.4rem; font-weight: 800; color: #0F172A; line-height: 1.4;">${data.title}</h3>
                            <div style="display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap;">
                                <span class="badge" style="background: #F1F5F9; color: #475569; padding: 6px 14px; border-radius: 30px; font-size: 0.9rem; font-weight: 700;">Platform: ${data.platform}</span>
                                <span class="badge" style="background: #EEF2FF; color: #4F46E5; padding: 6px 14px; border-radius: 30px; font-size: 0.9rem; font-weight: 700;">Duration: ${durationText}</span>
                            </div>
                            
                            <!-- Download Controls -->
                            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 25px;">
                                <div style="display: flex; flex-direction: column; gap: 18px;">
                                    
                                    <div>
                                        <label style="display: block; font-weight: 700; margin-bottom: 8px; color: #1E293B; font-size: 0.95rem;">Select Video Quality:</label>
                                        <select id="video-format" style="width: 100%; padding: 12px 16px; border: 2px solid #E2E8F0; border-radius: 10px; background: white; font-size: 1rem; outline: none; cursor: pointer; transition: border-color 0.2s;">
                                            ${videoOptions}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label style="display: block; font-weight: 700; margin-bottom: 8px; color: #1E293B; font-size: 0.95rem;">Select Audio Quality:</label>
                                        <select id="audio-format" style="width: 100%; padding: 12px 16px; border: 2px solid #E2E8F0; border-radius: 10px; background: white; font-size: 1rem; outline: none; cursor: pointer; transition: border-color 0.2s;">
                                            ${audioOptions}
                                        </select>
                                    </div>
                                    
                                    <div class="trim-section" style="background: white; padding: 20px; border-radius: 12px; border: 2px dashed #CBD5E1; margin-top: 10px; transition: all 0.3s;">
                                        <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none;">
                                            <input type="checkbox" id="trim-toggle" style="width: 20px; height: 20px; accent-color: #4F46E5; cursor: pointer;"> 
                                            <strong style="color: #0F172A; font-size: 1.05rem;">Trim before download</strong>
                                        </label>
                                        <div id="trim-ui" style="display: none; margin-top: 20px;">
                                            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                                <div style="flex: 1; min-width: 120px;">
                                                    <label style="display: block; font-size: 0.9rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Start (seconds):</label>
                                                    <input type="number" id="trim-start" value="0" min="0" ${maxAttr} style="width: 100%; padding: 10px 15px; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 1rem; font-weight: 600;">
                                                </div>
                                                <div style="flex: 1; min-width: 120px;">
                                                    <label style="display: block; font-size: 0.9rem; font-weight: 600; color: #475569; margin-bottom: 6px;">End (seconds):</label>
                                                    <input type="number" id="trim-end" value="${data.duration}" min="0" ${maxAttr} style="width: 100%; padding: 10px 15px; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 1rem; font-weight: 600;">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <div style="display: flex; gap: 15px; margin-top: 25px; flex-wrap: wrap;">
                                    <button id="download-video-btn" style="flex: 1; min-width: 150px; padding: 14px; border-radius: 10px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; border: none; font-size: 1.05rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3); transition: transform 0.2s;">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        Download Video
                                    </button>
                                    <button id="download-audio-btn" style="flex: 1; min-width: 150px; padding: 14px; border-radius: 10px; background: linear-gradient(135deg, #059669, #10B981); color: white; border: none; font-weight: 700; font-size: 1.05rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); transition: transform 0.2s;">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
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
            
            const dlThumbBtn = document.getElementById('download-thumb-btn');
            if (dlThumbBtn) {
                dlThumbBtn.addEventListener('click', async () => {
                    const originalText = dlThumbBtn.innerHTML;
                    dlThumbBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"></path></svg> Downloading...`;
                    dlThumbBtn.style.pointerEvents = 'none';
                    
                    try {
                        const response = await fetch(`${CONFIG.API_BASE_URL}/download/image?url=${encodeURIComponent(data.thumbnail)}`);
                        if (response.ok) {
                            const blob = await response.blob();
                            const downloadUrl = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            
                            let filename = `image_${Date.now()}.jpg`;
                            const disposition = response.headers.get('Content-Disposition');
                            if (disposition && disposition.indexOf('attachment') !== -1) {
                                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                                const matches = filenameRegex.exec(disposition);
                                if (matches != null && matches[1]) { 
                                    filename = matches[1].replace(/['"]/g, '');
                                }
                            }
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(downloadUrl);
                            
                            dlThumbBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg> Downloaded!`;
                        } else {
                            const err = await response.json();
                            alert(err.error?.message || "Failed to download image securely.");
                            dlThumbBtn.innerHTML = originalText;
                        }
                    } catch(e) {
                        alert("Network error. The server could not download the image.");
                        dlThumbBtn.innerHTML = originalText;
                    }
                    dlThumbBtn.style.pointerEvents = 'auto';
                });
            }
        }
    }
}

if (!document.getElementById('spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }
    .tool-card:hover { transform: translateY(-3px); }
    button:hover { transform: translateY(-2px); filter: brightness(1.1); }
    `;
    document.head.appendChild(style);
}

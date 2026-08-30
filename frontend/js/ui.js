class UI {
    static showLoading(text, percent = null) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            let progressHtml = '';
            if (percent !== null) {
                progressHtml = `
                <div style="width: 100%; max-width: 300px; height: 8px; background: #E2E8F0; border-radius: 10px; margin: 15px auto 0; overflow: hidden;">
                    <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #4F46E5, #059669); transition: width 0.3s ease;"></div>
                </div>
                <div style="font-size: 0.9rem; color: #64748B; margin-top: 8px;">${percent}% Downloaded</div>`;
            }
            
            resultContainer.innerHTML = `<div class="loading" style="padding: 40px 20px; text-align: center; color: #4F46E5; font-weight: 600; font-size: 1.1rem; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-radius: var(--radius-md); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid var(--border); margin-top: 20px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-bottom: 12px; display: block; margin: 0 auto;">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                ${text}
                ${progressHtml}
            </div>`;
        }
    }
    static showSuccess(text) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML += `<div class="success" style="color: #059669; background: #D1FAE5; padding: 15px; border-radius: 12px; font-weight: 600; margin-top: 15px; text-align: center; border: 1px solid #10B981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); animation: fadeIn 0.5s ease;">${text}</div>`;
        }
    }
    static showError(message) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML = `<div class="error" style="color: #DC2626; background: #FEE2E2; padding: 20px; border-radius: 12px; border: 1px solid #EF4444; margin-top: 20px; font-weight: 500; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2); animation: fadeIn 0.5s ease;">
                <div style="display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 5px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <strong>Error</strong>
                </div>
                <div style="text-align: center;">${message}</div>
            </div>`;
        }
    }
    static renderMetadata(data) {
        window.currentMediaUrl = document.getElementById("url-input").value;
        const resultContainer = document.getElementById('result-container');
        
        let videoOptions = data.formats.video.length > 0 
            ? data.formats.video.map(f => {
                const codec = f.vcodec && f.vcodec !== 'none' ? f.vcodec.split('.')[0].toUpperCase() : 'Unknown';
                const size = f.filesize ? ` - ${(f.filesize / 1024 / 1024).toFixed(1)}MB` : '';
                return `<option value="${f.format_id}">${f.resolution} - ${codec}${size} (${f.ext})</option>`;
            }).join('')
            : `<option value="">No Video Available</option>`;
            
        let audioOptions = data.formats.audio.length > 0
            ? data.formats.audio.map(f => {
                const size = f.filesize ? ` - ${(f.filesize / 1024 / 1024).toFixed(1)}MB` : '';
                return `<option value="${f.format_id}">${f.abr}kbps${size} (${f.ext})</option>`;
            }).join('')
            : `<option value="">No Audio Available</option>`;
            
        const isPhotoPost = data.formats.video.length === 0 && data.formats.audio.length === 0;
        const durationText = data.duration > 0 ? `${data.duration}s` : "Unknown";
        const maxAttr = data.duration > 0 ? `max="${data.duration}"` : "";
        
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="card result-card" style="margin-top: 24px; padding: 0; overflow: hidden; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.5); animation: slideUp 0.4s ease;">
                    <div style="display: flex; flex-direction: column; md:flex-direction: row; gap: 30px; padding: 35px;">
                        
                        <!-- Thumbnail Section -->
                        <div style="flex: 0 0 auto; width: 100%; max-width: 320px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px;">
                            <div style="position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                                <img src="${data.thumbnail}" alt="Thumbnail" class="result-thumbnail" style="width: 100%; height: auto; max-height: 450px; object-fit: cover; display: block; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            
                            <button id="download-thumb-btn" style="width: 100%; padding: 14px; border-radius: 12px; background: rgba(241, 245, 249, 0.8); color: #0F172A; border: 1px solid #E2E8F0; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; transition: all 0.3s; backdrop-filter: blur(10px);">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Download Image / Thumbnail
                            </button>
                        </div>
                        
                        <!-- Details Section -->
                        <div style="flex: 1; min-width: 0; ${isPhotoPost ? 'display: none;' : ''}">
                            <h3 style="margin: 0 0 15px 0; font-size: 1.5rem; font-weight: 800; color: #0F172A; line-height: 1.4;">${data.title}</h3>
                            <div style="display: flex; gap: 12px; margin-bottom: 25px; flex-wrap: wrap;">
                                <span class="badge" style="background: rgba(241, 245, 249, 0.8); color: #475569; padding: 8px 16px; border-radius: 30px; font-size: 0.95rem; font-weight: 700; border: 1px solid #E2E8F0;">Platform: ${data.platform}</span>
                                <span class="badge" style="background: rgba(238, 242, 255, 0.8); color: #4F46E5; padding: 8px 16px; border-radius: 30px; font-size: 0.95rem; font-weight: 700; border: 1px solid #C7D2FE;">Duration: ${durationText}</span>
                            </div>
                            
                            <!-- Download Controls -->
                            <div style="background: rgba(248, 250, 252, 0.7); border: 1px solid #E2E8F0; border-radius: 16px; padding: 25px;">
                                <div style="display: flex; flex-direction: column; gap: 20px;">
                                    
                                    <div>
                                        <label style="display: block; font-weight: 700; margin-bottom: 8px; color: #1E293B; font-size: 0.95rem;">Select Video Quality (Size):</label>
                                        <select id="video-format" style="width: 100%; padding: 14px 18px; border: 2px solid #CBD5E1; border-radius: 12px; background: white; font-size: 1.05rem; outline: none; cursor: pointer; transition: all 0.3s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                                            ${videoOptions}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label style="display: block; font-weight: 700; margin-bottom: 8px; color: #1E293B; font-size: 0.95rem;">Select Audio Quality:</label>
                                        <select id="audio-format" style="width: 100%; padding: 14px 18px; border: 2px solid #CBD5E1; border-radius: 12px; background: white; font-size: 1.05rem; outline: none; cursor: pointer; transition: all 0.3s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                                            ${audioOptions}
                                        </select>
                                    </div>
                                    
                                    <div class="trim-section" style="background: white; padding: 20px; border-radius: 12px; border: 2px dashed #94A3B8; margin-top: 10px; transition: all 0.3s;">
                                        <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none;">
                                            <input type="checkbox" id="trim-toggle" style="width: 22px; height: 22px; accent-color: #4F46E5; cursor: pointer;"> 
                                            <strong style="color: #0F172A; font-size: 1.1rem;">Trim before download</strong>
                                        </label>
                                        <div id="trim-ui" style="display: none; margin-top: 20px;">
                                            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                                <div style="flex: 1; min-width: 120px;">
                                                    <label style="display: block; font-size: 0.9rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Start (sec):</label>
                                                    <input type="number" id="trim-start" value="0" min="0" ${maxAttr} style="width: 100%; padding: 12px 15px; border: 2px solid #CBD5E1; border-radius: 10px; font-size: 1.1rem; font-weight: 600; outline: none; transition: border-color 0.3s;">
                                                </div>
                                                <div style="flex: 1; min-width: 120px;">
                                                    <label style="display: block; font-size: 0.9rem; font-weight: 700; color: #475569; margin-bottom: 6px;">End (sec):</label>
                                                    <input type="number" id="trim-end" value="${data.duration}" min="0" ${maxAttr} style="width: 100%; padding: 12px 15px; border: 2px solid #CBD5E1; border-radius: 10px; font-size: 1.1rem; font-weight: 600; outline: none; transition: border-color 0.3s;">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <div style="display: flex; gap: 15px; margin-top: 30px; flex-wrap: wrap;">
                                    <button id="download-video-btn" style="flex: 1; min-width: 150px; padding: 16px; border-radius: 12px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; border: none; font-size: 1.1rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35); transition: transform 0.2s, box-shadow 0.2s;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        Download Video
                                    </button>
                                    <button id="download-audio-btn" style="flex: 1; min-width: 150px; padding: 16px; border-radius: 12px; background: linear-gradient(135deg, #059669, #10B981); color: white; border: none; font-weight: 800; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35); transition: transform 0.2s, box-shadow 0.2s;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                                        Audio Only
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            if (!isPhotoPost) Trimming.init(data.duration);
            
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
                dlThumbBtn.addEventListener('click', () => {
                    const originalText = dlThumbBtn.innerHTML;
                    dlThumbBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3"><path d="M20 6L9 17l-5-5"></path></svg> Opened in New Tab!`;
                    window.open(data.thumbnail, '_blank');
                    setTimeout(() => { dlThumbBtn.innerHTML = originalText; }, 3000);
                });
            }
        }
    }
}

if (!document.getElementById('spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .result-card { border: 1px solid rgba(255, 255, 255, 0.4); }
    button:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important; }
    select:focus, input[type="number"]:focus { border-color: #4F46E5 !important; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2) !important; }
    body { background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%); min-height: 100vh; }
    `;
    document.head.appendChild(style);
}

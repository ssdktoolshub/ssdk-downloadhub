class UI {
    static showLoading(text) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML = `<div class="loading" style="padding: 20px; text-align: center;">${text}</div>`;
        }
    }
    static showSuccess(text) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML += `<div class="success" style="color: green; font-weight: bold; margin-top: 10px;">${text}</div>`;
        }
    }
    static showError(message) {
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.innerHTML = `<div class="error" style="color: red; padding: 20px;">${message}</div>`;
        }
    }
    static renderMetadata(data) {
        window.currentMediaUrl = document.getElementById("url-input").value;
        const resultContainer = document.getElementById('result-container');
        
        let videoOptions = data.formats.video.map(f => `<option value="${f.format_id}">${f.resolution} (${f.ext})</option>`).join('');
        let audioOptions = data.formats.audio.map(f => `<option value="${f.format_id}">${f.abr}kbps (${f.ext})</option>`).join('');
        
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="card result-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-top: 20px;">
                    <img src="${data.thumbnail}" alt="Thumbnail" class="result-thumbnail" style="max-width: 100%; border-radius: 8px; margin-bottom: 10px;">
                    <h3 style="margin-bottom: 10px;">${data.title}</h3>
                    <p style="margin-bottom: 10px;">Platform: <span class="badge" style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${data.platform}</span> | Duration: ${data.duration}s</p>
                    
                    <div class="tabs" style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <button class="tab-btn active" style="padding: 8px 16px;">Video & Audio</button>
                    </div>
                    
                    <div id="video-tab" class="tab-content">
                        <div style="margin-bottom: 15px;">
                            <label>Select Video Quality:</label>
                            <select id="video-format" style="padding: 8px; width: 100%; margin-top: 5px;">
                                ${videoOptions}
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Select Audio Quality:</label>
                            <select id="audio-format" style="padding: 8px; width: 100%; margin-top: 5px;">
                                ${audioOptions}
                            </select>
                        </div>
                        
                        <div class="trim-section" style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="checkbox" id="trim-toggle"> 
                                <strong>Trim before download</strong>
                            </label>
                            <div id="trim-ui" style="display: none; margin-top: 15px;">
                                <div style="display: flex; gap: 15px;">
                                    <div>
                                        <label>Start (seconds):</label>
                                        <input type="number" id="trim-start" value="0" min="0" max="${data.duration}" style="padding: 8px; width: 100px;">
                                    </div>
                                    <div>
                                        <label>End (seconds):</label>
                                        <input type="number" id="trim-end" value="${data.duration}" min="0" max="${data.duration}" style="padding: 8px; width: 100px;">
                                    </div>
                                </div>
                                <div style="margin-top: 10px; font-size: 12px; color: #64748B;">
                                    Use the timeline inputs to set exact start and end times.
                                </div>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 10px;">
                            <button id="download-video-btn" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 6px; cursor: pointer;">Download Video</button>
                            <button id="download-audio-btn" style="padding: 10px 20px; background: #10B981; color: white; border: none; border-radius: 6px; cursor: pointer;">Download Audio Only</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Initialize Trimming
            Trimming.init(data.duration);
            
            // Bind buttons
            document.getElementById('download-video-btn').addEventListener('click', () => {
                const formatId = document.getElementById('video-format').value;
                const trimData = Trimming.getValues();
                Downloader.downloadMedia('video', window.currentMediaUrl, formatId, trimData.trim, trimData.start_time, trimData.end_time);
            });
            
            document.getElementById('download-audio-btn').addEventListener('click', () => {
                const formatId = document.getElementById('audio-format').value;
                const trimData = Trimming.getValues();
                Downloader.downloadMedia('audio', window.currentMediaUrl, formatId, trimData.trim, trimData.start_time, trimData.end_time);
            });
        }
    }
}

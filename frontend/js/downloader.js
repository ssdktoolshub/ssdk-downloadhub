class Downloader {
    static async downloadMedia(type, url, formatId, trim, startTime, endTime) {
        UI.showLoading(`Starting server process... please wait (large files take a minute)`);
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/download/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: url,
                    format_id: formatId,
                    trim: trim,
                    start_time: startTime,
                    end_time: endTime
                })
            });
            
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();
                    if (!result.success) {
                        UI.showError(result.error ? result.error.message : "Download failed on server.");
                        return;
                    }
                }
                
                const contentLength = response.headers.get('content-length');
                const total = contentLength ? parseInt(contentLength, 10) : 0;
                let loaded = 0;
                
                const reader = response.body.getReader();
                const chunks = [];
                
                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    loaded += value.length;
                    
                    if (total) {
                        const percent = Math.round((loaded / total) * 100);
                        UI.showLoading(`Downloading...`, percent);
                    } else {
                        UI.showLoading(`Downloading... ${(loaded / 1024 / 1024).toFixed(1)} MB`);
                    }
                }
                
                UI.showLoading(`Finalizing file...`);
                
                const blob = new Blob(chunks, { type: response.headers.get('content-type') });
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                
                const ext = type === 'audio' ? '.mp3' : '.mp4';
                let filename = `media_${Date.now()}${ext}`;
                
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
                UI.showSuccess("Download Complete! Check your downloads folder.");
            } else {
                const rawText = await response.text();
                try {
                    const result = JSON.parse(rawText);
                    UI.showError(result.error ? result.error.message : `HTTP ${response.status}: ${JSON.stringify(result)}`);
                } catch(e) {
                    UI.showError(`HTTP ${response.status}: ${rawText}`);
                }
            }
        } catch (error) {
            UI.showError(`Network error during download: ${error.message}`);
        }
    }
}

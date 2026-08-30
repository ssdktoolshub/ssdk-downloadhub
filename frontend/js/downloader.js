class Downloader {
    static async downloadMedia(type, url, formatId, trim, startTime, endTime) {
        UI.showLoading(`Downloading ${type}...`);
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
                
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                
                // Fallback extension based on type
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
                UI.showSuccess("Download Complete!");
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

class Downloader {
    static async downloadMedia(type, url, formatId, trim, startTime, endTime) {
        UI.showLoading(Downloading  + type + ...);
        try {
            const response = await fetch(${CONFIG.API_BASE_URL}/download/, {
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
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                // Try to get filename from content-disposition header if available, else generic
                let filename = download_ + Date.now();
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
                const result = await response.json();
                UI.showError(result.error ? result.error.message : "Download failed.");
            }
        } catch (error) {
            UI.showError("Network error during download.");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const analyzeBtn = document.getElementById("analyze-btn");
    const urlInput = document.getElementById("url-input");

    if (analyzeBtn && urlInput) {
        analyzeBtn.addEventListener("click", () => {
            const url = urlInput.value.trim();
            if (url) {
                Analyzer.handleAnalyze(url);
            }
        });
        
        urlInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const url = urlInput.value.trim();
                if (url) {
                    Analyzer.handleAnalyze(url);
                }
            }
        });
    }
});

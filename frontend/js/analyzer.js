class Analyzer {
    static async handleAnalyze(url) {
        UI.showLoading("Analyzing URL...");
        const result = await ApiService.analyzeUrl(url);
        if (result.success) {
            UI.renderMetadata(result.data);
        } else {
            UI.showError(result.error ? result.error.message : "Analysis failed.");
        }
    }
}

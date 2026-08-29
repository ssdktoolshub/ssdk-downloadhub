class ApiService {
    static async analyzeUrl(url) {
        try {
            const response = await fetch(${CONFIG.API_BASE_URL}/analyze, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            return await response.json();
        } catch (error) {
            return { success: false, error: { message: "Network error or backend is not running." }};
        }
    }
}

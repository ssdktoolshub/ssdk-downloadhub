class Trimming {
    static init(duration) {
        this.duration = duration ? parseFloat(duration) : 0;
        this.start = 0;
        this.end = this.duration;
        
        const trimToggle = document.getElementById('trim-toggle');
        if (trimToggle) {
            trimToggle.addEventListener('change', (e) => {
                const trimUI = document.getElementById('trim-ui');
                if(e.target.checked) {
                    trimUI.style.display = 'block';
                } else {
                    trimUI.style.display = 'none';
                }
            });
        }
        
        const startInput = document.getElementById('trim-start');
        const endInput = document.getElementById('trim-end');
        
        if (startInput) {
            startInput.addEventListener('change', (e) => {
                const val = parseFloat(e.target.value);
                this.start = isNaN(val) ? 0 : val;
            });
        }
        
        if (endInput) {
            endInput.addEventListener('change', (e) => {
                const val = parseFloat(e.target.value);
                this.end = isNaN(val) ? this.duration : val;
            });
        }
    }
    
    static getValues() {
        const isTrim = document.getElementById('trim-toggle') && document.getElementById('trim-toggle').checked;
        return {
            trim: isTrim,
            start_time: this.start,
            end_time: this.end
        };
    }
}

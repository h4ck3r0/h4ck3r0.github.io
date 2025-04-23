class Matrix {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('matrix-background');
        this.ctx = this.canvas.getContext('2d');
        this.characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];

        // Add canvas to hero section
        document.querySelector('.hero').prepend(this.canvas);
        
        // Initialize
        window.addEventListener('resize', () => this.resize());
        this.resize();
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
        
        // Calculate columns and initialize drops
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    draw() {
        // Semi-transparent white background for trail effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Black text color
        this.ctx.fillStyle = '#000000';
        this.ctx.font = this.fontSize + 'px monospace';

        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            // Random character
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            
            // Draw character
            this.ctx.fillText(
                char,
                i * this.fontSize,
                this.drops[i] * this.fontSize
            );

            // Reset position if drop reaches bottom
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            // Move drop down
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const matrix = new Matrix();
});

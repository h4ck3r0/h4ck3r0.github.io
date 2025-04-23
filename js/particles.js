class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 2 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 1 + 1;
        this.connectionRadius = 100;
    }

    update(width, height) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0 || this.x > width) {
            this.angle = Math.PI - this.angle;
        }
        if (this.y < 0 || this.y > height) {
            this.angle = -this.angle;
        }
    }
}

class ParticleNetwork {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('particle-network');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animate = this.animate.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        document.querySelector('.hero').prepend(this.canvas);
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', this.handleMouseMove);
        
        this.resize();
        this.init();
        this.animate();
    }

    init() {
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        this.particles = [];

        for (let i = 0; i < numberOfParticles; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.particles.push(new Particle(x, y));
        }
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = event.clientX - rect.left;
        this.mouseY = event.clientY - rect.top;
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
        this.init();
    }

    drawConnections() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';

        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            // Connect to nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < p1.connectionRadius) {
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                }
            }

            // Connect to mouse position
            const dx = p1.x - this.mouseX;
            const dy = p1.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < p1.connectionRadius * 1.5) {
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(this.mouseX, this.mouseY);
            }
        }

        this.ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.canvas.width, this.canvas.height);
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fill();
        });

        this.drawConnections();
        requestAnimationFrame(this.animate);
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork();
});

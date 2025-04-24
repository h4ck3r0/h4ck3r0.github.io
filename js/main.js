// Navigation active state handler
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Function to set active link based on current section
    function setActiveNavLink() {
        const fromTop = window.scrollY + 100; // Offset for navbar height
        
        navLinks.forEach(link => {
            const section = document.querySelector(link.hash);
            
            if (section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }
    
    // Update active state on scroll
    window.addEventListener('scroll', setActiveNavLink);
    
    // Update active state on click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Initialize skill progress bars
        document.addEventListener('DOMContentLoaded', () => {
            const skillTiles = document.querySelectorAll('.skill-tile');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target.querySelector('.progress-bar');
                        const level = entry.target.dataset.level;
                        progressBar.style.setProperty('--progress', `${level}%`);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            skillTiles.forEach(tile => observer.observe(tile));
        });
    });
    
    // Set initial active state
    setActiveNavLink();
});

// Initialize repository grid functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const languageFilter = document.getElementById('languageFilter');
    const sortOption = document.getElementById('sortOption');
    const repoGrid = document.getElementById('repoGrid');
    
    // Add your repository filtering and sorting logic here
});

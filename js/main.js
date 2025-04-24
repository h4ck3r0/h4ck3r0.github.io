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
    });
    
    // Set initial active state
    setActiveNavLink();
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

// GitHub Repositories
document.addEventListener('DOMContentLoaded', () => {
    const username = 'h4ck3r0';
    const repoGrid = document.getElementById('repoGrid');
    const languageFilter = document.getElementById('languageFilter');
    const searchInput = document.getElementById('searchInput');
    const sortOption = document.getElementById('sortOption');
    let allRepos = [];

    // Fetch GitHub repositories
    async function fetchRepositories() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
            allRepos = await response.json();
            
            // Get unique languages
            const languages = [...new Set(allRepos.filter(repo => repo.language).map(repo => repo.language))];
            
            // Populate language filter
            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang;
                option.textContent = lang;
                languageFilter.appendChild(option);
            });
            
            displayRepositories(allRepos);
        } catch (error) {
            repoGrid.innerHTML = '<p class="error">Error loading repositories. Please try again later.</p>';
        }
    }

    // Display repositories
    function displayRepositories(repos) {
        repoGrid.innerHTML = '';
        
        if (repos.length === 0) {
            repoGrid.innerHTML = '<p class="no-results">No repositories found matching your criteria.</p>';
            return;
        }

        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.setAttribute('data-tilt', '');
            
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
                ${repo.language ? `<p class="repo-language"><i class="fas fa-code"></i> ${repo.language}</p>` : ''}
                <div class="repo-stats">
                    <span><i class="fab fa-github"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    <span><i class="far fa-clock"></i> ${repo.updated_at.split('T')[0]}</span>
                </div>
            `;
            
            card.addEventListener('click', () => {
                window.open(repo.html_url, '_blank');
            });
            
            repoGrid.appendChild(card);
        });

        // Initialize tilt effect
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }

    // Filter and sort repositories
    function filterAndSortRepos() {
        let filteredRepos = [...allRepos];
        
        // Apply language filter
        if (languageFilter.value) {
            filteredRepos = filteredRepos.filter(repo => repo.language === languageFilter.value);
        }
        
        // Apply search filter
        if (searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filteredRepos = filteredRepos.filter(repo => 
                repo.name.toLowerCase().includes(searchTerm) ||
                (repo.description && repo.description.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply sorting
        switch (sortOption.value) {
            case 'stars':
                filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
                break;
            case 'updated':
                filteredRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                break;
            case 'name':
                filteredRepos.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        displayRepositories(filteredRepos);
    }

    // Event listeners for filters
    searchInput.addEventListener('input', filterAndSortRepos);
    languageFilter.addEventListener('change', filterAndSortRepos);
    sortOption.addEventListener('change', filterAndSortRepos);

    // Initial fetch
    fetchRepositories();
});

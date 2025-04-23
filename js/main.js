// Configuration
const GITHUB_USERNAME = 'h4ck3r0';
const REPOS_PER_PAGE = 12;

// DOM Elements
const repoGrid = document.getElementById('repoGrid');
const searchInput = document.getElementById('searchInput');
const languageFilter = document.getElementById('languageFilter');
const sortOption = document.getElementById('sortOption');
const pagination = document.getElementById('pagination');
const navLinks = document.querySelectorAll('.nav-links a');

// State
let allRepos = [];
let filteredRepos = [];
let currentPage = 1;
let languages = new Set();

// Navigation
function handleNavigation() {
    const currentHash = window.location.hash || '#home';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Handle scroll animations
function handleScroll() {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const correspondingLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);
            if (correspondingLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Fetch repositories from GitHub API
async function fetchRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        allRepos = await response.json();
        
        // Process and sort repositories
        allRepos = allRepos
            .filter(repo => !repo.fork) // Exclude forked repositories
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        // Extract languages
        allRepos.forEach(repo => {
            if (repo.language) languages.add(repo.language);
        });
        
        // Populate language filter
        populateLanguageFilter();
        
        // Initialize display
        filteredRepos = [...allRepos];
        updateDisplay();
    } catch (error) {
        repoGrid.innerHTML = `
            <div class="error fade-in">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error fetching repositories: ${error.message}</p>
                <button onclick="fetchRepositories()" class="retry-btn">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>`;
    }
}

// Populate language filter dropdown
function populateLanguageFilter() {
    const options = Array.from(languages)
        .sort()
        .map(lang => `<option value="${lang}">${lang}</option>`)
        .join('');
    languageFilter.innerHTML += options;
}

// Filter and sort repositories
function filterAndSortRepos() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLanguage = languageFilter.value;
    const sortBy = sortOption.value;

    filteredRepos = allRepos.filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchTerm) ||
                            (repo.description && repo.description.toLowerCase().includes(searchTerm));
        const matchesLanguage = !selectedLanguage || repo.language === selectedLanguage;
        return matchesSearch && matchesLanguage;
    });

    // Sort repositories
    filteredRepos.sort((a, b) => {
        switch (sortBy) {
            case 'stars':
                return b.stargazers_count - a.stargazers_count;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'updated':
                return new Date(b.updated_at) - new Date(a.updated_at);
            default:
                return 0;
        }
    });

    currentPage = 1;
    updateDisplay();
}

// Create repository card
function createRepoCard(repo) {
    const languageColors = {
        JavaScript: '#f1e05a',
        Python: '#3572A5',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Shell: '#89e051',
        Ruby: '#701516',
        Java: '#b07219',
        'C++': '#f34b7d',
        TypeScript: '#2b7489',
        PHP: '#4F5D95'
    };

    return `
        <div class="repo-card fade-in">
            <h3>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-code-branch"></i> ${repo.name}
                </a>
            </h3>
            <p>${repo.description || 'No description available'}</p>
            <div class="repo-stats">
                <span class="language">
                    <span class="language-color" style="background-color: ${languageColors[repo.language] || '#858585'}"></span>
                    ${repo.language || 'No language specified'}
                </span>
                <span title="Stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span title="Forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                <span title="Last updated">${new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
        </div>
    `;
}

// Update repository display
function updateDisplay() {
    const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
    const endIndex = startIndex + REPOS_PER_PAGE;
    const currentRepos = filteredRepos.slice(startIndex, endIndex);

    repoGrid.innerHTML = currentRepos.map(createRepoCard).join('');
    updatePagination();
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredRepos.length / REPOS_PER_PAGE);
    
    let paginationHTML = '';
    
    if (totalPages > 1) {
        if (currentPage > 1) {
            paginationHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
        }
        
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="${i === currentPage ? 'active' : ''}"
                        onclick="changePage(${i})">${i}</button>
            `;
        }
        
        if (currentPage < totalPages) {
            paginationHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
        }
    }
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    updateDisplay();
    window.scrollTo({ top: repoGrid.offsetTop - 20, behavior: 'smooth' });
}

// Typewriter effect for header
function typewriterEffect() {
    const element = document.querySelector('.typewriter');
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
        } else {
            clearInterval(interval);
        }
    }, 100);
}

// Event listeners
searchInput.addEventListener('input', filterAndSortRepos);
languageFilter.addEventListener('change', filterAndSortRepos);
sortOption.addEventListener('change', filterAndSortRepos);

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchRepositories();
    typewriterEffect();
    handleNavigation();
});

window.addEventListener('hashchange', handleNavigation);
window.addEventListener('scroll', handleScroll);

// Initialize navbar scroll behavior
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            window.location.hash = targetId;
        }
    });
});

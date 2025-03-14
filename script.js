/**
 * VS Code Portfolio Website
 * Main JavaScript file
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ------------- CORE FUNCTIONS -------------
    
    // Function to load file content
    function loadFileContent(filePath) {
        const codeContent = document.querySelector('.code-content');
        const lineNumbers = document.querySelector('.line-numbers');
        
        // Clear existing content
        codeContent.innerHTML = '';
        lineNumbers.innerHTML = '';
        
        // HTML files from pages directory
        if (filePath && filePath.endsWith('.html')) {
            fetch(`pages/${filePath}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(html => {
                    // Content pages have special handling
                    const contentPages = ['home.html', 'about.html', 'projects.html', 'skills.html', 'contact.html', 'hearts.html'];
                    if (contentPages.includes(filePath)) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const pageContent = doc.querySelector('.page-content');
                        
                        if (pageContent) {
                            // Show the page content directly
                            codeContent.innerHTML = '';
                            codeContent.appendChild(pageContent);
                            lineNumbers.style.display = 'none';
                            codeContent.classList.add('content-view');
                            initPageContent();
                            updateStatusBar(filePath);
                            
                            // Initialize hearts functionality if on hearts page
                            if (filePath === 'hearts.html') {
                                setTimeout(initHeartsFunctionality, 300);
                            }
                            return;
                        }
                    }
                    
                    // For other HTML files, show the code
                    showCodeView(html, filePath);
                })
                .catch(error => {
                    console.error('Error loading file:', error);
                    codeContent.innerHTML = `<div class="error-message">Error: Could not load ${filePath}</div>`;
                });
        } 
        // CSS, JS, and MD files
        else if (filePath && (filePath.endsWith('.css') || filePath.endsWith('.js') || filePath.endsWith('.md'))) {
            fetch(`pages/${filePath}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(code => {
                    showCodeView(code, filePath);
                })
                .catch(error => {
                    console.error('Error loading file:', error);
                    codeContent.innerHTML = `<div class="error-message">Error: Could not load ${filePath}</div>`;
                });
        } 
        // Default placeholder
        else {
            codeContent.innerHTML = '<div class="placeholder">Select a file to view content</div>';
            updateStatusBar('');
        }
    }
    
    // Function to show code view
    function showCodeView(code, filePath) {
        const codeContent = document.querySelector('.code-content');
        const lineNumbers = document.querySelector('.line-numbers');
        
        lineNumbers.style.display = 'block';
        codeContent.classList.remove('content-view');
        
        const lines = code.split('\n');
        
        lines.forEach((line, index) => {
            const lineNumber = document.createElement('div');
            lineNumber.className = 'line-number';
            lineNumber.textContent = index + 1;
            lineNumbers.appendChild(lineNumber);
            
            const codeLine = document.createElement('div');
            codeLine.className = 'code-line';
            codeLine.textContent = line;
            codeContent.appendChild(codeLine);
        });
        
        updateStatusBar(filePath);
    }
    
    // Function to update status bar
    function updateStatusBar(filePath) {
        const statusSection = document.querySelector('.status-bar .status-section:first-child');
        if (statusSection) {
            const fileName = filePath ? filePath.split('/').pop() : '';
            
            const icon = statusSection.querySelector('i');
            statusSection.innerHTML = '';
            
            if (icon) {
                statusSection.appendChild(icon);
                statusSection.appendChild(document.createTextNode(' ' + (fileName ? `Editing: ${fileName}` : 'Ready')));
            } else {
                statusSection.innerHTML = `<i class="fas fa-check-circle"></i> ${fileName ? `Editing: ${fileName}` : 'Ready'}`;
            }
        }
    }

    // ------------- FILE AND TAB HANDLING -------------
    
    // Handle file clicks
    const files = document.querySelectorAll('.file');
    files.forEach(file => {
        file.addEventListener('click', () => {
            files.forEach(f => f.classList.remove('active'));
            file.classList.add('active');
            
            const fileName = file.textContent.trim();
            const fileIcon = file.querySelector('i').cloneNode(true);
            const filePath = file.getAttribute('data-file');
            
            // Check if tab already exists
            const tabs = document.querySelectorAll('.tab');
            let existingTab = null;
            
            tabs.forEach(tab => {
                if (tab.getAttribute('data-file') === filePath) {
                    tab.classList.add('active');
                    existingTab = tab;
                } else {
                    tab.classList.remove('active');
                }
            });
            
            // Load file content
            loadFileContent(filePath);
            
            // Create new tab if doesn't exist
            if (!existingTab) {
                createNewTab(filePath, fileName, fileIcon);
            }
        });
    });

    // Function to create a new tab
    function createNewTab(filePath, fileName, fileIcon) {
        const tabsContainer = document.querySelector('.tabs');
        if (!tabsContainer) return;
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        
        // Create new tab
        const newTab = document.createElement('div');
        newTab.classList.add('tab', 'active');
        newTab.setAttribute('data-file', filePath);
        
        // Add icon
        if (fileIcon) {
            newTab.appendChild(fileIcon);
        }
        
        // Add text
        const span = document.createElement('span');
        span.textContent = fileName || filePath;
        newTab.appendChild(span);
        
        // Add close icon
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fas fa-times close-icon';
        newTab.appendChild(closeIcon);
        
        // Add to container
        tabsContainer.appendChild(newTab);
        
        // Click handler for tab
        newTab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            newTab.classList.add('active');
            loadFileContent(filePath);
        });
        
        // Close handler
        closeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            handleTabClose(newTab);
        });
    }
    
    // Function to handle tab closing
    function handleTabClose(tab) {
        const tabs = document.querySelectorAll('.tab');
        if (tabs.length > 1) {
            if (tab.classList.contains('active')) {
                // Activate next or previous tab
                if (tab.nextElementSibling) {
                    tab.nextElementSibling.classList.add('active');
                    const nextFilePath = tab.nextElementSibling.getAttribute('data-file');
                    loadFileContent(nextFilePath);
                } else if (tab.previousElementSibling) {
                    tab.previousElementSibling.classList.add('active');
                    const prevFilePath = tab.previousElementSibling.getAttribute('data-file');
                    loadFileContent(prevFilePath);
                }
            }
            tab.remove();
        } else {
            // If last tab, load home
            const homeFile = document.querySelector('.file[data-file="home.html"]');
            if (homeFile) {
                homeFile.click();
            }
            tab.remove();
        }
    }

    // ------------- SIDEBAR HANDLING -------------
    
    // Activity bar functionality - only open sidebar for folder icon
    function initSidebarHandling() {
        const activityIcons = document.querySelectorAll('.activity-icon');
        const sidebar = document.querySelector('.sidebar');
        const mainContainer = document.querySelector('.main-container');
        
        // Get references to specific icons
        const explorerIcon = document.querySelector('.activity-icon[data-tooltip="Explorer"]');
        const toggleSidebarIcon = document.getElementById('toggle-sidebar');
        const heartsIcon = document.getElementById('hearts-icon');
        
        // Handle click on activity icons
        activityIcons.forEach(icon => {
            // Remove old handlers by cloning
            const newIcon = icon.cloneNode(true);
            if (icon.parentNode) {
                icon.parentNode.replaceChild(newIcon, icon);
            }
        });
        
        // Get fresh references
        const freshActivityIcons = document.querySelectorAll('.activity-icon');
        
        // Add specific handlers
        freshActivityIcons.forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Set active state
                freshActivityIcons.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Handle different icon clicks
                if (this.getAttribute('data-tooltip') === 'Explorer') {
                    sidebar.classList.add('visible');
                    if (mainContainer) mainContainer.classList.remove('sidebar-hidden');
                } 
                else if (this.id === 'toggle-sidebar') {
                    sidebar.classList.toggle('visible');
                    if (mainContainer) mainContainer.classList.toggle('sidebar-hidden');
                    
                    // Update tooltip and icon
                    const isSidebarHidden = !sidebar.classList.contains('visible');
                    this.setAttribute('data-tooltip', isSidebarHidden ? 'Show Sidebar' : 'Hide Sidebar');
                    
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.className = isSidebarHidden ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
                    }
                } 
                else if (this.id === 'hearts-icon') {
                    heartIconClickHandler();
                    sidebar.classList.remove('visible');
                    if (mainContainer) mainContainer.classList.add('sidebar-hidden');
                } 
                else {
                    sidebar.classList.remove('visible');
                    if (mainContainer) mainContainer.classList.add('sidebar-hidden');
                }
            });
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && 
                !document.querySelector('.activity-bar').contains(e.target)) {
                sidebar.classList.remove('visible');
                if (mainContainer) mainContainer.classList.add('sidebar-hidden');
                
                // Update toggle icon
                if (toggleSidebarIcon) {
                    toggleSidebarIcon.setAttribute('data-tooltip', 'Show Sidebar');
                    const icon = toggleSidebarIcon.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-chevron-right';
                    }
                }
                
                // Remove active class
                if (explorerIcon) explorerIcon.classList.remove('active');
            }
        });
        
        // Close sidebar button
        const closeSidebarBtn = document.getElementById('close-sidebar');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                sidebar.classList.remove('visible');
                if (mainContainer) mainContainer.classList.add('sidebar-hidden');
                
                // Update toggle icon
                if (toggleSidebarIcon) {
                    toggleSidebarIcon.setAttribute('data-tooltip', 'Show Sidebar');
                    const icon = toggleSidebarIcon.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-chevron-right';
                    }
                }
                
                // Remove active class
                if (explorerIcon) explorerIcon.classList.remove('active');
            });
        }
    }

    // ------------- HEARTS FUNCTIONALITY -------------
    
    // Hearts animation function
    function createFloatingHearts(container) {
        if (!container) {
            console.error("Hearts animation container not found");
            return;
        }
        
        // Create multiple hearts
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const heart = document.createElement('i');
                heart.classList.add('fas', 'fa-heart', 'floating-heart');
                
                // Random position, size, and timing
                const size = Math.random() * 20 + 10;
                const left = Math.random() * 100;
                const animDuration = Math.random() * 2 + 3;
                const delay = Math.random() * 0.5;
                
                heart.style.fontSize = `${size}px`;
                heart.style.left = `${left}%`;
                heart.style.animationDuration = `${animDuration}s`;
                heart.style.animationDelay = `${delay}s`;
                
                container.appendChild(heart);
                
                // Remove heart after animation
                setTimeout(() => {
                    if (heart && heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, (animDuration + delay) * 1000 + 200);
            }, i * 150);
        }
    }

    // Initialize heart counter functionality
    function initHeartsFunctionality() {
        console.log("Initializing hearts functionality");
        
        // Get heart count from localStorage
        const savedCount = localStorage.getItem('heartCount');
        let count = savedCount ? parseInt(savedCount) : 0;
        console.log("Retrieved heart count from localStorage:", count);
        
        const heartButton = document.getElementById('heart-button');
        const heartCount = document.getElementById('heart-count');
        const heartsArea = document.getElementById('hearts-animation-area');
        
        if (!heartButton || !heartCount) {
            console.error("Could not find heart button or count elements");
            return;
        }
        
        // Update display
        heartCount.textContent = count.toString();
        
        // Replace button to remove old listeners
        const newButton = document.createElement('div');
        newButton.id = 'heart-button';
        newButton.className = heartButton.className;
        newButton.innerHTML = heartButton.innerHTML;
        
        // Replace original button
        heartButton.parentNode.replaceChild(newButton, heartButton);
        
        // Add click handler
        newButton.addEventListener('click', function() {
            // Increment counter
            count++;
            console.log("Incremented heart count to:", count);
            
            // Save to localStorage
            localStorage.setItem('heartCount', count.toString());
            
            // Update display
            heartCount.textContent = count.toString();
            
            // Animation
            this.classList.add('beat');
            setTimeout(() => this.classList.remove('beat'), 500);
            
            // Create floating hearts
            createFloatingHearts(heartsArea);
            
            // Throttle clicks
            this.style.pointerEvents = 'none';
            setTimeout(() => this.style.pointerEvents = 'auto', 600);
        });
        
        console.log("Hearts functionality initialized with count:", count);
    }

    // Hearts icon click handler
    function heartIconClickHandler() {
        console.log("Hearts icon clicked");
        
        // Load hearts content
        loadFileContent('hearts.html');
        
        // Update active icon
        document.querySelectorAll('.activity-icon').forEach(icon => {
            icon.classList.remove('active');
        });
        
        const heartsIcon = document.getElementById('hearts-icon');
        if (heartsIcon) heartsIcon.classList.add('active');
        
        // Create or activate hearts tab
        const existingHeartsTab = document.querySelector('.tab[data-file="hearts.html"]');
        const tabsContainer = document.querySelector('.tabs');
        
        if (existingHeartsTab) {
            // Activate existing tab
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            existingHeartsTab.classList.add('active');
        } 
        else if (tabsContainer) {
            // Create new hearts tab
            const icon = document.createElement('i');
            icon.className = 'fas fa-heart';
            icon.style.color = '#ff3e3e';
            
            createNewTab('hearts.html', 'hearts.html', icon);
        }
        
        // Hide sidebar for cleaner mobile experience
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.remove('visible');
    }
    
    // Attach heart icon handler
    const heartsIconElement = document.getElementById('hearts-icon');
    if (heartsIconElement) {
        // Clone to remove old handlers
        const newHeartsIcon = heartsIconElement.cloneNode(true);
        if (heartsIconElement.parentNode) {
            heartsIconElement.parentNode.replaceChild(newHeartsIcon, heartsIconElement);
        }
        
        // Add click handler
        newHeartsIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            heartIconClickHandler();
        });
    }

    // ------------- ANIMATION HANDLING -------------
    
    // Animation functions for content pages
    function animateElements() {
        // Stagger animations for lists of elements
        const staggeredElements = [
            '.contact-item', 
            '.timeline-item', 
            '.tool-item', 
            '.project-card',
            '.skill-card', 
            '.project-preview',
            '.ml-card'
        ];
        
        staggeredElements.forEach(selector => {
            const items = document.querySelectorAll(selector);
            items.forEach((el, index) => {
                el.style.setProperty('--i', index);
                el.classList.add('staggered-animation');
            });
        });
        
        // Add animation classes
        document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
            if (!el.classList.contains('animated')) {
                el.classList.add('animated');
            }
        });
        
        // Set up intersection observer for scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        // Layout fixes
        const pageContent = document.querySelector('.page-content');
        if (pageContent) {
            pageContent.style.minHeight = 'calc(100vh - 100px)';
        }
        
        const editorContent = document.querySelector('.code-content.content-view');
        if (editorContent) {
            editorContent.style.overflow = 'auto';
            editorContent.style.maxHeight = 'calc(100vh - 130px)';
        }
    }

    // Animation for elements that come into view while scrolling
    function animateOnScroll() {
        const animElements = document.querySelectorAll('.animate-on-scroll');
        
        // Check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
                rect.bottom >= 0
            );
        }
        
        // Initial check
        animElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animate');
            }
        });
        
        // Add scroll listener
        const codeContent = document.querySelector('.code-content');
        if (codeContent) {
            codeContent.addEventListener('scroll', function() {
                animElements.forEach(element => {
                    if (isInViewport(element) && !element.classList.contains('animate')) {
                        element.classList.add('animate');
                    }
                });
            });
        }
    }

    // Initialize skill bars animation
    function initializeSkillBars() {
        console.log("Initializing skill bars");
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (skillBars.length > 0) {
            skillBars.forEach(bar => {
                const value = bar.getAttribute('data-value');
                if (value) {
                    bar.style.setProperty('--width', `${value}%`);
                    
                    setTimeout(() => {
                        bar.classList.add('animate');
                    }, 200);
                }
            });
        }
    }

    // Initialize page content
    function initPageContent() {
        setTimeout(() => {
            animateElements();
            animateOnScroll();
            
            const skillBars = document.querySelectorAll('.skill-progress');
            if (skillBars.length > 0) {
                initializeSkillBars();
            }
        }, 100);
    }

    // ------------- TERMINAL FUNCTIONALITY -------------
    
    // Terminal toggle function
    function toggleTerminal() {
        console.log('Terminal toggle called');
        const terminalPanel = document.getElementById('terminal-panel');
        if (!terminalPanel) {
            console.error('Terminal panel not found');
            return;
        }
        
        // Toggle visibility
        terminalPanel.classList.toggle('visible');
        
        // Focus the terminal input if visible
        if (terminalPanel.classList.contains('visible')) {
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) {
                setTimeout(() => {
                    terminalInput.focus();
                }, 100);
            }
        }
    }

    // Setup terminal handlers
    function initTerminal() {
        const terminalPanel = document.getElementById('terminal-panel');
        const closeTerminal = document.getElementById('close-terminal');
        const minimizeTerminal = document.getElementById('minimize-terminal');
        const terminalInput = document.getElementById('terminal-input');
        
        if (!terminalPanel) {
            console.error('Terminal panel not found');
            return;
        }
        
        // Terminal control buttons
        if (closeTerminal) {
            closeTerminal.addEventListener('click', toggleTerminal);
        }
        
        if (minimizeTerminal) {
            minimizeTerminal.addEventListener('click', toggleTerminal);
        }
        
        // Terminal input handling
        if (terminalInput) {
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const command = terminalInput.textContent.trim();
                    executeCommand(command);
                    terminalInput.textContent = '';
                }
            });
        }

        // Desktop menu terminal option
        const terminalMenuItem = document.querySelector('.desktop-menu li:nth-child(5)');
        if (terminalMenuItem) {
            terminalMenuItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Desktop terminal menu clicked');
                toggleTerminal();
            });
        }
    }

    // Terminal command execution
    function executeCommand(command) {
        const terminalContent = document.querySelector('.terminal-content');
        if (!terminalContent) return;
        
        // Create command line
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = '$';
        
        const commandText = document.createElement('span');
        commandText.className = 'terminal-text';
        commandText.textContent = ' ' + command;
        
        commandLine.appendChild(prompt);
        commandLine.appendChild(commandText);
        
        // Create response line
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';
        
        const responseText = document.createElement('span');
        responseText.className = 'terminal-text typing-animation';
        
        // Handle commands
        let responseContent = '';
        
        if (command === 'help') {
            responseContent = 'Available commands: help, clear, date, echo, ls, version, about, contact';
        } else if (command === 'clear') {
            const lines = terminalContent.querySelectorAll('.terminal-line');
            for (let i = 0; i < lines.length - 1; i++) {
                lines[i].remove();
            }
            return;
        } else if (command === 'date') {
            responseContent = new Date().toString();
        } else if (command.startsWith('echo ')) {
            responseContent = command.substring(5);
        } else if (command === 'ls') {
            responseContent = 'index.html\nstyles.css\nscript.js\nREADME.md\nassets/';
        } else if (command === 'version') {
            responseContent = 'VS Code Portfolio v1.0.0';
        } else if (command === '') {
            return;
        } else {
            responseContent = `Command not found: ${command}. Type 'help' for available commands.`;
        }
        
        responseText.textContent = responseContent;
        responseLine.appendChild(responseText);
        
        // Add lines to terminal
        const inputLine = terminalContent.lastElementChild;
        terminalContent.insertBefore(commandLine, inputLine);
        terminalContent.insertBefore(responseLine, inputLine);
        
        // Scroll to bottom
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    // ------------- THEME HANDLING -------------
    
    // Theme toggle functionality
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            console.error('Theme toggle element not found');
            return;
        }
        
        // Apply saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
        
        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('light-theme')) {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ------------- MOBILE MENU -------------
    
    // Initialize mobile menu functionality
    function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const closeMobileMenu = document.querySelector('.close-mobile-menu');
        
        if (!mobileMenuToggle || !mobileMenuOverlay) {
            console.error('Mobile menu elements not found');
            return;
        }
        
        // Open menu
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close menu with X button
        if (closeMobileMenu) {
            closeMobileMenu.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close when clicking overlay
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Mobile menu item clicks - IMPORTANT FIX HERE
        const mobileMenuItems = document.querySelectorAll('.mobile-menu li');
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                console.log('Mobile menu item clicked:', item.textContent);
                
                // Handle menu item clicks - IMPROVED MATCHING
                if (item.textContent.trim().toLowerCase() === 'terminal') {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Terminal menu item clicked in mobile menu');
                    toggleTerminal();
                }
                
                // Close the menu
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ------------- INITIALIZATION -------------
    
    // Initialize all components
    function init() {
        // Initialize sidebar handling
        initSidebarHandling();
        
        // Initialize terminal functionality
        initTerminal();
        
        // Initialize theme toggle
        initThemeToggle();
        
        // Initialize mobile menu
        initMobileMenu();
        
        // Add heart beat animation CSS
        document.head.insertAdjacentHTML('beforeend', `
        <style>
        @keyframes heartBeat {
            0% { transform: scale(1); }
            15% { transform: scale(1.3); }
            30% { transform: scale(1); }
            45% { transform: scale(1.2); }
            60% { transform: scale(1); }
            100% { transform: scale(1); }
        }
        .heart-button.beat i {
            animation: heartBeat 0.8s forwards;
        }
        </style>
        `);
        
        // Auto-load home page
        setTimeout(() => {
            const homeFile = document.querySelector('.file[data-file="home.html"]');
            if (homeFile) {
                homeFile.click();
            }
        }, 100);
        
        // Set up observer for skill bars
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    const skillBars = document.querySelectorAll('.skill-progress:not(.animate)');
                    if (skillBars.length > 0) {
                        console.log("Found newly added skill bars, initializing...");
                        initializeSkillBars();
                    }
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Run initialization
    init();
});
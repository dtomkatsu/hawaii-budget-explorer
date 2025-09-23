// Simple client-side router
class Router {
    constructor(routes) {
        this.routes = routes || [];
        this.rootElement = document.getElementById('app');
        this.init();
    }

    init() {
        // Handle initial load
        window.addEventListener('DOMContentLoaded', () => this.handleRoute());
        
        // Handle back/forward navigation
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const path = link.getAttribute('href');
                window.history.pushState({}, '', path);
                this.handleRoute();
            }
        });
    }

    async handleRoute() {
        const path = window.location.hash.slice(1) || '/';
        const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');
        
        if (route) {
            try {
                // Show loading state
                this.rootElement.innerHTML = `
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Loading...</p>
                    </div>`;
                
                // Load and render the component
                const html = await route.component();
                this.rootElement.innerHTML = html;
                
                // Initialize any component-specific logic
                if (route.init) {
                    await route.init();
                }
                
                // Update active nav link
                this.updateActiveLink(path);
                
                // Notify parent if in iframe
                this.notifyParentHeight();
                
            } catch (error) {
                console.error('Error loading route:', error);
                this.rootElement.innerHTML = `
                    <div class="error-message">
                        <h2>Error Loading Page</h2>
                        <p>There was an error loading the requested page. Please try again later.</p>
                        <a href="#/" class="button">Return Home</a>
                    </div>`;
            }
        }
    }
    
    updateActiveLink(currentPath) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href').replace('#', '');
            if ((currentPath === '/' && linkPath === '') || 
                (currentPath !== '/' && linkPath !== '' && currentPath.startsWith(linkPath))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    notifyParentHeight() {
        // Only run if we're inside an iframe
        if (window.self !== window.top) {
            const height = document.documentElement.scrollHeight;
            window.parent.postMessage({ 
                type: 'setHeight', 
                height: height 
            }, '*');
        }
    }
}

// Export the router for use in app.js
window.Router = Router;

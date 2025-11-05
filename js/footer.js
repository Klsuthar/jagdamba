// Footer loader function
async function loadFooter() {
    try {
        // Determine the correct path based on current location
        const currentPath = window.location.pathname;
        let footerPath = 'components/footer.html';
        
        // If we're in a subdirectory (pages/ or sections/), use relative path
        if (currentPath.includes('/pages/') || currentPath.includes('/sections/')) {
            footerPath = '../components/footer.html';
        }
        
        const response = await fetch(footerPath);
        const footerHTML = await response.text();
        
        // Find footer placeholder and replace with actual footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerHTML;
        }
    } catch (error) {
        console.error('Error loading footer:', error);
        // Fallback: insert footer directly if fetch fails
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = `
                <footer class="footer">
                    <p>Made by <a href="https://klsuthar.github.io/KanhaiyalalSuthar/" target="_blank">@kanhaiyalal</a></p>
                </footer>
            `;
        }
    }
}

// Load footer when DOM is ready
document.addEventListener('DOMContentLoaded', loadFooter);
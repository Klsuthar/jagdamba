// Footer loader function
async function loadFooter() {
    try {
        const response = await fetch('../components/footer.html');
        const footerHTML = await response.text();
        
        // Find footer placeholder and replace with actual footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = footerHTML;
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Load footer when DOM is ready
document.addEventListener('DOMContentLoaded', loadFooter);
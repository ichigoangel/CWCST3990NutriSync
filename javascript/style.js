// Scroll to top button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', function() {
    const progressbar = document.getElementById('progressbar');
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progressHeight = (window.pageYOffset / totalHeight) * 100;
    progressbar.style.height = progressHeight + '%';
    
    scrollToTopBtn.style.display = (window.pageYOffset > 300) ? 'block' : 'none';
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModePreference = localStorage.getItem('darkMode');
    const toggle = document.getElementById('toggle');
    
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-class');
        toggle.checked = true;
    }

    toggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-class');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-class');
            localStorage.removeItem('darkMode');
        }
    });
});
// app.js - Shared across all pages
function loadAndApplySettings() {
  const savedSettings = localStorage.getItem('appSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);

    // Dark Mode
    if (settings.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Font Size
    document.body.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    }[settings.fontSize];

    // High Contrast
    document.body.classList.toggle('contrast', settings.highContrast);

    // Reduced Motion
    if (settings.reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }

    // Apply language setting if needed
    if (settings.language) {
      document.documentElement.lang = settings.language;
    }
  }
}

// Apply settings when page loads
document.addEventListener('DOMContentLoaded', loadAndApplySettings);

// Listen for settings changes from other tabs
window.addEventListener('storage', function(event) {
  if (event.key === 'appSettings') {
    loadAndApplySettings();
  }
});
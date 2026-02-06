// PWA App JavaScript

let deferredPrompt;
let isInstalled = false;

// Check if app is installed
window.addEventListener('DOMContentLoaded', () => {
  checkInstallStatus();
  updateOnlineStatus();
  initializeApp();
});

// Initialize the application
function initializeApp() {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  }

  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });

  // Listen for app installed
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
    hideInstallBanner();
    updateInstallStatus(true);
  });

  // Online/offline status
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Install button click
  document.getElementById('installBtn').addEventListener('click', installApp);
  document.getElementById('dismissBtn').addEventListener('click', hideInstallBanner);

  // Iframe load event
  const iframe = document.getElementById('webAppFrame');
  const loading = document.getElementById('loading');
  
  loading.classList.add('show');
  
  iframe.addEventListener('load', () => {
    loading.classList.remove('show');
  });
}

// Show install banner
function showInstallBanner() {
  if (!isInstalled) {
    document.getElementById('installBanner').classList.add('show');
  }
}

// Hide install banner
function hideInstallBanner() {
  document.getElementById('installBanner').classList.remove('show');
}

// Install the PWA
async function installApp() {
  if (!deferredPrompt) {
    return;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to install prompt: ${outcome}`);
  
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }
  
  deferredPrompt = null;
  hideInstallBanner();
}

// Check if app is installed
function checkInstallStatus() {
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    isInstalled = true;
    updateInstallStatus(true);
  }
}

// Update install status display
function updateInstallStatus(installed) {
  const statusDot = document.getElementById('installStatus');
  const statusText = document.getElementById('installText');
  
  if (installed) {
    statusDot.style.background = '#34a853';
    statusText.textContent = 'Installed';
    isInstalled = true;
  } else {
    statusDot.style.background = '#fbbc04';
    statusText.textContent = 'Not Installed';
  }
}

// Update online status
function updateOnlineStatus() {
  const statusDot = document.getElementById('onlineStatus');
  const statusText = document.getElementById('onlineText');
  
  if (navigator.onLine) {
    statusDot.classList.remove('offline');
    statusText.textContent = 'Online';
  } else {
    statusDot.classList.add('offline');
    statusText.textContent = 'Offline';
  }
}

// Handle messages from iframe (if needed)
window.addEventListener('message', (event) => {
  // Verify origin for security
  if (event.origin === 'https://script.google.com') {
    console.log('Message from Google Apps Script:', event.data);
    // Handle the message data as needed
  }
});

// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted');
    }
  }
}

// Share functionality
async function shareContent(title, text, url) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: url
      });
      console.log('Shared successfully');
    } catch (error) {
      console.log('Error sharing:', error);
    }
  }
}

// Log PWA metrics
function logMetrics() {
  if ('performance' in window) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time:', pageLoadTime, 'ms');
  }
}

// Initialize metrics logging
window.addEventListener('load', logMetrics);

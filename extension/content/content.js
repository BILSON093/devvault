// DevVault Chrome Extension - Content Script
// This script runs on every page and extracts metadata for the extension.

(function () {
  // Extract page metadata
  function getPageMetadata() {
    const getMeta = (name) => {
      const el =
        document.querySelector(`meta[property="${name}"]`) ||
        document.querySelector(`meta[name="${name}"]`);
      return el?.content || '';
    };

    return {
      title: document.title || getMeta('og:title'),
      description: getMeta('og:description') || getMeta('description'),
      image: getMeta('og:image') || getMeta('twitter:image'),
      keywords: getMeta('keywords'),
      url: window.location.href,
      hostname: window.location.hostname,
    };
  }

  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageMetadata') {
      sendResponse(getPageMetadata());
    }
  });
})();

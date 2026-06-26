// DevVault Chrome Extension - Background Service Worker

const API_BASE = 'http://localhost:3000/api';

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-to-devvault',
    title: '📚 保存到 DevVault',
    contexts: ['page', 'link'],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'save-to-devvault') return;

  const url = info.linkUrl || info.pageUrl;
  const title = tab?.title || 'Untitled';

  // Store the URL info for popup to pick up
  await chrome.storage.local.set({
    pendingUrl: url,
    pendingTitle: title,
    pendingTime: Date.now(),
  });

  // Open popup
  chrome.action.openPopup();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'parseUrl') {
    handleParseUrl(request.url).then(sendResponse);
    return true; // Keep channel open for async response
  }

  if (request.action === 'saveResource') {
    handleSaveResource(request.data, request.token).then(sendResponse);
    return true;
  }

  if (request.action === 'getCollections') {
    handleGetCollections(request.token).then(sendResponse);
    return true;
  }

  if (request.action === 'getTags') {
    handleGetTags(request.token).then(sendResponse);
    return true;
  }
});

async function handleParseUrl(url) {
  try {
    const token = await getStoredToken();
    const response = await fetch(`${API_BASE}/parse/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function handleSaveResource(resourceData, token) {
  try {
    const response = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resourceData),
    });
    const data = await response.json();
    return { success: data.code === 0, data: data.data, message: data.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function handleGetCollections(token) {
  try {
    const response = await fetch(`${API_BASE}/collections?page=1&pageSize=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function handleGetTags(token) {
  try {
    const response = await fetch(`${API_BASE}/tags?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return { success: true, data: data.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function getStoredToken() {
  const result = await chrome.storage.local.get(['accessToken']);
  return result.accessToken;
}

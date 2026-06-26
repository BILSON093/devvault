// DevVault Chrome Extension - Popup Script

const API_BASE = 'http://localhost:3000/api';

// DOM Elements
const loginView = document.getElementById('login-view');
const mainView = document.getElementById('main-view');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const usernameEl = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');
const urlInput = document.getElementById('url-input');
const parseStatus = document.getElementById('parse-status');
const parsedResult = document.getElementById('parsed-result');
const previewCover = document.getElementById('preview-cover');
const previewTitle = document.getElementById('preview-title');
const previewDesc = document.getElementById('preview-desc');
const previewTags = document.getElementById('preview-tags');
const saveForm = document.getElementById('save-form');
const titleInput = document.getElementById('title-input');
const descInput = document.getElementById('desc-input');
const typeSelect = document.getElementById('type-select');
const tagSelector = document.getElementById('tag-selector');
const collectionSelect = document.getElementById('collection-select');
const saveBtn = document.getElementById('save-btn');
const saveStatus = document.getElementById('save-status');

let accessToken = null;
let selectedTags = new Set();
let allTags = [];
let parsedData = null;

// Initialize
async function init() {
  const stored = await chrome.storage.local.get(['accessToken', 'user']);
  if (stored.accessToken) {
    accessToken = stored.accessToken;
    showMainView(stored.user);
    loadCollections();
    loadTags();
    checkPendingUrl();
  } else {
    showLoginView();
  }
}

// Check for pending URL from context menu
async function checkPendingUrl() {
  const stored = await chrome.storage.local.get(['pendingUrl', 'pendingTitle', 'pendingTime']);
  if (stored.pendingUrl && stored.pendingTime && Date.now() - stored.pendingTime < 60000) {
    urlInput.value = stored.pendingUrl;
    parseUrl(stored.pendingUrl);
    await chrome.storage.local.remove(['pendingUrl', 'pendingTitle', 'pendingTime']);
  } else {
    // Auto-fill current tab URL
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url && tab.url.startsWith('http')) {
        urlInput.value = tab.url;
      }
    } catch {}
  }
}

// Views
function showLoginView() {
  loginView.style.display = 'block';
  mainView.style.display = 'none';
}

function showMainView(user) {
  loginView.style.display = 'none';
  mainView.style.display = 'block';
  if (user) usernameEl.textContent = user.username || user.email;
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.code === 0) {
      accessToken = data.data.accessToken;
      await chrome.storage.local.set({
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        user: data.data.user,
      });
      showMainView(data.data.user);
      loadCollections();
      loadTags();
      checkPendingUrl();
    } else {
      loginError.textContent = data.message || '登录失败';
    }
  } catch (err) {
    loginError.textContent = '网络错误，请确认后端服务已启动';
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.clear();
  accessToken = null;
  showLoginView();
});

// URL parsing
let parseTimeout;
urlInput.addEventListener('input', () => {
  clearTimeout(parseTimeout);
  const url = urlInput.value.trim();
  if (!url) {
    parsedResult.style.display = 'none';
    saveForm.style.display = 'none';
    return;
  }
  parseTimeout = setTimeout(() => parseUrl(url), 800);
});

async function parseUrl(url) {
  parseStatus.textContent = '正在解析...';
  parseStatus.className = 'status loading';

  try {
    const response = await fetch(`${API_BASE}/parse/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();

    if (data.code === 0 && data.data) {
      parsedData = data.data;
      showParsedResult(data.data);
      parseStatus.textContent = '✅ 解析成功';
      parseStatus.className = 'status success';
    } else {
      parseStatus.textContent = '⚠️ 解析失败，请手动填写';
      parseStatus.className = 'status error';
      showSaveForm(url);
    }
  } catch (err) {
    parseStatus.textContent = '⚠️ 网络错误，请手动填写';
    parseStatus.className = 'status error';
    showSaveForm(url);
  }
}

function showParsedResult(data) {
  parsedResult.style.display = 'block';
  saveForm.style.display = 'block';

  if (data.cover) {
    previewCover.src = data.cover;
    previewCover.style.display = 'block';
  } else {
    previewCover.style.display = 'none';
  }

  previewTitle.textContent = data.title;
  previewDesc.textContent = data.description || '';

  // Show suggested tags
  previewTags.innerHTML = '';
  if (data.suggestedTags) {
    data.suggestedTags.forEach((tagName) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = tagName;
      tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
        const existingTag = allTags.find((t) => t.name === tagName);
        if (existingTag) {
          if (selectedTags.has(existingTag.id)) {
            selectedTags.delete(existingTag.id);
          } else {
            selectedTags.add(existingTag.id);
          }
          renderTagSelector();
        }
      });
      previewTags.appendChild(tag);
    });
  }

  // Fill form
  titleInput.value = data.title || '';
  descInput.value = data.description || '';
  typeSelect.value = data.type || 'article';

  // Auto-select tags
  if (data.suggestedTags && allTags.length > 0) {
    allTags.forEach((tag) => {
      if (data.suggestedTags.includes(tag.name)) {
        selectedTags.add(tag.id);
      }
    });
    renderTagSelector();
  }
}

function showSaveForm(url) {
  parsedResult.style.display = 'none';
  saveForm.style.display = 'block';
  titleInput.value = '';
  descInput.value = '';
  typeSelect.value = 'article';
}

// Load collections
async function loadCollections() {
  try {
    const response = await fetch(`${API_BASE}/collections?page=1&pageSize=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    if (data.code === 0) {
      collectionSelect.innerHTML = '<option value="">不添加到收藏夹</option>';
      data.data.list.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        collectionSelect.appendChild(opt);
      });
    }
  } catch {}
}

// Load tags
async function loadTags() {
  try {
    const response = await fetch(`${API_BASE}/tags?limit=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    if (data.code === 0) {
      allTags = data.data;
      renderTagSelector();
    }
  } catch {}
}

function renderTagSelector() {
  tagSelector.innerHTML = '';
  allTags.forEach((tag) => {
    const el = document.createElement('span');
    el.className = 'tag' + (selectedTags.has(tag.id) ? ' selected' : '');
    el.textContent = tag.name;
    el.addEventListener('click', () => {
      if (selectedTags.has(tag.id)) {
        selectedTags.delete(tag.id);
      } else {
        selectedTags.add(tag.id);
      }
      renderTagSelector();
    });
    tagSelector.appendChild(el);
  });
}

// Save resource
saveForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  saveBtn.disabled = true;
  saveBtn.textContent = '保存中...';

  const resourceData = {
    title: titleInput.value,
    url: urlInput.value || undefined,
    description: descInput.value || undefined,
    type: typeSelect.value,
    tagIds: Array.from(selectedTags),
    isPublic: true,
  };

  // Add cover and source from parsed data
  if (parsedData) {
    resourceData.coverUrl = parsedData.cover;
    resourceData.source = parsedData.source;
  }

  try {
    const response = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(resourceData),
    });
    const data = await response.json();

    if (data.code === 0) {
      const resourceId = data.data.id;

      // Add to collection if selected
      const collectionId = collectionSelect.value;
      if (collectionId) {
        await fetch(`${API_BASE}/collections/${collectionId}/resources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ resourceId }),
        });
      }

      saveStatus.textContent = '✅ 保存成功！';
      saveStatus.className = 'status success';
      saveBtn.textContent = '✅ 已保存';

      // Close popup after 1.5s
      setTimeout(() => window.close(), 1500);
    } else {
      saveStatus.textContent = `❌ ${data.message}`;
      saveStatus.className = 'status error';
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 保存资源';
    }
  } catch (err) {
    saveStatus.textContent = '❌ 网络错误';
    saveStatus.className = 'status error';
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 保存资源';
  }
});

// Start
init();

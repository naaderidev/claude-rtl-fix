// Claude RTL Fix v2 - Firefox Edition - content.js

// ============================
// Inject فونت وزیرمتن
// ============================

function injectVazirFont() {
  if (document.getElementById('vazirmatn-rtl-font')) return;

  const baseUrl = browser.runtime.getURL('fonts/');

  const style = document.createElement('style');
  style.id = 'vazirmatn-rtl-font';
  style.textContent = `
    @font-face {
      font-family: 'Vazirmatn';
      src: url('${baseUrl}Vazirmatn-Regular.woff2') format('woff2');
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: 'Vazirmatn';
      src: url('${baseUrl}Vazirmatn-Medium.woff2') format('woff2');
      font-weight: 500;
      font-display: swap;
    }
    @font-face {
      font-family: 'Vazirmatn';
      src: url('${baseUrl}Vazirmatn-Bold.woff2') format('woff2');
      font-weight: 700;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

// ============================
// تشخیص فارسی
// ============================

const PERSIAN_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

function hasPersian(text) {
  return PERSIAN_REGEX.test(text);
}

function persianRatio(text) {
  const clean = text.replace(/\s+/g, '');
  if (clean.length === 0) return 0;
  const persianChars = (clean.match(/[\u0600-\u06FF]/g) || []).length;
  return persianChars / clean.length;
}

function isMostlyPersian(text) {
  if (text.trim().length < 4) return hasPersian(text);
  return persianRatio(text) > 0.15;
}

// ============================
// اعمال RTL
// ============================

function applyRTL(element) {
  if (!element || element.hasAttribute('data-rtl-fixed')) return;
  if (element.closest('pre') || element.tagName === 'PRE') return;
  if (element.tagName === 'CODE') return;

  const text = element.innerText || element.textContent || '';
  if (!text.trim()) return;

  if (isMostlyPersian(text)) {
    element.setAttribute('data-rtl-fixed', 'true');
    element.classList.add('claude-rtl-fixed');
    fixMixedDirectionChildren(element);
  }
}

function fixMixedDirectionChildren(element) {
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (hasPersian(text) && text.trim().length > 0) {
        const firstChar = text.trimStart()[0];
        if (firstChar && /[a-zA-Z0-9\(\[\{]/.test(firstChar)) {
          if (!text.startsWith('\u200F')) {
            node.textContent = '\u200F' + text;
          }
        }
      }
    }
  });
}

// ============================
// فیکس اینپوت
// ============================

function fixChatInput() {
  const selectors = [
    '[contenteditable="true"]',
    'textarea',
    '#prompt-textarea',
    '[data-testid="user-input"]',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.hasAttribute('data-rtl-input-fixed')) return;
      el.setAttribute('data-rtl-input-fixed', 'true');

      const updateDir = () => {
        const text = el.value || el.innerText || el.textContent || '';
        if (isMostlyPersian(text)) {
          el.classList.add('claude-rtl-input-fixed');
          el.style.direction = 'rtl';
          el.style.textAlign = 'right';
        } else {
          el.classList.remove('claude-rtl-input-fixed');
          el.style.direction = '';
          el.style.textAlign = '';
        }
      };

      el.addEventListener('input', updateDir);
      el.addEventListener('keyup', updateDir);
      updateDir();
    });
  });
}

// ============================
// پردازش کل صفحه
// ============================

function processAll() {
  const tags = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'td', 'th'];
  tags.forEach(tag => {
    document.querySelectorAll(tag).forEach(el => {
      if (el.closest('pre') || el.closest('code')) return;
      applyRTL(el);
    });
  });

  document.querySelectorAll('[data-testid="user-message"]').forEach(el => {
    applyRTL(el);
  });

  document.querySelectorAll('.prose > div, [class*="message"] > div').forEach(el => {
    if (el.closest('pre') || el.closest('code')) return;
    const directText = [...el.childNodes]
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent)
      .join('');
    if (directText.trim() && isMostlyPersian(directText)) {
      applyRTL(el);
    }
  });

  fixChatInput();
}

// ============================
// Observer
// ============================

let debounceTimer = null;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(processAll, 120);
});

// ============================
// شروع
// ============================

function init() {
  injectVazirFont();
  processAll();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// پیام از popup
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'getStatus') {
    return Promise.resolve({
      active: true,
      fixed: document.querySelectorAll('.claude-rtl-fixed').length
    });
  }
  if (message.action === 'reprocess') {
    document.querySelectorAll('[data-rtl-fixed]').forEach(el => {
      el.removeAttribute('data-rtl-fixed');
      el.classList.remove('claude-rtl-fixed');
    });
    document.querySelectorAll('[data-rtl-input-fixed]').forEach(el => {
      el.removeAttribute('data-rtl-input-fixed');
      el.classList.remove('claude-rtl-input-fixed');
    });
    processAll();
    return Promise.resolve({
      done: true,
      fixed: document.querySelectorAll('.claude-rtl-fixed').length
    });
  }
});

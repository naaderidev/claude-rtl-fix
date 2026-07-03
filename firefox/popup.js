// popup.js v2 - Firefox Edition
// Firefox از browser.* API استفاده می‌کند

async function getCurrentTab() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function updateStatus() {
  const tab = await getCurrentTab();
  const countEl = document.getElementById('fixedCount');
  const pill = document.getElementById('statusPill');
  const statusText = document.getElementById('statusText');
  const warning = document.getElementById('warningBanner');
  const features = document.getElementById('featuresSection');

  const isClaudeAI = tab?.url && tab.url.includes('claude.ai');

  if (!isClaudeAI) {
    countEl.textContent = '—';
    pill.classList.add('inactive');
    statusText.textContent = 'غیرفعال';
    warning.style.display = 'flex';
    features.style.display = 'none';
    return;
  }

  warning.style.display = 'none';
  features.style.display = 'block';
  pill.classList.remove('inactive');
  statusText.textContent = 'فعال';

  try {
    const response = await browser.tabs.sendMessage(tab.id, { action: 'getStatus' });
    if (response) {
      countEl.textContent = response.fixed ?? 0;
    }
  } catch {
    countEl.textContent = '0';
  }
}

document.getElementById('reprocessBtn').addEventListener('click', async () => {
  const tab = await getCurrentTab();
  if (!tab?.url?.includes('claude.ai')) return;

  const btn = document.getElementById('reprocessBtn');
  const icon = document.getElementById('btnIcon');
  const text = document.getElementById('btnText');

  btn.disabled = true;
  icon.textContent = '⏳';
  text.textContent = 'در حال اعمال...';

  try {
    const res = await browser.tabs.sendMessage(tab.id, { action: 'reprocess' });
    icon.textContent = '✅';
    text.textContent = `${res?.fixed ?? '?'} المان اصلاح شد`;
    document.getElementById('fixedCount').textContent = res?.fixed ?? '?';

    setTimeout(() => {
      icon.textContent = '🔄';
      text.textContent = 'اعمال مجدد RTL';
      btn.disabled = false;
    }, 2000);
  } catch {
    icon.textContent = '❌';
    text.textContent = 'خطا — صفحه را رفرش کنید';
    setTimeout(() => {
      icon.textContent = '🔄';
      text.textContent = 'اعمال مجدد RTL';
      btn.disabled = false;
    }, 2500);
  }
});

updateStatus();

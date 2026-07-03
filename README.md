# Claude RTL Fix

> A browser extension that makes Persian text on [Claude.ai](https://claude.ai) actually readable — right-to-left aligned, properly rendered, and displayed in the beautiful **Vazirmatn** font.

If you've ever tried chatting with Claude in Persian and ended up with a jumbled mess of left-aligned text, mixed directions, and unreadable sentences — this extension is for you.

Available for both **Google Chrome** and **Mozilla Firefox**.

---

## ✨ Features

- **RTL layout** — Persian messages are displayed right-to-left, as they should be
- **Mixed text support** — Sentences that start with an English word but contain Persian are handled correctly
- **Vazirmatn font** — A free, open-source Persian font bundled directly in the extension (no internet required)
- **Code blocks stay LTR** — Code snippets are never touched
- **Chat input detection** — The message box also switches to RTL automatically when you type in Persian
- **Live counter** — The popup shows how many elements have been fixed on the current page
- **Works offline** — Fonts are embedded, no external requests needed

---

## 🟡 Installation — Google Chrome

### Step 1 — Download

Click the green **Code** button on this page → **Download ZIP**, then extract it. You'll get a folder called `claude-rtl-fix-main`.

### Step 2 — Open Chrome Extensions

Type this in your Chrome address bar and press Enter:

```
chrome://extensions
```

### Step 3 — Enable Developer Mode

In the top-right corner of the Extensions page, toggle on **Developer mode**.

### Step 4 — Load the Extension

Click **"Load unpacked"** → navigate into the downloaded folder → select the **`chrome`** folder (not the zip, not the root folder — the `chrome` subfolder).

### Step 5 — Done ✅

Open [claude.ai](https://claude.ai) and start a conversation in Persian. The text should now be right-aligned and displayed in Vazirmatn font.

> 💡 The extension icon appears in your toolbar. Click it to see how many elements have been fixed, or to manually re-apply RTL if needed.

---

## 🟠 Installation — Mozilla Firefox

Firefox installation is slightly different because Firefox requires extensions to be signed for permanent installation. The easiest way is to load it temporarily for testing.

### Step 1 — Download

Same as Chrome — download the ZIP and extract it.

### Step 2 — Open Firefox Debugging

Type this in your Firefox address bar and press Enter:

```
about:debugging
```

### Step 3 — Select "This Firefox"

In the left sidebar, click **"This Firefox"**.

### Step 4 — Load the Extension

Click **"Load Temporary Add-on..."** → navigate into the extracted folder → open the **`firefox`** subfolder → select the **`manifest.json`** file.

### Step 5 — Done ✅

Open [claude.ai](https://claude.ai) — the extension is now active.

> ⚠️ **Important:** Temporary add-ons are removed when Firefox is closed. You'll need to reload it each time via `about:debugging`. For a permanent installation, the extension would need to be submitted to [addons.mozilla.org](https://addons.mozilla.org) and signed by Mozilla.

---

## 🔄 How to Use the Popup

Click the extension icon in your browser toolbar to open the popup panel:

| Element | Description |
|---|---|
| 🟢 Status indicator | Shows whether the extension is active on the current tab |
| Number counter | How many Persian elements have been fixed on the page |
| **Re-apply RTL** button | Manually re-scans the page — useful after long conversations where new messages might not be caught automatically |

> If you open the popup on a page that is **not** claude.ai, the status will show as inactive and a warning will appear.

---

## ⚙️ How It Works

1. A **content script** runs automatically when you visit `claude.ai`
2. It scans all text elements (paragraphs, list items, headings, etc.)
3. Any element where more than ~15% of characters are Persian/Arabic script gets tagged with `dir="rtl"` and the `Vazirmatn` font
4. For mixed sentences (e.g. starting with an English word but containing Persian), a **Right-to-Left Mark** (`\u200F`) character is prepended to force correct rendering
5. A **MutationObserver** watches for new messages as the conversation grows, so newly loaded content is handled automatically
6. Code blocks (`<pre>`, `<code>`) are always skipped and remain LTR

---

## 🔤 Font

This extension bundles **[Vazirmatn](https://github.com/rastikerdar/vazirmatn)** — a free, open-source Persian font created by [Saber Rastikerdar](https://github.com/rastikerdar). It is licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL).

The font is included in three weights: Regular (400), Medium (500), and Bold (700).

---

## 🛠️ Troubleshooting

**Persian text still looks wrong after installing**
→ Refresh the `claude.ai` tab after installing the extension. Content scripts only inject into tabs that are opened after the extension is loaded.

**Some messages aren't fixed**
→ Open the extension popup and click **"Re-apply RTL"**. This rescans the entire page.

**The extension popup says "Inactive"**
→ You're not on `claude.ai`. Navigate to [claude.ai](https://claude.ai) first.

**Firefox: extension disappeared after restart**
→ This is expected for temporary add-ons. Re-load it via `about:debugging → This Firefox → Load Temporary Add-on`.

**Font doesn't load / text shows in Tahoma**
→ Make sure you selected the correct subfolder (`chrome` or `firefox`) when loading the extension. The fonts folder must be inside the loaded folder.

---

## 🤝 Contributing

Pull requests are welcome. If Claude.ai updates its HTML structure and the selectors break, feel free to open an issue or submit a fix to `content.js`.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ by **Bahar** and **Claude**

*Two unlikely collaborators who got tired of unreadable Persian text.*

</div>

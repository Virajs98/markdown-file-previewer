const starterMarkdown = `# Markdown File Previewer

Upload a single Markdown file to replace this example.

## What it does

- Reads one .md file from your computer
- Shows the raw Markdown on the left
- Renders the preview on the right
- Lets you edit the text after upload

## Example table

| Item | Status |
| --- | --- |
| Upload | Ready |
| Preview | Live |
| Deploy | Static |

> The preview is sanitised before rendering.

\`\`\`js
console.log("Markdown preview is ready");
\`\`\`
`;

const markdownInput = document.querySelector("#markdown-input");
const markdownPreview = document.querySelector("#markdown-preview");
const fileInput = document.querySelector("#markdown-file");
const uploadZone = document.querySelector(".upload-zone");
const fileNameLabel = document.querySelector("#file-name");
const fileSizeLabel = document.querySelector("#file-size");
const statusMessage = document.querySelector("#status-message");
const clearButton = document.querySelector("#clear-button");
const fullscreenButton = document.querySelector("#fullscreen-toggle");
const pageShell = document.querySelector(".page-shell");
const sourcePanelTitle = document.querySelector("#source-panel-title");
const previewPanelTitle = document.querySelector("#preview-panel-title");
const previewHint = document.querySelector("#preview-hint");

let currentMode = "markdown";

function formatFileSize(byteLength) {
  if (!Number.isFinite(byteLength) || byteLength <= 0) {
    return "0 KB";
  }

  if (byteLength < 1024) {
    return `${byteLength} B`;
  }

  return `${(byteLength / 1024).toFixed(1)} KB`;
}

function updateFileMeta(name, size) {
  fileNameLabel.textContent = name || "No file selected";
  fileSizeLabel.textContent = formatFileSize(size);
}

function renderMarkdown(markdownText) {
  const unsafeHtml = marked.parse(markdownText, {
    gfm: true,
    breaks: true,
  });

  markdownPreview.innerHTML = DOMPurify.sanitize(unsafeHtml);
}

function setEditorContent(markdownText) {
  markdownInput.value = markdownText;
  renderMarkdown(markdownText);
}

function setStatus(message) {
  statusMessage.textContent = message;
}

// ── XML ────────────────────────────────────────────────────────────────────────────────
// pendingNodes stores { type: "xml", node } or { type: "text", content } keyed by uid.
// Children are built into the DOM only when the user first expands a node.
const pendingNodes = new Map();

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Render one XML DOM node. lazy=true → emit a collapsed stub and defer children.
function xmlNodeToHtml(node, lazy) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    return text ? `<span class="xml-text">${escapeHtml(text)}</span>` : "";
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    return `<div class="xml-node xml-comment">&lt;!-- ${escapeHtml(node.textContent.trim())} --&gt;</div>`;
  }
  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    return `<div class="xml-node xml-pi">&lt;?${escapeHtml(node.nodeName)} ${escapeHtml(node.nodeValue)}?&gt;</div>`;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const tag = escapeHtml(node.tagName);
  let attrsHtml = "";
  for (const attr of node.attributes) {
    attrsHtml += ` <span class="xml-attr-name">${escapeHtml(attr.name)}</span>=<span class="xml-attr-value">"${escapeHtml(attr.value)}"</span>`;
  }

  if (!node.hasChildNodes()) {
    return `<div class="xml-node"><span class="xml-open-tag">&lt;${tag}${attrsHtml} /&gt;</span></div>`;
  }

  const kids = Array.from(node.childNodes);
  const onlyText = kids.length === 1 && kids[0].nodeType === Node.TEXT_NODE;
  if (onlyText) {
    const txt = escapeHtml(kids[0].textContent.trim());
    return `<div class="xml-node"><span class="xml-open-tag">&lt;${tag}${attrsHtml}&gt;</span><span class="xml-text">${txt}</span><span class="xml-close-tag">&lt;/${tag}&gt;</span></div>`;
  }

  const uid = "x" + Math.random().toString(36).slice(2, 9);

  // Lazy stub: empty children div, built on first expand
  if (lazy) {
    pendingNodes.set(uid, { type: "xml", node });
    return `<div class="xml-node">
      <button class="xml-toggle xml-lazy" data-target="${uid}" aria-expanded="false">►</button>
      <span class="xml-open-tag">&lt;${tag}${attrsHtml}&gt;</span>
      <div class="xml-children xml-collapsed" id="${uid}"></div>
      <span class="xml-close-tag">&lt;/${tag}&gt;</span>
    </div>`;
  }

  // Non-lazy: render direct children but make each of them lazy
  let childrenHtml = "";
  for (const child of node.childNodes) {
    childrenHtml += xmlNodeToHtml(child, true);
  }
  return `<div class="xml-node">
    <button class="xml-toggle" data-target="${uid}" aria-expanded="true">▼</button>
    <span class="xml-open-tag">&lt;${tag}${attrsHtml}&gt;</span>
    <div class="xml-children" id="${uid}">${childrenHtml}</div>
    <span class="xml-close-tag">&lt;/${tag}&gt;</span>
  </div>`;
}

// ── Text-section viewer (fallback for repomix / non-strict XML) ──────────────
// Parses line-by-line, finds <tag>…</tag> blocks at the current indent depth.
function parseTextSections(text) {
  const lines = text.split("\n");
  const result = [];
  let i = 0;
  let preamble = "";

  while (i < lines.length) {
    const m = lines[i].trim().match(/^<([A-Za-z_][A-Za-z0-9_:-]*)(\s[^>]*)?>$/);
    if (m) {
      if (preamble.trim()) {
        result.push({ type: "text", content: preamble });
        preamble = "";
      }
      const tag = m[1];
      const attrs = m[2] || "";
      let depth = 1;
      let j = i + 1;
      const body = [];
      while (j < lines.length && depth > 0) {
        const trimmed = lines[j].trim();
        if (new RegExp(`^<${tag}(\\s[^>]*)?>$`).test(trimmed)) depth++;
        if (trimmed === `</${tag}>`) depth--;
        if (depth > 0) body.push(lines[j]);
        j++;
      }
      result.push({ type: "tag", tag, attrs, content: body.join("\n") });
      i = j;
    } else {
      preamble += lines[i] + "\n";
      i++;
    }
  }
  if (preamble.trim()) result.push({ type: "text", content: preamble });
  return result;
}

function renderTextSections(sections) {
  let html = "";
  for (const s of sections) {
    if (s.type === "text") {
      const t = s.content.trim();
      if (t) html += `<div class="repomix-preamble">${escapeHtml(t)}</div>`;
    } else {
      const uid = "x" + Math.random().toString(36).slice(2, 9);
      pendingNodes.set(uid, { type: "text", content: s.content });
      html += `<div class="xml-node">
        <button class="xml-toggle xml-lazy" data-target="${uid}" aria-expanded="false">►</button>
        <span class="xml-open-tag">&lt;${escapeHtml(s.tag)}${escapeHtml(s.attrs)}&gt;</span>
        <div class="xml-children xml-collapsed" id="${uid}"></div>
        <span class="xml-close-tag">&lt;/${escapeHtml(s.tag)}&gt;</span>
      </div>`;
    }
  }
  return html;
}

function renderXml(xmlText) {
  pendingNodes.clear();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");

  if (!doc.querySelector("parsererror")) {
    // Valid XML: show root expanded, all deeper nodes lazy
    let treeHtml = "";
    for (const child of doc.childNodes) {
      treeHtml += xmlNodeToHtml(child, false);
    }
    markdownPreview.innerHTML = `<div class="xml-tree">${treeHtml}</div>`;
    return;
  }

  // Fallback: line-based section viewer for repomix-style files
  const sections = parseTextSections(xmlText);
  markdownPreview.innerHTML = `<div class="xml-tree">${renderTextSections(sections)}</div>`;
}

markdownPreview.addEventListener("click", (event) => {
  const toggle = event.target.closest(".xml-toggle");
  if (!toggle) return;
  const childrenEl = document.getElementById(toggle.dataset.target);
  if (!childrenEl) return;

  // On first expand of a lazy node: build its children now
  if (toggle.classList.contains("xml-lazy") && childrenEl.innerHTML === "") {
    const pending = pendingNodes.get(toggle.dataset.target);
    if (pending) {
      if (pending.type === "xml") {
        let html = "";
        for (const child of pending.node.childNodes) {
          html += xmlNodeToHtml(child, true);
        }
        childrenEl.innerHTML = html;
      } else if (pending.type === "text") {
        const subSections = parseTextSections(pending.content);
        const hasTags = subSections.some((s) => s.type === "tag");
        childrenEl.innerHTML = hasTags
          ? renderTextSections(subSections)
          : `<pre class="repomix-content">${escapeHtml(pending.content)}</pre>`;
      }
      pendingNodes.delete(toggle.dataset.target);
      toggle.classList.remove("xml-lazy");
    }
  }

  const collapsed = childrenEl.classList.toggle("xml-collapsed");
  toggle.textContent = collapsed ? "►" : "▼";
  toggle.setAttribute("aria-expanded", String(!collapsed));
});

// ── Mode switching ───────────────────────────────────────────────────────────────────

function setMode(mode) {
  currentMode = mode;
  if (mode === "xml") {
    sourcePanelTitle.textContent = "Raw XML";
    previewPanelTitle.textContent = "XML Tree";
    previewHint.textContent = "Collapsible tree — click ▼ to expand/collapse";
    markdownInput.readOnly = true;
    markdownPreview.classList.add("xml-mode");
  } else {
    sourcePanelTitle.textContent = "Markdown Source";
    previewPanelTitle.textContent = "Preview";
    previewHint.textContent = "Sanitised HTML output";
    markdownInput.readOnly = false;
    markdownPreview.classList.remove("xml-mode");
  }
}

// ── File loading ───────────────────────────────────────────────────────────────────

async function loadFile(file) {
  if (!file) return;
  const isMarkdown = /\.(md|markdown)$/i.test(file.name) || file.type.includes("markdown");
  const isXml = /\.xml$/i.test(file.name) || file.type === "text/xml" || file.type === "application/xml";

  if (!isMarkdown && !isXml) {
    setStatus("Please choose a .md or .xml file.");
    return;
  }

  const content = await file.text();
  updateFileMeta(file.name, file.size);

  if (isXml) {
    setMode("xml");
    // Show the tree immediately; load raw text into textarea after paint
    markdownInput.value = "Loading raw content…";
    setStatus(`Parsing ${file.name}…`);
    renderXml(content);
    setTimeout(() => {
      markdownInput.value = content;
      setStatus(`Loaded ${file.name}. Expand ► sections in the tree to browse all details.`);
    }, 0);
  } else {
    setMode("markdown");
    setEditorContent(content);
    setStatus(`Loaded ${file.name}. You can edit the text and the preview updates live.`);
  }
}

function handleFileSelection(fileList) {
  if (!fileList || fileList.length === 0) return;
  const selectedFile = fileList[0];
  if (fileList.length > 1) {
    setStatus(`Multiple files dropped. Using only ${selectedFile.name}.`);
  }
  loadFile(selectedFile).catch(() => setStatus("The selected file could not be read."));
}

markdownInput.addEventListener("input", (event) => {
  if (currentMode === "markdown") {
    renderMarkdown(event.target.value);
  }
});

fileInput.addEventListener("change", (event) => {
  handleFileSelection(event.target.files);
});

clearButton.addEventListener("click", () => {
  fileInput.value = "";
  updateFileMeta("No file selected", 0);
  setMode("markdown");
  setEditorContent(starterMarkdown);
  setStatus("Reset to the starter example.");
});

["dragenter", "dragover"].forEach((eventName) => {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.add("drag-active");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.remove("drag-active");
  });
});

uploadZone.addEventListener("drop", (event) => {
  handleFileSelection(event.dataTransfer.files);
});

fullscreenButton.addEventListener("click", () => {
  pageShell.classList.toggle("fullscreen-mode");
  fullscreenButton.setAttribute("aria-pressed", pageShell.classList.contains("fullscreen-mode"));
});

// Preview panel expand / fullscreen
const previewExpandBtn = document.querySelector("#preview-expand");
const previewPanel = document.querySelector(".preview-panel");

function setPreviewExpanded(expanded) {
  previewPanel.classList.toggle("preview-expanded", expanded);
  previewExpandBtn.setAttribute("aria-pressed", expanded);
  previewExpandBtn.textContent = expanded ? "⤡" : "⤢";
  previewExpandBtn.title = expanded ? "Exit fullscreen (Esc)" : "Expand preview fullscreen (Esc to exit)";
}

previewExpandBtn.addEventListener("click", () => {
  setPreviewExpanded(!previewPanel.classList.contains("preview-expanded"));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && previewPanel.classList.contains("preview-expanded")) {
    setPreviewExpanded(false);
  }
});

updateFileMeta("No file selected", 0);
setEditorContent(starterMarkdown);
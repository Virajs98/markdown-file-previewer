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

async function loadMarkdownFile(file) {
  if (!file) {
    return;
  }

  const isMarkdownLike = /\.(md|markdown)$/i.test(file.name) || file.type.includes("markdown");

  if (!isMarkdownLike) {
    setStatus("That file does not look like Markdown. Please choose a .md file.");
    return;
  }

  const content = await file.text();
  updateFileMeta(file.name, file.size);
  setEditorContent(content);
  setStatus(`Loaded ${file.name}. You can edit the text and the preview updates live.`);
}

function handleFileSelection(fileList) {
  if (!fileList || fileList.length === 0) {
    return;
  }

  const selectedFile = fileList[0];

  if (fileList.length > 1) {
    setStatus(`Multiple files were dropped. Using only ${selectedFile.name}.`);
  }

  loadMarkdownFile(selectedFile).catch(() => {
    setStatus("The selected file could not be read.");
  });
}

markdownInput.addEventListener("input", (event) => {
  renderMarkdown(event.target.value);
});

fileInput.addEventListener("change", (event) => {
  handleFileSelection(event.target.files);
});

clearButton.addEventListener("click", () => {
  fileInput.value = "";
  updateFileMeta("No file selected", 0);
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

updateFileMeta("No file selected", 0);
setEditorContent(starterMarkdown);
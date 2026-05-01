# Markdown File Previewer

This project is a lightweight static Markdown previewer. You upload one `.md` file, see the raw source on the left, and the rendered preview on the right.

## Why this approach

- No React or framework runtime
- No build step required
- Easy to deploy on any static host
- Works by simply opening `index.html` in a browser

## Files

- `index.html` sets up the page structure
- `styles.css` provides the responsive UI
- `app.js` handles file upload, live editing, and Markdown rendering

## How to use it

1. Open `index.html` in your browser.
2. Upload a single Markdown file using the upload area.
3. Edit the text in the left panel if needed.
4. Read the rendered output in the right panel.

## Deploy

Because this is a static app, you can deploy it directly to services like Netlify, Vercel, GitHub Pages, or any basic web server by publishing these files:

- `index.html`
- `styles.css`
- `app.js`

No server code is required.

## Notes

- The preview uses `marked` to convert Markdown to HTML.
- The rendered HTML is sanitised with `DOMPurify` before being inserted into the page.
- The Markdown libraries are loaded from CDN, which keeps this project small and easy to deploy.
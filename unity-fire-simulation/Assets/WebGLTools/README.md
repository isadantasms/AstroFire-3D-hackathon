# Standalone WebGL preview

SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).

Requires Python 3, not the Unity Editor. Copy StartWebGL.cmd and serve_webgl.py into the export folder, beside index.html (with Build and TemplateData preserved). Double-click StartWebGL.cmd: it automatically serves that index.html and opens the browser, with no file picker. Brotli/gzip files are served with the required Content-Encoding and WebAssembly MIME headers. Leave the terminal open while using the app; Ctrl+C stops it.

Alternatively: `python serve_webgl.py "C:\path\to\export" --port 8000`.

Keep index.html, Build and TemplateData together. No rebuild or compression change is required for the existing export. This server is for local previews only and binds to loopback. To share publicly, upload the export to a web host configured for Unity compression; recipients then need only a browser. External embeds/resources may require separate cross-origin settings.

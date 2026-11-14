# WebGL local launcher

SI-assisted: generated with Codex, reviewed and aligned by Esquivel & Elias — `[PROJECT_NAME]`.

Unity WebGL builds use `fetch`, WebAssembly, and optional Brotli/Gzip files, so opening `index.html` with `file://` fails in modern browsers.

## Quick Start (Windows & Linux)

- **Windows:** Double-click `StartWebGL.cmd` in this folder (or run `StartWebGL.cmd` in Command Prompt / PowerShell).
- **Linux / macOS:** Run `./StartWebGL.cmd` or:
  ```bash
  python3 serve_webgl.py index.html --port 8080
  ```

By default, the local server starts at `http://127.0.0.1:8080/index.html` and also integrates directly inside the `[PROJECT_NAME]` 3-Column Simulator Console (`http://localhost:5173/simulator`).

#!/usr/bin/env python3
# SI-assisted: generated with Codex, reviewed and aligned by Esquivel & Elias — [PROJECT_NAME]
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import mimetypes
from pathlib import Path
import urllib.parse
import webbrowser


class UnityWebGLHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
        ".js": "application/javascript",
        ".json": "application/json",
        ".data": "application/octet-stream",
        ".symbols.json": "application/octet-stream",
    }

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cross-Origin-Resource-Policy", "cross-origin")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def guess_type(self, path):
        if path.endswith((".br", ".gz")):
            path = path[:-3]
        if path.endswith(".symbols.json"):
            return "application/octet-stream"
        return mimetypes.guess_type(path)[0] or self.extensions_map.get(Path(path).suffix, "application/octet-stream")

    def send_head(self):
        local_path = Path(self.translate_path(self.path))
        if local_path.suffix == ".br":
            self.send_response(200)
            self.send_header("Content-Type", self.guess_type(local_path.name))
            self.send_header("Content-Encoding", "br")
            self.send_header("Content-Length", str(local_path.stat().st_size))
            self.end_headers()
            return local_path.open("rb")
        if local_path.suffix == ".gz":
            self.send_response(200)
            self.send_header("Content-Type", self.guess_type(local_path.name))
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Content-Length", str(local_path.stat().st_size))
            self.end_headers()
            return local_path.open("rb")
        return super().send_head()


def resolve_target(raw_target):
    target = Path(raw_target).expanduser().resolve()
    if target.is_file():
        return target.parent, target.name
    index = target / "index.html"
    if index.is_file():
        return target, index.name
    raise SystemExit(f"Could not find index.html in: {target}")


def main():
    parser = argparse.ArgumentParser(description="Serve a Unity WebGL export.")
    parser.add_argument("target", nargs="?", default=".", help="Export folder or index.html path.")
    parser.add_argument("--port", type=int, default=8080, help="Port number (default: 8080; falls back to free port if busy).")
    parser.add_argument("--no-browser", action="store_true", help="Do not open the default browser.")
    args = parser.parse_args()

    root, entry = resolve_target(args.target)
    handler = partial(UnityWebGLHandler, directory=str(root))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    except OSError:
        server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    url = f"http://127.0.0.1:{server.server_port}/{urllib.parse.quote(entry)}"
    print(f"Serving WebGL build at {url}")
    print("Press Ctrl+C to stop.")
    if not args.no_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

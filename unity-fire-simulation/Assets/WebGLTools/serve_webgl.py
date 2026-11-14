"""SI-assisted: generated with Codex; pending human review.
Serve a Unity WebGL export on localhost without the Unity Editor.
"""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


class UnityHandler(SimpleHTTPRequestHandler):
    def send_response(self, code, message=None):
        self.response_code = code
        super().send_response(code, message)

    def guess_type(self, path):
        uncompressed = str(path)
        for extension in (".br", ".gz"):
            if uncompressed.endswith(extension):
                uncompressed = uncompressed[:-len(extension)]
                break
        if uncompressed.endswith(".wasm"):
            return "application/wasm"
        if uncompressed.endswith(".js"):
            return "application/javascript"
        if uncompressed.endswith((".data", ".unityweb")):
            return "application/octet-stream"
        return super().guess_type(uncompressed)

    def end_headers(self):
        # Only mark successful file responses as compressed, never an HTML error page.
        if getattr(self, "response_code", 0) in (200, 304):
            path = self.translate_path(self.path)
            if path.endswith(".br"):
                self.send_header("Content-Encoding", "br")
            elif path.endswith(".gz"):
                self.send_header("Content-Encoding", "gzip")
        self.send_header("Cache-Control", "no-store")
        # Allows builds using SharedArrayBuffer to run on localhost as well.
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("build", nargs="?", help="Export folder or index.html path")
    parser.add_argument("--port", type=int, default=0, help="0 selects a free port")
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    selected = args.build
    if not selected:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()
        selected = filedialog.askopenfilename(title="Select the Unity WebGL export index.html", filetypes=[("HTML", "*.html")])
        root.destroy()
        if not selected:
            return
    directory = Path(selected).expanduser().resolve()
    if directory.is_file():
        directory = directory.parent
    if not (directory / "index.html").is_file():
        parser.error("The selected folder must contain index.html.")
    handler = partial(UnityHandler, directory=str(directory))
    with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
        url = f"http://localhost:{server.server_port}/"
        print(f"Serving: {directory}\nOpen: {url}\nKeep this window open. Press Ctrl+C to stop.", flush=True)
        if not args.no_browser:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()

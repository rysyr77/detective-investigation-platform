#!/usr/bin/env python3
"""Local server for Detective Investigation Platform.
Run: python3 server.py
Then open: http://127.0.0.1:8000
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

class AppHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "":
            self.path = "/static/index.html"
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        print(f"[server] {self.address_string()} - {fmt % args}")

if __name__ == "__main__":
    host, port = "127.0.0.1", 8000
    print(f"Detective Investigation Platform running at http://{host}:{port}")
    print("Press Ctrl+C to stop.")
    ThreadingHTTPServer((host, port), AppHandler).serve_forever()

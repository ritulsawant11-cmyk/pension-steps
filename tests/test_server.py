#!/usr/bin/env python3
"""
Test HTTP server serving PensionSteps assets
"""

import http.server
import socketserver
import threading
import urllib.request
import os
import time
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PORT = 8092

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

def test_server():
    socketserver.TCPServer.allow_reuse_address = True
    server = socketserver.TCPServer(("", PORT), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    time.sleep(0.5)

    endpoints = [
        ('/', 200, 'PensionSteps'),
        ('/index.html', 200, '<div id="root">'),
        ('/app.js', 200, 'PensionSteps'),
        ('/src/styles/main.css', 200, '--color-teal'),
        ('/src/styles/print.css', 200, '@media print'),
    ]

    all_passed = True
    print(f"Testing local HTTP server at http://localhost:{PORT}...")
    for path, expected_status, content_snippet in endpoints:
        url = f"http://localhost:{PORT}{path}"
        try:
            req = urllib.request.urlopen(url)
            status = req.getcode()
            body = req.read().decode('utf-8')
            if status == expected_status and content_snippet in body:
                print(f"  [PASS] GET {path} -> {status} (found '{content_snippet}')")
            else:
                print(f"  [FAIL] GET {path} -> status: {status}, snippet found: {content_snippet in body}")
                all_passed = False
        except Exception as e:
            print(f"  [ERROR] GET {path} failed: {e}")
            all_passed = False

    server.shutdown()
    server.server_close()

    if not all_passed:
        sys.exit(1)
    print("HTTP Server test passed successfully.")

if __name__ == '__main__':
    test_server()

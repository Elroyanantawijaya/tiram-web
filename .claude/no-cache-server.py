#!/usr/bin/env python3
# Server statis untuk verifikasi lokal: sama seperti `python -m http.server`,
# tapi memaksa Cache-Control: no-store supaya browser tidak pernah menyajikan
# JS/CSS lama dari cache saat berkas berubah pertengahan sesi.
import http.server
import sys

class TanpaCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    http.server.test(HandlerClass=TanpaCache, port=port)

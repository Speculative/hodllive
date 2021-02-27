from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        return super(NoCacheRequestHandler, self).end_headers()


httpd = HTTPServer(("localhost", 8000), NoCacheRequestHandler)
print("Now running on localhost:8000")
httpd.serve_forever()

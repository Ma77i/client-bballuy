import http from 'node:http';

// Local-only gallery host. Metro supplies the real React Native Web components.
const metroPort = Number(process.argv[2] ?? 8093);
const previewPort = Number(process.argv[3] ?? 8193);
const entry = process.argv[4] ?? 'FoundationPreview';
if (!['FoundationPreview', 'DiscoveryPreview'].includes(entry)) throw new Error('Invalid preview entry');
if (![metroPort, previewPort].every(port => Number.isInteger(port) && port >= 1024 && port <= 65535)) throw new Error('Invalid local port');
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>bballuy · ${entry}</title><style>html,body,#root{height:100%;margin:0;background:#0C1220}#root{display:flex;flex-direction:column}</style><div id="root"></div><script src="http://localhost:${metroPort}/tests/fixtures/${entry}.bundle?platform=web&dev=false&minify=false&hot=false"></script></html>`;
http.createServer((request, response) => {
  if (request.url?.startsWith('/assets/')) {
    const upstream = http.get(`http://localhost:${metroPort}${request.url}`, result => {
      response.writeHead(result.statusCode ?? 502, result.headers); result.pipe(response);
    });
    upstream.on('error', () => { response.writeHead(502); response.end('Local asset unavailable'); });
    return;
  }
  if (request.url !== '/') { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(html);
}).listen(previewPort, '127.0.0.1', () => console.log(`Foundation preview: http://127.0.0.1:${previewPort} (Metro ${metroPort})`));


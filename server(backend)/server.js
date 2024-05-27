const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

// Funktion zum Senden von 404-Fehlern
const send404 = (res) => {
    res.statusCode = 404;
    res.end('Not Found');
};

// Funktion zum Senden von 500-Fehlern
const send500 = (res, err) => {
    res.statusCode = 500;
    res.end('Internal Server Error');
    console.log(err);
};

const server = http.createServer((req, res) => {
    const reqPath = req.url === '/' ? '/index.html' : req.url;

    const extname = String(path.extname(reqPath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';
    const filePath = path.join(__dirname, '..', 'client(frontend)', reqPath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                send404(res);
            } else {
                send500(res, err);
            }
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.end(data, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


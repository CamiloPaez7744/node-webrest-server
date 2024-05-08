import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  console.log(req.url);
  const htmlFile = fs.readFileSync('./public/index.html', 'utf8');
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end( htmlFile);
    return;
  }
  
  if (req.url?.includes('.css')) {
    const cssFile = fs.readFileSync(`./public${req.url}`, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/css' }); 
    res.end(cssFile);
    return;
  }
 
});

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
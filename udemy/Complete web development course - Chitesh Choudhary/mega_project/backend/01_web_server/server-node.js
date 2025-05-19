import * as http from "node:http";

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Hello World\n");
    } else if (req.url === "/ice-tea") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Iced Tea\n");
    } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not Found\n");
    }
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}`);
});

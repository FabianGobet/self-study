import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";

const port = 3000;

const server = http.createServer((req, res) => {
    const filepath = path.join(
        __dirname,
        req.url === "/" ? "index.html" : req.url
    );
    const extName = String(path.extname(filepath).toLocaleLowerCase());

    const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".png": "image/png",
    };

    const contentType = mimeTypes[extName] || "application/octet-stream";

    fs.readFile(filepath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 Not Found Bruh</h1>", "utf-8");
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

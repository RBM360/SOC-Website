import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = process.cwd();
const startPort = Number.parseInt(process.env.PORT || "5173", 10);
const maxAttempts = 20;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function resolveRequestPath(url) {
  const requestedPath = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const cleanPath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = resolve(join(root, cleanPath));

  if (!absolutePath.startsWith(root)) {
    return null;
  }

  if (existsSync(absolutePath) && statSync(absolutePath).isDirectory()) {
    return join(absolutePath, "index.html");
  }

  return absolutePath;
}

function createStaticServer() {
  return createServer((request, response) => {
    const filePath = resolveRequestPath(request.url || "/");

    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream"
    });

    createReadStream(filePath).pipe(response);
  });
}

function listen(port, attemptsLeft) {
  const server = createStaticServer();

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attemptsLeft > 1) {
      listen(port + 1, attemptsLeft - 1);
      return;
    }

    console.error(error.message);
    process.exit(1);
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`SOC website running at http://127.0.0.1:${port}`);
  });
}

listen(startPort, maxAttempts);

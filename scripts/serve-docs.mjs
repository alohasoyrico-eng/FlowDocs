import http from "node:http";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 53223);
const root = process.cwd();
const defaultDocument = "apps/docs/index.html";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
]);

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const normalized = path.normalize(pathname === "/" ? defaultDocument : pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, normalized);
  const relative = path.relative(root, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return filePath;
}

const server = http.createServer(async (request, response) => {
  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-length": stat.size,
      "content-type": contentTypes.get(path.extname(filePath)) || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Flow docs listening at http://${host}:${port}/apps/docs/index.html`);
});

const http = require("node:http");
const path = require("node:path");
const { readFile } = require("node:fs/promises");

const rootDirectory = __dirname;
const port = Number(process.env.PORT) || 4173;
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

const server = http.createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch (error) {
    response.writeHead(400);
    response.end("Bad Request");
    return;
  }

  const relativePath =
    pathname === "/" ? "views/index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(rootDirectory, relativePath);

  if (!filePath.startsWith(`${rootDirectory}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type":
        contentTypes.get(path.extname(filePath).toLowerCase()) ??
        "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      response.writeHead(404);
      response.end("Not Found");
      return;
    }

    console.error(`No se pudo servir ${filePath}.`, error);
    response.writeHead(500);
    response.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`Lienzo Angie está disponible en http://localhost:${port}`);
});

import { copyFile, mkdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "dist");
const htmlPath = path.join(root, "index.html");
const html = await readFile(htmlPath, "utf8");

// The entire experience is self-contained in index.html. Copy only local assets
// that its HTML, CSS, and JavaScript actually reference; concept drafts stay out
// of the Cloudflare deployment without being removed from the repository.
const assetPattern = /assets\/[A-Za-z0-9_./-]+?\.(?:png|jpe?g|webp|gif|svg|mp4|webm|woff2?)/gi;
const assetPaths = [...new Set(html.match(assetPattern) ?? [])].sort();

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await copyFile(htmlPath, path.join(output, "index.html"));

let assetBytes = 0;
for (const relativePath of assetPaths) {
  const source = path.join(root, ...relativePath.split("/"));
  const destination = path.join(output, ...relativePath.split("/"));
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  assetBytes += (await stat(source)).size;
}

const htmlBytes = (await stat(htmlPath)).size;
const totalMiB = (htmlBytes + assetBytes) / 1024 / 1024;
console.log(`Built dist with ${assetPaths.length} referenced assets (${totalMiB.toFixed(2)} MiB).`);

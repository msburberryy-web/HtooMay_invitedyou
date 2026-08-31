import { copyFile, mkdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "dist");

// Each page is self-contained HTML. Copy only local assets that its HTML,
// CSS, and JavaScript actually reference; concept drafts stay out of the
// Cloudflare deployment without being removed from the repository.
const assetPattern = /assets\/[A-Za-z0-9_./-]+?\.(?:png|jpe?g|webp|gif|svg|mp3|ogg|mp4|webm|woff2?)/gi;
const pages = [
  { source: "index.html", destination: "index.html" },
  { source: "casualparty.html", destination: "casualparty.html" },
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const assetPaths = new Set();
let htmlBytes = 0;

for (const page of pages) {
  const htmlPath = path.join(root, page.source);
  const html = await readFile(htmlPath, "utf8");
  for (const match of html.match(assetPattern) ?? []) assetPaths.add(match);

  const destinationPath = path.join(output, ...page.destination.split("/"));
  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(htmlPath, destinationPath);
  htmlBytes += (await stat(htmlPath)).size;
}

let assetBytes = 0;
for (const relativePath of [...assetPaths].sort()) {
  const source = path.join(root, ...relativePath.split("/"));
  const destination = path.join(output, ...relativePath.split("/"));
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  assetBytes += (await stat(source)).size;
}

const totalMiB = (htmlBytes + assetBytes) / 1024 / 1024;
console.log(`Built dist with ${pages.length} pages and ${assetPaths.size} referenced assets (${totalMiB.toFixed(2)} MiB).`);

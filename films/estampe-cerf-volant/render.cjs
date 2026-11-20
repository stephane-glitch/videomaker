// Rend le film image par image : node render.cjs [dossier_images] [n1,n2,…]
// Sans liste d'images : tous les dessins (un sur deux, le film est animé « par deux »).
const { chromium } = require("playwright");
const { mkdirSync } = require("node:fs");
const { pathToFileURL } = require("node:url");
(async () => {
const out = process.argv[2] ?? "frames";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => { console.error("ERREUR", e.message); process.exitCode = 1; });
await page.goto(pathToFileURL("film.html").href);
const total = await page.evaluate(() => window.TOTAL);
const list = process.argv[3] ? process.argv[3].split(",").map(Number) : Array.from({ length: total / 2 }, (_, i) => i * 2);
for (const n of list) {
  await page.evaluate((k) => window.renderFrame(k), n);
  await page.screenshot({ path: `${out}/f${String(n / 2).padStart(4, "0")}.png` });
}
await browser.close();
console.log(list.length, "images");
})();

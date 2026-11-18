// Capture index.html en PNG 1920x1080 (x2 pour la netteté).
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");

const scale = Number(process.argv[2] ?? 2);
const here = new URL(".", import.meta.url);
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: scale,
});
await page.goto(new URL("index.html", here).href);
await page.evaluate(() => document.fonts.ready);
const out = fileURLToPath(new URL(scale === 1 ? "style-test-1x.png" : "style-test.png", here));
await page.screenshot({ path: out });
await browser.close();
console.log(out);

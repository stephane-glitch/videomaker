// Génère le PDF de validation à partir de index.html (A4 paysage).
// Usage : NODE_PATH=$(npm root -g) node pdf.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const here = new URL(".", import.meta.url);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(new URL("index.html", here).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const out = fileURLToPath(new URL("Mission-Flow-video-briefing-validation.pdf", here));
await page.pdf({
  path: out,
  format: "A4",
  landscape: true,
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log(out);

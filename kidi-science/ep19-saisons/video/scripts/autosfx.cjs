// Relève les apparitions à l'écran (show, pop, étiquettes) dans index.html et en fait des bruitages discrets.
// Usage : node scripts/build.mjs && node scripts/autosfx.cjs && node scripts/build.mjs
const { chromium } = require("playwright");
const { writeFileSync } = require("node:fs");
const { pathToFileURL } = require("node:url");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // hors du moteur HyperFrames, la dernière ligne (enregistrement du minutage) échoue : sans importance, le relevé est déjà fait
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(pathToFileURL("index.html").href);
  await page.waitForTimeout(1500);
  for (const e of errs) if (!e.includes("'main'")) throw new Error("erreur dans une scène : " + e);
  const ev = (await page.evaluate(() => window.__SFX)).filter(([t]) => t > 8).sort((a, b) => a[0] - b[0]);
  await browser.close();
  // pas deux bruitages à moins de 0,35 s l'un de l'autre
  const out = [];
  for (const [t, kind] of ev) if (!out.length || t - out[out.length - 1].at > 0.35) out.push({ file: kind, at: Math.round(t * 100) / 100, volume: kind === "pop" ? 0.28 : 0.2 });
  writeFileSync("src/sfx.auto.json", JSON.stringify(out));
  console.log(out.length, "bruitages d'apparition");
})();

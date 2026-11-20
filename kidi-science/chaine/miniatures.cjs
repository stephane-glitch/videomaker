// Fabrique les miniatures : node miniatures.cjs  →  publication/epNN/miniature.jpg (1280 × 720)
const { chromium } = require("playwright");
const { readFileSync, readdirSync } = require("node:fs");
const { pathToFileURL } = require("node:url");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });
  for (const ep of readdirSync("publication")
    .filter((d) => /^ep\d+$/.test(d))
    .sort()) {
    const meta = JSON.parse(readFileSync(`publication/${ep}/meta.json`, "utf8"));
    await page.goto(pathToFileURL("miniature.html").href);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate((a) => window.fill(a), {
      n: meta.episode,
      titre: meta.titre_miniature,
      image: `publication/${ep}/image.jpg`,
    });
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `publication/${ep}/miniature.jpg`, type: "jpeg", quality: 90 });
  }
  await browser.close();
})();

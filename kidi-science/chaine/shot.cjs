// Fabrique l'image de la bannière : node shot.cjs  →  renders/banniere-youtube.png (2560 × 1440)
const { chromium } = require("playwright");
const { pathToFileURL } = require("node:url");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => console.error("ERREUR", e.message));
  await page.goto(pathToFileURL("banniere.html").href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "renders/banniere-youtube.png" });
  await browser.close();
})();

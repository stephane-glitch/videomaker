// Fabrique les propositions d'icône : node logo.cjs  →  renders/logo-planche.png et renders/logo-a|b|c.png (800 × 800)
const { chromium } = require("playwright");
const { pathToFileURL } = require("node:url");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1600, height: 760 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => console.error("ERREUR", e.message));
  await page.goto(pathToFileURL("logo.html").href);
  await page.screenshot({ path: "renders/logo-planche.png" });
  await page.setViewportSize({ width: 800, height: 800 });
  for (const v of ["a", "b", "c"]) {
    await page.goto(pathToFileURL("logo.html").href + "?v=" + v);
    await page.screenshot({ path: `renders/logo-${v}.png` });
  }
  await browser.close();
})();

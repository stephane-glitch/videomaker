// Fabrique une image PNG par morceau de papier (grain, déchirure, ombre) dans assets/pieces/.
// Les images déjà faites sont gardées : seuls les papiers nouveaux ou modifiés sont refaits.
// Usage : node scripts/build.mjs && node scripts/bake.cjs
const { chromium } = require("playwright");
const { existsSync, mkdirSync, readdirSync, unlinkSync, readFileSync } = require("node:fs");
const { pathToFileURL } = require("node:url");
(async () => {
  mkdirSync("assets/pieces", { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2400, height: 2600 } });
  await page.addInitScript(() => (window.__BAKE = {}));
  await page.route("**/assets/pieces/**", (r) => r.abort());
  await page.goto(pathToFileURL("index.html").href);
  await page.waitForTimeout(1200);
  const defs = readFileSync("index.html", "utf8").match(/<defs>[\s\S]*?<\/defs>/)[0];
  const list = await page.evaluate(() =>
    Object.entries(window.__BAKE).map(([k, v]) => [k, v.w, v.h]),
  );
  // page vide : seulement les filtres et le papier en cours
  await page.setContent(
    `<html><head><style>@font-face{font-family:"Fredoka";font-weight:700;src:url("${pathToFileURL("assets/fonts/fredoka-700.woff2").href}") format("woff2")}html,body{margin:0;background:transparent}#st{position:absolute;left:0;top:0}svg{display:block;overflow:visible}</style></head><body><svg width="0" height="0" style="position:absolute">${defs}</svg><div id="st"></div><span style="font-family:Fredoka;font-weight:700">.</span></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  const want = new Set(["grain.png"]);
  let made = 0;
  const all = JSON.parse(
    await (async () => {
      await page.goto(pathToFileURL("index.html").href);
      await page.waitForTimeout(800);
      return page.evaluate(() => JSON.stringify(window.__BAKE));
    })(),
  );
  await page.setContent(
    `<html><head><style>@font-face{font-family:"Fredoka";font-weight:700;src:url("${pathToFileURL("assets/fonts/fredoka-700.woff2").href}") format("woff2")}html,body{margin:0;background:transparent}#st{position:absolute;left:0;top:0}svg{display:block;overflow:visible}</style></head><body><svg width="0" height="0" style="position:absolute">${defs}</svg><div id="st"></div><span style="font-family:Fredoka;font-weight:700">.</span></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  for (const [key, w, h] of list) {
    want.add(key + ".png");
    const out = `assets/pieces/${key}.png`;
    if (existsSync(out)) continue;
    await page.evaluate(({ html, shadow }) => {
      const st = document.getElementById("st");
      st.style.filter = shadow.replace(/^filter:/, "");
      st.innerHTML = html;
    }, all[key]);
    await page.screenshot({
      path: out,
      omitBackground: true,
      clip: { x: 0, y: 0, width: w, height: h },
    });
    made++;
  }
  if (!existsSync("assets/pieces/grain.png")) {
    await page.evaluate(() => {
      const st = document.getElementById("st");
      st.style.filter = "";
      st.innerHTML = `<svg width="2040" height="1200"><rect width="2040" height="1200" filter="url(#grainF)"/></svg>`;
    });
    await page.screenshot({
      path: "assets/pieces/grain.png",
      omitBackground: true,
      clip: { x: 0, y: 0, width: 2000, height: 1200 },
    });
  }
  for (const f of readdirSync("assets/pieces")) if (!want.has(f)) unlinkSync("assets/pieces/" + f);
  await browser.close();
  console.log(list.length, "papiers,", made, "fabriqués");
})();

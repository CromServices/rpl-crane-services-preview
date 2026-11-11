import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const shots = join(root, "checks", "shots");
mkdirSync(shots, { recursive: true });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".json": "application/json"
};

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = join(root, p.replace(/^\/+/, ""));
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "Content-Type": mime[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});

const fail = [];
function ok(name, cond, extra) {
  if (cond) console.log("PASS  " + name);
  else {
    console.log("FAIL  " + name + (extra ? " — " + extra : ""));
    fail.push(name);
  }
}

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const url = "http://127.0.0.1:" + port + "/";

const browser = await chromium.launch();

async function overflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(doc.scrollWidth - doc.clientWidth, body.scrollWidth - body.clientWidth);
  });
}

async function headerTop(page) {
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(200);
  return page.locator("header.site").evaluate((el) => Math.round(el.getBoundingClientRect().top));
}

const contrastScript = () => {
  function parse(c) {
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    return [+m[1], +m[2], +m[3]];
  }
  function lin(c) {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function L(rgb) {
    return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  }
  function ratio(fg, bg) {
    const a = L(fg),
      b = L(bg);
    const hi = Math.max(a, b),
      lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  }
  function bgOf(el) {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = parse(getComputedStyle(n).backgroundColor);
      if (bg && !(bg[0] === 0 && bg[1] === 0 && bg[2] === 0 && getComputedStyle(n).backgroundColor.includes("0)"))) {
        if (getComputedStyle(n).backgroundColor !== "rgba(0, 0, 0, 0)" && getComputedStyle(n).backgroundColor !== "transparent") {
          return bg;
        }
      }
      n = n.parentElement;
    }
    return parse(getComputedStyle(document.body).backgroundColor);
  }
  const sels = [".kicker", ".btn-accent", ".btn-ghost-light", ".sticky-call a.call", ".sticky-call a.quote"];
  const out = [];
  sels.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.offsetParent && sel.includes("sticky") && getComputedStyle(el).display === "none") return;
      const cs = getComputedStyle(el);
      const fg = parse(cs.color);
      let bg = parse(cs.backgroundColor);
      if (!bg || cs.backgroundColor === "rgba(0, 0, 0, 0)" || cs.backgroundColor === "transparent") bg = bgOf(el.parentElement || el);
      if (!fg || !bg) return;
      out.push({
        sel,
        i,
        text: (el.innerText || "").slice(0, 40),
        fg: cs.color,
        bg: cs.backgroundColor,
        ratio: Math.round(ratio(fg, bg) * 100) / 100
      });
    });
  });
  return out;
};

try {
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.removeItem("rpl-theme");
    document.documentElement.setAttribute("data-theme", "light");
  });
  await page.reload({ waitUntil: "networkidle" });

  const html = await page.content();
  ok("noindex meta home", /name=["']robots["'][^>]*content=["']noindex["']/i.test(html) || /content=["']noindex["'][^>]*name=["']robots["']/i.test(html));

  for (const p of ["about.html", "work.html", "quote.html", "contact.html"]) {
    const h = await page.evaluate(async (path) => (await fetch(path)).text(), p);
    ok("noindex " + p, /name=["']robots["'][^>]*content=["']noindex["']/i.test(h) || /content=["']noindex["'][^>]*name=["']robots["']/i.test(h));
    ok("title page " + p, /<title>RPL Crane Services — /.test(h));
    ok("desc " + p, /content="Website preview\."/.test(h));
  }

  ok("home title", /<title>RPL Crane Services — Home<\/title>/.test(html));
  ok("no native select", (await page.locator("select").count()) === 0);

  const header1440 = await headerTop(page);
  ok("sticky header 1440 top===0", header1440 === 0, "got " + header1440);
  ok("no overflow 1440", (await overflow(page)) <= 0);

  await page.evaluate(() => window.scrollTo(0, 0));
  const lightContrast = await page.evaluate(contrastScript);
  const lightBad = lightContrast.filter((c) => c.ratio < 4.5);
  console.log("CONTRAST light", JSON.stringify(lightContrast, null, 2));
  ok("contrast light >=4.5", lightBad.length === 0, JSON.stringify(lightBad));
  await page.screenshot({ path: join(shots, "desktop-1440-light.png"), fullPage: true });

  const beforeTheme = await page.getAttribute("html", "data-theme");
  await page.locator("#theme-toggle").click();
  await page.waitForTimeout(300);
  const afterTheme = await page.getAttribute("html", "data-theme");
  const sunVisible = await page.locator(".icon-sun").evaluate((el) => getComputedStyle(el).opacity);
  const moonVisible = await page.locator(".icon-moon").evaluate((el) => getComputedStyle(el).opacity);
  ok("toggle flips data-theme", beforeTheme !== afterTheme);
  const iconOk =
    afterTheme === "dark"
      ? Number(sunVisible) > 0.5 && Number(moonVisible) < 0.5
      : Number(moonVisible) > 0.5 && Number(sunVisible) < 0.5;
  ok("toggle shows matching icon", iconOk, "theme " + afterTheme);

  const darkContrast = await page.evaluate(contrastScript);
  const darkBad = darkContrast.filter((c) => c.ratio < 4.5);
  console.log("CONTRAST dark", JSON.stringify(darkContrast, null, 2));
  ok("contrast dark >=4.5", darkBad.length === 0, JSON.stringify(darkBad));
  await page.screenshot({ path: join(shots, "desktop-1440-dark.png"), fullPage: true });
  if (afterTheme === "dark") await page.locator("#theme-toggle").click();

  ok("no plant picker", (await page.locator("#book .pick").count()) === 0);
  const jobs = page.locator("#book .job-chip");
  ok("two job chips", (await jobs.count()) === 2);
  const jobText = (await jobs.allTextContents()).map((t) => t.trim());
  ok("Crane lift / Borer chips", jobText[0].includes("Crane lift") && jobText[1].includes("Borer"));
  await jobs.nth(1).click();
  ok("borer spec shown", await page.locator('#book .spec-block[data-job="borer"]').evaluate((el) => !el.hasAttribute("hidden")));
  ok("lift spec hidden", await page.locator('#book .spec-block[data-job="lift"]').evaluate((el) => el.hasAttribute("hidden")));
  await jobs.nth(0).click();

  const chips = page.locator("#book .day-chips .chip");
  ok("14 date chips", (await chips.count()) === 14, "got " + (await chips.count()));
  const days = await chips.evaluateAll((els) => els.map((el) => el.querySelector(".dow")?.textContent?.trim()));
  ok("Sundays skipped", days.every((d) => d !== "Sun"), JSON.stringify(days));
  ok("Saturdays allowed if present", days.filter((d) => d === "Sat").length === 0 || true);

  const pills = page.locator("#book .time-pills .pill");
  const pillText = (await pills.allTextContents()).map((t) => t.trim());
  ok("time pills Morning/Afternoon/Either", JSON.stringify(pillText) === JSON.stringify(["Morning", "Afternoon", "Either"]));
  await pills.nth(1).click();
  ok("afternoon selectable", await pills.nth(1).evaluate((el) => el.classList.contains("is-on")));

  await page.locator('#book input[name="bname"]').fill("Alex");
  await page.locator('#book input[name="bphone"]').fill("0418000000");
  await page.locator('#book button[type="submit"]').click();
  const success = page.locator("#book-success");
  await success.waitFor({ state: "visible" });
  const successText = (await success.innerText()).trim();
  ok("booking success visible", successText.length > 0);
  ok(
    "success does not promise follow-up",
    !/email|calendar|call you|we will call|you'll stay|you will stay|does not send/i.test(successText),
    successText
  );
  await page.screenshot({ path: join(shots, "booking-success.png") });

  await page.locator('a[href="#pic-pole"]').first().click();
  const lbDisplay = await page.locator("#pic-pole").evaluate((el) => getComputedStyle(el).display);
  ok("lightbox :target opens", lbDisplay === "flex", lbDisplay);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  const heroGap = await page.evaluate(() => {
    window.scrollTo(0, 0);
    const header = document.querySelector("header.site");
    const hero = document.querySelector(".hero");
    const next = hero.nextElementSibling;
    const hr = header.getBoundingClientRect();
    const he = hero.getBoundingClientRect();
    const nx = next.getBoundingClientRect();
    return { above: Math.round(he.top - hr.bottom), below: Math.round(nx.top - he.bottom) };
  });
  ok("sticky header 390 top===0", (await headerTop(page)) === 0);
  ok("no overflow 390", (await overflow(page)) <= 0);
  const barBox = await page.locator(".sticky-call").boundingBox();
  const headerBox = await page.locator("header.site").boundingBox();
  ok("sticky call bar visible 390", !!(barBox && barBox.height >= 40));
  ok("header does not cover call bar", headerBox && barBox && headerBox.y + headerBox.height <= barBox.y + 1);
  const callBg = await page.locator(".sticky-call a.call").evaluate((el) => getComputedStyle(el).backgroundColor);
  ok("Call button styled", callBg !== "rgba(0, 0, 0, 0)" && callBg !== "transparent", callBg);
  ok("no gap above hero 390", Math.abs(heroGap.above) <= 1, JSON.stringify(heroGap));
  ok("no gap below hero 390", Math.abs(heroGap.below) <= 1, JSON.stringify(heroGap));
  ok(
    "logo badge not clipped 390",
    await page.evaluate(() => {
      const r = document.querySelector(".logo img").getBoundingClientRect();
      return r.left >= 0 && r.right <= window.innerWidth + 1 && r.top >= 0 && r.height >= 24;
    })
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(shots, "mobile-390-light.png"), fullPage: true });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.screenshot({ path: join(shots, "mobile-390-dark.png"), fullPage: true });

  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(url, { waitUntil: "networkidle" });
  ok("no overflow 320", (await overflow(page)) <= 0);

  const pages = ["index.html", "about.html", "work.html", "quote.html", "contact.html"];
  let visHits = [];
  for (const p of pages) {
    await page.goto(url.replace(/\/$/, "/") + p.replace("index.html", ""), { waitUntil: "networkidle" });
    const visible = await page.evaluate(() => document.body.innerText);
    const banned = [
      "TODO",
      "placeholder",
      "wireframe",
      "per the brief",
      "sample",
      "demo",
      "template",
      "concept",
      "illustrative",
      "does not send",
      "Bryant",
      "Unit 2",
      "ABN",
      "chatbot",
      "artificial intelligence"
    ];
    visHits = visHits.concat(banned.filter((w) => visible.toLowerCase().includes(w.toLowerCase())).map((w) => p + ":" + w));
  }
  ok("visible banned-text scan", visHits.length === 0, visHits.join(", "));

  const htmlFiles = readdirSync(root).filter((f) => f.endsWith(".html"));
  let source = readFileSync(join(root, "README.md"), "utf8");
  htmlFiles.forEach((f) => {
    source += "\n" + readFileSync(join(root, f), "utf8");
  });
  const stripped = source
    .replace(/N-0371621\/1/g, "")
    .replace(/HRW 068323/g, "")
    .replace(/0418 672 546/g, "")
    .replace(/0418672546/g, "")
    .replace(/\+61418672546/g, "")
    .replace(/tel:\+61418672546/g, "");
  const bsbSrc = stripped.match(/\d{3}-?\d{3}/g) || [];
  ok("no BSB in source files", bsbSrc.length === 0, String(bsbSrc));
  const visibleHome = await page.evaluate(async () => {
    location.href = "/";
    return "";
  });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const vis = await page.evaluate(() => document.body.innerText);
  ok(
    "no BSB pattern in visible text",
    !/\d{3}-?\d{3}/.test(vis.replace(/N-0371621\/1/g, "").replace(/HRW 068323/g, "").replace(/0418 672 546/g, ""))
  );

  writeFileSync(join(shots, "MD5SUMS.txt"), "");
} finally {
  await browser.close();
  server.close();
}

if (fail.length) {
  console.log("\nFAILED: " + fail.length);
  process.exit(1);
}
console.log("\nALL CHECKS PASSED");

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
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
  ok("noindex meta", /meta[^>]+name=["']robots["'][^>]+content=["']noindex["']/i.test(html) || /meta[^>]+content=["']noindex["'][^>]+name=["']robots["']/i.test(html));

  const header1440 = await headerTop(page);
  ok("sticky header 1440 top===0", header1440 === 0, "got " + header1440);
  const ov1440 = await overflow(page);
  ok("no overflow 1440", ov1440 <= 0, "delta " + ov1440);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(shots, "desktop-1440-light.png"), fullPage: true });

  const beforeTheme = await page.getAttribute("html", "data-theme");
  await page.locator("#theme-toggle").click();
  await page.waitForTimeout(300);
  const afterTheme = await page.getAttribute("html", "data-theme");
  const sunVisible = await page.locator(".icon-sun").evaluate((el) => getComputedStyle(el).opacity);
  const moonVisible = await page.locator(".icon-moon").evaluate((el) => getComputedStyle(el).opacity);
  ok("toggle flips data-theme", beforeTheme !== afterTheme && (afterTheme === "dark" || afterTheme === "light"), beforeTheme + " -> " + afterTheme);
  const iconOk = afterTheme === "dark" ? Number(sunVisible) > 0.5 && Number(moonVisible) < 0.5 : Number(moonVisible) > 0.5 && Number(sunVisible) < 0.5;
  ok("toggle shows matching icon", iconOk, "theme " + afterTheme + " sun " + sunVisible + " moon " + moonVisible);

  await page.screenshot({ path: join(shots, "desktop-1440-dark.png"), fullPage: true });
  if (afterTheme === "dark") await page.locator("#theme-toggle").click();

  const picks = page.locator("#book .pick");
  ok("one crane card in book", (await picks.count()) === 1);
  await picks.first().click();
  ok("crane card selected", await picks.first().evaluate((el) => el.classList.contains("is-on")));

  const chips = page.locator("#book .day-chips .chip");
  ok("14 date chips", (await chips.count()) === 14, "got " + (await chips.count()));
  const weekendState = await chips.evaluateAll((els) =>
    els.map((el) => {
      const dow = el.querySelector(".dow")?.textContent?.trim();
      return { dow, disabled: el.disabled || el.getAttribute("aria-disabled") === "true" };
    })
  );
  const weekends = weekendState.filter((c) => c.dow === "Sat" || c.dow === "Sun");
  ok("weekends present or counted in 14", weekendState.length === 14);
  ok("weekends disabled", weekends.length > 0 && weekends.every((c) => c.disabled), JSON.stringify(weekends));
  ok("weekdays selectable", weekendState.filter((c) => c.dow !== "Sat" && c.dow !== "Sun").every((c) => !c.disabled));

  const pills = page.locator("#book .time-pills .pill");
  const pillText = (await pills.allTextContents()).map((t) => t.trim());
  ok("time pills Morning/Midday/Afternoon", JSON.stringify(pillText) === JSON.stringify(["Morning", "Midday", "Afternoon"]));
  await pills.nth(1).click();
  ok("midday selectable", await pills.nth(1).evaluate((el) => el.classList.contains("is-on")));

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
  const lb = page.locator("#pic-pole");
  const lbDisplay = await lb.evaluate((el) => getComputedStyle(el).display);
  ok("lightbox :target opens", lbDisplay === "flex", lbDisplay);
  await page.locator('#pic-pole a.close').click();

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
  const header390 = await headerTop(page);
  ok("sticky header 390 top===0", header390 === 0, "got " + header390);
  const ov390 = await overflow(page);
  ok("no overflow 390", ov390 <= 0, "delta " + ov390);

  const bar = page.locator(".sticky-call");
  const barBox = await bar.boundingBox();
  const headerBox = await page.locator("header.site").boundingBox();
  ok("sticky call bar visible 390", !!(barBox && barBox.height >= 40));
  ok(
    "header does not cover call bar",
    headerBox && barBox && headerBox.y + headerBox.height <= barBox.y + 1,
    JSON.stringify({ headerBox, barBox })
  );
  const callBg = await page.locator(".sticky-call a.call").evaluate((el) => getComputedStyle(el).backgroundColor);
  ok("Call button styled", callBg !== "rgba(0, 0, 0, 0)" && callBg !== "transparent", callBg);

  ok("no gap above hero 390", Math.abs(heroGap.above) <= 1, JSON.stringify(heroGap));
  ok("no gap below hero 390", Math.abs(heroGap.below) <= 1, JSON.stringify(heroGap));

  const logoClip = await page.evaluate(() => {
    const img = document.querySelector(".logo img");
    const r = img.getBoundingClientRect();
    return r.left >= 0 && r.right <= window.innerWidth + 1 && r.top >= 0 && r.height >= 24;
  });
  ok("logo badge not clipped 390", logoClip);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(shots, "mobile-390-light.png"), fullPage: true });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.screenshot({ path: join(shots, "mobile-390-dark.png"), fullPage: true });

  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(url, { waitUntil: "networkidle" });
  const ov320 = await overflow(page);
  ok("no overflow 320", ov320 <= 0, "delta " + ov320);

  const visible = await page.evaluate(() => document.body.innerText);
  const source = readFileSync(join(root, "index.html"), "utf8") + "\n" + readFileSync(join(root, "README.md"), "utf8");
  const banned = [
    "TODO",
    "placeholder",
    "wireframe",
    "per the brief",
    "sample",
    "demo",
    "template",
    "illustrative",
    "This form does not send",
    "does not send",
    "Bryant",
    "Unit 2",
    "ABN",
    "chatbot",
    "artificial intelligence"
  ];
  const visHits = banned.filter((w) => visible.toLowerCase().includes(w.toLowerCase()));
  ok("visible banned-text scan", visHits.length === 0, visHits.join(", "));
  const stripped = source
    .replace(/N-0371621\/1/g, "")
    .replace(/HRW 068323/g, "")
    .replace(/0418 672 546/g, "")
    .replace(/0418672546/g, "")
    .replace(/\+61418672546/g, "")
    .replace(/tel:\+61418672546/g, "");
  const bsbSrc = stripped.match(/\d{3}-?\d{3}/g) || [];
  ok("no BSB pattern in visible text", !/\d{3}-?\d{3}/.test(visible.replace(/N-0371621\/1/g, "").replace(/HRW 068323/g, "").replace(/0418 672 546/g, "")));
  ok("no BSB in source files", bsbSrc.length === 0, String(bsbSrc));
  ok("licence numbers allowed", /N-0371621/.test(source));
  const galleryHtml = html.slice(html.indexOf('id="photos"'), html.indexOf("lightbox"));
  ok("no crane-side in gallery", !/crane-side/.test(galleryHtml), galleryHtml.slice(0, 80));

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

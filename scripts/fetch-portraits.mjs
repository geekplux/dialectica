#!/usr/bin/env node
// Downloads the portrait of every thinker with a `c` (a Wikimedia Commons file name), resizes it and saves it as WebP:
//   public/images/portraits/<id>.webp       600px wide (never upscaled)
//   public/images/portraits/<id>-300.webp   300px wide
// Reads licence, author and file page from the Commons API (extmetadata) into the thinker's `portrait` field,
// then regenerates CREDITS.md. Only add files whose artwork is free (see CLAUDE.md), and look at each one.
//
// Usage: node scripts/fetch-portraits.mjs [--force] [--only thinker-id]
// Needs network access, Node 22+ and `cwebp` (brew install webp / apt install webp).
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { loadData, saveData, SITE, ROOT, portraitPath, contentHash } from "./lib/data.mjs";
import { creditsMarkdown } from "./lib/credits.mjs";

const WIDE = 600, SMALL = 300, QUALITY = "80";
const UA = "dialectica-portraits/1.0 (https://github.com/geekplux/dialectica)";
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

try { execFileSync("cwebp", ["-version"], { stdio: "ignore" }); } catch { console.error("cwebp not found: install the webp package"); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, as = "json") {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return as === "json" ? res.json() : Buffer.from(await res.arrayBuffer());
    if (attempt < 4 && (res.status === 429 || res.status >= 500)) { await sleep(2000 * (attempt + 1)); continue; }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
}

/* Commons metadata is HTML; keep plain text, and drop doubled names ("Unknown authorUnknown author") */
function cleanText(html) {
  if (!html) return "";
  let s = html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim().replace(/^(w:)?User:/i, "").replace(/^w:/, "");
  s = s.replace(/\s+([,;:)])/g, "$1").replace(/\(\s+/g, "(").replace(/^(.+?)\s*\1$/, "$1");
  return s.length > 70 ? s.split(/\s*[(,;]/)[0] : s;
}

async function commonsInfo(file) {
  const base = "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1&prop=imageinfo" +
    "&iiprop=url|size|user|extmetadata&iiextmetadatafilter=LicenseShortName|LicenseUrl|Artist|Attribution|UsageTerms";
  const title = "File:" + file.replace(/_/g, " ");
  const page = (await get(`${base}&titles=${encodeURIComponent(title)}`)).query.pages[0];
  if (page.missing) throw new Error(`Commons file missing: ${title}`);
  const ii = page.imageinfo[0];
  let download = ii.url;
  if (ii.width > WIDE || /\.(tiff?|svg)$/i.test(ii.url)) {
    const t = await get(`${base}&iiurlwidth=${Math.min(WIDE, ii.width)}&titles=${encodeURIComponent(page.title)}`);
    download = t.query.pages[0].imageinfo[0].thumburl || ii.url;
  }
  const m = ii.extmetadata || {};
  const v = (k) => m[k]?.value;
  const license = cleanText(v("LicenseShortName")) || cleanText(v("UsageTerms")) || "See file page";
  return {
    download, width: ii.width, page: ii.descriptionurl, license, licenseUrl: v("LicenseUrl") || null,
    author: cleanText(v("Attribution")) || cleanText(v("Artist")) || `Uploaded by ${ii.user}`
  };
}

const webp = (input, output, width) => execFileSync("cwebp", ["-quiet", "-q", QUALITY, "-m", "6", "-metadata", "none", "-resize", String(width), "0", input, "-o", output]);
const dims = (file) => {
  const out = execFileSync("webpinfo", [file], { encoding: "utf8" });
  return [+out.match(/Width:\s*(\d+)/)[1], +out.match(/Height:\s*(\d+)/)[1]];
};

const D = loadData();
const tmp = mkdtempSync(join(tmpdir(), "dialectica-"));
let fetched = 0, kept = 0;
try {
  for (const k of D.thinkers) {
    if (only && k.id !== only) continue;
    if (!k.c) { delete k.portrait; continue; }
    const large = join(SITE, portraitPath(k.id)), small = join(SITE, portraitPath(k.id, true));
    const info = await commonsInfo(k.c);
    if (force || !existsSync(large) || !existsSync(small) || k.portrait?.page !== info.page) {
      mkdirSync(dirname(large), { recursive: true });
      const ext = (info.download.split("?")[0].match(/\.(\w+)$/) || [, "jpg"])[1];
      const src = join(tmp, `${k.id}.${ext}`);
      writeFileSync(src, await get(info.download, "buffer"));
      webp(src, large, Math.min(WIDE, info.width));
      webp(src, small, Math.min(SMALL, info.width));
      fetched++;
      console.log(`  ✓ ${k.id}  ${info.license}`);
    } else kept++;
    const [w, h] = dims(large);
    k.portrait = { w, h, v: contentHash(readFileSync(large), readFileSync(small)), author: info.author, license: info.license, licenseUrl: info.licenseUrl, page: info.page };
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
saveData(D);
writeFileSync(join(ROOT, "CREDITS.md"), creditsMarkdown(D));
console.log(`${fetched} downloaded, ${kept} already present. Updated public/data/thinkers.js and CREDITS.md.`);

// Loads and saves the data files in public/data/, keeping their layout: one entry per line, so diffs stay readable.
// Scripts edit the data through loadData()/saveData() rather than by regular expression.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const SITE = ROOT + "public/";
export const DATA = SITE + "data/";
export const NOW = 2026;

/* window.DIALECTICA, read from the data files the page loads */
export function loadData() {
  const sandbox = { window: {} };
  for (const f of ["core", "schools", "thinkers", "links", "facts"]) {
    const file = DATA + f + ".js";
    if (f === "facts" && !existsSync(file)) continue;
    vm.runInNewContext(readFileSync(file, "utf8"), sandbox, { filename: file });
  }
  return sandbox.window.DIALECTICA;
}

const HEAD = (what) => `/* Dialectica ${what}, in English and Chinese. Edit freely, then run \`node scripts/check-data.mjs\`. */\nwindow.DIALECTICA = window.DIALECTICA || {};\n`;
const list = (name, items) => `window.DIALECTICA.${name} = [\n${items.map((x) => "  " + JSON.stringify(x)).join(",\n")}\n];\n`;

/* Writes schools.js, thinkers.js, links.js and facts.js (core.js is edited by hand) */
export function saveData(D) {
  writeFileSync(DATA + "schools.js", HEAD("schools: one per school, grouped by tradition") + list("schools", D.schools));
  writeFileSync(DATA + "thinkers.js", HEAD("thinkers: one per person, grouped by tradition") + list("thinkers", D.thinkers));
  writeFileSync(DATA + "links.js", HEAD("lines of influence. links join schools (dev, react, fuse); ties join thinkers (taught, infl, opp)") +
    list("links", D.links) + list("ties", D.ties));
  if (D.facts) writeFileSync(DATA + "facts.js", HEAD("fact-check: what was checked against published scholarship, the verdict and the sources") + list("facts", D.facts));
}

export const contentHash = (...bufs) => { const h = createHash("sha256"); bufs.forEach((b) => h.update(b)); return h.digest("hex").slice(0, 10); };
export const portraitPath = (id, small) => `images/portraits/${id}${small ? "-300" : ""}.webp`;

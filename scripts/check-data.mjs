#!/usr/bin/env node
// Validates public/data/core.js, schools.js, thinkers.js and links.js (ids, links, bilingual text, years),
// the counts quoted in public/index.html, and the ?v= cache stamps.
// Usage: node scripts/check-data.mjs [--warnings]   (no dependencies)
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { staleStamps } from "./stamp-assets.mjs";
import { SITE, ROOT, portraitPath, contentHash } from "./lib/data.mjs";
import { creditsMarkdown } from "./lib/credits.mjs";

const sandbox = { window: {} };
for (const f of ["core", "schools", "thinkers", "links"]) {
  const file = fileURLToPath(new URL(`../public/data/${f}.js`, import.meta.url));
  vm.runInNewContext(readFileSync(file, "utf8"), sandbox, { filename: file });
}
const D = sandbox.window.DIALECTICA;
const NOW = 2026;
const errors = [], warnings = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
const bi = (where, o, field) => {
  if (!o || typeof o.en !== "string" || typeof o.zh !== "string" || !o.en.trim() || !o.zh.trim()) fail(where, `${field} needs non-empty "en" and "zh"`);
};
const ids = (list, what) => {
  const s = new Set();
  for (const x of list) {
    if (s.has(x.id)) fail(what, `duplicate id "${x.id}"`);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(x.id)) fail(what, `id "${x.id}" must be lowercase letters, digits and dashes`);
    s.add(x.id);
  }
  return s;
};
const year = (v) => Number.isInteger(v) && v !== 0 && v <= NOW;

if (!D || !D.traditions || !D.schools || !D.thinkers || !D.links || !D.ties) { console.error("window.DIALECTICA is incomplete"); process.exit(1); }
const traditions = ids(D.traditions, "traditions");
const branches = ids(D.branches, "branches");
const schools = ids(D.schools, "schools");
const thinkers = ids(D.thinkers, "thinkers");
const SCB = Object.fromEntries(D.schools.map((s) => [s.id, s]));
const TKB = Object.fromEntries(D.thinkers.map((t) => [t.id, t]));

for (const t of D.traditions) { bi(`tradition "${t.id}"`, t.name, "name"); bi(`tradition "${t.id}"`, t.description, "description"); if (!/^#[0-9a-f]{6}$/i.test(t.color)) fail(`tradition "${t.id}"`, "color must be #rrggbb"); }
for (const b of D.branches) { bi(`branch "${b.id}"`, b.name, "name"); bi(`branch "${b.id}"`, b.question, "question"); }
let share = 0;
D.eras.forEach((e, i) => {
  bi(`era ${i}`, e.name, "name");
  if (!(e.start < e.end)) fail(`era ${i}`, "start must be before end");
  if (i && e.start !== D.eras[i - 1].end) fail(`era ${i}`, "eras must be contiguous");
  share += e.share;
});
if (Math.abs(share - 1) > 1e-9) fail("eras", `shares add up to ${share}, not 1`);
const MIN = D.eras[0].start;

/* Schools */
for (const s of D.schools) {
  const at = `school "${s.id}"`;
  if (!traditions.has(s.tradition)) fail(at, `unknown tradition "${s.tradition}"`);
  if (!year(s.start) || !year(s.end) || !(s.start < s.end)) fail(at, "needs integer start < end, no year 0, end ≤ " + NOW);
  if (s.start < MIN) warn(at, `starts before the axis (${s.start} < ${MIN}); drawn from ${MIN}`);
  for (const f of ["dates", "name", "idea", "question", "origin", "reasoning", "legacy"]) bi(at, s[f], f);
  if (!Array.isArray(s.claims) || s.claims.length !== 3) fail(at, "needs exactly 3 claims"); else s.claims.forEach((c, i) => bi(at, c, `claims[${i}]`));
  if (!Array.isArray(s.branches) || !s.branches.length) fail(at, "needs at least one branch");
  for (const b of s.branches || []) if (!branches.has(b)) fail(at, `unknown branch "${b}"`);
  if (!s.figures.length) fail(at, "needs at least one figure");
  for (const f of s.figures) {
    if (!thinkers.has(f)) fail(at, `unknown figure "${f}"`);
    else if (!TKB[f].schools.includes(s.id)) warn(at, `figure "${f}" does not list this school`);
  }
  for (const [i, w] of (s.works || []).entries()) {
    bi(at, w.t, `works[${i}].t`);
    if (w.by && !thinkers.has(w.by)) fail(at, `works[${i}] by unknown thinker "${w.by}"`);
    if (w.y != null && !year(w.y)) fail(at, `works[${i}] has a bad year`);
  }
  if (typeof s.tags !== "string") fail(at, "tags must be a string");
  if (typeof s.wiki !== "string" || !s.wiki.trim()) fail(at, "wiki must be an article title");
}

/* Thinkers */
for (const t of D.thinkers) {
  const at = `thinker "${t.id}"`;
  if (!traditions.has(t.tradition)) fail(at, `unknown tradition "${t.tradition}"`);
  if (!year(t.born)) fail(at, "born must be an integer year");
  if (t.died !== null && !(year(t.died) && t.died > t.born)) fail(at, "died must be null (living) or an integer after born");
  if (t.died === null && NOW - t.born > 105) fail(at, "listed as living but born over 105 years ago");
  for (const f of ["life", "name", "role", "idea"]) bi(at, t[f], f);
  for (const s of t.schools) {
    if (!schools.has(s)) fail(at, `unknown school "${s}"`);
    else if (!SCB[s].figures.includes(t.id)) warn(at, `school "${s}" does not list this thinker`);
  }
  for (const [i, w] of (t.works || []).entries()) {
    bi(at, w.t, `works[${i}].t`);
    if (w.y != null && !year(w.y)) fail(at, `works[${i}] has a bad year`);
  }
  if (typeof t.wiki !== "string" || !t.wiki.trim()) fail(at, "wiki must be an article title");
  /* Hosted portraits: written by scripts/fetch-portraits.mjs from `c`, never by hand */
  if (t.c && !t.portrait) fail(at, "has a Commons file (c) but no portrait: run node scripts/fetch-portraits.mjs");
  if (t.portrait) {
    const big = SITE + portraitPath(t.id), small = SITE + portraitPath(t.id, true);
    if (!t.c) fail(at, "has a portrait but no Commons file (c)");
    if (!existsSync(big) || !existsSync(small)) fail(at, "portrait files are missing: run node scripts/fetch-portraits.mjs");
    else if (contentHash(readFileSync(big), readFileSync(small)) !== t.portrait.v) fail(at, "portrait hash is stale: run node scripts/fetch-portraits.mjs");
    for (const f of ["author", "license", "page"]) if (!t.portrait[f]) fail(at, `portrait needs ${f}`);
  }
  if (t.focus != null && !/^\d+% \d+%$/.test(t.focus)) fail(at, "focus must look like \"30% 45%\"");
}
if (readFileSync(ROOT + "CREDITS.md", "utf8") !== creditsMarkdown(D)) fail("CREDITS.md", "is stale: run node scripts/fetch-portraits.mjs");

/* Links and ties */
const seen = new Set();
D.links.forEach((l, i) => {
  const at = `link ${i} (${l.from} → ${l.to})`;
  if (!schools.has(l.from) || !schools.has(l.to)) fail(at, "unknown school");
  if (l.from === l.to) fail(at, "a school cannot link to itself");
  if (!["dev", "react", "fuse"].includes(l.kind)) fail(at, `unknown kind "${l.kind}"`);
  bi(at, l.note, "note");
  const k = `${l.from}>${l.to}`;
  if (seen.has(k)) fail(at, "duplicate link"); seen.add(k);
  if (SCB[l.from] && SCB[l.to] && SCB[l.from].start > SCB[l.to].end) fail(at, "the source begins after the target ends");
});
const seenT = new Set();
D.ties.forEach((r, i) => {
  const at = `tie ${i} (${r.from} → ${r.to})`;
  if (!thinkers.has(r.from) || !thinkers.has(r.to)) fail(at, "unknown thinker");
  if (r.from === r.to) fail(at, "a thinker cannot tie to themselves");
  if (!["taught", "infl", "opp"].includes(r.kind)) fail(at, `unknown kind "${r.kind}"`);
  if (r.note != null) bi(at, r.note, "note");
  const k = `${r.from}>${r.to}>${r.kind}`;
  if (seenT.has(k)) fail(at, "duplicate tie"); seenT.add(k);
  const a = TKB[r.from], b = TKB[r.to];
  if (a && b && r.kind !== "opp" && a.born > (b.died ?? NOW)) fail(at, `${r.from} was born after ${r.to} died`);
});
for (const t of D.thinkers) if (!D.ties.some((r) => r.from === t.id || r.to === t.id)) warn(`thinker "${t.id}"`, "has no ties");
for (const s of D.schools) if (!D.links.some((l) => l.from === s.id || l.to === s.id)) warn(`school "${s.id}"`, "has no links");

/* Questions */
const qids = ids(D.questions, "questions");
for (const q of D.questions) {
  const at = `question "${q.id}"`;
  if (!branches.has(q.branch)) fail(at, `unknown branch "${q.branch}"`);
  bi(at, q.q, "q"); bi(at, q.lede, "lede");
  if (!q.answers || q.answers.length < 4) fail(at, "needs at least 4 answers");
  for (const [i, a] of (q.answers || []).entries()) {
    if (!schools.has(a.school)) fail(at, `answers[${i}] unknown school "${a.school}"`);
    if (a.by && !thinkers.has(a.by)) fail(at, `answers[${i}] unknown thinker "${a.by}"`);
    if (a.by && thinkers.has(a.by) && !TKB[a.by].schools.includes(a.school)) warn(at, `answers[${i}]: ${a.by} is not listed in ${a.school}`);
    bi(at, a.a, `answers[${i}].a`);
  }
}
for (const [i, x] of D.learning.entries()) { bi(`learning ${i}`, x.t, "t"); bi(`learning ${i}`, x.d, "d"); }

/* The page's description, social card text and JSON-LD quote these counts; keep them true */
const PAGE = readFileSync(fileURLToPath(new URL("../public/index.html", import.meta.url)), "utf8");
for (const [n, en] of [[schools.size, "schools"], [thinkers.size, "thinkers"], [traditions.size, "traditions"]]) {
  for (const m of PAGE.matchAll(new RegExp(`(\\d+) ${en}\\b`, "g"))) if (+m[1] !== n) fail("public/index.html", `says "${m[0]}", data has ${n}`);
}

for (const s of staleStamps()) fail("public/index.html", `${s} has a stale ?v= stamp: run node scripts/stamp-assets.mjs`);

if (process.argv.includes("--warnings")) for (const w of warnings) console.warn("· " + w);
if (errors.length) {
  console.error(errors.map((e) => "✗ " + e).join("\n"));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(`✓ ${traditions.size} traditions, ${schools.size} schools, ${thinkers.size} thinkers, ${D.links.length} links, ${D.ties.length} ties, ${qids.size} questions. All checks passed${warnings.length ? ` (${warnings.length} warnings; run with --warnings)` : ""}.`);

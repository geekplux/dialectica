#!/usr/bin/env node
// Writes the static, crawlable pages from the data, in English and Chinese:
//   /schools/<id>/ and /zh/schools/<id>/     one page per school
//   /thinkers/<id>/ and /zh/thinkers/<id>/   one page per thinker
//   /schools/, /thinkers/, /fact-check/, /credits/ (and their /zh/ twins)
// plus sitemap.xml and the static school list inside index.html, so search engines and readers without
// JavaScript see the whole atlas. The interactive page stays at /; every static page links back into it.
//
// Usage: node scripts/build-pages.mjs           (rewrite everything it owns)
//        node scripts/build-pages.mjs --check   (exit 1 if anything is stale; check-data runs this)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadData, SITE, NOW, portraitPath } from "./lib/data.mjs";

const ORIGIN = "https://dialectica.geekplux.org";
const GA_ID = "G-1MGF28FKRC";
const D = loadData();
const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
const TR = D.traditions, TRB = byId(TR), BRB = byId(D.branches), SCB = byId(D.schools), TKB = byId(D.thinkers);
const FACTS = D.facts || [];
const stamp = (path) => createHash("sha256").update(readFileSync(SITE + path)).digest("hex").slice(0, 10);
const CSS = `/assets/styles.css?v=${stamp("assets/styles.css")}`, JS = `/assets/page.js?v=${stamp("assets/page.js")}`;

/* ── Words ── */
const S = {
  en: {
    site: "Dialectica", atlas: "Atlas", schools: "Schools", thinkers: "Thinkers", factCheck: "Fact-check", credits: "Image credits",
    lineage: "Lineage", crossings: "Crossings", questions: "Questions", search: "Open the atlas",
    question: "The question", origin: "Why it arose", reasoning: "The reasoning", claims: "Key claims", legacy: "What it left",
    people: "Thinkers", works: "Key texts", worksOf: "Works", from: "Where it came from", to: "What it led to", answers: "Its answers to the big questions",
    inBrief: "In brief", life: "Life and thought", schoolsOf: "Schools", circle: "Their circle", meanwhile: "Meanwhile, in other traditions",
    rel: { teachers: "Teachers", shapedBy: "Shaped by", students: "Students", shaped: "Shaped", against: "Argued against", criticsOf: "Criticised by" },
    inLabel: { dev: "Grew out of", react: "Reacted against", fuse: "Borrowed from" }, outLabel: { dev: "Carried on by", react: "Opposed by", fuse: "Borrowed by" },
    record: "On the record", verdict: { confirmed: "Confirmed", corrected: "Corrected", contested: "Contested", uncertain: "Uncertain" },
    openAtlas: "Open in the atlas ↗", wiki: "Read on Wikipedia ↗", living: "living", alone: "No school: an independent voice",
    schoolTitle: (s) => `${s.name.en}: ${s.question.en}`,
    allSchools: `All ${D.schools.length} schools`, allThinkers: `All ${D.thinkers.length} thinkers`,
    schoolsLede: `Every school in the atlas, by tradition: the question it asked, why it arose and the reasoning behind it.`,
    thinkersLede: `Every thinker in the atlas, by tradition, from the Upanishadic sages to philosophers alive today.`,
    factTitle: "Fact-check", factLede: (n, c) => `What we checked, and what we found. The first draft of this atlas flagged its own doubts; each was checked against published scholarship. ${n} checks, ${c} corrections. Dates in ancient philosophy are often conventional, and where scholars disagree the atlas says so.`,
    creditsTitle: "Image credits", creditsLede: (n) => `${n} portraits are hosted with this site, resized from files on Wikimedia Commons. Each file page has the full licence and source details; check it before reusing an image. Other pictures in the atlas are loaded from Wikipedia when viewed and credited beside them.`,
    sources: "Sources", about: "About", kind: { thinker: "Thinker", school: "School", link: "Line between schools", tie: "Tie between thinkers" },
    fDates: "Schools rarely begin or end in a single year, and many ancient dates are traditional or disputed.",
    fProj: `A static site with all content in bilingual data files. A sibling of <a href="https://artisms.geekplux.org/">Art-isms</a> and <a href="https://worldlines.geekplux.org/">Worldlines</a>. Corrections are welcome on <a href="https://github.com/geekplux/dialectica">GitHub</a>.`,
    sisters: "Sister atlases", sistersT: "Three atlases, one grid",
    consent: "This site uses Google Analytics to count visits. Allow it to set analytics cookies?", yes: "Accept", no: "Decline", cookies: "Cookie settings",
    ogLocale: "en_US"
  },
  zh: {
    site: "思辨谱", atlas: "图谱", schools: "学派", thinkers: "思想家", factCheck: "史实核对", credits: "图片来源",
    lineage: "谱系", crossings: "交汇", questions: "问题", search: "打开图谱",
    question: "它的问题", origin: "为何产生", reasoning: "背后的道理", claims: "核心主张", legacy: "留下了什么",
    people: "代表人物", works: "代表著作", worksOf: "著作", from: "从哪里来", to: "通向哪里", answers: "它对几个大问题的回答",
    inBrief: "一句话", life: "生平与思想", schoolsOf: "所属学派", circle: "关系圈", meanwhile: "同一时期，其他传统中",
    rel: { teachers: "老师", shapedBy: "受其影响", students: "学生", shaped: "影响了", against: "批评过", criticsOf: "批评者" },
    inLabel: { dev: "继承自", react: "反对", fuse: "借鉴自" }, outLabel: { dev: "后继", react: "遭到反对", fuse: "被借鉴" },
    record: "史实核对", verdict: { confirmed: "已核实", corrected: "已更正", contested: "有争议", uncertain: "尚无定论" },
    openAtlas: "在图谱中查看 ↗", wiki: "在维基百科阅读 ↗", living: "在世", alone: "不属于任何学派：一个独立的声音",
    schoolTitle: (s) => `${s.name.zh}：${s.question.zh}`,
    allSchools: `全部${D.schools.length}个学派`, allThinkers: `全部${D.thinkers.length}位思想家`,
    schoolsLede: "图谱中的全部学派，按传统排列：它提出的问题、产生的缘由与背后的道理。",
    thinkersLede: "图谱中的全部思想家，按传统排列，从奥义书时代的圣人到今天仍在世的哲学家。",
    factTitle: "史实核对", factLede: (n, c) => `我们核对了什么，又发现了什么。这部图谱的初稿列出了自己没有把握的地方，每一处都对照已出版的研究逐条核实。共${n}项核对，${c}处更正。古代哲学的年代常常只是约定俗成，学界有分歧之处，图谱会如实注明。`,
    creditsTitle: "图片来源", creditsLede: (n) => `本站托管了${n}幅人物图像，均由维基共享资源上的文件缩放而来。每个文件页都有完整的许可与来源信息，转载前请先查看。图谱中的其他图片在浏览时从维基百科加载，并在旁边注明来源。`,
    sources: "来源", about: "对象", kind: { thinker: "思想家", school: "学派", link: "学派之间的连线", tie: "思想家之间的关系" },
    fDates: "学派很少在某一年突然开始或结束；许多古代年代只是传统说法，或尚有争议。",
    fProj: `一个静态网站，全部内容存放在中英双语数据文件中。它是 <a href="https://artisms.geekplux.org/">艺术流派志</a> 与 <a href="https://worldlines.geekplux.org/">世界线</a> 的姊妹项目。欢迎在 <a href="https://github.com/geekplux/dialectica">GitHub</a> 上提出修订。`,
    sisters: "姊妹图谱", sistersT: "三部图谱，一张网格",
    consent: "本站使用 Google Analytics 统计访问量。是否允许设置统计 Cookie？", yes: "接受", no: "拒绝", cookies: "Cookie 设置",
    ogLocale: "zh_CN"
  }
};

/* ── Helpers ── */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tx = (o, L) => (o ? o[L] ?? o.en : "");
const pre = (L) => (L === "zh" ? "/zh" : "");
const home = (L, hash = "") => (L === "zh" ? `/?lang=zh${hash}` : `/${hash}`);
const href = { school: (L, id) => `${pre(L)}/schools/${id}/`, thinker: (L, id) => `${pre(L)}/thinkers/${id}/` };
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:，；：、]+\S*$/, "") + "…");
function fmtYear(y, L) {
  if (y < 0) { const n = Math.abs(y).toLocaleString("en-US"); return L === "zh" ? `公元前${n}年` : `${n} BCE`; }
  return L === "zh" ? `${y}年` : (y < 1000 ? `${y} CE` : String(y));
}
const workYear = (y, L) => (y == null ? "" : (y < 1400 ? (L === "zh" ? "约" : "c. ") : "") + fmtYear(y, L));
function mix(h, w) { const n = parseInt(h.slice(1), 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255]; return "#" + c.map((v) => Math.round(v + (255 - v) * w).toString(16).padStart(2, "0")).join(""); }
function onColor(h) { const n = parseInt(h.slice(1), 16); const [r, g, b] = [n >> 16 & 255, n >> 8 & 255, n & 255].map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.28 ? "#141414" : "#fffdf7"; }
const trVars = (id) => { const c = TRB[id].color; return `--c:${c};--tint:${mix(c, 0.66)};--on:${onColor(c)}`; };
const floruit = (k) => Math.min(k.born + 40, k.died ?? NOW, NOW);
const wikiUrl = (title) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
const factsAbout = (key) => FACTS.filter((f) => f.about === key);
const paras = (s) => esc(s).split(/\n\n+/).map((p) => `<p>${p}</p>`).join("");
const portraitUrl = (k, small) => `/${portraitPath(k.id, small)}?v=${k.portrait.v}`;

/* The three sister atlases, in the order they were made; this one is solid ink */
const SISTERS = [
  { id: "artisms", name: { en: "Art-isms", zh: "艺术流派志" }, line: { en: "40 art styles across 45,000 years", zh: "四万五千年里的40个艺术流派" } },
  { id: "worldlines", name: { en: "Worldlines", zh: "世界线" }, line: { en: "26 countries and 8 regions across 15,000 years", zh: "一万五千年里的26个国家与8个地区" } },
  { id: "dialectica", name: { en: "Dialectica", zh: "思辨谱" }, line: { en: "72 schools and 204 thinkers across 8 traditions", zh: "8个传统中的72个学派与204位思想家" } }
];
const MARK = {
  artisms: '<svg viewBox="0 0 26 26" aria-hidden="true"><rect width="26" height="26" fill="#141414"/><rect x="2" y="2" width="13" height="14" fill="#d52b1e"/><rect x="17" y="2" width="7" height="14" fill="#fffdf7"/><rect x="2" y="18" width="6" height="6" fill="#1d4ed8"/><rect x="10" y="18" width="14" height="6" fill="#f3c623"/></svg>',
  worldlines: '<svg viewBox="0 0 26 26" aria-hidden="true"><rect width="26" height="26" fill="#141414"/><rect x="2" y="2" width="22" height="5" fill="#d52b1e"/><rect x="2" y="9" width="8" height="6" fill="#fffdf7"/><rect x="12" y="9" width="12" height="6" fill="#1d4ed8"/><rect x="2" y="17" width="15" height="7" fill="#f3c623"/><rect x="19" y="17" width="5" height="7" fill="#fffdf7"/></svg>',
  dialectica: '<svg viewBox="0 0 26 26" aria-hidden="true"><rect width="26" height="26" fill="#141414"/><rect x="2" y="2" width="10" height="13" fill="#d52b1e"/><rect x="14" y="2" width="10" height="6" fill="#fffdf7"/><rect x="14" y="10" width="10" height="14" fill="#1d4ed8"/><rect x="2" y="17" width="10" height="7" fill="#f3c623"/></svg>'
};
const sisters = (L) => `<nav class="sisters" aria-label="${esc(S[L].sisters)}"><div class="wrap pad"><p class="micro">${esc(S[L].sistersT)}</p><div class="sisters-row">${SISTERS.map((s) =>
  s.id === "dialectica" ? `<span class="sister here" aria-current="page">${MARK[s.id]}<b>${esc(s.name[L])}</b><span>${esc(s.line[L])}</span></span>`
  : `<a class="sister" href="https://${s.id}.geekplux.org/${L === "zh" ? "?lang=zh" : ""}">${MARK[s.id]}<b>${esc(s.name[L])}</b><span>${esc(s.line[L])}</span></a>`).join("")}</div></div></nav>`;

/* ── Page shell ── */
function shell(L, { path, title, description, image, imageAlt, jsonld, body, ogType = "article" }) {
  const W = S[L];
  const enPath = L === "zh" ? path.replace(/^\/zh/, "") : path, zhPath = "/zh" + enPath;
  return `<!doctype html>
<html lang="${L === "zh" ? "zh-CN" : "en"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${ORIGIN}${path}">
<link rel="alternate" hreflang="en" href="${ORIGIN}${enPath}">
<link rel="alternate" hreflang="zh-Hans" href="${ORIGIN}${zhPath}">
<link rel="alternate" hreflang="x-default" href="${ORIGIN}${enPath}">
<meta name="theme-color" content="#fffdf7">
<meta name="color-scheme" content="light">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(W.site)}">
<meta property="og:url" content="${ORIGIN}${path}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ORIGIN}${image || "/og.png"}">
<meta property="og:image:alt" content="${esc(imageAlt || W.site)}">
<meta property="og:locale" content="${W.ogLocale}">
<meta name="twitter:card" content="${image ? "summary" : "summary_large_image"}">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>
<script>
/* Google Analytics 4 with Consent Mode v2, on the production domain only (see index.html); page.js sends the page view */
(function () {
  var GA_ID = "${GA_ID}";
  if (location.hostname !== "dialectica.geekplux.org") return;
  var choice = null;
  try { choice = localStorage.getItem("dialectica-consent"); } catch (e) { /* storage blocked */ }
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: choice === "granted" ? "granted" : "denied" });
  gtag("js", new Date());
  gtag("config", GA_ID, { send_page_view: false, cookie_domain: "none" });
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
})();
</script>
<link rel="stylesheet" href="${CSS}">
</head>
<body class="page">
<header class="topbar">
  <div class="wrap pad">
    <a class="brand" href="${home(L)}"><svg viewBox="0 0 26 26" aria-hidden="true"><rect width="26" height="26" fill="#141414"/><rect x="2" y="2" width="10" height="13" fill="#d52b1e"/><rect x="14" y="2" width="10" height="6" fill="#fffdf7"/><rect x="14" y="10" width="10" height="14" fill="#1d4ed8"/><rect x="2" y="17" width="10" height="7" fill="#f3c623"/></svg><span>${esc(W.site)}</span></a>
    <nav class="nav" aria-label="${L === "zh" ? "栏目" : "Sections"}">
      <a href="${home(L, "#lineage")}">${esc(W.lineage)}</a>
      <a href="${home(L, "#crossings")}">${esc(W.crossings)}</a>
      <a href="${home(L, "#questions")}">${esc(W.questions)}</a>
      <a href="${pre(L)}/schools/">${esc(W.schools)}</a>
      <a href="${pre(L)}/thinkers/">${esc(W.thinkers)}</a>
    </nav>
    <a class="search-btn" href="${home(L)}">${esc(W.search)}</a>
    <div class="lang" role="group" aria-label="${L === "zh" ? "语言" : "Language"}">
      ${L === "en" ? `<a aria-current="true" href="${enPath}">EN</a><a lang="zh-CN" hreflang="zh-Hans" href="${zhPath}">中文</a>` : `<a hreflang="en" href="${enPath}">EN</a><a aria-current="true" lang="zh-CN" href="${zhPath}">中文</a>`}
    </div>
  </div>
</header>
<main class="article">
${body}
</main>
<footer>
${sisters(L)}
  <div class="wrap pad">
    <div><h3>${esc(W.site)}</h3><p>${esc(W.fDates)}</p></div>
    <div><h3>${esc(W.factCheck)} · ${esc(W.credits)}</h3><p><a href="${pre(L)}/fact-check/">${esc(W.factCheck)}</a> · <a href="${pre(L)}/credits/">${esc(W.credits)}</a> · <a href="${pre(L)}/schools/">${esc(W.allSchools)}</a> · <a href="${pre(L)}/thinkers/">${esc(W.allThinkers)}</a></p></div>
    <div><p>${W.fProj}</p><p><button type="button" class="linkish" id="consent-open" hidden>${esc(W.cookies)}</button></p></div>
  </div>
</footer>
<div class="consent" id="consent" role="region" aria-labelledby="consent-text" hidden>
  <p id="consent-text">${esc(W.consent)}</p>
  <div class="consent-actions"><button type="button" class="btn solid" data-consent="granted">${esc(W.yes)}</button><button type="button" class="btn" data-consent="denied">${esc(W.no)}</button></div>
</div>
<script src="${JS}"></script>
</body>
</html>
`;
}
const crumbs = (L, items) => `<nav class="crumbs" aria-label="${L === "zh" ? "位置" : "Breadcrumb"}">${items.map(([name, url], i) => i < items.length - 1 ? `<a href="${url}">${esc(name)}</a>` : `<span aria-current="page">${esc(name)}</span>`).join(" / ")}</nav>`;
const crumbLd = (items) => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: ORIGIN + url })) });

/* ── Rows shared by the pages ── */
const thinkerRow = (L, k, note) => `<a class="par" href="${href.thinker(L, k.id)}"><span><i style="${trVars(k.tradition)}"></i>${esc(tx(k.life, L))}</span><span class="par-main"><strong>${esc(tx(k.name, L))}</strong>${note ? `<em>${esc(tx(note, L))}</em>` : `<small>${esc(tx(k.role, L))}</small>`}</span></a>`;
const schoolRow = (L, s, label, note, kind) => `<a class="par" href="${href.school(L, s.id)}"><span><i style="${trVars(s.tradition)}"></i>${esc(label)}${kind ? `<br><i class="ln ${kind}" style="width:22px;margin-top:6px"></i>` : ""}</span><span class="par-main"><strong>${esc(tx(s.name, L))}</strong>${note ? `<em>${esc(tx(note, L))}</em>` : ""}</span></a>`;
const workRow = (L, w, author) => `<div class="par"><span>${esc(workYear(w.y, L))}</span><span class="par-main"><strong>${esc(tx(w.t, L))}</strong>${author ? `<small><a href="${href.thinker(L, author.id)}">${esc(tx(author.name, L))}</a></small>` : ""}</span></div>`;
function factBlock(L, keys) {
  const list = keys.flatMap(factsAbout);
  if (!list.length) return "";
  return `<section class="d-sec"><h2>${esc(S[L].record)}</h2>${list.map((f) => factItem(L, f)).join("")}<p class="more"><a href="${pre(L)}/fact-check/">${esc(S[L].factCheck)} →</a></p></section>`;
}
const factItem = (L, f) => `<div class="fc fc-${f.verdict}"><span class="fc-v">${esc(S[L].verdict[f.verdict])}</span><p class="fc-claim">${esc(tx(f.claim, L))}</p><p>${esc(tx(f.finding, L))}</p>${f.sources?.length ? `<p class="fc-src">${esc(S[L].sources)}: ${f.sources.map((s) => `<a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title)}</a>`).join(" · ")}</p>` : ""}</div>`;

/* ── School page ── */
function schoolPage(L, s) {
  const W = S[L], tr = TRB[s.tradition], path = href.school(L, s.id);
  const ins = D.links.filter((l) => l.to === s.id && SCB[l.from]), outs = D.links.filter((l) => l.from === s.id && SCB[l.to]);
  const figs = s.figures.map((id) => TKB[id]).filter(Boolean);
  const answers = D.questions.flatMap((q) => q.answers.filter((a) => a.school === s.id).map((a) => ({ q, a })));
  const items = [[W.site, home(L)], [W.schools, `${pre(L)}/schools/`], [tx(s.name, L), path]];
  const body = `
<article class="art" style="${trVars(s.tradition)}">
  ${crumbs(L, items)}
  <p class="d-date"><span class="sw" style="${trVars(s.tradition)}"></span>${esc(tx(tr.name, L))} · ${esc(tx(s.dates, L))}</p>
  <h1>${esc(tx(s.name, L))}</h1>
  <p class="d-sum">${esc(tx(s.idea, L))}</p>
  <div class="fact"><span class="micro">${esc(W.question)}</span><p class="q">${esc(tx(s.question, L))}</p></div>
  <div class="fact"><span class="micro">${esc(W.origin)}</span><p>${esc(tx(s.origin, L))}</p></div>
  <div class="fact"><span class="micro">${esc(W.reasoning)}</span><p>${esc(tx(s.reasoning, L))}</p></div>
  <div class="fact"><span class="micro">${esc(W.claims)}</span><ol class="claims">${s.claims.map((c) => `<li><span>${esc(tx(c, L))}</span></li>`).join("")}</ol></div>
  <div class="fact"><span class="micro">${esc(W.legacy)}</span><p>${esc(tx(s.legacy, L))}</p></div>
  <div class="stamps">${s.branches.map((b) => `<span class="stamp">${esc(tx(BRB[b].name, L))}</span>`).join("")}</div>
  <div class="d-links"><a href="${home(L, `#s=${s.id}`)}">${esc(W.openAtlas)}</a><a href="${esc(wikiUrl(s.wiki))}" rel="noopener" target="_blank">${esc(W.wiki)}</a></div>
  ${figs.length ? `<section class="d-sec"><h2>${esc(W.people)}</h2>${figs.map((k) => thinkerRow(L, k)).join("")}</section>` : ""}
  ${s.works?.length ? `<section class="d-sec"><h2>${esc(W.works)}</h2>${s.works.map((w) => workRow(L, w, TKB[w.by])).join("")}</section>` : ""}
  ${ins.length ? `<section class="d-sec"><h2>${esc(W.from)}</h2>${ins.map((l) => schoolRow(L, SCB[l.from], W.inLabel[l.kind], l.note, l.kind)).join("")}</section>` : ""}
  ${outs.length ? `<section class="d-sec"><h2>${esc(W.to)}</h2>${outs.map((l) => schoolRow(L, SCB[l.to], W.outLabel[l.kind], l.note, l.kind)).join("")}</section>` : ""}
  ${answers.length ? `<section class="d-sec"><h2>${esc(W.answers)}</h2>${answers.map(({ q, a }) => `<a class="par" href="${home(L, `#q=${q.id}`)}"><span>${esc(tx(BRB[q.branch].name, L))}</span><span class="par-main"><strong>${esc(tx(q.q, L))}</strong><em>${esc(tx(a.a, L))}</em></span></a>`).join("")}</section>` : ""}
  ${factBlock(L, [`school:${s.id}`, ...ins.map((l) => `link:${l.from}>${l.to}`)])}
</article>`;
  const jsonld = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: tx(s.name, L), description: tx(s.idea, L), inLanguage: L === "zh" ? "zh-Hans" : "en", url: ORIGIN + path,
      about: { "@type": "Thing", name: s.name.en, alternateName: s.name.zh, sameAs: wikiUrl(s.wiki) },
      isPartOf: { "@type": "WebSite", name: "Dialectica", url: ORIGIN + "/" }, license: "https://creativecommons.org/licenses/by-sa/4.0/" },
    crumbLd(items)] };
  return shell(L, { path, title: `${W.schoolTitle(s)} | ${W.site}`, description: clip(`${tx(s.idea, L)} ${tx(s.origin, L)}`), jsonld, body });
}

/* ── Thinker page ── */
function thinkerPage(L, k) {
  const W = S[L], tr = TRB[k.tradition], path = href.thinker(L, k.id);
  const rel = (kind, dir) => D.ties.filter((r) => r.kind === kind && (dir > 0 ? r.from === k.id : r.to === k.id)).map((r) => ({ k: TKB[dir > 0 ? r.to : r.from], note: r.note, r })).filter((x) => x.k);
  const groups = [["teachers", rel("taught", -1)], ["shapedBy", rel("infl", -1)], ["students", rel("taught", 1)], ["shaped", rel("infl", 1)], ["against", rel("opp", -1)], ["criticsOf", rel("opp", 1)]];
  const fl = floruit(k), end = k.died ?? NOW;
  const meanwhile = D.thinkers.filter((x) => x.tradition !== k.tradition && x.born < end && (x.died ?? NOW) > k.born)
    .sort((a, b) => Math.abs(floruit(a) - fl) - Math.abs(floruit(b) - fl)).slice(0, 6).sort((a, b) => a.born - b.born);
  const schools = k.schools.map((id) => SCB[id]).filter(Boolean);
  const items = [[W.site, home(L)], [W.thinkers, `${pre(L)}/thinkers/`], [tx(k.name, L), path]];
  const im = k.portrait;
  const fig = im ? `<figure class="d-fig portrait"><img class="ok" src="${portraitUrl(k)}" width="${im.w}" height="${im.h}" alt="${esc(tx(k.name, L))}"${k.focus ? ` style="object-position:${k.focus}"` : ""}><figcaption>${esc(im.author)} · ${im.licenseUrl ? `<a href="${esc(im.licenseUrl)}" rel="noopener" target="_blank">${esc(im.license)}</a>` : esc(im.license)} · <a href="${esc(im.page)}" rel="noopener" target="_blank">Commons ↗</a></figcaption></figure>` : "";
  const tieKeys = groups.flatMap(([, list]) => list.map((x) => `tie:${x.r.from}>${x.r.to}`));
  const body = `
<article class="art" style="${trVars(k.tradition)}">
  ${crumbs(L, items)}
  <p class="d-date"><span class="sw" style="${trVars(k.tradition)}"></span>${esc(tx(tr.name, L))} · ${esc(tx(k.life, L))}${k.died == null ? ` · ${esc(W.living)}` : ""}</p>
  <h1>${esc(tx(k.name, L))}</h1>
  <p class="d-role">${esc(tx(k.role, L))}</p>
  ${fig}
  <p class="d-sum">${esc(tx(k.idea, L))}</p>
  ${k.detail ? `<section class="d-sec prose"><h2>${esc(W.life)}</h2>${paras(tx(k.detail, L))}</section>` : ""}
  <div class="stamps">${schools.length ? schools.map((s) => `<a class="stamp" href="${href.school(L, s.id)}" style="${trVars(s.tradition)}">${esc(tx(s.name, L))}</a>`).join("") : `<span class="stamp">${esc(W.alone)}</span>`}</div>
  <div class="d-links"><a href="${home(L, `#t=${k.id}`)}">${esc(W.openAtlas)}</a><a href="${esc(wikiUrl(k.wiki))}" rel="noopener" target="_blank">${esc(W.wiki)}</a></div>
  ${k.works?.length ? `<section class="d-sec"><h2>${esc(W.worksOf)}</h2>${k.works.map((w) => workRow(L, w)).join("")}</section>` : ""}
  ${groups.filter(([, l]) => l.length).map(([g, list]) => `<section class="d-sec"><h2>${esc(W.rel[g])}</h2>${list.map((x) => thinkerRow(L, x.k, x.note)).join("")}</section>`).join("")}
  ${meanwhile.length ? `<section class="d-sec"><h2>${esc(W.meanwhile)}</h2>${meanwhile.map((x) => thinkerRow(L, x)).join("")}</section>` : ""}
  ${factBlock(L, [`thinker:${k.id}`, ...tieKeys])}
</article>`;
  const person = { "@type": "Person", name: k.name.en, alternateName: k.name.zh, description: tx(k.idea, L), url: ORIGIN + path, sameAs: wikiUrl(k.wiki) };
  if (k.born > 0) person.birthDate = String(k.born);
  if (k.died && k.died > 0) person.deathDate = String(k.died);
  if (im) person.image = ORIGIN + portraitUrl(k);
  const jsonld = { "@context": "https://schema.org", "@graph": [{ "@type": "ProfilePage", url: ORIGIN + path, inLanguage: L === "zh" ? "zh-Hans" : "en", mainEntity: person }, crumbLd(items)] };
  const title = L === "zh" ? `${k.name.zh}（${k.life.zh}）：${k.role.zh} | ${W.site}` : `${k.name.en} (${k.life.en}): ${k.role.en} | ${W.site}`;
  return shell(L, { path, title, description: clip(`${tx(k.idea, L)} ${tx(k.detail, L) || tx(k.role, L)}`.replace(/\n+/g, " ")),
    image: im ? portraitUrl(k) : null, imageAlt: tx(k.name, L), jsonld, body, ogType: "profile" });
}

/* ── Hubs ── */
function hub(L, kind) {
  const W = S[L], path = `${pre(L)}/${kind}/`, isS = kind === "schools";
  const items = [[W.site, home(L)], [isS ? W.schools : W.thinkers, path]];
  const cols = TR.map((tr) => {
    const list = isS ? D.schools.filter((s) => s.tradition === tr.id) : D.thinkers.filter((k) => k.tradition === tr.id);
    return `<section class="s-col" style="${trVars(tr.id)}"><header><span class="micro">${list.length}</span><h2>${esc(tx(tr.name, L))}</h2><p>${esc(tx(tr.description, L))}</p></header><div class="s-list">${list.map((x) =>
      `<a class="s-item" href="${isS ? href.school(L, x.id) : href.thinker(L, x.id)}"><span>${esc(tx(isS ? x.dates : x.life, L))}</span><b>${esc(tx(x.name, L))}</b><small>${esc(tx(isS ? x.idea : x.role, L))}</small></a>`).join("")}</div></section>`;
  }).join("");
  const body = `<div class="art wide">${crumbs(L, items)}<h1>${esc(isS ? W.allSchools : W.allThinkers)}</h1><p class="d-sum">${esc(isS ? W.schoolsLede : W.thinkersLede)}</p></div><div class="s-index">${cols}</div>`;
  const jsonld = { "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: isS ? W.allSchools : W.allThinkers, url: ORIGIN + path, inLanguage: L === "zh" ? "zh-Hans" : "en" }, crumbLd(items)] };
  return shell(L, { path, title: `${isS ? W.allSchools : W.allThinkers} | ${W.site}`, description: isS ? W.schoolsLede : W.thinkersLede, jsonld, body, ogType: "website" });
}
function factPage(L) {
  const W = S[L], path = `${pre(L)}/fact-check/`, items = [[W.site, home(L)], [W.factTitle, path]];
  const name = (key) => {
    const [kind, rest] = key.split(":"), [a, b] = rest.split(">");
    if (kind === "thinker") return `<a href="${href.thinker(L, a)}">${esc(tx(TKB[a]?.name, L) || a)}</a>`;
    if (kind === "school") return `<a href="${href.school(L, a)}">${esc(tx(SCB[a]?.name, L) || a)}</a>`;
    if (kind === "link") return `<a href="${href.school(L, a)}">${esc(tx(SCB[a]?.name, L) || a)}</a> → <a href="${href.school(L, b)}">${esc(tx(SCB[b]?.name, L) || b)}</a>`;
    return `<a href="${href.thinker(L, a)}">${esc(tx(TKB[a]?.name, L) || a)}</a> → <a href="${href.thinker(L, b)}">${esc(tx(TKB[b]?.name, L) || b)}</a>`;
  };
  const tradOf = (key) => { const [kind, rest] = key.split(":"), a = rest.split(">")[0]; return (kind === "thinker" || kind === "tie" ? TKB[a] : SCB[a])?.tradition; };
  const sections = TR.map((tr) => {
    const list = FACTS.filter((f) => tradOf(f.about) === tr.id);
    if (!list.length) return "";
    return `<section class="d-sec"><h2><span class="sw" style="${trVars(tr.id)}"></span>${esc(tx(tr.name, L))}</h2>${list.map((f) => `<div class="fc-row"><p class="fc-about">${esc(W.kind[f.about.split(":")[0]])} · ${name(f.about)}</p>${factItem(L, f)}</div>`).join("")}</section>`;
  }).join("");
  const corrected = FACTS.filter((f) => f.verdict === "corrected").length;
  const counts = Object.keys(W.verdict).map((v) => `<span class="fc fc-${v} fc-count"><span class="fc-v">${esc(W.verdict[v])}</span> ${FACTS.filter((f) => f.verdict === v).length}</span>`).join("");
  const body = `<article class="art">${crumbs(L, items)}<h1>${esc(W.factTitle)}</h1><p class="d-sum">${esc(W.factLede(FACTS.length, corrected))}</p><div class="fc-counts">${counts}</div>${sections}</article>`;
  const jsonld = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: W.factTitle, url: ORIGIN + path, inLanguage: L === "zh" ? "zh-Hans" : "en" }, crumbLd(items)] };
  return shell(L, { path, title: `${W.factTitle} | ${W.site}`, description: clip(W.factLede(FACTS.length, corrected)), jsonld, body, ogType: "website" });
}
function creditsPage(L) {
  const W = S[L], path = `${pre(L)}/credits/`, items = [[W.site, home(L)], [W.creditsTitle, path]];
  const hosted = D.thinkers.filter((k) => k.portrait);
  const rows = hosted.map((k) => `<div class="cr"><a href="${href.thinker(L, k.id)}"><img src="${portraitUrl(k, true)}" alt="${esc(tx(k.name, L))}" loading="lazy" width="${k.portrait.w}" height="${k.portrait.h}"${k.focus ? ` style="object-position:${k.focus}"` : ""}></a><p><b><a href="${href.thinker(L, k.id)}">${esc(tx(k.name, L))}</a></b>${esc(k.portrait.author)} · ${k.portrait.licenseUrl ? `<a href="${esc(k.portrait.licenseUrl)}" rel="noopener" target="_blank">${esc(k.portrait.license)}</a>` : esc(k.portrait.license)} · <a href="${esc(k.portrait.page)}" rel="noopener" target="_blank">Commons ↗</a></p></div>`).join("");
  const body = `<article class="art">${crumbs(L, items)}<h1>${esc(W.creditsTitle)}</h1><p class="d-sum">${esc(W.creditsLede(hosted.length))}</p><div class="credits">${rows}</div></article>`;
  const jsonld = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: W.creditsTitle, url: ORIGIN + path }, crumbLd(items)] };
  return shell(L, { path, title: `${W.creditsTitle} | ${W.site}`, description: W.creditsLede(hosted.length), jsonld, body, ogType: "website" });
}

/* ── Everything this script owns ── */
const out = new Map();
const page = (path, html) => out.set(path.replace(/^\//, "") + "index.html", html);
for (const L of ["en", "zh"]) {
  D.schools.forEach((s) => page(href.school(L, s.id), schoolPage(L, s)));
  D.thinkers.forEach((k) => page(href.thinker(L, k.id), thinkerPage(L, k)));
  page(`${pre(L)}/schools/`, hub(L, "schools"));
  page(`${pre(L)}/thinkers/`, hub(L, "thinkers"));
  page(`${pre(L)}/fact-check/`, factPage(L));
  page(`${pre(L)}/credits/`, creditsPage(L));
}
/* Sitemap: the atlas in both languages, then every generated page with its alternate */
const enPaths = ["/", ...[...out.keys()].filter((p) => !p.startsWith("zh/")).map((p) => "/" + p.replace(/index\.html$/, ""))];
const alt = (en) => en === "/" ? ["/", "/?lang=zh"] : [en, "/zh" + en];
const urlEntry = (loc, [en, zh]) => `  <url>\n    <loc>${ORIGIN}${loc}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${en}"/>\n    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${ORIGIN}${zh}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${en}"/>\n  </url>`;
out.set("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated by node scripts/build-pages.mjs. Do not edit by hand. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${enPaths.flatMap((en) => { const a = alt(en); return [urlEntry(a[0], a), urlEntry(a[1], a)]; }).join("\n")}\n</urlset>\n`);
/* index.html: a static list of every school, inside the index the page redraws, so crawlers can follow it */
const INDEX = SITE + "index.html";
const staticIndex = TR.map((tr) => `<section class="s-col" style="${trVars(tr.id)}"><header><h3>${esc(tr.name.en)}</h3></header><div class="s-list">${D.schools.filter((s) => s.tradition === tr.id).map((s) => `<a class="s-item" href="/schools/${s.id}/"><span>${esc(s.dates.en)}</span><b>${esc(s.name.en)}</b><small>${esc(s.idea.en)}</small></a>`).join("")}</div></section>`).join("");
const indexHtml = readFileSync(INDEX, "utf8").replace(/(<!-- pages:index -->)[\s\S]*?(<!-- \/pages:index -->)/, `$1${staticIndex}$2`);
out.set("index.html", indexHtml);

/* ── Write, or check ── */
const OWNED = ["schools", "thinkers", "fact-check", "credits", "zh"];
if (process.argv.includes("--check")) {
  const stale = [];
  for (const [p, html] of out) if (!existsSync(SITE + p) || readFileSync(SITE + p, "utf8") !== html) stale.push(p);
  const walk = (dir) => readdirSync(SITE + dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
  for (const root of OWNED) if (existsSync(SITE + root)) for (const f of walk(root)) if (!out.has(f)) stale.push(f + " (no longer generated)");
  if (stale.length) { console.error(`✗ ${stale.length} generated file(s) are stale, e.g. ${stale.slice(0, 3).join(", ")}: run node scripts/build-pages.mjs`); process.exit(1); }
  console.log(`✓ ${out.size} generated files are up to date.`);
} else {
  for (const root of OWNED) rmSync(SITE + root, { recursive: true, force: true });
  for (const [p, html] of out) { mkdirSync(dirname(SITE + p), { recursive: true }); writeFileSync(SITE + p, html); }
  console.log(`Wrote ${out.size} files: ${D.schools.length * 2} school pages, ${D.thinkers.length * 2} thinker pages, hubs, fact-check, credits, sitemap.xml and the static index in index.html.`);
}

/* Dialectica — the family tree, the thinkers' network, the questions, i18n and routing.
   Plain browser JavaScript, no build step. */
(function () {
  "use strict";

  const D = window.DIALECTICA;
  const NOW = 2026;
  const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
  const TR = D.traditions, BR = D.branches, ERA = D.eras, QS = D.questions;
  const SC = D.schools.slice().sort((a, b) => a.start - b.start || a.end - b.end);
  const TK = D.thinkers.slice().sort((a, b) => a.born - b.born);
  const LK = D.links, TI = D.ties;
  const TRB = byId(TR), BRB = byId(BR), SCB = byId(SC), TKB = byId(TK), QSB = byId(QS);
  const MIN_YEAR = ERA[0].start;
  const ANSWERS = QS.reduce((n, q) => n + q.answers.length, 0);

  const UI = {
    en: {
      docTitle: "Dialectica: a family tree of philosophy, East and West",
      docDesc: () => `A Mondrian-style atlas of philosophy. Follow ${SC.length} schools and ${TK.length} thinkers across ${TR.length} traditions and 3,000 years: where each idea came from, the argument behind it, who taught and who answered whom. In English and Chinese.`,
      brand: "Dialectica", navLineage: "Lineage", navThinkers: "Thinkers", navQuestions: "Questions", navSchools: "Schools", navLearn: "How to read", search: "Search",
      star: "Star", starTitle: "Star Dialectica on GitHub",
      kicker: "A family tree of philosophy, East and West",
      h1a: "DIALEC", h1b: "TICA",
      dek: "Every idea is <strong>an answer to an older one</strong>. Follow the arguments: who inherited them, who turned against them, and why.",
      stats: () => `${TR.length} traditions · ${SC.length} schools · ${TK.length} thinkers · ${LK.length} lines of influence`,
      cue: "Begin with the family tree",
      heroTitle: "The city of ideas",
      heroCap: "Each coloured street is a tradition. Each upright is an idea that crossed into another. Squares are thinkers, tinted when they learned across a border.",
      heroLearned: (x) => `Learned from ${x}`,
      m1t: "Read → across", m1: "Each lane is a tradition and time runs left to right. A block is a school, as long as it lasted.",
      m2t: "Follow ⤳ a line", m2: "Solid lines carry an idea forward. Dashed red lines argue against it. Dotted blue lines cross between traditions.",
      m3t: "Ask ? a question", m3: "Put one question to every tradition, and read their answers side by side.",
      linNo: "01 · Lineage", linTitle: "The family tree of ideas",
      linLede: "Each block is a school, drawn for as long as it lasted. Lines show what passed between them. Select a school to light up where it came from and what it led to.",
      linRange: () => `1000 BCE → today · ${SC.length} schools · ${LK.length} lines`,
      traceLbl: "Trace", traceNear: "Direct links", traceAll: "Whole lineage",
      branchLbl: "Branch", allBranches: "All branches",
      lk: { dev: "carries an idea forward", react: "argues against", fuse: "crosses traditions" },
      thNo: "02 · Thinkers", thTitle: "Who taught, read and argued with whom",
      thLede: "Each square is a thinker, placed at about the age of forty. Lines join teachers to students, readers to the books that shaped them, and critics to their targets.",
      thRange: () => `${TK.length} thinkers · ${TI.length} relationships`,
      tiesLbl: "Show", thHelp: "Hover to see a thinker’s circle · select to open their page",
      tie: { taught: "taught", infl: "influenced", opp: "argued against" },
      qNo: "03 · Questions", qTitle: "One question, many answers",
      qLede: "Philosophy is easiest to compare at the level of its questions. Pick one and read how each tradition answered it, in order of time.",
      qRange: () => `${QS.length} questions · ${ANSWERS} answers`,
      sNo: "04 · Schools", sTitle: "Every school, by tradition",
      sLede: "An index of the whole atlas. Each entry opens the school’s page: the question it asked, why it arose, the reasoning behind it, its people and its books.",
      sRange: () => `${SC.length} schools in ${TR.length} traditions`,
      nSchools: (n) => `${n} school${n === 1 ? "" : "s"}`, nThinkers: (n) => `${n} thinker${n === 1 ? "" : "s"}`,
      axisCorner: "Traditions ↓<br>Time →",
      learnTitle: "How to read philosophy without getting lost.",
      learnNote: "This atlas is a map, not the territory: a deliberately selective set of schools, thinkers and lines of influence. Every line is a simplification of conversations that ran for generations.",
      fDatesT: "About the dates",
      fDates: "Schools rarely begin or end in a single year, and many ancient dates, especially in India and early China, are traditional or disputed. The blocks show conventional spans; the panels say when a date is uncertain.",
      fImgT: "About the images",
      fImg: "Portraits are the lead images of English Wikipedia articles, shown only when the file is on Wikimedia Commons. Every panel links to its source; check the file page before reusing an image.",
      fProjT: "The project",
      fProj: "A static site with no build step: HTML, CSS and plain JavaScript, with all content in bilingual data files. A sibling of <a href=\"https://artisms.geekplux.org/\">Art-isms</a> and <a href=\"https://worldlines.geekplux.org/\">Worldlines</a>. Corrections are welcome on <a href=\"https://github.com/geekplux/dialectica\">GitHub</a>.",
      consentText: "This site uses Google Analytics to count visits. Allow it to set analytics cookies?", consentYes: "Accept", consentNo: "Decline", cookieSettings: "Cookie settings",
      kSchoolTop: "School · lineage", kThinkerTop: "Thinker · circle",
      question: "The question", origin: "Why it arose", reasoning: "The reasoning", claims: "Key claims", legacy: "What it left",
      people: "Thinkers", works: "Key texts", worksOf: "Works", from: "Where it came from", to: "What it led to", answersH: "Its answers to the big questions",
      inLabel: { dev: "Grew out of", react: "Reacted against", fuse: "Borrowed from" },
      outLabel: { dev: "Carried on by", react: "Opposed by", fuse: "Borrowed by" },
      rel: { teachers: "Teachers", students: "Students", shapedBy: "Shaped by", shaped: "Shaped", against: "Argued against", criticsOf: "Criticised by" },
      meanwhile: "Meanwhile, in other traditions", schoolsOf: "Schools",
      showTree: "Show in the family tree ↑", showNet: "Show in the network ↑",
      readWiki: "Read on Wikipedia ↗", source: "Image", plate: "No free image here",
      living: "living", alone: "No school: an independent voice",
      searchHelp: "Try “virtue”, “emptiness”, “Kant”, “the self” or a book title. Press Esc to close.", searchPh: "Search philosophy…",
      kSchool: "School", kThinker: "Thinker", kWork: "Work",
      noResults: (q) => `Nothing matches “${q}”. Try a broader idea, a name or a tradition.`,
      close: "Close", zoom: "Zoom", zoomIn: "Zoom in", zoomOut: "Zoom out", now: "today",
      ariaSections: "Sections", ariaLang: "Language", ariaManifesto: "How to read the atlas", ariaBranches: "Filter by branch", ariaQuestions: "Questions"
    },
    zh: {
      docTitle: "思辨谱：东西方哲学的家族谱系",
      docDesc: () => `蒙德里安风格的哲学图谱。沿着${TR.length}个传统、三千年的时间，追踪${SC.length}个学派与${TK.length}位思想家：每种思想从哪里来、背后的道理是什么、谁师承谁、谁又反驳了谁。中英双语。`,
      brand: "思辨谱", navLineage: "谱系", navThinkers: "思想家", navQuestions: "问题", navSchools: "学派", navLearn: "阅读方法", search: "搜索",
      star: "星标", starTitle: "在 GitHub 上给思辨谱加星标",
      kicker: "一部东西方哲学的家族谱系",
      h1a: "思辨", h1b: "谱",
      dek: "每一种思想，都是<strong>对更早思想的回答</strong>。沿着论证走下去：谁继承了它，谁反对了它，又是为什么。",
      stats: () => `${TR.length} 个传统 · ${SC.length} 个学派 · ${TK.length} 位思想家 · ${LK.length} 条影响线索`,
      cue: "从家族谱系开始",
      heroTitle: "思想之城",
      heroCap: "每条彩色街道是一个传统，每条竖线是一次跨入别的传统的思想。小方块是思想家；跨越边界求学的人，带着别处的颜色。",
      heroLearned: (x) => `师法于${x}`,
      m1t: "横向 → 阅读", m1: "每条泳道是一个传统，时间从左向右。一个色块就是一个学派，长度即它延续的时间。",
      m2t: "沿着 ⤳ 线索", m2: "实线把思想传下去，红色虚线是反对，蓝色点线是跨传统的吸收。",
      m3t: "追问 ? 一个问题", m3: "把同一个问题抛给每个传统，并排读它们的回答。",
      linNo: "01 · 谱系", linTitle: "思想的家族树",
      linLede: "每个色块是一个学派，长度即它延续的时间；连线表示它们之间传递了什么。点选一个学派，就能照亮它从哪里来、又通向哪里。",
      linRange: () => `公元前1000年 → 今天 · ${SC.length}个学派 · ${LK.length}条线索`,
      traceLbl: "追溯", traceNear: "直接关联", traceAll: "整条谱系",
      branchLbl: "分支", allBranches: "全部分支",
      lk: { dev: "继承发展", react: "批判反对", fuse: "跨传统吸收" },
      thNo: "02 · 思想家", thTitle: "谁师承谁，谁读过谁，谁又反驳了谁",
      thLede: "每个方块是一位思想家，大致放在他们四十岁的位置。连线把老师与学生、读者与塑造他们的著作、批评者与其对象连在一起。",
      thRange: () => `${TK.length}位思想家 · ${TI.length}条关系`,
      tiesLbl: "显示", thHelp: "悬停查看一位思想家的关系圈 · 点击打开详情",
      tie: { taught: "师承", infl: "影响", opp: "论敌" },
      qNo: "03 · 问题", qTitle: "同一个问题，许多种回答",
      qLede: "在“问题”的层面上，哲学最容易比较。选一个问题，按时间顺序读各个传统怎样回答它。",
      qRange: () => `${QS.length}个问题 · ${ANSWERS}个回答`,
      sNo: "04 · 学派", sTitle: "按传统排列的全部学派",
      sLede: "整部图谱的索引。每个条目都会打开学派详情：它提出的问题、产生的缘由、背后的道理、代表人物与代表著作。",
      sRange: () => `${TR.length}个传统中的${SC.length}个学派`,
      nSchools: (n) => `${n} 个学派`, nThinkers: (n) => `${n} 位思想家`,
      axisCorner: "传统 ↓<br>时间 →",
      learnTitle: "如何读哲学而不迷路。",
      learnNote: "这部图谱是地图，不是疆域本身：它有意挑选了一部分学派、思想家与影响线索。每一条连线，都是对延续了几代人的对话的简化。",
      fDatesT: "关于年代",
      fDates: "学派很少在某一年突然开始或结束；许多古代年代，尤其是印度与先秦的年代，都只是传统说法或尚有争议。色块显示的是约定俗成的时间跨度，年代不确定之处会在详情中注明。",
      fImgT: "关于图片",
      fImg: "人物图像取自英文维基百科条目的首图，且仅在文件位于维基共享资源时显示。每张图都链接到来源页；转载前请先查看文件页的许可信息。",
      fProjT: "关于项目",
      fProj: "一个无需构建的静态网站：HTML、CSS 与原生 JavaScript，全部内容存放在中英双语数据文件中。它是 <a href=\"https://artisms.geekplux.org/\">艺术流派志</a> 与 <a href=\"https://worldlines.geekplux.org/\">世界线</a> 的姊妹项目。欢迎在 <a href=\"https://github.com/geekplux/dialectica\">GitHub</a> 上提出修订。",
      consentText: "本站使用 Google Analytics 统计访问量。是否允许设置统计 Cookie？", consentYes: "接受", consentNo: "拒绝", cookieSettings: "Cookie 设置",
      kSchoolTop: "学派 · 谱系", kThinkerTop: "思想家 · 关系",
      question: "它的问题", origin: "为何产生", reasoning: "背后的道理", claims: "核心主张", legacy: "留下了什么",
      people: "代表人物", works: "代表著作", worksOf: "著作", from: "从哪里来", to: "通向哪里", answersH: "它对几个大问题的回答",
      inLabel: { dev: "继承自", react: "反对", fuse: "借鉴自" },
      outLabel: { dev: "后继", react: "遭到反对", fuse: "被借鉴" },
      rel: { teachers: "老师", students: "学生", shapedBy: "受其影响", shaped: "影响了", against: "批评过", criticsOf: "批评者" },
      meanwhile: "同一时期，其他传统中", schoolsOf: "所属学派",
      showTree: "在谱系中查看 ↑", showNet: "在关系网中查看 ↑",
      readWiki: "在维基百科阅读 ↗", source: "图片", plate: "暂无自由版权图片",
      living: "在世", alone: "不属于任何学派：一个独立的声音",
      searchHelp: "试试“美德”“空”“康德”“自我”或一本书名。按 Esc 关闭。", searchPh: "搜索哲学……",
      kSchool: "学派", kThinker: "思想家", kWork: "著作",
      noResults: (q) => `没有与“${q}”匹配的内容。换一个更宽泛的概念、人名或传统试试。`,
      close: "关闭", zoom: "缩放", zoomIn: "放大", zoomOut: "缩小", now: "今天",
      ariaSections: "栏目", ariaLang: "语言", ariaManifesto: "如何阅读图谱", ariaBranches: "按分支筛选", ariaQuestions: "问题"
    }
  };

  /* ── State ─────────────────────────────────── */
  const store = {
    get(k) { try { return localStorage.getItem("dialectica-" + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("dialectica-" + k, v); } catch (e) { /* storage blocked */ } }
  };
  /* Language: English is the default. ?lang=en|zh wins, then the visitor's saved choice; never the browser's */
  const LANGS = ["en", "zh"];
  const urlLang = new URLSearchParams(location.search).get("lang");
  let lang = LANGS.includes(urlLang) ? urlLang : store.get("lang") || "en";
  if (!LANGS.includes(lang)) lang = "en";
  function setParam(key, value) {
    try {
      const u = new URL(location.href);
      if (value == null) u.searchParams.delete(key); else u.searchParams.set(key, value);
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch (e) { /* sandboxed */ }
  }
  if (lang === "zh" && urlLang !== "zh") setParam("lang", "zh");
  /* Analytics events; a no-op wherever gtag is not defined (everywhere but production) */
  const track = (name, params) => { if (typeof window.gtag === "function") window.gtag("event", name, params); };
  const pageView = () => track("page_view", { page_title: document.title, page_location: location.origin + location.pathname + location.search });

  const ZOOMS = [0.6, 0.8, 1, 1.3, 1.7, 2.2];
  let zoomIdx = ZOOMS.indexOf(+store.get("zoom"));
  if (zoomIdx < 0) zoomIdx = innerWidth < 700 ? 1 : 2;
  let trace = store.get("trace") === "all" ? "all" : "near";
  let branch = "all";
  const tieOn = new Set((store.get("ties") || "taught,infl,opp").split(",").filter((k) => ["taught", "infl", "opp"].includes(k)));
  let qIdx = 0;
  let selected = null;           // { kind: "s" | "t", id }
  let lastFocus = null;

  const t = (k) => (UI[lang][k] ?? UI.en[k] ?? k);
  const tf = (k) => { const v = t(k); return typeof v === "function" ? v() : v; };
  const p = (o) => (o ? (o[lang] ?? o.en) : "");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad2 = (i) => String(i).padStart(2, "0");
  const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

  /* ── Colour helpers ────────────────────────── */
  function hex(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(h, w) { const [r, g, b] = hex(h); const m = (c) => Math.round(c + (255 - c) * w).toString(16).padStart(2, "0"); return `#${m(r)}${m(g)}${m(b)}`; }
  function onColor(h) { const [r, g, b] = hex(h).map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.28 ? "#141414" : "#fffdf7"; }
  const trVars = (id) => { const c = TRB[id].color; return `--c:${c};--tint:${mix(c, 0.66)};--on:${onColor(c)}`; };

  /* ── Years ─────────────────────────────────── */
  function fmtYear(y) {
    if (y < 0) { const n = Math.abs(y).toLocaleString("en-US"); return lang === "zh" ? `公元前${n}年` : `${n} BCE`; }
    return lang === "zh" ? `${y}年` : (y < 1000 ? `${y} CE` : String(y));
  }
  function fmtAxis(y) {
    if (y >= NOW) return t("now");
    if (y < 0) { const n = Math.abs(y).toLocaleString("en-US"); return lang === "zh" ? `前${n}` : `${n} BCE`; }
    return y < 1000 && lang === "en" ? `${y} CE` : String(y);
  }
  /* Before the printing press a written date is rarely exact */
  const workYear = (y) => (y == null ? "" : (y < 1400 ? (lang === "zh" ? "约" : "c. ") : "") + fmtYear(y));
  /* Where a thinker sits on the map: about the age of forty */
  const floruit = (k) => Math.min(k.born + 40, k.died ?? NOW, NOW);

  /* ── The piecewise time scale shared by both maps ── */
  function fx(y) {
    let acc = 0;
    for (const e of ERA) {
      if (y <= e.end) return clamp(acc + e.share * Math.max(0, (y - e.start) / (e.end - e.start)), 0, 1);
      acc += e.share;
    }
    return 1;
  }
  const TICKS = [-1000, -600, -400, -200, 1, 200, 500, 800, 1100, 1300, 1500, 1600, 1700, 1800, 1850, 1900, 1950, NOW];

  /* Text widths, so labels never collide */
  const ctx = document.createElement("canvas").getContext("2d");
  const BODY_FONT = getComputedStyle(document.body).fontFamily;
  function textW(s, weight = 700, size = 12) { ctx.font = `${weight} ${size}px ${BODY_FONT}`; return Math.ceil(ctx.measureText(s).width); }

  /* ── Wikipedia lead images (Commons files only) ── */
  const wikiUrl = (title) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const readUrl = (x) => lang === "zh"
    ? `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(x.name.zh)}&go=Go`
    : (x.wiki ? wikiUrl(x.wiki) : `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(x.name.en)}`);
  const imgCache = new Map();
  function leadImage(title) {
    if (imgCache.has(title)) return imgCache.get(title);
    const key = "dialectica-wiki:" + title;
    let cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key) || "null"); } catch (e) { /* ignore */ }
    const job = cached ? Promise.resolve(cached) : fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then((j) => {
        const o = j.originalimage, th = j.thumbnail;
        let src = null;
        if (th) src = th.source.replace(/\/\d+px-/, "/960px-");
        if (o && o.width <= 960) src = o.source;
        const res = { src: src && /\/wikipedia\/commons\//.test(src) ? src : null, file: o ? o.source : null };
        try { sessionStorage.setItem(key, JSON.stringify(res)); } catch (e) { /* ignore */ }
        return res;
      });
    imgCache.set(title, job);
    return job;
  }
  function filePage(url) {
    const m = (url || "").match(/\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/);
    return m ? `https://commons.wikimedia.org/wiki/File:${m[1]}` : null;
  }
  /* Mondrian plate, seeded so each page keeps its own composition */
  function rng(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }
  function plateSvg(seed, accent) {
    const r = rng(seed), cells = [], L = 2.4;
    (function split(x, y, w, h, d) {
      if (d >= 3 || (w < 24 && h < 24) || (d >= 2 && r() < 0.3)) { cells.push([x, y, w, h]); return; }
      const v = w / h > 1.2 ? true : h / w > 1.2 ? false : r() < 0.5, f = 0.3 + r() * 0.4;
      if (v) { split(x, y, w * f, h, d + 1); split(x + w * f, y, w * (1 - f), h, d + 1); }
      else { split(x, y, w, h * f, d + 1); split(x, y + h * f, w, h * (1 - f), d + 1); }
    })(0, 0, 200, 100, 0);
    const colors = ["#fffdf7", "#fffdf7", "#fffdf7", "#e9e4d8", accent, accent, "#d52b1e", "#1d4ed8", "#f3c623"];
    return `<svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><rect width="200" height="100" fill="#141414"/>${cells.map((c) =>
      `<rect x="${(c[0] + L / 2).toFixed(1)}" y="${(c[1] + L / 2).toFixed(1)}" width="${(c[2] - L).toFixed(1)}" height="${(c[3] - L).toFixed(1)}" fill="${colors[Math.floor(r() * colors.length)]}"/>`).join("")}</svg>`;
  }

  /* ── Static copy ───────────────────────────── */
  function applyStatic() {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = t("docTitle");
    $('meta[name="description"]').setAttribute("content", tf("docDesc"));
    $('link[rel="canonical"]').setAttribute("href", "https://dialectica.geekplux.org/" + (lang === "zh" ? "?lang=zh" : ""));
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $("#gh-star").title = t("starTitle");
    $("#stats").textContent = tf("stats");
    $("#search-input").placeholder = t("searchPh");
    $("#lin-range").textContent = tf("linRange");
    $("#th-range").textContent = tf("thRange");
    $("#q-range").textContent = tf("qRange");
    $("#s-range").textContent = tf("sRange");
  }

  /* ── Shared map scaffolding: axis, lanes, link layer ── */
  const W0 = 2600;
  const mapW = () => Math.round(W0 * ZOOMS[zoomIdx]);
  function axisHtml(W) {
    let eras = "", acc = 0;
    for (const e of ERA) {
      eras += `<span class="era" style="left:${(acc * W).toFixed(1)}px;width:${(e.share * W).toFixed(1)}px" title="${esc(p(e.name))}">${esc(p(e.name))}</span>`;
      acc += e.share;
    }
    let last = -Infinity, ticks = "";
    TICKS.forEach((y, i) => {
      const x = fx(y) * W, half = textW(fmtAxis(y), 700, 10.5) / 2;
      /* Keep a tick only if its label clears the one before (the first is left-aligned, so it needs its full width) */
      if (x - half < last + 12 && i !== TICKS.length - 1) return;
      last = x + (i === 0 ? half * 2 : half);
      const edge = i === 0 ? " l" : i === TICKS.length - 1 ? " r" : "";
      ticks += `<span class="tick${edge}" style="left:${x.toFixed(1)}px">${esc(fmtAxis(y))}</span>`;
    });
    return `<div class="gx-axis"><div class="gx-corner">${t("axisCorner")}</div><div class="gx-track">${eras}${ticks}</div></div>`;
  }
  const MARKERS = { dev: "#141414", react: "#d52b1e", fuse: "#1d4ed8", taught: "#141414", infl: "#8c8578", opp: "#d52b1e" };
  function svgOpen(W, H, id) {
    const defs = Object.entries(MARKERS).map(([k, c]) => `<marker id="${id}-${k}" viewBox="0 0 8 8" refX="7" refY="4" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L8,4 L0,8 z" style="fill:${c}"/></marker>`).join("");
    let acc = 0, grid = "";
    for (const e of ERA.slice(1)) { acc += ERA[ERA.indexOf(e) - 1].share; grid += `<line x1="${(acc * W).toFixed(1)}" x2="${(acc * W).toFixed(1)}" y1="62" y2="${H}" stroke="rgba(20,20,20,.1)" stroke-width="1"/>`; }
    return `<svg class="gx-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${grid}`;
  }
  /* A curve from one box to another. Influence lands where the later of the two begins */
  function curve(a, b, vertical) {
    if (vertical) {
      const down = b.y > a.y, y1 = a.y + (down ? a.h : -a.h) / 2, y2 = b.y - (down ? b.h : -b.h) / 2 - (down ? 3 : -3);
      const m = (y1 + y2) / 2;
      return `M${a.x.toFixed(1)},${y1.toFixed(1)} C${a.x.toFixed(1)},${m.toFixed(1)} ${b.x.toFixed(1)},${m.toFixed(1)} ${b.x.toFixed(1)},${y2.toFixed(1)}`;
    }
    const dx = Math.max(24, Math.abs(b.x - a.x) / 2);
    return `M${a.x.toFixed(1)},${a.y.toFixed(1)} C${(a.x + dx).toFixed(1)},${a.y.toFixed(1)} ${(b.x - dx).toFixed(1)},${b.y.toFixed(1)} ${(b.x - 3).toFixed(1)},${b.y.toFixed(1)}`;
  }
  /* Greedy row packing: each item claims [a, b) on the first row that is free there */
  function pack(items) {
    const rows = [];
    for (const it of items) {
      let r = rows.findIndex((edge) => edge <= it.a);
      if (r < 0) { r = rows.length; rows.push(0); }
      rows[r] = it.b;
      it.row = r;
    }
    return Math.max(1, rows.length);
  }
  function laneLabel(tr, count) {
    return `<div class="gx-lbl" style="${trVars(tr.id)}"><span class="code">${esc(count)}</span><h3>${esc(p(tr.name))}</h3></div>`;
  }

  /* ── 01 Lineage ────────────────────────────── */
  const LIN = { pos: {}, W: 0 };
  const SROW = 29, SBAR = 22, SPAD = 12, AXIS_H = 62;
  function renderLineage() {
    const W = mapW(), X = (y) => fx(y) * W;
    LIN.W = W; LIN.pos = {};
    let html = axisHtml(W), top = AXIS_H;
    for (const tr of TR) {
      /* A block is as wide as the school lasted. When the name needs more room, the block grows a white cell
         after the colour (before it at the right edge), so every name sits on its block and nothing passes W */
      const items = SC.filter((s) => s.tradition === tr.id).map((s) => {
        const x1 = X(Math.max(s.start, MIN_YEAR)), x2 = Math.max(x1 + 6, X(s.end)), bw = Math.max(x2 - x1, textW(p(s.name)) + 18);
        const left = Math.max(0, Math.min(x1, W - bw));
        return { s, x1, x2, left, bw, a: left - 4, b: left + bw + 10 };
      });
      const rows = pack(items);
      const h = Math.max(70, rows * SROW + SPAD * 2 - (SROW - SBAR));
      html += `<div class="gx-lane" style="height:${h}px">${laneLabel(tr, t("nSchools")(items.length))}<div class="gx-track">`;
      for (const it of items) {
        const y = SPAD + it.row * SROW;
        LIN.pos[it.s.id] = { x1: it.x1, x2: it.x2, y: top + y + SBAR / 2, h: SBAR };
        const roomy = it.bw > it.x2 - it.x1 + 0.5;
        html += `<button type="button" class="sb${roomy ? " roomy" : ""}" data-s="${it.s.id}" style="left:${it.left.toFixed(1)}px;top:${y}px;width:${it.bw.toFixed(1)}px;${trVars(tr.id)}" aria-label="${esc(p(it.s.name))} · ${esc(p(it.s.dates))}"><i style="left:${(it.x1 - it.left).toFixed(1)}px;width:${(it.x2 - it.x1).toFixed(1)}px"></i><span>${esc(p(it.s.name))}</span></button>`;
      }
      html += `</div></div>`;
      top += h;
    }
    html += svgOpen(W, top, "ml");
    LK.forEach((l, i) => {
      const a = LIN.pos[l.from], b = LIN.pos[l.to];
      if (!a || !b) return;
      /* The influence lands where the later school begins; the line leaves the earlier one at that moment, or at its end */
      const tx = clamp(Math.max(a.x1, b.x1), b.x1, b.x2);
      const sx = clamp(tx, a.x1 + 4, a.x2 - 2);
      const vertical = Math.abs(tx - sx) < 36;
      const tx2 = vertical ? Math.min(tx + 10, b.x2 - 2) : tx;
      const d = curve({ x: vertical ? sx + 10 : sx, y: a.y, h: a.h }, { x: tx2, y: b.y, h: b.h }, vertical);
      html += `<path class="lk ${l.kind}" data-li="${i}" d="${d}" marker-end="url(#ml-${l.kind})"/><path class="hit" data-li="${i}" d="${d}"/>`;
    });
    html += `</svg>`;
    const el = $("#lin");
    el.style.setProperty("--w", W + "px");
    el.style.width = `calc(var(--lw) + ${W}px)`;
    el.innerHTML = html;
    $("#zoom-val").textContent = ZOOMS[zoomIdx] + "×";
    $$("[data-zoom]").forEach((b) => { b.disabled = +b.dataset.zoom < 0 ? zoomIdx === 0 : zoomIdx === ZOOMS.length - 1; });
    paintLineage();
  }
  function renderLineageBar() {
    $$("#trace-seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.trace === trace)));
    $("#link-legend").innerHTML = ["dev", "react", "fuse"].map((k) => `<span><i class="ln ${k}"></i>${esc(t("lk")[k])}</span>`).join("");
    $("#branch-bar").innerHTML = `<span class="micro">${esc(t("branchLbl"))}</span><button type="button" class="chip" data-branch="all" aria-pressed="${branch === "all"}">${esc(t("allBranches"))}</button>` +
      BR.map((b) => `<button type="button" class="chip" data-branch="${b.id}" aria-pressed="${branch === b.id}" title="${esc(p(b.question))}">${esc(p(b.name))}</button>`).join("");
  }
  /* Who is lit when a school is in focus: its direct neighbours, or every ancestor and descendant */
  function lineageOf(id) {
    const near = new Set([id]), on = new Set();
    if (trace === "near") {
      LK.forEach((l, i) => { if (l.from === id || l.to === id) { near.add(l.from); near.add(l.to); on.add(i); } });
      return { near, on };
    }
    const walk = (start, dir) => {
      const seen = new Set([start]), queue = [start];
      while (queue.length) {
        const cur = queue.shift();
        LK.forEach((l, i) => {
          const [a, b] = dir > 0 ? [l.from, l.to] : [l.to, l.from];
          if (a === cur) { on.add(i); if (!seen.has(b)) { seen.add(b); queue.push(b); } }
        });
      }
      return seen;
    };
    walk(id, 1).forEach((x) => near.add(x));
    walk(id, -1).forEach((x) => near.add(x));
    return { near, on };
  }
  let linHover = null;
  function paintLineage() {
    const el = $("#lin");
    const sel = selected && selected.kind === "s" ? selected.id : null;
    const focus = linHover || sel;
    const lit = focus ? lineageOf(focus) : null;
    el.classList.toggle("focus", !!focus);
    const dimmed = (s) => branch !== "all" && !s.branches.includes(branch);
    $$(".sb", el).forEach((b) => {
      const id = b.dataset.s;
      b.classList.toggle("sel", id === sel);
      b.classList.toggle("hot", id === linHover);
      b.classList.toggle("near", !!lit && lit.near.has(id));
      b.classList.toggle("dim", dimmed(SCB[id]));
    });
    $$(".lk", el).forEach((pth) => {
      const i = +pth.dataset.li, l = LK[i];
      pth.classList.toggle("on", !!lit && lit.on.has(i));
      pth.classList.toggle("off", dimmed(SCB[l.from]) || dimmed(SCB[l.to]));
    });
  }

  /* ── 02 Thinkers ───────────────────────────── */
  const NET = { pos: {} };
  const TROW = 24, TPAD = 12;
  function renderNet() {
    const W = mapW(), X = (y) => fx(y) * W;
    NET.pos = {};
    let html = axisHtml(W), top = AXIS_H;
    for (const tr of TR) {
      const items = TK.filter((k) => k.tradition === tr.id).map((k) => {
        /* Names run right of the square, or left of it where they would pass the end of the map */
        const x = X(floruit(k)), tw = textW(p(k.name), 600, 12), flip = x + 18 + tw > W;
        return { k, x, flip, a: flip ? x - tw - 24 : x - 8, b: flip ? x + 14 : x + 18 + tw + 10 };
      }).sort((a, b) => a.x - b.x);
      const rows = pack(items);
      const h = Math.max(70, rows * TROW + TPAD * 2 - 4);
      html += `<div class="gx-lane" style="height:${h}px">${laneLabel(tr, t("nThinkers")(items.length))}<div class="gx-track">`;
      for (const it of items) {
        const y = TPAD + it.row * TROW;
        NET.pos[it.k.id] = { x: it.x, y: top + y + 10, h: 12 };
        html += `<button type="button" class="tn${it.k.died == null ? " alive" : ""}${it.flip ? " flip" : ""}" data-t="${it.k.id}" style="left:${(it.flip ? it.x + 6 : it.x - 6).toFixed(1)}px;top:${y}px;${trVars(tr.id)}">${esc(p(it.k.name))}</button>`;
      }
      html += `</div></div>`;
      top += h;
    }
    html += svgOpen(W, top, "mt");
    TI.forEach((r, i) => {
      const a = NET.pos[r.from], b = NET.pos[r.to];
      if (!a || !b) return;
      const near = Math.abs(b.x - a.x) < 30 && Math.abs(b.y - a.y) > 20;
      const d = near ? curve(a, b, true) : curve(a, b, false);
      html += `<path class="lk ${r.kind}" data-ti="${i}" d="${d}" marker-end="url(#mt-${r.kind})"/><path class="hit" data-ti="${i}" d="${d}"/>`;
    });
    html += `</svg>`;
    const el = $("#th");
    el.style.setProperty("--w", W + "px");
    el.style.width = `calc(var(--lw) + ${W}px)`;
    el.innerHTML = html;
    paintNet();
  }
  function renderNetBar() {
    $("#tie-seg").innerHTML = ["taught", "infl", "opp"].map((k) => `<button type="button" data-tie="${k}" aria-pressed="${tieOn.has(k)}"><i class="ln ${k}"></i>${esc(t("tie")[k])}</button>`).join("");
  }
  let netHover = null;
  function paintNet() {
    const el = $("#th");
    const sel = selected && selected.kind === "t" ? selected.id : null;
    const focus = netHover || sel;
    const near = new Set(focus ? [focus] : []), on = new Set();
    if (focus) TI.forEach((r, i) => { if (tieOn.has(r.kind) && (r.from === focus || r.to === focus)) { near.add(r.from); near.add(r.to); on.add(i); } });
    el.classList.toggle("focus", !!focus);
    $$(".tn", el).forEach((b) => {
      const id = b.dataset.t;
      b.classList.toggle("sel", id === sel);
      b.classList.toggle("hot", id === netHover);
      b.classList.toggle("near", near.has(id));
    });
    $$(".lk", el).forEach((pth) => {
      const i = +pth.dataset.ti;
      pth.classList.toggle("on", on.has(i));
      pth.style.display = tieOn.has(TI[i].kind) ? "" : "none";
      pth.nextElementSibling.style.display = pth.style.display;
    });
  }

  /* ── 03 Questions ──────────────────────────── */
  const answerYear = (ans) => (ans.by && TKB[ans.by] ? floruit(TKB[ans.by]) : SCB[ans.school].start);
  function renderQuestions() {
    $("#q-tabs").innerHTML = QS.map((q, i) => `<button type="button" class="q-tab" role="tab" data-q="${q.id}" aria-selected="${i === qIdx}"><span class="n">${pad2(i + 1)}</span>${esc(p(q.q))}</button>`).join("");
    const q = QS[qIdx];
    const list = q.answers.filter((a) => SCB[a.school]).map((a) => ({ a, y: answerYear(a) })).sort((x, y) => x.y - y.y);
    $("#q-head").innerHTML = `<div><span class="micro">${esc(p(BRB[q.branch].name))} · ${esc(p(BRB[q.branch].question))}</span><h3>${esc(p(q.q))}</h3></div><p>${esc(p(q.lede))}</p>`;
    /* A small map: one row per tradition, a numbered square where each answer sits in time */
    const rows = TR.filter((tr) => list.some(({ a }) => SCB[a.school].tradition === tr.id));
    const map = $("#q-map"), mw = map.clientWidth || 1000, lastX = {};
    map.style.setProperty("--rows", rows.length);
    map.innerHTML = rows.map((tr, r) => `<div class="row" style="top:${r * 18}px;${trVars(tr.id)}"><i>${esc(p(tr.name))}</i></div>`).join("") +
      list.map(({ a, y }, i) => {
        const tr = SCB[a.school].tradition, r = rows.findIndex((x) => x.id === tr);
        /* Answers close in time share a row: push each one clear of the square before it */
        const x = Math.max(fx(y) * mw, (lastX[r] ?? -Infinity) + 18);
        lastX[r] = x;
        return `<button type="button" class="q-dot" data-qi="${i}" data-s="${a.school}" tabindex="-1" style="left:${x.toFixed(1)}px;top:${r * 18}px;${trVars(tr)}" title="${esc(p(SCB[a.school].name))}">${i + 1}</button>`;
      }).join("") +
      `<div class="yr">${[-600, 1, 1000, 1600, 1900].map((y, i) => `<span class="${i === 0 ? "l" : ""}" style="left:${(fx(y) * 100).toFixed(2)}%">${esc(fmtAxis(y))}</span>`).join("")}</div>`;
    $("#q-grid").innerHTML = list.map(({ a }, i) => {
      const s = SCB[a.school], k = a.by && TKB[a.by];
      const when = k ? p(k.life) : p(s.dates);
      return `<li><button type="button" class="q-card" data-qi="${i}" data-s="${s.id}" style="${trVars(s.tradition)}"><span class="top"><b>${pad2(i + 1)}</b>${esc(p(TRB[s.tradition].name))} · ${esc(when)}</span><strong>${esc(p(s.name))}</strong><p>${esc(p(a.a))}</p>${k ? `<small>— ${esc(p(k.name))}</small>` : "<small></small>"}</button></li>`;
    }).join("");
  }

  /* ── 04 Schools index ──────────────────────── */
  function renderIndex() {
    $("#s-index").innerHTML = TR.map((tr) => {
      const list = SC.filter((s) => s.tradition === tr.id);
      return `<section class="s-col" style="${trVars(tr.id)}"><header><span class="micro">${esc(t("nSchools")(list.length))}</span><h3>${esc(p(tr.name))}</h3><p>${esc(p(tr.description))}</p></header>` +
        `<div class="s-list">${list.map((s) => {
          const a = fx(Math.max(s.start, MIN_YEAR)), b = fx(s.end);
          return `<button type="button" class="s-item" data-s="${s.id}"><span>${esc(p(s.dates))}</span><span class="life" aria-hidden="true"><i style="left:${(a * 100).toFixed(2)}%;width:${Math.max(0.6, (b - a) * 100).toFixed(2)}%"></i></span><b>${esc(p(s.name))}</b><small>${esc(p(s.idea))}</small></button>`;
        }).join("")}</div></section>`;
    }).join("");
  }
  function renderLearning() {
    $("#learning").innerHTML = D.learning.map((x, i) => `<li><span class="n">${pad2(i + 1)}</span><b>${esc(p(x.t))}</b><p>${esc(p(x.d))}</p></li>`).join("");
  }

  /* ── Hero: the city of ideas ───────────────────
     After Mondrian's New York City I and Broadway Boogie-Woogie, drawn from the data. Each tradition is a street
     in its colour, from its first school to its last. Every link into another tradition is an upright in the
     colour it came from, landing as a block on the street it reached. Thinkers are small squares on their street,
     white, or tinted with a foreign colour when they learned across a border. The most connected schools are
     larger blocks, with an inner square in the colour of the tradition they reached most. */
  const crossTies = (() => {
    const m = {};
    TI.forEach((r) => {
      const a = TKB[r.from], b = TKB[r.to];
      if (a && b && a.tradition !== b.tradition && r.kind !== "opp") (m[b.id] = m[b.id] || []).push(a.tradition);
    });
    return m;
  })();
  function renderHero() {
    const box = $("#hero-art");
    const W = box.clientWidth, H = box.clientHeight;
    if (!W || !H) return;
    const padX = W < 500 ? 18 : 30, top = 46, bottom = Math.min(H * 0.32, 170);
    const X = (y) => padX + fx(y) * (W - padX * 2);
    const gap = (H - top - bottom) / (TR.length - 1);
    const Y = {}, LINE = W < 500 ? 7 : 9;
    TR.forEach((tr, i) => { Y[tr.id] = top + i * gap; });
    const crossLinks = LK.map((l, i) => ({ l, i, a: SCB[l.from], b: SCB[l.to] })).filter((x) => x.a && x.b && x.a.tradition !== x.b.tradition);
    const deg = {};
    LK.forEach((l) => { deg[l.from] = (deg[l.from] || 0) + 1; deg[l.to] = (deg[l.to] || 0) + 1; });
    const delay = (x) => ((x - padX) / (W - padX * 2) * 1.6 + 0.35).toFixed(2);
    let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    /* Streets, named just before they begin, or above their start where there is no room */
    const span = {}, names = [];
    for (const tr of TR) {
      const list = SC.filter((s) => s.tradition === tr.id);
      const x1 = X(Math.max(MIN_YEAR, Math.min(...list.map((s) => s.start)))), x2 = X(Math.max(...list.map((s) => s.end)));
      span[tr.id] = [x1, x2];
      const name = p(tr.name), nw = textW(name.toUpperCase(), 700, 9) * 1.1 + 8, before = x1 - padX > nw;
      svg += `<rect class="h-street" x="${x1.toFixed(1)}" y="${(Y[tr.id] - LINE / 2).toFixed(1)}" width="${(x2 - x1).toFixed(1)}" height="${LINE}" fill="${tr.color}"/>`;
      names.push(`<text class="h-name${before ? " end" : ""}" x="${(before ? x1 - 7 : x1).toFixed(1)}" y="${(before ? Y[tr.id] + 3.5 : Y[tr.id] - LINE * 1.6 - 4).toFixed(1)}">${esc(name)}</text>`);
    }
    const weave = [];
    /* Uprights: ideas crossing into another tradition, nudged apart where they would overlap */
    const drawn = [];
    crossLinks.sort((p1, p2) => Math.max(p1.a.start, p1.b.start) - Math.max(p2.a.start, p2.b.start)).forEach(({ l, i, a, b }) => {
      let x = X(clamp(Math.max(a.start, b.start), b.start, b.end));
      const y1 = Y[a.tradition], y2 = Y[b.tradition], lo = Math.min(y1, y2), hi = Math.max(y1, y2);
      while (drawn.some((d) => Math.abs(d.x - x) < LINE * 0.75 && d.lo < hi && d.hi > lo)) x += LINE * 0.65;
      x = Math.min(x, W - padX);
      drawn.push({ x, lo, hi });
      const c = TRB[a.tradition].color, w = Math.max(2.5, LINE * 0.42);
      /* As in New York City I, the lines weave: every other street it crosses passes over the upright */
      TR.forEach((tr, k) => {
        const y = Y[tr.id];
        if (y > lo + 1 && y < hi - 1 && x >= span[tr.id][0] && x <= span[tr.id][1] && (k + drawn.length) % 2 === 0)
          weave.push(`<rect x="${(x - w / 2 - 1).toFixed(1)}" y="${(y - LINE / 2).toFixed(1)}" width="${(w + 2).toFixed(1)}" height="${LINE}" fill="${tr.color}" style="--d:${delay(x)}s" class="h-weave"/>`);
      });
      svg += `<g class="h-up" data-hl="${i}" data-s="${b.id}" style="--d:${delay(x)}s"><rect x="${(x - w / 2).toFixed(1)}" y="${lo.toFixed(1)}" width="${w.toFixed(1)}" height="${(hi - lo).toFixed(1)}" fill="${c}"/>` +
        `<rect x="${(x - LINE * 0.65).toFixed(1)}" y="${(y2 - LINE * 0.65).toFixed(1)}" width="${(LINE * 1.3).toFixed(1)}" height="${(LINE * 1.3).toFixed(1)}" fill="${c}"/>` +
        `<rect class="hit" x="${(x - 6).toFixed(1)}" y="${lo.toFixed(1)}" width="12" height="${(hi - lo).toFixed(1)}"/></g>`;
    });
    svg += weave.join("");
    /* Thinkers: a square on their street; tinted with the colour of a tradition they learned from */
    const s = Math.max(5, LINE - 2);
    for (const k of TK) {
      const x = X(floruit(k)), y = Y[k.tradition], foreign = crossTies[k.id];
      const fill = foreign ? TRB[foreign[0]].color : "#fffdf7";
      svg += `<rect class="h-sq" data-t="${k.id}" style="--d:${delay(x)}s" x="${(x - s / 2).toFixed(1)}" y="${(y - s / 2).toFixed(1)}" width="${s}" height="${s}" fill="${fill}"/>`;
    }
    /* Hubs: the most connected schools, with an inner square in the colour they reached most */
    SC.filter((sc) => (deg[sc.id] || 0) >= 7).forEach((sc) => {
      const out = {};
      LK.forEach((l) => { const b = SCB[l.to]; if (l.from === sc.id && b && b.tradition !== sc.tradition) out[b.tradition] = (out[b.tradition] || 0) + 1; });
      const best = Object.entries(out).sort((m, n) => n[1] - m[1])[0];
      const size = LINE * (1.9 + (deg[sc.id] - 7) * 0.18), inner = size * 0.46;
      const x = X(Math.max(sc.start, MIN_YEAR)) + size / 2, y = Y[sc.tradition];
      svg += `<g class="h-hub" data-s="${sc.id}" style="--d:${delay(x)}s"><rect x="${(x - size / 2).toFixed(1)}" y="${(y - size / 2).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" fill="${TRB[sc.tradition].color}"/>` +
        `<rect x="${(x - inner / 2).toFixed(1)}" y="${(y - inner / 2).toFixed(1)}" width="${inner.toFixed(1)}" height="${inner.toFixed(1)}" fill="${best ? TRB[best[0]].color : "#fffdf7"}"/></g>`;
    });
    svg += names.join("");
    svg += `<text class="h-time" x="${padX}" y="${(H - bottom + 26).toFixed(1)}">${esc(fmtAxis(MIN_YEAR))}</text><text class="h-time end" x="${W - padX}" y="${(H - bottom + 26).toFixed(1)}">${esc(t("now"))} →</text></svg>`;
    box.innerHTML = svg;
    heroCaption(null);
  }
  function heroCaption(el) {
    const cap = $("#hero-cap");
    if (!el) { cap.innerHTML = `<b>${esc(t("heroTitle"))}</b>${esc(t("heroCap"))}`; cap.style.removeProperty("--c"); return; }
    if (el.dataset.hl != null) {
      const l = LK[+el.dataset.hl], a = SCB[l.from], b = SCB[l.to];
      cap.innerHTML = `<span>${esc(p(TRB[a.tradition].name))} → ${esc(p(TRB[b.tradition].name))}</span><b>${esc(p(a.name))} → ${esc(p(b.name))}</b>${esc(p(l.note))}`;
      cap.style.setProperty("--c", TRB[a.tradition].color);
    } else if (el.dataset.t) {
      const k = TKB[el.dataset.t], from = crossTies[k.id];
      cap.innerHTML = `<span>${esc(p(TRB[k.tradition].name))} · ${esc(p(k.life))}</span><b>${esc(p(k.name))}</b>${esc(p(k.role))}${from ? `<em>${esc(t("heroLearned")([...new Set(from)].map((x) => p(TRB[x].name)).join(", ")))}</em>` : ""}`;
      cap.style.setProperty("--c", TRB[k.tradition].color);
    } else {
      const sc = SCB[el.dataset.s];
      cap.innerHTML = `<span>${esc(p(TRB[sc.tradition].name))} · ${esc(p(sc.dates))}</span><b>${esc(p(sc.name))}</b>${esc(p(sc.idea))}`;
      cap.style.setProperty("--c", TRB[sc.tradition].color);
    }
  }
  let heroHot = null;
  $("#hero-art").addEventListener("pointerover", (ev) => {
    const el = ev.target.closest(".h-up, .h-sq, .h-hub");
    if (el === heroHot) return;
    if (heroHot) heroHot.classList.remove("hot");
    heroHot = el;
    if (el) el.classList.add("hot");
    heroCaption(el);
  });
  $("#hero-art").addEventListener("pointerleave", () => { if (heroHot) heroHot.classList.remove("hot"); heroHot = null; heroCaption(null); });

  /* ── Detail panel ──────────────────────────── */
  const detail = $("#detail");
  const swatch = (tr) => `<span class="sw" style="${trVars(tr)}"></span>`;
  const thinkerRow = (k, note) => `<button type="button" class="par" data-t="${k.id}"><span><i style="${trVars(k.tradition)}"></i>${esc(p(k.life))}</span><span style="font:inherit;color:inherit;text-transform:none"><strong>${esc(p(k.name))}</strong>${note ? `<em>${esc(p(note))}</em>` : `<small>${esc(p(k.role))}</small>`}</span></button>`;
  const schoolRow = (s, label, note, kind) => `<button type="button" class="par" data-s="${s.id}"><span><i style="${trVars(s.tradition)}"></i>${esc(label)}${kind ? `<br><i class="ln ${kind}" style="width:22px;margin-top:6px"></i>` : ""}</span><span style="font:inherit;color:inherit;text-transform:none"><strong>${esc(p(s.name))}</strong>${note ? `<em>${esc(p(note))}</em>` : ""}</span></button>`;
  const workRow = (w, author) => `<${author ? `button type="button" data-t="${author.id}"` : "div"} class="par"><span>${esc(workYear(w.y))}</span><span style="font:inherit;color:inherit;text-transform:none"><strong>${esc(p(w.t))}</strong>${author ? `<small>${esc(p(author.name))}</small>` : ""}</span></${author ? "button" : "div"}>`;
  function figure(x, tr, portrait) {
    return `<figure class="d-fig${portrait ? " portrait" : ""}" id="d-fig">${plateSvg(x.id, TRB[tr].color)}<img alt=""><figcaption>${esc(t("plate"))}</figcaption></figure>`;
  }
  function loadFigure(x) {
    if (!x.wiki) return;
    const fig = $("#d-fig"), want = selected && selected.id;
    leadImage(x.wiki).then((res) => {
      if (!selected || selected.id !== want || !res.src) return;
      const img = $("img", fig);
      img.onload = () => {
        img.classList.add("ok");
        const fp = filePage(res.file || res.src);
        $("figcaption", fig).innerHTML = fp ? `<a href="${esc(fp)}" target="_blank" rel="noopener">${esc(t("source"))}: Wikimedia Commons ↗</a>` : "Wikimedia Commons";
      };
      img.alt = p(x.name);
      img.src = res.src;
    }).catch(() => { /* keep the plate */ });
  }
  function showPanel() {
    if (!detail.classList.contains("open")) lastFocus = document.activeElement;
    detail.classList.add("open");
    detail.setAttribute("aria-hidden", "false");
    detail.scrollTop = 0;
    $("#detail-close").focus({ preventScroll: true });
    writeHash();
  }
  function openSchool(id) {
    const s = SCB[id];
    if (!s) return;
    if (!selected || selected.id !== id) track("select_content", { content_type: "school", item_id: id });
    selected = { kind: "s", id };
    paintLineage(); paintNet();
    const ins = LK.filter((l) => l.to === id && SCB[l.from]), outs = LK.filter((l) => l.from === id && SCB[l.to]);
    const figs = s.figures.map((k) => TKB[k]).filter(Boolean);
    const answers = QS.flatMap((q) => q.answers.filter((a) => a.school === id).map((a) => ({ q, a })));
    $("#detail-kind").textContent = t("kSchoolTop");
    $("#detail-body").innerHTML = `
      <p class="d-date">${swatch(s.tradition)}${esc(p(TRB[s.tradition].name))} · ${esc(p(s.dates))}</p>
      <h2 id="d-title">${esc(p(s.name))}</h2>
      ${figure(s, s.tradition)}
      <p class="d-sum">${esc(p(s.idea))}</p>
      <div class="fact"><span class="micro">${esc(t("question"))}</span><p class="q">${esc(p(s.question))}</p></div>
      <div class="fact"><span class="micro">${esc(t("origin"))}</span><p>${esc(p(s.origin))}</p></div>
      <div class="fact"><span class="micro">${esc(t("reasoning"))}</span><p>${esc(p(s.reasoning))}</p></div>
      <div class="fact"><span class="micro">${esc(t("claims"))}</span><ol class="claims">${s.claims.map((c) => `<li><span>${esc(p(c))}</span></li>`).join("")}</ol></div>
      <div class="fact"><span class="micro">${esc(t("legacy"))}</span><p>${esc(p(s.legacy))}</p></div>
      <div class="stamps">${s.branches.map((b) => `<button type="button" class="stamp" data-branch="${b}">${esc(p(BRB[b].name))}</button>`).join("")}</div>
      <div class="d-links"><a href="${esc(readUrl(s))}" target="_blank" rel="noopener">${esc(t("readWiki"))}</a><button type="button" data-goto="lineage">${esc(t("showTree"))}</button></div>
      ${figs.length ? `<div class="d-sec"><h3>${esc(t("people"))}</h3>${figs.map((k) => thinkerRow(k)).join("")}</div>` : ""}
      ${s.works && s.works.length ? `<div class="d-sec"><h3>${esc(t("works"))}</h3>${s.works.map((w) => workRow(w, TKB[w.by])).join("")}</div>` : ""}
      ${ins.length ? `<div class="d-sec"><h3>${esc(t("from"))}</h3>${ins.map((l) => schoolRow(SCB[l.from], t("inLabel")[l.kind], l.note, l.kind)).join("")}</div>` : ""}
      ${outs.length ? `<div class="d-sec"><h3>${esc(t("to"))}</h3>${outs.map((l) => schoolRow(SCB[l.to], t("outLabel")[l.kind], l.note, l.kind)).join("")}</div>` : ""}
      ${answers.length ? `<div class="d-sec"><h3>${esc(t("answersH"))}</h3>${answers.map(({ q, a }) => `<button type="button" class="par" data-q="${q.id}" data-scroll="1"><span>${esc(p(BRB[q.branch].name))}</span><span style="font:inherit;color:inherit;text-transform:none"><strong>${esc(p(q.q))}</strong><em>${esc(p(a.a))}</em></span></button>`).join("")}</div>` : ""}`;
    loadFigure(s);
    showPanel();
  }
  function openThinker(id) {
    const k = TKB[id];
    if (!k) return;
    if (!selected || selected.id !== id) track("select_content", { content_type: "thinker", item_id: id });
    selected = { kind: "t", id };
    paintLineage(); paintNet();
    const rel = (kind, dir) => TI.filter((r) => r.kind === kind && (dir > 0 ? r.from === id : r.to === id)).map((r) => ({ k: TKB[dir > 0 ? r.to : r.from], note: r.note })).filter((x) => x.k);
    const groups = [
      ["teachers", rel("taught", -1)], ["students", rel("taught", 1)],
      ["shapedBy", rel("infl", -1)], ["shaped", rel("infl", 1)],
      ["against", rel("opp", -1)], ["criticsOf", rel("opp", 1)]
    ].filter(([, list]) => list.length);
    const fl = floruit(k), end = k.died ?? NOW;
    const meanwhile = TK.filter((x) => x.tradition !== k.tradition && x.born < end && (x.died ?? NOW) > k.born)
      .sort((a, b) => Math.abs(floruit(a) - fl) - Math.abs(floruit(b) - fl)).slice(0, 6).sort((a, b) => a.born - b.born);
    const schools = k.schools.map((s) => SCB[s]).filter(Boolean);
    $("#detail-kind").textContent = t("kThinkerTop");
    $("#detail-body").innerHTML = `
      <p class="d-date">${swatch(k.tradition)}${esc(p(TRB[k.tradition].name))} · ${esc(p(k.life))}${k.died == null ? ` · ${esc(t("living"))}` : ""}</p>
      <h2 id="d-title">${esc(p(k.name))}</h2>
      <p class="d-role">${esc(p(k.role))}</p>
      ${figure(k, k.tradition, true)}
      <p class="d-sum">${esc(p(k.idea))}</p>
      <div class="stamps">${schools.length ? schools.map((s) => `<button type="button" class="stamp" data-s="${s.id}" style="${trVars(s.tradition)}">${esc(p(s.name))}</button>`).join("") : `<span class="stamp">${esc(t("alone"))}</span>`}</div>
      <div class="d-links"><a href="${esc(readUrl(k))}" target="_blank" rel="noopener">${esc(t("readWiki"))}</a><button type="button" data-goto="thinkers">${esc(t("showNet"))}</button></div>
      ${k.works && k.works.length ? `<div class="d-sec"><h3>${esc(t("worksOf"))}</h3>${k.works.map((w) => workRow(w)).join("")}</div>` : ""}
      ${groups.map(([g, list]) => `<div class="d-sec"><h3>${esc(t("rel")[g])}</h3>${list.map((x) => thinkerRow(x.k, x.note)).join("")}</div>`).join("")}
      ${meanwhile.length ? `<div class="d-sec"><h3>${esc(t("meanwhile"))}</h3>${meanwhile.map((x) => thinkerRow(x)).join("")}</div>` : ""}`;
    loadFigure(k);
    showPanel();
  }
  function closeDetail() {
    detail.classList.remove("open");
    detail.setAttribute("aria-hidden", "true");
    selected = null;
    paintLineage(); paintNet();
    writeHash();
    if (lastFocus && typeof lastFocus.focus === "function" && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  /* Scroll a map so an item sits in the space the panel leaves, and bring the map into view */
  function reveal(section, el) {
    if (!el) return;
    const sc = $(".gx-scroll", section), r = el.getBoundingClientRect(), s = sc.getBoundingClientRect();
    const panel = innerWidth > 900 && detail.classList.contains("open") ? Math.min(620, innerWidth * 0.94) : 0;
    const lw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--lw")) || 0;
    const centre = s.left + lw + (Math.min(s.right, innerWidth - panel) - s.left - lw) / 2;
    sc.scrollBy({ left: r.left + r.width / 2 - centre, behavior: smooth() });
    const bar = $(".topbar").offsetHeight;
    if (r.top < bar + 40 || r.bottom > innerHeight - 20) scrollBy({ top: r.top - bar - innerHeight / 3, behavior: smooth() });
  }

  /* ── Tooltips for blocks, squares and lines ── */
  const tip = $("#tip");
  function showTip(ev, html, color) {
    tip.innerHTML = html;
    tip.style.setProperty("--c", color || "#f3c623");
    tip.hidden = false;
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = ev.clientX + 14, y = ev.clientY + 16;
    if (x + w > innerWidth - 8) x = ev.clientX - w - 14;
    if (y + h > innerHeight - 8) y = ev.clientY - h - 12;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  const hideTip = () => { tip.hidden = true; };
  function onMapMove(ev) {
    const g = (s) => ev.target.closest(s);
    let el;
    if ((el = g(".sb"))) { const s = SCB[el.dataset.s]; showTip(ev, `<span>${esc(p(TRB[s.tradition].name))} · ${esc(p(s.dates))}</span><b>${esc(p(s.name))}</b>${esc(p(s.idea))}`, TRB[s.tradition].color); return; }
    if ((el = g(".tn"))) { const k = TKB[el.dataset.t]; showTip(ev, `<span>${esc(p(k.life))}</span><b>${esc(p(k.name))}</b>${esc(p(k.role))}`, TRB[k.tradition].color); return; }
    if ((el = g(".hit[data-li]"))) {
      const l = LK[+el.dataset.li];
      showTip(ev, `<span>${esc(t("lk")[l.kind])}</span><b>${esc(p(SCB[l.from].name))} → ${esc(p(SCB[l.to].name))}</b>${esc(p(l.note))}`, MARKERS[l.kind]);
      return;
    }
    if ((el = g(".hit[data-ti]"))) {
      const r = TI[+el.dataset.ti];
      showTip(ev, `<span>${esc(t("tie")[r.kind])}</span><b>${esc(p(TKB[r.from].name))} → ${esc(p(TKB[r.to].name))}</b>${r.note ? esc(p(r.note)) : ""}`, MARKERS[r.kind]);
      return;
    }
    hideTip();
  }
  $("#lin").addEventListener("pointermove", onMapMove);
  $("#th").addEventListener("pointermove", onMapMove);
  $("#lin").addEventListener("pointerover", (ev) => { const b = ev.target.closest(".sb"); const id = b ? b.dataset.s : null; if (id !== linHover && ev.pointerType === "mouse") { linHover = id; paintLineage(); } });
  $("#lin").addEventListener("pointerleave", () => { hideTip(); if (linHover) { linHover = null; paintLineage(); } });
  $("#th").addEventListener("pointerover", (ev) => { const b = ev.target.closest(".tn"); const id = b ? b.dataset.t : null; if (id !== netHover && ev.pointerType === "mouse") { netHover = id; paintNet(); } });
  $("#th").addEventListener("pointerleave", () => { hideTip(); if (netHover) { netHover = null; paintNet(); } });
  /* Answer cards and their squares on the little map light each other up */
  $("#questions").addEventListener("pointerover", (ev) => {
    const el = ev.target.closest("[data-qi]");
    $$("#questions .hot").forEach((x) => x.classList.remove("hot"));
    if (el) $$(`#questions [data-qi="${el.dataset.qi}"]`).forEach((x) => x.classList.add("hot"));
  });

  /* ── Search ────────────────────────────────── */
  const search = $("#search");
  const INDEX = [
    ...SC.map((s) => ({ kind: "s", s, name: [s.name.en, s.name.zh], text: [s.name.en, s.name.zh, s.idea.en, s.idea.zh, s.tags || "", TRB[s.tradition].name.en, TRB[s.tradition].name.zh].join(" ").toLowerCase() })),
    ...TK.map((k) => ({ kind: "t", k, name: [k.name.en, k.name.zh], text: [k.name.en, k.name.zh, k.role.en, k.role.zh, k.idea.en, k.idea.zh, TRB[k.tradition].name.en, TRB[k.tradition].name.zh].join(" ").toLowerCase() })),
    ...TK.flatMap((k) => (k.works || []).map((w) => ({ kind: "w", k, w, name: [w.t.en, w.t.zh], text: [w.t.en, w.t.zh, k.name.en, k.name.zh].join(" ").toLowerCase() })))
  ];
  function openSearch() {
    lastFocus = document.activeElement;
    search.classList.add("open");
    search.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("locked");
    $("#search-input").value = "";
    renderSearch("");
    setTimeout(() => $("#search-input").focus(), 30);
  }
  /* Sent once, when the search closes: only the number of matches, never the typed text */
  let searchCount = 0;
  function closeSearch() {
    if ($("#search-input").value.trim()) track("search", { result_count: searchCount });
    search.classList.remove("open");
    search.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("locked");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  /* Rank hits in a name above hits buried in a description */
  function score(x, words) {
    const name = x.name.join(" ").toLowerCase();
    let s = x.kind === "s" ? 2 : x.kind === "t" ? 1 : 0;
    for (const w of words) {
      const re = new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      if (re.test(name)) s += 10; else if (name.includes(w)) s += 6; else if (re.test(x.text)) s += 2;
    }
    return s;
  }
  function renderSearch(q) {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = words.length ? INDEX.filter((x) => words.every((w) => x.text.includes(w))) : [];
    searchCount = matches.length;
    const hits = words.length
      ? matches.map((x) => ({ x, score: score(x, words) })).sort((a, b) => b.score - a.score).map((h) => h.x).slice(0, 40)
      : INDEX.filter((x) => x.kind === "s" && ["stoicism", "confucianism", "madhyamaka", "existentialism", "empiricism", "falsafa"].includes(x.s.id));
    $("#search-results").innerHTML = hits.length ? hits.map((x) => {
      if (x.kind === "s") return `<button type="button" class="sr" data-sr-s="${x.s.id}" style="--c:${TRB[x.s.tradition].color}"><small>${esc(t("kSchool"))} · ${esc(p(TRB[x.s.tradition].name))} · ${esc(p(x.s.dates))}</small><strong>${esc(p(x.s.name))}</strong><span>${esc(p(x.s.idea))}</span></button>`;
      if (x.kind === "t") return `<button type="button" class="sr" data-sr-t="${x.k.id}" style="--c:${TRB[x.k.tradition].color}"><small>${esc(t("kThinker"))} · ${esc(p(TRB[x.k.tradition].name))} · ${esc(p(x.k.life))}</small><strong>${esc(p(x.k.name))}</strong><span>${esc(p(x.k.role))}</span></button>`;
      return `<button type="button" class="sr" data-sr-t="${x.k.id}" style="--c:${TRB[x.k.tradition].color}"><small>${esc(t("kWork"))} · ${esc(workYear(x.w.y))}</small><strong>${esc(p(x.w.t))}</strong><span>${esc(p(x.k.name))}</span></button>`;
    }).join("") : `<div class="no-results">${esc(t("noResults")(q))}</div>`;
  }

  /* ── Hash routing: #s=stoicism, #t=kant, #q=self ── */
  let hashLock = false;
  function writeHash() {
    if (hashLock) return;
    const q = new URLSearchParams();
    if (selected) q.set(selected.kind, selected.id);
    if (qIdx) q.set("q", QS[qIdx].id);
    const h = q.toString();
    try { history.replaceState(null, "", location.pathname + location.search + (h ? "#" + h : "")); } catch (e) { /* sandboxed */ }
  }
  function readHash() {
    const raw = (location.hash || "").slice(1);
    if (!raw.includes("=")) return null;
    const q = new URLSearchParams(raw);
    const qi = QS.findIndex((x) => x.id === q.get("q"));
    if (qi >= 0) qIdx = qi;
    if (SCB[q.get("s")]) return { kind: "s", id: q.get("s") };
    if (TKB[q.get("t")]) return { kind: "t", id: q.get("t") };
    return null;
  }
  function open(target) { if (target.kind === "s") openSchool(target.id); else openThinker(target.id); }

  /* ── Events ────────────────────────────────── */
  let dragMoved = false;
  document.addEventListener("click", (ev) => {
    const g = (s) => ev.target.closest(s);
    let el;
    if (dragMoved && g(".gx-scroll")) { dragMoved = false; return; }
    if ((el = g("[data-sr-s]"))) { const id = el.dataset.srS; closeSearch(); openSchool(id); reveal($("#lineage"), $(`.sb[data-s="${id}"]`)); return; }
    if ((el = g("[data-sr-t]"))) { const id = el.dataset.srT; closeSearch(); openThinker(id); reveal($("#thinkers"), $(`.tn[data-t="${id}"]`)); return; }
    if ((el = g("[data-goto]"))) {
      const sec = $("#" + el.dataset.goto);
      const item = selected && (selected.kind === "s" ? $(`.sb[data-s="${selected.id}"]`) : $(`.tn[data-t="${selected.id}"]`));
      sec.scrollIntoView({ behavior: smooth() });
      setTimeout(() => reveal(sec, item), 450);
      return;
    }
    if ((el = g("[data-q]"))) {
      qIdx = Math.max(0, QS.findIndex((q) => q.id === el.dataset.q));
      track("select_content", { content_type: "question", item_id: QS[qIdx].id });
      renderQuestions(); writeHash();
      if (el.dataset.scroll) { closeDetail(); $("#questions").scrollIntoView({ behavior: smooth() }); }
      return;
    }
    if ((el = g("[data-s]"))) { openSchool(el.dataset.s); return; }
    if ((el = g("[data-t]"))) { openThinker(el.dataset.t); return; }
    if ((el = g("[data-branch]"))) {
      branch = el.dataset.branch === branch && el.classList.contains("stamp") ? "all" : el.dataset.branch;
      renderLineageBar(); paintLineage();
      if (el.classList.contains("stamp")) $("#lineage").scrollIntoView({ behavior: smooth() });
      return;
    }
    if ((el = g("[data-trace]"))) { trace = el.dataset.trace; store.set("trace", trace); renderLineageBar(); paintLineage(); return; }
    if ((el = g("[data-tie]"))) {
      const k = el.dataset.tie;
      if (tieOn.has(k) && tieOn.size > 1) tieOn.delete(k); else tieOn.add(k);
      store.set("ties", [...tieOn].join(","));
      renderNetBar(); paintNet();
      return;
    }
    if ((el = g("[data-zoom]"))) {
      zoomIdx = clamp(zoomIdx + +el.dataset.zoom, 0, ZOOMS.length - 1);
      store.set("zoom", ZOOMS[zoomIdx]);
      const keep = $$(".gx-scroll").map((sc) => sc.scrollLeft / Math.max(1, sc.scrollWidth));
      renderLineage(); renderNet();
      $$(".gx-scroll").forEach((sc, i) => { sc.scrollLeft = keep[i] * sc.scrollWidth; });
      return;
    }
    if ((el = g(".lang button"))) { if (el.dataset.lang !== lang) { lang = el.dataset.lang; store.set("lang", lang); setParam("lang", lang === "zh" ? "zh" : null); renderAll(); pageView(); track("select_content", { content_type: "language", item_id: lang }); } return; }
    if ((el = g("[data-consent]"))) { setConsent(el.dataset.consent); return; }
    if (g("#consent-open")) { $("#consent").hidden = false; $("#consent [data-consent]").focus(); return; }
  });
  $("#detail-close").addEventListener("click", closeDetail);
  $("#search-open").addEventListener("click", openSearch);
  $("#search-close").addEventListener("click", closeSearch);
  $("#search-input").addEventListener("input", (e) => renderSearch(e.target.value));

  /* Drag the maps sideways with a mouse */
  let drag = null;
  $$(".gx-scroll").forEach((sc) => sc.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { sc, x: e.clientX, left: sc.scrollLeft };
    dragMoved = false;
  }));
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) { dragMoved = true; drag.sc.classList.add("drag"); hideTip(); }
    if (dragMoved) drag.sc.scrollLeft = drag.left - dx;
  });
  addEventListener("pointerup", () => { if (drag) drag.sc.classList.remove("drag"); drag = null; setTimeout(() => { dragMoved = false; }, 0); });

  document.addEventListener("keydown", (e) => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
    if (e.key === "Escape") {
      if (search.classList.contains("open")) closeSearch();
      else if (detail.classList.contains("open")) closeDetail();
      return;
    }
    if (search.classList.contains("open")) return;
    if (e.key === "/" && !typing) { e.preventDefault(); openSearch(); }
  });
  addEventListener("hashchange", () => {
    /* A plain in-page anchor (#lineage, #top…) only scrolls: put the state back in the address */
    if (!location.hash.includes("=")) { writeHash(); return; }
    const target = readHash();
    renderQuestions();
    if (target) open(target);
  });

  /* Analytics consent (GA itself is set up in index.html, on the production domain only) */
  function setConsent(value) {
    store.set("consent", value);
    if (typeof window.gtag === "function") window.gtag("consent", "update", { analytics_storage: value });
    /* Withdrawing consent also removes GA cookies (host-only, plus any older ones set on a domain) */
    if (value === "denied") {
      const parent = "." + location.hostname.split(".").slice(-2).join(".");
      document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => /^_ga/.test(n)).forEach((n) => {
        for (const domain of ["", `; domain=${location.hostname}`, `; domain=${parent}`]) document.cookie = `${n}=; Max-Age=0; path=/${domain}`;
      });
    }
    $("#consent").hidden = true;
  }
  if (typeof window.gtag === "function") {
    $("#consent-open").hidden = false;
    if (!store.get("consent")) $("#consent").hidden = false;
  }

  let resizeT = 0, lastW = innerWidth;
  addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => { if (Math.abs(innerWidth - lastW) > 60) { lastW = innerWidth; renderHero(); renderLineage(); renderNet(); renderQuestions(); } }, 200); });

  function renderAll() {
    applyStatic();
    renderHero();
    renderLineageBar();
    renderLineage();
    renderNetBar();
    renderNet();
    renderQuestions();
    renderIndex();
    renderLearning();
    if (selected) open(selected);
  }

  const start = readHash();
  renderAll();
  pageView();
  if (start) requestAnimationFrame(() => {
    open(start);
    const sec = start.kind === "s" ? $("#lineage") : $("#thinkers");
    sec.scrollIntoView();
    reveal(sec, start.kind === "s" ? $(`.sb[data-s="${start.id}"]`) : $(`.tn[data-t="${start.id}"]`));
  });
})();

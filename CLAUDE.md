# Dialectica: working conventions

A static, bilingual (EN/中文) atlas of philosophy: 8 traditions, 72 schools, 204 thinkers, the links between schools
and the ties between thinkers, drawn as a lineage map, a thinkers' network, a crossings matrix and a questions grid. Repository: github.com/geekplux/dialectica. Sibling projects: Art-isms, Worldlines.
Read README.md for the data model and file layout. These are the rules that are easy to break.

## No build step

- The site is plain HTML, CSS and JavaScript in `public/`, deployed as-is. Do not add a bundler, framework,
  package.json or build command unless the owner agrees first.
- Everything deployable lives in `public/`; nothing else is uploaded. Scripts in `scripts/` are dev-time
  tools (Node 22, no dependencies).
- Serve locally with `python3 -m http.server 8000 --directory public` (or `npx wrangler dev`).

## Content

- Content is in `public/data/` (`window.DIALECTICA`): `core.js`, `schools.js`, `thinkers.js`, `links.js`. Every piece of
  text is `{ "en": "…", "zh": "…" }`, both non-empty. Add new text in both languages in the same change.
- English is the default language and `/` is always the English page; Chinese is `/?lang=zh`. Do not switch
  language from the browser's locale.
- One language at a time: the English view shows no Chinese (the 中文 button is the one exception), and the Chinese
  view shows no English subtitles.
- Philosophy is argued about; the atlas should not take sides. State a school's view as its view, and contested
  claims (dates, attributions, influence) as contested. If a fact can't be verified, list it in `docs/` for the
  owner; don't silently "fix" it. Open items are in `docs/open-questions-2026-10.md`.
- A link or tie must be historically real: a documented teacher, a text someone read, a critique someone wrote.
  Parallels between traditions that never met are not links.
- The counts quoted in `index.html` (schools, thinkers, traditions) must match the data; `check-data` fails otherwise.

## Design

- Mondrian carries meaning: colour = tradition, a block = a school, a square = a thinker; solid ink, dashed red and
  dotted blue lines are the three kinds of link. Everything else stays paper and ink. Prefer removing emphasis to adding it.
- Worldlines follows Mondrian's 1920s grids; Dialectica follows his New York paintings (lines that cross and weave).
  The hero is generated from the data, so it changes when the data does: keep it that way rather than drawing art by hand.
- Edges read in the direction the idea travelled (A → B); labels say what B did with it ("answered with a critique").
- A name always sits on its block: when a school is too short-lived to hold its name, the block continues in a white
  cell. Nothing may extend past the end of a map.
- Hairlines inside sections; heavy rules only between sections.
- Check every change at desktop width and at 390px, in both languages: no horizontal page scroll, no console errors.

## Analytics and privacy

- GA4 (`G-1MGF28FKRC`) loads on `dialectica.geekplux.org` only, with Consent Mode v2 defaulting to denied. Keep the
  hostname guard, keep ads storage denied, keep cookies host-only (`cookie_domain: "none"`), and never send personal
  data or typed search text in event parameters. Page views go through `pageView()` after render; events through
  `track()`, a no-op wherever `gtag` is not defined. Keep the GA4 setting "Page changes based on browser history
  events" off.

## Before every commit

1. `node scripts/stamp-assets.mjs` if `public/assets/app.js` or `styles.css` changed.
2. `node scripts/check-data.mjs` (CI runs it too).
3. Open the page at desktop width and at 390px, in both languages.

## Caching and deployment

- Cloudflare Workers Static Assets, configured in `wrangler.jsonc`; Workers Builds deploys `master` on push.
- `public/_headers` caches `assets/` for a year. That is only safe because every reference has a `?v=<content hash>`.
- One commit per logical change, with a message that says why.

# Dialectica · 思辨谱

A bilingual (English / 中文) atlas of philosophy in the style of Mondrian. It draws the family tree of 72 schools and the network of 204 thinkers across eight traditions, from the Upanishads and the Hundred Schools to analytic philosophy, and shows where each idea came from, the reasoning behind it, and who taught, read and argued with whom.

**Live site:** https://dialectica.geekplux.org/ ([中文](https://dialectica.geekplux.org/?lang=zh)) — once deployed.

- **Lineage.** Every school is a block on a shared time axis, one lane per tradition, drawn for as long as it lasted. Lines join schools: solid when an idea is carried forward, dashed red when one school argues against another, dotted blue when an idea crosses between traditions. Select a school to light up its direct links or its whole lineage, and filter by branch (metaphysics, knowledge, ethics, politics, logic and language, mind, God and the ultimate). Hover a line to read what passed along it.
- **Thinkers.** Each thinker is a square placed at about the age of forty. Ties join teachers to students, readers to the writers who shaped them, and critics to their targets; each kind can be switched off.
- **Questions.** Seven big questions (what is real, how we know, how to live, what makes power legitimate, what the self is, whether words reach the truth, whether there is a ground of everything), each answered by a dozen schools in time order, with a small map of where each answer sits.
- **Schools.** An index of every school by tradition.
- **Panels.** A school's page gives its question, why it arose, the reasoning behind it, three key claims, what it left, its thinkers and key texts, where it came from and what it led to, and its answers to the big questions. A thinker's page gives their idea, works, schools, teachers, students, influences, critics, and contemporaries in other traditions. Portraits are Wikipedia lead images (Commons files only).
- **Search** (<kbd>/</kbd>) covers schools, thinkers and works in both languages. <kbd>Esc</kbd> closes panels.
- **Shareable links.** English is the default; `?lang=zh` opens the Chinese view. The hash records the open school or thinker and the question, e.g. `/?lang=zh#s=madhyamaka` or `/#t=kant&q=know`.
- **No build step.** Plain HTML, CSS and JavaScript, with the content in four data files. A sibling of [Art-isms](https://artisms.geekplux.org/) and [Worldlines](https://worldlines.geekplux.org/).

## Run it locally

```sh
python3 -m http.server 8000 --directory public
# then visit http://localhost:8000
```

`npx wrangler dev` also works. Portraits load from Wikipedia, so they need a connection; without one, each panel shows a Mondrian plate instead.

## Project structure

```
public/                 everything that is deployed, and nothing else
  index.html            page skeleton, static copy, SEO tags, analytics setup
  assets/styles.css     all styles (paper, ink and De Stijl)
  assets/app.js         layout of both maps, panels, questions, search, i18n, routing, consent bar
  data/core.js          traditions, branches, eras of the time axis, the big questions, learning notes
  data/schools.js       every school
  data/thinkers.js      every thinker
  data/links.js         links between schools and ties between thinkers
  _headers              cache and security headers for Cloudflare
  robots.txt, sitemap.xml, favicon.svg
scripts/check-data.mjs  validates the data, the asset stamps and the counts quoted in the page
scripts/stamp-assets.mjs  writes ?v=<content hash> into index.html
docs/                   open questions and fact-check passes
wrangler.jsonc          Cloudflare Workers Static Assets config
```

## Content model

Every piece of text is a `{ "en": "…", "zh": "…" }` pair. Years are integers; negative years are BCE and there is no year 0.

A **school** (`public/data/schools.js`):

```js
{
  "id": "stoicism", "tradition": "greek", "start": -300, "end": 250,     // end 2026 for a living tradition
  "dates": { … },                                                       // display text, e.g. "c. 300 BCE – 3rd c. CE"
  "name": { … }, "branches": ["ethics", "logic", "metaphysics"],
  "idea": { … },        // the core thesis in one sentence
  "question": { … },    // the question it set out to answer
  "origin": { … },      // why it arose
  "reasoning": { … },   // the argument behind it
  "claims": [ {…}, {…}, {…} ],
  "legacy": { … },
  "works": [ { "by": "epictetus", "t": { … }, "y": 108 } ],
  "figures": ["zeno-citium", "chrysippus", "seneca", "epictetus", "marcus-aurelius"],
  "tags": "stoa logos virtue 斯多葛 …",
  "wiki": "Stoicism"    // English Wikipedia title, for the image and "read more"
}
```

A **thinker** (`public/data/thinkers.js`):

```js
{ "id": "epictetus", "tradition": "greek", "born": 50, "died": 135,      // died: null for the living
  "life": { … }, "name": { … }, "role": { … }, "idea": { … },
  "schools": ["stoicism"], "works": [ { "t": { … }, "y": 125 } ], "wiki": "Epictetus" }
```

For ancient thinkers whose dates are unknown, `born`/`died` are conventional placeholders that put them in the right place on the map; `life` says what is actually known.

**Links** join schools and **ties** join thinkers (`public/data/links.js`). Both read `from → to`:

| `kind` | Between | Meaning |
| --- | --- | --- |
| `dev` | schools | `to` carries forward or develops `from` |
| `react` | schools | `to` reacts against `from` |
| `fuse` | schools | `to` borrows from `from` across traditions |
| `taught` | thinkers | `from` was `to`'s teacher |
| `infl` | thinkers | `from`'s work shaped `to` |
| `opp` | thinkers | `to` argued against `from` |

Links carry a one-sentence `note` on what passed between them; ties may.

## Adding or correcting content

1. Edit the data file.
2. If you changed `assets/app.js` or `assets/styles.css`, run `node scripts/stamp-assets.mjs`.
3. Run `node scripts/check-data.mjs`; add `--warnings` to list thinkers without ties and schools without links.
4. Open the page in both languages, at desktop width and at 390px.

CI runs the same check on every push and pull request. Facts the first content pass could not verify are listed in `docs/open-questions-2026-10.md`.

## Deployment

Intended for **https://dialectica.geekplux.org/** on **Cloudflare Workers Static Assets** with Workers Builds, like the sibling sites: every push to `master` runs `npx wrangler deploy`, which uploads `public/` as configured in `wrangler.jsonc`. The Worker name `dialectica` must match the Worker in the Cloudflare dashboard.

`public/_headers` caches `assets/` for a year. That is safe because every reference carries a content hash (`?v=…`) written by `scripts/stamp-assets.mjs`; `check-data` fails while a stamp is stale. `index.html` and `data/` are revalidated on every visit.

## Analytics

The Google Analytics setup (Consent Mode v2, host-only cookies, page views sent after render, no typed search text) is copied from Worldlines but **inactive**: `GA_ID` in `public/index.html` is empty. Set it to a GA4 measurement ID for this site to turn it on; it then runs on `dialectica.geekplux.org` only.

## Caveats

Schools rarely begin or end in a single year, and many ancient dates are traditional or disputed. Every line is a simplification of conversations that ran for generations, and the selection is deliberately small: a map for learning, not a complete history of philosophy.

## License

- Code (`public/index.html`, `public/assets/`, `scripts/`): [MIT](LICENSE)
- Written content in `public/data/`: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Portraits are not part of this repository. Each one is loaded from Wikimedia Commons under its own licence.

# Contributing to DSA Visualizer

Thanks for wanting to help. This project exists to make data structures and algorithms easier to **see**, especially for beginners, so clear explanations matter as much as clever code.

Small pull requests are welcome: a typo, a clearer sentence in an explainer, a bug fix, a new preset. For anything bigger (a new algorithm or a new tool), please open an issue first so we can agree on the shape before you spend your time.

New here? Start with a [good first issue](https://github.com/salsadsid/visualizer/labels/good%20first%20issue).

## Run it locally

You need Node 22 or newer.

```bash
git clone https://github.com/salsadsid/visualizer.git
cd visualizer
npm install
npm run dev        # http://localhost:3000
```

Before you open a pull request, all three of these must pass. CI runs the same commands.

```bash
npm run lint
npm test
npm run build
```

`next build` does **not** run ESLint, so run `npm run lint` yourself.

## How the visualizers work

Each algorithm is a plain function that returns a flat list of **step snapshots**:

```js
Step = {
  array,        // the working array at this moment
  highlights,   // { index: role } — "compare" | "swap" | "min" | "key" | "shift" | "sorted"
  pointers,     // index variables (i, j, min) drawn under the bars
  vars,         // scalar variables (key, swapped) shown as chips
  line,         // the active pseudocode line, 0-based
  message,      // the narration text
  stats,        // cumulative { comparisons, swaps, writes }
}
```

`makeRecorder(a)` in `src/lib/algorithms/sorting.js` does the bookkeeping. The algorithm mutates its copy of the array, updates `r.pointers`, `r.vars` and `r.stats`, and calls `r.push(line, message, highlights)` whenever something worth showing happens. `r.sorted.add(i)` keeps a bar green for the rest of the run.

The `usePlayer` hook plays, pauses, steps and scrubs through that list, and shared components (`BarChart`, `Pseudocode`, `PlayerControls`, `StatsRow`, `VarChips`) draw it. Nothing in the UI knows which algorithm is running.

## Adding a sorting algorithm

This is the full checklist. `npm test` fails if you miss one of the first four.

1. **`src/lib/algorithms/sorting.js`**: write the function and add an entry to `SORTERS` with `key`, `label`, `blurb`, `lead`, `roles`, `pseudocode`, `complexity` and `run`. Every `line` you push must be a valid index into `pseudocode`.
2. **`src/lib/algorithms/snippets.js`**: add `SORT_CODE[key]` with C++, Python, JavaScript and TypeScript versions.
3. **`src/lib/catalog.js`**: add a `SORT_PAGES` entry (slug, title of at most 60 characters with the site suffix, description of at most 155, `h1`, `intro`, `teaches`, `share`, `next`, `updatedAt`). Point the previous page's `next` at yours, and remove the topic from `PLANNED`.
4. **`src/components/algorithms/explainers/`**: write `YourSortExplainer.jsx` (copy an existing one) and register it in the `EXPLAINERS` map in `src/app/algorithms/sorting/[algo]/page.jsx`.
5. **`src/lib/algorithms/roles.js`**: only if you need a new highlight role.
6. **`src/components/algorithms/SortingComparison.jsx`**: mention the new sort in the comparison copy and FAQ.
7. **`tests/sorting.test.mjs`**: the shared tests pick up every sorter automatically. Add a test for anything special about yours, such as an exact comparison count.
8. **`README.md`**: add the page to the table.

The route, share card, sitemap entry, footer link, comparison table and the Learn panel are generated from steps 1 to 3.

## Adding a grid traversal

Traversals live next to the 2D Array Visualizer and share its grid. The checklist is shorter than for a sort:

1. **`src/lib/array/traversals.js`**: write the function with `makeGridRecorder` (call `r.visit(i, j, line, message, role)` for every cell and `r.push` for narration between visits) and add a `TRAVERSALS` entry with `key`, `label`, `blurb`, `lead`, `roles`, `pseudocode`, `count(rows, cols)` and `run`. `count` is how many cells the order visits; the tests check that the visit order is a permutation of exactly that many cells.
2. **`src/lib/array/traversalCode.js`**: add the C++, Python and JavaScript bodies (TypeScript is generated from JavaScript).
3. **`src/lib/catalog.js`**: add a `TRAVERSAL_PAGES` entry and point the previous page's `next` at it.
4. **`src/components/array/traversals/`**: write `YourOrderExplainer.jsx` (copy an existing one; `WorkedExample` and `Sequence` read their numbers from the engine) and register it in the `EXPLAINERS` map in `src/app/data-structures/arrays/traversal/[kind]/page.jsx`.
5. **`src/app/data-structures/arrays/traversal/page.jsx`**: add a row to the comparison table.

The route, share card, sitemap entry, switcher button, "Traverse this grid" link and the Learn panel are generated from steps 1 to 3.

## Adding a grid algorithm

Grid algorithms (flood fill, islands, BFS shortest path) share the traversal engine and the clickable grid:

1. **`src/lib/array/gridAlgorithms.js`**: write the function with `makeGridRecorder` from `gridRecorder.js` (`r.visit` for a cell being processed, `r.frontier` for the queue or call stack, `r.marks` for persistent roles such as walls, `r.mark` for a badge without a visit, `r.extra` for extra counters) and add a `GRID_ALGORITHMS` entry with `key`, `label`, `blurb`, `lead`, `roles` (from `gridRoles.js`), `pseudocode`, `strip`, `click` (`"start"`, `"toggle"` or `"wall"`), `defaultGrid` and `run(grid, options)`.
2. **`tests/gridAlgorithms.test.mjs`**: compare the result with a plain reference implementation on seeded random grids.
3. **`src/lib/array/gridCode.js`**: the four languages.
4. **`src/lib/catalog.js`**: a `GRID_PAGES` entry and the previous page's `next`.
5. **`src/components/array/grid/`**: the explainer, registered in the `EXPLAINERS` map in `src/app/algorithms/grid/[slug]/page.jsx`; a row in the overview table in `src/app/algorithms/grid/page.jsx`.

The route, share card, sitemap entry, switcher button, "Run on this grid" link, counters and the Learn panel follow from steps 1, 3 and 4.

## Adding a matrix operation

1. **`src/lib/array/matrixOps.js`**: add a `MATRIX_OPS` entry with `key`, `label`, `blurb`, `lead`, `roles` (from `gridRoles.js`), `counters` (three; `remaining` is derived from the result size), `shape(rows, cols, options)`, `resultLabel` and either `pseudocode` or `variants` (each with `label`, `resultLabel`, `pseudocode`, `target` and `describe`, plus a `defaultVariant`). Operations that only move cells go through `copyOperation`; anything else writes its own `run(a, options)` returning `{ steps, result }`, where every step has `panels.a`, an optional `panels.b` and `panels.out` (its `matrix` plus `cells` and `pointers` for each panel) and `stats` with `reads`, `writes` and `mults`. Unwritten result cells hold `PAD_TOKEN`. Never mutate the inputs.
2. **`src/lib/array/matrixCode.js`**: the four languages.
3. **`tests/matrix.test.mjs`**: the result against a reference implementation on seeded random grids, plus the step and counter totals.
4. **`src/lib/catalog.js`**: a `MATRIX_PAGES` entry (`name`, `title`, `h1`, `description`, `intro`, `teaches`, `share`, `next`).
5. **`src/components/array/matrix/<Name>Explainer.jsx`**, registered in `src/app/data-structures/arrays/matrix/[op]/page.jsx`.

The switcher, sliders, variant toggle, counters, share link, Learn panel and share card follow from steps 1 and 4.

## Adding a 1D array operation

1. **`src/lib/array/oneD.js`**: write the function with `makeTrace` (`t.push(line, message, highlights)` records a step; keep `t.stats` to `reads`, `writes` and `compares` and put operation words such as `shifts` in `t.vars`) and add an `OPERATIONS` entry with `key`, `label`, `blurb`, `lead`, `roles` (from `boxRoles.js`), `pseudocode`, `complexity`, `inputs` (`"index"`, `"value"`, `"target"`) and `run(values, options)`. Never mutate `values`.
2. **`src/lib/array/oneDCode.js`**: the four languages.
3. **`tests/oneD.test.mjs`**: the expected result and counts on seeded random arrays, plus the boundary cases.
4. **`src/components/array/ArrayOperationsExplainer.jsx`**: an H2 section for the operation.

The switcher button, option controls, counters, share link and Learn panel follow from step 1.

### Writing the explainer

The explainers are what teachers and search engines read, so please follow the house style:

- **Story first.** Open with something physical (cards, coins, a queue), then the step-through, and only then the notation.
- Say **"steps"**, not "operations". Show what the input must look like before the algorithm can run (for example, binary search needs a sorted list).
- Use a small worked example whose numbers match what the visualizer shows. Run it and copy the counters.
- Keep sentences short. Many readers are not native English speakers.

## Three lint rules that catch everyone

The strict `eslint-plugin-react-hooks` rules are on. They are the most common reason a pull request fails.

| Rule | Instead |
| --- | --- |
| No `setState` directly inside a `useEffect` body | Derive the value during render, or reset state during render when a prop changes (see `usePlayer.js`). For browser state such as `matchMedia` or `sessionStorage`, use `useSyncExternalStore` (see `usePrefersReducedMotion.js`, `useSessionFlag.js`). |
| No writing to a ref during render | Write refs inside an effect or an event handler. |
| No impure calls during render (`Math.random()`, `Date.now()`, reading storage) | Do it inside an event handler, an effect callback or a timer. `HeroDemo.jsx` shuffles inside its timeout for this reason. |

Two layout habits save a lot of pain:

- Grid children that hold wide, non-wrapping content (`whitespace-pre`, code, tables) need `min-w-0`, or the page scrolls sideways on phones. Check your change at 320 px wide.
- Class names must appear as complete strings. `bg-${color}-500` is never generated by Tailwind; map keys to full class names instead (see `src/lib/algorithms/roles.js`).

## Pages, metadata and analytics

- Every page's title, description and path live in `src/lib/catalog.js`. Build route metadata with `buildMetadata()` from `src/lib/seo.js`. Hand-written `openGraph` objects silently drop the share image.
- If a route has child routes, export `metadata` from its `page.jsx`, not its `layout.js`. A layout with a plain string title removes the site-wide title suffix from its children.
- Structured data comes from `src/lib/jsonld.js`. Use `LearningResource` for tools.
- Use `TrackedLink` or `track()` from `src/lib/analytics.js` for analytics events. They do nothing unless `NEXT_PUBLIC_GA_ID` is set, so local development sends no data. Events in use: `tool_open`, `play`, `run_complete`, `algo_select`, `preset_select`, `custom_input`, `learn_tab`, `share_click`, `embed_click`, `embed_view`, `export_click`, `github_click` and `feedback_click`, with the params `tool`, `algo`, `from`, `tab`, `preset` and `variant`.
- `?embed=1` puts a page in embed mode. An inline script in `src/app/layout.js` sets `data-embed` on `<html>` before hydration, the rules at the bottom of `globals.css` hide everything with the `embed-hide` class and show `embed-only`, and `EmbedFrame` (rendered by `PageShell`) keeps in-page links inside the embed and shows the link back to the site. Give any new shell piece that should disappear inside an iframe the `embed-hide` class. Do not read `searchParams` in a page for this; it would make the page dynamic.
- Export as PNG (`exportNodeAsPng` in `src/lib/exportPng.js`) draws whatever element the ref points at from computed styles: solid backgrounds, borders, rounded corners and text. Gradient backgrounds are not drawn, so only point it at solid-coloured grids and boxes.

## Project structure

```
src/
├── app/
│   ├── page.js                      # Landing page
│   ├── layout.js                    # Root layout, fonts, theme bootstrap, analytics
│   ├── globals.css                  # Design tokens and the motion system
│   ├── sitemap.js, robots.js        # Generated from lib/catalog.js
│   ├── roadmap/page.jsx
│   ├── algorithms/
│   │   ├── page.jsx                 # Algorithms hub
│   │   ├── complexity/              # Big-O Playground
│   │   ├── grid/                    # Grid algorithms overview + [slug] pages
│   │   └── sorting/
│   │       ├── layout.js            # Keeps your array while you switch sorts
│   │       ├── page.jsx             # Overview: compare the three sorts
│   │       └── [algo]/              # One page and one share card per algorithm
│   └── data-structures/
│       ├── page.jsx                 # Data structures hub
│       └── arrays/                  # 2D Array Visualizer
│           └── traversal/           # Overview + [kind] pages for the six orders
├── components/
│   ├── algorithms/                  # BarChart, PlayerControls, Pseudocode, usePlayer,
│   │   └── explainers/              #   and one written explainer per sort
│   ├── array/                       # InputPanel, ArrayGrid, TraversalVisualizer, explainers
│   │   ├── traversals/              #   one explainer per traversal order
│   │   └── grid/                    #   one explainer per grid algorithm
│   ├── analytics/, engagement/, seo/
│   ├── learn/                       # Explainer building blocks (sections, FAQ, code)
│   └── layout/                      # PageShell, SiteHeader, Breadcrumbs, NextStep, Footer
└── lib/
    ├── catalog.js                   # Every page: titles, descriptions, cards, roadmap
    ├── algorithms/                  # sorting.js (step model), presets, roles, snippets
    ├── array/                       # parser, presets, snippets
    └── seo.js, jsonld.js, og.jsx, site.js, analytics.js
tests/                               # node:test, no dependencies
```

## Commits and pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org): `feat(sorting): add counting sort`, `fix(arrays): accept trailing commas`, `docs: …`, `test: …`.
- One logical change per commit. Each commit should pass lint, tests and the build.
- Match the surrounding code: 4-space indentation, double quotes, and no new comments unless the code truly cannot explain itself.
- In the pull request, say what changed and how you checked it. A screenshot or a short recording helps a lot for visual changes.

## Questions

Open a [discussion](https://github.com/salsadsid/visualizer/discussions) or an issue. If you teach with this tool, I would love to hear [what your class needs](https://github.com/salsadsid/visualizer/issues/new/choose).

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

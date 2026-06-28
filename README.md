<p align="center">
  <img src="public/logo.svg" alt="DSA Visualizer" width="360" />
</p>

<p align="center">
  An interactive, beginner-friendly playground for <strong>seeing</strong> data structures and algorithms work — step by step, in the browser.
</p>

<p align="center">
  Press play and watch the bars compare and swap, follow the highlighted pseudocode, read the live loop variables, and learn the <em>why</em> behind each technique.
</p>

> Built with Next.js 16 and Tailwind CSS 4 to make DSA easier to see, touch, and learn.

---

## Visualizers

### 🔀 Sorting Visualizer — `/algorithms/sorting`

Step through **Bubble**, **Selection**, and **Insertion** sort:

- Animated gradient bars that **pop** on each swap, with a 🎉 confetti finish
- **Play / pause / step / scrub** controls and a 0.5×–4× speed dial (plus `Space` and `←`/`→` shortcuts)
- **Synchronized pseudocode** — the active line highlights as it runs
- **Live variables on the board** — pointer markers (`i`, `j`, `min`) under the bars and value chips (`key`, `swapped`)
- A plain-English **narration** line and live **comparison / swap / write** counters
- Presets (random, reversed, nearly-sorted, few-unique, sorted), a size slider, shuffle, and custom input

### 🟦 2D Array Visualizer — `/data-structures/arrays`

Paste any JSON matrix, color each value, and see how grids map to rows and columns:

- JSON-driven input; ragged rows pad automatically; numbers, strings, booleans, and `null` all render
- Per-value coloring (fill, border, text) and optional row/column indices

Both tools ship with an inline learning panel (concept, use cases, complexity, and
**C++ / Python / JavaScript / TypeScript** code), light + dark themes, a responsive
layout, and full `prefers-reduced-motion` support.

---

## Learn the topics

A condensed version of the in-app learning panels — enough to understand what you're
watching.

### Sorting — the big picture

**Sorting** arranges items into order (here, smallest → largest). The three sorts in
this app share three traits:

- **Comparison sorts** — they decide order purely by comparing pairs of values.
- **In-place** — they reuse the same array, so extra memory is **O(1)**.
- **O(n²) average time** — great for learning and for small or nearly-sorted data,
  not for huge datasets.

Two terms worth knowing:

- **Stable** — equal values keep their original relative order. (Bubble and insertion
  are stable; selection is not.)
- **Adaptive** — runs faster when the input is already partly sorted. (Bubble with an
  early-exit and insertion are adaptive; selection is not.)

### 🫧 Bubble sort

**Idea:** repeatedly walk the list and swap any adjacent pair that's out of order, so
large values "bubble" to the right.

**How it works:** on each pass, compare `a[j]` with `a[j+1]` and swap if needed. After
pass *k*, the largest *k* values are parked at the end. If a whole pass makes **no
swaps**, the array is already sorted and we stop early.

| Best | Average | Worst | Space | Stable |
| ---- | ------- | ----- | ----- | ------ |
| O(n) | O(n²)   | O(n²) | O(1)  | Yes    |

**Why learn it:** the gentlest introduction to sorting, and the early-exit shows how an
algorithm can detect "already sorted" cheaply (the O(n) best case).

### 🎯 Selection sort

**Idea:** each pass finds the smallest remaining value and drops it into the next slot.

**How it works:** scan the unsorted region for the index of its minimum, then swap that
minimum into the front of the region. Repeat with a region that shrinks by one each time.

| Best  | Average | Worst | Space | Stable |
| ----- | ------- | ----- | ----- | ------ |
| O(n²) | O(n²)   | O(n²) | O(1)  | No     |

**Why learn it:** it always does the **fewest swaps** (at most *n − 1*), which matters
when writing to memory is expensive — even though it never gets faster on sorted input.

### 📥 Insertion sort

**Idea:** grow a sorted prefix one element at a time, inserting each new value into its
correct spot — exactly how most people sort a hand of playing cards.

**How it works:** take `a[i]` as the **key**, slide every larger value in the sorted
prefix one step right, then drop the key into the gap that opens up.

| Best | Average | Worst | Space | Stable |
| ---- | ------- | ----- | ----- | ------ |
| O(n) | O(n²)   | O(n²) | O(1)  | Yes    |

**Why learn it:** the best real-world performer of the three on **small or nearly-sorted**
data, and it's used as the base case inside fast hybrid sorts like Timsort (Python, Java)
and introsort (C++ `std::sort`).

### 🟦 2D arrays

A **2D array** is an array of arrays — a grid of `rows × cols` cells reached with two
indices, `matrix[row][col]`. Most languages store it in **row-major** order (all of row
0, then all of row 1, …), which is why iterating row-by-row is cache-friendly.

| Operation                | Time     |
| ------------------------ | -------- |
| Access / update a cell   | O(1)     |
| Search for a value       | O(r · c) |
| Iterate (row-major)      | O(r · c) |
| Space                    | O(r · c) |

Used everywhere: game boards, images (a grid of pixels), adjacency matrices for graphs,
and dynamic-programming tables.

### Big-O, quickly

`O(1)` constant · `O(log n)` halving each step · `O(n)` one pass · `O(n log n)` the best
general sorts · `O(n²)` nested passes (the sorts above). Lower is better as *n* grows.

---

## Under the hood

Each algorithm is a generator that returns a flat list of **step snapshots**:

```js
Step = {
  array,        // the working array at this moment
  highlights,   // which bars are comparing / swapping / sorted …
  pointers,     // index variables (i, j, min) drawn under the bars
  vars,         // scalar variables (key, swapped) shown as chips
  line,         // the active pseudocode line
  message,      // the narration text
  stats,        // cumulative { comparisons, swaps, writes }
}
```

A small `usePlayer` hook plays, pauses, steps, and scrubs through that list, and shared
components (`BarChart`, `Pseudocode`, `PlayerControls`, `StatsRow`, `LearningTabs`)
render it. New algorithms only need to emit steps — the player and UI come for free.

## Tech stack

| Layer     | Tools                                      |
| --------- | ------------------------------------------ |
| Framework | Next.js 16 (App Router) · React 19         |
| Styling   | Tailwind CSS 4 · CSS variables for theming |
| Fonts     | Geist Sans + Geist Mono via `next/font`    |
| Utilities | `clsx`, `tailwind-merge`                    |
| Linting   | ESLint 9 (`eslint-config-next`)            |

No backend, no database — it runs entirely in the browser.

## Project structure

```
src/
├── app/
│   ├── page.js                      # Landing page (live auto-sort hero demo)
│   ├── layout.js                    # Root layout, fonts, theme bootstrap
│   ├── globals.css                  # Design tokens + motion system
│   ├── roadmap/page.jsx             # What's shipped / planned
│   ├── algorithms/
│   │   ├── page.jsx                 # Algorithms hub
│   │   └── sorting/page.jsx         # Sorting Visualizer
│   └── data-structures/
│       └── arrays/page.jsx          # 2D Array Visualizer
├── components/
│   ├── ThemeToggle.jsx              # Light/dark toggle (floating button)
│   ├── algorithms/                  # BarChart, PlayerControls, Pseudocode,
│   │                                #   usePlayer, StatsRow, VarChips, Confetti, HeroDemo …
│   ├── array/                       # InputPanel, ArrayGrid, ColorSettings, LearningPanel
│   └── layout/                      # PageShell, BackLink, Footer
└── lib/
    ├── algorithms/                  # sorting.js (step model), presets, roles, snippets
    └── array/                       # parser, presets, snippets
```

## Roadmap

See [`/roadmap`](src/app/roadmap/page.jsx) in the app for the full list. Next up:
**counting sort & frequency arrays**, then merge/quick sort, binary search, and the
core array techniques (prefix sums, two pointers, sliding window).

## License

MIT. Feel free to fork, learn from, or extend.

---

Built by [Salman Sadik Siddiquee](https://github.com/salsadsid) ·
[Repository](https://github.com/salsadsid/visualizer)

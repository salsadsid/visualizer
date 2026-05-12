# DSA Visualizer

An interactive playground for visualizing data structures and algorithms.
Currently focused on **2D arrays**. Paste JSON, color each value, and see how
matrices map to a grid.

> Built with Next.js 16 and Tailwind CSS 4 to make data structures easier to
> see, touch, and learn.

---

## Features

- **JSON-driven input**: paste any 2D array; ragged rows are padded automatically
- **Multi-type cells**: numbers, strings, booleans, and `null` all render
- **Per-value coloring**: pick a color for each unique cell value, plus border and text
- **Presets**: Identity, Zero, Random, String, Bool, and Chess starting positions
- **Optional row/column indices**: toggle to show array coordinates
- **Inline learning panel**: concept, use cases, time complexity, and code snippets
- **Light + dark themes** with system preference detection and no flash on load
- **Responsive layout** down to mobile, built without a UI library

## Tech stack

| Layer       | Tools                                         |
| ----------- | --------------------------------------------- |
| Framework   | Next.js 16 (App Router) · React 19            |
| Styling     | Tailwind CSS 4 · CSS variables for theming    |
| Fonts       | Geist Sans + Geist Mono via `next/font`       |
| Utilities   | `clsx`, `tailwind-merge`                      |
| Linting     | ESLint 9 (`eslint-config-next`)               |

No backend, no database. Runs entirely in the browser.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` (for local) or set them in your hosting
provider (Vercel Dashboard → Project → Settings → Environment Variables):

| Variable                            | Required? | What it does                                                                 |
| ----------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | No        | Production URL for canonical tags, sitemap, OG image. Falls back to a default. |
| `NEXT_PUBLIC_GA_ID`                 | No        | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`). When set, GA loads.       |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No     | Token for Search Console domain verification.                                 |

### Analytics

- **Vercel Web Analytics** and **Speed Insights** load automatically on Vercel deployments (no env vars needed).
- **Google Analytics 4** loads only when `NEXT_PUBLIC_GA_ID` is set. Get the ID at [analytics.google.com](https://analytics.google.com) → Admin → Data Streams → Web → Measurement ID.
- **Search Console**: verify ownership at [search.google.com/search-console](https://search.google.com/search-console). Either drop the token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (HTML-tag method) or verify via DNS TXT record at your registrar.

### Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start dev server             |
| `npm run build` | Production build             |
| `npm start`     | Run built app                |
| `npm run lint`  | Lint with ESLint             |

## Project structure

```
src/
├── app/
│   ├── layout.js                    # Root layout, fonts, theme bootstrap
│   ├── page.js                      # Landing page
│   ├── globals.css                  # CSS variables + base styles
│   ├── roadmap/page.jsx             # What's shipped / planned
│   └── data-structures/
│       └── arrays/page.jsx          # 2D Array Visualizer route
├── components/
│   ├── ThemeToggle.jsx              # Light/dark toggle (FAB)
│   ├── layout/
│   │   ├── PageShell.jsx            # Standard page wrapper
│   │   ├── BackLink.jsx             # Reusable back navigation
│   │   └── Footer.jsx               # Shared footer
│   └── array/
│       ├── InputPanel.jsx           # JSON textarea + presets + error
│       ├── ArrayGrid.jsx            # Grid renderer
│       ├── ColorSettings.jsx        # Per-value color pickers
│       └── LearningPanel.jsx        # Tabbed learning content
└── lib/
    ├── cn.js                        # clsx + tailwind-merge helper
    └── array/
        ├── parser.js                # JSON → matrix, validation
        └── presets.js               # Starter matrices
```

## How input parsing works

`lib/array/parser.js` takes a raw string and returns
`{ matrix, maxLen, error }`. It validates that the input is:

1. Valid JSON
2. An array
3. An array of arrays (2D)
4. Cells are `number | string | boolean | null`

Ragged rows are padded to `maxLen` with a `·` token so the grid stays
rectangular. Errors are returned as messages, not thrown. The UI displays them
inline.

## Roadmap

See [`/roadmap`](http://localhost:3000/roadmap) in the running app, or the
[roadmap page](src/app/roadmap/page.jsx) in source.

Next up: Linked lists, then sorting algorithms with animated step-through.

## License

MIT. Feel free to fork, learn from, or extend.

---

Built by [Salman Sadik Siddiquee](https://github.com/salsadsid) ·
[Repository](https://github.com/salsadsid/visualizer)

// Time-complexity data + measurement for the Big-O Playground.
//
// Two layers live here, both plain JS (no React, no DOM):
//   1. COMPLEXITY_CLASSES — the teaching ladder (O(1) … O(2ⁿ)): notation, plain-English
//      intuition, "what the computer does", and a matching series color.
//   2. MEASURABLES — small, counting-only functions that mirror the Phitron Batch-5
//      "Basic Data Structures · Module 1" idioms. Each returns an operation count for an
//      input size n, generated deterministically so counts are reproducible. These are
//      run for real (and optionally timed) by the playground to draw growth curves.
//
// IMPORTANT: these are lightweight loops that only *count* — unlike the snapshotting
// run() in sorting.js, they allocate nothing per step, so they stay cheap at large n.

// ---------------------------------------------------------------------------
// The complexity ladder. `color` points at the CVD-validated --series-* CSS vars
// defined in globals.css (they swap for light/dark), so the same reference is used
// by the chart, the cards, and the scaling table.
// ---------------------------------------------------------------------------

export const COMPLEXITY_CLASSES = [
    {
        id: "constant",
        big: "O(1)",
        name: "Constant",
        color: "var(--series-1)",
        mood: "⚡ Instant — the dream",
        tagline: "Same work no matter how big the input.",
        analogy: "Grabbing a book off a shelf when you already know its slot number.",
        computer:
            "Jumps straight to one memory address and reads it — the size of the data never matters.",
        seenIn: "Array index a[k], hash-map lookup, stack push / pop.",
    },
    {
        id: "log",
        big: "O(log n)",
        name: "Logarithmic",
        color: "var(--series-2)",
        mood: "🚀 Blazing — barely notices growth",
        tagline: "Throws away half the problem every step.",
        analogy: "Finding a word in a dictionary by repeatedly splitting it in half.",
        computer:
            "Each step doubles its reach, so a million items are covered in only ~20 steps.",
        seenIn: "Binary search, balanced-tree lookup, the i *= 2 loop.",
    },
    {
        id: "sqrt",
        big: "O(√n)",
        name: "Square-root",
        color: "var(--series-3)",
        mood: "🏃 Quick — grows, but lazily",
        tagline: "Grows — but far slower than the input does.",
        analogy: "Checking only up to the square root to find a number's factors.",
        computer:
            "Stops at √n because factors pair up: find the small one and the big partner comes free.",
        seenIn: "Trial-division factorisation, primality tests, sqrt decomposition.",
    },
    {
        id: "linear",
        big: "O(n)",
        name: "Linear",
        color: "var(--series-4)",
        mood: "🙂 Fair — an honest day's work",
        tagline: "Touch each item a constant number of times.",
        analogy: "Reading every name on a guest list once.",
        computer:
            "Walks the data from start to end. Double the data and you double the work.",
        seenIn: "Sum / scan, linear search, counting, a single loop.",
    },
    {
        id: "linearithmic",
        big: "O(n log n)",
        name: "Linearithmic",
        color: "var(--series-5)",
        mood: "✨ Great — the sorting sweet spot",
        tagline: "A little work, n times — the sweet spot for sorting.",
        analogy: "Sorting a deck by repeatedly merging already-sorted piles.",
        computer:
            "Does one linear pass at each of the log n levels of splitting.",
        seenIn: "Merge sort, heap sort, quicksort (avg), the digit-print loop.",
    },
    {
        id: "quadratic",
        big: "O(n²)",
        name: "Quadratic",
        color: "var(--series-6)",
        mood: "😬 Risky — fine for small n only",
        tagline: "For every item, revisit every item.",
        analogy: "Everyone in a room shaking hands with everyone else.",
        computer:
            "Two nested loops → n × n steps. 10× the data becomes 100× the work.",
        seenIn: "Bubble / selection / insertion sort, all-pairs, nested loops.",
    },
    {
        id: "exponential",
        big: "O(2ⁿ)",
        name: "Exponential",
        color: "var(--series-7)",
        mood: "💀 Explosive — avoid beyond tiny n",
        tagline: "Every new item doubles the total work.",
        analogy: "Trying every on/off combination of n light switches.",
        computer:
            "Branches into two calls at each level — 60 items outlast the age of the universe.",
        seenIn: "Naïve recursive Fibonacci, subset enumeration, brute force.",
        bonus: true, // beyond Module 1 — included for the dramatic curve
    },
];

export const CLASS_BY_ID = Object.fromEntries(
    COMPLEXITY_CLASSES.map((c) => [c.id, c])
);

// ---------------------------------------------------------------------------
// Measurable functions — mirror the Module 1 .cpp idioms. Each `run(n)` returns
// the number of basic operations performed for input size n.
// ---------------------------------------------------------------------------

function digitCount(x) {
    let c = 0;
    do {
        c++;
        x = Math.floor(x / 10);
    } while (x > 0);
    return c;
}

export const MEASURABLES = [
    {
        key: "constant",
        label: "Index access",
        classId: "constant",
        maxN: 10_000_000,
        // Fixed amount of work regardless of n — the flat baseline.
        run: () => 1,
    },
    {
        key: "doubling",
        label: "Double jumps  ( i *= 2 )",
        classId: "log",
        maxN: 10_000_000,
        // O_logN.cpp — for (i = 1; i <= n; i *= 2)
        run: (n) => {
            let ops = 0;
            for (let i = 1; i <= n; i *= 2) ops++;
            return ops;
        },
    },
    {
        key: "divisors",
        label: "Factor finder  ( i·i ≤ n )",
        classId: "sqrt",
        maxN: 10_000_000,
        // O_sqrtN.cpp — for (i = 1; i*i <= n; i++)
        run: (n) => {
            let ops = 0;
            for (let i = 1; i * i <= n; i++) ops++;
            return ops;
        },
    },
    {
        key: "scan",
        label: "One by one  (scan)",
        classId: "linear",
        maxN: 2_000_000,
        // O_N.cpp — a single pass over n items
        run: (n) => {
            let ops = 0;
            for (let i = 0; i < n; i++) ops++;
            return ops;
        },
    },
    {
        key: "digits",
        label: "Digits of 1…n",
        classId: "linearithmic",
        maxN: 500_000,
        // O_N_logN.cpp — for each i in 1..n, strip its digits (≈ log10 i work)
        run: (n) => {
            let ops = 0;
            for (let i = 1; i <= n; i++) ops += digitCount(i);
            return ops;
        },
    },
    {
        key: "triangular",
        label: "Every pair  ( j = i+1 )",
        classId: "quadratic",
        maxN: 5000,
        // O_N_square.cpp / test.cpp — triangular nested loop = n(n-1)/2
        run: (n) => {
            let ops = 0;
            for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) ops++;
            return ops;
        },
    },
    {
        key: "fib",
        label: "Recursive Fibonacci",
        classId: "exponential",
        maxN: 30,
        bonus: true,
        // Naïve fib(n) — counts every call. Capped low so the tab stays responsive.
        run: (n) => {
            let ops = 0;
            const f = (k) => {
                ops++;
                if (k < 2) return k;
                return f(k - 1) + f(k - 2);
            };
            f(n);
            return ops;
        },
    },
];

export const MEASURABLE_BY_KEY = Object.fromEntries(
    MEASURABLES.map((m) => [m.key, m])
);

// The measurables selected by default when the playground first loads — the same
// three speeds as the "count the steps" demos, so the curves feel familiar.
export const DEFAULT_SELECTION = ["doubling", "scan", "triangular"];

// ---------------------------------------------------------------------------
// Sampling + measurement helpers. All timing/measuring must be called from an
// event handler (never during render / useMemo) — performance.now() is impure.
// ---------------------------------------------------------------------------

// Evenly spaced integer sample sizes in (0, maxN]. Linear spacing keeps the lines
// clean on a linear x-axis (an O(n) line looks straight, an O(n²) line curves).
export function sampleNs(maxN, count = 9) {
    const out = [];
    for (let k = 1; k <= count; k++) {
        const v = Math.max(1, Math.round((maxN * k) / count));
        if (out[out.length - 1] !== v) out.push(v);
    }
    return out;
}

// Average wall-clock ms for one call of fn(n): repeat for a short budget so even
// cheap functions produce a stable, non-zero-ish number. Handler-only (impure).
function timeOne(fn, n) {
    fn(n); // warm up (JIT)
    let reps = 0;
    const start = performance.now();
    do {
        fn(n);
        reps++;
    } while (performance.now() - start < 4 && reps < 200_000);
    return (performance.now() - start) / reps;
}

// Run every selected measurable across the sample sizes, producing chart-ready
// series. `metric` is "ops" or "time". Each point that exceeds a measurable's own
// maxN is skipped (so e.g. fib simply ends its line early).
export function measure(selectedKeys, maxN, metric) {
    const ns = sampleNs(maxN);
    return selectedKeys
        .map((key) => {
            const m = MEASURABLE_BY_KEY[key];
            if (!m) return null;
            const cls = CLASS_BY_ID[m.classId];
            const points = [];
            for (const n of ns) {
                if (n > m.maxN) break;
                const value = metric === "time" ? timeOne(m.run, n) : m.run(n);
                points.push({ n, value });
            }
            return {
                key: m.key,
                label: m.label,
                big: cls.big,
                color: cls.color,
                classId: m.classId,
                points,
            };
        })
        .filter(Boolean);
}

// ---------------------------------------------------------------------------
// "How it scales" — a static, pre-formatted table. Hardcoded (rather than computed)
// so O(2ⁿ) at large n doesn't overflow floating point, and so the human-readable
// times read cleanly. Time column assumes ~1 billion basic ops / second.
// ---------------------------------------------------------------------------

export const SCALE_HEADERS = ["n = 10", "n = 100", "n = 1,000", "n = 1,000,000"];

export const SCALE_TABLE = [
    { id: "constant", ops: ["1", "1", "1", "1"], time1M: "< 1 ns" },
    { id: "log", ops: ["3", "7", "10", "20"], time1M: "~20 ns" },
    { id: "sqrt", ops: ["3", "10", "31", "1,000"], time1M: "~1 µs" },
    { id: "linear", ops: ["10", "100", "1,000", "1 million"], time1M: "~1 ms" },
    { id: "linearithmic", ops: ["33", "664", "9,966", "~20 million"], time1M: "~20 ms" },
    { id: "quadratic", ops: ["100", "10,000", "1 million", "10¹²"], time1M: "~17 min" },
    { id: "exponential", ops: ["1,024", "10³⁰", "10³⁰¹", "10³⁰¹⁰³⁰"], time1M: "beyond ∞ 💀" },
];

// ---------------------------------------------------------------------------
// Code snippets per complexity class, per language — same shape as SORT_CODE.
// The C++ is the user's actual Phitron Module 1 code; JS/Python/TS are faithful
// equivalents. Consumed by CodeTabs.
// ---------------------------------------------------------------------------

export const COMPLEXITY_CODE = {
    constant: {
        cpp: [{ title: "O(1)", code: `int x = a[k];   // one memory read` }],
        python: [{ title: "O(1)", code: `x = a[k]        # one memory read` }],
        javascript: [{ title: "O(1)", code: `const x = a[k]; // one memory read` }],
        typescript: [{ title: "O(1)", code: `const x: number = a[k]; // one memory read` }],
    },
    log: {
        cpp: [
            {
                title: "O(log n) — doubling loop",
                code: `for (int i = 1; i <= n; i = i * 2) {
    cout << i << endl;
}`,
            },
        ],
        python: [
            {
                title: "O(log n) — doubling loop",
                code: `i = 1
while i <= n:
    print(i)
    i *= 2`,
            },
        ],
        javascript: [
            {
                title: "O(log n) — doubling loop",
                code: `for (let i = 1; i <= n; i *= 2) {
  console.log(i);
}`,
            },
        ],
        typescript: [
            {
                title: "O(log n) — doubling loop",
                code: `for (let i = 1; i <= n; i *= 2) {
  console.log(i);
}`,
            },
        ],
    },
    sqrt: {
        cpp: [
            {
                title: "O(√n) — factor finder",
                code: `for (int i = 1; i * i <= n; i++) {
    if (n % i == 0) {
        cout << i << " ";
        if (n / i != i) cout << n / i << endl;
    }
}`,
            },
        ],
        python: [
            {
                title: "O(√n) — factor finder",
                code: `i = 1
while i * i <= n:
    if n % i == 0:
        print(i, end=" ")
        if n // i != i:
            print(n // i)
    i += 1`,
            },
        ],
        javascript: [
            {
                title: "O(√n) — factor finder",
                code: `for (let i = 1; i * i <= n; i++) {
  if (n % i === 0) {
    process.stdout.write(i + " ");
    if (n / i !== i) console.log(n / i);
  }
}`,
            },
        ],
        typescript: [
            {
                title: "O(√n) — factor finder",
                code: `for (let i = 1; i * i <= n; i++) {
  if (n % i === 0) {
    if (n / i !== i) { /* i and n/i are both factors */ }
  }
}`,
            },
        ],
    },
    linear: {
        cpp: [
            {
                title: "O(n) — single pass",
                code: `int s = 0;
for (int i = 0; i < n; i++) {
    s += a[i];
}`,
            },
        ],
        python: [
            {
                title: "O(n) — single pass",
                code: `s = 0
for i in range(n):
    s += a[i]`,
            },
        ],
        javascript: [
            {
                title: "O(n) — single pass",
                code: `let s = 0;
for (let i = 0; i < n; i++) {
  s += a[i];
}`,
            },
        ],
        typescript: [
            {
                title: "O(n) — single pass",
                code: `let s = 0;
for (let i = 0; i < n; i++) {
  s += a[i];
}`,
            },
        ],
    },
    linearithmic: {
        cpp: [
            {
                title: "O(n log n) — digits of each i",
                code: `for (int i = 1; i <= n; i++) {
    int x = i;
    while (x > 0) {       // ~log10(i) work
        cout << x % 10 << " ";
        x /= 10;
    }
}`,
            },
        ],
        python: [
            {
                title: "O(n log n) — digits of each i",
                code: `for i in range(1, n + 1):
    x = i
    while x > 0:          # ~log10(i) work
        print(x % 10, end=" ")
        x //= 10`,
            },
        ],
        javascript: [
            {
                title: "O(n log n) — digits of each i",
                code: `for (let i = 1; i <= n; i++) {
  let x = i;
  while (x > 0) {         // ~log10(i) work
    console.log(x % 10);
    x = Math.floor(x / 10);
  }
}`,
            },
        ],
        typescript: [
            {
                title: "O(n log n) — digits of each i",
                code: `for (let i = 1; i <= n; i++) {
  let x = i;
  while (x > 0) {         // ~log10(i) work
    x = Math.floor(x / 10);
  }
}`,
            },
        ],
    },
    quadratic: {
        cpp: [
            {
                title: "O(n²) — nested pairs",
                code: `for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        // every pair once → n(n-1)/2
    }
}`,
            },
        ],
        python: [
            {
                title: "O(n²) — nested pairs",
                code: `for i in range(n):
    for j in range(i + 1, n):
        pass   # every pair once`,
            },
        ],
        javascript: [
            {
                title: "O(n²) — nested pairs",
                code: `for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    // every pair once → n(n-1)/2
  }
}`,
            },
        ],
        typescript: [
            {
                title: "O(n²) — nested pairs",
                code: `for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    // every pair once → n(n-1)/2
  }
}`,
            },
        ],
    },
    exponential: {
        cpp: [
            {
                title: "O(2ⁿ) — naïve Fibonacci",
                code: `int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}`,
            },
        ],
        python: [
            {
                title: "O(2ⁿ) — naïve Fibonacci",
                code: `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`,
            },
        ],
        javascript: [
            {
                title: "O(2ⁿ) — naïve Fibonacci",
                code: `function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`,
            },
        ],
        typescript: [
            {
                title: "O(2ⁿ) — naïve Fibonacci",
                code: `function fib(n: number): number {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}`,
            },
        ],
    },
};

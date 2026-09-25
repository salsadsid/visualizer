export const SECTIONS = {
    "data-structures": {
        id: "data-structures",
        path: "/data-structures",
        name: "Data Structures",
        updatedAt: "2026-09-19",
    },
    algorithms: {
        id: "algorithms",
        path: "/algorithms",
        name: "Algorithms",
        updatedAt: "2026-09-19",
    },
};

export const TOOLS = {
    arrays: {
        id: "arrays",
        path: "/data-structures/arrays",
        section: "data-structures",
        name: "2D Array Visualizer",
        title: "2D Array Visualizer — Matrix to Grid",
        description:
            "Paste any 2D array or matrix and see it as a grid. Color cells by value, show row and column indices, and learn with C++, Python, JS & TS code. Free.",
        teaches: ["2D arrays", "matrix indexing with rows and columns", "row-major order"],
        updatedAt: "2026-09-19",
        group: "Data Structures",
        pathOrder: 3,
        card: {
            body: "Paste any 2D array or matrix and see it as a grid. Color cells by value, show row and column indices, and learn how rows and columns map to memory.",
            short: "Paste a 2D array or matrix and see it as a grid.",
            tags: ["Matrix", "Grid", "1D arrays too"],
        },
    },
    sorting: {
        id: "sorting",
        path: "/algorithms/sorting",
        section: "algorithms",
        name: "Sorting Visualizer",
        title: "Sorting Algorithm Visualizer",
        description:
            "Compare Bubble, Selection and Insertion sort side by side. Pick one and step through it with animated bars, live variables and synced pseudocode.",
        teaches: ["bubble sort", "selection sort", "insertion sort", "comparing sorting algorithms"],
        updatedAt: "2026-09-20",
        group: "Sorting & techniques",
        pathOrder: 2,
        card: {
            body: "Compare Bubble, Selection & Insertion sort, then watch each one run a step at a time — animated bars, synced pseudocode, and live comparison/swap counters.",
            short: "Step through Bubble, Selection and Insertion sort.",
            tags: ["Bubble", "Selection", "Insertion"],
        },
    },
    complexity: {
        id: "complexity",
        path: "/algorithms/complexity",
        section: "algorithms",
        name: "Big-O Playground",
        title: "Big-O Playground — See Time Complexity",
        description:
            "Learn Big-O by measuring it: count steps with the computer, then watch O(1), O(log n), O(n), O(n log n) and O(n²) growth curves fan out. Beginner friendly.",
        teaches: ["Big-O notation", "time complexity", "how algorithms scale"],
        updatedAt: "2026-09-19",
        group: "Sorting & techniques",
        pathOrder: 1,
        card: {
            badge: "Start here",
            body: "Never heard of Big-O? Start here: a tiny story, count steps with the computer, then watch real growth curves. No math degree required.",
            short: "Count steps and watch real growth curves.",
            tags: ["O(log n)", "O(√n)", "O(n²)"],
        },
    },
};

export const SORT_PAGES = {
    "bubble-sort": {
        id: "bubble-sort",
        key: "bubble",
        path: "/algorithms/sorting/bubble-sort",
        section: "algorithms",
        name: "Bubble Sort",
        title: "Bubble Sort Visualizer — Step by Step",
        h1: "Bubble Sort Visualizer",
        description:
            "Watch bubble sort run one step at a time: animated bars, live i/j pointers, highlighted pseudocode, swap counters, and code in C++, Python, JS & TS.",
        intro: "Watch neighbours swap until the biggest values bubble to the end. Press play, or step through one comparison at a time.",
        teaches: ["bubble sort", "adjacent swaps", "early exit on a pass with no swaps"],
        share: {
            accent: "Watch every swap.",
            subtitle: "Animated bars, live i and j pointers, synced pseudocode and swap counters.",
        },
        next: {
            path: "/algorithms/sorting/selection-sort",
            label: "Open the Selection Sort Visualizer",
            tool: "sorting",
            text: "Bubble sort makes lots of small swaps. Next, watch a sort that looks first and makes at most one swap per pass.",
        },
        updatedAt: "2026-09-20",
    },
    "selection-sort": {
        id: "selection-sort",
        key: "selection",
        path: "/algorithms/sorting/selection-sort",
        section: "algorithms",
        name: "Selection Sort",
        title: "Selection Sort Visualizer — Step by Step",
        h1: "Selection Sort Visualizer",
        description:
            "Watch selection sort find the minimum each pass: animated bars, live i/j/min pointers, highlighted pseudocode, and code in C++, Python, JS & TS.",
        intro: "Watch each pass hunt for the smallest value left and drop it into place. Press play, or step through one comparison at a time.",
        teaches: ["selection sort", "finding the minimum with a running best", "in-place swapping"],
        share: {
            accent: "Find the minimum.",
            subtitle: "Animated bars, live i, j and min pointers, synced pseudocode and counters.",
        },
        next: {
            path: "/algorithms/sorting/insertion-sort",
            label: "Open the Insertion Sort Visualizer",
            tool: "sorting",
            text: "Selection sort does the same work whatever you give it. Next, meet a sort that gets faster the closer your list already is to sorted.",
        },
        updatedAt: "2026-09-20",
    },
    "insertion-sort": {
        id: "insertion-sort",
        key: "insertion",
        path: "/algorithms/sorting/insertion-sort",
        section: "algorithms",
        name: "Insertion Sort",
        title: "Insertion Sort Visualizer — Step by Step",
        h1: "Insertion Sort Visualizer",
        description:
            "Watch insertion sort slide each key into place: animated bars, live pointers, highlighted pseudocode, and code in C++, Python, JS & TS.",
        intro: "Watch each value slide left into a growing sorted part, the way you sort a hand of cards. Press play, or step through it.",
        teaches: ["insertion sort", "shifting values to open a gap", "why nearly sorted input is fast"],
        share: {
            accent: "Slide it into place.",
            subtitle: "Animated bars, the key and its shifts, synced pseudocode and live counters.",
        },
        next: {
            path: "/data-structures/arrays",
            label: "Open the 2D Array Visualizer",
            tool: "arrays",
            text: "Sorting works on a single row of values. Next, see what changes when your data has rows and columns.",
        },
        updatedAt: "2026-09-20",
    },
};

export const SORT_PAGE_LIST = Object.values(SORT_PAGES);

export const sortPageFor = (key) => SORT_PAGE_LIST.find((page) => page.key === key);

const TRAVERSAL_BASE = "/data-structures/arrays/traversal";

const traversalPage = (id, page) => ({
    id,
    key: id,
    path: `${TRAVERSAL_BASE}/${id}`,
    section: "data-structures",
    updatedAt: "2026-09-25",
    ...page,
});

export const TRAVERSAL_PAGES = {
    "row-major": traversalPage("row-major", {
        name: "Row-Major Traversal",
        title: "Row-Major Traversal Visualizer",
        h1: "Row-Major Traversal",
        description:
            "Watch row-major order visit a 2D array row by row, left to right: live i and j, a visit number on every cell, the output sequence and code in 4 languages.",
        intro: "The order you read a page in: across the first row, then the next. Press play and watch i and j move.",
        teaches: ["row-major order", "nested loops over a 2D array", "how 2D arrays sit in memory"],
        share: { accent: "Row by row, left to right.", subtitle: "Live i and j, a visit number on every cell, and the output sequence as it grows." },
        next: {
            path: `${TRAVERSAL_BASE}/column-major`,
            label: "Open Column-Major Traversal",
            tool: "traversals",
            text: "Same two loops, swapped. Next, see what changes when you walk down the columns instead.",
        },
    }),
    "column-major": traversalPage("column-major", {
        name: "Column-Major Traversal",
        title: "Column-Major Traversal Visualizer",
        h1: "Column-Major Traversal",
        description:
            "Watch column-major order walk down each column of a 2D array before moving right: live i and j, visit numbers, the output sequence and code in 4 languages.",
        intro: "The same two loops as row-major, swapped. Walk down a whole column, then move to the next one.",
        teaches: ["column-major order", "swapping nested loops", "Fortran and NumPy order=\"F\" layouts"],
        share: { accent: "Down each column first.", subtitle: "The row-major loops swapped, with live i and j, visit numbers and the output sequence." },
        next: {
            path: `${TRAVERSAL_BASE}/snake`,
            label: "Open Snake Traversal",
            tool: "traversals",
            text: "Both orders jump back to the start of every row or column. Next, a path that never jumps.",
        },
    }),
    snake: traversalPage("snake", {
        name: "Snake Traversal",
        title: "Snake Traversal Visualizer — Zigzag Rows",
        h1: "Snake (Zigzag) Traversal",
        description:
            "Watch snake traversal zigzag through a 2D array, left to right then right to left: every turn marked, visit numbers, the output sequence and code.",
        intro: "Left to right, then right to left, like mowing a lawn. The path turns at the end of each row instead of jumping back.",
        teaches: ["snake or zigzag traversal", "reversing a loop on odd rows", "boustrophedon order"],
        share: { accent: "Mow the lawn.", subtitle: "Left to right, then right to left, with every turn marked and the output sequence as it grows." },
        next: {
            path: `${TRAVERSAL_BASE}/diagonal`,
            label: "Open Diagonal Traversal",
            tool: "traversals",
            text: "Rows and columns are not the only lines through a grid. Next, walk the diagonals.",
        },
    }),
    diagonal: traversalPage("diagonal", {
        name: "Diagonal Traversal",
        title: "Diagonal Matrix Traversal Visualizer",
        h1: "Diagonal Traversal",
        description:
            "Watch diagonal traversal group a 2D array's cells by i + j and visit one anti-diagonal at a time: live bounds, visit numbers, the output sequence and code.",
        intro: "Every cell where i + j is the same sits on one anti-diagonal. Visit the diagonals one by one, corner to corner.",
        teaches: ["diagonal traversal of a matrix", "anti-diagonals where i + j is constant", "loop bounds from max and min"],
        share: { accent: "Corner to corner.", subtitle: "Cells grouped by i + j, one anti-diagonal at a time, with visit numbers and the output sequence." },
        next: {
            path: `${TRAVERSAL_BASE}/boundary`,
            label: "Open Boundary Traversal",
            tool: "traversals",
            text: "So far every order visited every cell. Next, one that only walks the outer ring.",
        },
    }),
    boundary: traversalPage("boundary", {
        name: "Boundary Traversal",
        title: "Matrix Boundary Traversal Visualizer",
        h1: "Boundary Traversal",
        description:
            "Watch boundary traversal walk the outer ring of a 2D array clockwise, top row to left column: each edge marked, visit numbers, output sequence and code.",
        intro: "Top row, right column, bottom row backwards, left column upwards. The cells inside the ring are never touched.",
        teaches: ["boundary traversal of a matrix", "handling corners once", "single-row and single-column edge cases"],
        share: { accent: "Just the outer ring.", subtitle: "Top, right, bottom and left edges in turn, corners counted once, inner cells untouched." },
        next: {
            path: `${TRAVERSAL_BASE}/spiral`,
            label: "Open Spiral Traversal",
            tool: "traversals",
            text: "The boundary is the first ring of a spiral. Next, keep going inwards until nothing is left.",
        },
    }),
    spiral: traversalPage("spiral", {
        name: "Spiral Traversal",
        title: "Spiral Matrix Traversal Visualizer",
        h1: "Spiral Traversal",
        description:
            "Watch spiral matrix traversal peel a 2D array ring by ring, clockwise: live top, bottom, left and right bounds, visit numbers, output sequence and code.",
        intro: "Around the outside and inwards, clockwise, while four bounds close in. The classic interview question, one step at a time.",
        teaches: ["spiral matrix traversal", "shrinking top, bottom, left and right bounds", "why the two extra guards are needed"],
        share: { accent: "Peel it like an onion.", subtitle: "Clockwise ring by ring, with the four bounds live, visit numbers and the output sequence." },
        next: {
            path: "/algorithms/complexity",
            label: "Open the Big-O Playground",
            tool: "complexity",
            text: "Every full traversal took rows × columns steps. Next, see how that kind of growth compares with other algorithms.",
        },
    }),
};

export const TRAVERSAL_PAGE_LIST = Object.values(TRAVERSAL_PAGES);

export const traversalPageFor = (key) => TRAVERSAL_PAGES[key];

export const LEARNING_PATH = Object.values(TOOLS).sort((a, b) => a.pathOrder - b.pathOrder);

export const toolsIn = (section) =>
    LEARNING_PATH.filter((tool) => tool.section === section);

export const ROADMAP_GROUPS = ["Data Structures", "Sorting & techniques", "Algorithms"];

export const PLANNED = [
    { name: "Linked List", section: "data-structures", group: "Data Structures", note: "Singly & doubly linked, animated pointers" },
    { name: "Stack", section: "data-structures", group: "Data Structures", note: "Push / pop with overflow visualization" },
    { name: "Queue", section: "data-structures", group: "Data Structures", note: "FIFO + circular queue" },
    { name: "Binary Tree / BST", section: "data-structures", group: "Data Structures", note: "Insert, traverse, search" },
    { name: "Heap", section: "data-structures", group: "Data Structures", note: "Min & max heap with sift up and sift down" },
    { name: "Graph", section: "data-structures", group: "Data Structures", note: "Adjacency list & matrix views" },
    { name: "Counting sort", section: "algorithms", group: "Sorting & techniques", note: "Non-comparison sort built on a frequency array — O(n + k)" },
    { name: "Frequency array", section: "algorithms", group: "Sorting & techniques", note: "Count occurrences in O(n); the basis for counting sort & hashing" },
    { name: "Merge sort", section: "algorithms", group: "Sorting & techniques", note: "Divide & conquer, stable, O(n log n)" },
    { name: "Quick sort", section: "algorithms", group: "Sorting & techniques", note: "In-place partitioning, average O(n log n)" },
    { name: "Binary search", section: "algorithms", group: "Sorting & techniques", note: "Find a value in a sorted array in O(log n)" },
    { name: "Prefix sums", section: "algorithms", group: "Sorting & techniques", note: "Answer range-sum queries instantly after O(n) prep" },
    { name: "Two pointers", section: "algorithms", group: "Sorting & techniques", note: "Pair & subarray problems in a single O(n) pass" },
    { name: "Sliding window", section: "algorithms", group: "Sorting & techniques", note: "Running window for subarray sum / min / max" },
    { name: "Graph algorithms", section: "algorithms", group: "Algorithms", note: "BFS, DFS, Dijkstra" },
    { name: "Dynamic programming", section: "algorithms", group: "Algorithms", note: "Classic DP tables (LCS, knapsack)" },
];

export const plannedIn = (section) => PLANNED.filter((topic) => topic.section === section);

const STATIC_PAGES = [
    { path: "/", updatedAt: "2026-09-19", changeFrequency: "weekly", priority: 1.0 },
    { path: "/roadmap", updatedAt: "2026-09-19", changeFrequency: "monthly", priority: 0.5 },
];

export function sitemapEntries() {
    const sections = Object.values(SECTIONS).map((page) => ({
        ...page,
        changeFrequency: "weekly",
        priority: 0.8,
    }));
    const tools = Object.values(TOOLS).map((page) => ({
        ...page,
        changeFrequency: "weekly",
        priority: 0.9,
    }));
    const sorts = SORT_PAGE_LIST.map((page) => ({
        ...page,
        changeFrequency: "weekly",
        priority: 0.9,
    }));
    return [...STATIC_PAGES, ...sections, ...tools, ...sorts].map(
        ({ path, updatedAt, changeFrequency, priority }) => ({
            path,
            lastModified: updatedAt,
            changeFrequency,
            priority,
        })
    );
}

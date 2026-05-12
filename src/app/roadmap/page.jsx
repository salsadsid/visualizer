import PageShell from "@/components/layout/PageShell";
import BackLink from "@/components/layout/BackLink";
import Footer from "@/components/layout/Footer";

const ROADMAP = [
    {
        section: "Data Structures",
        items: [
            { name: "2D Arrays", status: "shipped", note: "Custom colors, presets, learning panel" },
            { name: "Linked List", status: "planned", note: "Singly & doubly linked, animated pointers" },
            { name: "Stack", status: "planned", note: "Push / pop with overflow visualization" },
            { name: "Queue", status: "planned", note: "FIFO + circular queue" },
            { name: "Binary Tree / BST", status: "planned", note: "Insert, traverse, search" },
            { name: "Graph", status: "planned", note: "Adjacency list & matrix views" },
        ],
    },
    {
        section: "Algorithms",
        items: [
            { name: "Sorting", status: "planned", note: "Bubble, quick, merge. Step-through with speed control" },
            { name: "Searching", status: "planned", note: "Linear & binary search" },
            { name: "Graph algorithms", status: "planned", note: "BFS, DFS, Dijkstra" },
            { name: "Dynamic programming", status: "planned", note: "Classic DP tables (LCS, knapsack)" },
        ],
    },
];

const STATUS_BADGE = {
    shipped: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    "in-progress": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    planned: "bg-bg-muted text-text-muted border-token",
};

export const metadata = {
    title: "Roadmap",
    description:
        "What's shipped and what's planned for the DSA Visualizer: data structures, algorithms, and learning content.",
    alternates: { canonical: "/roadmap" },
    openGraph: {
        title: "Roadmap · DSA Visualizer",
        description:
            "Shipped and planned visualizers for data structures and algorithms.",
        url: "/roadmap",
        type: "website",
    },
};

export default function RoadmapPage() {
    return (
        <PageShell max="max-w-4xl">
            <nav className="mb-8">
                <BackLink href="/" label="Back to home" />
            </nav>

            <header className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Roadmap
                </h1>
                <p className="mt-3 text-muted max-w-xl mx-auto">
                    Built incrementally. Here&apos;s what&apos;s live and what&apos;s coming next.
                </p>
            </header>

            <div className="space-y-10">
                {ROADMAP.map((group) => (
                    <section key={group.section}>
                        <h2 className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">
                            {group.section}
                        </h2>
                        <ul className="space-y-2">
                            {group.items.map((item) => (
                                <li
                                    key={item.name}
                                    className="surface rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-xs text-muted mt-0.5">{item.note}</p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap ${STATUS_BADGE[item.status]}`}
                                    >
                                        {item.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <p className="mt-10 text-center text-xs text-subtle">
                Have a suggestion?{" "}
                <a
                    href="https://github.com/salsadsid/visualizer/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                    Open an issue
                </a>
                .
            </p>

            <Footer />
        </PageShell>
    );
}

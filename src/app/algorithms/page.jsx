import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import BackLink from "@/components/layout/BackLink";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: "Algorithms",
    description:
        "Interactive, beginner-friendly algorithm visualizers. Step through sorting algorithms with animated bars, pseudocode, and live stats. More techniques on the way.",
    alternates: { canonical: "/algorithms" },
    openGraph: {
        title: "Algorithms · DSA Visualizer",
        description:
            "Step-through algorithm visualizers with animated bars, pseudocode, and live stats.",
        url: "/algorithms",
        type: "website",
    },
};

const BarsIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 20h4V10H3v10zm7 0h4V4h-4v16zm7 0h4v-7h-4v7z"
        />
    </svg>
);

const CurveIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18c4 0 5-11 8-11s3.5 7 8 7" />
    </svg>
);

const SHIPPED = [
    {
        href: "/algorithms/complexity",
        title: "Big-O Playground",
        badge: "Start here",
        body: "Never heard of Big-O? Start here: a tiny story, count steps with the computer, then watch real growth curves. No math degree required.",
        tags: ["O(log n)", "O(√n)", "O(n²)"],
        icon: CurveIcon,
    },
    {
        href: "/algorithms/sorting",
        title: "Sorting",
        badge: "Live",
        body: "Bubble, Selection & Insertion sort — animated bars, synchronized pseudocode, speed control, and live comparison/swap counters.",
        tags: ["Bubble", "Selection", "Insertion"],
        icon: BarsIcon,
    },
];

const COMING = [
    "Counting sort",
    "Frequency array",
    "Merge sort",
    "Quick sort",
    "Binary search",
    "Prefix sums",
    "Two pointers",
    "Sliding window",
];

export default function AlgorithmsHome() {
    return (
        <PageShell max="max-w-4xl">
            <nav className="mb-8">
                <BackLink href="/" label="Back to home" />
            </nav>

            <header className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient animate-gradient inline-block pb-1">
                    Algorithms
                </h1>
                <p className="mt-3 text-muted max-w-xl mx-auto">
                    Press play and watch how it works. Beginner-friendly, step-by-step
                    visualizers — no setup, no sign-up.
                </p>
            </header>

            <section className="grid sm:grid-cols-2 gap-4">
                {SHIPPED.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="group surface rounded-2xl p-6 shadow-sm hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="grid place-items-center h-10 w-10 rounded-xl bg-accent-soft border border-accent/20 text-accent">
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20 whitespace-nowrap">
                                {item.badge}
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold flex items-center gap-1.5">
                            {item.title}
                            <span className="text-accent group-hover:translate-x-1 transition-transform">
                                →
                            </span>
                        </h2>
                        <p className="text-base text-muted mt-1 leading-relaxed">
                            {item.body}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {item.tags.map((t) => (
                                <span
                                    key={t}
                                    className="text-[11px] font-medium px-2 py-0.5 rounded surface-muted text-subtle"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}

                <div className="surface-muted rounded-2xl p-6 border-dashed">
                    <h2 className="text-sm font-semibold text-subtle uppercase tracking-wider mb-3">
                        Coming next
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                        {COMING.map((t) => (
                            <span
                                key={t}
                                className="text-xs font-medium px-2.5 py-1 rounded-full surface text-muted"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <Link
                        href="/roadmap"
                        className="inline-block mt-4 text-sm text-accent hover:text-accent-hover font-medium"
                    >
                        See the full roadmap →
                    </Link>
                </div>
            </section>

            <Footer />
        </PageShell>
    );
}

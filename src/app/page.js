import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Footer from "@/components/layout/Footer";
import HeroDemo from "@/components/algorithms/HeroDemo";
import TrackedLink from "@/components/analytics/TrackedLink";
import JsonLd from "@/components/seo/JsonLd";
import { websiteJsonLd } from "@/lib/jsonld";
import { LEARNING_PATH } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export const metadata = {
    title: { absolute: siteConfig.title },
    description: siteConfig.description,
    alternates: { canonical: "/" },
};

const BarsIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10m6 10V4m6 16v-7" />
    </svg>
);

const GridIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const CurveIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18c4 0 5-11 8-11s3.5 7 8 7" />
    </svg>
);

const PathIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M20 6v6H4M4 12v6h16" />
    </svg>
);

const MazeIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4zM4 10h6v4M14 4v6h6M10 20v-4h4v-2" />
    </svg>
);

const RowIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18v6H3zM8 9v6M13 9v6M18 9v6" />
    </svg>
);

const TurnIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h9v9H4zM17 8a3 3 0 013 3v3a3 3 0 01-3 3h-4M15 14l-2 3 3 2" />
    </svg>
);

const ICONS = {
    complexity: CurveIcon,
    arrays1d: RowIcon,
    sorting: BarsIcon,
    arrays: GridIcon,
    traversals: PathIcon,
    matrix: TurnIcon,
    grid: MazeIcon,
};

const POPULAR = [
    { tool: "arrays", href: "/data-structures/arrays", label: "2D Array Visualizer" },
    { tool: "arrays1d", href: "/data-structures/arrays/1d", label: "Array Visualizer" },
    { tool: "sorting", href: "/algorithms/sorting/bubble-sort", label: "Bubble Sort" },
    { tool: "complexity", href: "/algorithms/complexity", label: "Big-O Playground" },
];

const FEATURES = [
    {
        title: "Step-by-step",
        body: "Play, pause, and scrub through every comparison and swap at your own pace.",
    },
    {
        title: "Learn as you explore",
        body: "Pseudocode, complexity, and C++/Python/JS/TS code sit right beside each visual.",
    },
    {
        title: "Free & open source",
        body: "No setup, no sign-up. MIT-licensed and runs entirely in your browser.",
    },
];

export default function HomePage() {
    return (
        <PageShell max="max-w-5xl">
            <JsonLd data={websiteJsonLd()} />
            <section className="relative overflow-hidden pt-12 pb-14 text-center">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute -top-12 -left-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl animate-blob" />
                    <div className="absolute top-8 -right-8 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl animate-blob [animation-delay:4s]" />
                    <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl animate-float-slow" />
                </div>

                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-muted text-xs font-medium text-muted mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open source · MIT
                </span>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                    Data structures &amp; algorithms,
                    <br />
                    <span className="text-gradient animate-gradient inline-block pb-1">
                        brought to life.
                    </span>
                </h1>

                <p className="mt-5 text-lg text-muted max-w-xl mx-auto">
                    Turn any 2D array into a colorful grid, watch sorting run step by
                    step, and count the steps algorithms take. No setup, no sign-up.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
                    <span className="text-subtle">Popular:</span>
                    {POPULAR.map((item) => (
                        <TrackedLink
                            key={item.href}
                            href={item.href}
                            event="tool_open"
                            params={{ tool: item.tool, from: "home_popular" }}
                            className="px-3 py-2 rounded-full bg-accent-soft border border-accent/20 font-medium text-accent hover:bg-accent/15 transition-colors focus-ring"
                        >
                            {item.label}
                        </TrackedLink>
                    ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <TrackedLink
                        href="/algorithms/sorting"
                        event="tool_open"
                        params={{ tool: "sorting", from: "home_hero" }}
                        className="group px-6 py-3 rounded-xl bg-accent text-white font-medium shadow-sm hover:bg-accent-hover hover:scale-[1.03] active:scale-95 transition-all inline-flex items-center gap-2"
                    >
                        Open Sorting Visualizer
                        <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </TrackedLink>
                    <TrackedLink
                        href="/algorithms/complexity"
                        event="tool_open"
                        params={{ tool: "complexity", from: "home_hero" }}
                        className="px-6 py-3 rounded-xl surface font-medium text-muted hover:text-text hover:scale-[1.03] active:scale-95 transition-all"
                    >
                        New to Big-O? Start here →
                    </TrackedLink>
                </div>

                <div className="mt-12 max-w-md mx-auto animate-fade-in-up">
                    <div className="surface rounded-2xl p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                        <div className="relative">
                            <HeroDemo />
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-14">
                <div className="flex items-end justify-between mb-4">
                    <h2 className="text-xs font-semibold text-subtle uppercase tracking-wider">
                        Visualizers · a good order to explore them
                    </h2>
                    <Link
                        href="/roadmap"
                        className="text-sm text-accent hover:text-accent-hover font-medium"
                    >
                        Roadmap →
                    </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {LEARNING_PATH.map((v) => (
                        <TrackedLink
                            key={v.id}
                            href={v.path}
                            event="tool_open"
                            params={{ tool: v.id, from: "home_cards" }}
                            className="group surface rounded-2xl p-6 shadow-sm hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="relative grid place-items-center h-11 w-11 rounded-xl bg-accent-soft border border-accent/20 text-accent">
                                    {ICONS[v.id]}
                                    <span className="absolute -top-2 -left-2 grid place-items-center h-5 w-5 rounded-full bg-accent text-white text-[11px] font-bold shadow-sm">
                                        {v.pathOrder}
                                    </span>
                                </span>
                                {v.card.badge && (
                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
                                        {v.card.badge}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold flex items-center gap-1.5">
                                {v.name}
                                <span className="text-accent group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </h3>
                            <p className="text-base text-muted mt-1 leading-relaxed">
                                {v.card.body}
                            </p>
                        </TrackedLink>
                    ))}
                </div>
            </section>

            <section className="grid sm:grid-cols-3 gap-4 pb-16">
                {FEATURES.map((f) => (
                    <div key={f.title} className="surface rounded-2xl p-5">
                        <h3 className="font-semibold mb-1.5">{f.title}</h3>
                        <p className="text-base text-muted leading-relaxed">{f.body}</p>
                    </div>
                ))}
            </section>

            <Footer />
        </PageShell>
    );
}

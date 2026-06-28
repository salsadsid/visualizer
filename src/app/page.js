import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Footer from "@/components/layout/Footer";
import HeroDemo from "@/components/algorithms/HeroDemo";
import { siteConfig } from "@/lib/site";

export const metadata = {
    title: { absolute: siteConfig.title },
    description: siteConfig.description,
    alternates: { canonical: "/" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
        "@type": "Person",
        name: siteConfig.author.name,
        url: siteConfig.author.url,
    },
    inLanguage: "en",
    keywords: siteConfig.keywords.join(", "),
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

const VISUALIZERS = [
    {
        href: "/algorithms/sorting",
        title: "Sorting Visualizer",
        badge: "New",
        body: "Watch Bubble, Selection & Insertion sort run one step at a time — animated bars, synced pseudocode, and live comparison/swap counters.",
        icon: BarsIcon,
    },
    {
        href: "/data-structures/arrays",
        title: "2D Array Visualizer",
        body: "Paste any JSON matrix, color cells by value, toggle indices, and see how grids map to rows and columns.",
        icon: GridIcon,
    },
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
                    A clean, interactive playground for learning. Paste a matrix and color
                    it, or watch a sorting algorithm run one step at a time.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/algorithms/sorting"
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
                    </Link>
                    <Link
                        href="/data-structures/arrays"
                        className="px-6 py-3 rounded-xl surface font-medium text-muted hover:text-text hover:scale-[1.03] active:scale-95 transition-all"
                    >
                        2D Array Visualizer
                    </Link>
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
                        Visualizers
                    </h2>
                    <Link
                        href="/roadmap"
                        className="text-sm text-accent hover:text-accent-hover font-medium"
                    >
                        Roadmap →
                    </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    {VISUALIZERS.map((v) => (
                        <Link
                            key={v.href}
                            href={v.href}
                            className="group surface rounded-2xl p-6 shadow-sm hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="grid place-items-center h-11 w-11 rounded-xl bg-accent-soft border border-accent/20 text-accent">
                                    {v.icon}
                                </span>
                                {v.badge && (
                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
                                        {v.badge}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold flex items-center gap-1.5">
                                {v.title}
                                <span className="text-accent group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </h3>
                            <p className="text-sm text-muted mt-1 leading-relaxed">
                                {v.body}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="grid sm:grid-cols-3 gap-4 pb-16">
                {FEATURES.map((f) => (
                    <div key={f.title} className="surface rounded-2xl p-5">
                        <h3 className="font-semibold mb-1.5">{f.title}</h3>
                        <p className="text-sm text-muted leading-relaxed">{f.body}</p>
                    </div>
                ))}
            </section>

            <Footer />
        </PageShell>
    );
}

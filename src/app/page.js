import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Footer from "@/components/layout/Footer";
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

const FEATURES = [
    {
        title: "JSON in, grid out",
        body: "Paste any 2D array. Numbers, strings, booleans, even ragged rows.",
    },
    {
        title: "Color every value",
        body: "Pick a color per unique cell value to map data to meaning.",
    },
    {
        title: "Learn as you build",
        body: "Concise notes on complexity, traversal, and common pitfalls. Built in.",
    },
];

export default function HomePage() {
    return (
        <PageShell max="max-w-5xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <section className="pt-12 pb-16 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-muted text-xs font-medium text-muted mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Open source · MIT
                </span>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                    See your data structures.
                    <br />
                    <span className="text-accent">Color by color.</span>
                </h1>

                <p className="mt-5 text-lg text-muted max-w-xl mx-auto">
                    A clean, interactive playground for visualizing 2D arrays. More data
                    structures and algorithms coming soon.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/data-structures/arrays"
                        className="group px-6 py-3 rounded-xl bg-accent text-white font-medium shadow-sm hover:bg-accent-hover transition-colors inline-flex items-center gap-2"
                    >
                        Open 2D Array Visualizer
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
                        href="/roadmap"
                        className="px-6 py-3 rounded-xl surface font-medium text-muted hover:text-text transition-colors"
                    >
                        See roadmap
                    </Link>
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

            <section className="surface rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <div className="text-xs text-subtle uppercase tracking-wider mb-1">
                            Try it now
                        </div>
                        <h2 className="text-xl font-semibold">Identity matrix preset</h2>
                        <p className="text-sm text-muted mt-1">
                            One click. Paste any JSON of your own to see it as a grid.
                        </p>
                    </div>
                    <Link
                        href="/data-structures/arrays"
                        className="text-sm text-accent hover:text-accent-hover font-medium"
                    >
                        Launch →
                    </Link>
                </div>
                <pre className="mt-4 surface-muted rounded-xl p-4 font-mono text-xs overflow-x-auto custom-scrollbar text-muted">
{`[
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
]`}
                </pre>
            </section>

            <Footer />
        </PageShell>
    );
}

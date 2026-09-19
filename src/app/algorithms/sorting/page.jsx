import PageShell from "@/components/layout/PageShell";
import BackLink from "@/components/layout/BackLink";
import Footer from "@/components/layout/Footer";
import SortingVisualizer from "@/components/algorithms/SortingVisualizer";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { TOOLS } from "@/lib/catalog";

export default function SortingPage() {
    return (
        <PageShell>
            <JsonLd data={learningResourceJsonLd(TOOLS.sorting)} />
            <nav className="mb-6">
                <BackLink href="/algorithms" label="All algorithms" />
            </nav>

            <header className="mb-7 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        SORT
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        Sorting Visualizer
                    </h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">
                    Watch a sort run one step at a time. Press play and follow the bars, the
                    highlighted pseudocode, and the running tally of work done.
                </p>
            </header>

            <SortingVisualizer />

            <Footer />
        </PageShell>
    );
}

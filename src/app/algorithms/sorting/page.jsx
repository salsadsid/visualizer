import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import SortingVisualizer from "@/components/algorithms/SortingVisualizer";
import SortingExplainer from "@/components/algorithms/SortingExplainer";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { SECTIONS, TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata({
    ...TOOLS.sorting,
    image: `${TOOLS.sorting.path}/opengraph-image`,
});

export default function SortingPage() {
    return (
        <PageShell>
            <JsonLd data={learningResourceJsonLd(TOOLS.sorting)} />
            <Breadcrumbs items={[SECTIONS[TOOLS.sorting.section], { name: TOOLS.sorting.name }]} />

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

            <SortingVisualizer algo="bubble" />

            <SortingExplainer />

            <NextStep
                href="/data-structures/arrays"
                label="Open the 2D Array Visualizer"
                tool="arrays"
                from="sorting_next"
            >
                Sorting works on a single row of values. Next, see what changes when your
                data has rows <em>and</em> columns.
            </NextStep>

            <Footer />
        </PageShell>
    );
}

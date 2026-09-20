import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import SortingOverview from "@/components/algorithms/SortingOverview";
import SortingComparison from "@/components/algorithms/SortingComparison";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { SECTIONS, SORT_PAGE_LIST, TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata({
    ...TOOLS.sorting,
    image: `${TOOLS.sorting.path}/opengraph-image`,
});

export default function SortingPage() {
    return (
        <PageShell max="max-w-5xl">
            <JsonLd data={learningResourceJsonLd(TOOLS.sorting, SORT_PAGE_LIST)} />
            <Breadcrumbs items={[SECTIONS[TOOLS.sorting.section], { name: TOOLS.sorting.name }]} />

            <header className="mb-7 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        SORT
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        Sorting Algorithm Visualizer
                    </h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">
                    Three classic sorts, each with its own step-by-step visualizer: animated
                    bars, highlighted pseudocode and a running tally of the work done.
                </p>
            </header>

            <SortingOverview />

            <SortingComparison />

            <NextStep
                href={SORT_PAGE_LIST[0].path}
                label="Open the Bubble Sort Visualizer"
                tool="sorting"
                from="sorting_next"
            >
                Not sure where to begin? Bubble sort is the easiest one to picture, so
                start there and work your way across.
            </NextStep>

            <Footer />
        </PageShell>
    );
}

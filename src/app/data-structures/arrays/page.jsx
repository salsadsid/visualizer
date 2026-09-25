import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import ArrayVisualizer from "@/components/array/ArrayVisualizer";
import LearningPanel from "@/components/array/LearningPanel";
import ArraysExplainer from "@/components/array/ArraysExplainer";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { SECTIONS, TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata({
    ...TOOLS.arrays,
    image: `${TOOLS.arrays.path}/opengraph-image`,
});

export default function ArraysPage() {
    return (
        <PageShell>
            <JsonLd data={learningResourceJsonLd(TOOLS.arrays)} />
            <Breadcrumbs items={[SECTIONS[TOOLS.arrays.section], { name: TOOLS.arrays.name }]} />

            <header className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        GRID
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        2D Array Visualizer
                    </h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">
                    Type or paste a 2D array or matrix — like{" "}
                    <code className="font-mono text-accent">[[1, 0], [0, 1]]</code> — or
                    start from a preset. Then color the cells.
                </p>
            </header>

            <ArrayVisualizer />

            <div className="mt-5">
                <LearningPanel />
            </div>

            <ArraysExplainer />

            <NextStep
                href={TOOLS.traversals.path}
                label="Open the traversal visualizers"
                tool="traversals"
                from="arrays_next"
            >
                You can see the grid. Next, watch a loop walk through it: six traversal
                orders, from row by row to spiral, one step at a time.
            </NextStep>

            <Footer />
        </PageShell>
    );
}

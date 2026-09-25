import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import SortingInputProvider from "@/components/algorithms/SortingInputProvider";
import OneDVisualizer from "@/components/array/OneDVisualizer";
import ArrayOperationsExplainer from "@/components/array/ArrayOperationsExplainer";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { SECTIONS, TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata({
    ...TOOLS.arrays1d,
    image: `${TOOLS.arrays1d.path}/opengraph-image`,
});

export default function OneDArrayPage() {
    return (
        <PageShell>
            <JsonLd data={learningResourceJsonLd(TOOLS.arrays1d)} />
            <Breadcrumbs
                items={[
                    SECTIONS["data-structures"],
                    { name: "Arrays", path: TOOLS.arrays.path },
                    { name: TOOLS.arrays1d.name },
                ]}
            />

            <header className="mb-7 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        ARRAY
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        1D Array Visualizer
                    </h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">
                    Watch what really happens inside an array: read a slot in one step, shift
                    values to insert or delete, search box by box, and reverse with two pointers.
                </p>
            </header>

            <SortingInputProvider tool="arrays1d">
                <OneDVisualizer path={TOOLS.arrays1d.path} />
            </SortingInputProvider>

            <ArrayOperationsExplainer />

            <NextStep
                href={TOOLS.sorting.path}
                label="Open the Sorting Visualizer"
                tool="sorting"
                from="arrays1d_next"
            >
                Every sort is built from these reads, writes and compares. Next, watch three
                sorts do them dozens of times on the same array.
            </NextStep>

            <Footer />
        </PageShell>
    );
}

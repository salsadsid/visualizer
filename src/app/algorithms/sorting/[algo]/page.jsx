import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import SortingVisualizer from "@/components/algorithms/SortingVisualizer";
import BubbleSortExplainer from "@/components/algorithms/explainers/BubbleSortExplainer";
import SelectionSortExplainer from "@/components/algorithms/explainers/SelectionSortExplainer";
import InsertionSortExplainer from "@/components/algorithms/explainers/InsertionSortExplainer";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { SECTIONS, SORT_PAGES, TOOLS } from "@/lib/catalog";

const EXPLAINERS = {
    bubble: BubbleSortExplainer,
    selection: SelectionSortExplainer,
    insertion: InsertionSortExplainer,
};

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(SORT_PAGES).map((algo) => ({ algo }));
}

export async function generateMetadata({ params }) {
    const { algo } = await params;
    const page = SORT_PAGES[algo];
    if (!page) return {};
    return buildMetadata({ ...page, image: `${page.path}/opengraph-image` });
}

export default async function SortPage({ params }) {
    const { algo } = await params;
    const page = SORT_PAGES[algo];
    if (!page) notFound();
    const Explainer = EXPLAINERS[page.key];

    return (
        <PageShell>
            <JsonLd data={learningResourceJsonLd(page)} />
            <Breadcrumbs
                items={[
                    SECTIONS.algorithms,
                    { name: "Sorting", path: TOOLS.sorting.path },
                    { name: page.name },
                ]}
            />

            <header className="mb-7 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        SORT
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{page.h1}</h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">{page.intro}</p>
            </header>

            <SortingVisualizer algo={page.key} />

            <Explainer />

            <Footer />
        </PageShell>
    );
}

import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import TraversalVisualizer from "@/components/array/TraversalVisualizer";
import RowMajorExplainer from "@/components/array/traversals/RowMajorExplainer";
import ColumnMajorExplainer from "@/components/array/traversals/ColumnMajorExplainer";
import SnakeExplainer from "@/components/array/traversals/SnakeExplainer";
import DiagonalExplainer from "@/components/array/traversals/DiagonalExplainer";
import BoundaryExplainer from "@/components/array/traversals/BoundaryExplainer";
import SpiralExplainer from "@/components/array/traversals/SpiralExplainer";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { SECTIONS, TOOLS, TRAVERSAL_PAGES } from "@/lib/catalog";

const EXPLAINERS = {
    "row-major": RowMajorExplainer,
    "column-major": ColumnMajorExplainer,
    snake: SnakeExplainer,
    diagonal: DiagonalExplainer,
    boundary: BoundaryExplainer,
    spiral: SpiralExplainer,
};

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(TRAVERSAL_PAGES).map((kind) => ({ kind }));
}

export async function generateMetadata({ params }) {
    const { kind } = await params;
    const page = TRAVERSAL_PAGES[kind];
    if (!page) return {};
    return buildMetadata({ ...page, image: `${page.path}/opengraph-image` });
}

export default async function TraversalPage({ params }) {
    const { kind } = await params;
    const page = TRAVERSAL_PAGES[kind];
    if (!page) notFound();
    const Explainer = EXPLAINERS[page.key];

    return (
        <PageShell>
            <JsonLd data={learningResourceJsonLd(page)} />
            <Breadcrumbs
                items={[
                    SECTIONS["data-structures"],
                    { name: TOOLS.arrays.name, path: TOOLS.arrays.path },
                    { name: "Traversals", path: TOOLS.traversals.path },
                    { name: page.name },
                ]}
            />

            <header className="mb-7 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        GRID
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{page.h1}</h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">{page.intro}</p>
            </header>

            <TraversalVisualizer kind={page.key} />

            <Explainer />

            <NextStep
                href={page.next.path}
                label={page.next.label}
                tool={page.next.tool}
                from={`${page.id}_next`}
            >
                {page.next.text}
            </NextStep>

            <Footer />
        </PageShell>
    );
}

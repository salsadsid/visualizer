import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import GridAlgorithmVisualizer from "@/components/array/GridAlgorithmVisualizer";
import FloodFillExplainer from "@/components/array/grid/FloodFillExplainer";
import IslandsExplainer from "@/components/array/grid/IslandsExplainer";
import ShortestPathExplainer from "@/components/array/grid/ShortestPathExplainer";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { GRID_PAGES, SECTIONS, TOOLS } from "@/lib/catalog";

const EXPLAINERS = {
    "flood-fill": FloodFillExplainer,
    "number-of-islands": IslandsExplainer,
    "shortest-path": ShortestPathExplainer,
};

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(GRID_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = GRID_PAGES[slug];
    if (!page) return {};
    return buildMetadata({ ...page, image: `${page.path}/opengraph-image` });
}

export default async function GridAlgorithmPage({ params }) {
    const { slug } = await params;
    const page = GRID_PAGES[slug];
    if (!page) notFound();
    const Explainer = EXPLAINERS[page.key];

    return (
        <PageShell>
            <JsonLd data={learningResourceJsonLd(page)} />
            <Breadcrumbs
                items={[
                    SECTIONS.algorithms,
                    { name: TOOLS.grid.name, path: TOOLS.grid.path },
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

            <GridAlgorithmVisualizer kind={page.key} basePath={TOOLS.grid.path} />

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

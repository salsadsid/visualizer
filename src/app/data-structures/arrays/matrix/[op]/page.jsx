import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import MatrixOpVisualizer from "@/components/array/MatrixOpVisualizer";
import TransposeExplainer from "@/components/array/matrix/TransposeExplainer";
import RotateExplainer from "@/components/array/matrix/RotateExplainer";
import FlipExplainer from "@/components/array/matrix/FlipExplainer";
import MultiplyExplainer from "@/components/array/matrix/MultiplyExplainer";
import JsonLd from "@/components/seo/JsonLd";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { MATRIX_PAGES, SECTIONS, TOOLS } from "@/lib/catalog";

const EXPLAINERS = {
    transpose: TransposeExplainer,
    rotate: RotateExplainer,
    flip: FlipExplainer,
    multiply: MultiplyExplainer,
};

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(MATRIX_PAGES).map((op) => ({ op }));
}

export async function generateMetadata({ params }) {
    const { op } = await params;
    const page = MATRIX_PAGES[op];
    if (!page) return {};
    return buildMetadata({ ...page, image: `${page.path}/opengraph-image` });
}

export default async function MatrixOperationPage({ params }) {
    const { op } = await params;
    const page = MATRIX_PAGES[op];
    if (!page) notFound();
    const Explainer = EXPLAINERS[page.key];

    return (
        <PageShell>
            <JsonLd data={learningResourceJsonLd(page)} />
            <Breadcrumbs
                items={[
                    SECTIONS["data-structures"],
                    { name: TOOLS.arrays.name, path: TOOLS.arrays.path },
                    { name: "Matrix Operations", path: TOOLS.matrix.path },
                    { name: page.name },
                ]}
            />

            <header className="mb-7 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        MATRIX
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{page.h1}</h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">{page.intro}</p>
            </header>

            <MatrixOpVisualizer kind={page.key} basePath={TOOLS.matrix.path} />

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

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import TrackedLink from "@/components/analytics/TrackedLink";
import JsonLd from "@/components/seo/JsonLd";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { OrderPreview } from "@/components/array/traversals/parts";
import { TRAVERSALS, TRAVERSAL_LIST } from "@/lib/array/traversals";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { SECTIONS, TOOLS, TRAVERSAL_PAGES, TRAVERSAL_PAGE_LIST } from "@/lib/catalog";

export const metadata = buildMetadata({
    ...TOOLS.traversals,
    image: `${TOOLS.traversals.path}/opengraph-image`,
});

const ROWS = [
    { key: "row-major", path: "Across each row, then down", visits: "Every cell", use: "Printing, summing, images" },
    { key: "column-major", path: "Down each column, then right", visits: "Every cell", use: "Column totals, transposes, Fortran and NumPy order=\"F\"" },
    { key: "snake", path: "Rows alternate direction", visits: "Every cell", use: "Printers, plotters, board games" },
    { key: "diagonal", path: "Anti-diagonals, corner to corner", visits: "Every cell", use: "JPEG zigzag, DP tables" },
    { key: "boundary", path: "The outer ring, clockwise", visits: "2r + 2c − 4", use: "Borders, first ring of a spiral" },
    { key: "spiral", path: "Ring by ring, inwards", visits: "Every cell", use: "Interview classic, spiral fills" },
];

const FAQS = [
    {
        question: "What does it mean to traverse a matrix?",
        answer: "To visit its cells one after another in some fixed order, doing something with each one: printing it, adding it up, searching it or copying it. The grid itself does not change. Different traversals are different orders through the same cells.",
    },
    {
        question: "Which matrix traversal is the fastest?",
        answer: "For the same number of cells every full traversal takes the same number of steps, rows × columns. In practice row-major is usually fastest on real hardware because most languages store a 2D array row by row, so it reads memory in a straight line. Boundary traversal is faster only because it visits fewer cells.",
    },
    {
        question: "Do all traversals visit every cell?",
        answer: "All of them here except boundary traversal, which walks only the outer ring and skips the inside. Its visit count is 2 × rows + 2 × columns − 4 on any grid with at least two rows and two columns.",
    },
    {
        question: "Can I traverse my own grid?",
        answer: "Yes. Paste or build a grid in the 2D Array Visualizer, then use the Traverse this grid links under it. Every traversal page also has row and column sliders, and the Copy link button gives you a URL that reopens the same grid at the same step.",
    },
];

export default function TraversalOverviewPage() {
    return (
        <PageShell max="max-w-5xl">
            <JsonLd data={learningResourceJsonLd(TOOLS.traversals, TRAVERSAL_PAGE_LIST)} />
            <Breadcrumbs
                items={[
                    SECTIONS["data-structures"],
                    { name: TOOLS.arrays.name, path: TOOLS.arrays.path },
                    { name: "Traversals" },
                ]}
            />

            <header className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        GRID
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        2D Array Traversals
                    </h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">
                    Six ways to visit the cells of a grid, each with its own step-by-step
                    visualizer. Pick one below, or bring your own grid from the{" "}
                    <Link
                        href={TOOLS.arrays.path}
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        2D Array Visualizer
                    </Link>
                    .
                </p>
            </header>

            <section aria-labelledby="pick-a-traversal">
                <h2
                    id="pick-a-traversal"
                    className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4"
                >
                    Pick a traversal to step through
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TRAVERSAL_LIST.map((t, index) => {
                        const page = TRAVERSAL_PAGES[t.key];
                        return (
                            <TrackedLink
                                key={t.key}
                                href={page.path}
                                event="tool_open"
                                params={{ tool: "traversals", algo: t.key, from: "traversal_overview" }}
                                className="group surface rounded-2xl p-5 shadow-sm min-w-0 hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all focus-ring"
                            >
                                <div className="surface-muted rounded-xl p-3 grid place-items-center">
                                    <OrderPreview kind={t.key} rows={4} cols={4} compact />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold flex items-center gap-1.5">
                                    <span className="grid place-items-center h-5 w-5 rounded-full bg-accent text-white text-[11px] font-bold">
                                        {index + 1}
                                    </span>
                                    {page.name}
                                    <span className="text-accent group-hover:translate-x-1 transition-transform">
                                        →
                                    </span>
                                </h3>
                                <p className="text-base text-muted mt-1 leading-relaxed">{t.blurb}</p>
                            </TrackedLink>
                        );
                    })}
                </div>
            </section>

            <Explainer>
                <ExplainerSection title="The six orders side by side">
                    <p>
                        A traversal is a rule for the order in which you visit cells. Every
                        full traversal on this page costs one step per cell,{" "}
                        <InlineCode>rows × cols</InlineCode>; what differs is the path, and
                        therefore which problems each order makes easy.
                    </p>
                    <div className="surface-muted rounded-lg overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <caption className="sr-only">How the six traversal orders compare</caption>
                            <thead>
                                <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Order</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Path</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium whitespace-nowrap">Visits</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Typical use</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((row, index) => (
                                    <tr key={row.key} className={index !== ROWS.length - 1 ? "border-b border-token" : undefined}>
                                        <th scope="row" className="text-left px-3 py-2 font-medium whitespace-nowrap">
                                            <Link href={TRAVERSAL_PAGES[row.key].path} className="text-accent hover:text-accent-hover">
                                                {TRAVERSALS[row.key].label}
                                            </Link>
                                        </th>
                                        <td className="px-3 py-2">{row.path}</td>
                                        <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{row.visits}</td>
                                        <td className="px-3 py-2">{row.use}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ExplainerSection>

                <ExplainerSection title="Which order should you learn first?">
                    <p>
                        Start with <strong className="text-text">row-major</strong>: it is the
                        plain pair of nested loops, and the order most languages store a grid in.
                        Then <strong className="text-text">column-major</strong>, to see how much
                        changes when you only swap the loops. <strong className="text-text">Snake</strong>{" "}
                        teaches reversing a loop; <strong className="text-text">diagonal</strong>{" "}
                        teaches loop bounds from <InlineCode>max</InlineCode> and{" "}
                        <InlineCode>min</InlineCode>. Finish with{" "}
                        <strong className="text-text">boundary</strong> and then{" "}
                        <strong className="text-text">spiral</strong>, the interview favourite that
                        is really a boundary walk repeated inwards.
                    </p>
                    <p>
                        Each page keeps your grid when you switch, so try one grid in all six
                        orders and compare the visit numbers. When the orders feel familiar,
                        the same grid is waiting on the{" "}
                        <Link
                            href={TOOLS.grid.path}
                            className="text-accent hover:text-accent-hover font-medium"
                        >
                            grid algorithm pages
                        </Link>
                        : flood fill, number of islands and BFS shortest path.
                    </p>
                </ExplainerSection>

                <Faq title="Matrix traversal questions" items={FAQS} />
            </Explainer>

            <NextStep
                href={TRAVERSAL_PAGES["row-major"].path}
                label="Start with row-major traversal"
                tool="traversals"
                from="traversal_overview_next"
            >
                Not sure where to begin? Row-major is the order you already use to read a
                page, so start there and work through the six.
            </NextStep>

            <Footer />
        </PageShell>
    );
}

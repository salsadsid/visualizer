import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import TrackedLink from "@/components/analytics/TrackedLink";
import JsonLd from "@/components/seo/JsonLd";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { MULTIPLY_A, MULTIPLY_B, MatrixExample } from "@/components/array/matrix/parts";
import { MATRIX_OPS, MATRIX_OP_LIST } from "@/lib/array/matrixOps";
import { numberedGrid } from "@/lib/array/traversals";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { MATRIX_PAGES, MATRIX_PAGE_LIST, SECTIONS, TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata({
    ...TOOLS.matrix,
    image: `${TOOLS.matrix.path}/opengraph-image`,
});

const CARD_A = numberedGrid(2, 3);

const PREVIEW = {
    transpose: { a: CARD_A },
    rotate: { a: CARD_A, variant: "cw" },
    flip: { a: CARD_A, variant: "horizontal" },
    multiply: { a: MULTIPLY_A, b: MULTIPLY_B },
};

const ROWS = [
    { key: "transpose", rule: "B[j][i] = A[i][j]", shape: "cols × rows", cost: "rows × cols" },
    { key: "rotate", rule: "B[j][rows−1−i] = A[i][j]", shape: "cols × rows", cost: "rows × cols" },
    { key: "flip", rule: "B[i][cols−1−j] = A[i][j]", shape: "rows × cols", cost: "rows × cols" },
    { key: "multiply", rule: "C[i][j] = Σ A[i][k] · B[k][j]", shape: "n × p", cost: "n × m × p" },
];

const FAQS = [
    {
        question: "What are the basic matrix operations?",
        answer: "The ones that move cells around, transpose, rotate and flip, and the ones that compute new values, addition and multiplication. Transpose, rotate and flip are index tricks: each cell of the source lands at a new position, so they cost one step per cell. Multiplication combines a row of one matrix with a column of the other and costs far more.",
    },
    {
        question: "How are transpose, rotate and flip related?",
        answer: "A rotation by 90° clockwise is a transpose followed by a horizontal flip. A rotation by 180° is a horizontal flip followed by a vertical flip. Transposing twice, flipping twice the same way, or rotating four times all give the original matrix back.",
    },
    {
        question: "Can I use my own matrix?",
        answer: "Yes. Paste or build a grid in the 2D Array Visualizer and use the Transform this grid links under it, or use the size sliders and the Random button on any operation page. The Copy link button gives you a URL that reopens the same matrices at the same step.",
    },
    {
        question: "Which operation should I learn first?",
        answer: "Transpose. It is the simplest index rule and the building block of the others. Rotate and flip are the same loop with a different target index, and once those feel familiar the three nested loops of multiplication are the natural next step.",
    },
];

export default function MatrixOverviewPage() {
    return (
        <PageShell max="max-w-5xl">
            <JsonLd data={learningResourceJsonLd(TOOLS.matrix, MATRIX_PAGE_LIST)} />
            <Breadcrumbs
                items={[
                    SECTIONS["data-structures"],
                    { name: TOOLS.arrays.name, path: TOOLS.arrays.path },
                    { name: "Matrix Operations" },
                ]}
            />

            <header className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        MATRIX
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Matrix Operations</h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">
                    Transpose, rotate, flip and multiply a matrix one cell at a time, with the
                    source and the result side by side. Pick an operation below, or bring your
                    own grid from the{" "}
                    <Link href={TOOLS.arrays.path} className="text-accent hover:text-accent-hover font-medium">
                        2D Array Visualizer
                    </Link>
                    .
                </p>
            </header>

            <section aria-labelledby="pick-an-operation">
                <h2
                    id="pick-an-operation"
                    className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4"
                >
                    Pick an operation to step through
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {MATRIX_OP_LIST.map((op, index) => {
                        const page = MATRIX_PAGES[op.key];
                        return (
                            <TrackedLink
                                key={op.key}
                                href={page.path}
                                event="tool_open"
                                params={{ tool: "matrix", algo: op.key, from: "matrix_overview" }}
                                className="group surface rounded-2xl p-5 shadow-sm min-w-0 hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all focus-ring"
                            >
                                <div className="surface-muted rounded-xl p-3 grid place-items-center overflow-x-auto custom-scrollbar">
                                    <MatrixExample kind={op.key} {...PREVIEW[op.key]} compact />
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
                                <p className="text-base text-muted mt-1 leading-relaxed">{op.blurb}</p>
                            </TrackedLink>
                        );
                    })}
                </div>
            </section>

            <Explainer>
                <ExplainerSection title="The four operations side by side">
                    <p>
                        Three of these operations never change a value. Transpose, rotate and
                        flip are rules for where each cell goes, so every one of them costs one
                        read and one write per cell, <InlineCode>rows × cols</InlineCode> steps.
                        Multiplication is different: it builds new numbers, and every cell of the
                        result needs a whole loop of its own.
                    </p>
                    <div className="surface-muted rounded-lg overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <caption className="sr-only">How the four matrix operations compare</caption>
                            <thead>
                                <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Operation</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Rule</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium whitespace-nowrap">Result shape</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Steps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((row, index) => (
                                    <tr key={row.key} className={index !== ROWS.length - 1 ? "border-b border-token" : undefined}>
                                        <th scope="row" className="text-left px-3 py-2 font-medium whitespace-nowrap">
                                            <Link href={MATRIX_PAGES[row.key].path} className="text-accent hover:text-accent-hover">
                                                {MATRIX_OPS[row.key].label}
                                            </Link>
                                        </th>
                                        <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{row.rule}</td>
                                        <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{row.shape}</td>
                                        <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{row.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p>
                        The rules for rotate and flip are shown for the clockwise and horizontal
                        versions; the other direction of each swaps which index gets the{" "}
                        <InlineCode>− 1 −</InlineCode> treatment. Every page has a toggle for
                        both.
                    </p>
                </ExplainerSection>

                <ExplainerSection title="Which one should you learn first?">
                    <p>
                        Start with <strong className="text-text">transpose</strong>: it is the
                        plainest index rule, <InlineCode>B[j][i] = A[i][j]</InlineCode>, and the
                        piece the others are built from. Then{" "}
                        <strong className="text-text">rotate</strong>, which is the same loop with
                        a <InlineCode>rows − 1 − i</InlineCode> in the target, and{" "}
                        <strong className="text-text">flip</strong>, which mirrors one index and
                        keeps the shape. A clockwise rotation is a transpose followed by a
                        horizontal flip, so once you know two of them you know the third.
                    </p>
                    <p>
                        Finish with <strong className="text-text">multiplication</strong>. It
                        needs a second matrix, a size rule, and three nested loops, and it is the
                        first O(n³) algorithm most people meet. The page bands the current row
                        and column so the row-times-column sum is visible as it grows.
                    </p>
                    <p>
                        Each page keeps your grid when you switch, so try one matrix in all four
                        operations and compare the results. When the index rules feel natural,
                        the same grids are waiting on the{" "}
                        <Link href={TOOLS.grid.path} className="text-accent hover:text-accent-hover font-medium">
                            grid algorithm pages
                        </Link>
                        : flood fill, number of islands and BFS shortest path.
                    </p>
                </ExplainerSection>

                <ExplainerSection title="What the visualizer shows">
                    <p>
                        On every page the source matrix <InlineCode>A</InlineCode> sits on the
                        left and the result on the right, both with row and column numbers. Each
                        step reads one cell of <InlineCode>A</InlineCode>, marked in amber, and
                        writes one cell of the result, marked in pink; finished cells turn green,
                        and the index labels follow the two pointers so you can check the formula
                        against what actually happened. The counters underneath count reads and
                        writes, and the message spells out the assignment in full, such as{" "}
                        <InlineCode>B[2][1] = A[1][2] = 7</InlineCode>.
                    </p>
                    <p>
                        The multiplication page adds a third matrix. The current row of{" "}
                        <InlineCode>A</InlineCode> and column of <InlineCode>B</InlineCode> are
                        banded, the two cells being multiplied are highlighted, and the result
                        cell shows its running sum until the last product is added. The chips
                        above the counters list the terms of the sum so far.
                    </p>
                </ExplainerSection>

                <Faq title="Matrix operation questions" items={FAQS} />
            </Explainer>

            <NextStep
                href={MATRIX_PAGES.transpose.path}
                label="Start with transpose"
                tool="matrix"
                from="matrix_overview_next"
            >
                Not sure where to begin? Transpose is one rule and two loops, so start there and
                work through the four.
            </NextStep>

            <Footer />
        </PageShell>
    );
}

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import NextStep from "@/components/layout/NextStep";
import TrackedLink from "@/components/analytics/TrackedLink";
import JsonLd from "@/components/seo/JsonLd";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { ExamplePreview } from "@/components/array/grid/parts";
import { GRID_ALGORITHMS, GRID_ALGORITHM_LIST } from "@/lib/array/gridAlgorithms";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { GRID_PAGES, GRID_PAGE_LIST, SECTIONS, TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata({
    ...TOOLS.grid,
    image: `${TOOLS.grid.path}/opengraph-image`,
});

const ROWS = [
    { key: "flood-fill", question: "Which cells are connected to this one?", remembers: "A queue (BFS) or the call stack (DFS)", output: "The filled region" },
    { key: "number-of-islands", question: "How many separate regions are there?", remembers: "A visited mark on every land cell", output: "A count" },
    { key: "shortest-path", question: "What is the fewest steps from A to B?", remembers: "A queue, a distance and a parent per cell", output: "The distance and the route" },
];

const PREVIEW_LABELS = {
    "flood-fill": "Flood fill example: the connected region of 2s filled and numbered in visit order",
    "number-of-islands": "Number of islands example: three islands, each in its own colour with its number",
    "shortest-path": "BFS shortest path example: explored cells numbered by distance and the shortest route highlighted",
};

const FAQS = [
    {
        question: "What is a grid algorithm?",
        answer: "A graph algorithm run on a 2D array, where every cell is a node joined to its four neighbours. Flood fill, counting islands and finding the shortest path through a maze are the three every course starts with, and they are the same search, breadth-first or depth-first, asked different questions.",
    },
    {
        question: "When should I use BFS instead of DFS on a grid?",
        answer: "Use BFS whenever distance matters, because it explores in rings and the first time it reaches a cell is by the fewest steps. Use DFS when you only need to know what is connected, such as filling a region or counting islands, because the recursive version is the shortest code. On very large regions prefer BFS or an explicit stack to avoid deep recursion.",
    },
    {
        question: "Do these work with diagonal moves?",
        answer: "Yes, if you add the four diagonal neighbours to the search. The default here is 4-connected, which is what LeetCode 733 and 200 use. LeetCode 1091 is the 8-connected shortest path.",
    },
    {
        question: "Can I use my own grid?",
        answer: "Yes. Click cells directly to move the start, toggle walls or switch land and water, use the Random and Clear buttons, or build a grid in the 2D Array Visualizer and use the Run on this grid links under it. Copy link reopens the same grid, start, target and step.",
    },
];

export default function GridOverviewPage() {
    return (
        <PageShell max="max-w-5xl">
            <JsonLd data={learningResourceJsonLd(TOOLS.grid, GRID_PAGE_LIST)} />
            <Breadcrumbs items={[SECTIONS.algorithms, { name: TOOLS.grid.name }]} />

            <header className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        GRID
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Grid Algorithms</h1>
                </div>
                <p className="mt-3 text-base text-muted max-w-lg mx-auto">
                    BFS and DFS on a 2D array, one step at a time: fill a region, count the
                    islands, and find the shortest way through a maze. Click cells to change
                    the grid, or bring your own from the{" "}
                    <Link href={TOOLS.arrays.path} className="text-accent hover:text-accent-hover font-medium">
                        2D Array Visualizer
                    </Link>
                    .
                </p>
            </header>

            <section aria-labelledby="pick-an-algorithm">
                <h2 id="pick-an-algorithm" className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">
                    Pick an algorithm to step through
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {GRID_ALGORITHM_LIST.map((a, index) => {
                        const page = GRID_PAGES[a.key];
                        return (
                            <TrackedLink
                                key={a.key}
                                href={page.path}
                                event="tool_open"
                                params={{ tool: "grid", algo: a.key, from: "grid_overview" }}
                                className="group surface rounded-2xl p-5 shadow-sm min-w-0 hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all focus-ring"
                            >
                                <div className="surface-muted rounded-xl p-3 overflow-x-auto custom-scrollbar">
                                    <div className="grid place-items-center min-w-max">
                                        <ExamplePreview kind={a.key} label={PREVIEW_LABELS[a.key]} compact />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold flex items-center gap-1.5">
                                    <span className="grid place-items-center h-5 w-5 rounded-full bg-accent text-white text-[11px] font-bold">
                                        {index + 1}
                                    </span>
                                    {page.name}
                                    <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                                </h3>
                                <p className="text-base text-muted mt-1 leading-relaxed">{a.blurb}</p>
                            </TrackedLink>
                        );
                    })}
                </div>
            </section>

            <Explainer>
                <ExplainerSection title="Three questions, one search">
                    <p>
                        A grid is a graph in disguise: every cell is a node with up to four
                        neighbours. All three algorithms walk that graph while remembering which
                        cells they have already seen, so each one costs about{" "}
                        <InlineCode>rows × cols</InlineCode> steps. What differs is the
                        question being asked and what has to be remembered to answer it.
                    </p>
                    <div className="surface-muted rounded-lg overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <caption className="sr-only">How the three grid algorithms compare</caption>
                            <thead>
                                <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Algorithm</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Question</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Remembers</th>
                                    <th scope="col" className="text-left px-3 py-2 font-medium">Output</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((row, index) => (
                                    <tr key={row.key} className={index !== ROWS.length - 1 ? "border-b border-token" : undefined}>
                                        <th scope="row" className="text-left px-3 py-2 font-medium whitespace-nowrap">
                                            <Link href={GRID_PAGES[row.key].path} className="text-accent hover:text-accent-hover">
                                                {GRID_ALGORITHMS[row.key].label}
                                            </Link>
                                        </th>
                                        <td className="px-3 py-2">{row.question}</td>
                                        <td className="px-3 py-2">{row.remembers}</td>
                                        <td className="px-3 py-2">{row.output}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ExplainerSection>

                <ExplainerSection title="Which one should you learn first?">
                    <p>
                        Start with <strong className="text-text">flood fill</strong>: it is the
                        search itself, with nothing else attached, and you can watch BFS and DFS
                        cover the same cells in different orders. Then{" "}
                        <strong className="text-text">number of islands</strong>, which wraps
                        that search in a loop and a counter. Finish with{" "}
                        <strong className="text-text">BFS shortest path</strong>, where the
                        order of the search finally matters and the queue earns its keep.
                    </p>
                    <p>
                        Each page keeps your grid when you switch, so draw one maze and run all
                        three on it.
                    </p>
                </ExplainerSection>

                <Faq title="Grid algorithm questions" items={FAQS} />
            </Explainer>

            <NextStep
                href={GRID_PAGES["flood-fill"].path}
                label="Start with flood fill"
                tool="grid"
                from="grid_overview_next"
            >
                Not sure where to begin? Flood fill is the paint bucket everyone has used, so
                start there and work through the three.
            </NextStep>

            <Footer />
        </PageShell>
    );
}

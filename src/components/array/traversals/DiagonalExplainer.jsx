import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Sequence, WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What is diagonal traversal of a matrix?",
        answer: "Visiting the cells one anti-diagonal at a time. An anti-diagonal is the set of cells whose row and column indices add up to the same number: i + j = 0 is the top-left corner, i + j = 1 is the two cells next to it, and the last diagonal is the bottom-right corner alone.",
    },
    {
        question: "How many diagonals does a matrix have?",
        answer: "rows + cols − 1. A 3 × 4 grid has 6 anti-diagonals, numbered 0 to 5, because the largest possible i + j is (3 − 1) + (4 − 1) = 5.",
    },
    {
        question: "Why does the inner loop start at max(0, d − cols + 1)?",
        answer: "Because j = d − i must stay inside the grid. When d is larger than cols − 1, starting i at 0 would give a column past the right edge, so i has to start at d − cols + 1. The min(d, rows − 1) upper bound stops i running past the bottom row in the same way.",
    },
    {
        question: "Is this the same as LeetCode's diagonal traverse?",
        answer: "Almost. LeetCode 498 walks the same anti-diagonals but alternates direction on each one, up-right then down-left, like a snake. The version here always goes down-left, which is simpler to write and the usual first step before adding the alternation.",
    },
];

export default function DiagonalExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How diagonal traversal works">
                <p>
                    Draw a grid and shade every cell whose row number plus column number is 2:
                    cells <InlineCode>[0][2]</InlineCode>, <InlineCode>[1][1]</InlineCode> and{" "}
                    <InlineCode>[2][0]</InlineCode>. They form a slanted line from the top
                    right down to the bottom left, an <strong className="text-text">anti-diagonal</strong>.
                    Every cell in the grid belongs to exactly one such line, and the lines are
                    numbered by that sum, <InlineCode>d = i + j</InlineCode>.
                </p>
                <p>
                    Diagonal traversal visits the lines in order: <InlineCode>d = 0</InlineCode>{" "}
                    is just the top-left corner, <InlineCode>d = 1</InlineCode> has two cells,
                    and the lines grow until they hit the far edges and shrink again down to
                    the bottom-right corner. It is the order you would sweep a grid with a
                    ruler held at forty-five degrees.
                </p>
                <p>
                    The precondition is the same as always: a rectangle. In the visualizer the
                    variable <InlineCode>d</InlineCode> shows the current diagonal and the
                    first cell of each line is marked as a turn.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    The outer loop runs <InlineCode>d</InlineCode> from{" "}
                    <InlineCode>0</InlineCode> to <InlineCode>rows + cols − 2</InlineCode>. For
                    each diagonal the inner loop runs <InlineCode>i</InlineCode> through the
                    rows that line touches, and the column follows for free:{" "}
                    <InlineCode>j = d − i</InlineCode>.
                </p>
                <p>
                    The only tricky part is where <InlineCode>i</InlineCode> starts and stops.
                    Near the top-left corner it starts at 0, but once the diagonal reaches the
                    right edge it has to start lower, at <InlineCode>d − cols + 1</InlineCode>,
                    or <InlineCode>j</InlineCode> would fall off the grid. Near the bottom it
                    has to stop at <InlineCode>rows − 1</InlineCode> rather than at{" "}
                    <InlineCode>d</InlineCode>. Hence <InlineCode>max(0, d − cols + 1)</InlineCode>{" "}
                    and <InlineCode>min(d, rows − 1)</InlineCode>. Step through the visualizer
                    and watch those bounds change at diagonals 3 and 4.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid">
                <WorkedExample kind="diagonal">
                    <p>
                        With the cells numbered 1 to 12, the six diagonals read:
                    </p>
                    <Sequence kind="diagonal" />
                    <p>
                        Grouped by diagonal that is 1 | 2 5 | 3 6 9 | 4 7 10 | 8 11 | 12: the
                        lines grow to three cells, then shrink. Twelve cells, twelve steps,
                        six diagonals, exactly <InlineCode>3 + 4 − 1</InlineCode>.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">JPEG compression.</strong> After the
                        transform step, each 8 × 8 block is read in a zigzag along its
                        anti-diagonals so the small high-frequency values cluster at the end.
                    </li>
                    <li>
                        <strong className="text-text">Dynamic programming tables.</strong> In
                        problems such as longest common subsequence, every cell on one
                        anti-diagonal depends only on earlier diagonals, so a whole diagonal
                        can be computed at once, in parallel.
                    </li>
                    <li>
                        <strong className="text-text">Pairing and enumeration.</strong> Listing
                        all pairs (i, j) by their sum is how you enumerate an infinite grid one
                        finite diagonal at a time.
                    </li>
                    <li>
                        <strong className="text-text">Interviews.</strong> &ldquo;Diagonal traverse&rdquo;
                        and &ldquo;print the matrix diagonally&rdquo; are standard warm-ups.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Running <InlineCode>i</InlineCode> from 0
                        to <InlineCode>d</InlineCode> every time.</strong> That works on the
                        first few diagonals and then indexes outside the grid.
                    </li>
                    <li>
                        <strong className="text-text">Confusing the two kinds of diagonal.</strong>{" "}
                        Cells with <InlineCode>i − j</InlineCode> constant form the main
                        diagonals, which slope the other way. This page uses{" "}
                        <InlineCode>i + j</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">Assuming the grid is square.</strong> The
                        bounds above are what make a 3 × 4 grid work; on a square grid a
                        simpler, wrong version can pass by luck.
                    </li>
                </ul>
                <p>
                    Every order so far visited every cell. Next, one that only walks the
                    outer ring:{" "}
                    <Link
                        href="/data-structures/arrays/traversal/boundary"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Boundary traversal →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Diagonal traversal questions" items={FAQS} />
        </Explainer>
    );
}

import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Sequence, WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What is boundary traversal of a matrix?",
        answer: "Visiting only the cells on the outer edge of a 2D array, usually clockwise: the whole top row, the right column below it, the bottom row from right to left, and the left column from bottom to top, stopping before the cell you started on.",
    },
    {
        question: "How many cells are on the boundary?",
        answer: "2 × rows + 2 × cols − 4 when the grid has at least two rows and two columns, because the four corners would otherwise be counted twice. A 3 × 4 grid has 10 boundary cells. A single row or single column is all boundary, so the count is simply rows × cols.",
    },
    {
        question: "Why do single-row and single-column grids need special care?",
        answer: "Because the bottom row is the top row and the left column is the right column. Without the two if checks, a 1 × 4 grid would be printed forwards and then backwards, visiting every cell twice.",
    },
    {
        question: "How is boundary traversal related to spiral traversal?",
        answer: "The boundary is the first ring of a spiral. Spiral traversal walks the boundary, shrinks the four bounds by one, and walks the boundary of what is left, again and again. If you can write the boundary correctly, the spiral is a loop around it.",
    },
];

export default function BoundaryExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How boundary traversal works">
                <p>
                    Trace the frame of a picture with your finger: along the top edge, down
                    the right side, back along the bottom, up the left side to where you
                    started. Boundary traversal does that on a grid. It touches only the outer
                    ring of cells and leaves everything inside alone.
                </p>
                <p>
                    That makes it different from every other order on this site: it is not a
                    way to visit all the cells. On a 3 × 4 grid it visits 10 of 12; on a 10 ×
                    10 grid, 36 of 100. The counters in the visualizer show the total it is
                    aiming for, not the size of the grid.
                </p>
                <p>
                    The whole difficulty is the corners. Each one belongs to two edges, and a
                    careless version prints them twice. The trick is to give each edge one
                    corner: the top row takes both of its corners, the right column starts one
                    below, the bottom row starts one to the left, and the left column stops one
                    above where the top row began.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    Four loops in a row, no nesting. Top row: <InlineCode>j</InlineCode> from{" "}
                    <InlineCode>0</InlineCode> to <InlineCode>cols − 1</InlineCode> along row 0.
                    Right column: <InlineCode>i</InlineCode> from <InlineCode>1</InlineCode> to{" "}
                    <InlineCode>rows − 1</InlineCode> down column <InlineCode>cols − 1</InlineCode>.
                    Bottom row: <InlineCode>j</InlineCode> from <InlineCode>cols − 2</InlineCode>{" "}
                    down to <InlineCode>0</InlineCode>. Left column: <InlineCode>i</InlineCode>{" "}
                    from <InlineCode>rows − 2</InlineCode> down to <InlineCode>1</InlineCode>.
                </p>
                <p>
                    The last two loops are wrapped in <InlineCode>if rows &gt; 1</InlineCode>{" "}
                    and <InlineCode>if cols &gt; 1</InlineCode>. Set the sliders to one row and
                    watch why: without the guard, the &ldquo;bottom row&rdquo; would be the top row read
                    backwards.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid">
                <WorkedExample kind="boundary">
                    <p>
                        With the cells numbered 1 to 12, the ring reads clockwise from the
                        top-left corner:
                    </p>
                    <Sequence kind="boundary" />
                    <p>
                        Ten cells: 4 along the top, 2 down the right side, 3 back along the
                        bottom, 1 up the left. The 6 and 7 in the middle are never visited and
                        stay grey in the picture. Check the arithmetic:{" "}
                        <InlineCode>2 × 3 + 2 × 4 − 4 = 10</InlineCode>.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Borders and frames.</strong> Drawing a
                        border around an image or a table, or checking that a board&apos;s edge is
                        walls.
                    </li>
                    <li>
                        <strong className="text-text">Spiral traversal.</strong> The boundary is
                        one ring of the spiral; get this right and the spiral follows.
                    </li>
                    <li>
                        <strong className="text-text">Grid problems.</strong> Flood fill from
                        the edges, &ldquo;cells that can reach the border&rdquo;, and island-counting
                        variants all start by walking the boundary.
                    </li>
                    <li>
                        <strong className="text-text">Interviews.</strong> &ldquo;Print the boundary
                        elements of a matrix&rdquo; is a common warm-up precisely because of the
                        corner and single-row traps.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Printing the corners twice.</strong> Each
                        edge must skip the corner the previous edge already took.
                    </li>
                    <li>
                        <strong className="text-text">Forgetting the single-row and
                        single-column cases.</strong> The two <InlineCode>if</InlineCode> guards
                        are not optional.
                    </li>
                    <li>
                        <strong className="text-text">Counting rows × cols.</strong> The number
                        of boundary cells is <InlineCode>2r + 2c − 4</InlineCode>, so a loop
                        that expects every cell will never finish.
                    </li>
                </ul>
                <p>
                    Now keep going inwards until nothing is left:{" "}
                    <Link
                        href="/data-structures/arrays/traversal/spiral"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Spiral traversal →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Boundary traversal questions" items={FAQS} />
        </Explainer>
    );
}

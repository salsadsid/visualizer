import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Sequence, WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What is snake traversal of a matrix?",
        answer: "A traversal that walks the first row left to right, the second row right to left, the third left to right, and so on. The path snakes down the grid without ever jumping back to the start of a row. It is also called zigzag or boustrophedon order.",
    },
    {
        question: "How do I reverse the loop on odd rows?",
        answer: "Check i % 2. On even rows run j from 0 up to cols − 1; on odd rows run j from cols − 1 down to 0. A neat alternative is a single loop over n from 0 to cols − 1 with j = i % 2 == 0 ? n : cols − 1 − n.",
    },
    {
        question: "Where is snake order used?",
        answer: "Anywhere a moving head should not waste a trip back to the start: dot-matrix and inkjet printers, plotters, CNC machines and 3D printer infill all sweep back and forth. Ancient Greek inscriptions were sometimes written this way too, which is where the name boustrophedon, ox-turning, comes from.",
    },
    {
        question: "Does snake traversal visit every cell?",
        answer: "Yes, exactly once, so it takes rows × columns steps like row-major order. The only thing that changes is the direction on odd rows, which is why the visualizer marks the first cell of each new row as a turn.",
    },
];

export default function SnakeExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How snake traversal works">
                <p>
                    Mow a lawn. You push the mower to the far end, turn around, and come back
                    along the next strip. Nobody walks back to the start of the lawn to begin
                    every strip from the same side. Snake traversal is that idea on a grid:
                    row 0 goes left to right, row 1 goes right to left, row 2 goes left to
                    right again.
                </p>
                <p>
                    Compared with{" "}
                    <Link
                        href="/data-structures/arrays/traversal/row-major"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        row-major order
                    </Link>{" "}
                    the set of cells is the same and the number of steps is the same. What
                    changes is the <em>path</em>: consecutive cells are always neighbours, so
                    there is never a long jump from the end of one row to the start of the
                    next.
                </p>
                <p>
                    In the visualizer the direction shows as a variable, and the first cell of
                    each new row is marked as a turn, the moment the path swings around.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    The outer loop is unchanged: <InlineCode>i</InlineCode> from{" "}
                    <InlineCode>0</InlineCode> to <InlineCode>rows − 1</InlineCode>. The inner
                    loop depends on whether the row is even or odd. Even rows (
                    <InlineCode>i % 2 == 0</InlineCode>) run <InlineCode>j</InlineCode> upwards;
                    odd rows run it downwards from <InlineCode>cols − 1</InlineCode>.
                </p>
                <p>
                    If you dislike two inner loops, count steps instead of columns: let{" "}
                    <InlineCode>n</InlineCode> run from <InlineCode>0</InlineCode> to{" "}
                    <InlineCode>cols − 1</InlineCode> and set{" "}
                    <InlineCode>j = n</InlineCode> on even rows,{" "}
                    <InlineCode>j = cols − 1 − n</InlineCode> on odd rows. One loop, one
                    formula, same path.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid">
                <WorkedExample kind="snake">
                    <p>
                        Number the cells 1 to 12 in reading order. Row 0 reads forwards, row 1
                        backwards, row 2 forwards:
                    </p>
                    <Sequence kind="snake" />
                    <p>
                        Look at the joins: 4 is next to 8, and 5 is next to 9. Every pair of
                        consecutive visits touches. There are only two turns on three rows,
                        and the Visited counter still ends on 12.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Printers, plotters and 3D printers.</strong>{" "}
                        The head sweeps back and forth; returning to the left edge every line
                        would double the travel.
                    </li>
                    <li>
                        <strong className="text-text">Robot vacuums and lawn mowers.</strong>{" "}
                        Boustrophedon coverage is the standard way to cover a rectangle.
                    </li>
                    <li>
                        <strong className="text-text">Interview questions.</strong> &ldquo;Print the
                        matrix in snake pattern&rdquo; and &ldquo;zigzag order&rdquo; both mean this.
                    </li>
                    <li>
                        <strong className="text-text">Grid puzzles and games.</strong> Snakes
                        and Ladders numbers its board exactly this way.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Reversing the values instead of the
                        loop.</strong> You do not need to reverse a row; you need to read it
                        from the other end.
                    </li>
                    <li>
                        <strong className="text-text">Starting the odd rows at{" "}
                        <InlineCode>cols</InlineCode>.</strong> The last valid column is{" "}
                        <InlineCode>cols − 1</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">Checking the wrong index.</strong> The
                        parity test is on the row <InlineCode>i</InlineCode>, not on{" "}
                        <InlineCode>j</InlineCode>.
                    </li>
                </ul>
                <p>
                    Rows and columns are not the only lines through a grid. Next:{" "}
                    <Link
                        href="/data-structures/arrays/traversal/diagonal"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Diagonal traversal →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Snake traversal questions" items={FAQS} />
        </Explainer>
    );
}

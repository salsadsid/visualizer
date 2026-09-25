import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Sequence, WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What is spiral traversal of a matrix?",
        answer: "Visiting a 2D array in a clockwise spiral: the top row left to right, the right column top to bottom, the bottom row right to left, the left column bottom to top, and then the same on the smaller rectangle inside, until every cell has been visited once.",
    },
    {
        question: "Why are the two if checks inside the loop needed?",
        answer: "After the top row and right column are done, the bounds shrink. On a grid with a single row left, top is now greater than bottom, and without the check the bottom row would be the row you just printed, read backwards. The same happens with the left column when a single column is left. The checks stop those repeats.",
    },
    {
        question: "What is the time complexity of spiral traversal?",
        answer: "O(rows × cols). Every cell is visited exactly once, and the bounds bookkeeping adds only a constant amount of work per ring. The extra memory is O(1) if you print or stream the values, or O(rows × cols) if you collect them into a list.",
    },
    {
        question: "Is this LeetCode 54, Spiral Matrix?",
        answer: "Yes. The four-bounds method here is the standard solution. LeetCode 59, Spiral Matrix II, is the reverse task, filling an empty n × n grid with 1 to n² in spiral order, and it uses exactly the same loop with a write instead of a read.",
    },
];

export default function SpiralExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How spiral traversal works">
                <p>
                    Peel an onion one layer at a time. Spiral traversal walks the outer ring
                    of the grid clockwise, then treats what is left as a smaller grid and
                    walks its outer ring, and keeps going until the rings run out. The classic
                    picture is the top row read left to right, then down the right edge, back
                    along the bottom, up the left edge, and then the same again one step in.
                </p>
                <p>
                    The code does not need to know how many rings there are. It keeps four
                    numbers, the bounds <InlineCode>top</InlineCode>,{" "}
                    <InlineCode>bottom</InlineCode>, <InlineCode>left</InlineCode> and{" "}
                    <InlineCode>right</InlineCode>, and moves each one inwards as soon as its
                    edge has been walked. When <InlineCode>top</InlineCode> passes{" "}
                    <InlineCode>bottom</InlineCode> or <InlineCode>left</InlineCode> passes{" "}
                    <InlineCode>right</InlineCode>, there is nothing left inside and the loop
                    stops.
                </p>
                <p>
                    It builds directly on{" "}
                    <Link
                        href="/data-structures/arrays/traversal/boundary"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        boundary traversal
                    </Link>
                    : one ring of the spiral is exactly one boundary walk. Watch the four
                    bound variables in the visualizer close in on the centre.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    Start with <InlineCode>top = 0</InlineCode>,{" "}
                    <InlineCode>bottom = rows − 1</InlineCode>, <InlineCode>left = 0</InlineCode>{" "}
                    and <InlineCode>right = cols − 1</InlineCode>. While the bounds have not
                    crossed: walk row <InlineCode>top</InlineCode> from left to right, then{" "}
                    <InlineCode>top += 1</InlineCode>; walk column <InlineCode>right</InlineCode>{" "}
                    from the new top down to bottom, then <InlineCode>right −= 1</InlineCode>;
                    walk row <InlineCode>bottom</InlineCode> from right to left, then{" "}
                    <InlineCode>bottom −= 1</InlineCode>; walk column{" "}
                    <InlineCode>left</InlineCode> from bottom up to top, then{" "}
                    <InlineCode>left += 1</InlineCode>.
                </p>
                <p>
                    The last two walks are guarded by <InlineCode>if top &lt;= bottom</InlineCode>{" "}
                    and <InlineCode>if left &lt;= right</InlineCode>. They matter only on the
                    final ring, when a single row or column is left, but without them that
                    row or column gets visited twice. Set the sliders to 1 row and watch the
                    guards do their job.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid">
                <WorkedExample kind="spiral">
                    <p>
                        With the cells numbered 1 to 12, the first ring is the boundary and the
                        second ring is what remains in the middle:
                    </p>
                    <Sequence kind="spiral" />
                    <p>
                        Ring one: 1 2 3 4 down to 8 and 12, back through 11 10 9, up to 5.
                        The bounds are now top 1, bottom 1, left 1, right 2, a single row. The
                        top-row walk visits 6 and 7, <InlineCode>top</InlineCode> becomes 2 and
                        passes <InlineCode>bottom</InlineCode>, and the guards skip the rest.
                        Twelve cells, twelve visits, no repeats.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Interviews.</strong> Spiral Matrix is one
                        of the most asked grid questions, and its variants (fill in spiral
                        order, spiral from the centre, anticlockwise) all reuse the bounds.
                    </li>
                    <li>
                        <strong className="text-text">Image and scan processing.</strong>{" "}
                        Reading a region from the outside in, or generating a spiral pattern of
                        samples.
                    </li>
                    <li>
                        <strong className="text-text">Puzzles and games.</strong> Ulam&apos;s prime
                        spiral, spiral-shaped level layouts, and snail-shell board numbering.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Leaving out the two guards.</strong> The
                        code passes on a square grid and repeats cells on a 1 × n or n × 1
                        remainder.
                    </li>
                    <li>
                        <strong className="text-text">Shrinking a bound before walking its
                        edge.</strong> Each bound moves only after the edge it describes has
                        been visited.
                    </li>
                    <li>
                        <strong className="text-text">Using a visited matrix by reflex.</strong>{" "}
                        A grid of booleans works but costs extra memory; the four bounds do the
                        same job in constant space.
                    </li>
                </ul>
                <p>
                    Every full traversal on these pages took rows × columns steps. See how
                    that growth compares with other algorithms:{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Spiral traversal questions" items={FAQS} />
        </Explainer>
    );
}

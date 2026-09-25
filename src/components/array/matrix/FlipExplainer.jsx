import Link from "next/link";
import { CodeBlock, Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What is the difference between a horizontal and a vertical flip?",
        answer: "A horizontal flip mirrors left and right: every row is reversed, so the first column becomes the last. A vertical flip mirrors top and bottom: the order of the rows is reversed, so the first row becomes the last. Neither changes the shape of the matrix.",
    },
    {
        question: "How do you flip a matrix in place?",
        answer: "Horizontally, reverse each row with two pointers that swap and move inwards until they meet. Vertically, swap row i with row rows − 1 − i for the first half of the rows. Both need only a temporary variable per swap.",
    },
    {
        question: "Is flipping twice the same as rotating 180 degrees?",
        answer: "Yes, if you flip both ways. A horizontal flip followed by a vertical flip, in either order, gives the same result as two 90° rotations. Flipping the same way twice gives the original matrix back.",
    },
    {
        question: "What is the time complexity of flipping a matrix?",
        answer: "O(rows × cols) when copying into a new matrix, one read and one write per cell. In place it is about half that many swaps, but still O(rows × cols) overall.",
    },
];

export default function FlipExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How flipping works">
                <p>
                    Flipping a matrix produces its mirror image. A{" "}
                    <strong className="text-text">horizontal</strong> flip mirrors left and
                    right, as if a mirror stood along the right edge: the last column becomes
                    the first, and every row is read backwards. A{" "}
                    <strong className="text-text">vertical</strong> flip mirrors top and bottom:
                    the last row becomes the first, and each row keeps its own order.
                </p>
                <p>
                    Unlike a{" "}
                    <Link
                        href="/data-structures/arrays/matrix/transpose"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        transpose
                    </Link>{" "}
                    or a{" "}
                    <Link
                        href="/data-structures/arrays/matrix/rotate"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        rotation
                    </Link>
                    , a flip keeps the shape: a 3 × 4 matrix is still 3 × 4 afterwards. Use the
                    Horizontal and Vertical toggle above to compare the two mirrors on the same
                    grid, and watch which pointer moves backwards.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The index formulas">
                <p>
                    A horizontal flip changes only the column index. Column{" "}
                    <InlineCode>j</InlineCode> moves to column{" "}
                    <InlineCode>cols − 1 − j</InlineCode>:
                </p>
                <CodeBlock>{`B = new matrix[rows][cols]
for i in 0 .. rows-1:
  for j in 0 .. cols-1:
    B[i][cols-1-j] = A[i][j]
return B`}</CodeBlock>
                <p>
                    A vertical flip changes only the row index, so the write becomes{" "}
                    <InlineCode>B[rows-1-i][j] = A[i][j]</InlineCode>. In both cases the loops
                    visit every cell once, one read and one write each, for{" "}
                    <InlineCode>rows × cols</InlineCode> steps. The <InlineCode>− 1</InlineCode>{" "}
                    is the usual zero-based fix: with 4 columns the last column is column 3, so
                    column 0 must land on <InlineCode>4 − 1 − 0 = 3</InlineCode>.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid, horizontally">
                <WorkedExample kind="flip" variant="horizontal">
                    <p>
                        Each row is reversed on its own. 1 2 3 4 becomes 4 3 2 1, 5 6 7 8 becomes
                        8 7 6 5, and 9 10 11 12 becomes 12 11 10 9. The rows stay in the same
                        order, so the top row is still the top row.
                    </p>
                    <p>
                        Take 7 at <InlineCode>A[1][2]</InlineCode>: it moves to column{" "}
                        <InlineCode>4 − 1 − 2 = 1</InlineCode>, so{" "}
                        <InlineCode>B[1][1] = 7</InlineCode>. A vertical flip would leave it in
                        column 2 and move it to row <InlineCode>3 − 1 − 1 = 1</InlineCode>, the
                        middle row, which is where it already is.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Flipping in place">
                <p>
                    Flips are easy to do without a second matrix. A horizontal flip is a{" "}
                    <Link
                        href="/data-structures/arrays/1d"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        two-pointer reverse
                    </Link>{" "}
                    on every row: one pointer starts at the left end, one at the right, they swap
                    and step towards each other until they meet.
                </p>
                <CodeBlock>{`for each row of A:
  lo = 0, hi = cols-1
  while lo < hi:
    swap(row[lo], row[hi])
    lo += 1, hi -= 1`}</CodeBlock>
                <p>
                    A vertical flip swaps whole rows instead: row <InlineCode>i</InlineCode>{" "}
                    with row <InlineCode>rows − 1 − i</InlineCode>, for{" "}
                    <InlineCode>i</InlineCode> up to the middle. Stop at the middle in both
                    cases. Run the loop over every row and every pair is swapped twice, which
                    hands you the original matrix back.
                </p>
                <p>
                    The flips also compose nicely: a horizontal flip followed by a vertical
                    flip is a 180° rotation, and a transpose followed by a horizontal flip is
                    a 90° clockwise rotation.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Images.</strong> Flip Horizontal and Flip
                        Vertical in any image editor are these two loops over the pixels.
                    </li>
                    <li>
                        <strong className="text-text">Sprites.</strong> Games draw a character
                        facing left by flipping the right-facing sprite instead of storing both.
                    </li>
                    <li>
                        <strong className="text-text">Symmetry checks.</strong> A pattern is
                        symmetric about an axis if flipping it about that axis changes nothing.
                    </li>
                    <li>
                        <strong className="text-text">Interviews.</strong> Flipping an Image flips
                        each row and inverts the bits in one pass.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Swapping all the way across.</strong> The
                        in-place loop must stop at the middle, or everything swaps back.
                    </li>
                    <li>
                        <strong className="text-text">Dropping the − 1.</strong>{" "}
                        <InlineCode>cols − j</InlineCode> is one past the end for{" "}
                        <InlineCode>j = 0</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">Mixing up the axes.</strong> Horizontal
                        changes the column index, vertical changes the row index. The names
                        describe the direction of the mirror, not the axis it sits on.
                    </li>
                </ul>
                <p>
                    Every flip costs one step per cell. See how that growth compares with other
                    algorithms:{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Matrix flip questions" items={FAQS} />
        </Explainer>
    );
}

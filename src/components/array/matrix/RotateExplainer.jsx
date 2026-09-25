import Link from "next/link";
import { CodeBlock, Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { WorkedExample } from "./parts";

const FAQS = [
    {
        question: "How do you rotate a matrix 90 degrees clockwise?",
        answer: "Create a result with the dimensions swapped, then copy every A[i][j] to B[j][rows − 1 − i]. The first row of A becomes the last column of B, read top to bottom. For a square matrix you can do it in place: transpose, then reverse each row.",
    },
    {
        question: "How do you rotate a matrix counter-clockwise?",
        answer: "Copy every A[i][j] to B[cols − 1 − j][i]. The first row of A becomes the first column of B, filled from the bottom up. In place on a square matrix: transpose, then reverse each column, or equivalently reverse each row first and then transpose.",
    },
    {
        question: "How do you rotate a matrix 180 degrees?",
        answer: "Rotate 90° twice, or reverse the order of the rows and then reverse each row. That is the same as a vertical flip followed by a horizontal flip, and the shape stays the same.",
    },
    {
        question: "What is the time complexity of rotating a matrix?",
        answer: "O(rows × cols): each cell is read once and written once. The copying version needs a second matrix; the in-place version for square matrices needs only a temporary variable for each swap.",
    },
];

export default function RotateExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How rotating works">
                <p>
                    Rotating a matrix by 90° turns the whole grid a quarter turn, the way you
                    would turn a photo. Clockwise, the top row swings round to become the
                    rightmost column, the second row becomes the column just inside it, and the
                    bottom row becomes the leftmost column. Every cell keeps its value and its
                    neighbours; only the orientation changes.
                </p>
                <p>
                    Because rows become columns, a matrix with <InlineCode>rows</InlineCode>{" "}
                    rows and <InlineCode>cols</InlineCode> columns turns into one with{" "}
                    <InlineCode>cols</InlineCode> rows and <InlineCode>rows</InlineCode>{" "}
                    columns, just like a{" "}
                    <Link
                        href="/data-structures/arrays/matrix/transpose"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        transpose
                    </Link>
                    . The difference is the direction each row is read into its column. Use
                    the Clockwise and Counter-clockwise toggle above to watch the same grid
                    turn both ways.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The index formula">
                <p>
                    Clockwise, row <InlineCode>i</InlineCode> of <InlineCode>A</InlineCode>{" "}
                    becomes column <InlineCode>rows − 1 − i</InlineCode> of the result, so
                    the top row lands in the last column:
                </p>
                <CodeBlock>{`B = new matrix[cols][rows]
for i in 0 .. rows-1:
  for j in 0 .. cols-1:
    B[j][rows-1-i] = A[i][j]
return B`}</CodeBlock>
                <p>
                    Counter-clockwise, column <InlineCode>j</InlineCode> of{" "}
                    <InlineCode>A</InlineCode> becomes row <InlineCode>cols − 1 − j</InlineCode>{" "}
                    of the result, so the write is{" "}
                    <InlineCode>B[cols-1-j][i] = A[i][j]</InlineCode>. Both versions do one
                    read and one write per cell, <InlineCode>rows × cols</InlineCode> steps in
                    all. The <InlineCode>− 1</InlineCode> is there because indices start at 0:
                    in a matrix with 3 rows the last row is row 2.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid, clockwise">
                <WorkedExample kind="rotate" variant="cw">
                    <p>
                        The top row, 1 2 3 4, becomes the last column of the result, read top
                        to bottom. The bottom row, 9 10 11 12, becomes the first column. The
                        result has 4 rows and 3 columns.
                    </p>
                    <p>
                        Follow one cell: 7 is at <InlineCode>A[1][2]</InlineCode>. Clockwise it
                        goes to row 2, column <InlineCode>3 − 1 − 1 = 1</InlineCode>, so{" "}
                        <InlineCode>B[2][1] = 7</InlineCode>. Counter-clockwise it would go to
                        row <InlineCode>4 − 1 − 2 = 1</InlineCode>, column 1 instead.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Rotating in place">
                <p>
                    A square matrix can be rotated without a second copy, and this is the
                    version interviewers ask for. Clockwise is a transpose followed by
                    reversing every row:
                </p>
                <CodeBlock>{`transpose(A)          # A[i][j] <-> A[j][i] for j > i
for each row of A:
  reverse(row)        # two pointers swapping inwards`}</CodeBlock>
                <p>
                    Counter-clockwise is a transpose followed by reversing every column, or,
                    if you prefer, reverse every row first and then transpose. The order
                    matters: reverse the rows before transposing and a clockwise recipe turns
                    into a counter-clockwise one. The other classic in-place method moves
                    four cells at a time around each ring of the matrix, which is the same
                    idea as a{" "}
                    <Link
                        href="/data-structures/arrays/traversal/spiral"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        spiral traversal
                    </Link>{" "}
                    with a four-way swap.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Images.</strong> An image is a matrix of
                        pixels, and rotating it a quarter turn is exactly this loop.
                    </li>
                    <li>
                        <strong className="text-text">Games.</strong> Tetris pieces, jigsaw tiles
                        and dungeon rooms are small matrices that get rotated on the fly.
                    </li>
                    <li>
                        <strong className="text-text">Puzzles.</strong> Checking a board against
                        its four rotations finds positions that are really the same.
                    </li>
                    <li>
                        <strong className="text-text">Interviews.</strong> Rotate Image is one of
                        the most asked matrix questions, and the in-place version is the one to
                        know.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Rotating the wrong way.</strong> Clockwise
                        uses <InlineCode>rows − 1 − i</InlineCode> on the column index;
                        counter-clockwise uses <InlineCode>cols − 1 − j</InlineCode> on the row
                        index. Mixing them gives a transpose or a mirror instead.
                    </li>
                    <li>
                        <strong className="text-text">Keeping the old shape.</strong> The result
                        of a 3 × 4 rotation is 4 × 3. Allocate it that way.
                    </li>
                    <li>
                        <strong className="text-text">Reversing before transposing.</strong> In
                        the in-place recipe the order decides the direction.
                    </li>
                </ul>
                <p>
                    Every rotation costs one step per cell. See how that growth compares with
                    other algorithms:{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Matrix rotation questions" items={FAQS} />
        </Explainer>
    );
}

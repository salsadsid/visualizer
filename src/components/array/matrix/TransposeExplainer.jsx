import Link from "next/link";
import { CodeBlock, Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What is the transpose of a matrix?",
        answer: "The matrix you get by turning every row into a column: the element at row i, column j moves to row j, column i. A rows × cols matrix becomes a cols × rows matrix, and the values on the main diagonal, where i equals j, stay where they are.",
    },
    {
        question: "What is the time complexity of transposing a matrix?",
        answer: "O(rows × cols): every cell is read once and written once. Building a new matrix also costs O(rows × cols) memory. A square matrix can be transposed in place with O(1) extra memory by swapping each pair above and below the diagonal.",
    },
    {
        question: "What is a symmetric matrix?",
        answer: "A square matrix that equals its own transpose, so A[i][j] is always equal to A[j][i]. Distance tables and undirected adjacency matrices are symmetric, which is why transposing them changes nothing.",
    },
    {
        question: "Is transposing the same as rotating?",
        answer: "No. Transposing reflects the matrix across its main diagonal, so the first row becomes the first column read top to bottom. Rotating 90° clockwise makes the first row the last column. The two are related: transpose and then reverse every row, and you have rotated clockwise.",
    },
];

export default function TransposeExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How transposing works">
                <p>
                    Transposing a matrix swaps its rows and columns. Whatever sat in row{" "}
                    <InlineCode>i</InlineCode>, column <InlineCode>j</InlineCode> of{" "}
                    <InlineCode>A</InlineCode> ends up in row <InlineCode>j</InlineCode>, column{" "}
                    <InlineCode>i</InlineCode> of the result, usually written{" "}
                    <InlineCode>Aᵀ</InlineCode>. Picture flipping the grid over its main
                    diagonal, the line from the top-left corner to the bottom-right: the cells on
                    that line stay put and every other cell jumps to the mirror position.
                </p>
                <p>
                    The shape changes too. A matrix with 3 rows and 4 columns becomes one with 4
                    rows and 3 columns, because each of the 4 old columns is now a row. Nothing
                    is lost and nothing is computed: the same 12 values just live at new
                    addresses. In the visualizer, watch the pointer on <InlineCode>A</InlineCode>{" "}
                    move along a row while the pointer on <InlineCode>Aᵀ</InlineCode> moves down
                    a column.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The index formula">
                <p>
                    One rule covers every cell: <InlineCode>B[j][i] = A[i][j]</InlineCode>. Two
                    nested loops visit each cell of <InlineCode>A</InlineCode> in row-major order
                    and copy it to the swapped position in <InlineCode>B</InlineCode>.
                </p>
                <CodeBlock>{`B = new matrix[cols][rows]
for i in 0 .. rows-1:
  for j in 0 .. cols-1:
    B[j][i] = A[i][j]
return B`}</CodeBlock>
                <p>
                    The first line matters more than it looks: <InlineCode>B</InlineCode> must be
                    created with <InlineCode>cols</InlineCode> rows and{" "}
                    <InlineCode>rows</InlineCode> columns, or the very first write outside a
                    square matrix goes out of bounds. The loops do one read and one write per
                    cell, so the whole thing costs <InlineCode>rows × cols</InlineCode> steps,
                    which is exactly what the counters above show.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid">
                <WorkedExample kind="transpose">
                    <p>
                        The first row of <InlineCode>A</InlineCode>, 1 2 3 4, becomes the first
                        column of <InlineCode>Aᵀ</InlineCode>, read top to bottom. The second
                        row, 5 6 7 8, becomes the second column, and 9 10 11 12 becomes the
                        third.
                    </p>
                    <p>
                        Take one cell: 7 sits at <InlineCode>A[1][2]</InlineCode>, so it moves to{" "}
                        <InlineCode>Aᵀ[2][1]</InlineCode>, row 2, column 1. The cells 1, 6 and 11
                        are on the main diagonal, where <InlineCode>i</InlineCode> equals{" "}
                        <InlineCode>j</InlineCode>, and they do not move at all.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Transposing in place">
                <p>
                    A square matrix can be transposed without a second matrix. Every cell above
                    the diagonal has a partner below it, so you swap the pairs:
                </p>
                <CodeBlock>{`for i in 0 .. n-1:
  for j in i+1 .. n-1:
    swap(A[i][j], A[j][i])`}</CodeBlock>
                <p>
                    The inner loop starts at <InlineCode>i + 1</InlineCode> so each pair is
                    swapped exactly once. Start it at 0 instead and every pair is swapped twice,
                    which puts the matrix back the way it was. Non-square matrices cannot use
                    this trick, because a 3 × 4 grid has no room to become 4 × 3 in the same
                    memory, so in practice you build a new one. Python has a one-liner for
                    that: <InlineCode>list(zip(*a))</InlineCode> unpacks the rows and zips them
                    into columns.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Linear algebra.</strong> Dot products,
                        least-squares fits and covariance matrices are all written with a
                        transpose, and a matrix equal to its transpose is called symmetric.
                    </li>
                    <li>
                        <strong className="text-text">Tables and data.</strong> A spreadsheet of
                        records in rows becomes a table of fields in rows, which is what most
                        charting tools want.
                    </li>
                    <li>
                        <strong className="text-text">Speed.</strong> Memory is fastest when read
                        in a straight line. An algorithm that walks columns can transpose once
                        and then walk rows.
                    </li>
                    <li>
                        <strong className="text-text">Interviews.</strong> Transpose Matrix is a
                        warm-up on its own, and it is the first half of rotating a matrix in
                        place.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Allocating the wrong shape.</strong> Making
                        the result <InlineCode>rows × cols</InlineCode> works on a square and
                        crashes on anything else.
                    </li>
                    <li>
                        <strong className="text-text">Swapping every pair twice.</strong> In the
                        in-place version the inner loop must start at{" "}
                        <InlineCode>i + 1</InlineCode>, not 0.
                    </li>
                    <li>
                        <strong className="text-text">Confusing it with rotation.</strong> A
                        transpose reflects; a rotation turns. Compare the two on the{" "}
                        <Link
                            href="/data-structures/arrays/matrix/rotate"
                            className="text-accent hover:text-accent-hover font-medium"
                        >
                            rotate page
                        </Link>{" "}
                        with the same grid.
                    </li>
                </ul>
                <p>
                    Every operation on these pages costs one step per cell. See how that growth
                    compares with other algorithms:{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Matrix transpose questions" items={FAQS} />
        </Explainer>
    );
}

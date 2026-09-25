import Link from "next/link";
import { CodeBlock, Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { MULTIPLY_A, MULTIPLY_B, WorkedExample } from "./parts";

const FAQS = [
    {
        question: "How do you multiply two matrices step by step?",
        answer: "For each cell of the result, take the matching row of the first matrix and the matching column of the second, multiply them pair by pair and add the products. C[i][j] uses row i of A and column j of B. Repeat for every row and column, which is three nested loops.",
    },
    {
        question: "When can two matrices be multiplied?",
        answer: "Only when the first matrix has as many columns as the second has rows. An n × m matrix times an m × p matrix gives an n × p matrix. If the inner sizes differ there is no row-times-column pairing, and the product is undefined.",
    },
    {
        question: "Is matrix multiplication commutative?",
        answer: "No. A × B and B × A are usually different, and one of them may not even exist because of the size rule. Even for two square matrices of the same size the two products normally differ.",
    },
    {
        question: "What is the time complexity of matrix multiplication?",
        answer: "The three-loop method costs n × m × p multiplications, which is O(n³) for square matrices. Strassen's algorithm brings that down to about O(n^2.81) and research algorithms go lower, but for the sizes met in practice libraries use the three-loop method with clever memory layouts.",
    },
];

export default function MultiplyExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How matrix multiplication works">
                <p>
                    Multiplying two matrices is not multiplying matching cells. Each cell of the
                    result comes from a whole row of the first matrix and a whole column of the
                    second: pair the row entries with the column entries, multiply each pair,
                    and add the products. That sum is called a dot product, and{" "}
                    <InlineCode>C[i][j]</InlineCode> is the dot product of row{" "}
                    <InlineCode>i</InlineCode> of <InlineCode>A</InlineCode> with column{" "}
                    <InlineCode>j</InlineCode> of <InlineCode>B</InlineCode>.
                </p>
                <p>
                    That is why the sizes must line up. A row of <InlineCode>A</InlineCode> has
                    as many entries as <InlineCode>A</InlineCode> has columns, and a column of{" "}
                    <InlineCode>B</InlineCode> has as many entries as <InlineCode>B</InlineCode>{" "}
                    has rows; the pairs only match when those two numbers are equal. An{" "}
                    <InlineCode>n × m</InlineCode> matrix times an <InlineCode>m × p</InlineCode>{" "}
                    matrix gives an <InlineCode>n × p</InlineCode> result. The visualizer bands
                    the current row of <InlineCode>A</InlineCode> and column of{" "}
                    <InlineCode>B</InlineCode> so you can see each pairing as the sum grows.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The three loops">
                <p>
                    Two loops pick the result cell, and a third walks along the row and down the
                    column, accumulating the sum:
                </p>
                <CodeBlock>{`C = new matrix[n][p]
for i in 0 .. n-1:
  for j in 0 .. p-1:
    sum = 0
    for k in 0 .. m-1:
      sum += A[i][k] * B[k][j]
    C[i][j] = sum
return C`}</CodeBlock>
                <p>
                    The index <InlineCode>k</InlineCode> is the one that moves along both
                    matrices at once: it is the column index in <InlineCode>A</InlineCode> and
                    the row index in <InlineCode>B</InlineCode>. Every result cell costs{" "}
                    <InlineCode>m</InlineCode> multiplications, and there are{" "}
                    <InlineCode>n × p</InlineCode> cells, so the whole product costs{" "}
                    <InlineCode>n × m × p</InlineCode> multiplications, the number the counter
                    above reaches.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: 2 × 3 times 3 × 2">
                <WorkedExample kind="multiply" a={MULTIPLY_A} b={MULTIPLY_B}>
                    <p>
                        <InlineCode>A</InlineCode> has 2 rows of 3 and <InlineCode>B</InlineCode>{" "}
                        has 3 rows of 2, so the inner sizes match and the result is 2 × 2. The
                        top-left cell pairs row 1 2 3 with column 1 3 5:{" "}
                        <InlineCode>1×1 + 2×3 + 3×5 = 22</InlineCode>.
                    </p>
                    <p>
                        The cell next to it uses the same row with the second column, 2 4 6:{" "}
                        <InlineCode>1×2 + 2×4 + 3×6 = 28</InlineCode>. The bottom row of{" "}
                        <InlineCode>A</InlineCode>, 4 5 6, gives 49 and 64 the same way. Twelve
                        multiplications in all, three per cell.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Why the order matters">
                <p>
                    <InlineCode>A × B</InlineCode> and <InlineCode>B × A</InlineCode> are
                    different products. With the example above, <InlineCode>B × A</InlineCode>{" "}
                    pairs the 2-entry rows of <InlineCode>B</InlineCode> with the 2-entry
                    columns of <InlineCode>A</InlineCode> and gives a 3 × 3 result, not a 2 × 2
                    one. Even for two square matrices of the same size the two products are
                    normally different, which is unlike the numbers you are used to.
                </p>
                <p>
                    The cost also depends on how you group a chain of products. Multiplying{" "}
                    <InlineCode>(A × B) × C</InlineCode> can be many times cheaper or dearer
                    than <InlineCode>A × (B × C)</InlineCode>, and choosing the best order is
                    the classic dynamic-programming problem called matrix chain multiplication.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Graphics.</strong> Every move, scale,
                        rotation and camera projection in 2D and 3D graphics is a matrix
                        product applied to points.
                    </li>
                    <li>
                        <strong className="text-text">Machine learning.</strong> A layer of a
                        neural network multiplies its inputs by a weight matrix; training and
                        inference are mostly this loop, run on GPUs.
                    </li>
                    <li>
                        <strong className="text-text">Graphs.</strong> Multiplying an adjacency
                        matrix by itself counts the two-step paths between every pair of nodes.
                    </li>
                    <li>
                        <strong className="text-text">Fast recurrences.</strong> The n-th
                        Fibonacci number is a power of a 2 × 2 matrix, computed in O(log n)
                        multiplications.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Multiplying cell by cell.</strong>{" "}
                        <InlineCode>A[i][j] × B[i][j]</InlineCode> is a different operation,
                        the element-wise product. It needs equal shapes and is not what
                        matrix multiplication means.
                    </li>
                    <li>
                        <strong className="text-text">Writing B[j][k].</strong> The inner index{" "}
                        <InlineCode>k</InlineCode> is the row of <InlineCode>B</InlineCode>, so
                        the factor is <InlineCode>B[k][j]</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">Not resetting the sum.</strong>{" "}
                        <InlineCode>sum = 0</InlineCode> belongs inside the{" "}
                        <InlineCode>j</InlineCode> loop, before the <InlineCode>k</InlineCode>{" "}
                        loop, or each cell inherits the previous total.
                    </li>
                    <li>
                        <strong className="text-text">Assuming A × B = B × A.</strong> It almost
                        never is, and one of them may not exist.
                    </li>
                </ul>
                <p>
                    Three nested loops make this the first O(n³) algorithm most people meet. See
                    how that growth compares with the others:{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Matrix multiplication questions" items={FAQS} />
        </Explainer>
    );
}

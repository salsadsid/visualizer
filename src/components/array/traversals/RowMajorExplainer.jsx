import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Sequence, WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What does row-major order mean?",
        answer: "It means the cells of a 2D array are visited, or stored, one whole row at a time: all of row 0 from left to right, then all of row 1, and so on. The row index changes slowly and the column index changes quickly.",
    },
    {
        question: "Which languages store 2D arrays in row-major order?",
        answer: "C, C++, Java, C#, JavaScript arrays of arrays, Python lists of lists and NumPy's default layout all keep each row's values next to each other in memory. Fortran, MATLAB, R and Julia use column-major order instead.",
    },
    {
        question: "Why is row-major traversal faster than column-major on most data?",
        answer: "Because the values of a row sit next to each other in memory, and a processor fetches memory in chunks called cache lines. Walking along a row uses every value in each chunk. Walking down a column touches one value per chunk and throws the rest away, which can be several times slower on a large grid.",
    },
    {
        question: "How many steps does a row-major traversal take?",
        answer: "One per cell: rows × columns. On a 3 × 4 grid that is 12 steps, and doubling both dimensions quadruples the work, which is written O(rows × cols).",
    },
];

export default function RowMajorExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How row-major traversal works">
                <p>
                    Read this paragraph. Your eyes go left to right along a line, jump back to
                    the start of the next line, and carry on. That is row-major order. The
                    outer loop picks a row, the inner loop walks across it, and when the row
                    runs out you drop down to the next one.
                </p>
                <p>
                    It is the first traversal everyone learns, and it deserves to be, because
                    it matches how most programming languages store a 2D array: row 0&apos;s
                    values sit next to each other in memory, then row 1&apos;s, then row 2&apos;s.
                    Visiting the grid in this order means visiting memory in a straight line.
                </p>
                <p>
                    All it needs from the grid is a rectangle: every row the same length. In
                    the visualizer, <InlineCode>i</InlineCode> is the current row and{" "}
                    <InlineCode>j</InlineCode> the current column, and the row and column
                    headers light up as they move.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    Two nested loops. The outer one runs <InlineCode>i</InlineCode> from{" "}
                    <InlineCode>0</InlineCode> to <InlineCode>rows − 1</InlineCode>; the inner
                    one runs <InlineCode>j</InlineCode> from <InlineCode>0</InlineCode> to{" "}
                    <InlineCode>cols − 1</InlineCode>. Whatever you want to do with a cell goes
                    inside the inner loop, where both indices are known.
                </p>
                <p>
                    Notice which index changes fastest. <InlineCode>j</InlineCode> ticks on
                    every step; <InlineCode>i</InlineCode> only changes when{" "}
                    <InlineCode>j</InlineCode> has run out. That &ldquo;inner index moves fastest&rdquo;
                    rule is the whole difference between row-major and column-major order.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid">
                <WorkedExample kind="row-major">
                    <p>
                        Number the cells 1 to 12 the way they are written, and row-major order
                        simply reads them back in the same order:
                    </p>
                    <Sequence kind="row-major" />
                    <p>
                        Row 0 gives 4 steps, row 1 gives 4 more, row 2 the last 4. Twelve
                        cells, twelve steps, and the Visited counter above ends on 12. Press
                        play on the visualizer with the default grid to see exactly this.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Printing a grid.</strong> One row per
                        line is row-major order with a newline after the inner loop.
                    </li>
                    <li>
                        <strong className="text-text">Summing, searching, counting.</strong>{" "}
                        Any &ldquo;look at every cell&rdquo; job defaults to this order.
                    </li>
                    <li>
                        <strong className="text-text">Images.</strong> A photo is a grid of
                        pixels stored row by row; image filters walk it in this order.
                    </li>
                    <li>
                        <strong className="text-text">Flattening.</strong> The cell{" "}
                        <InlineCode>[i][j]</InlineCode> lands at position{" "}
                        <InlineCode>i × cols + j</InlineCode> in a 1D array. The visit number on
                        each cell above is exactly that position plus one.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Mixing up the indices.</strong>{" "}
                        <InlineCode>a[i][j]</InlineCode> is row <InlineCode>i</InlineCode>,
                        column <InlineCode>j</InlineCode>. Writing <InlineCode>a[j][i]</InlineCode>{" "}
                        silently transposes the grid, or crashes when it is not square.
                    </li>
                    <li>
                        <strong className="text-text">Using the wrong length.</strong> The
                        outer loop goes to <InlineCode>a.length</InlineCode> (rows), the inner
                        to <InlineCode>a[i].length</InlineCode> (columns). On a 3 × 4 grid the
                        two are different.
                    </li>
                    <li>
                        <strong className="text-text">Off by one.</strong> Indices start at 0,
                        so the last column is <InlineCode>cols − 1</InlineCode>. A loop that
                        runs to <InlineCode>cols</InlineCode> reads past the end.
                    </li>
                </ul>
                <p>
                    Next, swap the loops and watch what changes:{" "}
                    <Link
                        href="/data-structures/arrays/traversal/column-major"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Column-major traversal →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Row-major questions" items={FAQS} />
        </Explainer>
    );
}

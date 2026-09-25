import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Sequence, WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What is the difference between row-major and column-major order?",
        answer: "Row-major walks across one row at a time, so the column index changes fastest. Column-major walks down one column at a time, so the row index changes fastest. In code it is the same two loops with the outer and inner loop swapped.",
    },
    {
        question: "Which languages use column-major order?",
        answer: "Fortran, MATLAB, R and Julia store 2D arrays column by column. NumPy can do either: the default is row-major (order=\"C\"), and order=\"F\" gives column-major. Knowing which one your data uses tells you which loop order will be fast.",
    },
    {
        question: "Is column-major traversal slower?",
        answer: "It depends on how the grid is stored, not on the traversal itself. Walking down a column of a row-major array jumps through memory and wastes cache; walking down a column of a column-major array is a straight line. The loop that matches the storage order wins.",
    },
    {
        question: "When would I choose column-major traversal on purpose?",
        answer: "Whenever the question is about columns: the total of each column, the tallest bar in each column of a chart, or checking every column of a puzzle grid for a repeated value. The inner loop then finishes one column before the outer loop moves on.",
    },
];

export default function ColumnMajorExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How column-major traversal works">
                <p>
                    Picture a spreadsheet where you need the total of every column. You would
                    not read it line by line. You would run your finger down column A, write
                    the total, then down column B, and so on. That is column-major order:
                    finish one whole column before moving one step to the right.
                </p>
                <p>
                    The surprising part is how little changes in the code. Take the two
                    nested loops of{" "}
                    <Link
                        href="/data-structures/arrays/traversal/row-major"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        row-major traversal
                    </Link>{" "}
                    and swap them: the outer loop now picks a column{" "}
                    <InlineCode>j</InlineCode>, the inner loop walks the rows{" "}
                    <InlineCode>i</InlineCode>. Inside, you still read{" "}
                    <InlineCode>a[i][j]</InlineCode>, row first, column second. Only the order
                    of the loops moved.
                </p>
                <p>
                    Watch the headers in the visualizer: the column header stays lit while
                    the row header runs down, exactly the opposite of the row-major page.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    Outer loop: <InlineCode>j</InlineCode> from <InlineCode>0</InlineCode> to{" "}
                    <InlineCode>cols − 1</InlineCode>. Inner loop: <InlineCode>i</InlineCode>{" "}
                    from <InlineCode>0</InlineCode> to <InlineCode>rows − 1</InlineCode>. The
                    inner index is now the row, so <InlineCode>i</InlineCode> changes on every
                    step and <InlineCode>j</InlineCode> only when a column is used up.
                </p>
                <p>
                    A common trap: people swap the loops <em>and</em> swap the indices inside,
                    writing <InlineCode>a[j][i]</InlineCode>. That undoes the change on a square
                    grid and crashes on a rectangular one. Swap the loops, keep the access.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: a 3 × 4 grid">
                <WorkedExample kind="column-major">
                    <p>
                        With the cells numbered 1 to 12 in reading order, column-major order
                        picks every fourth number, then starts again one place to the right:
                    </p>
                    <Sequence kind="column-major" />
                    <p>
                        Column 0 gives 1, 5, 9; column 1 gives 2, 6, 10; and so on. Four
                        columns of three cells is still 12 steps. The total work is the same
                        as row-major, only the order differs.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Column totals and column checks.</strong>{" "}
                        Sudoku columns, the sum of each column of a table, the maximum in
                        each column of a chart.
                    </li>
                    <li>
                        <strong className="text-text">Transposing.</strong> Reading a grid
                        column by column and writing row by row is a transpose.
                    </li>
                    <li>
                        <strong className="text-text">Fortran, MATLAB, R and Julia.</strong>{" "}
                        Their arrays are stored this way, so their fast loops go down
                        columns, the reverse of C and Python.
                    </li>
                    <li>
                        <strong className="text-text">NumPy.</strong>{" "}
                        <InlineCode>np.array(x, order=&quot;F&quot;)</InlineCode> lays the data out
                        column-major to match those libraries.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Swapping the access too.</strong> The
                        loops swap; <InlineCode>a[i][j]</InlineCode> does not.
                    </li>
                    <li>
                        <strong className="text-text">Taking the column count from the wrong
                        place.</strong> The number of columns is <InlineCode>a[0].length</InlineCode>,
                        the length of one row, not <InlineCode>a.length</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">Expecting it to be as fast.</strong> On a
                        row-major array, a large grid walked column by column can be several
                        times slower. If speed matters, match the storage order.
                    </li>
                </ul>
                <p>
                    Both orders jump back to the start of each line. Next, a path that never
                    jumps:{" "}
                    <Link
                        href="/data-structures/arrays/traversal/snake"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Snake traversal →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Column-major questions" items={FAQS} />
        </Explainer>
    );
}

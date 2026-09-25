import Link from "next/link";
import TrackedLink from "@/components/analytics/TrackedLink";
import { siteConfig } from "@/lib/site";
import {
    CodeBlock,
    Explainer,
    ExplainerSection,
    Faq,
    InlineCode,
} from "@/components/learn/Explainer";

const FAQS = [
    {
        question: "What is the difference between a 1D array and a 2D array?",
        answer: "A 1D array is a single line of values, and one index is enough to find any of them. A 2D array is a grid, so every value needs two indexes: one for its row and one for its column. You can paste either kind into the visualizer; a 1D array is shown as a single row.",
    },
    {
        question: "Is a matrix the same thing as a 2D array?",
        answer: "In programming, almost always yes. Matrix is the math word for a rectangular grid of numbers, and a 2D array is how you store one in code. A 2D array is a little more relaxed: it can hold text or true and false values, and its rows do not have to be the same length.",
    },
    {
        question: "Why do the row and column numbers start at 0?",
        answer: "An index tells the computer how far to move from the start. The first row is zero steps away from the start, so it is row 0. It feels odd for about a week and then becomes automatic. It also means the last row is always the number of rows minus one.",
    },
    {
        question: "Can the rows of a 2D array have different lengths?",
        answer: "In Python, JavaScript, Java and C++ vectors, yes. Each row is its own list, so nothing forces them to match. These are called jagged or ragged arrays. The visualizer draws a dotted placeholder where a shorter row ends so you can see the gap straight away.",
    },
    {
        question: "How do I visualize a 2D array from my C++ or Python program?",
        answer: "From Python, print the list and paste it as it is: single quotes and True, False and None are understood. From C++ or Java, either swap the curly braces for square brackets, or print the values with spaces between them, one row per line, which the input box reads directly. Judge-style input with a size line on top works too.",
    },
    {
        question: "Is the 2D array visualizer free?",
        answer: "Yes. It is free and open source under the MIT license, it needs no account, and it runs entirely in your browser, so the data you paste never leaves your computer.",
    },
];

export default function ArraysExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="What is a 2D array?">
                <p>
                    Think of a cinema. One number is not enough to find your seat. You need a
                    row <em>and</em> a seat number. A{" "}
                    <strong className="text-text">2D array</strong> is that seating plan in
                    code: values laid out in rows and columns, where every value has a
                    two-part address.
                </p>
                <p>
                    Under the hood it is simply an array whose items are arrays. Each inner
                    array is one row of the grid, which is why you write it with two sets of
                    square brackets.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Reading matrix[row][col]">
                <p>
                    The first index picks the row. The second index picks the column inside
                    that row. Counting starts at 0, so{" "}
                    <InlineCode>matrix[1][2]</InlineCode> means the second row, third column.
                </p>
                <CodeBlock>{`[[5, 8, 2],
 [7, 1, 9]]

matrix[0][1] → 8
matrix[1][2] → 9`}</CodeBlock>
                <p>
                    Try it above: switch on <strong className="text-text">Show indices</strong>{" "}
                    and hover any cell to see its address. Row first, then column. Mixing
                    the two up is the mistake everyone makes exactly once.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Visiting every cell">
                <p>
                    To touch every value you need two loops. The outer loop walks down the
                    rows, and the inner loop walks across the columns of the current row.
                    Count the steps on a grid with 3 rows and 4 columns: 4 steps for the
                    first row, 4 for the second, 4 for the third. That is 12 steps for 12
                    cells.
                </p>
                <p>
                    So the work grows with the number of cells. For a grid with{" "}
                    <InlineCode>r</InlineCode> rows and <InlineCode>c</InlineCode> columns,
                    visiting everything takes <InlineCode>r × c</InlineCode> steps, which is
                    written <InlineCode>O(r · c)</InlineCode>. Reading or changing a single
                    cell is different: you jump straight to its address, one step, no matter
                    how big the grid is. Watch the loops run on the{" "}
                    <Link
                        href="/data-structures/arrays/traversal"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        traversal pages
                    </Link>
                    : row by row, down the columns, in a spiral or along the diagonals. New to
                    this notation?{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        The Big-O Playground starts from zero →
                    </Link>
                </p>
            </ExplainerSection>

            <ExplainerSection title="How a grid sits in memory">
                <p>
                    Computer memory is one long line, not a grid. In C and C++ a 2D array is
                    stored row by row: all of row 0, then all of row 1, and so on. This is
                    called <strong className="text-text">row-major order</strong>, and it
                    explains a classic tip. Walking a grid row by row is usually faster than
                    walking it column by column, because the next value you need is sitting
                    right beside the one you just read.
                </p>
                <p>
                    In Python and JavaScript each row is its own separate list, and the outer
                    array just points to them. That is why rows there can have different
                    lengths, and why the bug below exists.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Common beginner mistakes">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Swapping row and column.</strong>{" "}
                        <InlineCode>matrix[col][row]</InlineCode> works on a square grid and
                        then crashes on a rectangular one.
                    </li>
                    <li>
                        <strong className="text-text">Going one past the end.</strong> With 3
                        rows the valid row numbers are 0, 1 and 2. The last row is always{" "}
                        <InlineCode>rows - 1</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">The shared-row bug.</strong> In Python,{" "}
                        <InlineCode>[[0] * 3] * 3</InlineCode> builds one row and points to it
                        three times, so changing one cell changes a whole column.
                        JavaScript&apos;s <InlineCode>fill</InlineCode> does the same. The
                        Code tab above shows the safe way to build a grid.
                    </li>
                    <li>
                        <strong className="text-text">
                            Assuming every row is the same length.
                        </strong>{" "}
                        Always loop to the length of the current row, not the first one.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="How to use this visualizer">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        Paste a grid in square-bracket form, like{" "}
                        <InlineCode>[[1, 0], [0, 1]]</InlineCode>, or start from a preset such
                        as the chess board.
                    </li>
                    <li>
                        A plain 1D array such as <InlineCode>[3, 1, 4]</InlineCode> works too.
                        It is drawn as a single row.
                    </li>
                    <li>
                        Other formats are read as well: rows of values separated by spaces,
                        commas or tabs, one row per line (with an optional first line giving
                        the size, the way judge input does), Python lists with single quotes
                        and <InlineCode>True</InlineCode> / <InlineCode>False</InlineCode> /{" "}
                        <InlineCode>None</InlineCode>, and a stray trailing comma. The badge
                        above the input shows how your text was understood.
                    </li>
                    <li>
                        Cells can hold numbers, text in quotes, <InlineCode>true</InlineCode>,{" "}
                        <InlineCode>false</InlineCode> or <InlineCode>null</InlineCode>.
                    </li>
                    <li>
                        Give each value its own color to make patterns jump out: walls and
                        paths in a maze, the 1s in an adjacency matrix, or the pieces on a
                        board.
                    </li>
                    <li>Rows of different lengths are padded so you can see where they end.</li>
                </ul>
                <p>
                    <strong className="text-text">Share a grid with your class.</strong> Press{" "}
                    <strong className="text-text">Copy link</strong> above the input to get a
                    link that opens this exact grid, with your colours and index labels. Put
                    it in a slide, a worksheet or a group chat and everyone sees the same
                    thing. The grid travels inside the link itself, so nothing is stored on a
                    server.
                </p>
                <p>
                    Teaching with this tool?{" "}
                    <TrackedLink
                        external
                        event="feedback_click"
                        params={{ from: "arrays_explainer" }}
                        href={siteConfig.feedbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent hover:text-accent-hover"
                    >
                        Tell me what would help your class →
                    </TrackedLink>
                </p>
            </ExplainerSection>

            <Faq items={FAQS} />
        </Explainer>
    );
}

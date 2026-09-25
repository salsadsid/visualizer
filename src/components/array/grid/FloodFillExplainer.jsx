import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What is flood fill?",
        answer: "An algorithm that starts at one cell of a grid and spreads to every cell connected to it that has the same value, changing them all. It is what the paint bucket does in an image editor, and it is a plain graph search where each cell is joined to its four neighbours.",
    },
    {
        question: "Should I use BFS or DFS for flood fill?",
        answer: "Both fill exactly the same cells, only in a different order. Recursive DFS is the shortest code. BFS with a queue is safer on large regions, because a recursive fill goes one call deeper for every cell in a long path and can overflow the stack: Python's default limit is 1000 calls, which a 32 × 32 open region already exceeds.",
    },
    {
        question: "Why does LeetCode 733 fail when the new colour equals the old one?",
        answer: "Most solutions mark a cell as done by painting it the new colour, then keep spreading into neighbours that still have the old colour. If old and new are the same, a painted cell still looks unvisited, so the search loops forever. The fix is one line: if the colours are equal, return immediately. The visualizer keeps a separate filled set, so it never has that problem.",
    },
    {
        question: "Does flood fill spread diagonally?",
        answer: "Not by default. The usual version is 4-connected: up, down, left, right. An 8-connected fill adds the four diagonals and can leak through gaps where two regions touch only at a corner, which is why paint tools use 4-connectivity.",
    },
];

export default function FloodFillExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How flood fill works">
                <p>
                    Pick the paint bucket, click inside a shape, and the whole shape changes
                    colour but nothing outside it does. The tool has to answer one question for
                    every pixel: is this pixel connected to where I clicked, through pixels of
                    the same colour? Flood fill is that question turned into a loop.
                </p>
                <p>
                    Start from the clicked cell and remember its value. Look at its four
                    neighbours. Any neighbour with the same value that has not been filled yet
                    gets filled and becomes a new place to look from. Keep going until there is
                    nowhere left to look. Cells with a different value act as walls, and so do
                    the edges of the grid.
                </p>
                <p>
                    The only bookkeeping is a way to remember which cells still need their
                    neighbours checked. Put them in a queue and you have{" "}
                    <strong className="text-text">breadth-first search</strong>: the fill
                    spreads out in rings. Let recursion remember them on the call stack and
                    you have <strong className="text-text">depth-first search</strong>: the
                    fill runs down one path as far as it can before backing up. Switch between
                    the two above and watch the same region fill in two different orders.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    BFS: <InlineCode>queue = [start]</InlineCode>. While the queue is not
                    empty, take the front cell, fill it, and push every neighbour that is
                    inside the grid, has the old value and is not filled yet. The check
                    happens when a cell is pushed, so no cell enters the queue twice.
                </p>
                <p>
                    DFS: a function <InlineCode>fill(r, c)</InlineCode> that returns at once if
                    the cell is outside the grid, has a different value or is already filled,
                    and otherwise fills the cell and calls itself on the four neighbours. The
                    call stack shown above is exactly the chain of cells the recursion is
                    inside at that moment, and its depth is what can overflow on big regions.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: the region of 2s">
                <WorkedExample
                    kind="flood-fill"
                    options={{ variant: "bfs" }}
                    label="The flood fill example grid after filling from row 2, column 5: the twelve connected cells with value 2 are filled and numbered in visit order"
                >
                    <p>
                        The example grid has three values. Start at row 2, column 5, which
                        holds a 2. BFS fills the twelve 2s that are connected to it and
                        numbers them in the order they were taken from the queue. The 0s and 1s
                        next to them are never touched, and neither are the two 2s in the
                        top-right corner: they touch the region only at a corner, and corners
                        do not count.
                    </p>
                    <p>
                        Twelve cells, twelve fills. Each fill also looked at four neighbours, so
                        the work is a small constant times the region size.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Image editors.</strong> The paint bucket,
                        the magic-wand selection and the &ldquo;remove background&rdquo; tool are all flood
                        fills, usually with a tolerance instead of an exact match.
                    </li>
                    <li>
                        <strong className="text-text">Games.</strong> Revealing an empty area in
                        Minesweeper, finding captured territory in Go, and clearing connected
                        blocks in puzzle games.
                    </li>
                    <li>
                        <strong className="text-text">Counting regions.</strong>{" "}
                        <Link
                            href="/algorithms/grid/number-of-islands"
                            className="text-accent hover:text-accent-hover font-medium"
                        >
                            Number of islands
                        </Link>{" "}
                        is a flood fill run from every unvisited land cell, with a counter.
                    </li>
                    <li>
                        <strong className="text-text">Interviews.</strong> LeetCode 733, Flood
                        Fill, is this exact function with a new colour as the value to write.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Comparing with the new value.</strong>{" "}
                        Save the start cell&apos;s value first and compare neighbours with that saved
                        value, not with whatever the start cell holds after you painted it.
                    </li>
                    <li>
                        <strong className="text-text">Filling the same cell twice.</strong>{" "}
                        Without a filled check, BFS pushes cells repeatedly and DFS never ends.
                        Painting in place is the usual trick, which is why equal old and new
                        colours need a guard.
                    </li>
                    <li>
                        <strong className="text-text">Checking bounds after reading.</strong>{" "}
                        Test that <InlineCode>r</InlineCode> and <InlineCode>c</InlineCode> are
                        inside the grid before touching <InlineCode>grid[r][c]</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">Trusting recursion on big inputs.</strong>{" "}
                        A recursive fill on a large open region can overflow the call stack.
                        Use the queue version, or an explicit stack, when the grid is big.
                    </li>
                </ul>
                <p>
                    Next, run a fill from every patch of land and count them:{" "}
                    <Link
                        href="/algorithms/grid/number-of-islands"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Number of islands →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Flood fill questions" items={FAQS} />
        </Explainer>
    );
}

import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { WorkedExample } from "./parts";

const FAQS = [
    {
        question: "What counts as one island?",
        answer: "A group of land cells (1s) where you can walk from any cell to any other by moving up, down, left or right through land. Two land cells that touch only at a corner are in different islands, because the standard problem is 4-connected. If your problem allows diagonal moves, add the four diagonal neighbours to the search.",
    },
    {
        question: "Why does the DFS change the grid?",
        answer: "It turns each visited 1 into a 0, sinking the island, so the outer scan never counts the same island twice. It is a compact way to remember what has been visited, but it destroys the input. If you need the grid afterwards, keep a separate visited set or copy the grid first. The visualizer keeps the grid and uses a visited set.",
    },
    {
        question: "Is it faster with BFS, DFS or union-find?",
        answer: "All three are O(rows × cols): every cell is looked at a constant number of times. DFS is the shortest code, BFS avoids deep recursion on large islands, and union-find shines when land is added over time and the count has to be updated after each change, as in LeetCode 305.",
    },
    {
        question: "How is this different from flood fill?",
        answer: "It is flood fill in a loop. Flood fill spreads from one cell you choose. Number of islands scans every cell in row-major order and, whenever it meets land nobody has visited, runs a flood fill from there and adds one to the count.",
    },
];

export default function IslandsExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How number of islands works">
                <p>
                    Look at a map where 1 is land and 0 is water and count the islands. Your
                    eyes do it in one glance. A program cannot glance, so it does something
                    more careful: it walks the map cell by cell, and each time it steps onto
                    land it has never seen, it says &ldquo;new island&rdquo;, then explores that whole
                    island so it will not be counted again.
                </p>
                <p>
                    The exploring step is exactly{" "}
                    <Link
                        href="/algorithms/grid/flood-fill"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        flood fill
                    </Link>
                    . From the new land cell, visit every connected land cell through up, down,
                    left and right moves, and mark each one. The classic trick is to mark by
                    sinking: turn the 1 into a 0. Then the outer scan, which only reacts to 1s,
                    walks straight past the rest of that island.
                </p>
                <p>
                    In the visualizer every island gets its own colour and its number as a
                    badge, and the strip shows the call stack of the recursive{" "}
                    <InlineCode>sink</InlineCode> function as it explores.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    Two nested loops walk the grid in{" "}
                    <Link
                        href="/data-structures/arrays/traversal/row-major"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        row-major order
                    </Link>
                    . Inside, one <InlineCode>if</InlineCode>: is this cell land that has not
                    been visited? If so, <InlineCode>count += 1</InlineCode> and call{" "}
                    <InlineCode>sink(r, c)</InlineCode>.
                </p>
                <p>
                    <InlineCode>sink</InlineCode> returns immediately for anything outside the
                    grid, any water, and any land already visited. Otherwise it marks the cell
                    and calls itself on the four neighbours. The order of those four calls
                    changes the visit order but never the count.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: three islands">
                <WorkedExample
                    kind="number-of-islands"
                    label="The example grid after counting: a two-by-two island numbered 1 in the top-left, a single cell numbered 2 in the middle, and two cells numbered 3 in the bottom-right"
                >
                    <p>
                        This is the second example from LeetCode 200. The scan meets land at
                        row 0, column 0 and sinks a square of four cells: island 1. It passes
                        the rest of that square without stopping, meets a lone 1 at row 2,
                        column 2: island 2. The two 1s in the bottom-right corner become island
                        3. Seven land cells, three islands.
                    </p>
                    <p>
                        Notice that island 2 touches island 1 only at a corner. Corners do not
                        connect, so they stay separate.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Connected components.</strong> The same
                        scan-and-fill counts blobs in an image, rooms in a floor plan, or
                        clusters of pixels above a threshold.
                    </li>
                    <li>
                        <strong className="text-text">Games.</strong> Groups of stones in Go,
                        territories on a strategy map, and matching blocks in tile games.
                    </li>
                    <li>
                        <strong className="text-text">Interviews.</strong> LeetCode 200 is one
                        of the most asked grid questions, with variants that ask for the largest
                        island (695), the number of enclosed regions, or counting as land is
                        added (305).
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Counting every land cell.</strong> The
                        count goes up only when the scan finds land that has not been visited.
                        The flood fill is what stops the rest of the island from counting.
                    </li>
                    <li>
                        <strong className="text-text">Including diagonals.</strong> Unless the
                        problem says so, only the four side neighbours connect. Diagonal moves
                        merge islands that should be separate.
                    </li>
                    <li>
                        <strong className="text-text">Forgetting that sinking destroys the
                        input.</strong> Fine in an interview, surprising in real code. Copy the
                        grid or keep a visited set.
                    </li>
                    <li>
                        <strong className="text-text">Deep recursion on a big island.</strong> A
                        1000 × 1000 grid of all land is one island a million cells deep. Use BFS
                        or an explicit stack there.
                    </li>
                </ul>
                <p>
                    Next, search a grid for the fewest steps instead of the most cells:{" "}
                    <Link
                        href="/algorithms/grid/shortest-path"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        BFS shortest path →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="Number of islands questions" items={FAQS} />
        </Explainer>
    );
}

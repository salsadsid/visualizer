import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { WorkedExample, finalState } from "./parts";

const FAQS = [
    {
        question: "Why does BFS find the shortest path?",
        answer: "Because it explores in rings. It finishes every cell at distance 1 before touching any cell at distance 2, and so on. So the first time the target is reached, it is reached from a cell one ring closer, and no shorter route can exist. This only holds when every step costs the same, which is true on a plain grid.",
    },
    {
        question: "Why not DFS for the shortest path?",
        answer: "DFS commits to one direction and follows it as far as it can, so the first route it finds is usually a long detour. It can tell you whether a path exists, but not the shortest one, unless you try every path, which is far slower.",
    },
    {
        question: "How do I get the actual path, not just its length?",
        answer: "Record a parent for each cell when you discover it: the cell you came from. When the target is reached, follow the parents back to the start and reverse the list. Distances alone are enough for the length; parents are what give you the route.",
    },
    {
        question: "What if the moves have different costs, or diagonals are allowed?",
        answer: "Diagonal moves are fine as long as every move costs the same: add the four diagonal neighbours. LeetCode 1091 is that version and counts cells rather than moves. Different costs, such as mud that takes three steps, break BFS; that is where Dijkstra's algorithm comes in.",
    },
];

export default function ShortestPathExplainer() {
    const { last } = finalState("shortest-path");
    return (
        <Explainer>
            <ExplainerSection title="How BFS shortest path works">
                <p>
                    Drop a stone in a pond and watch the ripple. It reaches every point one
                    metre away before any point two metres away. Breadth-first search moves
                    through a maze the same way: first every cell one step from the start,
                    then every cell two steps away, ring after ring, until one of the rings
                    touches the target. The number of the ring is the shortest distance.
                </p>
                <p>
                    The ripple is kept in a queue. Take the front cell, look at its four
                    neighbours, and any neighbour that is open, inside the grid and not seen
                    yet gets a distance one bigger than the current cell, a note of which cell
                    it came from, and a place at the back of the queue. Because cells join the
                    queue in distance order, they also leave it in distance order.
                </p>
                <p>
                    That note, the <strong className="text-text">parent</strong>, is what
                    turns a distance into a route. When the target is reached, follow the
                    parents backwards to the start and you have walked the shortest path in
                    reverse. The visualizer shows it being traced one cell at a time.
                </p>
            </ExplainerSection>

            <ExplainerSection title="The loop shape">
                <p>
                    <InlineCode>dist[start] = 0</InlineCode>, <InlineCode>queue = [start]</InlineCode>.
                    While the queue is not empty, pop the front cell and, for each open
                    neighbour that has no distance yet, set its distance and parent and push
                    it. If that neighbour is the target, stop: its distance is final the moment
                    it is discovered, because everything discovered later is at least as far.
                </p>
                <p>
                    If the queue empties first, the target is walled off and there is no path.
                    Note the badge on every cell above: it is the distance from the start, and
                    the badges grow outward like the rings of the ripple.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: the maze">
                <WorkedExample
                    kind="shortest-path"
                    label={`The example maze after the search: walls dark, explored cells numbered by distance, and the shortest path of ${last.stats.distance} steps from the top-left corner to the bottom-right corner highlighted`}
                >
                    <p>
                        The example maze is 8 rows by 10 columns with walls in the way. From the
                        top-left corner the search discovers cells ring by ring, and the target
                        in the bottom-right corner is found at distance{" "}
                        <InlineCode>{last.stats.distance}</InlineCode>. Every explored cell shows
                        its distance; the path traced back through the parents is highlighted.
                    </p>
                    <p>
                        The search visited {last.stats.visited} cells to find a path of{" "}
                        {last.stats.distance} steps. That is the price of a guarantee: BFS
                        cannot know which way the target lies, so it looks in every direction
                        equally.
                    </p>
                </WorkedExample>
            </ExplainerSection>

            <ExplainerSection title="Where you'll meet it">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Games and robots.</strong> Moving a unit
                        across a tile map, a robot vacuum planning around furniture, or a
                        puzzle solver on a grid all start with grid BFS.
                    </li>
                    <li>
                        <strong className="text-text">Multi-source BFS.</strong> Start the queue
                        with several cells at once and you get the nearest-source distance for
                        every cell: LeetCode 994, Rotting Oranges, and 542, 01 Matrix.
                    </li>
                    <li>
                        <strong className="text-text">Beyond grids.</strong> The same loop finds
                        the fewest hops between two people in a social network or the fewest
                        edits between two words: any graph where every edge costs the same.
                    </li>
                    <li>
                        <strong className="text-text">Interviews.</strong> Shortest path in a
                        binary matrix (1091, with diagonals), escaping a maze, and word ladders
                        are all this algorithm.
                    </li>
                </ul>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Marking cells when they leave the queue
                        instead of when they enter.</strong> A cell can then be pushed several
                        times, which is slow and, worse, can give it a wrong distance.
                    </li>
                    <li>
                        <strong className="text-text">Using DFS and hoping.</strong> The first
                        path DFS finds is rarely the shortest.
                    </li>
                    <li>
                        <strong className="text-text">Using a stack by accident.</strong> In
                        JavaScript, <InlineCode>pop()</InlineCode> takes from the end, which turns
                        the search into DFS. Take from the front with a real queue, or an index
                        that moves forward.
                    </li>
                    <li>
                        <strong className="text-text">Forgetting the no-path case.</strong> When
                        the queue empties, return something that says &ldquo;unreachable&rdquo; rather than
                        a distance.
                    </li>
                </ul>
                <p>
                    Every grid search here visited each cell at most once. See how that growth
                    compares with other algorithms:{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq title="BFS shortest path questions" items={FAQS} />
        </Explainer>
    );
}

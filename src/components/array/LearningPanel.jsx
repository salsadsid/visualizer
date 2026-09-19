import LearningTabs, { CodeTabs } from "@/components/algorithms/LearningTabs";
import { LANGUAGES, SNIPPETS } from "@/lib/array/snippets";

function Concept() {
    return (
        <div className="space-y-3 text-sm leading-relaxed text-muted">
            <p>
                A <strong className="text-text">2D array</strong> is an array of arrays:
                a grid of <code className="font-mono text-accent">rows × cols</code> cells
                accessed by two indices, <code className="font-mono text-accent">matrix[row][col]</code>.
            </p>
            <p>
                In memory, most languages store 2D arrays in <em>row-major</em> order:
                row 0 first, then row 1, and so on. That&apos;s why iterating row-by-row is
                cache-friendly and usually faster than column-by-column.
            </p>
            <div className="surface-muted rounded-lg p-3 font-mono text-xs">
                <div className="text-subtle">{"// shape: 3 × 3"}</div>
                <div>{"[[1, 0, 0], [0, 1, 0], [0, 0, 1]]"}</div>
                <div className="text-subtle mt-1">{"// matrix[1][2] → 0"}</div>
            </div>
        </div>
    );
}

function Uses() {
    const items = [
        { icon: "🎯", title: "Game boards", body: "Chess, tic-tac-toe, minesweeper, Conway's Game of Life." },
        { icon: "🖼️", title: "Images", body: "Pixels are a 2D grid of (R, G, B) values. Convolutions slide over them." },
        { icon: "🗺️", title: "Grids & maps", body: "Pathfinding (BFS/DFS/A*), flood-fill, tile-based maps." },
        { icon: "📊", title: "Matrices", body: "Adjacency matrices, linear algebra, DP tables (LCS, knapsack)." },
    ];
    return (
        <div className="grid sm:grid-cols-2 gap-3">
            {items.map((item) => (
                <div key={item.title} className="surface-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
            ))}
        </div>
    );
}

function Complexity() {
    const rows = [
        { op: "Access matrix[i][j]", time: "O(1)", note: "Direct index lookup" },
        { op: "Update matrix[i][j]", time: "O(1)", note: "Same as access" },
        { op: "Search for a value", time: "O(r · c)", note: "Worst case, scan every cell" },
        { op: "Iterate (row-major)", time: "O(r · c)", note: "Cache-friendly" },
        { op: "Insert / delete row", time: "O(r · c)", note: "Shifts following rows" },
        { op: "Space", time: "O(r · c)", note: "r rows × c cols cells" },
    ];
    return (
        <div className="surface-muted rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                        <th className="text-left px-3 py-2 font-medium">Operation</th>
                        <th className="text-left px-3 py-2 font-medium">Time</th>
                        <th className="text-left px-3 py-2 font-medium hidden sm:table-cell">Note</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className={i !== rows.length - 1 ? "border-b border-token/50" : ""}>
                            <td className="px-3 py-2 font-medium">{r.op}</td>
                            <td className="px-3 py-2 font-mono text-accent">{r.time}</td>
                            <td className="px-3 py-2 text-muted text-sm hidden sm:table-cell">{r.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function LearningPanel() {
    const tabs = [
        { id: "concept", label: "Concept", content: <Concept /> },
        { id: "uses", label: "Use cases", content: <Uses /> },
        { id: "complexity", label: "Complexity", content: <Complexity /> },
        {
            id: "code",
            label: "Code",
            content: <CodeTabs languages={LANGUAGES} groups={SNIPPETS} />,
        },
    ];
    return <LearningTabs heading="Learn 2D Arrays" tabs={tabs} tool="arrays" />;
}

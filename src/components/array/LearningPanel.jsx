"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { LANGUAGES, SNIPPETS } from "@/lib/array/snippets";

const TABS = [
    { id: "concept", label: "Concept" },
    { id: "uses", label: "Use cases" },
    { id: "complexity", label: "Complexity" },
    { id: "code", label: "Code" },
];

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
        { icon: "🎯", title: "Game boards", body: "Chess, tic-tac-toe, minesweeper, Conway&apos;s Game of Life." },
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
                    <p
                        className="text-xs text-muted leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.body }}
                    />
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
                            <td className="px-3 py-2 text-muted text-xs hidden sm:table-cell">{r.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Code() {
    const [lang, setLang] = useState("cpp");
    const snippets = SNIPPETS[lang];

    return (
        <div className="space-y-4">
            <div
                role="tablist"
                aria-label="Language"
                className="inline-flex flex-wrap gap-1 p-1 rounded-lg surface-muted"
            >
                {LANGUAGES.map((l) => (
                    <button
                        key={l.id}
                        type="button"
                        role="tab"
                        aria-selected={lang === l.id}
                        onClick={() => setLang(l.id)}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus-ring",
                            lang === l.id
                                ? "bg-bg-elevated text-text shadow-sm border border-token"
                                : "text-muted hover:text-text"
                        )}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {snippets.map((snippet, i) => (
                <div key={`${lang}-${i}`}>
                    <div className="text-xs text-subtle uppercase tracking-wide mb-1.5">
                        {snippet.title}
                    </div>
                    <pre className="surface-muted rounded-lg p-3 font-mono text-xs overflow-x-auto custom-scrollbar leading-relaxed">
                        {snippet.code}
                    </pre>
                </div>
            ))}
        </div>
    );
}

const PANELS = { concept: Concept, uses: Uses, complexity: Complexity, code: Code };

export default function LearningPanel() {
    const [active, setActive] = useState("concept");
    const ActiveComp = PANELS[active];

    return (
        <section className="surface rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 gap-3">
                <h3 className="text-base font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Learn 2D Arrays
                </h3>
            </div>

            <div className="flex flex-wrap gap-1 mb-4 border-b border-token">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActive(tab.id)}
                        className={cn(
                            "px-3 py-2 text-sm font-medium transition-colors relative -mb-px border-b-2 focus-ring",
                            active === tab.id
                                ? "border-accent text-accent"
                                : "border-transparent text-muted hover:text-text"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[140px]">
                <ActiveComp />
            </div>
        </section>
    );
}

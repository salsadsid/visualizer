"use client";
import { memo } from "react";
import Link from "next/link";
import LearningTabs, { CodeTabs } from "@/components/algorithms/LearningTabs";
import { LANGUAGES } from "@/lib/array/snippets";
import { GRID_ALGORITHMS, GRID_ALGORITHM_LIST } from "@/lib/array/gridAlgorithms";
import { GRID_CODE } from "@/lib/array/gridCode";

function Concept({ kind, basePath }) {
    const others = GRID_ALGORITHM_LIST.filter((a) => a.key !== kind);
    return (
        <div className="space-y-3 text-sm leading-relaxed text-muted">
            <p>
                <strong className="text-text">{GRID_ALGORITHMS[kind].label}</strong>{" "}
                {GRID_ALGORITHMS[kind].lead}
            </p>
            <p>
                All three are the same idea in different clothes: a grid is a graph where every cell
                is joined to its four neighbours, and each algorithm walks that graph while
                remembering which cells it has already seen. Compare with{" "}
                {others.map((a, index) => (
                    <span key={a.key}>
                        {index > 0 && " and "}
                        <Link
                            href={`${basePath}/${a.key}`}
                            className="text-accent hover:text-accent-hover font-medium"
                        >
                            {a.label.toLowerCase()}
                        </Link>
                    </span>
                ))}
                .
            </p>
            <p>
                Each cell is visited at most once and looks at four neighbours, so every one of
                them runs in{" "}
                <Link
                    href="/algorithms/complexity"
                    className="font-mono text-accent hover:text-accent-hover underline decoration-dotted underline-offset-2"
                >
                    O(rows · cols)
                </Link>{" "}
                time. The queue or call stack can grow to that size too.
            </p>
        </div>
    );
}

function Uses() {
    const items = [
        { icon: "🪣", title: "Paint and selection tools", body: "The paint bucket and magic wand in every image editor are flood fill." },
        { icon: "🗺️", title: "Maps and games", body: "Counting regions, revealing empty areas in Minesweeper, and pathfinding for units on a tile map." },
        { icon: "🤖", title: "Robots and mazes", body: "BFS over a grid of free and blocked cells is the simplest planner that guarantees the fewest steps." },
        { icon: "💼", title: "Interviews", body: "Flood fill (733), Number of Islands (200) and grid BFS problems (994, 542, 1091) are asked constantly." },
    ];
    return (
        <div className="grid sm:grid-cols-2 gap-3">
            {items.map((item) => (
                <div key={item.title} className="surface-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
            ))}
        </div>
    );
}

function GridLearn({ kind, basePath }) {
    const tabs = [
        { id: "concept", label: "Concept", content: <Concept kind={kind} basePath={basePath} /> },
        { id: "uses", label: "Use cases", content: <Uses /> },
        {
            id: "code",
            label: "Code",
            content: <CodeTabs languages={LANGUAGES} groups={GRID_CODE[kind]} />,
        },
    ];
    return (
        <LearningTabs
            heading={`Learn ${GRID_ALGORITHMS[kind].label.toLowerCase()}`}
            tabs={tabs}
            tool="grid"
        />
    );
}

export default memo(GridLearn);

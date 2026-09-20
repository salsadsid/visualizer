"use client";
import { memo } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import LearningTabs, { CodeTabs } from "./LearningTabs";
import { LANGUAGES, SORT_CODE } from "@/lib/algorithms/snippets";
import { SORTERS, SORTER_LIST } from "@/lib/algorithms/sorting";
import { sortPageFor } from "@/lib/catalog";
import { useSortingInput } from "./SortingInputProvider";

const CONCEPT_LEAD = {
    bubble: "only ever looks at two neighbours at a time and swaps them when they are the wrong way round, so the largest unsorted value reaches the end on every pass.",
    selection: "scans everything that is still unsorted, remembers where the smallest value is, and swaps it into the next free slot, so it makes at most one swap per pass.",
    insertion: "takes one value at a time and slides it left into a sorted part that grows from the front, shifting the bigger values over to make room.",
};

function Concept({ algo }) {
    const others = SORTER_LIST.filter((sorter) => sorter.key !== algo);
    return (
        <div className="space-y-3 text-sm leading-relaxed text-muted">
            <p>
                <strong className="text-text">{SORTERS[algo].label}</strong>{" "}
                {CONCEPT_LEAD[algo]}
            </p>
            <p>
                Like{" "}
                {others.map((sorter, index) => (
                    <span key={sorter.key}>
                        {index > 0 && " and "}
                        <Link
                            href={sortPageFor(sorter.key).path}
                            className="text-accent hover:text-accent-hover font-medium"
                        >
                            {sorter.label.toLowerCase()}
                        </Link>
                    </span>
                ))}
                , it is a <em>comparison sort</em>: it decides what goes where purely by
                comparing pairs of values.
            </p>
            <p>
                All three are also <strong className="text-text">in-place</strong> (they
                reuse the same array, O(1) extra memory) and simple to reason about. The
                trade-off is speed: each runs in{" "}
                <Link
                    href="/algorithms/complexity"
                    className="font-mono text-accent hover:text-accent-hover underline decoration-dotted underline-offset-2"
                >
                    O(n²)
                </Link>{" "}
                on average, so they shine on small or nearly-sorted inputs rather than huge
                datasets.
            </p>
            <p className="text-sm text-subtle">
                New to this <code className="font-mono">O(…)</code> notation?{" "}
                <Link
                    href="/algorithms/complexity"
                    className="text-accent hover:text-accent-hover font-medium"
                >
                    Start with the Big-O Playground →
                </Link>
            </p>
            <div className="grid sm:grid-cols-2 gap-2 pt-1">
                <div className="surface-muted rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-text mb-0.5">Stable</h3>
                    <p className="text-sm">
                        Keeps equal values in their original relative order. Bubble &amp;
                        insertion are stable; selection is not.
                    </p>
                </div>
                <div className="surface-muted rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-text mb-0.5">In-place</h3>
                    <p className="text-sm">
                        Sorts within the array itself — no second array needed, so memory
                        stays at O(1).
                    </p>
                </div>
            </div>
        </div>
    );
}

function Uses() {
    const items = [
        {
            icon: "🔎",
            title: "Search faster",
            body: "Sorted data unlocks binary search — O(log n) lookups instead of scanning everything.",
        },
        {
            icon: "🏆",
            title: "Rankings & top-K",
            body: "Leaderboards, percentiles, and \"top 10\" lists all start by sorting.",
        },
        {
            icon: "🧹",
            title: "Deduplicate",
            body: "Once sorted, equal items sit next to each other — easy to spot and remove.",
        },
        {
            icon: "🔗",
            title: "Merge & compare",
            body: "Combining datasets or finding overlaps is far simpler on sorted inputs.",
        },
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

function Complexity({ algo }) {
    return (
        <div className="space-y-2">
            <div className="surface-muted rounded-lg overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                            <th className="text-left px-3 py-2 font-medium">Algorithm</th>
                            <th className="text-left px-3 py-2 font-medium">Best</th>
                            <th className="text-left px-3 py-2 font-medium">Average</th>
                            <th className="text-left px-3 py-2 font-medium">Worst</th>
                            <th className="text-left px-3 py-2 font-medium">Space</th>
                            <th className="text-left px-3 py-2 font-medium">Stable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SORTER_LIST.map((row, i) => {
                            const active = row.key === algo;
                            return (
                                <tr
                                    key={row.key}
                                    className={cn(
                                        i !== SORTER_LIST.length - 1 && "border-b border-token/50",
                                        active && "bg-accent-soft"
                                    )}
                                >
                                    <td className={cn("px-3 py-2 font-medium", active && "text-accent")}>
                                        {row.label}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-xs">{row.complexity.best}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{row.complexity.average}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{row.complexity.worst}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{row.complexity.space}</td>
                                    <td className="px-3 py-2 text-xs">{row.complexity.stable}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-subtle">
                n = number of elements. The highlighted row is the sort you&apos;re viewing.
            </p>
            <p className="text-sm text-muted pt-1">
                Want to <em>see</em> these O(n²) curves next to O(n) and O(log n)?{" "}
                <Link
                    href="/algorithms/complexity"
                    className="text-accent hover:text-accent-hover font-medium underline underline-offset-2"
                >
                    Measure them for real in the Big-O Playground →
                </Link>
            </p>
        </div>
    );
}

function SortingLearn({ algo }) {
    const { learnTab, setLearnTab, codeLang, setCodeLang } = useSortingInput();
    const tabs = [
        { id: "concept", label: "Concept", content: <Concept algo={algo} /> },
        { id: "uses", label: "Use cases", content: <Uses /> },
        { id: "complexity", label: "Complexity", content: <Complexity algo={algo} /> },
        {
            id: "code",
            label: "Code",
            content: (
                <CodeTabs
                    languages={LANGUAGES}
                    groups={SORT_CODE[algo]}
                    value={codeLang}
                    onChange={setCodeLang}
                />
            ),
        },
    ];
    return (
        <LearningTabs
            heading={`Learn ${SORTERS[algo].label.toLowerCase()}`}
            tabs={tabs}
            tool="sorting"
            value={learnTab}
            onChange={setLearnTab}
        />
    );
}

export default memo(SortingLearn);

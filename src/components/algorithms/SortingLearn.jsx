"use client";
import Link from "next/link";
import { cn } from "@/lib/cn";
import LearningTabs, { CodeTabs } from "./LearningTabs";
import { LANGUAGES, SORT_CODE } from "@/lib/algorithms/snippets";

function Concept() {
    return (
        <div className="space-y-3 text-sm leading-relaxed text-muted">
            <p>
                <strong className="text-text">Sorting</strong> arranges items into order
                (here, smallest&nbsp;→&nbsp;largest). All three sorts on this page are{" "}
                <em>comparison sorts</em>: they decide what goes where purely by comparing
                pairs of values.
            </p>
            <p>
                They&apos;re also <strong className="text-text">in-place</strong> (they
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
                    <h4 className="text-sm font-semibold text-text mb-0.5">Stable</h4>
                    <p className="text-sm">
                        Keeps equal values in their original relative order. Bubble &amp;
                        insertion are stable; selection is not.
                    </p>
                </div>
                <div className="surface-muted rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-text mb-0.5">In-place</h4>
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
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
            ))}
        </div>
    );
}

const COMPLEXITY = [
    { key: "bubble", name: "Bubble", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes" },
    { key: "selection", name: "Selection", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "No" },
    { key: "insertion", name: "Insertion", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes" },
];

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
                        {COMPLEXITY.map((row, i) => {
                            const active = row.key === algo;
                            return (
                                <tr
                                    key={row.key}
                                    className={cn(
                                        i !== COMPLEXITY.length - 1 && "border-b border-token/50",
                                        active && "bg-accent-soft"
                                    )}
                                >
                                    <td className={cn("px-3 py-2 font-medium", active && "text-accent")}>
                                        {row.name}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-xs">{row.best}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{row.avg}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{row.worst}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{row.space}</td>
                                    <td className="px-3 py-2 text-xs">{row.stable}</td>
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

export default function SortingLearn({ algo }) {
    const tabs = [
        { id: "concept", label: "Concept", content: <Concept /> },
        { id: "uses", label: "Use cases", content: <Uses /> },
        { id: "complexity", label: "Complexity", content: <Complexity algo={algo} /> },
        {
            id: "code",
            label: "Code",
            content: <CodeTabs languages={LANGUAGES} groups={SORT_CODE[algo]} />,
        },
    ];
    return <LearningTabs heading="Learn sorting" tabs={tabs} />;
}

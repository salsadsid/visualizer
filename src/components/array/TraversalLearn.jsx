"use client";
import { memo } from "react";
import Link from "next/link";
import LearningTabs, { CodeTabs } from "@/components/algorithms/LearningTabs";
import { LANGUAGES } from "@/lib/array/snippets";
import { TRAVERSALS, TRAVERSAL_LIST } from "@/lib/array/traversals";
import { TRAVERSAL_CODE } from "@/lib/array/traversalCode";
import { traversalPageFor } from "@/lib/catalog";

function Concept({ kind }) {
    const others = TRAVERSAL_LIST.filter((t) => t.key !== kind);
    return (
        <div className="space-y-3 text-sm leading-relaxed text-muted">
            <p>
                <strong className="text-text">{TRAVERSALS[kind].label} traversal</strong>{" "}
                {TRAVERSALS[kind].lead}
            </p>
            <p>
                A <em>traversal</em> is just a rule for the order in which you visit cells. The
                grid does not change; only the path through it does. Compare it with{" "}
                {others.map((t, index) => (
                    <span key={t.key}>
                        {index > 0 && (index === others.length - 1 ? " and " : ", ")}
                        <Link
                            href={traversalPageFor(t.key).path}
                            className="text-accent hover:text-accent-hover font-medium"
                        >
                            {t.label.toLowerCase()}
                        </Link>
                    </span>
                ))}
                .
            </p>
            <p>
                Every full traversal costs one step per cell, <code className="font-mono">rows × cols</code>,
                which is written{" "}
                <Link
                    href="/algorithms/complexity"
                    className="font-mono text-accent hover:text-accent-hover underline decoration-dotted underline-offset-2"
                >
                    O(rows · cols)
                </Link>
                . Boundary is the exception: it visits only the outer ring.
            </p>
        </div>
    );
}

function Uses() {
    const items = [
        { icon: "🖼️", title: "Images", body: "Pixels are a grid. Filters walk it row by row; JPEG reads blocks along diagonals." },
        { icon: "🧮", title: "DP tables", body: "Dynamic programming fills a table in a fixed order, row-major or diagonal, so each cell's inputs are ready." },
        { icon: "🖨️", title: "Machines", body: "Printers, plotters and 3D printers sweep back and forth in snake order to avoid wasted travel." },
        { icon: "💼", title: "Interviews", body: "Spiral, boundary, diagonal and zigzag prints are classic warm-up questions." },
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

function TraversalLearn({ kind }) {
    const tabs = [
        { id: "concept", label: "Concept", content: <Concept kind={kind} /> },
        { id: "uses", label: "Use cases", content: <Uses /> },
        {
            id: "code",
            label: "Code",
            content: <CodeTabs languages={LANGUAGES} groups={TRAVERSAL_CODE[kind]} />,
        },
    ];
    return (
        <LearningTabs
            heading={`Learn ${TRAVERSALS[kind].label.toLowerCase()} traversal`}
            tabs={tabs}
            tool="traversals"
        />
    );
}

export default memo(TraversalLearn);

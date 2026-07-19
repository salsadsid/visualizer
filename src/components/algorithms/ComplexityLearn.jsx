"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import LearningTabs, { CodeTabs } from "./LearningTabs";
import { LANGUAGES } from "@/lib/algorithms/snippets";
import {
    COMPLEXITY_CLASSES,
    CLASS_BY_ID,
    SCALE_HEADERS,
    SCALE_TABLE,
    COMPLEXITY_CODE,
} from "@/lib/algorithms/complexity";

// The three speeds the learner already stepped through in LoopLab (step ②) — badged
// so the names land on something they've already felt rather than arriving cold.
const COUNTED = new Set(["log", "linear", "quadratic"]);

function Classes() {
    return (
        <div className="grid sm:grid-cols-2 gap-3">
            {COMPLEXITY_CLASSES.map((c) => (
                <div key={c.id} className="surface-muted rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span
                            className="h-3 w-3 rounded-sm shrink-0"
                            style={{ background: c.color }}
                        />
                        <span className="font-mono text-sm font-semibold">{c.big}</span>
                        <span className="text-sm text-muted">· {c.name}</span>
                        {c.bonus && (
                            <span className="ml-auto text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full surface text-subtle">
                                bonus
                            </span>
                        )}
                        {COUNTED.has(c.id) && (
                            <span className="ml-auto text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20 whitespace-nowrap">
                                ✓ you counted this one!
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-medium mb-1.5" style={{ color: c.color }}>
                        {c.mood}
                    </p>
                    <p className="text-base font-medium text-text">{c.tagline}</p>
                    <p className="text-sm text-muted mt-1.5 leading-relaxed">
                        <span className="text-subtle">🧠 </span>
                        {c.analogy}
                    </p>
                    <p className="text-sm text-muted mt-1 leading-relaxed">
                        <span className="text-subtle">⚙️ What the computer does: </span>
                        {c.computer}
                    </p>
                    <p className="text-xs text-subtle mt-2 leading-relaxed">
                        Seen in: {c.seenIn}
                    </p>
                </div>
            ))}
        </div>
    );
}

function Scales() {
    return (
        <div className="space-y-2">
            <div className="surface-muted rounded-lg overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                            <th className="text-left px-3 py-2 font-medium">Class</th>
                            {SCALE_HEADERS.map((h) => (
                                <th key={h} className="text-right px-3 py-2 font-medium whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                            <th className="text-right px-3 py-2 font-medium whitespace-nowrap">
                                Time @ n=1M
                            </th>
                        </tr>
                    </thead>
                    <tbody className="tabular-nums">
                        {SCALE_TABLE.map((row, i) => {
                            const c = CLASS_BY_ID[row.id];
                            return (
                                <tr
                                    key={row.id}
                                    className={i !== SCALE_TABLE.length - 1 ? "border-b border-token/50" : ""}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span
                                                className="h-2 w-2 rounded-sm"
                                                style={{ background: c.color }}
                                            />
                                            <span className="font-mono text-xs">{c.big}</span>
                                        </span>
                                    </td>
                                    {row.ops.map((v, j) => (
                                        <td key={j} className="text-right px-3 py-2 font-mono text-xs">
                                            {v}
                                        </td>
                                    ))}
                                    <td className="text-right px-3 py-2 font-mono text-xs text-muted whitespace-nowrap">
                                        {row.time1M}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-sm text-subtle">
                Steps needed as the input grows. The time column assumes a computer doing
                ~1&nbsp;billion steps per second — notice how O(n²) and O(2ⁿ) fall off a
                cliff while the others barely move.
            </p>
        </div>
    );
}

function CodePanel() {
    const [classId, setClassId] = useState("linear");
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
                {COMPLEXITY_CLASSES.map((c) => (
                    <button
                        key={c.id}
                        type="button"
                        onClick={() => setClassId(c.id)}
                        aria-pressed={classId === c.id}
                        className={cn(
                            "px-2.5 py-1 rounded-md text-xs font-mono border transition-colors focus-ring",
                            classId === c.id
                                ? "bg-accent text-white border-accent"
                                : "surface-muted text-muted border-token hover:text-text"
                        )}
                    >
                        {c.big}
                    </button>
                ))}
            </div>
            <CodeTabs languages={LANGUAGES} groups={COMPLEXITY_CODE[classId]} />
            <p className="text-sm text-subtle">
                The C++ mirrors the classic Module&nbsp;1 examples; the other languages are
                faithful equivalents.
            </p>
        </div>
    );
}

export default function ComplexityLearn() {
    const tabs = [
        { id: "classes", label: "Meet the classes", content: <Classes /> },
        { id: "scales", label: "How it scales", content: <Scales /> },
        { id: "code", label: "Code", content: <CodePanel /> },
    ];
    return <LearningTabs heading="The speed classes" tabs={tabs} />;
}

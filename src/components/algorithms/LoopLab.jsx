"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { usePlayer } from "./usePlayer";
import PlayerControls from "./PlayerControls";
import Pseudocode from "./Pseudocode";
import Confetti from "./Confetti";
import { LOOP_DEMOS } from "@/lib/algorithms/loopDemos";
import { CLASS_BY_ID } from "@/lib/algorithms/complexity";
import { barClass, pointerClass } from "@/lib/algorithms/roles";

// A row of numbered boxes the current demo walks over. Roles reuse the sorting
// color language: amber = "the computer is here now", emerald = already counted,
// violet = the outer partner in a pair.
function BoxRow({ count, cells, pointers }) {
    const marks = {};
    for (const [name, idx] of Object.entries(pointers || {})) {
        (marks[idx] ||= []).push(name);
    }
    return (
        <div className="overflow-x-auto custom-scrollbar">
            <div className="flex justify-center gap-1.5 sm:gap-2 min-w-max px-1 py-1">
                {Array.from({ length: count }, (_, idx) => {
                    const role = cells?.[idx];
                    return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                            <div
                                className={cn(
                                    "grid place-items-center h-9 w-9 sm:h-11 sm:w-11 rounded-lg text-sm font-mono font-semibold transition-all duration-200",
                                    role
                                        ? cn(barClass(role), "text-white shadow-sm scale-105")
                                        : "surface-muted text-subtle"
                                )}
                            >
                                {idx + 1}
                            </div>
                            <div className="h-4 text-[11px] font-mono font-bold leading-none">
                                {marks[idx] ? (
                                    <span className={pointerClass(marks[idx][0])}>
                                        ▲{marks[idx].join(",")}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function LoopLab() {
    const [demoKey, setDemoKey] = useState("scan");
    const demo = LOOP_DEMOS.find((d) => d.key === demoKey);
    const player = usePlayer(demo.steps);
    const step = player.step;
    const cls = CLASS_BY_ID[demo.classId];

    return (
        <section className="surface rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-base font-semibold">Count the steps — with the computer</h3>
                <p className="text-base text-muted mt-0.5">
                    A <strong className="text-text">step</strong> is one tiny action the
                    computer takes. Press play and count along — this is all Big-O ever
                    measures.
                </p>
            </div>

            {/* demo picker */}
            <div className="flex flex-wrap gap-2 mb-2">
                {LOOP_DEMOS.map((d) => {
                    const c = CLASS_BY_ID[d.classId];
                    const on = d.key === demoKey;
                    return (
                        <button
                            key={d.key}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setDemoKey(d.key)}
                            className={cn(
                                "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all focus-ring hover:scale-105 active:scale-95",
                                on
                                    ? "bg-accent text-white border-accent shadow-md"
                                    : "surface text-muted hover:text-text"
                            )}
                        >
                            {d.label}
                            <span
                                className={cn(
                                    "font-mono text-[11px] px-1.5 py-0.5 rounded",
                                    on ? "bg-white/20" : "surface-muted"
                                )}
                                style={on ? undefined : { color: c.color }}
                            >
                                {d.big}
                            </span>
                        </button>
                    );
                })}
            </div>
            <p className="text-base text-muted mb-4">{demo.blurb}</p>

            <div className="grid lg:grid-cols-[1fr_320px] gap-5">
                <div className="relative rounded-xl border border-token bg-bg-subtle/50 p-4 sm:p-5 space-y-4 overflow-hidden">
                    <Confetti active={player.atEnd} count={30} />
                    <BoxRow
                        count={demo.cellCount}
                        cells={step.cells}
                        pointers={step.pointers}
                    />
                    <p className="text-sm text-subtle text-center leading-relaxed">
                        🟨 where the computer is now · 🟩 already visited · 🟪 the box doing
                        the greeting
                    </p>

                    {/* the star metric + narration */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="surface rounded-xl px-5 py-3 text-center shrink-0 grid place-items-center">
                            <div>
                                <div className="text-2xl font-bold tabular-nums" style={{ color: cls.color }}>
                                    <span key={step.vars.steps} className="inline-block animate-pop">
                                        {step.vars.steps}
                                    </span>
                                </div>
                                <div className="text-[11px] uppercase tracking-wide text-subtle">
                                    steps
                                </div>
                            </div>
                        </div>
                        <div
                            aria-live="polite"
                            className="surface-muted rounded-xl px-4 py-3 flex-1 flex items-center text-base leading-relaxed text-muted"
                        >
                            {step.message}
                        </div>
                    </div>

                    <PlayerControls player={player} />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">The loop</h4>
                        <span className="text-[11px] px-2 py-0.5 rounded surface-muted text-subtle font-mono">
                            {demo.big}
                        </span>
                    </div>
                    <Pseudocode lines={demo.pseudocode} activeLine={step.line} />
                    <p className="text-sm text-subtle leading-relaxed">
                        Try all three — same idea (visit boxes), wildly different step
                        counts. That difference is the whole story of this page.
                    </p>
                </div>
            </div>
        </section>
    );
}

"use client";
import { useEffect, useState } from "react";
import { SORTERS } from "@/lib/algorithms/sorting";
import { barClass } from "@/lib/algorithms/roles";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

// Deterministic start (SSR-safe). Reshuffling happens only after mount.
const START = [40, 18, 62, 30, 52, 12, 46, 24, 58, 34];
const buildSteps = (algo, arr) => SORTERS[algo].run(arr).steps;

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// A perpetually looping sort demo for the home hero and the sorting overview cards.
export default function HeroDemo({ algo = "bubble", compact = false, paused }) {
    const reduced = usePrefersReducedMotion();
    const [choice, setChoice] = useState(null);
    const [steps, setSteps] = useState(() => buildSteps(algo, START));
    const [idx, setIdx] = useState(0);

    const controlled = paused !== undefined;
    const isPaused = controlled ? paused : (choice ?? reduced);

    useEffect(() => {
        if (isPaused) return;
        const atEnd = idx >= steps.length - 1;
        const t = setTimeout(
            () => {
                if (atEnd) {
                    setSteps(buildSteps(algo, shuffle(START)));
                    setIdx(0);
                } else {
                    setIdx((i) => i + 1);
                }
            },
            atEnd ? 1600 : 280
        );
        return () => clearTimeout(t);
    }, [idx, steps, algo, isPaused]);

    const step = steps[idx];
    const max = Math.max(...step.array);
    const done = idx >= steps.length - 1;
    const label = SORTERS[algo].label.replace(" Sort", " sort");

    return (
        <div className="flex flex-col items-center">
            <div
                className={cn(
                    "flex items-end justify-center",
                    compact ? "gap-1 h-24" : "gap-1.5 sm:gap-2 h-36 sm:h-44"
                )}
            >
                {step.array.map((v, i) => {
                    const role = step.highlights[i] || "default";
                    return (
                        <div
                            key={i}
                            className={cn(
                                "rounded-t-md shadow-sm transition-[height] duration-300 ease-out motion-reduce:transition-none",
                                compact ? "w-3" : "w-4 sm:w-6",
                                barClass(role)
                            )}
                            style={{ height: `${(v / max) * 100}%` }}
                        />
                    );
                })}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-muted">
                <span
                    className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        done || isPaused ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                    )}
                />
                {isPaused
                    ? `${label}, paused`
                    : done
                      ? "Sorted — reshuffling…"
                      : `${label}, running live`}
                {!controlled && (
                    <button
                        type="button"
                        onClick={() => setChoice(!isPaused)}
                        aria-pressed={isPaused}
                        aria-label="Pause the animation"
                        className="ml-1 px-2 py-0.5 rounded-md border border-token text-muted hover:text-text transition-colors focus-ring"
                    >
                        {isPaused ? "Play" : "Pause"}
                    </button>
                )}
            </div>
        </div>
    );
}

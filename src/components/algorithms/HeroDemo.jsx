"use client";
import { useEffect, useState } from "react";
import { SORTERS } from "@/lib/algorithms/sorting";
import { barClass } from "@/lib/algorithms/roles";
import { cn } from "@/lib/cn";

// Deterministic start (SSR-safe). Reshuffling happens only after mount.
const START = [40, 18, 62, 30, 52, 12, 46, 24, 58, 34];
const buildSteps = (arr) => SORTERS.bubble.run(arr).steps;

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// A controls-free, perpetually looping bubble-sort demo for the home hero.
export default function HeroDemo() {
    const [steps, setSteps] = useState(() => buildSteps(START));
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const atEnd = idx >= steps.length - 1;
        const t = setTimeout(
            () => {
                if (atEnd) {
                    setSteps(buildSteps(shuffle(START)));
                    setIdx(0);
                } else {
                    setIdx((i) => i + 1);
                }
            },
            atEnd ? 1600 : 280
        );
        return () => clearTimeout(t);
    }, [idx, steps]);

    const step = steps[idx];
    const max = Math.max(...step.array);
    const done = idx >= steps.length - 1;

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-36 sm:h-44">
                {step.array.map((v, i) => {
                    const role = step.highlights[i] || "default";
                    return (
                        <div
                            key={i}
                            className={cn(
                                "w-4 sm:w-6 rounded-t-md shadow-sm transition-[height] duration-300 ease-out motion-reduce:transition-none",
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
                        done ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                    )}
                />
                {done ? "Sorted — reshuffling…" : "Bubble sort, running live"}
            </div>
        </div>
    );
}

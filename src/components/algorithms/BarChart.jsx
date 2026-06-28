"use client";
import { cn } from "@/lib/cn";
import { barClass, pointerClass } from "@/lib/algorithms/roles";

export default function BarChart({ array, highlights = {}, pointers = {}, done = false }) {
    const max = Math.max(1, ...array);
    const showLabels = array.length <= 20;
    const pointerEntries = Object.entries(pointers);
    const showPointers = showLabels && pointerEntries.length > 0;

    return (
        <div className="relative">
            {done && (
                <div className="pointer-events-none absolute inset-x-0 top-2 z-10 grid place-items-center">
                    <div className="animate-fade-in-up motion-reduce:animate-none rounded-full bg-emerald-500 text-white text-sm font-semibold px-4 py-1.5 shadow-lg">
                        Sorted! 🎉
                    </div>
                </div>
            )}

            <div
                className="flex items-end gap-1 sm:gap-1.5 h-52 sm:h-64"
                role="img"
                aria-label="Array values shown as a bar chart"
            >
                {array.map((v, i) => {
                    const role = highlights[i] || "default";
                    const pct = (v / max) * 100;
                    return (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 rounded-t-md shadow-sm transition-[height,background-color] duration-300 ease-out motion-reduce:transition-none",
                                barClass(role)
                            )}
                            style={{ height: `${Math.max(pct, 4)}%` }}
                            title={`index ${i} = ${v}`}
                        />
                    );
                })}
            </div>

            {showLabels && (
                <div className="flex gap-1 sm:gap-1.5 mt-1.5">
                    {array.map((v, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 text-center text-[10px] sm:text-xs font-mono tabular-nums",
                                highlights[i] && highlights[i] !== "sorted"
                                    ? "text-text font-semibold"
                                    : "text-subtle"
                            )}
                        >
                            {v}
                        </div>
                    ))}
                </div>
            )}

            {showPointers && (
                <div className="flex gap-1 sm:gap-1.5 mt-1 min-h-[2.25rem] items-start">
                    {array.map((_, i) => {
                        const names = pointerEntries
                            .filter(([, idx]) => idx === i)
                            .map(([name]) => name);
                        return (
                            <div
                                key={i}
                                className="flex-1 flex flex-col items-center gap-0.5"
                            >
                                {names.map((name) => (
                                    <span
                                        key={name}
                                        className={cn(
                                            "flex flex-col items-center leading-none font-mono font-bold text-[10px] sm:text-xs",
                                            pointerClass(name)
                                        )}
                                    >
                                        <span aria-hidden="true">▲</span>
                                        <span>{name}</span>
                                    </span>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

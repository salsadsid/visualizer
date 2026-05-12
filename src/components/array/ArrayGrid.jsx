"use client";
import { cn } from "@/lib/cn";
import { PAD_TOKEN, cellKey, displayValue } from "@/lib/array/parser";

const EmptyState = () => (
    <div className="text-center space-y-3 max-w-xs">
        <div className="mx-auto w-14 h-14 rounded-xl grid place-items-center bg-accent-soft border border-accent/20">
            <svg
                className="w-7 h-7 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
            </svg>
        </div>
        <h3 className="text-base font-semibold">Ready to visualize</h3>
        <p className="text-sm text-muted">
            Paste a 2D array on the left or pick a preset to see it rendered as a grid.
        </p>
    </div>
);

export default function ArrayGrid({ matrix, maxLen, colors, showIndices }) {
    const hasData = matrix.length > 0 && matrix.some((r) => r.length > 0);

    return (
        <div className="surface rounded-2xl p-6 md:p-8 h-full grid place-items-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

            <div className="relative w-full h-full overflow-auto grid place-items-center custom-scrollbar">
                {!hasData ? (
                    <EmptyState />
                ) : (
                    <div className="animate-fade-in-up">
                        {showIndices && (
                            <div
                                className="grid gap-2 mb-2"
                                style={{
                                    gridTemplateColumns: `2rem repeat(${maxLen}, minmax(0, 1fr))`,
                                }}
                            >
                                <div />
                                {Array.from({ length: maxLen }).map((_, j) => (
                                    <div
                                        key={j}
                                        className="w-12 md:w-16 text-center text-xs font-mono text-subtle"
                                    >
                                        {j}
                                    </div>
                                ))}
                            </div>
                        )}

                        {matrix.map((row, i) => (
                            <div
                                key={i}
                                className="grid gap-2 mb-2 last:mb-0"
                                style={{
                                    gridTemplateColumns: showIndices
                                        ? `2rem repeat(${maxLen}, minmax(0, 1fr))`
                                        : `repeat(${maxLen}, minmax(0, 1fr))`,
                                }}
                            >
                                {showIndices && (
                                    <div className="w-8 grid place-items-center text-xs font-mono text-subtle">
                                        {i}
                                    </div>
                                )}
                                {row.map((cell, j) => {
                                    const key = cellKey(cell);
                                    const isPad = cell === PAD_TOKEN;
                                    const bg = !isPad ? colors[key] : undefined;
                                    const customText = colors.__text;

                                    return (
                                        <div
                                            key={`${i}-${j}`}
                                            className={cn(
                                                "w-12 h-12 md:w-16 md:h-16 grid place-items-center text-base md:text-lg font-semibold rounded-xl shadow-sm transition-all duration-200 hover:scale-105 hover:z-10 cursor-default",
                                                !bg && !isPad && "bg-bg-muted text-text border border-token",
                                                isPad && "bg-transparent text-subtle/40 border border-dashed border-token"
                                            )}
                                            style={{
                                                backgroundColor: bg,
                                                borderColor: !isPad && colors.__border ? colors.__border : undefined,
                                                borderWidth: !isPad && colors.__border ? "2px" : undefined,
                                                color: !isPad ? (customText || (bg ? "#fff" : undefined)) : undefined,
                                                textShadow: bg ? "0 1px 2px rgba(0,0,0,0.25)" : "none",
                                                boxShadow: bg ? `0 6px 16px -6px ${bg}` : undefined,
                                            }}
                                            title={`[${i}][${j}] = ${displayValue(cell)}`}
                                        >
                                            {displayValue(cell)}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

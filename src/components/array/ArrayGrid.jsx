"use client";
import { cn } from "@/lib/cn";
import { PAD_TOKEN, cellKey, displayValue } from "@/lib/array/parser";
import { roleCell } from "@/lib/array/gridRoles";

const cellSize = (cols) => Math.min(48, Math.max(28, Math.floor(320 / cols)));

const fontClass = (cols) =>
    cols > 8 ? "text-xs md:text-lg" : cols > 6 ? "text-sm md:text-lg" : "text-base md:text-lg";

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
        <h2 className="text-base font-semibold">Ready to visualize</h2>
        <p className="text-sm text-muted">
            Paste a 2D array on the left or pick a preset to see it rendered as a grid.
        </p>
    </div>
);

export default function ArrayGrid({
    matrix,
    maxLen,
    colors = {},
    showIndices = false,
    cells,
    order,
    pointers,
    fill = true,
}) {
    const hasData = matrix.length > 0 && matrix.some((r) => r.length > 0);
    const gap = maxLen > 8 ? "gap-1 mb-1" : "gap-2 mb-2";
    const columns = showIndices
        ? `2rem repeat(${maxLen}, minmax(0, 1fr))`
        : `repeat(${maxLen}, minmax(0, 1fr))`;

    return (
        <div
            className={cn(
                "surface rounded-2xl p-6 md:p-8 grid place-items-center relative overflow-hidden shadow-sm",
                fill ? "h-full" : "min-h-56"
            )}
        >
            <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

            <div
                className={cn(
                    "relative w-full overflow-auto grid place-items-center custom-scrollbar",
                    fill && "h-full"
                )}
            >
                {!hasData ? (
                    <EmptyState />
                ) : (
                    <div className="animate-fade-in-up" style={{ "--cell": `${cellSize(maxLen)}px` }}>
                        {showIndices && (
                            <div className={cn("grid", gap)} style={{ gridTemplateColumns: columns }}>
                                <div />
                                {Array.from({ length: maxLen }).map((_, j) => (
                                    <div
                                        key={j}
                                        className={cn(
                                            "w-(--cell) md:w-16 text-center text-xs font-mono transition-colors",
                                            pointers?.j === j ? "text-accent font-bold" : "text-subtle"
                                        )}
                                    >
                                        {j}
                                    </div>
                                ))}
                            </div>
                        )}

                        {matrix.map((row, i) => (
                            <div
                                key={i}
                                className={cn("grid last:mb-0", gap)}
                                style={{ gridTemplateColumns: columns }}
                            >
                                {showIndices && (
                                    <div
                                        className={cn(
                                            "w-8 grid place-items-center text-xs font-mono transition-colors",
                                            pointers?.i === i ? "text-accent font-bold" : "text-subtle"
                                        )}
                                    >
                                        {i}
                                    </div>
                                )}
                                {row.map((cell, j) => {
                                    const key = cellKey(cell);
                                    const isPad = cell === PAD_TOKEN;
                                    const roleClass = roleCell(cells?.[`${i},${j}`]);
                                    const rank = order?.[`${i},${j}`];
                                    const bg = !isPad && !roleClass ? colors[key] : undefined;
                                    const customText = colors.__text;

                                    return (
                                        <div
                                            key={`${i}-${j}`}
                                            className={cn(
                                                "relative w-(--cell) h-(--cell) md:w-16 md:h-16 grid place-items-center font-semibold rounded-xl shadow-sm transition-all duration-200 hover:scale-105 hover:z-10 cursor-default",
                                                fontClass(maxLen),
                                                roleClass,
                                                !roleClass && !bg && !isPad && "bg-bg-muted text-text border border-token",
                                                isPad && "bg-transparent text-subtle/40 border border-dashed border-token"
                                            )}
                                            style={
                                                roleClass
                                                    ? undefined
                                                    : {
                                                          backgroundColor: bg,
                                                          borderColor: !isPad && colors.__border ? colors.__border : undefined,
                                                          borderWidth: !isPad && colors.__border ? "2px" : undefined,
                                                          color: !isPad ? (customText || (bg ? "#fff" : undefined)) : undefined,
                                                          textShadow: bg ? "0 1px 2px rgba(0,0,0,0.25)" : "none",
                                                          boxShadow: bg ? `0 6px 16px -6px ${bg}` : undefined,
                                                      }
                                            }
                                            title={`[${i}][${j}] = ${displayValue(cell)}${rank ? ` · visited #${rank}` : ""}`}
                                        >
                                            {displayValue(cell)}
                                            {rank && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute -top-1.5 -left-1.5 min-w-4 h-4 px-1 rounded-full bg-bg-elevated border border-token text-[10px] font-mono font-medium leading-4 text-text shadow-sm"
                                                >
                                                    {rank}
                                                </span>
                                            )}
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

import { cn } from "@/lib/cn";
import { TRAVERSALS, numberedGrid } from "@/lib/array/traversals";

export function visitSequence(kind, rows = 3, cols = 4) {
    return TRAVERSALS[kind].run(numberedGrid(rows, cols)).steps.at(-1).output;
}

export function OrderPreview({ kind, rows = 3, cols = 4, compact = false }) {
    const grid = numberedGrid(rows, cols);
    const last = TRAVERSALS[kind].run(grid).steps.at(-1);
    return (
        <div
            className={cn("inline-grid", compact ? "gap-1" : "gap-1.5")}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            role="img"
            aria-label={`${TRAVERSALS[kind].label} visit order on a ${rows} by ${cols} grid: ${last.output.join(", ")}`}
        >
            {grid.map((row, i) =>
                row.map((value, j) => {
                    const rank = last.order[`${i},${j}`];
                    return (
                        <div
                            key={`${i}-${j}`}
                            className={cn(
                                "relative grid place-items-center rounded-md font-mono font-semibold",
                                compact ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm",
                                rank ? "bg-emerald-500 text-white" : "bg-bg-muted text-subtle border border-dashed border-token"
                            )}
                        >
                            {value}
                            {rank && (
                                <span className="absolute -top-1 -left-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-bg-elevated border border-token text-[9px] leading-[0.85rem] text-text">
                                    {rank}
                                </span>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}

export function Sequence({ kind, rows = 3, cols = 4 }) {
    return (
        <p className="font-mono text-sm text-text surface-muted rounded-lg px-3 py-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
            {visitSequence(kind, rows, cols).join(" → ")}
        </p>
    );
}

export function WorkedExample({ kind, children }) {
    return (
        <div className="grid sm:grid-cols-[auto_1fr] gap-4 items-start pt-1">
            <OrderPreview kind={kind} />
            <div className="space-y-2 min-w-0">{children}</div>
        </div>
    );
}

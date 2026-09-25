import { cn } from "@/lib/cn";
import { displayValue } from "@/lib/array/parser";
import { roleCell } from "@/lib/array/gridRoles";

export default function GridPreview({ matrix, cells = {}, order = {}, compact = false, label }) {
    const cols = matrix[0]?.length ?? 0;
    return (
        <div
            className={cn("inline-grid", compact ? "gap-1" : "gap-1.5")}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            role="img"
            aria-label={label}
        >
            {matrix.map((row, i) =>
                row.map((value, j) => {
                    const k = `${i},${j}`;
                    const role = roleCell(cells[k]);
                    const rank = order[k];
                    return (
                        <div
                            key={k}
                            className={cn(
                                "relative grid place-items-center rounded-md font-mono font-semibold",
                                compact ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm",
                                role || "bg-bg-muted text-subtle border border-token"
                            )}
                        >
                            {displayValue(value)}
                            {rank != null && (
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

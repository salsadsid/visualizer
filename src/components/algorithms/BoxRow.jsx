"use client";
import { cn } from "@/lib/cn";
import { pointerClass } from "@/lib/algorithms/roles";

export default function BoxRow({
    values,
    cells,
    pointers,
    roleClass,
    showIndices = false,
    label,
    roleLabel,
    ref,
}) {
    const marks = {};
    for (const [name, idx] of Object.entries(pointers || {})) {
        (marks[idx] ||= []).push(name);
    }
    const compact = values.length > 16;
    return (
        <div className="overflow-x-auto custom-scrollbar">
            <div
                ref={ref}
                role={showIndices ? "group" : undefined}
                aria-label={showIndices ? label : undefined}
                className={cn("flex justify-center min-w-max px-1 py-1", compact ? "gap-1" : "gap-1.5 sm:gap-2")}
            >
                {values.map((value, idx) => {
                    const role = cells?.[idx];
                    const empty = value == null;
                    const text = empty ? "empty" : String(value);
                    const title = showIndices
                        ? `a[${idx}] = ${text}${role && roleLabel ? ` · ${roleLabel(role)}` : ""}`
                        : undefined;
                    return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                            {showIndices && (
                                <div className="text-[11px] font-mono text-subtle leading-none">{idx}</div>
                            )}
                            <div
                                title={title}
                                aria-label={title}
                                className={cn(
                                    "grid place-items-center rounded-lg font-mono font-semibold transition-all duration-200",
                                    compact ? "h-8 w-8 text-xs" : "h-9 w-9 sm:h-11 sm:w-11 text-sm",
                                    empty
                                        ? "bg-transparent text-subtle/40 border border-dashed border-token"
                                        : role
                                          ? roleClass(role)
                                          : "surface-muted text-subtle"
                                )}
                            >
                                {empty ? "·" : value}
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

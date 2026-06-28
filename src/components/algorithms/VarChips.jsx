"use client";
import { cn } from "@/lib/cn";

// Renders scalar algorithm variables (e.g. key = 8, swapped = false) as live chips.
export default function VarChips({ vars }) {
    const entries = Object.entries(vars || {}).filter(
        ([, v]) => v !== undefined && v !== null
    );
    if (entries.length === 0) {
        // Keep the row's height stable so the layout doesn't jump between steps.
        return <div className="min-h-[1.75rem]" aria-hidden="true" />;
    }
    return (
        <div className="flex flex-wrap items-center gap-2 min-h-[1.75rem]">
            <span className="text-[10px] uppercase tracking-wide text-subtle">
                Variables
            </span>
            {entries.map(([name, value]) => {
                const isBool = typeof value === "boolean";
                return (
                    <span
                        key={name}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg surface-muted text-xs font-mono"
                    >
                        <span className="text-subtle">{name}</span>
                        <span className="text-subtle/50">=</span>
                        <span
                            className={cn(
                                "font-semibold",
                                isBool
                                    ? value
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-subtle"
                                    : "text-text"
                            )}
                        >
                            {String(value)}
                        </span>
                    </span>
                );
            })}
        </div>
    );
}

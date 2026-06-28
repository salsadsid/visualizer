"use client";
import { cn } from "@/lib/cn";

export default function Pseudocode({ lines, activeLine }) {
    return (
        <div className="surface-muted rounded-xl p-2.5 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto custom-scrollbar">
            {lines.map((line, i) => {
                const active = i === activeLine;
                return (
                    <div
                        key={i}
                        aria-current={active ? "step" : undefined}
                        className={cn(
                            "flex gap-3 rounded-md px-2 py-1 whitespace-pre border-l-2 transition-colors",
                            active
                                ? "bg-accent-soft text-accent font-semibold border-accent"
                                : "text-muted border-transparent"
                        )}
                    >
                        <span
                            className={cn(
                                "select-none w-4 text-right tabular-nums",
                                active ? "text-accent" : "text-subtle/50"
                            )}
                        >
                            {i + 1}
                        </span>
                        <span>{line}</span>
                    </div>
                );
            })}
        </div>
    );
}

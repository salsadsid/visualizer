"use client";

export default function StatsRow({ stats, message }) {
    const items = [
        { label: "Comparisons", value: stats.comparisons },
        { label: "Swaps", value: stats.swaps },
        { label: "Writes", value: stats.writes },
    ];
    return (
        <div className="space-y-3">
            <div
                aria-live="polite"
                className="surface-muted rounded-xl px-4 py-3 min-h-[3.5rem] flex items-center text-sm leading-relaxed text-muted"
            >
                {message}
            </div>
            <div className="grid grid-cols-3 gap-2">
                {items.map((it) => (
                    <div
                        key={it.label}
                        className="surface-muted rounded-xl px-3 py-2 text-center"
                    >
                        <div className="text-lg font-bold tabular-nums text-text">
                            <span key={it.value} className="inline-block animate-pop">
                                {it.value}
                            </span>
                        </div>
                        <div className="text-[10px] uppercase tracking-wide text-subtle">
                            {it.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

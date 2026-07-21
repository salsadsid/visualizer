"use client";

export default function StatsRow({ stats, message }) {
    const items = [
        {
            label: "Comparisons",
            value: stats.comparisons,
            hint: "Times two values were compared",
        },
        {
            label: "Swaps",
            value: stats.swaps,
            hint: "Times two values traded places",
        },
        {
            label: "Writes",
            value: stats.writes,
            hint: "Times a value was written into a slot",
        },
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
                        title={it.hint}
                        className="surface-muted rounded-xl px-3 py-2 text-center"
                    >
                        <div className="text-lg font-bold tabular-nums text-text">
                            <span key={it.value} className="inline-block animate-pop">
                                {it.value}
                            </span>
                        </div>
                        <div className="text-[11px] uppercase tracking-wide text-subtle">
                            {it.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

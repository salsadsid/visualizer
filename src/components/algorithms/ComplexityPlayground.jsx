"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import GrowthChart from "./GrowthChart";
import {
    MEASURABLES,
    CLASS_BY_ID,
    DEFAULT_SELECTION,
    measure,
    sampleNs,
} from "@/lib/algorithms/complexity";

const MIN_MAXN = 16;
const MAX_MAXN = 1000;
const DEFAULT_MAXN = 64;

function Segmented({ options, value, onChange, ariaLabel }) {
    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className="inline-flex p-1 rounded-lg surface-muted"
        >
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    role="tab"
                    aria-selected={value === o.value}
                    onClick={() => onChange(o.value)}
                    className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus-ring",
                        value === o.value
                            ? "bg-accent text-white shadow-sm"
                            : "text-muted hover:text-text"
                    )}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export default function ComplexityPlayground() {
    const [selected, setSelected] = useState(DEFAULT_SELECTION);
    const [metric, setMetric] = useState("ops");
    const [scale, setScale] = useState("linear");
    const [maxN, setMaxN] = useState(DEFAULT_MAXN);
    // Initial measurement runs once here (ops = pure counting, safe in an initializer).
    // Every later measurement runs from an event handler below — never during render.
    const [results, setResults] = useState(() => ({
        series: measure(DEFAULT_SELECTION, DEFAULT_MAXN, "ops"),
        metric: "ops",
    }));

    const run = (keys, m, mx) =>
        setResults({ series: measure(keys, mx, m), metric: m });

    const toggle = (key) => {
        const next = selected.includes(key)
            ? selected.filter((k) => k !== key)
            : [...selected, key];
        setSelected(next);
        run(next, metric, maxN);
    };
    const chooseMetric = (m) => {
        setMetric(m);
        run(selected, m, maxN);
    };
    const commitMaxN = () => run(selected, metric, maxN);

    const ns = sampleNs(maxN);

    return (
        <section className="surface rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
            <div>
                <h3 className="text-base font-semibold">The sandbox — measure it for real</h3>
                <p className="text-base text-muted mt-0.5">
                    You just counted steps by hand. Now let your computer do it{" "}
                    <em>thousands of times</em>: pick loops below, and each one really runs —
                    we count its steps, or time it with the browser&apos;s built-in stopwatch
                    (<code className="font-mono text-accent">performance.now()</code>) — and
                    draw the curve.
                </p>
            </div>

            {/* function chips */}
            <div className="flex flex-wrap gap-2">
                {MEASURABLES.map((m) => {
                    const cls = CLASS_BY_ID[m.classId];
                    const on = selected.includes(m.key);
                    return (
                        <button
                            key={m.key}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(m.key)}
                            className={cn(
                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all focus-ring",
                                on
                                    ? "surface border-strong shadow-sm"
                                    : "surface-muted text-muted border-token hover:text-text opacity-70 hover:opacity-100"
                            )}
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-sm shrink-0"
                                style={{ background: on ? cls.color : "var(--text-subtle)" }}
                            />
                            <span className="font-mono text-[11px] text-subtle">{cls.big}</span>
                            {m.label}
                        </button>
                    );
                })}
            </div>

            {/* controls */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <label className="flex items-center gap-2 text-xs text-subtle uppercase tracking-wide">
                    Measure
                    <Segmented
                        ariaLabel="Metric"
                        value={metric}
                        onChange={chooseMetric}
                        options={[
                            { value: "ops", label: "Steps" },
                            { value: "time", label: "Time (ms)" },
                        ]}
                    />
                </label>
                <label className="flex items-center gap-2 text-xs text-subtle uppercase tracking-wide">
                    Scale
                    <Segmented
                        ariaLabel="Y-axis scale"
                        value={scale}
                        onChange={setScale}
                        options={[
                            { value: "linear", label: "Linear" },
                            { value: "log", label: "Log" },
                        ]}
                    />
                </label>
                <label className="flex items-center gap-3 text-sm text-muted">
                    <span className="whitespace-nowrap text-xs text-subtle uppercase tracking-wide">
                        Max n{" "}
                        <span className="font-mono text-text tabular-nums normal-case">
                            {maxN}
                        </span>
                    </span>
                    <input
                        type="range"
                        min={MIN_MAXN}
                        max={MAX_MAXN}
                        step={8}
                        value={maxN}
                        onChange={(e) => setMaxN(Number(e.target.value))}
                        onMouseUp={commitMaxN}
                        onTouchEnd={commitMaxN}
                        onKeyUp={commitMaxN}
                        aria-label="Maximum input size n"
                        className="w-36 sm:w-48 cursor-pointer accent-[var(--accent)]"
                    />
                </label>
            </div>

            {/* chart */}
            <GrowthChart series={results.series} metric={results.metric} scale={scale} />

            {/* data table */}
            {results.series.length > 0 && (
                <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-accent hover:text-accent-hover focus-ring rounded inline-flex items-center gap-1">
                        <span className="group-open:rotate-90 transition-transform">▸</span>
                        Show the numbers
                    </summary>
                    <div className="mt-3 surface-muted rounded-lg overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                                    <th className="text-left px-3 py-2 font-medium">n</th>
                                    {results.series.map((s) => (
                                        <th key={s.key} className="text-right px-3 py-2 font-medium">
                                            <span className="inline-flex items-center gap-1.5 justify-end">
                                                <span
                                                    className="h-2 w-2 rounded-sm"
                                                    style={{ background: s.color }}
                                                />
                                                <span className="font-mono normal-case">{s.big}</span>
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="font-mono tabular-nums">
                                {ns.map((n, i) => (
                                    <tr
                                        key={n}
                                        className={i !== ns.length - 1 ? "border-b border-token/50" : ""}
                                    >
                                        <td className="text-left px-3 py-1.5 text-subtle">{n}</td>
                                        {results.series.map((s) => {
                                            const p = s.points.find((pt) => pt.n === n);
                                            return (
                                                <td key={s.key} className="text-right px-3 py-1.5">
                                                    {p
                                                        ? results.metric === "time"
                                                            ? p.value.toPrecision(3)
                                                            : p.value.toLocaleString()
                                                        : "—"}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            )}

            <div className="surface-muted rounded-xl px-4 py-3 text-sm text-muted leading-relaxed">
                <span className="font-semibold text-text">🎯 Try this:</span> slide{" "}
                <span className="font-medium">Max n</span> up and watch the red O(n²) curve
                shoot away while the others barely move. Then turn on{" "}
                <span className="font-medium">Recursive Fibonacci</span> — that&apos;s why
                its line stops early (we cap it at n = 30 so your tab survives 💀). Curves
                squashed flat at the bottom? Switch to{" "}
                <span className="font-medium">Log</span> scale to compare them all at once.
                Trying <span className="font-medium">Time (ms)</span>? Slide{" "}
                <span className="font-medium">Max n</span> up high first — tiny loops finish
                too fast to time accurately.
            </div>
        </section>
    );
}

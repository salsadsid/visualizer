"use client";
import { useState } from "react";

// Dependency-free multi-series SVG line chart for growth curves.
// Pure from props (no time/random in render); the only state is the hover index.
//
// props:
//   series  : [{ key, label, big, color, points: [{ n, value }] }]  (color is a CSS var)
//   metric  : "ops" | "time"   — only affects value formatting / axis label
//   scale   : "linear" | "log" — y-axis scale

const W = 660;
const H = 380;
const M = { top: 18, right: 20, bottom: 44, left: 58 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

function compact(v) {
    const a = Math.abs(v);
    if (a === 0) return "0";
    if (a >= 1e9) return (v / 1e9).toFixed(a >= 1e10 ? 0 : 1) + "B";
    if (a >= 1e6) return (v / 1e6).toFixed(a >= 1e7 ? 0 : 1) + "M";
    if (a >= 1e3) return (v / 1e3).toFixed(a >= 1e4 ? 0 : 1) + "k";
    if (a >= 1) return String(Math.round(v));
    return v.toPrecision(2);
}

function fmtValue(v, metric) {
    return metric === "time" ? `${compact(v)} ms` : compact(v);
}

// A "nice" round step (1/2/5 × 10ⁿ) so linear axis ticks land on tidy numbers.
function niceStep(range, count) {
    const raw = range / count || 1;
    const exp = Math.floor(Math.log10(raw));
    const base = Math.pow(10, exp);
    const f = raw / base;
    const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return nf * base;
}

export default function GrowthChart({ series = [], metric = "ops", scale = "linear" }) {
    const [hoverN, setHoverN] = useState(null);

    const allPoints = series.flatMap((s) => s.points);
    if (allPoints.length === 0) {
        return (
            <div className="grid place-items-center h-64 text-sm text-subtle text-center px-6">
                Pick a loop or two above and its growth curve appears here. 📈
            </div>
        );
    }

    const ns = Array.from(new Set(allPoints.map((p) => p.n))).sort((a, b) => a - b);
    const xMin = ns[0];
    const xMax = ns[ns.length - 1];
    const yMaxRaw = Math.max(...allPoints.map((p) => p.value));
    const yMax = yMaxRaw > 0 ? yMaxRaw : 1;
    const positives = allPoints.map((p) => p.value).filter((v) => v > 0);
    const yMinPos = positives.length ? Math.min(...positives) : 1;

    const isLog = scale === "log";
    const lmin = Math.log10(yMinPos);
    const lmax = Math.log10(yMax);
    const logSpan = lmax - lmin || 1;

    // Linear axis: round the top up to a tidy multiple so ticks read cleanly.
    const step = niceStep(yMax, 5);
    const yTop = Math.max(step, Math.ceil(yMax / step) * step);

    const xPix = (n) =>
        M.left + (xMax === xMin ? 0 : (n - xMin) / (xMax - xMin)) * PLOT_W;
    const yUnit = (v) => {
        if (isLog) return (Math.log10(Math.max(v, yMinPos)) - lmin) / logSpan;
        return v / yTop;
    };
    const yPix = (v) => M.top + (1 - yUnit(v)) * PLOT_H;

    // --- ticks ---
    const yTicks = [];
    if (isLog) {
        const lo = Math.floor(lmin);
        const hi = Math.ceil(lmax);
        const stepDec = Math.max(1, Math.ceil((hi - lo) / 6));
        for (let e = lo; e <= hi; e += stepDec) yTicks.push(Math.pow(10, e));
    } else {
        for (let v = 0; v <= yTop + step / 2; v += step) yTicks.push(v);
    }

    const xTickStep = Math.max(1, Math.ceil(ns.length / 7));
    const xTicks = ns.filter((_, i) => i % xTickStep === 0 || i === ns.length - 1);

    const pointsByN = (n) =>
        series
            .map((s) => {
                const p = s.points.find((pt) => pt.n === n);
                return p ? { ...s, value: p.value } : null;
            })
            .filter(Boolean);

    const onMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width) * W;
        let nearest = ns[0];
        let best = Infinity;
        for (const n of ns) {
            const d = Math.abs(xPix(n) - relX);
            if (d < best) {
                best = d;
                nearest = n;
            }
        }
        setHoverN(nearest);
    };

    const hoverPts = hoverN != null ? pointsByN(hoverN) : [];
    const tipW = 150;
    const tipH = 20 + hoverPts.length * 16;
    const hoverX = hoverN != null ? xPix(hoverN) : 0;
    const tipX = hoverX + tipW + 12 > W ? hoverX - tipW - 10 : hoverX + 10;
    const tipY = Math.min(M.top, H - tipH - 4);

    return (
        <div>
            <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[520px]">
                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        width="100%"
                        role="img"
                        aria-label={`Growth curves (${metric === "time" ? "time" : "steps"} vs n, ${scale} scale)`}
                        className="animate-fade-in-up select-none"
                    >
                        {/* gridlines + y ticks */}
                        {yTicks.map((v, i) => {
                            const y = yPix(v);
                            return (
                                <g key={`y${i}`}>
                                    <line
                                        x1={M.left}
                                        x2={W - M.right}
                                        y1={y}
                                        y2={y}
                                        stroke="var(--border)"
                                        strokeWidth={1}
                                    />
                                    <text
                                        x={M.left - 8}
                                        y={y + 3}
                                        textAnchor="end"
                                        className="fill-[var(--text-subtle)]"
                                        fontSize={12}
                                    >
                                        {compact(v)}
                                    </text>
                                </g>
                            );
                        })}

                        {/* x ticks */}
                        {xTicks.map((n, i) => (
                            <text
                                key={`x${i}`}
                                x={xPix(n)}
                                y={H - M.bottom + 18}
                                textAnchor="middle"
                                className="fill-[var(--text-subtle)]"
                                fontSize={12}
                            >
                                {compact(n)}
                            </text>
                        ))}

                        {/* axis titles */}
                        <text
                            x={M.left + PLOT_W / 2}
                            y={H - 6}
                            textAnchor="middle"
                            className="fill-[var(--text-muted)]"
                            fontSize={13}
                        >
                            input size (n)
                        </text>
                        <text
                            transform={`translate(14 ${M.top + PLOT_H / 2}) rotate(-90)`}
                            textAnchor="middle"
                            className="fill-[var(--text-muted)]"
                            fontSize={13}
                        >
                            {metric === "time" ? "time (ms)" : "steps taken"}
                        </text>

                        {/* series lines + markers */}
                        {series.map((s) => {
                            const pts = s.points;
                            if (pts.length === 0) return null;
                            const d = pts
                                .map((p, i) => `${i === 0 ? "M" : "L"}${xPix(p.n)},${yPix(p.value)}`)
                                .join(" ");
                            return (
                                <g key={s.key}>
                                    <path
                                        d={d}
                                        fill="none"
                                        stroke={s.color}
                                        strokeWidth={2.25}
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                    />
                                    {pts.map((p, i) => (
                                        <circle
                                            key={i}
                                            cx={xPix(p.n)}
                                            cy={yPix(p.value)}
                                            r={2.6}
                                            fill={s.color}
                                        />
                                    ))}
                                </g>
                            );
                        })}

                        {/* hover crosshair + tooltip */}
                        {hoverN != null && (
                            <g pointerEvents="none">
                                <line
                                    x1={hoverX}
                                    x2={hoverX}
                                    y1={M.top}
                                    y2={M.top + PLOT_H}
                                    stroke="var(--border-strong)"
                                    strokeWidth={1}
                                    strokeDasharray="3 3"
                                />
                                {hoverPts.map((s) => (
                                    <circle
                                        key={s.key}
                                        cx={hoverX}
                                        cy={yPix(s.value)}
                                        r={4}
                                        fill={s.color}
                                        stroke="var(--bg-elevated)"
                                        strokeWidth={1.5}
                                    />
                                ))}
                                <g transform={`translate(${tipX} ${tipY})`}>
                                    <rect
                                        width={tipW}
                                        height={tipH}
                                        rx={8}
                                        fill="var(--bg-elevated)"
                                        stroke="var(--border-strong)"
                                    />
                                    <text
                                        x={10}
                                        y={15}
                                        className="fill-[var(--text-subtle)]"
                                        fontSize={12}
                                    >
                                        n = {compact(hoverN)}
                                    </text>
                                    {hoverPts.map((s, i) => (
                                        <g key={s.key} transform={`translate(10 ${28 + i * 16})`}>
                                            <rect width={8} height={8} y={-8} rx={2} fill={s.color} />
                                            <text
                                                x={14}
                                                y={0}
                                                className="fill-[var(--text)]"
                                                fontSize={12}
                                            >
                                                {s.big}
                                            </text>
                                            <text
                                                x={tipW - 10}
                                                y={0}
                                                textAnchor="end"
                                                className="fill-[var(--text-muted)]"
                                                fontSize={12}
                                            >
                                                {fmtValue(s.value, metric)}
                                            </text>
                                        </g>
                                    ))}
                                </g>
                            </g>
                        )}

                        {/* transparent hit layer for hover */}
                        <rect
                            x={M.left}
                            y={M.top}
                            width={PLOT_W}
                            height={PLOT_H}
                            fill="transparent"
                            onMouseMove={onMove}
                            onMouseLeave={() => setHoverN(null)}
                        />
                    </svg>
                </div>
            </div>

            {/* legend — always present; color mark carries identity, text stays in ink */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                {series.map((s) => (
                    <span
                        key={s.key}
                        className="inline-flex items-center gap-1.5 text-xs text-muted"
                    >
                        <span
                            className="h-2.5 w-2.5 rounded-sm shrink-0"
                            style={{ background: s.color }}
                        />
                        <span className="font-mono text-[11px] text-subtle">{s.big}</span>
                        {s.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

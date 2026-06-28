"use client";
import { useMemo } from "react";

const COLORS = [
    "#6366f1",
    "#a855f7",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#38bdf8",
];

// A dependency-free confetti burst. Trajectories are derived deterministically from
// each piece's index (pure math — no Math.random), so it satisfies the hooks purity
// rule and is hydration-safe. It only renders once `active` flips true.
export default function Confetti({ active, count = 44 }) {
    const pieces = useMemo(() => {
        if (!active) return [];
        return Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const ring = i % 3;
            const dist = 70 + ring * 48;
            const cx = Math.cos(angle) * dist;
            const cy = Math.sin(angle) * dist + 90; // bias downward
            const cr = ((i * 47) % 720) - 360;
            const dur = (1.0 + ((i * 13) % 7) / 10).toFixed(2);
            const delay = (((i * 7) % 18) / 100).toFixed(2);
            return {
                id: i,
                left: 50 + Math.cos(angle) * 9,
                color: COLORS[i % COLORS.length],
                cx: `${cx.toFixed(0)}px`,
                cy: `${cy.toFixed(0)}px`,
                cr: `${cr}deg`,
                dur: `${dur}s`,
                delay: `${delay}s`,
                round: i % 2 === 0,
            };
        });
    }, [active, count]);

    if (!active) return null;

    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden z-20 motion-reduce:hidden"
            aria-hidden="true"
        >
            {pieces.map((p) => (
                <span
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: `${p.left.toFixed(1)}%`,
                        top: "34%",
                        backgroundColor: p.color,
                        borderRadius: p.round ? "9999px" : "2px",
                        "--cx": p.cx,
                        "--cy": p.cy,
                        "--cr": p.cr,
                        "--dur": p.dur,
                        "--delay": p.delay,
                    }}
                />
            ))}
        </div>
    );
}

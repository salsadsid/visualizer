"use client";
import { useState } from "react";
import HeroDemo from "@/components/algorithms/HeroDemo";
import TrackedLink from "@/components/analytics/TrackedLink";
import { usePrefersReducedMotion } from "@/components/algorithms/usePrefersReducedMotion";
import { SORTER_LIST } from "@/lib/algorithms/sorting";
import { sortPageFor } from "@/lib/catalog";

export default function SortingOverview() {
    const reduced = usePrefersReducedMotion();
    const [choice, setChoice] = useState(null);
    const paused = choice ?? reduced;

    return (
        <section aria-labelledby="pick-a-sort">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2
                    id="pick-a-sort"
                    className="text-xs font-semibold text-subtle uppercase tracking-wider"
                >
                    Pick a sort to step through
                </h2>
                <button
                    type="button"
                    onClick={() => setChoice(!paused)}
                    aria-pressed={paused}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium surface text-muted hover:text-text transition-colors focus-ring"
                >
                    {paused ? "Play demos" : "Pause demos"}
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {SORTER_LIST.map((sorter, index) => {
                    const page = sortPageFor(sorter.key);
                    return (
                        <TrackedLink
                            key={sorter.key}
                            href={page.path}
                            event="tool_open"
                            params={{ tool: "sorting", algo: sorter.key, from: "sorting_overview" }}
                            className="group surface rounded-2xl p-5 shadow-sm min-w-0 hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all focus-ring"
                        >
                            <div aria-hidden="true" className="surface-muted rounded-xl px-3 pt-4 pb-3">
                                <HeroDemo algo={sorter.key} compact paused={paused} />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold flex items-center gap-1.5">
                                <span className="grid place-items-center h-5 w-5 rounded-full bg-accent text-white text-[11px] font-bold">
                                    {index + 1}
                                </span>
                                {sorter.label}
                                <span className="text-accent group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </h3>
                            <p className="text-base text-muted mt-1 leading-relaxed">
                                {sorter.blurb}
                            </p>
                            <dl className="flex flex-wrap gap-1.5 mt-3 text-[11px] font-medium text-subtle">
                                <div className="px-2 py-0.5 rounded surface-muted">
                                    <dt className="inline">Best </dt>
                                    <dd className="inline font-mono">{sorter.complexity.best}</dd>
                                </div>
                                <div className="px-2 py-0.5 rounded surface-muted">
                                    <dt className="inline">Worst </dt>
                                    <dd className="inline font-mono">{sorter.complexity.worst}</dd>
                                </div>
                                <div className="px-2 py-0.5 rounded surface-muted">
                                    <dt className="inline">Stable </dt>
                                    <dd className="inline">{sorter.complexity.stable}</dd>
                                </div>
                            </dl>
                        </TrackedLink>
                    );
                })}
            </div>
        </section>
    );
}

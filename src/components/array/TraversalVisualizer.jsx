"use client";
import { useMemo, useState } from "react";
import ArrayGrid from "@/components/array/ArrayGrid";
import TraversalLearn from "@/components/array/TraversalLearn";
import PlayerControls from "@/components/algorithms/PlayerControls";
import Pseudocode from "@/components/algorithms/Pseudocode";
import SequenceStrip from "@/components/algorithms/SequenceStrip";
import StatsRow from "@/components/algorithms/StatsRow";
import VarChips from "@/components/algorithms/VarChips";
import { usePlayer } from "@/components/algorithms/usePlayer";
import { usePlayerAnalytics } from "@/components/algorithms/usePlayerAnalytics";
import { useStepShortcuts } from "@/components/algorithms/useStepShortcuts";
import TrackedLink from "@/components/analytics/TrackedLink";
import RunCompleteNudge from "@/components/engagement/RunCompleteNudge";
import { useCopyLink } from "@/components/engagement/useCopyLink";
import { useLocationHash } from "@/components/engagement/useLocationHash";
import { TRAVERSALS, TRAVERSAL_LIST, numberedGrid } from "@/lib/array/traversals";
import { displayValue, parseInput } from "@/lib/array/parser";
import { formatMatrix } from "@/lib/array/presets";
import { traversalPageFor } from "@/lib/catalog";
import { decodeGrid, encodeGrid, readStep } from "@/lib/share";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const MAX_ROWS = 8;
const MAX_COLS = 10;
const DEFAULT_GRID = numberedGrid(3, 4);

const LEGEND = [
    { role: "current", swatch: "bg-amber-400", label: "Visiting now" },
    { role: "turn", swatch: "bg-rose-400", label: "New direction" },
    { role: "visited", swatch: "bg-emerald-500", label: "Visited" },
];

const Kbd = ({ children }) => (
    <kbd className="px-1.5 py-0.5 rounded surface-muted border border-token font-mono text-[10px]">
        {children}
    </kbd>
);

function gridFromHash(hash) {
    const shared = decodeGrid(hash);
    if (!shared) return null;
    const trimmed = shared.matrix.slice(0, MAX_ROWS).map((row) => row.slice(0, MAX_COLS));
    const { matrix, maxLen } = parseInput(formatMatrix(trimmed));
    return maxLen > 0 ? matrix : null;
}

export default function TraversalVisualizer({ kind }) {
    const hash = useLocationHash();
    const shared = useMemo(() => gridFromHash(hash), [hash]);
    const [prevHash, setPrevHash] = useState(hash);
    const [matrix, setMatrix] = useState(() => shared ?? DEFAULT_GRID);
    const [sharedStep, setSharedStep] = useState(() => (shared ? readStep(hash) : null));

    if (hash !== prevHash) {
        setPrevHash(hash);
        if (shared) {
            setMatrix(shared);
            setSharedStep(readStep(hash));
        } else {
            setSharedStep(null);
        }
    }

    const traversal = TRAVERSALS[kind];
    const page = traversalPageFor(kind);
    const steps = useMemo(() => traversal.run(matrix).steps, [traversal, matrix]);
    const basePlayer = usePlayer(steps, sharedStep ?? 0);
    const player = usePlayerAnalytics(basePlayer, "traversals", kind);
    const stageRef = useStepShortcuts(player);
    const [copied, copy] = useCopyLink();
    const step = player.step;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const gridHash = useMemo(() => encodeGrid({ matrix }) ?? "", [matrix]);
    const pageUrl = `${siteConfig.url}${page.path}`;

    const resize = (nextRows, nextCols) => {
        track("preset_select", { tool: "traversals", preset: `${nextRows}x${nextCols}` });
        setSharedStep(null);
        setMatrix(numberedGrid(nextRows, nextCols));
    };

    const shareStep = () => {
        track("share_click", { tool: "traversals", algo: kind, from: "player" });
        copy(`${pageUrl}${gridHash}&s=${player.index}`);
    };

    const counters = [
        { label: "Visited", value: step.stats.visited, hint: "Cells visited so far" },
        {
            label: "Remaining",
            short: "Left",
            value: step.stats.total - step.stats.visited,
            hint: "Cells this traversal still has to visit",
        },
        { label: "Total", value: step.stats.total, hint: "Cells this traversal visits in all" },
    ];

    return (
        <>
            <nav aria-label="Traversal order" className="flex flex-wrap justify-center gap-2 mb-3">
                {TRAVERSAL_LIST.map((t) => (
                    <TrackedLink
                        key={t.key}
                        href={`${traversalPageFor(t.key).path}${gridHash}`}
                        scroll={false}
                        event="algo_select"
                        params={{ tool: "traversals", algo: t.key }}
                        aria-current={kind === t.key ? "page" : undefined}
                        className={cn(
                            "px-3 py-1.5 rounded-xl text-sm font-medium border transition-all focus-ring hover:scale-105 active:scale-95",
                            kind === t.key
                                ? "bg-accent text-white border-accent shadow-md"
                                : "surface text-muted hover:text-text"
                        )}
                    >
                        {t.label}
                    </TrackedLink>
                ))}
            </nav>
            <p className="text-center text-base text-muted max-w-2xl mx-auto mb-6">{traversal.blurb}</p>

            <div ref={stageRef} className="grid lg:grid-cols-[1fr_360px] gap-5">
                <div className="space-y-4 min-w-0">
                    <ArrayGrid
                        matrix={matrix}
                        maxLen={cols}
                        showIndices
                        cells={step.cells}
                        order={step.order}
                        pointers={step.pointers}
                    />
                    <div className="surface rounded-2xl p-5 md:p-6 shadow-sm space-y-4 min-w-0">
                        <SequenceStrip label="Visited" items={step.output} render={displayValue} placeholder="Press play to start" />
                        <VarChips vars={step.vars} />
                        <StatsRow stats={step.stats} message={step.message} items={counters} />
                        <PlayerControls
                            player={player}
                            onShare={gridHash ? shareStep : undefined}
                            shareLabel={copied ? "Link copied" : "Copy link to this step"}
                        />
                        <RunCompleteNudge
                            show={player.atEnd && player.total > 1}
                            tool="traversals"
                            algo={kind}
                            url={`${pageUrl}${gridHash}`}
                        />
                    </div>
                </div>

                <div className="surface rounded-2xl p-5 shadow-sm space-y-4 min-w-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Pseudocode</h2>
                        <span className="text-[11px] px-2 py-0.5 rounded surface-muted text-subtle font-mono">
                            {traversal.label}
                        </span>
                    </div>
                    <Pseudocode lines={traversal.pseudocode} activeLine={step.line} />
                    <div className="pt-3 border-t border-token">
                        <h3 className="text-[11px] uppercase tracking-wide text-subtle mb-2">Legend</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {LEGEND.filter((entry) => traversal.roles.includes(entry.role)).map((entry) => (
                                <span key={entry.role} className="inline-flex items-center gap-1.5 text-xs text-muted">
                                    <span className={cn("h-3 w-3 rounded-sm", entry.swatch)} />
                                    {entry.label}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="pt-3 border-t border-token space-y-3">
                        <h3 className="text-[11px] uppercase tracking-wide text-subtle">Grid size</h3>
                        <label className="flex items-center gap-3 text-xs text-muted">
                            <span className="w-16">Rows {rows}</span>
                            <input
                                type="range"
                                min={1}
                                max={MAX_ROWS}
                                value={rows}
                                onChange={(e) => resize(Number(e.target.value), cols)}
                                aria-label="Rows"
                                className="flex-1 cursor-pointer accent-[var(--accent)]"
                            />
                        </label>
                        <label className="flex items-center gap-3 text-xs text-muted">
                            <span className="w-16">Columns {cols}</span>
                            <input
                                type="range"
                                min={1}
                                max={MAX_COLS}
                                value={cols}
                                onChange={(e) => resize(rows, Number(e.target.value))}
                                aria-label="Columns"
                                className="flex-1 cursor-pointer accent-[var(--accent)]"
                            />
                        </label>
                        <p className="text-xs text-subtle">
                            Want your own values?{" "}
                            <TrackedLink
                                href={`/data-structures/arrays${gridHash}`}
                                scroll={false}
                                onClick={() => window.scrollTo(0, 0)}
                                event="tool_open"
                                params={{ tool: "arrays", from: "traversal_edit" }}
                                className="text-accent hover:text-accent-hover font-medium"
                            >
                                Edit this grid in the 2D Array Visualizer →
                            </TrackedLink>
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-3 text-center text-xs text-subtle">
                Tip: <Kbd>Space</Kbd> play/pause · <Kbd>←</Kbd> <Kbd>→</Kbd> step
            </p>

            <div className="mt-5">
                <TraversalLearn kind={kind} />
            </div>
        </>
    );
}

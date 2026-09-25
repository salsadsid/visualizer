"use client";
import { useMemo, useRef, useState } from "react";
import ArrayGrid from "@/components/array/ArrayGrid";
import GridLearn from "@/components/array/GridLearn";
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
import {
    GRID_ALGORITHMS,
    GRID_ALGORITHM_LIST,
    isLand,
    isWall,
    pseudocodeFor,
    stripLabelFor,
} from "@/lib/array/gridAlgorithms";
import { MAX_COLS, MAX_ROWS, gridFromHash } from "@/lib/array/gridFromHash";
import { GRID_ROLES } from "@/lib/array/gridRoles";
import { encodeGrid, readPoint, readStep, readVariant } from "@/lib/share";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const MODES = [
    { id: "wall", label: "Toggle wall" },
    { id: "start", label: "Move start" },
    { id: "target", label: "Move target" },
];

const BADGE_LABELS = { "flood-fill": "visited #", "number-of-islands": "island ", "shortest-path": "distance " };

const GROUP_LABELS = {
    "flood-fill": "Grid cells, click one to move the start",
    "number-of-islands": "Grid cells, click one to switch it between land and water",
    "shortest-path": "Maze cells, click one to toggle a wall or move the start or target",
};

const Kbd = ({ children }) => (
    <kbd className="px-1.5 py-0.5 rounded surface-muted border border-token font-mono text-[10px]">
        {children}
    </kbd>
);

const toKey = (point) => (point ? `${point[0]},${point[1]}` : null);

function parsePoint(key, rows, cols, fallback) {
    if (!key) return fallback;
    const [r, c] = key.split(",").map(Number);
    return r >= 0 && r < rows && c >= 0 && c < cols ? [r, c] : fallback;
}

function randomGrid(kind, rows, cols) {
    const roll = () => Math.random();
    if (kind === "flood-fill") return Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.floor(roll() * 3)));
    if (kind === "number-of-islands") return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (roll() < 0.45 ? 1 : 0)));
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (roll() < 0.28 ? 1 : 0)));
}

function ToggleGroup({ label, options, value, onChange }) {
    return (
        <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg surface-muted" role="group" aria-label={label}>
            {options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange(option.id)}
                    aria-pressed={value === option.id}
                    className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-colors focus-ring",
                        value === option.id
                            ? "bg-bg-elevated text-text shadow-sm border border-token"
                            : "text-muted hover:text-text"
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export default function GridAlgorithmVisualizer({ kind, basePath }) {
    const algorithm = GRID_ALGORITHMS[kind];
    const hash = useLocationHash();
    const shared = useMemo(() => gridFromHash(hash), [hash]);
    const [prevHash, setPrevHash] = useState(hash);
    const [matrix, setMatrix] = useState(() => shared ?? algorithm.defaultGrid);
    const [startKey, setStartKey] = useState(() => toKey(shared ? readPoint(hash, "st") : algorithm.defaultStart));
    const [targetKey, setTargetKey] = useState(() => toKey(shared ? readPoint(hash, "tg") : algorithm.defaultTarget));
    const [variant, setVariant] = useState(() => (shared && readVariant(hash)) || "bfs");
    const [mode, setMode] = useState("wall");
    const [sharedStep, setSharedStep] = useState(() => (shared ? readStep(hash) : null));
    const editedRef = useRef(false);

    if (hash !== prevHash) {
        setPrevHash(hash);
        if (shared) {
            setMatrix(shared);
            setStartKey(toKey(readPoint(hash, "st")));
            setTargetKey(toKey(readPoint(hash, "tg")));
            const v = readVariant(hash);
            if (v) setVariant(v);
            setSharedStep(readStep(hash));
        } else {
            setSharedStep(null);
        }
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    const start = useMemo(() => parsePoint(startKey, rows, cols, [0, 0]), [startKey, rows, cols]);
    const target = useMemo(() => parsePoint(targetKey, rows, cols, [rows - 1, cols - 1]), [targetKey, rows, cols]);
    const steps = useMemo(
        () => algorithm.run(matrix, { start, target, variant }).steps,
        [algorithm, matrix, start, target, variant]
    );
    const basePlayer = usePlayer(steps, sharedStep ?? 0);
    const player = usePlayerAnalytics(basePlayer, "grid", kind);
    const stageRef = useStepShortcuts(player);
    const [copied, copy] = useCopyLink();
    const step = player.step;
    const gridHash = useMemo(() => encodeGrid({ matrix }) ?? "", [matrix]);
    const pageUrl = `${siteConfig.url}${basePath}/${kind}`;
    const stripLabel = stripLabelFor(algorithm, variant);
    const isCallStack = stripLabel === "Call stack";

    const shareParams = () => {
        const parts = [`st=${start.join(",")}`];
        if (kind === "shortest-path") parts.push(`tg=${target.join(",")}`);
        if (algorithm.variants) parts.push(`v=${variant}`);
        return parts.join("&");
    };

    const noteEdit = () => {
        if (editedRef.current) return;
        editedRef.current = true;
        track("custom_input", { tool: "grid", algo: kind });
    };

    const replaceGrid = (next, preset) => {
        track("preset_select", { tool: "grid", preset });
        setSharedStep(null);
        setMatrix(next);
    };

    const onCellClick = (i, j) => {
        noteEdit();
        setSharedStep(null);
        const here = `${i},${j}`;
        if (algorithm.click === "start" || (algorithm.click === "wall" && mode === "start")) {
            setStartKey(here);
            return;
        }
        if (algorithm.click === "wall" && mode === "target") {
            setTargetKey(here);
            return;
        }
        if (algorithm.click === "wall" && (here === toKey(start) || here === toKey(target))) return;
        const flip = algorithm.click === "toggle" ? isLand : isWall;
        setMatrix((m) => m.map((row, r) => row.map((v, c) => (r === i && c === j ? (flip(v) ? 0 : 1) : v))));
    };

    const chooseVariant = (next) => {
        track("algo_select", { tool: "grid", algo: kind, variant: next });
        setSharedStep(null);
        setVariant(next);
    };

    const resize = (nextRows, nextCols) => {
        replaceGrid(randomGrid(kind, nextRows, nextCols), `${nextRows}x${nextCols}`);
    };

    const shareStep = () => {
        track("share_click", { tool: "grid", algo: kind, from: "player" });
        copy(`${pageUrl}${gridHash}&s=${player.index}&${shareParams()}`);
    };

    const counters =
        kind === "number-of-islands"
            ? [
                  { label: "Islands", value: step.stats.islands, hint: "Islands counted so far" },
                  { label: "Land visited", short: "Visited", value: step.stats.visited, hint: "Land cells marked so far" },
                  { label: "Land total", short: "Land", value: step.stats.total, hint: "Land cells in the grid" },
              ]
            : kind === "shortest-path"
              ? [
                    { label: "Visited", value: step.stats.visited, hint: "Cells taken from the queue so far" },
                    { label: "In queue", short: "Queue", value: step.stats.frontier, hint: "Cells waiting in the queue" },
                    { label: "Distance", short: "Dist", value: step.stats.distance, hint: "Shortest distance to the target, once found" },
                ]
              : [
                    { label: "Filled", value: step.stats.visited, hint: "Cells filled so far" },
                    { label: "Remaining", short: "Left", value: step.stats.total - step.stats.visited, hint: "Connected cells still to fill" },
                    { label: isCallStack ? "Stack depth" : "In queue", short: isCallStack ? "Depth" : "Queue", value: step.stats.frontier, hint: isCallStack ? "Open calls to fill()" : "Cells waiting in the queue" },
                ];

    return (
        <>
            <nav aria-label="Grid algorithm" className="flex flex-wrap justify-center gap-2 mb-3">
                {GRID_ALGORITHM_LIST.map((a) => (
                    <TrackedLink
                        key={a.key}
                        href={`${basePath}/${a.key}${gridHash}`}
                        scroll={false}
                        event="algo_select"
                        params={{ tool: "grid", algo: a.key }}
                        aria-current={kind === a.key ? "page" : undefined}
                        className={cn(
                            "px-3 py-1.5 rounded-xl text-sm font-medium border transition-all focus-ring hover:scale-105 active:scale-95",
                            kind === a.key
                                ? "bg-accent text-white border-accent shadow-md"
                                : "surface text-muted hover:text-text"
                        )}
                    >
                        {a.label}
                    </TrackedLink>
                ))}
            </nav>
            <p className="text-center text-base text-muted max-w-2xl mx-auto mb-6">{algorithm.blurb}</p>

            <div ref={stageRef} className="grid lg:grid-cols-[1fr_360px] gap-5">
                <div className="space-y-4 min-w-0">
                    <ArrayGrid
                        matrix={matrix}
                        maxLen={cols}
                        fill={false}
                        showIndices
                        cells={step.cells}
                        order={step.order}
                        pointers={step.pointers}
                        onCellClick={onCellClick}
                        orderLabel={BADGE_LABELS[kind]}
                        groupLabel={GROUP_LABELS[kind]}
                    />
                    <div className="surface rounded-2xl p-5 md:p-6 shadow-sm space-y-4 min-w-0">
                        <SequenceStrip
                            label={stripLabel}
                            items={step.frontier}
                            render={(k) => `(${k.replace(",", ", ")})`}
                            placeholder="Empty"
                        />
                        <VarChips vars={step.vars} />
                        <StatsRow stats={step.stats} message={step.message} items={counters} />
                        <PlayerControls
                            player={player}
                            onShare={gridHash ? shareStep : undefined}
                            shareLabel={copied ? "Link copied" : "Copy link to this step"}
                        />
                        <RunCompleteNudge
                            show={player.atEnd && player.total > 1}
                            tool="grid"
                            algo={kind}
                            url={`${pageUrl}${gridHash}&${shareParams()}`}
                        />
                    </div>
                </div>

                <div className="surface rounded-2xl p-5 shadow-sm space-y-4 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-semibold">Pseudocode</h2>
                        {algorithm.variants ? (
                            <ToggleGroup
                                label="Flood fill variant"
                                options={Object.entries(algorithm.variants).map(([id, v]) => ({ id, label: v.label }))}
                                value={variant}
                                onChange={chooseVariant}
                            />
                        ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded surface-muted text-subtle font-mono">
                                {algorithm.label}
                            </span>
                        )}
                    </div>
                    <Pseudocode lines={pseudocodeFor(algorithm, variant)} activeLine={step.line} />
                    <div className="pt-3 border-t border-token">
                        <h3 className="text-[11px] uppercase tracking-wide text-subtle mb-2">Legend</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {algorithm.roles.filter((role) => !role.startsWith("island-") || role === "island-1").map((role) => (
                                <span key={role} className="inline-flex items-center gap-1.5 text-xs text-muted">
                                    <span className={cn("h-3 w-3 rounded-sm", GRID_ROLES[role].swatch)} />
                                    {role === "frontier" && isCallStack
                                        ? "On the call stack"
                                        : role === "island-1"
                                          ? "Island (one colour each)"
                                          : GRID_ROLES[role].label}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="pt-3 border-t border-token space-y-3">
                        <h3 className="text-[11px] uppercase tracking-wide text-subtle">Grid</h3>
                        {algorithm.click === "wall" && (
                            <ToggleGroup label="What a click does" options={MODES} value={mode} onChange={setMode} />
                        )}
                        <p className="text-xs text-muted">
                            {algorithm.click === "start" && "Click any cell to fill from there."}
                            {algorithm.click === "toggle" && "Click a cell to turn land into water or water into land."}
                            {algorithm.click === "wall" && "Click a cell to toggle a wall, or pick Move start / Move target first."}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setStartKey(toKey(algorithm.defaultStart));
                                    setTargetKey(toKey(algorithm.defaultTarget));
                                    replaceGrid(algorithm.defaultGrid, "example");
                                }}
                                className="px-2.5 py-1 text-xs font-medium rounded-md surface-muted text-muted hover:text-text transition-colors focus-ring"
                            >
                                Example
                            </button>
                            <button
                                type="button"
                                onClick={() => replaceGrid(randomGrid(kind, rows, cols), "random")}
                                className="px-2.5 py-1 text-xs font-medium rounded-md surface-muted text-muted hover:text-text transition-colors focus-ring"
                            >
                                Random
                            </button>
                            <button
                                type="button"
                                onClick={() => replaceGrid(Array.from({ length: rows }, () => Array(cols).fill(0)), "clear")}
                                className="px-2.5 py-1 text-xs font-medium rounded-md surface-muted text-muted hover:text-text transition-colors focus-ring"
                            >
                                Clear
                            </button>
                        </div>
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
                            Want exact values?{" "}
                            <TrackedLink
                                href={`/data-structures/arrays${gridHash}`}
                                scroll={false}
                                onClick={() => window.scrollTo(0, 0)}
                                event="tool_open"
                                params={{ tool: "arrays", from: "grid_edit" }}
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
                <GridLearn kind={kind} basePath={basePath} />
            </div>
        </>
    );
}

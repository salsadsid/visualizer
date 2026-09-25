"use client";
import { useMemo, useRef, useState } from "react";
import MatrixLearn from "@/components/array/MatrixLearn";
import MatrixPanel from "@/components/array/MatrixPanel";
import PlayerControls from "@/components/algorithms/PlayerControls";
import Pseudocode from "@/components/algorithms/Pseudocode";
import StatsRow from "@/components/algorithms/StatsRow";
import ToggleGroup from "@/components/algorithms/ToggleGroup";
import VarChips from "@/components/algorithms/VarChips";
import { usePlayer } from "@/components/algorithms/usePlayer";
import { usePlayerAnalytics } from "@/components/algorithms/usePlayerAnalytics";
import { useStepShortcuts } from "@/components/algorithms/useStepShortcuts";
import TrackedLink from "@/components/analytics/TrackedLink";
import RunCompleteNudge from "@/components/engagement/RunCompleteNudge";
import { useCopyLink } from "@/components/engagement/useCopyLink";
import { useLocationHash } from "@/components/engagement/useLocationHash";
import {
    MATRIX_OPS,
    MATRIX_OP_LIST,
    MAX_MULTIPLY,
    MAX_VALUE,
    MULTIPLY_EXAMPLE,
    isNumericMatrix,
    pseudocodeFor,
    randomMatrix,
    resultLabelFor,
    variantKeys,
} from "@/lib/array/matrixOps";
import { numberedGrid } from "@/lib/array/traversals";
import { MAX_COLS, MAX_ROWS, gridFromHash } from "@/lib/array/gridFromHash";
import { GRID_ROLES } from "@/lib/array/gridRoles";
import { encodeGrid, gridParam, readStep, readVariant } from "@/lib/share";
import { embedSnippet } from "@/lib/embed";
import { captionFor, exportNodeAsPng, snapshotFilename } from "@/lib/exportPng";
import { matrixPageFor } from "@/lib/catalog";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const TOOL = "matrix";
const DEFAULT_GRID = numberedGrid(3, 4);

const fitsMultiply = (m) => isNumericMatrix(m) && m.length <= MAX_MULTIPLY && m[0].length <= MAX_MULTIPLY;

const longestValue = (m) => Math.max(0, ...m.flat().map((v) => String(v).length));

const Kbd = ({ children }) => (
    <kbd className="px-1.5 py-0.5 rounded surface-muted border border-token font-mono text-[10px]">
        {children}
    </kbd>
);

const Glyph = ({ children }) => (
    <span aria-hidden="true" className="self-center text-2xl font-semibold text-subtle">
        {children}
    </span>
);

function Slider({ label, value, max, onChange }) {
    return (
        <label className="flex items-center gap-3 text-xs text-muted">
            <span className="w-20">
                {label} {value}
            </span>
            <input
                type="range"
                min={1}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                aria-label={label}
                className="flex-1 cursor-pointer accent-[var(--accent)]"
            />
        </label>
    );
}

const buttonClass =
    "px-2.5 py-1 text-xs font-medium rounded-md surface-muted text-muted hover:text-text transition-colors focus-ring";

export default function MatrixOpVisualizer({ kind, basePath }) {
    const op = MATRIX_OPS[kind];
    const isMultiply = kind === "multiply";
    const hash = useLocationHash();
    const shared = useMemo(() => gridFromHash(hash), [hash]);
    const sharedB = useMemo(() => gridFromHash(hash, "b"), [hash]);
    const [prevHash, setPrevHash] = useState(hash);
    const [matrix, setMatrix] = useState(() => shared ?? (isMultiply ? MULTIPLY_EXAMPLE.a : DEFAULT_GRID));
    const [bState, setBState] = useState(() => sharedB ?? MULTIPLY_EXAMPLE.b);
    const [variantState, setVariantState] = useState(() => (shared && readVariant(hash)) || op.defaultVariant || null);
    const [sharedStep, setSharedStep] = useState(() => (shared ? readStep(hash) : null));

    if (hash !== prevHash) {
        setPrevHash(hash);
        if (shared) {
            setMatrix(shared);
            if (sharedB) setBState(sharedB);
            const v = readVariant(hash);
            if (v) setVariantState(v);
            setSharedStep(readStep(hash));
        } else {
            setSharedStep(null);
        }
    }

    const variant = op.variants ? (op.variants[variantState] ? variantState : op.defaultVariant) : null;
    const a = isMultiply && !fitsMultiply(matrix) ? MULTIPLY_EXAMPLE.a : matrix;
    const usingExample = a !== matrix;
    const rows = a.length;
    const cols = a[0].length;
    const b = useMemo(() => {
        if (!isMultiply) return null;
        const fits = fitsMultiply(bState) && bState.length === cols;
        return fits ? bState : numberedGrid(cols, Math.min(MAX_MULTIPLY, bState[0]?.length ?? 2));
    }, [isMultiply, bState, cols]);
    const bCols = b ? b[0].length : 0;

    const steps = useMemo(() => op.run(a, { variant, b }).steps, [op, a, variant, b]);
    const basePlayer = usePlayer(steps, sharedStep ?? 0);
    const player = usePlayerAnalytics(basePlayer, TOOL, kind);
    const stageRef = useStepShortcuts(player);
    const [copied, copy] = useCopyLink();
    const [embedCopied, copyEmbed] = useCopyLink();
    const exportRef = useRef(null);
    const step = player.step;
    const result = steps[steps.length - 1].panels.out.matrix;
    const outRows = result.length;
    const outCols = result[0]?.length ?? 0;
    const wide = useMemo(() => longestValue(a) >= 4 || longestValue(result) >= 4, [a, result]);
    const sizeCols = Math.max(cols, outCols, bCols, wide ? 7 : 0);

    const gridHash = useMemo(() => encodeGrid({ matrix: a }) ?? "", [a]);
    const bParam = useMemo(() => (b ? gridParam({ matrix: b }, "b") : null), [b]);
    const pageUrl = `${siteConfig.url}${basePath}/${kind}`;
    const shareHash = [gridHash, bParam, variant ? `v=${variant}` : null].filter(Boolean).join("&");
    const lines = pseudocodeFor(op, variant);

    const replace = (nextA, nextB, preset) => {
        track("preset_select", { tool: TOOL, preset });
        setSharedStep(null);
        setMatrix(nextA);
        if (nextB) setBState(nextB);
    };

    const resize = (nextRows, nextCols, nextBCols = bCols) => {
        const nextA = numberedGrid(nextRows, nextCols);
        const nextB = isMultiply ? numberedGrid(nextCols, nextBCols) : null;
        replace(nextA, nextB, isMultiply ? `${nextRows}x${nextCols}x${nextBCols}` : `${nextRows}x${nextCols}`);
    };

    const randomise = () => {
        const nextB = isMultiply ? randomMatrix(cols, bCols) : null;
        replace(randomMatrix(rows, cols), nextB, "random");
    };

    const example = () => {
        if (isMultiply) replace(MULTIPLY_EXAMPLE.a, MULTIPLY_EXAMPLE.b, "example");
        else replace(DEFAULT_GRID, null, "example");
    };

    const chooseVariant = (next) => {
        track("algo_select", { tool: TOOL, algo: kind, variant: next });
        setSharedStep(null);
        setVariantState(next);
    };

    const shareStep = () => {
        track("share_click", { tool: TOOL, algo: kind, from: "player" });
        copy(`${pageUrl}${shareHash ? `#${shareHash.replace(/^#/, "")}` : ""}&s=${player.index}`);
    };
    const embedCode = () => {
        track("embed_click", { tool: "matrix", algo: kind, from: "player" });
        copyEmbed(embedSnippet({ url: pageUrl, hash: `#${shareHash.replace(/^#/, "")}&s=${player.index}`, title: `${matrixPageFor(kind).name} · ${siteConfig.shortName}` }));
    };

    const exportPng = () => {
        if (!exportRef.current) return;
        track("export_click", { tool: "matrix", algo: kind, from: "player" });
        exportNodeAsPng(exportRef.current, {
            caption: captionFor({ name: matrixPageFor(kind).name, step: player.index + 1, total: player.total }),
            filename: snapshotFilename({ page: `matrix-${kind}`, step: player.index + 1 }),
        });
    };


    const total = outRows * outCols;
    const counters = op.counters.map((counter) => ({
        label: counter.label,
        short: counter.short,
        hint: counter.hint,
        value: counter.key === "remaining" ? total - step.stats.writes : step.stats[counter.key],
    }));

    return (
        <>
            <nav aria-label="Matrix operation" className="flex flex-wrap justify-center gap-2 mb-3">
                {MATRIX_OP_LIST.map((o) => (
                    <TrackedLink
                        key={o.key}
                        href={`${basePath}/${o.key}${gridHash}`}
                        scroll={false}
                        event="algo_select"
                        params={{ tool: TOOL, algo: o.key }}
                        aria-current={kind === o.key ? "page" : undefined}
                        className={cn(
                            "px-3 py-1.5 rounded-xl text-sm font-medium border transition-all focus-ring hover:scale-105 active:scale-95",
                            kind === o.key
                                ? "bg-accent text-white border-accent shadow-md"
                                : "surface text-muted hover:text-text"
                        )}
                    >
                        {o.label}
                    </TrackedLink>
                ))}
            </nav>
            <p className="text-center text-base text-muted max-w-2xl mx-auto mb-6">{op.blurb}</p>

            <div ref={stageRef} className="grid lg:grid-cols-[1fr_360px] gap-5">
                <div className="space-y-4 min-w-0">
                    <div className="surface rounded-2xl p-4 md:p-6 shadow-sm min-w-0 relative overflow-hidden">
                        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
                        <div ref={exportRef} className="relative flex flex-wrap items-start justify-center gap-4 md:gap-6">
                            <MatrixPanel label="A" matrix={a} panel={step.panels.a} sizeCols={sizeCols} />
                            {isMultiply && (
                                <>
                                    <Glyph>×</Glyph>
                                    <MatrixPanel label="B" matrix={b} panel={step.panels.b} sizeCols={sizeCols} />
                                </>
                            )}
                            <Glyph>{isMultiply ? "=" : "→"}</Glyph>
                            <MatrixPanel
                                label={resultLabelFor(op, variant)}
                                matrix={step.panels.out.matrix}
                                panel={step.panels.out}
                                sizeCols={sizeCols}
                            />
                        </div>
                        {usingExample && (
                            <p role="status" className="relative mt-4 text-center text-xs text-muted">
                                Multiplication needs whole numbers between −{MAX_VALUE} and {MAX_VALUE} in a grid no
                                bigger than {MAX_MULTIPLY} × {MAX_MULTIPLY}, so the grid you brought was swapped for
                                this example.
                            </p>
                        )}
                    </div>
                    <div className="surface rounded-2xl p-5 md:p-6 shadow-sm space-y-4 min-w-0">
                        <VarChips vars={step.vars} />
                        <StatsRow stats={step.stats} message={step.message} items={counters} />
                        <PlayerControls
                            player={player}
                            onShare={gridHash ? shareStep : undefined}
                            shareLabel={copied ? "Link copied" : "Copy link to this step"}
                            onEmbed={embedCode}
                            embedLabel={embedCopied ? "Embed code copied" : "Copy embed code"}
                            onExport={exportPng}
                        />
                        <RunCompleteNudge
                            show={player.atEnd && player.total > 1}
                            tool={TOOL}
                            algo={kind}
                            url={`${pageUrl}${shareHash ? `#${shareHash.replace(/^#/, "")}` : ""}`}
                        />
                    </div>
                </div>

                <div className="surface rounded-2xl p-5 shadow-sm space-y-4 min-w-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Pseudocode</h2>
                        <span className="text-[11px] px-2 py-0.5 rounded surface-muted text-subtle font-mono">
                            {op.label}
                        </span>
                    </div>
                    <Pseudocode lines={lines} activeLine={step.line} />
                    {op.variants && (
                        <div className="pt-3 border-t border-token space-y-2">
                            <h3 className="text-[11px] uppercase tracking-wide text-subtle">
                                {kind === "rotate" ? "Direction" : "Axis"}
                            </h3>
                            <ToggleGroup
                                label={kind === "rotate" ? "Rotation direction" : "Flip axis"}
                                options={variantKeys(op).map((id) => ({ id, label: op.variants[id].label }))}
                                value={variant}
                                onChange={chooseVariant}
                            />
                        </div>
                    )}
                    <div className="pt-3 border-t border-token">
                        <h3 className="text-[11px] uppercase tracking-wide text-subtle mb-2">Legend</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {op.roles.map((role) => (
                                <span key={role} className="inline-flex items-center gap-1.5 text-xs text-muted">
                                    <span className={cn("h-3 w-3 rounded-sm", GRID_ROLES[role].swatch)} />
                                    {GRID_ROLES[role].label}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="pt-3 border-t border-token space-y-3">
                        <h3 className="text-[11px] uppercase tracking-wide text-subtle">Matrix size</h3>
                        <div className="flex flex-wrap gap-1.5">
                            <button type="button" onClick={example} className={buttonClass}>
                                Example
                            </button>
                            <button type="button" onClick={randomise} className={buttonClass}>
                                Random
                            </button>
                        </div>
                        {isMultiply ? (
                            <>
                                <Slider label="Rows of A" value={rows} max={MAX_MULTIPLY} onChange={(v) => resize(v, cols)} />
                                <Slider label="Inner size" value={cols} max={MAX_MULTIPLY} onChange={(v) => resize(rows, v)} />
                                <Slider label="Cols of B" value={bCols} max={MAX_MULTIPLY} onChange={(v) => resize(rows, cols, v)} />
                            </>
                        ) : (
                            <>
                                <Slider label="Rows" value={rows} max={MAX_ROWS} onChange={(v) => resize(v, cols)} />
                                <Slider label="Columns" value={cols} max={MAX_COLS} onChange={(v) => resize(rows, v)} />
                            </>
                        )}
                        <p className="text-xs text-subtle">
                            Want your own values?{" "}
                            <TrackedLink
                                href={`/data-structures/arrays${gridHash}`}
                                scroll={false}
                                onClick={() => window.scrollTo(0, 0)}
                                event="tool_open"
                                params={{ tool: "arrays", from: "matrix_edit" }}
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
                <MatrixLearn kind={kind} basePath={basePath} />
            </div>
        </>
    );
}

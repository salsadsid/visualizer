"use client";
import { useMemo, useState } from "react";
import ArrayControls from "@/components/algorithms/ArrayControls";
import BoxRow from "@/components/algorithms/BoxRow";
import PlayerControls from "@/components/algorithms/PlayerControls";
import Pseudocode from "@/components/algorithms/Pseudocode";
import StatsRow from "@/components/algorithms/StatsRow";
import VarChips from "@/components/algorithms/VarChips";
import { usePlayer } from "@/components/algorithms/usePlayer";
import { usePlayerAnalytics } from "@/components/algorithms/usePlayerAnalytics";
import { useStepShortcuts } from "@/components/algorithms/useStepShortcuts";
import { useSortingInput } from "@/components/algorithms/SortingInputProvider";
import OneDLearn from "@/components/array/OneDLearn";
import RunCompleteNudge from "@/components/engagement/RunCompleteNudge";
import { useCopyLink } from "@/components/engagement/useCopyLink";
import { useLocationHash } from "@/components/engagement/useLocationHash";
import { OPERATIONS, OPERATION_LIST } from "@/lib/array/oneD";
import { BOX_ROLES, boxClass, boxLabel } from "@/lib/array/boxRoles";
import { MAX_VALUE, MIN_VALUE } from "@/lib/algorithms/presets";
import { encodeOneD, readParam } from "@/lib/share";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const NUMBER = /^\d+$/;

const Kbd = ({ children }) => (
    <kbd className="px-1.5 py-0.5 rounded surface-muted border border-token font-mono text-[10px]">
        {children}
    </kbd>
);

function fromHash(hash) {
    const op = readParam(hash, "op", /^[a-z]+$/);
    const number = (name) => {
        const raw = readParam(hash, name, NUMBER);
        return raw == null ? null : Number(raw);
    };
    return { op: op && OPERATIONS[op] ? op : null, index: number("at"), value: number("val"), target: number("q") };
}

const clampValue = (v) => Math.max(MIN_VALUE, Math.min(MAX_VALUE, Number.isFinite(v) ? Math.round(v) : MIN_VALUE));

const INDEX_LABELS = { access: "Read index", insert: "Insert at index", delete: "Delete index" };

export default function OneDVisualizer({ path }) {
    const { size, values, sharedStep, clearSharedStep, applyPreset, shuffle, changeSize, applyCustom } =
        useSortingInput();
    const hash = useLocationHash();
    const fromLink = useMemo(() => fromHash(hash), [hash]);
    const [prevHash, setPrevHash] = useState(hash);
    const [op, setOp] = useState(() => fromLink.op ?? "insert");
    const [rawIndex, setRawIndex] = useState(() => fromLink.index ?? 2);
    const [value, setValue] = useState(() => (fromLink.value == null ? 42 : clampValue(fromLink.value)));
    const [rawTarget, setRawTarget] = useState(() => (fromLink.target == null ? null : clampValue(fromLink.target)));

    if (hash !== prevHash) {
        setPrevHash(hash);
        if (fromLink.op) setOp(fromLink.op);
        if (fromLink.index != null) setRawIndex(fromLink.index);
        if (fromLink.value != null) setValue(clampValue(fromLink.value));
        if (fromLink.target != null) setRawTarget(clampValue(fromLink.target));
    }

    const operation = OPERATIONS[op];
    const n = values.length;
    const maxIndex = op === "insert" ? n : n - 1;
    const index = Math.max(0, Math.min(rawIndex, maxIndex));
    const target = rawTarget ?? values[Math.floor(n / 2)];
    const steps = useMemo(
        () => operation.run(values, { index, value, target }).steps,
        [operation, values, index, value, target]
    );
    const startIndex = sharedStep?.path === path ? sharedStep.index : 0;
    const basePlayer = usePlayer(steps, startIndex);
    const player = usePlayerAnalytics(basePlayer, "arrays1d", op);
    const stageRef = useStepShortcuts(player);
    const [copied, copy] = useCopyLink();
    const step = player.step;
    const pageUrl = `${siteConfig.url}${path}`;

    const options = () => ({
        op,
        index: operation.inputs.includes("index") ? index : undefined,
        value: operation.inputs.includes("value") ? value : undefined,
        target: operation.inputs.includes("target") ? target : undefined,
    });

    const selectOp = (key) => {
        track("algo_select", { tool: "arrays1d", algo: key });
        clearSharedStep();
        setOp(key);
    };
    const setIndex = (next) => {
        clearSharedStep();
        setRawIndex(next);
    };
    const changeValue = (next) => {
        clearSharedStep();
        setValue(clampValue(next));
    };
    const changeTarget = (next) => {
        clearSharedStep();
        setRawTarget(clampValue(next));
    };
    const shareStep = () => {
        track("share_click", { tool: "arrays1d", algo: op, from: "player" });
        copy(`${pageUrl}${encodeOneD({ values, step: player.index, ...options() })}`);
    };

    const counters = [
        { label: "Reads", value: step.stats.reads, hint: "Times a slot was read" },
        { label: "Writes", value: step.stats.writes, hint: "Times a value was written into a slot" },
        { label: "Compares", short: "Compares", value: step.stats.compares, hint: "Times two values were compared" },
    ];

    return (
        <>
            <div role="group" aria-label="Operation" className="flex flex-wrap justify-center gap-2 mb-3">
                {OPERATION_LIST.map((o) => (
                    <button
                        key={o.key}
                        type="button"
                        onClick={() => selectOp(o.key)}
                        aria-pressed={op === o.key}
                        className={cn(
                            "px-3 py-1.5 rounded-xl text-sm font-medium border transition-all focus-ring hover:scale-105 active:scale-95",
                            op === o.key
                                ? "bg-accent text-white border-accent shadow-md"
                                : "surface text-muted hover:text-text"
                        )}
                    >
                        {o.label}
                    </button>
                ))}
            </div>
            <p className="text-center text-base text-muted max-w-2xl mx-auto mb-6">{operation.blurb}</p>

            <div ref={stageRef} className="grid lg:grid-cols-[1fr_360px] gap-5">
                <div className="surface rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden min-w-0">
                    <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                    <div className="relative space-y-5">
                        <BoxRow
                            values={step.array}
                            cells={step.highlights}
                            pointers={step.pointers}
                            roleClass={boxClass}
                            roleLabel={boxLabel}
                            showIndices
                            label="The array"
                        />
                        <VarChips vars={step.vars} />
                        <StatsRow stats={step.stats} message={step.message} items={counters} />
                        <PlayerControls
                            player={player}
                            onShare={shareStep}
                            shareLabel={copied ? "Link copied" : "Copy link to this step"}
                        />
                        <RunCompleteNudge
                            show={player.atEnd && player.total > 1}
                            tool="arrays1d"
                            algo={op}
                            url={`${pageUrl}${encodeOneD({ values, ...options() })}`}
                        />
                    </div>
                </div>

                <div className="surface rounded-2xl p-5 shadow-sm space-y-4 min-w-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Pseudocode</h2>
                        <span className="text-[11px] px-2 py-0.5 rounded surface-muted text-subtle font-mono">
                            {operation.label}
                        </span>
                    </div>
                    <Pseudocode lines={operation.pseudocode} activeLine={step.line} />
                    <dl className="grid grid-cols-3 gap-2">
                        {[
                            ["Best", operation.complexity.best],
                            ["Worst", operation.complexity.worst],
                            ["Space", operation.complexity.space],
                        ].map(([label, cost]) => (
                            <div key={label} className="surface-muted rounded-lg px-2 py-1.5 min-w-0">
                                <dt className="text-[10px] uppercase tracking-wide text-subtle">{label}</dt>
                                <dd className="font-mono text-xs text-text truncate" title={cost}>
                                    {cost}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <div className="pt-3 border-t border-token">
                        <h3 className="text-[11px] uppercase tracking-wide text-subtle mb-2">Legend</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {operation.roles.map((role) => (
                                <span key={role} className="inline-flex items-center gap-1.5 text-xs text-muted">
                                    <span className={cn("h-3 w-3 rounded-sm", BOX_ROLES[role].swatch)} />
                                    {BOX_ROLES[role].label}
                                </span>
                            ))}
                        </div>
                    </div>
                    {operation.inputs.length > 0 && (
                        <div className="pt-3 border-t border-token space-y-3">
                            <h3 className="text-[11px] uppercase tracking-wide text-subtle">Options</h3>
                            {operation.inputs.includes("index") && (
                                <label className="flex items-center gap-3 text-xs text-muted">
                                    <span className="w-28 shrink-0">
                                        {INDEX_LABELS[op]} <span className="font-mono text-text">{index}</span>
                                    </span>
                                    <input
                                        type="range"
                                        min={0}
                                        max={maxIndex}
                                        value={index}
                                        onChange={(e) => setIndex(Number(e.target.value))}
                                        aria-label={INDEX_LABELS[op]}
                                        className="flex-1 min-w-0 cursor-pointer accent-[var(--accent)]"
                                    />
                                </label>
                            )}
                            {operation.inputs.includes("value") && (
                                <label className="flex items-center gap-3 text-xs text-muted">
                                    <span className="w-28 shrink-0">Value to insert</span>
                                    <input
                                        type="number"
                                        min={MIN_VALUE}
                                        max={MAX_VALUE}
                                        value={value}
                                        onChange={(e) => changeValue(Number(e.target.value))}
                                        aria-label="Value to insert"
                                        className="w-20 font-mono text-sm px-2 py-1 rounded-lg bg-bg-subtle border border-token text-text focus-ring"
                                    />
                                </label>
                            )}
                            {operation.inputs.includes("target") && (
                                <label className="flex items-center gap-3 text-xs text-muted">
                                    <span className="w-28 shrink-0">Value to find</span>
                                    <input
                                        type="number"
                                        min={MIN_VALUE}
                                        max={MAX_VALUE}
                                        value={target}
                                        onChange={(e) => changeTarget(Number(e.target.value))}
                                        aria-label="Value to find"
                                        className="w-20 font-mono text-sm px-2 py-1 rounded-lg bg-bg-subtle border border-token text-text focus-ring"
                                    />
                                </label>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5">
                <ArrayControls
                    size={size}
                    onSize={changeSize}
                    onPreset={applyPreset}
                    onShuffle={shuffle}
                    onCustom={applyCustom}
                />
            </div>

            <p className="mt-3 text-center text-xs text-subtle">
                Tip: <Kbd>Space</Kbd> play/pause · <Kbd>←</Kbd> <Kbd>→</Kbd> step
            </p>

            <div className="mt-5">
                <OneDLearn op={op} onSelect={selectOp} />
            </div>
        </>
    );
}

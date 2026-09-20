"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import BarChart from "@/components/algorithms/BarChart";
import VarChips from "@/components/algorithms/VarChips";
import StatsRow from "@/components/algorithms/StatsRow";
import PlayerControls from "@/components/algorithms/PlayerControls";
import Pseudocode from "@/components/algorithms/Pseudocode";
import ArrayControls from "@/components/algorithms/ArrayControls";
import SortingLearn from "@/components/algorithms/SortingLearn";
import { usePlayer } from "@/components/algorithms/usePlayer";
import { usePlayerAnalytics } from "@/components/algorithms/usePlayerAnalytics";
import { useSortingInput } from "@/components/algorithms/SortingInputProvider";
import { SORTERS, SORTER_LIST } from "@/lib/algorithms/sorting";
import { ROLE_STYLES } from "@/lib/algorithms/roles";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const SPACE_TARGETS = "button, a, input, textarea, select, summary, [role=tab]";
const ARROW_TARGETS = "input, textarea, select, [role=tab]";

const Kbd = ({ children }) => (
    <kbd className="px-1.5 py-0.5 rounded surface-muted border border-token font-mono text-[10px]">
        {children}
    </kbd>
);

export default function SortingVisualizer() {
    const [algoKey, setAlgoKey] = useState("bubble");
    const { size, values, applyPreset, shuffle, changeSize, applyCustom } = useSortingInput();

    const sorter = SORTERS[algoKey];
    const steps = useMemo(() => sorter.run(values).steps, [sorter, values]);
    const basePlayer = usePlayer(steps);
    const player = usePlayerAnalytics(basePlayer, "sorting", algoKey);
    const step = player.step;

    // Keyboard shortcuts: space = play/pause, arrows = step. Bound once via a ref so
    // it always sees the latest player without re-subscribing each render.
    const playerRef = useRef(player);
    const stageRef = useRef(null);
    useEffect(() => {
        playerRef.current = player;
    });
    useEffect(() => {
        const onKey = (e) => {
            const isSpace = e.code === "Space";
            const isArrow = e.key === "ArrowRight" || e.key === "ArrowLeft";
            if (!isSpace && !isArrow) return;
            if (e.target?.closest?.(isSpace ? SPACE_TARGETS : ARROW_TARGETS)) return;

            const stage = stageRef.current?.getBoundingClientRect();
            if (!stage || stage.bottom < 0 || stage.top > window.innerHeight) return;

            const p = playerRef.current;
            e.preventDefault();
            if (isSpace) p.toggle();
            else if (e.key === "ArrowRight") p.stepF();
            else p.stepB();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const selectAlgo = (key) => {
        track("algo_select", { tool: "sorting", algo: key });
        setAlgoKey(key);
    };
    return (
        <>
            <div
                role="tablist"
                aria-label="Sorting algorithm"
                className="flex flex-wrap justify-center gap-2 mb-3"
            >
                {SORTER_LIST.map((s) => (
                    <button
                        key={s.key}
                        type="button"
                        role="tab"
                        aria-selected={algoKey === s.key}
                        onClick={() => selectAlgo(s.key)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium border transition-all focus-ring hover:scale-105 active:scale-95",
                            algoKey === s.key
                                ? "bg-accent text-white border-accent shadow-md"
                                : "surface text-muted hover:text-text"
                        )}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
            <p className="text-center text-base text-muted max-w-2xl mx-auto mb-6">
                {sorter.blurb}
            </p>

            <div ref={stageRef} className="grid lg:grid-cols-[1fr_360px] gap-5">
                <div className="surface rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden min-w-0">
                    <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden"
                    >
                        <div className="absolute -top-8 -right-6 h-40 w-40 rounded-full bg-fuchsia-400/10 blur-3xl animate-blob" />
                        <div className="absolute -bottom-10 -left-6 h-44 w-44 rounded-full bg-indigo-400/10 blur-2xl animate-float-slow" />
                    </div>
                    <div className="relative space-y-5">
                        <BarChart
                            array={step.array}
                            highlights={step.highlights}
                            pointers={step.pointers}
                            done={player.atEnd}
                        />
                        <VarChips vars={step.vars} />
                        <StatsRow stats={step.stats} message={step.message} />
                        <PlayerControls player={player} />
                    </div>
                </div>

                <div className="surface rounded-2xl p-5 shadow-sm space-y-4 min-w-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold">Pseudocode</h2>
                        <span className="text-[11px] px-2 py-0.5 rounded surface-muted text-subtle font-mono">
                            {sorter.label}
                        </span>
                    </div>
                    <Pseudocode lines={sorter.pseudocode} activeLine={step.line} />
                    <div className="pt-3 border-t border-token">
                        <h3 className="text-[11px] uppercase tracking-wide text-subtle mb-2">
                            Legend
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {sorter.roles.map((role) => (
                                <span
                                    key={role}
                                    className="inline-flex items-center gap-1.5 text-xs text-muted"
                                >
                                    <span
                                        className={cn(
                                            "h-3 w-3 rounded-sm",
                                            ROLE_STYLES[role].bar
                                        )}
                                    />
                                    {ROLE_STYLES[role].label}
                                </span>
                            ))}
                        </div>
                    </div>
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
                <SortingLearn algo={algoKey} />
            </div>
        </>
    );
}

"use client";
import { useMemo } from "react";
import BarChart from "@/components/algorithms/BarChart";
import VarChips from "@/components/algorithms/VarChips";
import StatsRow from "@/components/algorithms/StatsRow";
import PlayerControls from "@/components/algorithms/PlayerControls";
import PredictBar from "@/components/algorithms/PredictBar";
import PredictPanel from "@/components/algorithms/PredictPanel";
import PredictSummary from "@/components/algorithms/PredictSummary";
import Pseudocode from "@/components/algorithms/Pseudocode";
import ArrayControls from "@/components/algorithms/ArrayControls";
import SortingLearn from "@/components/algorithms/SortingLearn";
import { usePlayer } from "@/components/algorithms/usePlayer";
import { usePlayerAnalytics } from "@/components/algorithms/usePlayerAnalytics";
import { usePredict, usePredictRound } from "@/components/algorithms/usePredict";
import { useStepShortcuts } from "@/components/algorithms/useStepShortcuts";
import { useSortingInput } from "@/components/algorithms/SortingInputProvider";
import TrackedLink from "@/components/analytics/TrackedLink";
import RunCompleteNudge from "@/components/engagement/RunCompleteNudge";
import { useCopyLink } from "@/components/engagement/useCopyLink";
import { SORTERS, SORTER_LIST } from "@/lib/algorithms/sorting";
import { ROLE_STYLES } from "@/lib/algorithms/roles";
import { sortPageFor } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";
import { encodeSort } from "@/lib/share";
import { embedSnippet } from "@/lib/embed";
import { track } from "@/lib/analytics";

const Kbd = ({ children }) => (
    <kbd className="px-1.5 py-0.5 rounded surface-muted border border-token font-mono text-[10px]">
        {children}
    </kbd>
);

export default function SortingVisualizer({ algo: algoKey }) {
    const { size, values, sharedStep, predict, setPredict, applyPreset, shuffle, changeSize, applyCustom } =
        useSortingInput();
    const page = sortPageFor(algoKey);

    const sorter = SORTERS[algoKey];
    const steps = useMemo(() => sorter.run(values).steps, [sorter, values]);
    const shared = sharedStep?.path === page.path ? sharedStep : null;
    const quiz = usePredict(steps, predict);
    const startIndex = !quiz.active && shared ? shared.index : 0;
    const basePlayer = usePlayer(steps, startIndex, { limit: quiz.limit, onRestart: quiz.restart });
    const [copied, copy] = useCopyLink();
    const [embedCopied, copyEmbed] = useCopyLink();
    const [challengeCopied, copyChallenge] = useCopyLink();
    const player = usePlayerAnalytics(basePlayer, "sorting", algoKey);
    const round = usePredictRound(quiz, player, { tool: "sorting", algo: algoKey, setOn: setPredict, shared });
    const step = player.step;
    const pageUrl = `${siteConfig.url}${page.path}`;
    const hashAt = (index) => encodeSort({ values, step: index, predict: quiz.active });

    const shareStep = () => {
        track("share_click", { tool: "sorting", algo: algoKey, from: quiz.active ? "predict" : "player" });
        copy(`${pageUrl}${hashAt(player.index)}`);
    };
    const embedCode = () => {
        track("embed_click", { tool: "sorting", algo: algoKey, from: "player" });
        copyEmbed(embedSnippet({ url: pageUrl, hash: hashAt(player.index), title: `${page.name} · ${siteConfig.shortName}` }));
    };
    const shareChallenge = () => {
        track("share_click", { tool: "sorting", algo: algoKey, from: "predict_summary" });
        copyChallenge(`${pageUrl}${hashAt(0)}`);
    };

    const stageRef = useStepShortcuts(player, round.keys);

    return (
        <>
            <nav
                aria-label="Sorting algorithm"
                className="flex flex-wrap justify-center gap-2 mb-3"
            >
                {SORTER_LIST.map((s) => (
                    <TrackedLink
                        key={s.key}
                        href={sortPageFor(s.key).path}
                        scroll={false}
                        event="algo_select"
                        params={{ tool: "sorting", algo: s.key }}
                        aria-current={algoKey === s.key ? "page" : undefined}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium border transition-all focus-ring hover:scale-105 active:scale-95",
                            algoKey === s.key
                                ? "bg-accent text-white border-accent shadow-md"
                                : "surface text-muted hover:text-text"
                        )}
                    >
                        {s.label}
                    </TrackedLink>
                ))}
            </nav>
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
                        {quiz.available && (
                            <PredictBar active={quiz.active} score={quiz.score} onChange={round.chooseMode} />
                        )}
                        <BarChart
                            array={step.array}
                            highlights={step.highlights}
                            pointers={step.pointers}
                            done={player.atEnd}
                        />
                        <VarChips vars={step.vars} />
                        <StatsRow stats={step.stats} message={round.message}>
                            {quiz.active && (
                                <PredictPanel
                                    ask={round.ask}
                                    result={round.result}
                                    number={round.number}
                                    total={quiz.score.total}
                                    onAnswer={round.answer}
                                />
                            )}
                        </StatsRow>
                        <PlayerControls
                            player={player}
                            onShare={shareStep}
                            shareLabel={
                                copied ? "Link copied" : quiz.active ? "Copy challenge link" : "Copy link to this step"
                            }
                            onEmbed={embedCode}
                            embedLabel={embedCopied ? "Embed code copied" : "Copy embed code"}
                        />
                        {quiz.active ? (
                            <PredictSummary
                                show={player.atEnd}
                                score={quiz.score}
                                onRetry={player.play}
                                onShuffle={shuffle}
                                onCopy={shareChallenge}
                                copied={challengeCopied}
                            />
                        ) : (
                            <RunCompleteNudge
                                show={player.atEnd && player.total > 1}
                                tool="sorting"
                                algo={algoKey}
                                url={`${pageUrl}${encodeSort({ values })}`}
                            />
                        )}
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
                {quiz.active && (
                    <>
                        {" "}
                        · <Kbd>Y</Kbd> <Kbd>N</Kbd> answer
                    </>
                )}
            </p>

            <div className="mt-5">
                <SortingLearn algo={algoKey} />
            </div>
        </>
    );
}

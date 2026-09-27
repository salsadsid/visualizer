"use client";
import { cn } from "@/lib/cn";
import { YES_NO } from "@/lib/predict";

function Verdict({ result }) {
    if (!result) return null;
    if (result.correct) {
        return <span className="font-semibold text-emerald-700 dark:text-emerald-400">✓ Right</span>;
    }
    return (
        <span className="font-semibold text-red-700 dark:text-red-400">
            ✗ Not quite: it was {result.ask.choices[result.ask.answer]}
        </span>
    );
}

export default function PredictPanel({ ask, result, number, total, onAnswer }) {
    const choices = ask?.choices ?? result?.ask.choices ?? YES_NO;
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                {choices.map((choice, i) => {
                    const key = choice[0].toUpperCase();
                    return (
                        <button
                            key={choice}
                            type="button"
                            onClick={() => onAnswer(i)}
                            aria-disabled={!ask || undefined}
                            aria-keyshortcuts={key}
                            className={cn(
                                "h-12 inline-flex items-center justify-center gap-2 rounded-xl border text-base font-semibold transition-colors focus-ring",
                                ask
                                    ? "bg-accent-soft text-accent border-accent/30 hover:border-accent"
                                    : "surface-muted text-subtle border-token cursor-not-allowed"
                            )}
                        >
                            {choice}
                            <kbd aria-hidden="true" className="max-sm:hidden px-1.5 py-0.5 rounded border border-token font-mono text-[10px] text-subtle">
                                {key}
                            </kbd>
                        </button>
                    );
                })}
            </div>
            <div className="min-h-5 flex flex-wrap items-center justify-center gap-x-2 text-xs text-center">
                {ask && (
                    <span className="text-subtle tabular-nums">
                        Question {number} of {total}
                    </span>
                )}
                {!ask && !result && (
                    <span className="text-subtle">
                        Press Play. The player stops at every decision: answer with the buttons or Y and N.
                    </span>
                )}
                <span role="status">{!ask && <Verdict result={result} />}</span>
            </div>
        </div>
    );
}

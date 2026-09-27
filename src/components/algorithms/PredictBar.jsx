"use client";
import ToggleGroup from "@/components/algorithms/ToggleGroup";

const MODES = [
    { id: "watch", label: "Watch" },
    { id: "predict", label: "Predict" },
];

export default function PredictBar({ active, score, onChange }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <ToggleGroup label="Mode" options={MODES} value={active ? "predict" : "watch"} onChange={onChange} />
            {active ? (
                <p className="text-xs text-muted tabular-nums">
                    {score.answered === 0 ? (
                        `${score.total} questions this round`
                    ) : (
                        <>
                            <span className="font-semibold text-text">{score.correct}</span> of {score.answered} right
                            {score.streak > 1 && ` · streak ${score.streak}`}
                        </>
                    )}
                </p>
            ) : (
                <p className="text-xs text-subtle max-sm:hidden">Guess each decision before it happens.</p>
            )}
        </div>
    );
}

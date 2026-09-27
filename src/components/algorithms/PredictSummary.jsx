"use client";
import TrackedLink from "@/components/analytics/TrackedLink";
import { siteConfig } from "@/lib/site";

const headline = (accuracy) => {
    if (accuracy === 100) return "Perfect round.";
    if (accuracy >= 80) return "Sharp predictions.";
    if (accuracy >= 50) return "Good instincts.";
    return "Every miss teaches the rule.";
};

const ACTION = "font-medium text-accent hover:text-accent-hover focus-ring rounded";

export default function PredictSummary({ show, score, onRetry, onShuffle, onCopy, copied }) {
    if (!show) return null;
    return (
        <div className="rounded-xl bg-accent-soft border border-accent/20 px-4 py-3 space-y-2 text-center animate-fade-in-up">
            <p role="status" className="text-sm text-text">
                <span className="font-semibold">
                    {score.correct} of {score.total} right ({score.accuracy}%)
                </span>
                <span className="text-muted">
                    {" "}
                    · best streak {score.best}. {headline(score.accuracy)}
                </span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                <button type="button" onClick={onRetry} className={ACTION}>
                    Try again
                </button>
                <button type="button" onClick={onShuffle} className={ACTION}>
                    New array
                </button>
                <button type="button" onClick={onCopy} className={ACTION}>
                    <span aria-live="polite">{copied ? "Link copied" : "Copy challenge link"}</span>
                </button>
                <TrackedLink
                    external
                    event="github_click"
                    params={{ from: "predict_summary" }}
                    href={siteConfig.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-accent hover:text-accent-hover"
                >
                    <span aria-hidden="true" className="text-amber-500">★</span>
                    Star on GitHub
                </TrackedLink>
            </div>
        </div>
    );
}

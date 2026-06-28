"use client";
import { cn } from "@/lib/cn";
import { SPEEDS } from "./usePlayer";

function ControlButton({ onClick, label, disabled, primary, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={cn(
                "grid place-items-center rounded-xl transition-all focus-ring disabled:opacity-40 disabled:cursor-not-allowed",
                primary
                    ? "h-11 w-11 bg-accent text-white hover:bg-accent-hover shadow-sm hover:scale-105"
                    : "h-10 w-10 surface-muted text-muted hover:text-text"
            )}
        >
            {children}
        </button>
    );
}

const Icon = ({ d, className }) => (
    <svg
        className={className || "w-5 h-5"}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d={d} />
    </svg>
);

const PATHS = {
    play: "M8 5v14l11-7z",
    pause: "M6 5h4v14H6zM14 5h4v14h-4z",
    stepF: "M6 5l9 7-9 7zM17 5h2v14h-2z",
    stepB: "M18 5l-9 7 9 7zM5 5h2v14H5z",
    reset:
        "M12 5V2L7 7l5 5V8a6 6 0 11-6 6H4a8 8 0 108-9z",
};

export default function PlayerControls({ player }) {
    const {
        index,
        total,
        playing,
        atEnd,
        atStart,
        toggle,
        stepF,
        stepB,
        reset,
        seek,
        speed,
        setSpeed,
    } = player;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <input
                    type="range"
                    min={0}
                    max={Math.max(0, total - 1)}
                    value={index}
                    onChange={(e) => seek(Number(e.target.value))}
                    aria-label="Scrub through steps"
                    className="flex-1 cursor-pointer accent-[var(--accent)]"
                />
                <span className="text-xs font-mono text-subtle tabular-nums whitespace-nowrap">
                    {index + 1} / {total}
                </span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                    <ControlButton onClick={reset} label="Reset" disabled={atStart && !playing}>
                        <Icon d={PATHS.reset} />
                    </ControlButton>
                    <ControlButton onClick={stepB} label="Step back" disabled={atStart}>
                        <Icon d={PATHS.stepB} />
                    </ControlButton>
                    <ControlButton onClick={toggle} label={playing ? "Pause" : "Play"} primary>
                        <Icon d={playing ? PATHS.pause : PATHS.play} className="w-6 h-6" />
                    </ControlButton>
                    <ControlButton onClick={stepF} label="Step forward" disabled={atEnd}>
                        <Icon d={PATHS.stepF} />
                    </ControlButton>
                </div>

                <div
                    className="inline-flex gap-1 p-1 rounded-lg surface-muted"
                    role="group"
                    aria-label="Playback speed"
                >
                    {SPEEDS.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setSpeed(s)}
                            aria-pressed={speed === s}
                            className={cn(
                                "px-2 py-1 text-xs font-medium rounded-md transition-colors focus-ring",
                                speed === s
                                    ? "bg-bg-elevated text-text shadow-sm border border-token"
                                    : "text-muted hover:text-text"
                            )}
                        >
                            {s}×
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

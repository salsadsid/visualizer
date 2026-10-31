"use client";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { SPEEDS } from "./usePlayer";

const SHORTCUT_HELP_IGNORE_TARGETS = "input, textarea, select, [contenteditable]";

function ControlButton({ onClick, label, disabled, blocked, primary, children }) {
    return (
        <button
            type="button"
            autoComplete="off"
            onClick={onClick}
            disabled={disabled}
            aria-disabled={blocked || undefined}
            aria-label={label}
            title={label}
            className={cn(
                "grid place-items-center rounded-xl transition-all focus-ring disabled:opacity-40 disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:cursor-not-allowed",
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

const Kbd = ({ children }) => (
    <kbd className="px-1.5 py-0.5 rounded surface-muted border border-token font-mono text-[10px]">
        {children}
    </kbd>
);

function ShortcutHelp({ shortcuts }) {
    const [open, setOpen] = useState(false);
    const popoverId = useId();
    const containerRef = useRef(null);

    useEffect(() => {
        const toggleOnQuestionMark = (event) => {
            if (
                event.key !== "?" ||
                event.repeat ||
                event.isComposing ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey ||
                event.target?.closest?.(SHORTCUT_HELP_IGNORE_TARGETS)
            ) {
                return;
            }

            event.preventDefault();
            setOpen((shown) => !shown);
        };

        document.addEventListener("keydown", toggleOnQuestionMark);
        return () => document.removeEventListener("keydown", toggleOnQuestionMark);
    }, []);

    useEffect(() => {
        if (!open) return;

        const closeOnEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        const closeOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) setOpen(false);
        };

        document.addEventListener("keydown", closeOnEscape);
        document.addEventListener("pointerdown", closeOutside);

        return () => {
            document.removeEventListener("keydown", closeOnEscape);
            document.removeEventListener("pointerdown", closeOutside);
        };
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((shown) => !shown)}
                aria-label="Keyboard shortcuts"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? popoverId : undefined}
                aria-keyshortcuts="Shift+/"
                title="Keyboard shortcuts (Shift+/)"
                className="grid h-9 w-9 place-items-center rounded-lg surface-muted text-sm font-semibold text-muted transition-colors hover:text-text focus-ring"
            >
                ?
            </button>

            {open && (
                <div
                    id={popoverId}
                    role="dialog"
                    aria-label="Keyboard shortcuts"
                    className="absolute bottom-full right-0 z-30 mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl surface p-3 shadow-lg"
                >
                    <p className="mb-2 text-xs font-semibold text-text">
                        Keyboard shortcuts
                    </p>

                    <ul className="space-y-2">
                        {shortcuts.map(({ keys, label }) => (
                            <li
                                key={`${keys.join("-")}-${label}`}
                                className="flex items-center justify-between gap-4 text-xs text-muted"
                            >
                                <span>{label}</span>
                                <span className="flex shrink-0 items-center gap-1">
                                    {keys.map((key) => (
                                        <Kbd key={key}>{key}</Kbd>
                                    ))}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const PATHS = {
    play: "M8 5v14l11-7z",
    pause: "M6 5h4v14H6zM14 5h4v14h-4z",
    stepF: "M6 5l9 7-9 7zM17 5h2v14h-2z",
    stepB: "M18 5l-9 7 9 7zM5 5h2v14H5z",
    reset:
        "M12 5V2L7 7l5 5V8a6 6 0 11-6 6H4a8 8 0 108-9z",
    link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
    code: "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6 1.4 1.4z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
};

export default function PlayerControls({
    player,
    onShare,
    shareLabel = "Copy link",
    onEmbed,
    embedLabel = "Copy embed code",
    onExport,
    exportLabel = "Export as PNG",
    shortcuts,
}) {
    const {
        index,
        total,
        playing,
        atEnd,
        atStart,
        atLimit,
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

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
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
                        <ControlButton
                            onClick={stepF}
                            label={atLimit ? "Answer the question to go on" : "Step forward"}
                            disabled={atEnd}
                            blocked={atLimit}
                        >
                            <Icon d={PATHS.stepF} />
                        </ControlButton>
                    </div>
                    {(onShare || onEmbed || onExport) && (
                        <div className="flex items-center gap-1.5">
                            {onShare && (
                                <ControlButton onClick={onShare} label={shareLabel}>
                                    <Icon d={PATHS.link} />
                                </ControlButton>
                            )}
                            {onEmbed && (
                                <ControlButton onClick={onEmbed} label={embedLabel}>
                                    <Icon d={PATHS.code} />
                                </ControlButton>
                            )}
                            {onExport && (
                                <ControlButton onClick={onExport} label={exportLabel}>
                                    <Icon d={PATHS.download} />
                                </ControlButton>
                            )}
                        </div>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-1.5">
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

                    {shortcuts?.length > 0 && <ShortcutHelp shortcuts={shortcuts} />}
                </div>
            </div>
        </div>
    );
}

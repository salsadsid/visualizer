"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
    ARRAY_PRESETS,
    MIN_SIZE,
    MAX_SIZE,
    parseArrayInput,
} from "@/lib/algorithms/presets";

export default function ArrayControls({
    size,
    onSize,
    onPreset,
    onShuffle,
    onCustom,
}) {
    const [text, setText] = useState("");
    const [error, setError] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        const result = parseArrayInput(text);
        if (result.error) {
            setError(result.error);
            return;
        }
        setError(null);
        onCustom(result.values);
    };

    return (
        <div className="surface rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-subtle uppercase tracking-wide mr-1">
                    Data
                </span>
                {Object.entries(ARRAY_PRESETS).map(([key, p]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onPreset(key)}
                        className="px-2.5 py-1 text-xs font-medium rounded-md surface-muted text-muted hover:text-text border border-token focus-ring transition-colors"
                    >
                        {p.label}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={onShuffle}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-accent-soft text-accent border border-accent/30 hover:bg-accent/15 focus-ring transition-colors inline-flex items-center gap-1"
                >
                    🎲 Shuffle
                </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="flex items-center gap-3 text-sm text-muted">
                    <span className="whitespace-nowrap">
                        Size{" "}
                        <span className="font-mono text-text tabular-nums">{size}</span>
                    </span>
                    <input
                        type="range"
                        min={MIN_SIZE}
                        max={MAX_SIZE}
                        value={size}
                        onChange={(e) => onSize(Number(e.target.value))}
                        aria-label="Array size"
                        className="w-32 sm:w-40 cursor-pointer accent-[var(--accent)]"
                    />
                </label>

                <form onSubmit={submit} className="flex-1 flex items-center gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste, e.g. [5, 3, 8, 1, 9, 2]"
                        spellCheck="false"
                        aria-label="Custom numbers"
                        className="flex-1 min-w-0 font-mono text-sm px-3 py-2 rounded-lg bg-bg-subtle border border-token text-text placeholder:text-subtle/60 focus-ring"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover focus-ring transition-colors whitespace-nowrap"
                    >
                        Use
                    </button>
                </form>
            </div>

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}

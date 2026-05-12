"use client";
import { PRESETS, ACCENT_CLASSES } from "@/lib/array/presets";
import { cn } from "@/lib/cn";

export default function InputPanel({ value, error, onChange, onPreset }) {
    return (
        <div className="surface rounded-2xl p-5 flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    Input
                </h3>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded surface-muted text-subtle">
                    JSON
                </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onPreset(key)}
                        className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-md transition-colors focus-ring",
                            ACCENT_CLASSES[preset.accent]
                        )}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div className="relative flex-grow min-h-0">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`[\n  [1, 0, 0],\n  [0, 1, 0],\n  [0, 0, 1]\n]`}
                    spellCheck="false"
                    className={cn(
                        "w-full h-full font-mono text-sm leading-relaxed p-4 rounded-xl resize-none transition-all custom-scrollbar focus-ring",
                        "bg-bg-subtle border border-token",
                        "text-text placeholder:text-subtle/60"
                    )}
                />
            </div>

            {error && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-2 text-red-700 dark:text-red-300 text-xs">
                    <svg
                        className="w-4 h-4 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

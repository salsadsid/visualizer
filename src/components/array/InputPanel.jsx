"use client";
import { PRESETS, ACCENT_CLASSES } from "@/lib/array/presets";
import TrackedLink from "@/components/analytics/TrackedLink";
import { cn } from "@/lib/cn";

const FORMAT_LABELS = { json: "JSON", rows: "Rows", python: "Python" };

export default function InputPanel({
    value,
    error,
    note,
    noteLink,
    format,
    onChange,
    onPreset,
    onShare,
    shareTitle,
    copied,
    onEmbed,
    embedCopied,
    onExport,
}) {
    return (
        <div className="surface rounded-2xl p-5 flex flex-col h-full shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    Input
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded surface-muted text-subtle">
                        {FORMAT_LABELS[format] || "JSON"}
                    </span>
                    <button
                        type="button"
                        onClick={onShare ?? undefined}
                        disabled={!onShare}
                        title={shareTitle}
                        aria-label={copied ? "Link copied" : "Copy link"}
                        className="inline-flex items-center whitespace-nowrap gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md surface-muted text-muted hover:text-text transition-colors focus-ring disabled:opacity-50 disabled:hover:text-muted"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 10.5a4 4 0 010 5.66l-2.34 2.34a4 4 0 01-5.66-5.66l1.17-1.17M10.5 13.5a4 4 0 010-5.66l2.34-2.34a4 4 0 015.66 5.66l-1.17 1.17"
                            />
                        </svg>
                        <span aria-live="polite" className="max-sm:sr-only">{copied ? "Copied" : "Copy link"}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onEmbed ?? undefined}
                        disabled={!onEmbed}
                        title={onEmbed ? "Copy an iframe snippet for this grid" : "Type or pick a grid first"}
                        aria-label={embedCopied ? "Embed code copied" : "Copy embed code"}
                        className="inline-flex items-center whitespace-nowrap gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md surface-muted text-muted hover:text-text transition-colors focus-ring disabled:opacity-50 disabled:hover:text-muted"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                        </svg>
                        <span aria-live="polite" className="max-sm:sr-only">{embedCopied ? "Copied" : "Embed"}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onExport ?? undefined}
                        disabled={!onExport}
                        title={onExport ? "Download this grid as a PNG image" : "Type or pick a grid first"}
                        aria-label="Export as PNG"
                        className="inline-flex items-center whitespace-nowrap gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md surface-muted text-muted hover:text-text transition-colors focus-ring disabled:opacity-50 disabled:hover:text-muted"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                        </svg>
                        <span className="max-sm:sr-only">PNG</span>
                    </button>
                </div>
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
                        // Pinned to 14px rather than text-sm: the raised scale makes a
                        // 34-char grid row wrap in the 400px panel, breaking the
                        // one-row-per-line layout that mirrors the rendered grid.
                        "w-full h-full font-mono text-[14px] leading-relaxed p-4 rounded-xl resize-none transition-all custom-scrollbar focus-ring",
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

            {!error && note && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-accent-soft border border-accent/20 flex items-start gap-2 text-accent text-xs">
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>
                        {note}
                        {noteLink && (
                            <>
                                {" "}
                                <TrackedLink
                                    href={noteLink.href}
                                    scroll={false}
                                    onClick={() => window.scrollTo(0, 0)}
                                    event="tool_open"
                                    params={noteLink.params}
                                    className="font-medium underline underline-offset-2 hover:text-accent-hover"
                                >
                                    {noteLink.label}
                                </TrackedLink>
                            </>
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}

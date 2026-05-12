"use client";
import { cellKey, displayValue, uniqueValues } from "@/lib/array/parser";

function Swatch({ label, value, onChange, defaultValue }) {
    return (
        <label className="group flex items-center gap-3 surface-muted rounded-xl p-3 hover:border-accent/40 transition-colors cursor-pointer">
            <span className="relative h-8 w-8 rounded-lg overflow-hidden ring-1 ring-token group-hover:ring-accent/40 transition-all">
                <input
                    type="color"
                    defaultValue={defaultValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 -m-2 h-[150%] w-[150%] cursor-pointer p-0 border-0"
                />
            </span>
            <div className="flex flex-col min-w-0">
                <span className="text-xs text-subtle font-medium uppercase tracking-wide">
                    {label}
                </span>
                <span className="text-sm font-mono text-muted truncate">
                    {value || "default"}
                </span>
            </div>
        </label>
    );
}

export default function ColorSettings({ matrix, colors, onColorChange, showIndices, onToggleIndices }) {
    const values = uniqueValues(matrix);

    return (
        <div className="surface rounded-2xl p-5 md:p-6 shadow-sm animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 md:border-r md:border-token md:pr-6">
                    <h3 className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">
                        Base styling
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                        <Swatch
                            label="Border"
                            value={colors.__border}
                            defaultValue="#000000"
                            onChange={(v) => onColorChange("__border", v)}
                        />
                        <Swatch
                            label="Text"
                            value={colors.__text}
                            defaultValue="#ffffff"
                            onChange={(v) => onColorChange("__text", v)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onToggleIndices}
                        className="mt-4 w-full text-xs font-medium px-3 py-2 rounded-lg surface-muted hover:border-accent/40 transition-colors text-muted"
                    >
                        {showIndices ? "Hide" : "Show"} indices
                    </button>
                </div>

                <div className="md:w-2/3">
                    <h3 className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">
                        Element colors
                        <span className="ml-2 font-mono normal-case text-subtle/70">
                            ({values.length} unique)
                        </span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {values.map((value, i) => {
                            const k = cellKey(value);
                            return (
                                <Swatch
                                    key={i}
                                    label={`Value: ${displayValue(value)}`}
                                    value={colors[k]}
                                    defaultValue="#6366f1"
                                    onChange={(v) => onColorChange(k, v)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

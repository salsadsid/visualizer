"use client";
import { cn } from "@/lib/cn";

export default function ToggleGroup({ label, options, value, onChange }) {
    return (
        <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg surface-muted" role="group" aria-label={label}>
            {options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange(option.id)}
                    aria-pressed={value === option.id}
                    className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-colors focus-ring",
                        value === option.id
                            ? "bg-bg-elevated text-text shadow-sm border border-token"
                            : "text-muted hover:text-text"
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

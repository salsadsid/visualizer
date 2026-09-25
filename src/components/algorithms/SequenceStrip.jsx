"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export default function SequenceStrip({ label, items, render = String, placeholder = "Nothing yet" }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollLeft = el.scrollWidth;
    }, [items.length]);

    return (
        <div className="flex items-center gap-2 min-h-[2.25rem]">
            <span className="shrink-0 text-[10px] uppercase tracking-wide text-subtle">{label}</span>
            <div
                ref={scrollRef}
                className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1"
            >
                {items.length === 0 ? (
                    <span className="text-xs text-subtle/70">{placeholder}</span>
                ) : (
                    items.map((item, index) => (
                        <span
                            key={index}
                            className={cn(
                                "shrink-0 min-w-7 px-2 py-1 rounded-md text-xs font-mono text-center transition-colors",
                                index === items.length - 1
                                    ? "bg-emerald-500 text-white font-semibold"
                                    : "surface-muted text-text"
                            )}
                        >
                            {render(item)}
                        </span>
                    ))
                )}
            </div>
        </div>
    );
}

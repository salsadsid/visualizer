"use client";
import { cn } from "@/lib/cn";
import { pointerClass } from "@/lib/algorithms/roles";

export default function BoxRow({ values, cells, pointers, roleClass }) {
    const marks = {};
    for (const [name, idx] of Object.entries(pointers || {})) {
        (marks[idx] ||= []).push(name);
    }
    return (
        <div className="overflow-x-auto custom-scrollbar">
            <div className="flex justify-center gap-1.5 sm:gap-2 min-w-max px-1 py-1">
                {values.map((value, idx) => {
                    const role = cells?.[idx];
                    return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                            <div
                                className={cn(
                                    "grid place-items-center h-9 w-9 sm:h-11 sm:w-11 rounded-lg text-sm font-mono font-semibold transition-all duration-200",
                                    role ? roleClass(role) : "surface-muted text-subtle"
                                )}
                            >
                                {value}
                            </div>
                            <div className="h-4 text-[11px] font-mono font-bold leading-none">
                                {marks[idx] ? (
                                    <span className={pointerClass(marks[idx][0])}>
                                        ▲{marks[idx].join(",")}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

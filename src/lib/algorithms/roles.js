// Visual roles a bar can take during a sorting animation. Each maps to a Tailwind
// background class (works in light + dark) plus a human label for the legend.
export const ROLE_STYLES = {
    default: { bar: "bg-gradient-to-t from-indigo-500 to-violet-400", label: "Unsorted" },
    compare: { bar: "bg-gradient-to-t from-amber-500 to-amber-300", label: "Comparing" },
    swap: { bar: "bg-gradient-to-t from-rose-600 to-rose-400", label: "Swapping" },
    min: { bar: "bg-gradient-to-t from-violet-600 to-violet-400", label: "Current min" },
    key: { bar: "bg-gradient-to-t from-fuchsia-600 to-fuchsia-400", label: "Key" },
    shift: { bar: "bg-gradient-to-t from-sky-500 to-sky-300", label: "Shifting" },
    sorted: { bar: "bg-gradient-to-t from-emerald-600 to-emerald-400", label: "Sorted" },
};

export function barClass(role) {
    return (ROLE_STYLES[role] || ROLE_STYLES.default).bar;
}

// Text colours for the pointer markers (▲ i / j / min …) drawn under the bars.
// Loosely echoes the bar roles: j ≈ comparing (amber), min ≈ current-min (violet).
export const POINTER_STYLES = {
    i: "text-sky-600 dark:text-sky-400",
    j: "text-amber-600 dark:text-amber-400",
    min: "text-violet-600 dark:text-violet-400",
    key: "text-fuchsia-600 dark:text-fuchsia-400",
    mid: "text-sky-600 dark:text-sky-400",
    left: "text-sky-600 dark:text-sky-400",
    right: "text-amber-600 dark:text-amber-400",
};

export function pointerClass(name) {
    return POINTER_STYLES[name] || "text-accent";
}

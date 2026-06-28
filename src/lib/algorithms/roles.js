// Visual roles a bar can take during a sorting animation. Each maps to a Tailwind
// background class (works in light + dark) plus a human label for the legend.
export const ROLE_STYLES = {
    default: { bar: "bg-accent", label: "Unsorted" },
    compare: { bar: "bg-amber-400 dark:bg-amber-500", label: "Comparing" },
    swap: { bar: "bg-rose-500", label: "Swapping" },
    min: { bar: "bg-violet-500", label: "Current min" },
    key: { bar: "bg-fuchsia-500", label: "Key" },
    shift: { bar: "bg-sky-400 dark:bg-sky-500", label: "Shifting" },
    sorted: { bar: "bg-emerald-500", label: "Sorted" },
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

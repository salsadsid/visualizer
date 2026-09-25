export const BOX_ROLES = {
    current: {
        cell: "bg-amber-400 text-slate-900 border border-amber-500 shadow-sm scale-105",
        swatch: "bg-amber-400",
        label: "Looking here",
    },
    found: {
        cell: "bg-emerald-500 text-slate-900 border border-emerald-600 shadow-sm scale-105",
        swatch: "bg-emerald-500",
        label: "Found",
    },
    done: {
        cell: "bg-emerald-500 text-slate-900 border border-emerald-600",
        swatch: "bg-emerald-500",
        label: "In place",
    },
    shift: {
        cell: "bg-sky-300 text-slate-900 border border-sky-500 shadow-sm",
        swatch: "bg-sky-300",
        label: "Shifted",
    },
    write: {
        cell: "bg-fuchsia-400 text-slate-900 border border-fuchsia-600 shadow-sm scale-105",
        swatch: "bg-fuchsia-400",
        label: "Written",
    },
    remove: {
        cell: "bg-rose-400 text-slate-900 border border-rose-500 shadow-sm scale-105",
        swatch: "bg-rose-400",
        label: "Removed",
    },
    pair: {
        cell: "bg-violet-400 text-slate-900 border border-violet-600 shadow-sm scale-105",
        swatch: "bg-violet-400",
        label: "Swapping",
    },
};

export const boxClass = (role) => BOX_ROLES[role]?.cell ?? "surface-muted text-subtle";

export const boxLabel = (role) => BOX_ROLES[role]?.label ?? role;

export const GRID_ROLES = {
    current: {
        cell: "bg-amber-400 text-slate-900 border-2 border-amber-500 scale-105 z-10",
        swatch: "bg-amber-400",
        label: "Visiting now",
    },
    turn: {
        cell: "bg-rose-400 text-slate-900 border-2 border-rose-500 scale-105 z-10",
        swatch: "bg-rose-400",
        label: "New direction",
    },
    visited: {
        cell: "bg-emerald-500 text-slate-900 border border-emerald-600",
        swatch: "bg-emerald-500",
        label: "Visited",
    },
    frontier: {
        cell: "bg-sky-300 text-slate-900 border border-sky-500",
        swatch: "bg-sky-300",
        label: "In the queue",
    },
    wall: {
        cell: "bg-slate-700 text-slate-100 border border-slate-800 dark:bg-slate-300 dark:text-slate-900 dark:border-slate-400",
        swatch: "bg-slate-700 dark:bg-slate-300",
        label: "Wall",
    },
    start: {
        cell: "bg-indigo-300 text-slate-900 border-2 border-indigo-500",
        swatch: "bg-indigo-300",
        label: "Start",
    },
    target: {
        cell: "bg-fuchsia-400 text-slate-900 border-2 border-fuchsia-600",
        swatch: "bg-fuchsia-400",
        label: "Target",
    },
    path: {
        cell: "bg-violet-400 text-slate-900 border border-violet-600",
        swatch: "bg-violet-400",
        label: "Shortest path",
    },
    land: {
        cell: "bg-lime-200 text-slate-900 border border-lime-500",
        swatch: "bg-lime-200",
        label: "Land",
    },
    "island-1": {
        cell: "bg-emerald-400 text-slate-900 border border-emerald-600",
        swatch: "bg-emerald-400",
        label: "Island",
    },
    "island-2": {
        cell: "bg-teal-300 text-slate-900 border border-teal-500",
        swatch: "bg-teal-300",
        label: "Island",
    },
    "island-3": {
        cell: "bg-orange-300 text-slate-900 border border-orange-500",
        swatch: "bg-orange-300",
        label: "Island",
    },
    "island-4": {
        cell: "bg-pink-300 text-slate-900 border border-pink-500",
        swatch: "bg-pink-300",
        label: "Island",
    },
    "island-5": {
        cell: "bg-yellow-300 text-slate-900 border border-yellow-500",
        swatch: "bg-yellow-300",
        label: "Island",
    },
};

export const ISLAND_COLOURS = 5;

export const islandRole = (n) => `island-${((n - 1) % ISLAND_COLOURS) + 1}`;

export const roleCell = (role) => GRID_ROLES[role]?.cell;

export const roleLabel = (role) => GRID_ROLES[role]?.label ?? role;

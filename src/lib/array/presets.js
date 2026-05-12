export const PRESETS = {
    identity: {
        label: "Identity",
        accent: "indigo",
        build: () => [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ],
    },
    zero: {
        label: "Zero",
        accent: "slate",
        build: () => [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    random: {
        label: "Random",
        accent: "emerald",
        build: () =>
            Array.from({ length: 3 }, () =>
                Array.from({ length: 3 }, () => Math.floor(Math.random() * 2))
            ),
    },
    string: {
        label: "String",
        accent: "purple",
        build: () => [
            ["A", "B"],
            ["C", "D"],
        ],
    },
    boolean: {
        label: "Bool",
        accent: "amber",
        build: () => [
            [true, false],
            [false, true],
        ],
    },
    chess: {
        label: "Chess",
        accent: "indigo",
        build: () => [
            ["R", "N", "B", "Q", "K", "B", "N", "R"],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", "."],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            ["r", "n", "b", "q", "k", "b", "n", "r"],
        ],
    },
};

export const ACCENT_CLASSES = {
    indigo:
        "bg-accent-soft text-accent border border-accent/30 hover:bg-accent/15",
    slate:
        "bg-bg-muted text-text-muted border border-token hover:bg-border",
    emerald:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    purple:
        "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20",
    amber:
        "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
};

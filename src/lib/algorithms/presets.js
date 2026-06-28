// Source-array presets and a parser for custom user input. Kept separate from the
// algorithms so any future visualizer can reuse the same data generators.

export const MIN_SIZE = 3;
export const MAX_SIZE = 24;
export const MIN_VALUE = 1;
export const MAX_VALUE = 99;

// Deterministic starting array so server and client render identically (no hydration
// mismatch). Users can Shuffle / pick Random for randomness after mount.
export const DEFAULT_VALUES = [8, 3, 12, 5, 9, 1, 6, 11, 2, 7];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

// A handful of distinct heights so "few unique" still looks varied as bars.
const FEW_UNIQUE_POOL = [14, 30, 46, 62];

export const ARRAY_PRESETS = {
    random: {
        label: "Random",
        build: (n) =>
            Array.from({ length: n }, () =>
                randInt(MIN_VALUE, clamp(n * 2, 20, MAX_VALUE))
            ),
    },
    reversed: {
        label: "Reversed",
        build: (n) => Array.from({ length: n }, (_, i) => n - i),
    },
    nearly: {
        label: "Nearly sorted",
        build: (n) => {
            const a = Array.from({ length: n }, (_, i) => i + 1);
            const swaps = Math.max(1, Math.floor(n / 6));
            for (let s = 0; s < swaps; s++) {
                const i = randInt(0, n - 1);
                const j = clamp(i + randInt(-1, 1), 0, n - 1);
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        },
    },
    fewUnique: {
        label: "Few unique",
        build: (n) =>
            Array.from(
                { length: n },
                () => FEW_UNIQUE_POOL[randInt(0, FEW_UNIQUE_POOL.length - 1)]
            ),
    },
    sorted: {
        label: "Sorted",
        build: (n) => Array.from({ length: n }, (_, i) => i + 1),
    },
};

// Parse a free-form string into { values, error }. Accepts bare lists ("5, 3, 8 1")
// and pasted array literals ("[5, 3, 8]", "(5; 3; 8)") — brackets/quotes are stripped.
export function parseArrayInput(raw) {
    if (!raw || !raw.trim()) {
        return {
            values: null,
            error: "The bars are waiting! 🎶 Drop in some numbers — try 5, 3, 8, 1.",
        };
    }
    const tokens = raw
        .replace(/[[\](){}'"]/g, " ")
        .split(/[\s,;]+/)
        .filter(Boolean);
    const values = [];
    for (const tok of tokens) {
        if (!/^\d+$/.test(tok)) {
            return {
                values: null,
                error: `"${tok}" isn't a whole number — decimals make the bar labels messy, so let's keep it crisp and tidy ✨`,
            };
        }
        const v = parseInt(tok, 10);
        if (v < MIN_VALUE || v > MAX_VALUE) {
            return {
                values: null,
                error: `Whoa, ${v} is off the charts! 📏 Heights are relative anyway, so keep values ${MIN_VALUE}–${MAX_VALUE} and the labels stay readable.`,
            };
        }
        values.push(v);
    }
    if (values.length < MIN_SIZE) {
        return {
            values: null,
            error: `A sort needs a little crowd to shuffle — toss in at least ${MIN_SIZE} numbers 👯`,
        };
    }
    if (values.length > MAX_SIZE) {
        return {
            values: null,
            error: `That's a stampede! 🐘 Keep it to ${MAX_SIZE} numbers or fewer so the bars stay nice and chunky.`,
        };
    }
    return { values, error: null };
}

export const PAD_TOKEN = "·";

export function parseInput(raw) {
    if (!raw || raw.trim() === "") {
        return { matrix: [], maxLen: 0, error: null };
    }

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (_) {
        return {
            matrix: [],
            maxLen: 0,
            error: "Hmm, that doesn't parse — check your brackets and commas. Try: [[1, 0], [0, 1]] ✏️",
        };
    }

    if (!Array.isArray(parsed)) {
        return {
            matrix: [],
            maxLen: 0,
            error: "Almost! A grid needs square brackets around it — [[1, 2], [3, 4]] is 2 rows of 2.",
        };
    }

    if (parsed.length === 0) {
        return { matrix: [], maxLen: 0, error: null };
    }

    const is2D = parsed.every((row) => Array.isArray(row));
    if (!is2D) {
        return {
            matrix: [],
            maxLen: 0,
            error: "Almost! Wrap each row in its own brackets — [[1, 2], [3, 4]] is 2 rows of 2.",
        };
    }

    const validCell = (v) =>
        typeof v === "number" ||
        typeof v === "string" ||
        typeof v === "boolean" ||
        v === null;

    const hasInvalid = parsed.some((row) => row.some((c) => !validCell(c)));
    if (hasInvalid) {
        return {
            matrix: [],
            maxLen: 0,
            error: 'Cells can hold numbers, text, true/false, or null — nothing fancier. Try: [["a", 1], [true, null]] ✏️',
        };
    }

    const maxLen = parsed.reduce((acc, row) => Math.max(acc, row.length), 0);

    const padded = parsed.map((row) => {
        if (row.length === maxLen) return [...row];
        return [...row, ...Array(maxLen - row.length).fill(PAD_TOKEN)];
    });

    return { matrix: padded, maxLen, error: null };
}

export function uniqueValues(matrix) {
    const seen = new Set();
    const result = [];
    for (const row of matrix) {
        for (const cell of row) {
            if (cell === PAD_TOKEN) continue;
            const key = typeof cell === "boolean" ? `__b_${cell}` : cell;
            if (!seen.has(key)) {
                seen.add(key);
                result.push(cell);
            }
        }
    }
    return result;
}

export function displayValue(cell) {
    if (typeof cell === "boolean") return cell ? "T" : "F";
    if (cell === null) return "∅";
    return String(cell);
}

export function cellKey(cell) {
    if (typeof cell === "boolean") return `__b_${cell}`;
    if (cell === null) return "__null";
    return cell;
}

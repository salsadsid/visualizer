export const PAD_TOKEN = "·";

const JSON_ERROR =
    "Hmm, that doesn't parse — check your brackets and commas. Try: [[1, 0], [0, 1]] ✏️";

const empty = () => ({ matrix: [], maxLen: 0, error: null, note: null, format: null });
const fail = (error) => ({ matrix: [], maxLen: 0, error, note: null, format: null });

const validCell = (v) =>
    typeof v === "number" || typeof v === "string" || typeof v === "boolean" || v === null;

const WORDS = { true: true, True: true, false: false, False: false, null: null, None: null };

function readToken(token) {
    if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);
    if (token in WORDS) return WORDS[token];
    return token;
}

function splitLine(line) {
    const parts = line.includes("\t") ? line.split("\t") : line.split(/[\s,;]+/);
    return parts.map((part) => part.trim()).filter(Boolean).map(readToken);
}

function parseRows(text) {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    let rows = lines.map(splitLine);
    const total = rows.reduce((count, row) => count + row.length, 0);
    if (total < 2) return null;

    let header = null;
    const [first, ...body] = rows;
    if (body.length > 0 && first.length === 2 && first.every((v) => Number.isInteger(v) && v > 0)) {
        const [n, m] = first;
        if (body.length === n && body.every((row) => row.length === m)) {
            rows = body;
            header = `${n} × ${m}`;
        }
    }
    const separator = lines.some((line) => line.includes("\t")) ? "tab" : "space";
    return { rows, header, separator };
}

const LITERALS = new Map([
    ["True", "true"],
    ["False", "false"],
    ["None", "null"],
]);

function loosen(text) {
    let out = "";
    let quote = null;
    const changed = { quotes: false, literals: false, commas: false };
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (quote) {
            if (ch === "\\") {
                const next = text[i + 1] ?? "";
                out += next === "'" ? "'" : ch + next;
                i++;
            } else if (ch === quote) {
                out += '"';
                quote = null;
            } else {
                out += ch === '"' ? '\\"' : ch;
            }
            continue;
        }
        if (ch === "'" || ch === '"') {
            if (ch === "'") changed.quotes = true;
            quote = ch;
            out += '"';
        } else if (/[A-Za-z_]/.test(ch)) {
            let end = i + 1;
            while (end < text.length && /\w/.test(text[end])) end++;
            const word = text.slice(i, end);
            if (LITERALS.has(word)) changed.literals = true;
            out += LITERALS.get(word) ?? word;
            i = end - 1;
        } else if (ch === "," && /^\s*[\]}]/.test(text.slice(i + 1))) {
            changed.commas = true;
        } else {
            out += ch;
        }
    }
    return { text: out, changed };
}

function describeLoose({ quotes, literals, commas }) {
    if (quotes || literals) return "Read Python-style input (single quotes, True/False/None).";
    if (commas) return "Ignored a trailing comma.";
    return null;
}

function describeRows({ rows, header, separator }, maxLen) {
    if (rows.length === 1) {
        return `Read as a single row of ${maxLen} values. Add more lines to build a grid.`;
    }
    const size = `Read as a ${rows.length} × ${maxLen} grid from ${separator}-separated rows.`;
    return header ? `${size} The first line was read as the size (${header}).` : size;
}

export function parseInput(raw) {
    if (!raw || raw.trim() === "") return empty();
    const text = raw.trim();

    let parsed;
    let format = "json";
    let note = null;
    let rows = null;
    let looseNote = null;
    try {
        parsed = JSON.parse(text);
    } catch (_) {
        if (/[[{]/.test(text)) {
            const loose = loosen(text);
            try {
                parsed = JSON.parse(loose.text);
            } catch (__) {
                return fail(JSON_ERROR);
            }
            if (loose.changed.quotes || loose.changed.literals) format = "python";
            looseNote = describeLoose(loose.changed);
        } else {
            rows = parseRows(text);
            if (!rows) return fail(JSON_ERROR);
            parsed = rows.rows;
            format = "rows";
        }
    }

    if (!Array.isArray(parsed)) {
        return fail("Almost! A grid needs square brackets around it — [[1, 2], [3, 4]] is 2 rows of 2.");
    }

    if (parsed.length === 0) return empty();

    if (!parsed.some((row) => Array.isArray(row))) {
        parsed = [parsed];
        note = "That's a 1D array — shown here as a single row. Add more rows, like [[1, 2], [3, 4]], to build a grid.";
    }

    if (!parsed.every((row) => Array.isArray(row))) {
        return fail("Almost! Wrap each row in its own brackets — [[1, 2], [3, 4]] is 2 rows of 2.");
    }

    if (parsed.some((row) => row.some((cell) => !validCell(cell)))) {
        return fail('Cells can hold numbers, text, true/false, or null — nothing fancier. Try: [["a", 1], [true, null]] ✏️');
    }

    const maxLen = parsed.reduce((acc, row) => Math.max(acc, row.length), 0);
    const matrix = parsed.map((row) =>
        row.length === maxLen ? [...row] : [...row, ...Array(maxLen - row.length).fill(PAD_TOKEN)]
    );
    if (rows) note = describeRows(rows, maxLen);
    else if (looseNote) note = [looseNote, note].filter(Boolean).join(" ");

    return { matrix, maxLen, error: null, note, format };
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

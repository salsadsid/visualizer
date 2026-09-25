import { PAD_TOKEN, displayValue } from "./parser.js";
import { numberedGrid } from "./traversals.js";

export const MAX_MULTIPLY = 5;
export const MAX_VALUE = 99;

const key = (r, c) => `${r},${c}`;

const shapeOf = (m) => [m.length, m[0]?.length ?? 0];

const emptyMatrix = (rows, cols) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => PAD_TOKEN));

const cloneMatrix = (m) => m.map((row) => row.slice());

export const isNumericMatrix = (m) =>
    Array.isArray(m) &&
    m.length > 0 &&
    m.every(
        (row) =>
            Array.isArray(row) &&
            row.length > 0 &&
            row.length === m[0].length &&
            row.every((v) => Number.isInteger(v) && Math.abs(v) <= MAX_VALUE)
    );

export const randomMatrix = (rows, cols, rand = Math.random) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.floor(rand() * 10)));

export const MULTIPLY_EXAMPLE = { a: numberedGrid(2, 3), b: numberedGrid(3, 2) };

function makeRecorder(out, hasB) {
    const steps = [];
    const stats = { reads: 0, writes: 0, mults: 0 };
    const panel = (state = {}) => ({ cells: { ...(state.cells ?? {}) }, pointers: { ...(state.pointers ?? {}) } });
    const push = ({ line, message, a, b, out: outState, vars = {} }) => {
        const panels = { a: panel(a), out: { matrix: cloneMatrix(out), ...panel(outState) } };
        if (hasB) panels.b = panel(b);
        steps.push({ panels, vars: { ...vars }, line, message, stats: { ...stats } });
    };
    return { steps, stats, push };
}

function copyOp({ a, shape, target, describe }) {
    const [rows, cols] = shapeOf(a);
    const [outRows, outCols] = shape(rows, cols);
    const out = emptyMatrix(outRows, outCols);
    const rec = makeRecorder(out, false);
    if (rows === 0 || cols === 0) {
        rec.push({ line: 0, message: "Nothing to do: the matrix is empty." });
        return { steps: rec.steps, result: out };
    }
    const written = {};
    rec.push({ line: 0, message: `Make an empty ${outRows} × ${outCols} result. A is ${rows} × ${cols}.` });
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const [r, c] = target(i, j, rows, cols);
            out[r][c] = a[i][j];
            rec.stats.reads += 1;
            rec.stats.writes += 1;
            rec.push({
                line: 3,
                message: `B[${r}][${c}] = A[${i}][${j}] = ${displayValue(a[i][j])}. ${describe(i, j, r, c)}`,
                a: { cells: { [key(i, j)]: "reading" }, pointers: { i, j } },
                out: { cells: { ...written, [key(r, c)]: "writing" }, pointers: { i: r, j: c } },
                vars: { i, j },
            });
            written[key(r, c)] = "written";
        }
    }
    rec.push({
        line: 4,
        message: `Done: ${rows * cols} cells copied into a ${outRows} × ${outCols} matrix, one read and one write each.`,
        out: { cells: written },
    });
    return { steps: rec.steps, result: out };
}

function multiply(a, { b } = {}) {
    const [n, m] = shapeOf(a);
    const [bRows, p] = b ? shapeOf(b) : [0, 0];
    const out = emptyMatrix(n, p);
    const rec = makeRecorder(out, true);
    if (n === 0 || m === 0 || bRows !== m || p === 0) {
        rec.push({
            line: 0,
            message: `A × B is undefined: A has ${m} column${m === 1 ? "" : "s"} but B has ${bRows} row${bRows === 1 ? "" : "s"}. The inner sizes must match.`,
        });
        return { steps: rec.steps, result: null };
    }
    const rowBand = (i) => Object.fromEntries(Array.from({ length: m }, (_, k) => [key(i, k), "row"]));
    const colBand = (j) => Object.fromEntries(Array.from({ length: m }, (_, k) => [key(k, j), "column"]));
    const written = {};
    rec.push({
        line: 0,
        message: `A is ${n} × ${m} and B is ${m} × ${p}, so C = A × B is ${n} × ${p}. Each C[i][j] is row i of A dotted with column j of B.`,
    });
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < p; j++) {
            let sum = 0;
            const terms = [];
            for (let k = 0; k < m; k++) {
                const product = a[i][k] * b[k][j];
                sum += product;
                terms.push(`${a[i][k]}×${b[k][j]}`);
                out[i][j] = sum;
                rec.stats.reads += 2;
                rec.stats.mults += 1;
                rec.push({
                    line: 5,
                    message: `sum += A[${i}][${k}] × B[${k}][${j}] = ${a[i][k]} × ${b[k][j]} = ${product}, so sum = ${sum}.`,
                    a: { cells: { ...rowBand(i), [key(i, k)]: "reading" }, pointers: { i, j: k } },
                    b: { cells: { ...colBand(j), [key(k, j)]: "reading" }, pointers: { i: k, j } },
                    out: { cells: { ...written, [key(i, j)]: "writing" }, pointers: { i, j } },
                    vars: { i, j, k, sum, terms: terms.join(" + ") },
                });
            }
            rec.stats.writes += 1;
            written[key(i, j)] = "written";
            rec.push({
                line: 6,
                message: `C[${i}][${j}] = ${terms.join(" + ")} = ${sum}.`,
                a: { cells: rowBand(i), pointers: { i } },
                b: { cells: colBand(j), pointers: { j } },
                out: { cells: { ...written }, pointers: { i, j } },
                vars: { i, j, sum, terms: terms.join(" + ") },
            });
        }
    }
    rec.push({
        line: 7,
        message: `Done: ${n * p} cells, ${n * p * m} multiplications and ${n * p * (m - 1)} additions.`,
        out: { cells: written },
    });
    return { steps: rec.steps, result: out };
}

const copyLines = (create, assign) => [create, "for i in 0 .. rows-1:", "  for j in 0 .. cols-1:", assign, "return B"];

const COPY_COUNTERS = [
    { key: "reads", label: "Reads", hint: "Cells read from A" },
    { key: "writes", label: "Writes", hint: "Cells written into B" },
    { key: "remaining", label: "Remaining", short: "Left", hint: "Cells still to copy" },
];

const variantOf = (op, variant) => op.variants[op.variants[variant] ? variant : op.defaultVariant];

const copyOperation = (def) => ({
    ...def,
    counters: COPY_COUNTERS,
    run: (a, { variant } = {}) => {
        const v = def.variants ? variantOf(def, variant) : def;
        return copyOp({ a, shape: def.shape, target: v.target, describe: v.describe });
    },
});

export const MATRIX_OPS = {
    transpose: copyOperation({
        key: "transpose",
        label: "Transpose",
        blurb: "Rows become columns: every A[i][j] lands in B[j][i], so a 3 × 4 matrix becomes 4 × 3.",
        lead: "flips a matrix over its main diagonal: row i of A becomes column i of B. Every cell moves from [i][j] to [j][i], so the shape turns from rows × cols into cols × rows and nothing is lost.",
        roles: ["reading", "writing", "written"],
        variants: null,
        pseudocode: copyLines("B = new matrix[cols][rows]", "    B[j][i] = A[i][j]"),
        shape: (rows, cols) => [cols, rows],
        resultLabel: "Aᵀ",
        target: (i, j) => [j, i],
        describe: (i) => `Row ${i} of A becomes column ${i} of B.`,
    }),
    rotate: copyOperation({
        key: "rotate",
        label: "Rotate 90°",
        blurb: "Turn the matrix a quarter turn: the first row becomes the last column (clockwise) or the first column, bottom-up (counter-clockwise).",
        lead: "turns a matrix by a quarter turn. Clockwise, row i of A becomes column rows-1-i of B, read top to bottom; counter-clockwise, row i becomes column i, filled from the bottom up. Either way a rows × cols matrix becomes cols × rows.",
        roles: ["reading", "writing", "written"],
        defaultVariant: "cw",
        variants: {
            cw: {
                label: "Clockwise",
                resultLabel: "A rotated 90° cw",
                pseudocode: copyLines("B = new matrix[cols][rows]", "    B[j][rows-1-i] = A[i][j]"),
                target: (i, j, rows) => [j, rows - 1 - i],
                describe: (i, j, r, c) => `Row ${i} of A becomes column ${c} of B, top to bottom.`,
            },
            ccw: {
                label: "Counter-clockwise",
                resultLabel: "A rotated 90° ccw",
                pseudocode: copyLines("B = new matrix[cols][rows]", "    B[cols-1-j][i] = A[i][j]"),
                target: (i, j, rows, cols) => [cols - 1 - j, i],
                describe: (i) => `Row ${i} of A becomes column ${i} of B, bottom to top.`,
            },
        },
        shape: (rows, cols) => [cols, rows],
    }),
    flip: copyOperation({
        key: "flip",
        label: "Flip",
        blurb: "Mirror the matrix: horizontally swaps left and right within each row, vertically swaps the top and bottom rows.",
        lead: "mirrors a matrix without changing its shape. A horizontal flip reverses every row, so column j moves to column cols-1-j; a vertical flip reverses the order of the rows, so row i moves to row rows-1-i.",
        roles: ["reading", "writing", "written"],
        defaultVariant: "horizontal",
        variants: {
            horizontal: {
                label: "Horizontal",
                resultLabel: "A flipped left ↔ right",
                pseudocode: copyLines("B = new matrix[rows][cols]", "    B[i][cols-1-j] = A[i][j]"),
                target: (i, j, rows, cols) => [i, cols - 1 - j],
                describe: (i, j, r, c) => `Column ${j} mirrors to column ${c}.`,
            },
            vertical: {
                label: "Vertical",
                resultLabel: "A flipped top ↕ bottom",
                pseudocode: copyLines("B = new matrix[rows][cols]", "    B[rows-1-i][j] = A[i][j]"),
                target: (i, j, rows) => [rows - 1 - i, j],
                describe: (i, j, r) => `Row ${i} mirrors to row ${r}.`,
            },
        },
        shape: (rows, cols) => [rows, cols],
    }),
    multiply: {
        key: "multiply",
        label: "Multiply",
        blurb: "C = A × B: every cell of C is a row of A dotted with a column of B, one multiply-add at a time.",
        lead: "builds a new matrix C where C[i][j] is the dot product of row i of A and column j of B: multiply the pairs, add them up. It only works when A has as many columns as B has rows, and the result is rows-of-A × cols-of-B.",
        roles: ["row", "column", "reading", "writing", "written"],
        variants: null,
        pseudocode: [
            "C = new matrix[n][p]",
            "for i in 0 .. n-1:",
            "  for j in 0 .. p-1:",
            "    sum = 0",
            "    for k in 0 .. m-1:",
            "      sum += A[i][k] * B[k][j]",
            "    C[i][j] = sum",
            "return C",
        ],
        counters: [
            { key: "mults", label: "Multiplications", short: "Mults", hint: "Products computed so far" },
            { key: "writes", label: "Writes", hint: "Cells of C finished" },
            { key: "remaining", label: "Remaining", short: "Left", hint: "Cells of C still to compute" },
        ],
        shape: (rows, cols, { b } = {}) => [rows, b?.[0]?.length ?? 0],
        resultLabel: "A × B",
        run: multiply,
    },
};

export const MATRIX_OP_LIST = Object.values(MATRIX_OPS);

export const variantKeys = (op) => (op.variants ? Object.keys(op.variants) : []);

export const normaliseVariant = (op, variant) => (op.variants ? (op.variants[variant] ? variant : op.defaultVariant) : null);

export const pseudocodeFor = (op, variant) => (op.variants ? variantOf(op, variant).pseudocode : op.pseudocode);

export const resultLabelFor = (op, variant) => (op.variants ? variantOf(op, variant).resultLabel : op.resultLabel);

export const resultShape = (op, rows, cols, options = {}) => op.shape(rows, cols, options);

export const finalResult = (kind, a, options = {}) => MATRIX_OPS[kind].run(a, options).result;

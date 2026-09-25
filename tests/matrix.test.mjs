import test from "node:test";
import assert from "node:assert/strict";
import {
    MATRIX_OPS,
    MATRIX_OP_LIST,
    MAX_MULTIPLY,
    MULTIPLY_EXAMPLE,
    finalResult,
    isNumericMatrix,
    pseudocodeFor,
    randomMatrix,
    resultLabelFor,
    resultShape,
    variantKeys,
} from "../src/lib/array/matrixOps.js";
import { MATRIX_CODE } from "../src/lib/array/matrixCode.js";
import { LANGUAGES } from "../src/lib/array/snippets.js";
import { GRID_ROLES } from "../src/lib/array/gridRoles.js";
import { PAD_TOKEN } from "../src/lib/array/parser.js";
import { numberedGrid } from "../src/lib/array/traversals.js";

function mulberry32(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const rand = mulberry32(2026);
const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

const transposeRef = (a) => a[0].map((_, j) => a.map((row) => row[j]));
const cwRef = (a) => transposeRef(a).map((row) => row.slice().reverse());
const ccwRef = (a) => transposeRef(a).slice().reverse();
const horizontalRef = (a) => a.map((row) => row.slice().reverse());
const verticalRef = (a) => a.slice().reverse();
const multiplyRef = (a, b) => a.map((row) => b[0].map((_, j) => row.reduce((sum, v, k) => sum + v * b[k][j], 0)));

const COPY_CASES = [
    ["transpose", {}, transposeRef],
    ["rotate", { variant: "cw" }, cwRef],
    ["rotate", { variant: "ccw" }, ccwRef],
    ["flip", { variant: "horizontal" }, horizontalRef],
    ["flip", { variant: "vertical" }, verticalRef],
];

test("copy operations match reference results on random grids", () => {
    for (let round = 0; round < 40; round++) {
        const a = randomMatrix(int(1, 8), int(1, 10), rand);
        const cells = a.length * a[0].length;
        for (const [kind, options, ref] of COPY_CASES) {
            const { steps, result } = MATRIX_OPS[kind].run(a, options);
            const label = `${kind} ${options.variant ?? ""}`;
            assert.deepEqual(result, ref(a), label);
            assert.equal(steps.length, cells + 2, label);
            const last = steps.at(-1);
            assert.deepEqual(last.panels.out.matrix, result, label);
            assert.deepEqual(last.stats, { reads: cells, writes: cells, mults: 0 }, label);
            assert.deepEqual(resultShape(MATRIX_OPS[kind], a.length, a[0].length), [result.length, result[0].length]);
        }
    }
});

test("multiplication matches the reference and counts every product", () => {
    for (let round = 0; round < 40; round++) {
        const n = int(1, MAX_MULTIPLY);
        const m = int(1, MAX_MULTIPLY);
        const p = int(1, MAX_MULTIPLY);
        const a = randomMatrix(n, m, rand);
        const b = randomMatrix(m, p, rand);
        const { steps, result } = MATRIX_OPS.multiply.run(a, { b });
        assert.deepEqual(result, multiplyRef(a, b));
        assert.equal(steps.length, n * p * m + n * p + 2);
        assert.deepEqual(steps.at(-1).stats, { reads: 2 * n * p * m, writes: n * p, mults: n * p * m });
        assert.deepEqual(resultShape(MATRIX_OPS.multiply, n, m, { b }), [n, p]);
    }
    assert.deepEqual(finalResult("multiply", MULTIPLY_EXAMPLE.a, { b: MULTIPLY_EXAMPLE.b }), [[22, 28], [49, 64]]);
    const { steps } = MATRIX_OPS.multiply.run(MULTIPLY_EXAMPLE.a, { b: MULTIPLY_EXAMPLE.b });
    assert.equal(steps[1].panels.out.matrix[0][0], 1);
    assert.equal(steps[2].panels.out.matrix[0][0], 7);
    assert.equal(steps[3].panels.out.matrix[0][0], 22);
    assert.equal(steps[3].vars.terms, "1×1 + 2×3 + 3×5");
    assert.equal(steps[4].line, 6);
    assert.deepEqual(steps[1].panels.a.cells, { "0,0": "reading", "0,1": "row", "0,2": "row" });
    assert.deepEqual(steps[1].panels.b.cells, { "0,0": "reading", "1,0": "column", "2,0": "column" });
});

test("the classic identities hold", () => {
    const a = numberedGrid(3, 4);
    assert.deepEqual(finalResult("transpose", finalResult("transpose", a)), a);
    let turned = a;
    for (let i = 0; i < 3; i++) turned = finalResult("rotate", turned, { variant: "cw" });
    assert.deepEqual(turned, finalResult("rotate", a, { variant: "ccw" }));
    const halfTurn = finalResult("rotate", finalResult("rotate", a, { variant: "cw" }), { variant: "cw" });
    const bothFlips = finalResult("flip", finalResult("flip", a, { variant: "horizontal" }), { variant: "vertical" });
    assert.deepEqual(halfTurn, bothFlips);
    assert.deepEqual(finalResult("rotate", a, { variant: "cw" }), [[9, 5, 1], [10, 6, 2], [11, 7, 3], [12, 8, 4]]);
    assert.deepEqual(finalResult("rotate", a, { variant: "ccw" }), [[4, 8, 12], [3, 7, 11], [2, 6, 10], [1, 5, 9]]);
    assert.deepEqual(finalResult("flip", a), [[4, 3, 2, 1], [8, 7, 6, 5], [12, 11, 10, 9]]);
});

test("every step is well formed", () => {
    const a = randomMatrix(3, 4, rand);
    const b = randomMatrix(4, 2, rand);
    for (const op of MATRIX_OP_LIST) {
        const variants = variantKeys(op).length ? variantKeys(op) : [undefined];
        for (const variant of variants) {
            const label = `${op.key} ${variant ?? ""}`;
            const { steps, result } = op.run(a, { variant, b });
            const [outRows, outCols] = resultShape(op, 3, 4, { b });
            const lines = pseudocodeFor(op, variant);
            let previous = { reads: 0, writes: 0, mults: 0 };
            steps.forEach((step, index) => {
                assert.ok(step.line >= 0 && step.line < lines.length, label);
                assert.ok(step.message.length > 0, label);
                assert.equal(step.panels.out.matrix.length, outRows, label);
                step.panels.out.matrix.forEach((row) => assert.equal(row.length, outCols, label));
                for (const [name, panel] of Object.entries(step.panels)) {
                    const [maxRow, maxCol] = name === "a" ? [3, 4] : name === "b" ? [4, 2] : [outRows, outCols];
                    for (const [cell, role] of Object.entries(panel.cells)) {
                        assert.ok(op.roles.includes(role), `${label} ${name} ${role}`);
                        assert.ok(GRID_ROLES[role], role);
                        const [r, c] = cell.split(",").map(Number);
                        assert.ok(r >= 0 && r < maxRow && c >= 0 && c < maxCol, `${label} ${name} ${cell}`);
                    }
                    for (const value of Object.values(panel.pointers)) assert.ok(Number.isInteger(value), label);
                }
                for (const stat of ["reads", "writes", "mults"]) assert.ok(step.stats[stat] >= previous[stat], label);
                previous = step.stats;
                if (index === 0) assert.deepEqual(step.stats, { reads: 0, writes: 0, mults: 0 });
            });
            assert.equal(steps[0].panels.a.pointers.i, undefined);
            assert.ok(steps[0].panels.out.matrix.every((row) => row.every((v) => v === PAD_TOKEN)), label);
            assert.deepEqual(steps.at(-1).panels.out.matrix, result, label);
            assert.ok(result.every((row) => row.every((v) => v !== PAD_TOKEN)), label);
            assert.ok(resultLabelFor(op, variant).length > 0);
        }
    }
});

test("inputs are never modified and edge cases do not throw", () => {
    const a = numberedGrid(2, 3);
    const b = numberedGrid(3, 2);
    const before = JSON.stringify([a, b]);
    for (const op of MATRIX_OP_LIST) op.run(a, { b, variant: "cw" });
    assert.equal(JSON.stringify([a, b]), before);
    assert.deepEqual(finalResult("transpose", [[7]]), [[7]]);
    assert.deepEqual(finalResult("rotate", [[1, 2]], { variant: "cw" }), [[1], [2]]);
    assert.deepEqual(finalResult("rotate", [[1, 2]]), [[1], [2]]);
    assert.deepEqual(finalResult("rotate", [[1, 2]], { variant: "nope" }), [[1], [2]]);
    assert.deepEqual(pseudocodeFor(MATRIX_OPS.rotate, "nope"), pseudocodeFor(MATRIX_OPS.rotate, "cw"));
    assert.deepEqual(finalResult("flip", [[1, 2]], { variant: "vertical" }), [[1, 2]]);
    assert.deepEqual(finalResult("transpose", [["x", true], [null, 2.5]]), [["x", null], [true, 2.5]]);
    const mismatch = MATRIX_OPS.multiply.run(a, { b: numberedGrid(2, 2) });
    assert.equal(mismatch.result, null);
    assert.equal(mismatch.steps.length, 1);
    assert.match(mismatch.steps[0].message, /undefined/);
    assert.equal(MATRIX_OPS.multiply.run(a).result, null);
    assert.equal(MATRIX_OPS.transpose.run([]).steps.length, 1);
    assert.equal(MATRIX_OPS.transpose.run([[]]).steps.length, 1);
});

test("numeric checks and random grids", () => {
    assert.ok(isNumericMatrix([[1, -99], [0, 99]]));
    for (const m of [[], [[]], [[1, 2], [3]], [["1"]], [[1.5]], [[100]], [[-100]], [[true]], [[null]], [[PAD_TOKEN]], [[1, PAD_TOKEN]], null]) {
        assert.equal(isNumericMatrix(m), false, JSON.stringify(m));
    }
    const grid = randomMatrix(4, 6, rand);
    assert.equal(grid.length, 4);
    for (const row of grid) {
        assert.equal(row.length, 6);
        for (const v of row) assert.ok(Number.isInteger(v) && v >= 0 && v <= 9);
    }
    assert.ok(isNumericMatrix(grid));
});

test("every operation ships with everything the page needs", () => {
    assert.deepEqual(MATRIX_OP_LIST.map((op) => op.key), ["transpose", "rotate", "flip", "multiply"]);
    for (const op of MATRIX_OP_LIST) {
        for (const field of ["key", "label", "blurb", "lead", "roles", "counters", "shape", "run"]) {
            assert.ok(op[field], `${op.key}.${field}`);
        }
        assert.equal(op.counters.length, 3);
        for (const counter of op.counters) assert.ok(counter.key && counter.label && counter.hint);
        for (const role of op.roles) assert.ok(GRID_ROLES[role], `${op.key} ${role}`);
        const variants = variantKeys(op);
        if (variants.length) {
            assert.ok(op.variants[op.defaultVariant]);
            for (const v of variants) {
                assert.ok(op.variants[v].label);
                assert.ok(pseudocodeFor(op, v).length > 3);
            }
        } else {
            assert.ok(op.pseudocode.length > 3);
        }
        for (const { id } of LANGUAGES) {
            assert.ok(MATRIX_CODE[op.key][id]?.length > 0, `${op.key} ${id}`);
            for (const item of MATRIX_CODE[op.key][id]) assert.ok(item.title && item.code.length > 20);
        }
    }
});

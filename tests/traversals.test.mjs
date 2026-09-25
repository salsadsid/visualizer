import test from "node:test";
import assert from "node:assert/strict";
import { TRAVERSALS, TRAVERSAL_LIST, numberedGrid } from "../src/lib/array/traversals.js";

const SIZES = [[1, 1], [1, 5], [5, 1], [2, 2], [2, 3], [3, 2], [3, 4], [4, 3], [4, 4], [5, 7], [7, 7], [8, 10]];
const seq = (kind, matrix) => TRAVERSALS[kind].run(matrix).steps.at(-1).output.join(" ");

test("each traversal visits exactly the cells it claims, each once", () => {
    for (const t of TRAVERSAL_LIST) {
        for (const [rows, cols] of SIZES) {
            const matrix = numberedGrid(rows, cols);
            const { steps } = t.run(matrix);
            const last = steps.at(-1);
            const expected = t.count(rows, cols);
            const label = `${t.key} ${rows}×${cols}`;
            assert.equal(Object.keys(last.order).length, expected, label);
            assert.equal(last.output.length, expected, label);
            assert.equal(last.stats.visited, expected, label);
            assert.equal(last.stats.total, expected, label);
            const ranks = Object.values(last.order).sort((a, b) => a - b);
            assert.deepEqual(ranks, ranks.map((_, i) => i + 1), label);
            for (const k of Object.keys(last.order)) {
                const [r, c] = k.split(",").map(Number);
                assert.ok(r >= 0 && r < rows && c >= 0 && c < cols, `${label}: ${k} is outside the grid`);
                assert.equal(last.output[last.order[k] - 1], matrix[r][c], `${label}: output order`);
            }
            if (expected === rows * cols) assert.equal(Object.keys(last.cells).length, rows * cols, label);
        }
    }
});

test("boundary covers the ring and nothing inside", () => {
    const { steps } = TRAVERSALS.boundary.run(numberedGrid(4, 5));
    const ring = Object.keys(steps.at(-1).order);
    assert.equal(ring.length, 14);
    for (const k of ring) {
        const [r, c] = k.split(",").map(Number);
        assert.ok(r === 0 || r === 3 || c === 0 || c === 4, k);
    }
    assert.equal(TRAVERSALS.boundary.count(1, 1), 1);
    assert.equal(TRAVERSALS.boundary.count(1, 6), 6);
    assert.equal(TRAVERSALS.boundary.count(6, 1), 6);
    assert.equal(TRAVERSALS.boundary.count(2, 2), 4);
});

test("every step is well formed", () => {
    for (const t of TRAVERSAL_LIST) {
        for (const [rows, cols] of [[1, 1], [3, 4], [8, 10]]) {
            const { steps } = t.run(numberedGrid(rows, cols));
            let visited = 0;
            let out = 0;
            for (const step of steps) {
                assert.ok(step.line >= 0 && step.line < t.pseudocode.length, `${t.key}: line ${step.line}`);
                assert.ok(typeof step.message === "string" && step.message.length > 0, t.key);
                for (const role of Object.values(step.cells)) assert.ok(t.roles.includes(role), `${t.key}: role ${role}`);
                assert.ok(step.stats.visited >= visited && step.stats.visited <= visited + 1, t.key);
                assert.ok(step.output.length >= out && step.output.length <= out + 1, t.key);
                visited = step.stats.visited;
                out = step.output.length;
                for (const [k, n] of Object.entries(step.order)) assert.ok(n >= 1 && k in step.cells, t.key);
            }
        }
    }
});

test("the worked 3 × 4 example matches the explainers", () => {
    const grid = numberedGrid(3, 4);
    assert.equal(seq("row-major", grid), "1 2 3 4 5 6 7 8 9 10 11 12");
    assert.equal(seq("column-major", grid), "1 5 9 2 6 10 3 7 11 4 8 12");
    assert.equal(seq("snake", grid), "1 2 3 4 8 7 6 5 9 10 11 12");
    assert.equal(seq("diagonal", grid), "1 2 5 3 6 9 4 7 10 8 11 12");
    assert.equal(seq("boundary", grid), "1 2 3 4 8 12 11 10 9 5");
    assert.equal(seq("spiral", grid), "1 2 3 4 8 12 11 10 9 5 6 7");
});

test("degenerate grids do not loop or repeat", () => {
    assert.equal(seq("spiral", numberedGrid(1, 4)), "1 2 3 4");
    assert.equal(seq("spiral", numberedGrid(4, 1)), "1 2 3 4");
    assert.equal(seq("spiral", numberedGrid(1, 1)), "1");
    assert.equal(seq("boundary", numberedGrid(1, 4)), "1 2 3 4");
    assert.equal(seq("boundary", numberedGrid(4, 1)), "1 2 3 4");
    assert.equal(seq("boundary", numberedGrid(2, 2)), "1 2 4 3");
    assert.equal(seq("spiral", numberedGrid(2, 2)), "1 2 4 3");
    for (const t of TRAVERSAL_LIST) {
        const { steps } = t.run([]);
        assert.equal(steps.length, 1, t.key);
        assert.equal(steps[0].stats.total, 0, t.key);
    }
});

test("the input grid is never modified", () => {
    const grid = numberedGrid(3, 3);
    const copy = JSON.stringify(grid);
    for (const t of TRAVERSAL_LIST) t.run(grid);
    assert.equal(JSON.stringify(grid), copy);
});

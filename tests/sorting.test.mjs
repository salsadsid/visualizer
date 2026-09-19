import test from "node:test";
import assert from "node:assert/strict";
import { SORTERS, SORTER_LIST } from "../src/lib/algorithms/sorting.js";

const ascending = (n) => Array.from({ length: n }, (_, i) => i + 1);
const descending = (n) => ascending(n).reverse();
const duplicates = (n) => Array.from({ length: n }, (_, i) => [14, 30, 46][i % 3]);
const scrambled = (n) => Array.from({ length: n }, (_, i) => ((i * 37 + 11) % 97) + 1);

const SIZES = [3, 4, 7, 10, 17, 24];
const SHAPES = { ascending, descending, duplicates, scrambled };

const inversions = (values) => {
    let count = 0;
    for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
            if (values[i] > values[j]) count++;
        }
    }
    return count;
};

const cases = () =>
    SIZES.flatMap((n) =>
        Object.entries(SHAPES).map(([shape, build]) => ({ label: `${shape}(${n})`, input: build(n) }))
    );

for (const sorter of SORTER_LIST) {
    test(`${sorter.key}: ends with the input sorted and every bar marked sorted`, () => {
        for (const { label, input } of cases()) {
            const before = input.slice();
            const { steps } = sorter.run(input);
            const last = steps.at(-1);

            assert.deepEqual(input, before, `${label}: input was mutated`);
            assert.ok(steps.length >= 2, `${label}: too few steps`);
            assert.deepEqual(last.array, before.slice().sort((a, b) => a - b), label);
            assert.deepEqual(
                Object.values(last.highlights),
                Array(input.length).fill("sorted"),
                `${label}: final highlights`
            );
            assert.deepEqual(last.pointers, {}, `${label}: pointers left behind`);
            assert.deepEqual(last.vars, {}, `${label}: vars left behind`);
        }
    });

    test(`${sorter.key}: every step is well formed`, () => {
        for (const { label, input } of cases()) {
            const { steps } = sorter.run(input);
            let previous = { comparisons: 0, swaps: 0, writes: 0 };

            assert.equal(steps[0].line, 0, `${label}: first line`);
            assert.deepEqual(steps[0].array, input, `${label}: first array`);
            assert.deepEqual(steps[0].stats, previous, `${label}: first stats`);

            for (const [index, step] of steps.entries()) {
                const where = `${label} step ${index}`;
                assert.equal(step.array.length, input.length, where);
                assert.ok(step.line >= 0 && step.line < sorter.pseudocode.length, `${where}: line`);
                assert.equal(typeof step.message, "string", where);
                assert.deepEqual(Object.keys(step.stats).sort(), ["comparisons", "swaps", "writes"], where);

                for (const key of Object.keys(previous)) {
                    assert.ok(step.stats[key] >= previous[key], `${where}: ${key} went down`);
                }
                previous = step.stats;

                for (const [position, role] of Object.entries(step.highlights)) {
                    assert.ok(Number(position) >= 0 && Number(position) < input.length, `${where}: highlight index`);
                    assert.ok(role === "sorted" || sorter.roles.includes(role), `${where}: role ${role}`);
                }
                for (const position of Object.values(step.pointers)) {
                    assert.ok(position >= -1 && position < input.length, `${where}: pointer ${position}`);
                }
            }
        }
    });
}

test("bubble: swaps once per inversion and stops early on sorted input", () => {
    for (const { label, input } of cases()) {
        const { steps } = SORTERS.bubble.run(input);
        assert.equal(steps.at(-1).stats.swaps, inversions(input), label);
    }
    const sorted = SORTERS.bubble.run(ascending(8)).steps.at(-1).stats;
    assert.deepEqual(sorted, { comparisons: 7, swaps: 0, writes: 0 });
});

test("bubble and selection keep the array a permutation of the input at every step", () => {
    for (const key of ["bubble", "selection"]) {
        for (const { label, input } of cases()) {
            const expected = input.slice().sort((a, b) => a - b);
            for (const step of SORTERS[key].run(input).steps) {
                assert.deepEqual(step.array.slice().sort((a, b) => a - b), expected, `${key} ${label}`);
            }
        }
    }
});

test("selection: always n(n-1)/2 comparisons and two writes per swap", () => {
    for (const { label, input } of cases()) {
        const stats = SORTERS.selection.run(input).steps.at(-1).stats;
        const n = input.length;
        assert.equal(stats.comparisons, (n * (n - 1)) / 2, label);
        assert.equal(stats.writes, stats.swaps * 2, label);
        assert.ok(stats.swaps <= n - 1, label);
    }
});

test("insertion: never swaps, and writes once per shift plus once per key", () => {
    for (const { label, input } of cases()) {
        const stats = SORTERS.insertion.run(input).steps.at(-1).stats;
        assert.equal(stats.swaps, 0, label);
        assert.equal(stats.writes, inversions(input) + input.length - 1, label);
    }
    const sorted = SORTERS.insertion.run(ascending(8)).steps.at(-1).stats;
    assert.equal(sorted.comparisons, 7);
});

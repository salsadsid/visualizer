import test from "node:test";
import assert from "node:assert/strict";
import { OPERATIONS, OPERATION_LIST } from "../src/lib/array/oneD.js";
import { OPERATION_CODE } from "../src/lib/array/oneDCode.js";
import { LANGUAGES } from "../src/lib/array/snippets.js";

function mulberry32(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const rand = mulberry32(7);
const randomValues = (n) => Array.from({ length: n }, () => 1 + Math.floor(rand() * 20));
const trimmed = (array) => array.filter((v) => v != null);

function checkSteps(op, steps) {
    let reads = 0, writes = 0, compares = 0;
    const length = steps[0].array.length;
    for (const step of steps) {
        assert.ok(step.line >= 0 && step.line < op.pseudocode.length, `${op.key}: line ${step.line}`);
        assert.ok(typeof step.message === "string" && step.message.length > 0);
        assert.equal(step.array.length, length, `${op.key}: array length changed`);
        for (const [index, role] of Object.entries(step.highlights)) {
            assert.ok(op.roles.includes(role), `${op.key}: role ${role}`);
            assert.ok(Number(index) >= 0 && Number(index) < length, `${op.key}: highlight ${index}`);
        }
        for (const index of Object.values(step.pointers)) assert.ok(index >= 0 && index <= length);
        assert.ok(step.stats.reads >= reads && step.stats.writes >= writes && step.stats.compares >= compares, `${op.key}: counters went down`);
        ({ reads, writes, compares } = step.stats);
    }
}

test("access reads one slot in three steps", () => {
    for (const n of [1, 2, 5, 24]) {
        const values = randomValues(n);
        for (const index of [0, n - 1, Math.floor(n / 2), 99, -3]) {
            const { steps } = OPERATIONS.access.run(values, { index });
            const i = Math.max(0, Math.min(index, n - 1));
            assert.equal(steps.length, 3);
            assert.equal(steps.at(-1).stats.reads, 1);
            assert.equal(steps.at(-1).vars.value, values[i]);
            assert.equal(steps.at(-1).highlights[i], "found");
            checkSteps(OPERATIONS.access, steps);
        }
    }
});

test("insert shifts n - i values and writes once", () => {
    for (let round = 0; round < 30; round++) {
        const n = 1 + Math.floor(rand() * 24);
        const values = randomValues(n);
        const index = Math.floor(rand() * (n + 1));
        const value = 42;
        const { steps } = OPERATIONS.insert.run(values, { index, value });
        const last = steps.at(-1);
        assert.deepEqual(trimmed(last.array), [...values.slice(0, index), value, ...values.slice(index)]);
        assert.equal(last.array.length, n + 1);
        assert.equal(last.stats.reads, n - index);
        assert.equal(last.stats.writes, n - index + 1);
        assert.equal(last.stats.compares, 0);
        assert.equal(steps.length, 3 + (n - index));
        assert.equal(steps[0].array.at(-1), null, "the spare slot starts empty");
        checkSteps(OPERATIONS.insert, steps);
    }
});

test("delete shifts n - i - 1 values and frees the last slot", () => {
    for (let round = 0; round < 30; round++) {
        const n = 1 + Math.floor(rand() * 24);
        const values = randomValues(n);
        const index = Math.floor(rand() * n);
        const { steps } = OPERATIONS.delete.run(values, { index });
        const last = steps.at(-1);
        assert.deepEqual(trimmed(last.array), [...values.slice(0, index), ...values.slice(index + 1)]);
        assert.equal(last.array.at(-1), null);
        assert.equal(last.stats.reads, n - index - 1);
        assert.equal(last.stats.writes, n - index - 1);
        assert.equal(steps[0].highlights[index], "remove");
        assert.equal(steps.length, 3 + (n - index - 1));
        checkSteps(OPERATIONS.delete, steps);
    }
});

test("linear search stops at the first match or checks everything", () => {
    for (let round = 0; round < 30; round++) {
        const n = 1 + Math.floor(rand() * 24);
        const values = randomValues(n);
        const target = rand() < 0.7 ? values[Math.floor(rand() * n)] : 99;
        const { steps } = OPERATIONS.search.run(values, { target });
        const last = steps.at(-1);
        const expected = values.indexOf(target);
        if (expected >= 0) {
            assert.equal(last.stats.compares, expected + 1);
            assert.equal(last.highlights[expected], "found");
            assert.equal(last.vars.found, true);
        } else {
            assert.equal(last.stats.compares, n);
            assert.equal(last.vars.found, false);
            assert.ok(!Object.values(last.highlights).includes("found"));
            assert.match(last.message, /-1/);
        }
        assert.deepEqual(trimmed(last.array), values);
        checkSteps(OPERATIONS.search, steps);
    }
    assert.equal(OPERATIONS.search.run([3, 7, 7, 7], { target: 7 }).steps.at(-1).stats.compares, 2);
});

test("reverse swaps floor(n / 2) pairs in place", () => {
    for (const n of [1, 2, 3, 4, 7, 24]) {
        const values = randomValues(n);
        const { steps } = OPERATIONS.reverse.run(values);
        const last = steps.at(-1);
        assert.deepEqual(last.array, values.slice().reverse());
        assert.equal(last.vars.swaps, Math.floor(n / 2));
        assert.equal(last.stats.writes, 2 * Math.floor(n / 2));
        assert.equal(Object.keys(last.highlights).length, n, "every value ends in place");
        assert.ok(Object.values(last.highlights).every((role) => role === "done"));
        checkSteps(OPERATIONS.reverse, steps);
    }
});

test("inputs are clamped and never mutated", () => {
    const values = [5, 2, 4];
    const before = JSON.stringify(values);
    for (const op of OPERATION_LIST) {
        for (const options of [{}, { index: 99, value: 1, target: 5 }, { index: -1, value: 7, target: 0 }, { index: 1.5 }]) {
            assert.ok(op.run(values, options).steps.length >= 1, op.key);
        }
    }
    assert.equal(JSON.stringify(values), before);
});

test("every operation ships with copy, pseudocode, complexity and code", () => {
    for (const op of OPERATION_LIST) {
        assert.ok(op.label && op.blurb && op.lead && op.pseudocode.length > 0, op.key);
        for (const field of ["best", "worst", "space"]) assert.ok(op.complexity[field], `${op.key}: complexity.${field}`);
        assert.ok(Array.isArray(op.inputs));
        for (const language of LANGUAGES) {
            assert.ok(OPERATION_CODE[op.key]?.[language.id]?.length > 0, `${op.key}: no ${language.label} code`);
        }
    }
});

import test from "node:test";
import assert from "node:assert/strict";
import {
    ARRAY_PRESETS,
    DEFAULT_VALUES,
    MAX_SIZE,
    MAX_VALUE,
    MIN_SIZE,
    MIN_VALUE,
    parseArrayInput,
} from "../src/lib/algorithms/presets.js";

const sizes = () => Array.from({ length: MAX_SIZE - MIN_SIZE + 1 }, (_, i) => MIN_SIZE + i);
const inRange = (value) => Number.isInteger(value) && value >= MIN_VALUE && value <= MAX_VALUE;

test("every preset builds n values inside the allowed range", () => {
    for (const [key, preset] of Object.entries(ARRAY_PRESETS)) {
        for (const n of sizes()) {
            const values = preset.build(n);
            assert.equal(values.length, n, `${key}(${n})`);
            assert.ok(values.every(inRange), `${key}(${n}): ${values}`);
        }
    }
});

test("sorted, reversed and nearly sorted presets use the values 1 to n", () => {
    for (const n of sizes()) {
        const ascending = Array.from({ length: n }, (_, i) => i + 1);
        assert.deepEqual(ARRAY_PRESETS.sorted.build(n), ascending);
        assert.deepEqual(ARRAY_PRESETS.reversed.build(n), ascending.slice().reverse());
        assert.deepEqual(ARRAY_PRESETS.nearly.build(n).sort((a, b) => a - b), ascending);
    }
});

test("the default array is a valid input", () => {
    assert.ok(DEFAULT_VALUES.length >= MIN_SIZE && DEFAULT_VALUES.length <= MAX_SIZE);
    assert.ok(DEFAULT_VALUES.every(inRange));
});

test("parseArrayInput accepts commas, spaces, semicolons and brackets", () => {
    for (const raw of ["5, 3, 8", "5 3 8", "5;3;8", "[5, 3, 8]", "  [ 5,3 ; 8 ]  ", "005 3 8"]) {
        assert.deepEqual(parseArrayInput(raw), { values: [5, 3, 8], error: null }, raw);
    }
});

test("parseArrayInput rejects anything that is not a whole number from 1 to 99", () => {
    for (const raw of ["", "   ", null, undefined, "1 2 x", "1 2 -3", "1 2 3.5", "1 2 1e2", "0 1 2", "1 2 100"]) {
        const result = parseArrayInput(raw);
        assert.equal(result.values, null, String(raw));
        assert.equal(typeof result.error, "string", String(raw));
    }
});

test("parseArrayInput enforces the size limits", () => {
    const build = (n) => Array.from({ length: n }, (_, i) => (i % MAX_VALUE) + 1).join(" ");
    assert.equal(parseArrayInput(build(MIN_SIZE - 1)).values, null);
    assert.equal(parseArrayInput(build(MAX_SIZE + 1)).values, null);
    assert.equal(parseArrayInput(build(MIN_SIZE)).error, null);
    assert.equal(parseArrayInput(build(MAX_SIZE)).error, null);
});

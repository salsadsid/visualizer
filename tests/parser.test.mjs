import test from "node:test";
import assert from "node:assert/strict";
import { PAD_TOKEN, cellKey, displayValue, parseInput, uniqueValues } from "../src/lib/array/parser.js";
import { PRESETS, formatMatrix } from "../src/lib/array/presets.js";

test("empty input is an empty grid, not an error", () => {
    for (const raw of ["", "   ", "[]", null, undefined]) {
        assert.deepEqual(parseInput(raw), { matrix: [], maxLen: 0, error: null, note: null, format: null });
    }
});

test("a 2D array parses row by row", () => {
    const result = parseInput("[[1, 2], [3, 4]]");
    assert.deepEqual(result.matrix, [[1, 2], [3, 4]]);
    assert.equal(result.maxLen, 2);
    assert.equal(result.error, null);
    assert.equal(result.note, null);
    assert.equal(result.format, "json");
});

test("ragged rows are padded on the right", () => {
    const result = parseInput("[[1], [2, 3, 4]]");
    assert.deepEqual(result.matrix, [[1, PAD_TOKEN, PAD_TOKEN], [2, 3, 4]]);
    assert.equal(result.maxLen, 3);
    assert.equal(result.error, null);
});

test("a 1D array becomes a single row with a note", () => {
    for (const [raw, row] of [
        ["[1, 2, 3]", [1, 2, 3]],
        ['["a", true, null]', ["a", true, null]],
        ["[null]", [null]],
    ]) {
        const result = parseInput(raw);
        assert.deepEqual(result.matrix, [row], raw);
        assert.equal(result.error, null, raw);
        assert.equal(typeof result.note, "string", raw);
    }
});

test("invalid input returns a message and no grid", () => {
    for (const raw of ["oops", '{"a": 1}', "42", "[1, [2, 3]]", '[[{"a": 1}]]', "[[[1]]]", '[{"a": 1}]']) {
        const result = parseInput(raw);
        assert.deepEqual(result.matrix, [], raw);
        assert.equal(typeof result.error, "string", raw);
        assert.equal(result.note, null, raw);
    }
});

test("space-separated rows parse as a grid", () => {
    const result = parseInput("1 2 3\n4 5 6");
    assert.deepEqual(result.matrix, [[1, 2, 3], [4, 5, 6]]);
    assert.equal(result.format, "rows");
    assert.match(result.note, /2 × 3 grid/);
    assert.equal(result.error, null);
});

test("rows accept commas, tabs, decimals and word literals", () => {
    assert.deepEqual(parseInput("1, 2; 3\n4 5 6").matrix, [[1, 2, 3], [4, 5, 6]]);
    assert.deepEqual(parseInput("New York\tLA\nx\ty").matrix, [["New York", "LA"], ["x", "y"]]);
    assert.deepEqual(parseInput("True False\nNone 1.5").matrix, [[true, false], [null, 1.5]]);
    assert.deepEqual(parseInput("-1 -2\n3 04").matrix, [[-1, -2], [3, 4]]);
});

test("a leading size line is dropped when it matches the rows", () => {
    const result = parseInput("2 3\n1 2 3\n4 5 6");
    assert.deepEqual(result.matrix, [[1, 2, 3], [4, 5, 6]]);
    assert.match(result.note, /size \(2 × 3\)/);
    const kept = parseInput("2 2\n1 2 3\n4 5 6");
    assert.deepEqual(kept.matrix, [[2, 2, PAD_TOKEN], [1, 2, 3], [4, 5, 6]]);
});

test("a single line of values is a single row with a note", () => {
    const result = parseInput("1 2 3");
    assert.deepEqual(result.matrix, [[1, 2, 3]]);
    assert.equal(result.format, "rows");
    assert.match(result.note, /single row/);
});

test("every preset survives a format and parse round trip", () => {
    for (const [key, preset] of Object.entries(PRESETS)) {
        const matrix = preset.build();
        const result = parseInput(formatMatrix(matrix));
        assert.equal(result.error, null, key);
        assert.deepEqual(result.matrix, matrix, key);
    }
});

test("cell helpers keep booleans, null and padding distinct", () => {
    assert.deepEqual(uniqueValues([[1, 1, "1"], [true, false, PAD_TOKEN]]), [1, "1", true, false]);
    assert.equal(displayValue(true), "T");
    assert.equal(displayValue(false), "F");
    assert.equal(displayValue(null), "∅");
    assert.equal(displayValue(7), "7");
    assert.notEqual(cellKey(true), cellKey("true"));
    assert.notEqual(cellKey(null), cellKey("null"));
});

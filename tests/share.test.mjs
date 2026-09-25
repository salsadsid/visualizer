import test from "node:test";
import assert from "node:assert/strict";
import { decodeGrid, decodeSort, encodeGrid, encodeSort, readStep } from "../src/lib/share.js";
import { PAD_TOKEN, parseInput } from "../src/lib/array/parser.js";
import { formatMatrix } from "../src/lib/array/presets.js";

test("a grid with colours and indices survives a round trip", () => {
    const matrix = [[1, "বাংলা", true], [null, "한글", -2.5]];
    const colors = { 1: "#ff0000", __b_true: "#00FF00", __border: "#123456" };
    const hash = encodeGrid({ matrix, colors, showIndices: true });
    assert.match(hash, /^#g=[A-Za-z0-9_-]+$/);
    assert.deepEqual(decodeGrid(hash), { matrix, colors, showIndices: true });
});

test("padding is stripped before encoding and restored by the parser", () => {
    const hash = encodeGrid({ matrix: [[1, PAD_TOKEN, PAD_TOKEN], [2, 3, 4]] });
    const shared = decodeGrid(hash);
    assert.deepEqual(shared.matrix, [[1], [2, 3, 4]]);
    assert.deepEqual(shared.colors, {});
    assert.equal(shared.showIndices, false);
    assert.deepEqual(parseInput(formatMatrix(shared.matrix)).matrix, [[1, PAD_TOKEN, PAD_TOKEN], [2, 3, 4]]);
});

test("invalid colours are dropped on both ends", () => {
    const hash = encodeGrid({ matrix: [[1]], colors: { 1: "red", 2: "#12345", 3: "#abcdef" } });
    assert.deepEqual(decodeGrid(hash).colors, { 3: "#abcdef" });
    const forged = `#g=${btoa(JSON.stringify({ v: 1, m: [[1]], c: { 1: "url(x)" } })).replace(/=+$/, "")}`;
    assert.deepEqual(decodeGrid(forged).colors, {});
});

test("grids that make a very long link are refused", () => {
    const big = Array.from({ length: 40 }, () => Array.from({ length: 40 }, (_, j) => j));
    assert.equal(encodeGrid({ matrix: big }), null);
    assert.equal(decodeGrid(`#g=${"A".repeat(2001)}`), null);
});

test("garbage and foreign hashes decode to nothing", () => {
    const forge = (payload) => `#g=${btoa(JSON.stringify(payload)).replace(/=+$/, "")}`;
    for (const hash of [
        "", "#", "#g=", "#g=%%%", "#x=1", "#g=not-base64!", `#g=${btoa("nope")}`,
        forge({ v: 2, m: [[1]] }), forge({ v: 1, m: [] }), forge({ v: 1, m: [1, 2] }),
        forge({ v: 1, m: [[{ a: 1 }]] }), forge({ v: 1 }), forge([1]), forge(null),
        undefined, null, 42,
    ]) {
        assert.equal(decodeGrid(hash), null, String(hash));
    }
});

test("a sorting run encodes as a readable hash", () => {
    assert.equal(encodeSort({ values: [5, 2, 4, 1, 3], step: 14 }), "#a=5,2,4,1,3&s=14");
    assert.equal(encodeSort({ values: [5, 2, 4] }), "#a=5,2,4&s=0");
    assert.equal(encodeSort({ values: [5, 2, 4], step: -3 }), "#a=5,2,4&s=0");
    assert.deepEqual(decodeSort("#a=5,2,4,1,3&s=14"), { values: [5, 2, 4, 1, 3], step: 14 });
    assert.deepEqual(decodeSort("#a=5%2C2%2C4%2C1%2C3"), { values: [5, 2, 4, 1, 3], step: 0 });
    assert.deepEqual(decodeSort("#s=4&a=9,8,7"), { values: [9, 8, 7], step: 4 });
});

test("sorting hashes are validated like typed input", () => {
    for (const hash of ["", "#s=3", "#a=", "#a=1,2", "#a=1,x,3", "#a=0,5,9", "#a=100,5,9", "#g=abc"]) {
        assert.equal(decodeSort(hash), null, hash);
    }
    assert.deepEqual(decodeSort("#a=3,2,1&s=-5"), { values: [3, 2, 1], step: 0 });
    assert.deepEqual(decodeSort("#a=3,2,1&s=abc"), { values: [3, 2, 1], step: 0 });
});

test("a step index can ride along with any hash", () => {
    assert.equal(readStep("#g=abc&s=12"), 12);
    assert.equal(readStep("#s=7"), 7);
    assert.equal(readStep("#s=3&g=abc"), 3);
    for (const hash of ["", "#", "#g=abc", "#s=", "#s=-1", "#s=x", "#s=2.9", undefined]) {
        assert.equal(readStep(hash), hash === "#s=2.9" ? 2 : 0, String(hash));
    }
    const grid = encodeGrid({ matrix: [[1, 2]] });
    assert.deepEqual(decodeGrid(`${grid}&s=4`).matrix, [[1, 2]]);
    assert.equal(readStep(`${grid}&s=4`), 4);
});

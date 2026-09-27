import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PRACTICE, PRACTICE_SITES } from "../src/lib/practice.js";
import { GRID_PAGE_LIST, MATRIX_PAGE_LIST, SORT_PAGE_LIST, TOOLS, TRAVERSAL_PAGE_LIST } from "../src/lib/catalog.js";

const PAGES = [
    ...SORT_PAGE_LIST,
    ...TRAVERSAL_PAGE_LIST,
    ...MATRIX_PAGE_LIST,
    ...GRID_PAGE_LIST,
    TOOLS.arrays1d,
    TOOLS.arrays,
    TOOLS.complexity,
].map((page) => page.path);

const URLS = {
    leetcode: /^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/$/,
    codeforces: /^https:\/\/codeforces\.com\/problemset\/problem\/\d+\/[A-Z]\d?$/,
    cses: /^https:\/\/cses\.fi\/problemset\/task\/\d+$/,
};

const ROUTES = [
    "algorithms/sorting/[algo]",
    "data-structures/arrays/traversal/[kind]",
    "data-structures/arrays/matrix/[op]",
    "algorithms/grid/[slug]",
    "data-structures/arrays/1d",
    "data-structures/arrays",
    "algorithms/complexity",
];

test("every tool page has two or three practice problems", () => {
    assert.equal(PAGES.length, 19);
    assert.deepEqual(Object.keys(PRACTICE).sort(), PAGES.slice().sort());
    for (const [path, items] of Object.entries(PRACTICE)) {
        assert.ok(items.length >= 2 && items.length <= 3, `${path}: ${items.length} problems`);
        assert.equal(new Set(items.map((item) => item.url)).size, items.length, `${path}: duplicate problem`);
    }
});

test("each problem is a well-formed link to a known judge", () => {
    for (const [path, items] of Object.entries(PRACTICE)) {
        for (const item of items) {
            const where = `${path}: ${item.title}`;
            assert.ok(PRACTICE_SITES[item.site], `${where}: unknown site ${item.site}`);
            assert.match(item.url, URLS[item.site], where);
            assert.ok(["Easy", "Medium"].includes(item.level), `${where}: level ${item.level}`);
            assert.ok(item.title.trim().length > 0, where);
            assert.ok(item.note.length > 0 && item.note.length <= 120, `${where}: note is ${item.note.length} characters`);
        }
    }
});

test("every route with practice problems renders them", async () => {
    for (const route of ROUTES) {
        const source = await readFile(new URL(`../src/app/${route}/page.jsx`, import.meta.url), "utf8");
        assert.match(source, /<PracticeLinks\b/, route);
    }
});

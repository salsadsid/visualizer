import test from "node:test";
import assert from "node:assert/strict";
import { SORTERS, SORTER_LIST } from "../src/lib/algorithms/sorting.js";
import { predictScore, questionIndexes } from "../src/lib/predict.js";

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

const LIVE_ROLES_AT_A_QUESTION = {
    bubble: ({ j }) => ({ [j]: "compare", [j + 1]: "compare" }),
    selection: ({ j, min }) => ({ [min]: "min", [j]: "compare" }),
    insertion: ({ j }) => ({ [j]: "compare" }),
};

for (const sorter of SORTER_LIST) {
    test(`${sorter.key}: asks a yes/no question at every comparison and nowhere else`, () => {
        for (const { label, input } of cases()) {
            const { steps } = sorter.run(input);
            assert.equal(steps.at(-1).ask, undefined, `${label}: question on the last step`);
            assert.equal(
                questionIndexes(steps).length,
                steps.at(-1).stats.comparisons,
                `${label}: one question per comparison`
            );
            for (const [index, step] of steps.entries()) {
                const where = `${label} step ${index}`;
                assert.equal(Boolean(step.ask), step.line === 3, `${where}: question off the compare line`);
                if (!step.ask) continue;
                assert.deepEqual(step.ask.choices, ["Yes", "No"], where);
                assert.equal(step.ask.answer === 0, steps[index + 1].line === 4, `${where}: answer disagrees with the next step`);
                assert.match(step.ask.prompt, /\?$/, where);
                assert.notEqual(step.ask.prompt, step.message, where);
            }
        }
    });

    test(`${sorter.key}: a question step shows nothing that gives the answer away`, () => {
        for (const { label, input } of cases()) {
            for (const [index, step] of sorter.run(input).steps.entries()) {
                if (!step.ask) continue;
                const live = Object.fromEntries(
                    Object.entries(step.highlights).filter(([, role]) => role !== "sorted")
                );
                assert.deepEqual(live, LIVE_ROLES_AT_A_QUESTION[sorter.key](step.pointers), `${label} step ${index}`);
            }
        }
    });
}

test("bubble and insertion answer Yes once per inversion", () => {
    for (const key of ["bubble", "insertion"]) {
        for (const { label, input } of cases()) {
            const yes = SORTERS[key].run(input).steps.filter((step) => step.ask?.answer === 0).length;
            assert.equal(yes, inversions(input), `${key} ${label}`);
        }
    }
});

test("a small input gives a fixed round of questions", () => {
    const input = [5, 2, 4, 1, 3];
    const round = (key) => SORTERS[key].run(input).steps;
    const answers = (steps) => steps.filter((step) => step.ask).map((step) => step.ask.choices[step.ask.answer][0]).join("");
    assert.deepEqual(
        ["bubble", "selection", "insertion"].map((key) => round(key).length),
        [26, 31, 26]
    );
    assert.equal(answers(round("bubble")), "YYYYNYYYNN");
    assert.equal(answers(round("insertion")), "YYNYYYYYN");
    assert.equal(round("bubble")[2].ask.prompt, "Compare 5 and 2: will they swap?");

    const steps = round("bubble");
    const questions = questionIndexes(steps);
    const right = Object.fromEntries(questions.map((index) => [index, steps[index].ask.answer]));
    const alwaysYes = Object.fromEntries(questions.map((index) => [index, 0]));
    assert.equal(predictScore(steps, questions, right).best, 10);
    assert.equal(predictScore(steps, questions, alwaysYes).correct, 7);
});

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

test("every sorter ships with everything its page needs", async () => {
    const { readFile } = await import("node:fs/promises");
    const { LANGUAGES, SORT_CODE } = await import("../src/lib/algorithms/snippets.js");
    const { sortPageFor } = await import("../src/lib/catalog.js");
    const route = await readFile(
        new URL("../src/app/algorithms/sorting/[algo]/page.jsx", import.meta.url),
        "utf8"
    );
    const explainers = route.slice(route.indexOf("const EXPLAINERS"), route.indexOf("};"));

    for (const sorter of SORTER_LIST) {
        assert.ok(sorter.label && sorter.blurb && sorter.lead, `${sorter.key}: missing copy`);
        for (const field of ["best", "average", "worst", "space", "stable"]) {
            assert.ok(sorter.complexity[field], `${sorter.key}: missing complexity.${field}`);
        }
        for (const language of LANGUAGES) {
            assert.ok(
                SORT_CODE[sorter.key]?.[language.id]?.length > 0,
                `${sorter.key}: no ${language.label} code in snippets.js`
            );
        }
        assert.ok(sortPageFor(sorter.key), `${sorter.key}: no SORT_PAGES entry in catalog.js`);
        assert.match(
            explainers,
            new RegExp(`\\b${sorter.key}:`),
            `${sorter.key}: no explainer registered in the sorting route`
        );
    }
});

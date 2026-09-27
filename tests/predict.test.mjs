import test from "node:test";
import assert from "node:assert/strict";
import {
    YES_NO,
    fenceOf,
    lastAnswer,
    openQuestion,
    predictScore,
    questionIndexes,
    yesNo,
} from "../src/lib/predict.js";

const steps = [
    { message: "start" },
    { message: "first", ask: yesNo("First?", true) },
    { message: "between" },
    { message: "second", ask: yesNo("Second?", false) },
    { message: "third", ask: yesNo("Third?", true) },
    { message: "end" },
];
const questions = questionIndexes(steps);

test("a yes/no question shares the frozen choice list", () => {
    assert.deepEqual(yesNo("Swap?", true), { prompt: "Swap?", choices: ["Yes", "No"], answer: 0 });
    assert.equal(yesNo("Swap?", false).answer, 1);
    assert.equal(yesNo("Swap?", true).choices, YES_NO);
    assert.ok(Object.isFrozen(YES_NO));
});

test("questions are found in step order", () => {
    assert.deepEqual(questions, [1, 3, 4]);
    assert.deepEqual(questionIndexes([{}, {}]), []);
});

test("the fence sits on the first unanswered question", () => {
    assert.equal(fenceOf(questions, {}), 1);
    assert.equal(fenceOf(questions, { 1: 0 }), 3);
    assert.equal(fenceOf(questions, { 1: 0, 3: 1 }), 4);
    assert.equal(fenceOf(questions, { 1: 0, 3: 1, 4: 0 }), Infinity);
    assert.equal(fenceOf([], {}), Infinity);
});

test("a question is open only while predicting and unanswered", () => {
    assert.equal(openQuestion(steps, {}, 1, false), null);
    assert.equal(openQuestion(steps, {}, 1, true), steps[1].ask);
    assert.equal(openQuestion(steps, { 1: 0 }, 1, true), null);
    assert.equal(openQuestion(steps, {}, 2, true), null);
    assert.equal(openQuestion(steps, {}, 99, true), null);
});

test("the latest answer at or before a step is reported with its verdict", () => {
    assert.equal(lastAnswer(steps, questions, {}, 5), null);
    assert.equal(lastAnswer(steps, questions, { 1: 1 }, 0), null);
    assert.deepEqual(lastAnswer(steps, questions, { 1: 1 }, 2), {
        index: 1,
        choice: 1,
        correct: false,
        ask: steps[1].ask,
    });
    assert.equal(lastAnswer(steps, questions, { 1: 0, 3: 1 }, 3).correct, true);
    assert.equal(lastAnswer(steps, questions, { 1: 0, 3: 1 }, 4).index, 3);
});

test("the score counts correct answers, the current streak and the best streak", () => {
    assert.deepEqual(predictScore(steps, questions, {}), {
        total: 3,
        answered: 0,
        correct: 0,
        streak: 0,
        best: 0,
        accuracy: 0,
        done: false,
    });
    assert.deepEqual(predictScore(steps, questions, { 1: 1, 3: 1, 4: 0 }), {
        total: 3,
        answered: 3,
        correct: 2,
        streak: 2,
        best: 2,
        accuracy: 67,
        done: true,
    });
    const mixed = predictScore(steps, questions, { 1: 0, 3: 0, 4: 0 });
    assert.equal(mixed.correct, 2);
    assert.equal(mixed.streak, 1);
    assert.equal(mixed.best, 1);
    const perfect = predictScore(steps, questions, { 1: 0, 3: 1, 4: 0 });
    assert.equal(perfect.accuracy, 100);
    assert.equal(perfect.best, 3);
    assert.equal(predictScore(steps, questions, { 1: 1 }).accuracy, 0);
});

test("answers past an unanswered question are ignored", () => {
    const score = predictScore(steps, questions, { 1: 0, 4: 0 });
    assert.equal(score.answered, 1);
    assert.equal(score.done, false);
});

test("a run without questions is never done", () => {
    assert.equal(predictScore([{}, {}], [], {}).done, false);
});

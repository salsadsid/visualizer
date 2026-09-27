"use client";
import { useEffect, useMemo, useState } from "react";
import { fenceOf, lastAnswer, openQuestion, predictScore, questionIndexes } from "@/lib/predict";
import { track } from "@/lib/analytics";

const NONE = {};

export function usePredict(steps, on) {
    const [answers, setAnswers] = useState(NONE);
    const [prevSteps, setPrevSteps] = useState(steps);
    const [prevOn, setPrevOn] = useState(on);

    const stale = steps !== prevSteps || on !== prevOn;
    if (stale) {
        setPrevSteps(steps);
        setPrevOn(on);
        setAnswers(NONE);
    }
    const current = stale ? NONE : answers;

    const questions = useMemo(() => questionIndexes(steps), [steps]);
    const available = questions.length > 0;
    const active = Boolean(on) && available;
    const score = useMemo(() => predictScore(steps, questions, current), [steps, questions, current]);

    return {
        active,
        available,
        questions,
        score,
        limit: active ? fenceOf(questions, current) : Infinity,
        askAt: (index) => openQuestion(steps, current, index, active),
        resultAt: (index) => (active ? lastAnswer(steps, questions, current, index) : null),
        answer: (index, choice) =>
            setAnswers((given) => (Object.hasOwn(given, index) ? given : { ...given, [index]: choice })),
        restart: () => setAnswers(NONE),
    };
}

export function usePredictRound(quiz, player, { tool, algo, setOn, shared }) {
    const ask = quiz.askAt(player.index);
    const result = ask ? null : quiz.resultAt(player.index);
    const { done, accuracy } = quiz.score;
    const fromLink = Boolean(shared?.predict);

    useEffect(() => {
        if (fromLink) track("predict_start", { tool, algo, from: "link" });
    }, [fromLink, shared, tool, algo]);

    useEffect(() => {
        if (done) track("predict_complete", { tool, algo, accuracy });
    }, [done, accuracy, tool, algo]);

    const answer = (choice) => {
        if (!ask) return;
        quiz.answer(player.index, choice);
        if (choice !== ask.answer) player.pause();
    };

    const chooseMode = (mode) => {
        const next = mode === "predict";
        if (next === quiz.active) return;
        if (next) {
            track("predict_start", { tool, algo, from: "toggle" });
            player.reset();
        }
        setOn(next);
    };

    return {
        ask,
        result,
        number: ask ? quiz.questions.indexOf(player.index) + 1 : 0,
        message: ask ? ask.prompt : player.step.message,
        keys: ask
            ? Object.fromEntries(ask.choices.map((choice, i) => [choice[0].toLowerCase(), () => answer(i)]))
            : null,
        answer,
        chooseMode,
    };
}

export const YES_NO = Object.freeze(["Yes", "No"]);

export function yesNo(prompt, yes) {
    return { prompt, choices: YES_NO, answer: yes ? 0 : 1 };
}

export function questionIndexes(steps) {
    const found = [];
    steps.forEach((step, index) => {
        if (step.ask) found.push(index);
    });
    return found;
}

const isAnswered = (answers, index) => Object.hasOwn(answers, index);

export function fenceOf(questions, answers) {
    const open = questions.find((index) => !isAnswered(answers, index));
    return open ?? Infinity;
}

export function openQuestion(steps, answers, index, active) {
    if (!active) return null;
    const ask = steps[index]?.ask;
    return ask && !isAnswered(answers, index) ? ask : null;
}

export function lastAnswer(steps, questions, answers, index) {
    for (let k = questions.length - 1; k >= 0; k--) {
        const at = questions[k];
        if (at > index || !isAnswered(answers, at)) continue;
        const ask = steps[at].ask;
        const choice = answers[at];
        return { index: at, choice, correct: choice === ask.answer, ask };
    }
    return null;
}

export function predictScore(steps, questions, answers) {
    let answered = 0;
    let correct = 0;
    let streak = 0;
    let best = 0;
    for (const index of questions) {
        if (!isAnswered(answers, index)) break;
        answered++;
        if (answers[index] === steps[index].ask.answer) {
            correct++;
            streak++;
            best = Math.max(best, streak);
        } else {
            streak = 0;
        }
    }
    const total = questions.length;
    return {
        total,
        answered,
        correct,
        streak,
        best,
        accuracy: answered ? Math.round((100 * correct) / answered) : 0,
        done: total > 0 && answered === total,
    };
}

// Beginner step-through demos for the Big-O page: watch a loop visit boxes and
// count every step out loud. Same snapshot idea as sorting.js, but over a row of
// numbered "boxes" (positions) instead of an array of values:
//
//   Step = {
//     cells:    { [index]: Role },   // Role ∈ "compare" (current) | "min" (outer i) | "sorted" (counted)
//     pointers: { [name]: index },   // ▲ markers under the boxes
//     vars:     { steps },           // the star of the show — the running step count
//     line:     number,              // active pseudocode line
//     message:  string,              // plain-English narration
//   }
//
// Everything is deterministic and computed once at module load (pure loops), so the
// step lists are stable across renders — usePlayer resets only when the demo changes.

function makeTrace() {
    const steps = [];
    const push = (line, message, cells = {}, pointers = {}, count = 0) =>
        steps.push({ line, message, cells, pointers, vars: { steps: count } });
    return { steps, push };
}

function scanDemo(n) {
    const t = makeTrace();
    t.push(
        0,
        `${n} boxes. The plan is honest and simple: visit every single one, and count each visit as 1 step. Press ▶ to watch.`
    );
    const done = {};
    for (let i = 1; i <= n; i++) {
        const cells = { ...done, [i - 1]: "compare" };
        const msg =
            i === 1
                ? `Visit box 1 → step 1. Off we go!`
                : i === n
                    ? `Visit box ${i} → step ${i}. That's the last one!`
                    : `Visit box ${i} → step ${i}.`;
        t.push(1, msg, cells, { i: i - 1 }, i);
        done[i - 1] = "sorted";
    }
    t.push(
        2,
        `${n} boxes took exactly ${n} steps. Double the boxes → double the steps. Growing in a straight line like that is called linear — O(n). 🙂`,
        { ...done },
        {},
        n
    );
    return t.steps;
}

function doublingDemo(n) {
    const t = makeTrace();
    t.push(
        0,
        `${n} boxes — but this time we DON'T visit them all. Start at box 1 and double the jump every time: 1, 2, 4, 8… Press ▶ to watch.`
    );
    const done = {};
    let count = 0;
    for (let i = 1; i <= n; i *= 2) {
        count++;
        const cells = { ...done, [i - 1]: "compare" };
        t.push(
            2,
            count === 1
                ? `Start at box 1 → step 1.`
                : `Jump to box ${i} → only step ${count}! Look at all the boxes we skipped.`,
            cells,
            { i: i - 1 },
            count
        );
        done[i - 1] = "sorted";
    }
    t.push(
        4,
        `We crossed all ${n} boxes in just ${count} steps. A MILLION boxes would take about 20. Halving/doubling like this is logarithmic — O(log n). ⚡`,
        { ...done },
        {},
        count
    );
    return t.steps;
}

function pairsDemo(n) {
    const t = makeTrace();
    t.push(
        0,
        `Only ${n} boxes… but now every box wants to meet every other box — like handshakes at a party. 🤝 Count every handshake. Press ▶ to watch.`
    );
    let count = 0;
    for (let i = 1; i <= n; i++) {
        for (let j = i + 1; j <= n; j++) {
            count++;
            t.push(
                2,
                `Box ${i} meets box ${j} → step ${count}.`,
                { [i - 1]: "min", [j - 1]: "compare" },
                { i: i - 1, j: j - 1 },
                count
            );
        }
    }
    const all = {};
    for (let k = 0; k < n; k++) all[k] = "sorted";
    t.push(
        3,
        `${n} boxes needed ${count} steps. 100 boxes → 4,950. 1,000 → 499,500! 😅 Pairing everyone with everyone is quadratic — O(n²).`,
        all,
        {},
        count
    );
    return t.steps;
}

export const LOOP_DEMOS = [
    {
        key: "scan",
        label: "One by one",
        big: "O(n)",
        classId: "linear",
        cellCount: 12,
        blurb: "Visit every box once — the most honest loop there is.",
        pseudocode: [
            "for i in 1 .. n:",
            "  visit box i        // +1 step",
            "done → steps = n",
        ],
        steps: scanDemo(12),
    },
    {
        key: "doubling",
        label: "Double jumps",
        big: "O(log n)",
        classId: "log",
        cellCount: 16,
        blurb:
            "Double the jump each time — the phone-book trick in reverse: halving and doubling are mirror images.",
        pseudocode: [
            "i = 1",
            "while i <= n:",
            "  visit box i        // +1 step",
            "  i = i * 2          // jump ahead!",
            "done → steps ≈ log₂(n)",
        ],
        steps: doublingDemo(16),
    },
    {
        key: "pairs",
        label: "Every pair",
        big: "O(n²)",
        classId: "quadratic",
        cellCount: 6,
        blurb: "Every box meets every other box — watch the count explode.",
        pseudocode: [
            "for i in 1 .. n:",
            "  for j in i+1 .. n:",
            "    box i meets box j   // +1 step",
            "done → steps = n·(n−1)/2",
        ],
        steps: pairsDemo(6),
    },
];

// Step-by-step sorting algorithms for the visualizer.
//
// Each sorter exposes static `pseudocode` (string[]) and a `run(values)` that returns
// a flat list of step snapshots the player animates:
//
//   Step = {
//     array:      number[],                 // working array at this moment
//     highlights: { [index]: Role },        // per-index visual role
//     pointers:   { [name]: index },        // loop index variables drawn under bars
//     vars:       { [name]: value },        // scalar variables shown as chips
//     line:       number,                    // active pseudocode line (0-based)
//     message:    string,                    // plain-English narration
//     stats:      { comparisons, swaps, writes }   // cumulative counters
//   }
//
// Role ∈ "compare" | "swap" | "min" | "key" | "shift" | "sorted".

// A small recorder that snapshots the array and keeps "locked" (sorted) positions
// green across every subsequent step. `pointers` and `vars` are mutated in place as
// the algorithm runs; each push captures a shallow copy.
function makeRecorder(a) {
    const steps = [];
    const stats = { comparisons: 0, swaps: 0, writes: 0 };
    const sorted = new Set();
    const pointers = {};
    const vars = {};
    const lockAll = () => {
        for (let i = 0; i < a.length; i++) sorted.add(i);
    };
    const clearLive = () => {
        for (const k in pointers) delete pointers[k];
        for (const k in vars) delete vars[k];
    };
    const push = (line, message, highlights = {}) => {
        const merged = {};
        for (const i of sorted) merged[i] = "sorted";
        Object.assign(merged, highlights);
        steps.push({
            array: a.slice(),
            highlights: merged,
            pointers: { ...pointers },
            vars: { ...vars },
            line,
            message,
            stats: { ...stats },
        });
    };
    return { steps, stats, sorted, pointers, vars, lockAll, clearLive, push };
}

function bubble(values) {
    const a = values.slice();
    const n = a.length;
    const r = makeRecorder(a);

    r.push(
        0,
        "Bubble sort compares each neighbouring pair and swaps them if they're out of order, so big values 'bubble' to the right."
    );

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        r.vars.i = i;
        r.vars.swapped = false;
        r.push(1, `Pass ${i + 1}: assume we're done unless a swap happens.`);
        for (let j = 0; j < n - 1 - i; j++) {
            r.stats.comparisons++;
            r.pointers.j = j;
            const x = a[j];
            const y = a[j + 1];
            const out = x > y;
            r.push(
                3,
                out
                    ? `Compare ${x} and ${y} → ${x} > ${y}, so swap them.`
                    : `Compare ${x} and ${y} → already in order, leave them.`,
                { [j]: "compare", [j + 1]: "compare" }
            );
            if (out) {
                a[j] = y;
                a[j + 1] = x;
                r.stats.swaps++;
                r.stats.writes += 2;
                swapped = true;
                r.vars.swapped = true;
                r.push(4, `Swapped → ${a[j]}, ${a[j + 1]}.`, {
                    [j]: "swap",
                    [j + 1]: "swap",
                });
            }
        }
        delete r.pointers.j;
        if (!swapped) {
            r.clearLive();
            r.lockAll();
            r.push(6, "A full pass with no swaps — the array is already sorted! 🎉");
            return { steps: r.steps };
        }
        r.sorted.add(n - 1 - i);
        r.push(6, `Biggest value of this pass is settled at index ${n - 1 - i}.`);
    }

    r.clearLive();
    r.lockAll();
    r.push(6, "Every value is in order. Sorted! 🎉");
    return { steps: r.steps };
}

function selection(values) {
    const a = values.slice();
    const n = a.length;
    const r = makeRecorder(a);

    r.push(
        0,
        "Selection sort scans the unsorted part for the smallest value each pass, then drops it into place."
    );

    for (let i = 0; i < n; i++) {
        let min = i;
        r.pointers.i = i;
        r.pointers.min = min;
        delete r.pointers.j;
        r.push(1, `Pass ${i + 1}: assume a[${i}] = ${a[i]} is the smallest left.`, {
            [i]: "min",
        });
        for (let j = i + 1; j < n; j++) {
            r.stats.comparisons++;
            r.pointers.j = j;
            const better = a[j] < a[min];
            r.push(
                3,
                better
                    ? `${a[j]} < ${a[min]} → new smallest at index ${j}.`
                    : `${a[j]} ≥ ${a[min]} → keep the current smallest.`,
                { [min]: "min", [j]: "compare" }
            );
            if (better) {
                min = j;
                r.pointers.min = min;
                r.push(4, `Smallest so far: a[${min}] = ${a[min]}.`, {
                    [min]: "min",
                });
            }
        }
        delete r.pointers.j;
        if (min !== i) {
            [a[i], a[min]] = [a[min], a[i]];
            r.stats.swaps++;
            r.stats.writes += 2;
            r.push(5, `Swap the smallest (${a[i]}) into position ${i}.`, {
                [i]: "swap",
                [min]: "swap",
            });
        } else {
            r.push(5, `a[${i}] = ${a[i]} is already smallest — no swap needed.`, {
                [i]: "min",
            });
        }
        r.sorted.add(i);
        r.push(5, `Position ${i} is locked in.`);
    }

    r.clearLive();
    r.lockAll();
    r.push(5, "Sorted! 🎉");
    return { steps: r.steps };
}

function insertion(values) {
    const a = values.slice();
    const n = a.length;
    const r = makeRecorder(a);

    r.sorted.add(0);
    r.push(
        0,
        "Insertion sort grows a sorted region on the left, sliding each new value back to where it belongs.",
        { 0: "sorted" }
    );

    for (let i = 1; i < n; i++) {
        const key = a[i];
        r.pointers.i = i;
        r.vars.key = key;
        delete r.pointers.j;
        r.push(1, `Take a[${i}] = ${key} as the key to insert.`, { [i]: "key" });
        let j = i - 1;
        r.pointers.j = j;
        while (j >= 0) {
            r.stats.comparisons++;
            r.pointers.j = j;
            if (a[j] > key) {
                r.push(3, `${a[j]} > ${key} → slide ${a[j]} one slot right.`, {
                    [j]: "compare",
                    [j + 1]: "shift",
                });
                a[j + 1] = a[j];
                r.stats.writes++;
                r.push(4, `Moved ${a[j + 1]} into index ${j + 1}.`, {
                    [j + 1]: "shift",
                });
                j--;
                r.pointers.j = j;
            } else {
                r.push(3, `${a[j]} ≤ ${key} → found the spot, right after index ${j}.`, {
                    [j]: "compare",
                });
                break;
            }
        }
        a[j + 1] = key;
        r.stats.writes++;
        for (let k = 0; k <= i; k++) r.sorted.add(k);
        r.push(6, `Drop key ${key} at index ${j + 1}. Left side (0…${i}) is sorted.`, {
            [j + 1]: "key",
        });
    }

    r.clearLive();
    r.lockAll();
    r.push(6, "Sorted! 🎉");
    return { steps: r.steps };
}

export const SORTERS = {
    bubble: {
        key: "bubble",
        label: "Bubble Sort",
        blurb:
            "Repeatedly swaps adjacent out-of-order pairs. The simplest sort to picture — but O(n²) and slow.",
        roles: ["compare", "swap", "sorted"],
        pseudocode: [
            "for i in 0 .. n-2:",
            "  swapped = false",
            "  for j in 0 .. n-2-i:",
            "    if a[j] > a[j+1]:",
            "      swap(a[j], a[j+1])",
            "      swapped = true",
            "  if not swapped: break   // already sorted",
        ],
        run: bubble,
    },
    selection: {
        key: "selection",
        label: "Selection Sort",
        blurb:
            "Finds the smallest remaining value each pass and places it. Always O(n²), but does the fewest swaps.",
        roles: ["compare", "min", "swap", "sorted"],
        pseudocode: [
            "for i in 0 .. n-1:",
            "  min = i",
            "  for j in i+1 .. n-1:",
            "    if a[j] < a[min]:",
            "      min = j",
            "  swap(a[i], a[min])",
        ],
        run: selection,
    },
    insertion: {
        key: "insertion",
        label: "Insertion Sort",
        blurb:
            "Inserts each value into a growing sorted prefix. Great on small or nearly-sorted data (best case O(n)).",
        roles: ["compare", "key", "shift", "sorted"],
        pseudocode: [
            "for i in 1 .. n-1:",
            "  key = a[i]",
            "  j = i - 1",
            "  while j >= 0 and a[j] > key:",
            "    a[j+1] = a[j]",
            "    j = j - 1",
            "  a[j+1] = key",
        ],
        run: insertion,
    },
};

export const SORTER_LIST = Object.values(SORTERS);

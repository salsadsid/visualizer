function makeTrace(values, extraSlot = false) {
    const a = values.slice();
    if (extraSlot) a.push(null);
    const steps = [];
    const stats = { reads: 0, writes: 0, compares: 0 };
    const pointers = {};
    const vars = {};
    const push = (line, message, highlights = {}) => {
        steps.push({
            array: a.slice(),
            highlights: { ...highlights },
            pointers: { ...pointers },
            vars: { ...vars },
            line,
            message,
            stats: { ...stats },
        });
    };
    return { a, steps, stats, pointers, vars, push };
}

const clampIndex = (index, max) => Math.max(0, Math.min(Number.isInteger(index) ? index : 0, max));

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function access(values, { index } = {}) {
    const n = values.length;
    const t = makeTrace(values);
    const i = clampIndex(index, n - 1);
    t.vars.n = n;
    t.pointers.i = i;
    t.push(0, `To read a[${i}] the computer does not walk along the array. Every slot has the same size, so the address of slot ${i} is base + ${i} × size: one multiplication and one addition.`);
    t.stats.reads++;
    t.vars.value = values[i];
    t.push(1, `Jump straight to that address and read it: a[${i}] = ${values[i]}.`, { [i]: "current" });
    t.push(2, `Done, in a single read. It would be a single read in an array of a million slots too. That is O(1).`, { [i]: "found" });
    return { steps: t.steps };
}

function insert(values, { index, value } = {}) {
    const n = values.length;
    const t = makeTrace(values, true);
    const i = clampIndex(index, n);
    const v = Number.isFinite(value) ? value : 0;
    t.vars.n = n;
    t.vars.value = v;
    t.pointers.i = i;
    t.push(
        0,
        i === n
            ? `There is one free slot at the end, a[${n}], and that is exactly where ${v} goes. No shifting needed.`
            : `There is one free slot at the end, a[${n}]. To open a gap at a[${i}], every value from a[${i}] to a[${n - 1}] moves one place right, starting from the end so nothing gets overwritten.`
    );
    for (let j = n - 1; j >= i; j--) {
        t.pointers.j = j;
        t.stats.reads++;
        t.stats.writes++;
        t.a[j + 1] = t.a[j];
        t.push(2, `Copy a[${j}] = ${t.a[j]} into a[${j + 1}].`, { [j + 1]: "shift", [j]: "current" });
    }
    delete t.pointers.j;
    t.a[i] = v;
    t.stats.writes++;
    t.push(3, `Slot a[${i}] is free now. Write ${v} into it.`, { [i]: "write" });
    t.vars.n = n + 1;
    t.push(
        4,
        `Length is now ${n + 1}. That cost ${plural(n - i, "shift")} plus one write. Inserting at the front would cost ${n}; at the end, none.`,
        { [i]: "done" }
    );
    return { steps: t.steps };
}

function remove(values, { index } = {}) {
    const n = values.length;
    const t = makeTrace(values);
    const i = clampIndex(index, n - 1);
    t.vars.n = n;
    t.vars.removed = values[i];
    t.pointers.i = i;
    t.push(0, `Remove a[${i}] = ${values[i]}. That leaves a hole, and an array cannot have holes, so everything after it moves one place left.`, { [i]: "remove" });
    for (let j = i; j < n - 1; j++) {
        t.pointers.j = j;
        t.stats.reads++;
        t.stats.writes++;
        t.a[j] = t.a[j + 1];
        t.push(2, `Copy a[${j + 1}] = ${t.a[j]} into a[${j}].`, { [j]: "shift", [j + 1]: "current" });
    }
    delete t.pointers.j;
    t.a[n - 1] = null;
    t.vars.n = n - 1;
    t.push(3, `Length is now ${n - 1}. The last slot, a[${n - 1}], is unused: the value is either cleared or simply ignored.`);
    t.push(4, `That cost ${plural(n - 1 - i, "shift")}. Deleting the last value is free; deleting the first costs ${n - 1}.`);
    return { steps: t.steps };
}

function search(values, { target } = {}) {
    const n = values.length;
    const t = makeTrace(values);
    const q = Number.isFinite(target) ? target : values[0];
    t.vars.target = q;
    t.vars.found = false;
    t.push(0, `Look for ${q}. An unsorted array offers no shortcut, so check the boxes one by one from the left.`);
    for (let i = 0; i < n; i++) {
        t.pointers.i = i;
        t.stats.reads++;
        t.stats.compares++;
        if (values[i] === q) {
            t.vars.found = true;
            t.push(1, `Compare a[${i}] = ${values[i]} with ${q}: equal.`, { [i]: "current" });
            t.push(2, `Found it at index ${i} after ${plural(i + 1, "compare")}. Stop here, even if ${q} appears again later.`, { [i]: "found" });
            return { steps: t.steps };
        }
        t.push(1, `Compare a[${i}] = ${values[i]} with ${q}: not equal, move on.`, { [i]: "current" });
    }
    delete t.pointers.i;
    t.push(3, `Checked all ${n} boxes and none held ${q}. Return -1, the usual way to say not found.`);
    return { steps: t.steps };
}

function reverse(values) {
    const n = values.length;
    const t = makeTrace(values);
    let lo = 0;
    let hi = n - 1;
    const done = {};
    t.pointers.lo = lo;
    t.pointers.hi = hi;
    t.vars.swaps = 0;
    t.push(0, `Two pointers: lo at the first box, hi at the last. Swap what they point at, then walk them towards each other.`);
    while (lo < hi) {
        t.push(2, `Swap a[${lo}] = ${t.a[lo]} and a[${hi}] = ${t.a[hi]}.`, { ...done, [lo]: "pair", [hi]: "pair" });
        [t.a[lo], t.a[hi]] = [t.a[hi], t.a[lo]];
        t.stats.reads += 2;
        t.stats.writes += 2;
        t.vars.swaps++;
        done[lo] = "done";
        done[hi] = "done";
        lo++;
        hi--;
        t.pointers.lo = lo;
        t.pointers.hi = hi;
        t.push(
            3,
            lo < hi
                ? `Both ends are in their final place. Move lo right and hi left.`
                : lo === hi
                  ? `The pointers meet at a[${lo}], the middle value, which stays where it is.`
                  : `The pointers have crossed. Nothing left to swap.`,
            { ...done }
        );
    }
    if (n % 2 === 1) done[Math.floor(n / 2)] = "done";
    t.push(
        1,
        n === 1
            ? `A single value is its own reverse. Nothing to do.`
            : `Reversed with ${plural(Math.floor(n / 2), "swap")} and no second array: O(n) time, O(1) extra space.`,
        { ...done }
    );
    return { steps: t.steps };
}

export const OPERATIONS = {
    access: {
        key: "access",
        label: "Access",
        blurb: "Read a[i] in one step: the computer computes the address instead of walking the array.",
        lead: "reads any slot in one step. Because every slot has the same size and they sit side by side in memory, the address of slot i is base + i × size, so the computer jumps straight there.",
        roles: ["current", "found"],
        pseudocode: [
            "address = base + index × size",
            "value = a[index]",
            "return value",
        ],
        complexity: { best: "O(1)", worst: "O(1)", space: "O(1)" },
        inputs: ["index"],
        run: access,
    },
    insert: {
        key: "insert",
        label: "Insert",
        blurb: "Open a gap at index i by shifting everything after it one place right, then write the value.",
        lead: "puts a new value at index i. There is no gap to put it in, so every value from i onwards first moves one place to the right, starting from the end, and only then is the new value written.",
        roles: ["current", "shift", "write", "done"],
        pseudocode: [
            "if n == capacity: no room",
            "for j in n-1 down to index:",
            "  a[j+1] = a[j]      # shift right",
            "a[index] = value",
            "n = n + 1",
        ],
        complexity: { best: "O(1) at the end", worst: "O(n) at the front", space: "O(1)" },
        inputs: ["index", "value"],
        run: insert,
    },
    delete: {
        key: "delete",
        label: "Delete",
        blurb: "Remove a[i] and close the hole by shifting everything after it one place left.",
        lead: "removes the value at index i. An array cannot have a hole in the middle, so every value after i moves one place to the left and the length shrinks by one.",
        roles: ["remove", "shift", "current"],
        pseudocode: [
            "removed = a[index]",
            "for j in index .. n-2:",
            "  a[j] = a[j+1]      # shift left",
            "n = n - 1",
            "a[n] is unused now",
        ],
        complexity: { best: "O(1) at the end", worst: "O(n) at the front", space: "O(1)" },
        inputs: ["index"],
        run: remove,
    },
    search: {
        key: "search",
        label: "Linear search",
        blurb: "Find a value by checking the boxes one by one until it turns up, or the array runs out.",
        lead: "finds a value by checking every box from the left until it matches. With no order to exploit, that is the best an unsorted array allows: the target can be anywhere.",
        roles: ["current", "found"],
        pseudocode: [
            "for i in 0 .. n-1:",
            "  if a[i] == target:",
            "    return i",
            "return -1",
        ],
        complexity: { best: "O(1)", worst: "O(n)", space: "O(1)" },
        inputs: ["target"],
        run: search,
    },
    reverse: {
        key: "reverse",
        label: "Reverse",
        blurb: "Swap the two ends and walk two pointers towards the middle. No second array needed.",
        lead: "turns the array around in place with two pointers, one at each end. Swap what they point at, move both inwards, repeat until they meet. Every value moves exactly once.",
        roles: ["pair", "done"],
        pseudocode: [
            "lo = 0, hi = n-1",
            "while lo < hi:",
            "  swap(a[lo], a[hi])",
            "  lo = lo + 1; hi = hi - 1",
        ],
        complexity: { best: "O(n)", worst: "O(n)", space: "O(1)" },
        inputs: [],
        run: reverse,
    },
};

export const OPERATION_LIST = Object.values(OPERATIONS);

"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { barClass } from "@/lib/algorithms/roles";

// The animated hook for step ① of the Big-O page: two searches race through the same
// 24-name phone book, one probe per tick each. The ⚡ lane lands in 5 checks while 🐢 is
// still crawling, so the gap is felt in real time rather than asserted in prose.
//
// The book is a real alphabetical directory (one surname per letter, A→Y) because the
// sorted order IS the reason ⚡ is allowed to throw half the names away unread. With
// anonymous boxes the halving looks like magic; with letters on screen it looks obvious.
//
// Frames are precomputed at module load and replayed by a single tick counter, so the
// first render is deterministic (SSR-safe) and nothing impure runs during render.

const NAMES = [
    "Abbott", "Bhatt", "Chen", "Diallo", "Egwu", "Farouk",
    "Gupta", "Haddad", "Ibrahim", "Jensen", "Kowalski", "Lindqvist",
    "Mensah", "Nakamura", "Okafor", "Petrov", "Quintero", "Rahman",
    "Silva", "Tanaka", "Ueda", "Varga", "Wu", "Yilmaz",
];
const N = NAMES.length;
// Deep enough that binary spends its full 5 probes and visibly closes in from both
// sides, but not the last name — parking the target at the very end would make linear's
// 20 checks look like a rigged worst case rather than a typical one.
const TARGET = 19;
const TARGET_NAME = NAMES[TARGET];
// Paced for reading, not for speed: every tick shows a sentence, so the tick has to be
// long enough to actually read one. Both lanes stay on the SAME tick — one tick = one
// check in either lane — because that equal cost is what makes the 20-vs-5 gap honest.
const TICK_MS = 550;
const HOLD_MS = 3800;

const letter = (i) => NAMES[i][0];
const span = (a, b) => (a === b ? letter(a) : `${letter(a)}–${letter(b)}`);

function buildLinear() {
    const frames = [];
    for (let i = 0; i <= TARGET; i++) {
        frames.push({
            probe: i,
            done: i === TARGET,
            read:
                i === TARGET
                    ? `${NAMES[i]} — found it! 🎉`
                    : `${NAMES[i]} — nope.`,
        });
    }
    return frames;
}

function buildBinary() {
    const frames = [];
    let lo = 0;
    let hi = N - 1;
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const done = mid === TARGET;
        let read;
        // Kept short on purpose — it has one tick to be read. The full reasoning lives
        // in the static "why is ⚡ allowed to skip?" note below, which never moves.
        if (done) {
            read = `${NAMES[mid]} — found it! 🎉`;
        } else if (mid < TARGET) {
            read = `${NAMES[mid]} — ${TARGET_NAME} is later. Drop ${span(lo, mid)}.`;
        } else {
            read = `${NAMES[mid]} — ${TARGET_NAME} is earlier. Drop ${span(mid, hi)}.`;
        }
        frames.push({ probe: mid, lo, hi, done, read });
        if (done) break;
        if (mid < TARGET) lo = mid + 1;
        else hi = mid - 1;
    }
    return frames;
}

const LINEAR = buildLinear();
const BINARY = buildBinary();
// t = 0 is the untouched book; t = 1..TICKS replays the frames, then we hold and loop.
const TICKS = LINEAR.length;

// Both lanes replay from the same tick, each clamped to its own last frame — that
// clamp is what leaves ⚡ sitting on "found" while 🐢 keeps crawling.
const indexAt = (frames, t) => (t < 1 ? -1 : Math.min(t - 1, frames.length - 1));

// "spent" = a name this lane actually paid to read; "gone" = a name discarded in bulk
// without ever being read. Keeping them visually opposite is the whole lesson: the 🐢
// lane fills up with work, the ⚡ lane empties out.
function linearStates(frame) {
    const states = new Array(N).fill("idle");
    if (!frame) return states;
    for (let i = 0; i < frame.probe; i++) states[i] = "spent";
    states[frame.probe] = frame.done ? "found" : "probe";
    return states;
}

function binaryStates(frame) {
    const states = new Array(N).fill("idle");
    if (!frame) return states;
    for (let i = 0; i < N; i++) {
        if (i < frame.lo || i > frame.hi) states[i] = "gone";
    }
    states[frame.probe] = frame.done ? "found" : "probe";
    return states;
}

// prefers-reduced-motion read as an external store — the server snapshot is `false` so
// the first client render matches SSR, then it corrects itself without a state write.
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange) => {
    const mq = window.matchMedia(MOTION_QUERY);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
};
const motionSnapshot = () => window.matchMedia(MOTION_QUERY).matches;
const motionServerSnapshot = () => false;

// Every state carries a 1px border: .surface/.surface-muted bring their own, so the
// gradient states need a transparent one or the border animates up from zero-width
// currentColor and flashes a pale outline on each transition (very visible in dark).
// Scaling stays uniform so the letter inside doesn't stretch.
const BOX_CLASS = {
    idle: "surface border border-token text-subtle",
    spent: cn(barClass("default"), "border border-transparent text-white opacity-80"),
    // Keeps its outline and its letter: the name is still sitting there, unread.
    gone: "surface-muted border border-token text-subtle opacity-30",
    probe: cn(barClass("compare"), "border border-transparent text-amber-950 scale-105 shadow-sm"),
    found: cn(barClass("sorted"), "border border-transparent text-white scale-110 shadow-md"),
};

function Lane({ emoji, title, blurb, states, checks, countClass, read, note }) {
    return (
        <div className="surface-muted rounded-xl p-4">
            <div className="flex items-start gap-3">
                <span className="text-2xl leading-none" aria-hidden="true">
                    {emoji}
                </span>
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-text">{title}</h3>
                    <p className="text-sm text-muted mt-0.5 leading-relaxed">{blurb}</p>
                </div>
                <div className="text-right shrink-0" aria-hidden="true">
                    <div
                        className={cn(
                            "text-2xl font-bold tabular-nums leading-none",
                            countClass
                        )}
                    >
                        <span key={checks} className="inline-block animate-pop">
                            {checks}
                        </span>
                    </div>
                    <div className="text-[11px] uppercase tracking-wide text-subtle mt-1">
                        checks
                    </div>
                </div>
            </div>

            <div className="flex items-stretch gap-[2px] sm:gap-1 mt-3" aria-hidden="true">
                {states.map((state, i) => (
                    <div
                        key={i}
                        title={NAMES[i]}
                        className={cn(
                            "grid place-items-center h-8 sm:h-9 flex-1 rounded-sm font-semibold",
                            "text-[7px] sm:text-[10px] leading-none",
                            "transition-all duration-200 motion-reduce:transition-none",
                            BOX_CLASS[state],
                            i === TARGET &&
                                state === "idle" &&
                                "outline-2 outline-dashed outline-offset-2 outline-[var(--border-strong)]"
                        )}
                    >
                        {letter(i)}
                    </div>
                ))}
            </div>

            {/* Reserves two lines: the text changes every tick, and letting it reflow
                between one and two lines would make the lane height jitter on mobile. */}
            <p className="text-xs mt-2.5 min-h-[2.5rem] sm:min-h-[1.25rem] leading-relaxed text-muted">
                {read}
                {note && <span className="text-subtle"> {note}</span>}
            </p>
        </div>
    );
}

export default function PhoneBookRace() {
    const [t, setT] = useState(0);
    const reduced = useSyncExternalStore(
        subscribeMotion,
        motionSnapshot,
        motionServerSnapshot
    );

    useEffect(() => {
        if (reduced) return; // parked on the finished book below — nothing to schedule
        const atEnd = t >= TICKS;
        const id = setTimeout(
            () => setT(atEnd ? 0 : t + 1),
            atEnd ? HOLD_MS : TICK_MS
        );
        return () => clearTimeout(id);
    }, [t, reduced]);

    // Reduced motion shows the finished race as a still frame rather than looping.
    const tick = reduced ? TICKS : t;
    const li = indexAt(LINEAR, tick);
    const bi = indexAt(BINARY, tick);
    const linear = li < 0 ? null : LINEAR[li];
    const binary = bi < 0 ? null : BINARY[bi];
    const linearDone = Boolean(linear?.done);
    const binaryDone = Boolean(binary?.done);

    return (
        <div className="space-y-3">
            <p className="text-sm text-muted">
                Both are hunting the same name —{" "}
                <span className="font-semibold text-text">🎯 {TARGET_NAME}</span> — in the
                same book, and the book is in{" "}
                <strong className="text-text">alphabetical order</strong> (A → Y below).
            </p>

            <div className="grid gap-3">
                <Lane
                    emoji="🐢"
                    title="Read every name"
                    blurb="Start at the first name and work down the list, one at a time."
                    states={linearStates(linear)}
                    checks={li + 1}
                    countClass="text-violet-600 dark:text-violet-400"
                    read={linear?.read ?? "Ready…"}
                    note={
                        linearDone
                            ? `That's ${LINEAR.length} names read.`
                            : binaryDone
                                ? "Still going… 😅"
                                : ""
                    }
                />
                <Lane
                    emoji="⚡"
                    title="Open the middle, drop half"
                    blurb="Read the middle name, decide which half the target must be in, and throw the other half away."
                    states={binaryStates(binary)}
                    checks={bi + 1}
                    countClass="text-emerald-600 dark:text-emerald-400"
                    read={binary?.read ?? "Ready…"}
                    note={binaryDone ? `Only ${BINARY.length} names read.` : ""}
                />
            </div>

            <p className="text-sm text-muted surface-muted rounded-lg px-3 py-2 leading-relaxed">
                <span className="text-text font-semibold">
                    Why is ⚡ allowed to skip?
                </span>{" "}
                Because the names are sorted. If the middle name is{" "}
                <span className="text-text">Lindqvist</span> and you want{" "}
                <span className="text-text">{TARGET_NAME}</span>, then every name from A to
                L is <em>guaranteed</em> to be wrong — no need to read a single one. 🐢 never
                uses that fact, so it earns nothing from the ordering.
            </p>

            <p className="text-xs text-subtle leading-relaxed">
                <span className="text-text">🎯 dashed box</span> = the name we&apos;re
                hunting · <span className="text-amber-600 dark:text-amber-400">🟨</span>{" "}
                reading it now ·{" "}
                <span className="text-violet-600 dark:text-violet-400">🟪</span> read and
                paid for · <span className="opacity-40">⬜</span> thrown away unread
            </p>

            <p className="text-sm text-muted surface-muted rounded-lg px-3 py-2 leading-relaxed">
                <span className="text-text font-semibold">The gap only widens.</span> With{" "}
                {N} names it&apos;s{" "}
                <span
                    key={`s${linearDone}`}
                    className={cn("font-bold tabular-nums", linearDone && "animate-pop inline-block")}
                >
                    {LINEAR.length}
                </span>{" "}
                checks against{" "}
                <span
                    key={`f${linearDone}`}
                    className={cn("font-bold tabular-nums", linearDone && "animate-pop inline-block")}
                >
                    {BINARY.length}
                </span>
                . With 1,000,000 names it&apos;s{" "}
                <strong className="text-text tabular-nums">1,000,000</strong> against{" "}
                <strong className="text-text tabular-nums">~20</strong>.
            </p>

            <p className="sr-only">
                A race through an alphabetical {N}-name phone book, from {NAMES[0]} to{" "}
                {NAMES[N - 1]}, both searches looking for {TARGET_NAME}. Reading every name
                in turn finds it in {LINEAR.length} checks. Repeatedly reading the middle
                name and discarding the half that cannot contain {TARGET_NAME} finds it in{" "}
                {BINARY.length} checks. At 1,000,000 names the same two strategies take
                1,000,000 checks and about 20 checks.
            </p>
        </div>
    );
}

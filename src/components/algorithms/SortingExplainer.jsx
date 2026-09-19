import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";

const FAQS = [
    {
        question: "Which is fastest: bubble sort, selection sort or insertion sort?",
        answer: "On small or nearly sorted lists, insertion sort usually wins, because it stops comparing as soon as a value is in place. Selection sort always does the same amount of comparing, and bubble sort does the most swapping. On large, shuffled lists all three slow down in the same way, which is why faster sorts such as merge sort exist.",
    },
    {
        question: "Why learn these sorts if faster ones exist?",
        answer: "They are the easiest place to learn how to trace a loop, count steps and compare two algorithms that solve the same problem. They also show up in real code: the sort built into Python and Java switches to insertion sort for small chunks of data because it is so quick on short lists.",
    },
    {
        question: "What does it mean for a sort to be stable?",
        answer: "A stable sort keeps equal values in the order they started in. If two students both scored 80, a stable sort leaves them in their original order. Bubble sort and insertion sort are stable. Selection sort is not, because its long-distance swap can jump one equal value over another.",
    },
    {
        question: "What do i, j, min and key mean in the visualizer?",
        answer: "They are the variables the loops use. i marks the current pass, or the edge of the sorted part. j is the position being looked at right now. min is where the smallest value found so far lives during a selection sort pass. key is the value insertion sort has picked up and is about to place.",
    },
    {
        question: "How many comparisons does each sort make?",
        answer: "For a list of n values, selection sort always makes n × (n − 1) ÷ 2 comparisons, even if the list is already sorted. Bubble sort makes up to the same number, but only n − 1 on a sorted list, because a pass with no swaps lets it stop early. Insertion sort also needs only n − 1 on a sorted list and the full amount on a reversed one. Watch the Comparisons counter to check this yourself.",
    },
    {
        question: "Is bubble sort used in real programs?",
        answer: "Rarely. It is mainly a teaching tool, because it is the simplest sort to picture. Its one practical trick is cheap detection: a single pass with no swaps proves that a list is already sorted.",
    },
];

function Costs({ best, average, worst, stable }) {
    const cells = [
        ["Best", best],
        ["Average", average],
        ["Worst", worst],
        ["Extra memory", "O(1)"],
        ["Stable", stable],
    ];
    return (
        <dl className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {cells.map(([label, value]) => (
                <div key={label} className="surface-muted rounded-lg px-3 py-2">
                    <dt className="text-[11px] uppercase tracking-wide text-subtle">{label}</dt>
                    <dd className="font-mono text-sm text-text">{value}</dd>
                </div>
            ))}
        </dl>
    );
}

export default function SortingExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How bubble sort works">
                <p>
                    Picture people lined up for a photo, shortest to tallest, where you may
                    only compare two neighbours at a time. If the one on the left is taller,
                    they swap places. Walk along the whole line doing that and the tallest
                    person ends up at the far right. Big values &ldquo;bubble&rdquo; to the
                    end, which is where the name comes from.
                </p>
                <p>
                    One walk along the line is called a <strong className="text-text">pass</strong>.
                    After the first pass the largest value is settled, after the second pass
                    the two largest are, and so on, so each pass can stop one position
                    earlier. If a whole pass happens with no swaps, the list is already in
                    order and bubble sort stops early. Press play on a sorted list and
                    count: 9 comparisons for 10 values, then done.
                </p>
                <p>
                    On a shuffled list almost every pair gets compared, so doubling the list
                    roughly quadruples the steps. That growth is what{" "}
                    <InlineCode>O(n²)</InlineCode> means.
                </p>
                <Costs best="O(n)" average="O(n²)" worst="O(n²)" stable="Yes" />
            </ExplainerSection>

            <ExplainerSection title="How selection sort works">
                <p>
                    Imagine sorting a pile of coins by value. You look over every coin that
                    is left, find the smallest, and put it at the front. Then you do the same
                    with the rest. That is selection sort: each pass{" "}
                    <strong className="text-text">selects</strong> the smallest remaining
                    value and drops it into the next free slot.
                </p>
                <p>
                    In the visualizer, <InlineCode>min</InlineCode> remembers where the
                    smallest value seen so far is, and <InlineCode>j</InlineCode> scans the
                    unsorted part looking for something smaller. At the end of the pass one
                    swap puts that value in place, and the sorted region on the left grows by
                    one.
                </p>
                <p>
                    Selection sort cannot tell that a list is already sorted, so it always
                    does the same amount of comparing. What it saves is writing: at most one
                    swap per pass, fewer than either other sort. That matters when moving
                    data is expensive.
                </p>
                <Costs best="O(n²)" average="O(n²)" worst="O(n²)" stable="No" />
            </ExplainerSection>

            <ExplainerSection title="How insertion sort works">
                <p>
                    This is how most people sort a hand of playing cards. You pick up the
                    next card, slide it left past every card that is bigger, and drop it into
                    the gap. The cards on the left are always in order. That is the rule the
                    whole algorithm protects.
                </p>
                <p>
                    The value being placed is the <InlineCode>key</InlineCode>. Each bigger
                    value in the sorted part shifts one slot to the right, and then the key
                    lands in the space that opens up. Notice that these are single writes, not
                    swaps, which is why the Swaps counter stays at 0.
                </p>
                <p>
                    If the list is already nearly sorted, each key moves only a step or two,
                    so insertion sort finishes in close to <InlineCode>n</InlineCode> steps.
                    That is why real libraries use it for short or almost-sorted stretches of
                    data.
                </p>
                <Costs best="O(n)" average="O(n²)" worst="O(n²)" stable="Yes" />
            </ExplainerSection>

            <ExplainerSection title="Which sort should you learn first?">
                <p>
                    Start with <strong className="text-text">bubble sort</strong> to get used
                    to reading two nested loops. Move to{" "}
                    <strong className="text-text">selection sort</strong> to see a loop that
                    remembers something (<InlineCode>min</InlineCode>) between steps. Finish
                    with <strong className="text-text">insertion sort</strong>, the one you
                    are most likely to meet in real code.
                </p>
                <p>
                    A good experiment: load the{" "}
                    <strong className="text-text">Nearly sorted</strong> preset and run all
                    three. Same list, same goal, very different step counts. Then see how
                    those counts grow in the{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <Faq items={FAQS} />
        </Explainer>
    );
}

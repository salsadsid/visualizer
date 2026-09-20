import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Costs, Trace } from "./parts";

const TRACE = [
    ["Start", "5 2 4 1 3", "A single value, the 5, counts as a sorted part of length one."],
    ["Place the 2", "2 5 4 1 3", "1 comparison. The 5 is bigger, so it shifts right and the 2 drops in at the front."],
    ["Place the 4", "2 4 5 1 3", "2 comparisons. The 5 shifts right. The 2 is smaller than 4, so the scan stops there."],
    ["Place the 1", "1 2 4 5 3", "3 comparisons. The 5, 4 and 2 all shift right and the 1 lands at the front."],
    ["Place the 3", "1 2 3 4 5", "3 comparisons. The 5 and 4 shift right, the 2 stops the scan, and the 3 fills the gap."],
];

const FAQS = [
    {
        question: "Why is insertion sort fast on nearly sorted data?",
        answer: "Each value only slides left past the values that are bigger than it. If the list is almost in order, most values are already in place or one step away, so the inner loop stops almost immediately and the whole sort takes close to n steps.",
    },
    {
        question: "Why does the Swaps counter stay at 0?",
        answer: "Insertion sort does not swap. It lifts one value out (the key), shifts the bigger values one slot to the right with single writes, and then writes the key into the gap. The Writes counter is the one to watch.",
    },
    {
        question: "Is insertion sort used in real software?",
        answer: "Yes. Timsort, the sort built into Python and used by Java for objects, switches to insertion sort for short runs of data, because on small lists its simplicity beats cleverer algorithms.",
    },
    {
        question: "Is insertion sort stable?",
        answer: "Yes. The scan stops as soon as it meets a value that is not bigger than the key, so the key is placed after any equal values and their original order is kept.",
    },
    {
        question: "What is the key in insertion sort?",
        answer: "It is the value currently being placed. It is copied into a variable first because the shifting that follows overwrites the slot it came from.",
    },
];

export default function InsertionSortExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How insertion sort works">
                <p>
                    This is how most people sort a hand of playing cards. You pick up the
                    next card, slide it left past every card that is bigger, and drop it into
                    the gap. The cards on the left are always in order. That is the rule the
                    whole algorithm protects.
                </p>
                <p>
                    The list is split into a sorted part on the left and an untouched part on
                    the right. One value at a time crosses from right to left, and it is{" "}
                    <strong className="text-text">inserted</strong> exactly where it belongs,
                    so the sorted part stays sorted as it grows.
                </p>
                <p>
                    It needs nothing special from the data. But unlike bubble and selection
                    sort, it is strongly affected by the starting order, in a good way: the
                    closer the list is to sorted, the less work there is to do.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: sorting 5, 2, 4, 1, 3">
                <p>
                    Type <InlineCode>5, 2, 4, 1, 3</InlineCode> into the custom array box above
                    and step through it. Each row below is one value being placed:
                </p>
                <Trace caption="Insertion sort on the list 5, 2, 4, 1, 3, value by value" rows={TRACE} />
                <p>
                    That adds up to <strong className="text-text">9 comparisons, 11 writes
                    and 0 swaps</strong>. While a value is sliding you will briefly see a
                    duplicate in the bars, such as <InlineCode>5 5 4 1 3</InlineCode>. That is
                    the shift in progress: the key is safe in its variable and is about to
                    overwrite one of the copies.
                </p>
            </ExplainerSection>

            <ExplainerSection title="What i, j and key mean">
                <p>
                    <InlineCode>i</InlineCode> is the position of the value being placed. It
                    starts at 1, because a single value on its own is already sorted.
                </p>
                <p>
                    <InlineCode>key</InlineCode> is a copy of that value, taken before anything
                    moves.
                </p>
                <p>
                    <InlineCode>j</InlineCode> walks left through the sorted part, starting at{" "}
                    <InlineCode>i − 1</InlineCode>. While <InlineCode>a[j]</InlineCode> is
                    bigger than the key, that value is copied one slot to the right and{" "}
                    <InlineCode>j</InlineCode> steps left. When the loop stops, the gap is at{" "}
                    <InlineCode>j + 1</InlineCode>, and that is where the key goes. If the key
                    is the smallest value so far, <InlineCode>j</InlineCode> runs off the front
                    and reaches −1. That is expected, and it is why the loop checks{" "}
                    <InlineCode>j &gt;= 0</InlineCode> first.
                </p>
            </ExplainerSection>

            <ExplainerSection title="How many steps does insertion sort take?">
                <p>
                    It depends on the list, which is what makes this sort worth studying. On a
                    sorted list of 5 values each key is compared once and stays put: 4
                    comparisons. On a reversed list every key slides all the way to the front:
                    1 + 2 + 3 + 4 = 10 comparisons. The shuffled example above landed in
                    between, at 9.
                </p>
                <p>
                    In general the best case is <InlineCode>n − 1</InlineCode> comparisons,
                    which grows in step with the list and is written{" "}
                    <InlineCode>O(n)</InlineCode>. The worst case is{" "}
                    <InlineCode>n × (n − 1) ÷ 2</InlineCode>, which grows with{" "}
                    <InlineCode>n × n</InlineCode> and is written <InlineCode>O(n²)</InlineCode>.
                    A random list lands about halfway, which is still{" "}
                    <InlineCode>O(n²)</InlineCode>. Try the{" "}
                    <strong className="text-text">Nearly sorted</strong> and{" "}
                    <strong className="text-text">Reversed</strong> presets at the same size
                    and compare the counters.
                </p>
                <Costs algo="insertion" />
                <p>
                    See the gap between those two growth rates for yourself in the{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <ExplainerSection title="When insertion sort is the right choice">
                <p>
                    For short lists, for lists that are already nearly in order, and for data
                    that arrives one item at a time, since each new item can be inserted into
                    the sorted part without starting again. It is stable and needs no extra
                    memory.
                </p>
                <p>
                    That combination is why real libraries use it as a building block: they
                    split big inputs with a faster algorithm and hand the small pieces to
                    insertion sort. Of the three simple sorts, this is the one you are most
                    likely to meet in production code.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Not saving the key.</strong> The first
                        shift overwrites <InlineCode>a[i]</InlineCode>. Without a copy, the
                        value being placed is lost.
                    </li>
                    <li>
                        <strong className="text-text">Checking the value before the bounds.</strong>{" "}
                        Write <InlineCode>j &gt;= 0 and a[j] &gt; key</InlineCode> in that order.
                        The other way round reads <InlineCode>a[−1]</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">Putting the key at j instead of j + 1.</strong>{" "}
                        When the loop stops, <InlineCode>j</InlineCode> points at the value
                        that was <em>not</em> bigger. The gap is one to its right.
                    </li>
                    <li>
                        <strong className="text-text">Using &gt;= in the comparison.</strong>{" "}
                        It shifts equal values for no reason and makes the sort unstable.
                    </li>
                </ul>
            </ExplainerSection>

            <Faq title="Insertion sort questions" items={FAQS} />
        </Explainer>
    );
}

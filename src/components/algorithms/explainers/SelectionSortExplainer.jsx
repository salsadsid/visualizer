import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Costs, Trace } from "./parts";

const TRACE = [
    ["Start", "5 2 4 1 3", "Nothing is sorted yet."],
    ["After pass 1", "1 2 4 5 3", "4 comparisons. The smallest value is 1, so it swaps places with the 5 at the front."],
    ["After pass 2", "1 2 4 5 3", "3 comparisons. The smallest value left is 2 and it is already in position, so nothing moves."],
    ["After pass 3", "1 2 3 5 4", "2 comparisons. The 3 swaps with the 4."],
    ["After pass 4", "1 2 3 4 5", "1 comparison. The 4 swaps with the 5, and the one value left over must be the largest."],
];

const FAQS = [
    {
        question: "Why is selection sort always O(n²), even on a sorted list?",
        answer: "Because it cannot know a value is the smallest without looking at every value that is left. It makes the same n × (n − 1) ÷ 2 comparisons whether the list is shuffled, reversed or already in order. Try the Sorted preset: the Comparisons counter ends on the same number as it does for a random list.",
    },
    {
        question: "Why is selection sort not stable?",
        answer: "Its swap moves a value a long way in one jump, and that jump can carry it past an equal value. Sort 4a, 4b, 1 and the first pass swaps 1 with 4a, leaving 1, 4b, 4a. The two 4s have traded places.",
    },
    {
        question: "How many swaps does selection sort make?",
        answer: "At most n − 1, one per pass, and fewer when a value is already where it belongs. That is the fewest of the three simple sorts. Bubble sort can need one swap for every out-of-order pair.",
    },
    {
        question: "Selection sort or insertion sort: which is better?",
        answer: "Insertion sort, most of the time. It finishes early on lists that are nearly sorted, and it is stable. Selection sort wins only when writing a value is far more expensive than comparing two values.",
    },
    {
        question: "Does selection sort need extra memory?",
        answer: "No. It sorts inside the list it was given and needs only a few variables (i, j and min), so its extra memory is O(1) however long the list is.",
    },
];

export default function SelectionSortExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How selection sort works">
                <p>
                    Imagine sorting a pile of coins by value. You look over every coin that
                    is left, find the smallest, and put it at the front. Then you do the same
                    with the rest. That is selection sort: each pass{" "}
                    <strong className="text-text">selects</strong> the smallest remaining
                    value and drops it into the next free slot.
                </p>
                <p>
                    The list is always split in two. On the left is the sorted part, which
                    starts empty and grows by one value per pass. On the right is everything
                    still waiting. Nothing in the sorted part ever moves again, because every
                    value in it is smaller than everything to its right.
                </p>
                <p>
                    Like bubble sort, all it needs is a way to compare two values. The
                    starting order makes no difference to how much work it does, and that
                    turns out to be both its weakness and its most interesting feature.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: sorting 5, 2, 4, 1, 3">
                <p>
                    Type <InlineCode>5, 2, 4, 1, 3</InlineCode> into the custom array box above
                    and step through it. At the end of each pass the list looks like this:
                </p>
                <Trace caption="Selection sort on the list 5, 2, 4, 1, 3, pass by pass" rows={TRACE} />
                <p>
                    That is <strong className="text-text">10 comparisons but only 3 swaps</strong>.
                    Bubble sort needs 7 swaps for the same list. Watch the Swaps counter to
                    see the difference.
                </p>
            </ExplainerSection>

            <ExplainerSection title="What i, j and min mean">
                <p>
                    <InlineCode>i</InlineCode> is the slot being filled. Everything to the left
                    of <InlineCode>i</InlineCode> is already sorted.
                </p>
                <p>
                    <InlineCode>j</InlineCode> is the scanner. It starts at{" "}
                    <InlineCode>i + 1</InlineCode> and walks to the end of the list, looking at
                    one value per step.
                </p>
                <p>
                    <InlineCode>min</InlineCode> is the important one. It holds the{" "}
                    <strong className="text-text">position</strong> of the smallest value seen
                    so far in this pass, not the value itself. It starts out equal to{" "}
                    <InlineCode>i</InlineCode> and changes whenever <InlineCode>a[j]</InlineCode>{" "}
                    is smaller than <InlineCode>a[min]</InlineCode>. This is the first loop many
                    beginners meet that has to <em>remember</em> something from one step to the
                    next.
                </p>
            </ExplainerSection>

            <ExplainerSection title="How many steps does selection sort take?">
                <p>
                    The first pass compares the candidate with all <InlineCode>n − 1</InlineCode>{" "}
                    other values, the second pass with <InlineCode>n − 2</InlineCode>, and so
                    on down to 1. For 5 values that is 4 + 3 + 2 + 1 = 10. For 10 values it is
                    45, and for 20 it is 190.
                </p>
                <p>
                    The total is always exactly <InlineCode>n × (n − 1) ÷ 2</InlineCode>. It
                    grows with <InlineCode>n × n</InlineCode>, which is written{" "}
                    <InlineCode>O(n²)</InlineCode>, and there is no lucky case: selection sort
                    has no way to notice that the list is already in order, so best, average
                    and worst are all the same.
                </p>
                <Costs algo="selection" />
                <p>
                    New to this notation?{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Start with the Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <ExplainerSection title="When selection sort is the right choice">
                <p>
                    When moving data costs far more than looking at it. Writing to some kinds
                    of memory is slow or wears the hardware out, and selection sort never
                    makes more than <InlineCode>n − 1</InlineCode> swaps. It is also a good
                    fit for very small lists and for situations where you want the running
                    time to be the same every time.
                </p>
                <p>
                    It also teaches an idea you will reuse everywhere: finding the smallest
                    (or largest) value by scanning with a running best. That single loop is
                    the heart of selection sort.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Storing the value instead of its position.</strong>{" "}
                        If <InlineCode>min</InlineCode> holds the smallest value, you know what
                        to move but not where it is. Keep the index.
                    </li>
                    <li>
                        <strong className="text-text">Swapping inside the inner loop.</strong>{" "}
                        Swapping every time a smaller value turns up still sorts the list, but
                        it throws away the whole point of the algorithm. Swap once, after the
                        scan.
                    </li>
                    <li>
                        <strong className="text-text">Starting the scan in the wrong place.</strong>{" "}
                        <InlineCode>j</InlineCode> begins at <InlineCode>i + 1</InlineCode>.
                        Starting at 0 drags sorted values back into play.
                    </li>
                    <li>
                        <strong className="text-text">Expecting it to be stable.</strong> If
                        the order of equal values matters, use insertion sort instead.
                    </li>
                </ul>
            </ExplainerSection>

            <Faq title="Selection sort questions" items={FAQS} />
        </Explainer>
    );
}

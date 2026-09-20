import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Costs, Trace } from "./parts";

const TRACE = [
    ["Start", "5 2 4 1 3", "Nothing is sorted yet."],
    ["After pass 1", "2 4 1 3 5", "4 comparisons, 4 swaps. The 5 was bigger than every neighbour, so it travelled all the way to the end."],
    ["After pass 2", "2 1 3 4 5", "3 comparisons, 2 swaps. The 4 is now settled next to the 5."],
    ["After pass 3", "1 2 3 4 5", "2 comparisons, 1 swap. The list happens to be sorted already, but bubble sort does not know that yet."],
    ["After pass 4", "1 2 3 4 5", "1 comparison, no swaps. A pass with no swaps is the proof it was waiting for, so it stops."],
];

const FAQS = [
    {
        question: "Why is it called bubble sort?",
        answer: "Because of how the big values move. In every pass the largest unsorted value is swapped again and again until it reaches the end of the list, a bit like an air bubble rising to the surface of a glass of water.",
    },
    {
        question: "How many passes does bubble sort need?",
        answer: "At most n − 1 passes for a list of n values, because each pass settles at least one value. With the early exit it can need far fewer: a list that is already sorted takes a single pass, and the 5-value example on this page takes four.",
    },
    {
        question: "Is bubble sort used in real programs?",
        answer: "Rarely. It is mainly a teaching tool, because it is the easiest sort to picture. Its one practical trick is cheap detection: a single pass with no swaps proves that a list is already in order.",
    },
    {
        question: "Is bubble sort stable?",
        answer: "Yes. It only swaps two neighbours when the left one is strictly bigger, so two equal values never jump over each other and they finish in the order they started in.",
    },
    {
        question: "What is the difference between bubble sort and selection sort?",
        answer: "Bubble sort fixes the list through many small swaps between neighbours. Selection sort looks through the whole unsorted part first and then makes one long-distance swap per pass. Selection sort therefore swaps much less, but it can never stop early, while bubble sort can.",
    },
];

export default function BubbleSortExplainer() {
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
                    One walk along the line is called a{" "}
                    <strong className="text-text">pass</strong>. After the first pass the
                    largest value is settled, after the second pass the two largest are, and
                    so on. That is why each pass can stop one position earlier than the last
                    one: the green bars on the right never need to be looked at again.
                </p>
                <p>
                    The only thing bubble sort needs from your data is that any two values
                    can be compared. It works on numbers, names or dates, in any starting
                    order.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: sorting 5, 2, 4, 1, 3">
                <p>
                    Type <InlineCode>5, 2, 4, 1, 3</InlineCode> into the custom array box above
                    and step through it with the arrow keys. This is what you will see at the
                    end of each pass:
                </p>
                <Trace caption="Bubble sort on the list 5, 2, 4, 1, 3, pass by pass" rows={TRACE} />
                <p>
                    Add the rows up and you get <strong className="text-text">10 comparisons
                    and 7 swaps</strong>, exactly what the counters under the bars show when
                    the run finishes.
                </p>
            </ExplainerSection>

            <ExplainerSection title="What i, j and swapped mean">
                <p>
                    <InlineCode>i</InlineCode> counts the passes, starting from 0. After pass{" "}
                    <InlineCode>i</InlineCode>, the last <InlineCode>i + 1</InlineCode> values
                    are in their final place.
                </p>
                <p>
                    <InlineCode>j</InlineCode> is the left-hand member of the pair being
                    compared right now, so the pair is always <InlineCode>a[j]</InlineCode>{" "}
                    and <InlineCode>a[j+1]</InlineCode>. It runs from 0 up to{" "}
                    <InlineCode>n − 2 − i</InlineCode>, which is how the settled values on
                    the right get skipped.
                </p>
                <p>
                    <InlineCode>swapped</InlineCode> is a yes/no flag that is reset at the start
                    of every pass. If it is still <InlineCode>false</InlineCode> when the pass
                    ends, nothing was out of order and the loop breaks. Leaving this flag out
                    is the difference between a bubble sort that finishes a sorted list in one
                    pass and one that grinds through all of them.
                </p>
            </ExplainerSection>

            <ExplainerSection title="How many steps does bubble sort take?">
                <p>
                    Count the comparisons. With 5 values the passes look at 4, 3, 2 and 1
                    pairs, which is 10. With 10 values it is 9 + 8 + … + 1 = 45. With 20
                    values it is 190. Doubling the list roughly{" "}
                    <strong className="text-text">quadruples</strong> the steps.
                </p>
                <p>
                    In general a list of <InlineCode>n</InlineCode> values needs up to{" "}
                    <InlineCode>n × (n − 1) ÷ 2</InlineCode> comparisons. The part that matters
                    as lists get long is the <InlineCode>n × n</InlineCode>, and that growth
                    is what the notation <InlineCode>O(n²)</InlineCode> is shorthand for. The
                    best case is different: on a sorted list the first pass makes{" "}
                    <InlineCode>n − 1</InlineCode> comparisons, swaps nothing and stops, which
                    is <InlineCode>O(n)</InlineCode>. Load the{" "}
                    <strong className="text-text">Sorted</strong> preset and press play to see
                    it.
                </p>
                <Costs algo="bubble" />
                <p>
                    Want to see how fast <InlineCode>n²</InlineCode> pulls away from{" "}
                    <InlineCode>n</InlineCode>?{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Measure it in the Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <ExplainerSection title="When bubble sort is the right choice">
                <p>
                    Honestly: when you are learning. It is the clearest first example of two
                    nested loops working together, and tracing it by hand is a common exam
                    and interview warm-up. It is also fine for a handful of values, or when
                    you only need to check whether a list is already sorted.
                </p>
                <p>
                    For anything bigger, reach for the sort built into your language. It will
                    be many times faster on a thousand values and the gap only widens from
                    there.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Running off the end.</strong> The inner
                        loop compares <InlineCode>a[j]</InlineCode> with{" "}
                        <InlineCode>a[j+1]</InlineCode>, so <InlineCode>j</InlineCode> must stop
                        at <InlineCode>n − 2</InlineCode>, not <InlineCode>n − 1</InlineCode>.
                    </li>
                    <li>
                        <strong className="text-text">Forgetting the early exit.</strong> The
                        sort still works, but a sorted list now costs as much as a shuffled one.
                    </li>
                    <li>
                        <strong className="text-text">Re-checking the settled values.</strong>{" "}
                        Without the <InlineCode>− i</InlineCode> in the inner loop&apos;s limit,
                        every pass walks the full list and does work that cannot change
                        anything.
                    </li>
                    <li>
                        <strong className="text-text">Swapping on equal values.</strong> Using{" "}
                        <InlineCode>&gt;=</InlineCode> instead of <InlineCode>&gt;</InlineCode>{" "}
                        wastes swaps and makes the sort unstable.
                    </li>
                </ul>
            </ExplainerSection>

            <Faq title="Bubble sort questions" items={FAQS} />
        </Explainer>
    );
}

import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { Costs, Trace } from "./parts";

const TRACE = [
    ["Start", "3 1 3 2 1", "The count array is all zeros. Only the slots for 1, 2 and 3 will ever change."],
    ["Read the 3", "3 1 3 2 1", "count[3] = 1. The bars do not move: counting only writes to the count array."],
    ["Read the 1", "3 1 3 2 1", "count[1] = 1."],
    ["Read the second 3", "3 1 3 2 1", "count[3] = 2."],
    ["Read the 2 and the 1", "3 1 3 2 1", "count[2] = 1 and count[1] = 2. The tally is finished: two 1s, one 2, two 3s."],
    ["Write the 1s", "1 1 3 2 1", "2 writes. The value 1 was counted twice, so it fills indexes 0 and 1."],
    ["Write the 2", "1 1 2 2 1", "1 write. Index 2 gets the 2."],
    ["Write the 3s", "1 1 2 3 3", "2 writes. The two 3s fill the last two slots and the list is sorted."],
];

const FAQS = [
    {
        question: "Why are the comparisons always 0?",
        answer: "Counting sort never asks whether one value is bigger than another. It uses each value as an address in the count array, so the value itself says where its tally lives. The Writes counter is the one to watch: it ends at exactly n.",
    },
    {
        question: "When is counting sort a bad idea?",
        answer: "When the range of values is much bigger than the number of values. The count array needs one slot for every possible value, so sorting just 5 numbers that can be anything up to a billion would need a billion slots and a billion steps to walk through them. Counting sort also does not work on decimals or text without extra tricks. Here the values are 1 to 99, so 100 slots is always cheap.",
    },
    {
        question: "How can it beat O(n log n)?",
        answer: "The n log n limit only applies to sorts that work by comparing pairs of values. Counting sort does not compare, so the limit does not apply. It pays for that with memory and with the restriction that the values must be small whole numbers.",
    },
    {
        question: "What do n and k mean in O(n + k)?",
        answer: "n is the number of values in the list and k is the size of the count array, which is the range of possible values. The counting pass takes n steps and walking the count array takes k steps, so the total is n + k.",
    },
    {
        question: "Is counting sort stable?",
        answer: "This version rewrites plain numbers, so there is nothing to keep in order: two equal 5s look the same. The classic version that sorts records (such as students with the same score) adds a running total to the counts and fills the output from the back, and that version is stable.",
    },
];

export default function CountingSortExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="How counting sort works">
                <p>
                    Imagine sorting a stack of exam papers by score, where every score is a
                    whole number from 1 to 99. Instead of comparing papers, you lay out 99
                    labelled trays. Each paper goes into the tray with its score on it. When
                    all the papers are in, you walk along the trays from 1 to 99 and pick the
                    papers up again. They come out sorted.
                </p>
                <p>
                    That is counting sort, with one change: you do not need the papers, only
                    how many are in each tray. The <InlineCode>count</InlineCode> array has one
                    slot for every possible value, and{" "}
                    <InlineCode>count[v]</InlineCode> holds how many times the value{" "}
                    <InlineCode>v</InlineCode> has been seen.
                </p>
                <p>
                    There are two phases. First, read the list once and add 1 to{" "}
                    <InlineCode>count[v]</InlineCode> for every value. Then walk the count
                    array from the smallest value to the largest and write each{" "}
                    <InlineCode>v</InlineCode> back into the list{" "}
                    <InlineCode>count[v]</InlineCode> times. No two values are ever compared.
                </p>
            </ExplainerSection>

            <ExplainerSection title="A worked example: sorting 3, 1, 3, 2, 1">
                <p>
                    Type <InlineCode>3, 1, 3, 2, 1</InlineCode> into the custom array box above
                    and step through it. During the first phase the bars stay still and the
                    highlighted bar is the value being counted. In the second phase the
                    teal bar is the slot being written and the green bars on its left are done:
                </p>
                <Trace caption="Counting sort on the list 3, 1, 3, 2, 1, step by step" rows={TRACE} />
                <p>
                    That adds up to <strong className="text-text">0 comparisons, 5 writes
                    and 0 swaps</strong>. The writes cover every slot exactly once, so the
                    Writes counter always finishes at the length of the list.
                </p>
            </ExplainerSection>

            <ExplainerSection title="What i, v and count[v] mean">
                <p>
                    <InlineCode>v</InlineCode> is the value being handled. In the first phase
                    it is the value just read from the list. In the second phase it is the
                    value being written back.
                </p>
                <p>
                    <InlineCode>count[v]</InlineCode> is the tally for that value. It climbs
                    as you count, and it drops back towards 0 as you write the copies out.
                </p>
                <p>
                    <InlineCode>i</InlineCode> is the position in the list: the value being
                    read while counting, and the next slot to fill while writing. The count
                    array is not drawn as bars. The chips under the chart show the one slot
                    that matters at each step.
                </p>
            </ExplainerSection>

            <ExplainerSection title="How many steps does counting sort take?">
                <p>
                    The same number whatever the order of the list. Counting reads each of the{" "}
                    <InlineCode>n</InlineCode> values once, and writing back puts each of them
                    in place once. Walking the count array adds{" "}
                    <InlineCode>k</InlineCode> more steps, where{" "}
                    <InlineCode>k</InlineCode> is the number of possible values (100 here).
                    That is <InlineCode>O(n + k)</InlineCode>. Try the{" "}
                    <strong className="text-text">Reversed</strong> and{" "}
                    <strong className="text-text">Nearly sorted</strong> presets: the counters
                    do not change.
                </p>
                <Costs algo="counting" />
                <p>
                    Compare that with the O(n²) sorts in the{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        Big-O Playground →
                    </Link>
                </p>
            </ExplainerSection>

            <ExplainerSection title="When counting sort is a bad idea">
                <p>
                    Counting sort pays for its speed with memory, and the bill depends on the
                    range of values, not on how many values there are. With values from 1 to
                    99 the count array is tiny. But sorting five numbers that could be as big
                    as a billion would need a count array with a billion slots, almost all of
                    them empty, and walking through them would be far slower than any
                    comparison sort.
                </p>
                <p>
                    Use it when the values are whole numbers in a small, known range, such as
                    ages, exam scores, ratings, or letters of the alphabet, and when the list
                    is long compared with that range. For wide ranges, negative numbers,
                    decimals or text, reach for a comparison sort instead.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Making the count array too small.</strong>{" "}
                        To store values up to 99 you need 100 slots, because the slots are
                        numbered from 0. Index 99 does not exist in an array of 99.
                    </li>
                    <li>
                        <strong className="text-text">Forgetting to start from zeros.</strong>{" "}
                        Every slot must start at 0, or the tallies are wrong from the first
                        value.
                    </li>
                    <li>
                        <strong className="text-text">Not keeping the write position.</strong>{" "}
                        The index <InlineCode>i</InlineCode> keeps counting up across all
                        values. Setting it back to 0 for each value overwrites earlier
                        work.
                    </li>
                    <li>
                        <strong className="text-text">Using it on values outside the range.</strong>{" "}
                        A value of 250, or −3, has no slot in the count array.
                    </li>
                </ul>
            </ExplainerSection>

            <Faq title="Counting sort questions" items={FAQS} />
        </Explainer>
    );
}

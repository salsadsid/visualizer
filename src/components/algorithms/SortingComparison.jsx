import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { SORTER_LIST } from "@/lib/algorithms/sorting";
import { sortPageFor } from "@/lib/catalog";

const COLUMNS = [
    ["Best", "best"],
    ["Average", "average"],
    ["Worst", "worst"],
    ["Extra memory", "space"],
    ["Stable", "stable"],
];

const FAQS = [
    {
        question: "Which is fastest: bubble sort, selection sort or insertion sort?",
        answer: "On small or nearly sorted lists, insertion sort usually wins, because it stops comparing as soon as a value is in place. Selection sort always does the same amount of comparing, and bubble sort does the most swapping. On large, shuffled lists all three slow down in the same way, which is why faster sorts such as merge sort exist.",
    },
    {
        question: "Why learn these sorts if faster ones exist?",
        answer: "They are the easiest place to learn how to trace a loop, count steps and compare two algorithms that solve the same problem. They also show up in real code: the sort built into Python switches to insertion sort for small chunks of data because it is so quick on short lists.",
    },
    {
        question: "What does it mean for a sort to be stable?",
        answer: "A stable sort keeps equal values in the order they started in. If two students both scored 80, a stable sort leaves them in their original order. Bubble sort and insertion sort are stable. Selection sort is not, because its long-distance swap can jump one equal value over another.",
    },
    {
        question: "How many comparisons does each sort make?",
        answer: "For a list of n values, selection sort always makes n × (n − 1) ÷ 2 comparisons, even if the list is already sorted. Bubble sort makes up to the same number, but only n − 1 on a sorted list, because a pass with no swaps lets it stop early. Insertion sort also needs only n − 1 on a sorted list and the full amount on a reversed one.",
    },
];

export default function SortingComparison() {
    return (
        <Explainer>
            <ExplainerSection title="Bubble vs selection vs insertion sort">
                <p>
                    All three do the same job, putting a list in order, and all three do it
                    inside the list they were given. What differs is <em>how</em> they move
                    values around, and that changes how much work each one does on the same
                    input.
                </p>
                <div className="surface-muted rounded-lg overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <caption className="sr-only">
                            Time and memory cost of bubble, selection and insertion sort
                        </caption>
                        <thead>
                            <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                                <th scope="col" className="text-left px-3 py-2 font-medium">
                                    Algorithm
                                </th>
                                {COLUMNS.map(([label]) => (
                                    <th
                                        key={label}
                                        scope="col"
                                        className="text-left px-3 py-2 font-medium whitespace-nowrap"
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SORTER_LIST.map((sorter, index) => (
                                <tr
                                    key={sorter.key}
                                    className={
                                        index !== SORTER_LIST.length - 1
                                            ? "border-b border-token"
                                            : undefined
                                    }
                                >
                                    <th scope="row" className="text-left px-3 py-2 font-medium whitespace-nowrap">
                                        <Link
                                            href={sortPageFor(sorter.key).path}
                                            className="text-accent hover:text-accent-hover"
                                        >
                                            {sorter.label}
                                        </Link>
                                    </th>
                                    {COLUMNS.map(([label, field]) => (
                                        <td key={label} className="px-3 py-2 font-mono text-xs text-text">
                                            {sorter.complexity[field]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>
                    <InlineCode>n</InlineCode> is the number of values in the list. Read{" "}
                    <InlineCode>O(n)</InlineCode> as &ldquo;the steps grow in line with the
                    list&rdquo; and <InlineCode>O(n²)</InlineCode> as &ldquo;double the list,
                    quadruple the steps&rdquo;. If that notation is new,{" "}
                    <Link
                        href="/algorithms/complexity"
                        className="text-accent hover:text-accent-hover font-medium"
                    >
                        the Big-O Playground explains it from zero →
                    </Link>
                </p>
            </ExplainerSection>

            <ExplainerSection title="How they differ, in one line each">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Bubble sort</strong> swaps neighbours
                        that are the wrong way round, over and over. Lots of swaps, but it
                        notices when the list is already sorted and stops.
                    </li>
                    <li>
                        <strong className="text-text">Selection sort</strong> searches for the
                        smallest value left and swaps it into place. Very few swaps, but it
                        always does the full amount of comparing.
                    </li>
                    <li>
                        <strong className="text-text">Insertion sort</strong> slides each value
                        left into a sorted part that grows from the front. No swaps at all,
                        and almost no work when the list is nearly sorted.
                    </li>
                </ul>
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
                    A good experiment: open each sort, load the{" "}
                    <strong className="text-text">Nearly sorted</strong> preset and compare
                    the counters. Your list travels with you when you switch between the
                    three, so it is the same input and the same goal, with very different
                    step counts.
                </p>
            </ExplainerSection>

            <Faq title="Comparing the three sorts" items={FAQS} />
        </Explainer>
    );
}

import Link from "next/link";
import { Explainer, ExplainerSection, Faq, InlineCode } from "@/components/learn/Explainer";
import { OPERATION_LIST } from "@/lib/array/oneD";

const FAQS = [
    {
        question: "Is array access really O(1)?",
        answer: "Yes. The slots sit side by side and have the same size, so the computer computes the address of slot i as base + i × size and reads it directly. It does not matter whether the array has ten values or ten million; there is no walking involved. That is the property every other operation on this page is built on.",
    },
    {
        question: "Why is inserting at the front of an array slow?",
        answer: "Because there is no empty slot at the front. To make one, every value has to move one place to the right, which is n copies for n values. Inserting at the end is cheap only because the empty slot is already there. The same applies to deleting: removing the first value means shifting everything left.",
    },
    {
        question: "What is the difference between an array and a Python list?",
        answer: "A Python list, a JavaScript array and a C++ vector are dynamic arrays: an ordinary array underneath, plus bookkeeping that allocates a bigger block and copies everything across when the old one fills up. They grow by a constant factor each time, so appending is O(1) on average, but list.insert(0, x) and list.pop(0) still shift every value and cost O(n).",
    },
    {
        question: "Why do array indexes start at 0?",
        answer: "Because the index is an offset: how many slots past the start. The first slot is 0 slots past the start, so its address is base + 0 × size. Starting at 1 would need a subtraction on every access. Most languages follow C here; Lua, MATLAB and Fortran are the well-known exceptions.",
    },
    {
        question: "When should I use a linked list instead of an array?",
        answer: "When you insert and delete at the front or in the middle far more often than you read by index, and you do not need the values to sit together in memory. In practice arrays win more often than textbooks suggest, because contiguous memory is fast to read and most programs read far more than they insert. Try the operations above with 24 values and count the shifts before deciding.",
    },
];

export default function ArrayOperationsExplainer() {
    return (
        <Explainer>
            <ExplainerSection title="What an array is in memory">
                <p>
                    Picture a row of lockers, numbered from 0, all the same size, with no gaps
                    between them. That is an array: one block of memory divided into equal
                    slots. The number on the locker is the index, and because every locker is
                    the same size, the computer can work out where locker 7 is without opening
                    lockers 0 to 6. It multiplies 7 by the slot size and adds it to the address
                    of the first locker.
                </p>
                <p>
                    Two consequences follow, and they explain every cost on this page. Reading
                    or writing any slot is one step, however long the array is. But the slots
                    are fixed in place: you cannot squeeze a new locker in between two others.
                    To make room you have to move the neighbours, and to close a gap you have
                    to move them back.
                </p>
                <p>
                    In the visualizer above, <InlineCode>a[i]</InlineCode> means the value in
                    slot <InlineCode>i</InlineCode>, and the counters show every read and
                    write the computer makes. Watch them: they are the whole story.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Access: one step, always">
                <p>
                    Pick <strong className="text-text">Access</strong> and any index. The
                    computer computes <InlineCode>base + index × size</InlineCode> and reads
                    that slot. One multiplication, one addition, one read. Nothing depends on{" "}
                    <InlineCode>n</InlineCode>, which is what <InlineCode>O(1)</InlineCode>{" "}
                    means: constant time.
                </p>
                <p>
                    This is the reason arrays are everywhere. A list of a million temperatures
                    still gives you the 999,999th one instantly. Data structures that cannot
                    do this, such as linked lists, have to walk from the start.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Insert and delete: shift everything after the spot">
                <p>
                    Take five values, <InlineCode>8, 3, 12, 5, 9</InlineCode>, with one spare
                    slot at the end, and insert <InlineCode>42</InlineCode> at index 2. Slot 2
                    is occupied by 12, so 12 has to move, and so does everything after it. The
                    order matters: move <InlineCode>9</InlineCode> into the spare slot first,
                    then <InlineCode>5</InlineCode> into 9&apos;s old slot, then{" "}
                    <InlineCode>12</InlineCode> into 5&apos;s. Three shifts, working from the end,
                    and only then is 42 written into slot 2. Start from the front instead and
                    the first move overwrites a value you still need.
                </p>
                <p>
                    Delete works the same way in reverse. Remove the value at index 0 from{" "}
                    <InlineCode>8, 3, 12, 5, 9</InlineCode> and four values move one place
                    left, this time starting from the front: 3 into slot 0, 12 into slot 1, and
                    so on. The last slot ends up unused.
                </p>
                <p>
                    Count the work. Inserting at index <InlineCode>i</InlineCode> of{" "}
                    <InlineCode>n</InlineCode> values costs <InlineCode>n − i</InlineCode>{" "}
                    shifts; deleting costs <InlineCode>n − i − 1</InlineCode>. At the end that is
                    zero, which is why appending and popping are cheap. At the front it is the
                    whole array, which is <InlineCode>O(n)</InlineCode>. Set the index slider to
                    0 and to the end and compare the Writes counter.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Linear search: look at everything">
                <p>
                    If the values are in no particular order, there is no way to know where a
                    value is except by looking. Linear search compares the target with{" "}
                    <InlineCode>a[0]</InlineCode>, then <InlineCode>a[1]</InlineCode>, and stops
                    at the first match or at the end. Found at index <InlineCode>k</InlineCode>{" "}
                    costs <InlineCode>k + 1</InlineCode> compares; not found costs{" "}
                    <InlineCode>n</InlineCode>.
                </p>
                <p>
                    Best case one compare, worst case all of them, average about half. That
                    spread is normal for searches, and it is why sorting the data first pays
                    off: on a sorted array a binary search needs only about{" "}
                    <InlineCode>log₂ n</InlineCode> compares. The{" "}
                    <Link href="/algorithms/sorting" className="text-accent hover:text-accent-hover font-medium">
                        sorting visualizers
                    </Link>{" "}
                    show what that ordering costs.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Reverse with two pointers">
                <p>
                    The obvious way to reverse an array is to copy it backwards into a second
                    array. That works but needs <InlineCode>n</InlineCode> extra slots. The
                    two-pointer version needs none: <InlineCode>lo</InlineCode> starts at the
                    first slot, <InlineCode>hi</InlineCode> at the last. Swap the two values,
                    move <InlineCode>lo</InlineCode> right and <InlineCode>hi</InlineCode>{" "}
                    left, and stop when they meet or cross. Every value moves exactly once, so
                    the cost is <InlineCode>⌊n/2⌋</InlineCode> swaps: <InlineCode>O(n)</InlineCode>{" "}
                    time and <InlineCode>O(1)</InlineCode> extra space.
                </p>
                <p>
                    Two pointers walking towards each other is a pattern you will meet again
                    and again: checking whether a word is a palindrome, finding two numbers
                    that add up to a target in a sorted array, and partitioning in quicksort
                    all use it.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Cost of each operation">
                <div className="surface-muted rounded-lg overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <caption className="sr-only">Time and space cost of the five array operations</caption>
                        <thead>
                            <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                                <th scope="col" className="text-left px-3 py-2 font-medium">Operation</th>
                                <th scope="col" className="text-left px-3 py-2 font-medium">Best</th>
                                <th scope="col" className="text-left px-3 py-2 font-medium">Worst</th>
                                <th scope="col" className="text-left px-3 py-2 font-medium whitespace-nowrap">Extra space</th>
                            </tr>
                        </thead>
                        <tbody>
                            {OPERATION_LIST.map((op, index) => (
                                <tr key={op.key} className={index !== OPERATION_LIST.length - 1 ? "border-b border-token" : undefined}>
                                    <th scope="row" className="text-left px-3 py-2 font-medium whitespace-nowrap">{op.label}</th>
                                    <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{op.complexity.best}</td>
                                    <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{op.complexity.worst}</td>
                                    <td className="px-3 py-2 font-mono text-xs">{op.complexity.space}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>
                    <InlineCode>n</InlineCode> is the number of values. New to the notation?{" "}
                    <Link href="/algorithms/complexity" className="text-accent hover:text-accent-hover font-medium">
                        The Big-O Playground starts from zero →
                    </Link>
                </p>
            </ExplainerSection>

            <ExplainerSection title="Dynamic arrays: Python lists, JavaScript arrays, vectors">
                <p>
                    The array in the visualizer has a fixed size, which is how arrays work in
                    C, Java and at the bottom of every language. A Python{" "}
                    <InlineCode>list</InlineCode>, a JavaScript array and a C++{" "}
                    <InlineCode>vector</InlineCode> feel different because they grow on demand,
                    but underneath each one is a plain array plus a trick: when it fills up,
                    the language allocates a bigger block, copies everything across and keeps
                    some spare slots. It grows by a constant factor each time (CPython by about
                    an eighth, V8 by half, libstdc++ by doubling), so the copies are rare and
                    appending costs <InlineCode>O(1)</InlineCode> on average.
                </p>
                <p>
                    The trick does not change the other costs. <InlineCode>list.insert(0, x)</InlineCode>{" "}
                    and <InlineCode>list.pop(0)</InlineCode> still shift every value, exactly as
                    above, and so do <InlineCode>splice</InlineCode> and{" "}
                    <InlineCode>unshift</InlineCode> in JavaScript. If you need cheap work at
                    both ends, use a structure built for it, such as Python&apos;s{" "}
                    <InlineCode>collections.deque</InlineCode>. One more nuance for JavaScript:
                    the language never promises that an array is stored in one block, though
                    engines such as V8 do pack dense arrays of one type that way.
                </p>
            </ExplainerSection>

            <ExplainerSection title="Mistakes beginners make">
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong className="text-text">Off by one.</strong> The last index is{" "}
                        <InlineCode>n − 1</InlineCode>. Reading <InlineCode>a[n]</InlineCode> is
                        an error in Java and Python, and silently garbage in C.
                    </li>
                    <li>
                        <strong className="text-text">Shifting from the wrong end.</strong>{" "}
                        Insert shifts from the back towards the gap; delete shifts from the gap
                        towards the back. Get it backwards and one value overwrites another.
                    </li>
                    <li>
                        <strong className="text-text">Deleting inside a forward loop.</strong>{" "}
                        Removing <InlineCode>a[i]</InlineCode> moves <InlineCode>a[i + 1]</InlineCode>{" "}
                        into slot <InlineCode>i</InlineCode>, and the loop then skips it. Loop
                        backwards, or build a new array of the values you keep.
                    </li>
                    <li>
                        <strong className="text-text">Assuming the built-ins are free.</strong>{" "}
                        <InlineCode>insert(0, x)</InlineCode>, <InlineCode>pop(0)</InlineCode> and{" "}
                        <InlineCode>unshift</InlineCode> hide a loop over the whole array. In a
                        loop of their own they turn <InlineCode>O(n)</InlineCode> into{" "}
                        <InlineCode>O(n²)</InlineCode>.
                    </li>
                </ul>
                <p>
                    Rows and columns next: the{" "}
                    <Link href="/data-structures/arrays" className="text-accent hover:text-accent-hover font-medium">
                        2D Array Visualizer
                    </Link>{" "}
                    shows how a grid is really one long array in disguise.
                </p>
            </ExplainerSection>

            <Faq title="Array questions" items={FAQS} />
        </Explainer>
    );
}

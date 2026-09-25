"use client";
import { memo } from "react";
import Link from "next/link";
import LearningTabs, { CodeTabs } from "@/components/algorithms/LearningTabs";
import { useSortingInput } from "@/components/algorithms/SortingInputProvider";
import { LANGUAGES } from "@/lib/array/snippets";
import { OPERATIONS, OPERATION_LIST } from "@/lib/array/oneD";
import { OPERATION_CODE } from "@/lib/array/oneDCode";

function Concept({ op, onSelect }) {
    const operation = OPERATIONS[op];
    const others = OPERATION_LIST.filter((o) => o.key !== op);
    return (
        <div className="space-y-3 text-sm leading-relaxed text-muted">
            <p>
                <strong className="text-text">{operation.label}</strong> {operation.lead}
            </p>
            <p>
                An array is one block of memory with slots of equal size, side by side. That
                single fact explains every cost on this page: jumping to a slot is one step,
                but making or closing a gap means moving everything after it. Compare with{" "}
                {others.map((o, index) => (
                    <span key={o.key}>
                        {index > 0 && (index === others.length - 1 ? " and " : ", ")}
                        <button
                            type="button"
                            onClick={() => onSelect(o.key)}
                            className="text-accent hover:text-accent-hover font-medium"
                        >
                            {o.label.toLowerCase()}
                        </button>
                    </span>
                ))}
                .
            </p>
            <p>
                Cost: best {operation.complexity.best}, worst {operation.complexity.worst},
                extra space {operation.complexity.space}. New to this notation?{" "}
                <Link href="/algorithms/complexity" className="text-accent hover:text-accent-hover font-medium">
                    Start with the Big-O Playground →
                </Link>
            </p>
        </div>
    );
}

function Uses() {
    const items = [
        { icon: "📋", title: "Lists of anything", body: "Scores, names, pixels, samples: an array is the default way to keep many values of one kind together." },
        { icon: "🔎", title: "Searching and sorting", body: "Every search and sort on this site runs over an array; their costs come from these operations." },
        { icon: "🧱", title: "Building blocks", body: "Stacks, queues, hash tables, heaps and matrices are all arrays underneath." },
        { icon: "💼", title: "Interviews", body: "Reverse in place, remove duplicates, two pointers and sliding windows all start here." },
    ];
    return (
        <div className="grid sm:grid-cols-2 gap-3">
            {items.map((item) => (
                <div key={item.title} className="surface-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
            ))}
        </div>
    );
}

function OneDLearn({ op, onSelect }) {
    const { learnTab, setLearnTab, codeLang, setCodeLang } = useSortingInput();
    const tabs = [
        { id: "concept", label: "Concept", content: <Concept op={op} onSelect={onSelect} /> },
        { id: "uses", label: "Use cases", content: <Uses /> },
        {
            id: "code",
            label: "Code",
            content: (
                <CodeTabs
                    languages={LANGUAGES}
                    groups={OPERATION_CODE[op]}
                    value={codeLang}
                    onChange={setCodeLang}
                />
            ),
        },
    ];
    return (
        <LearningTabs
            heading={`Learn ${OPERATIONS[op].label.toLowerCase()}`}
            tabs={tabs}
            tool="arrays1d"
            value={learnTab}
            onChange={setLearnTab}
        />
    );
}

export default memo(OneDLearn);

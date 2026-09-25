import GridPreview from "@/components/array/GridPreview";
import { GRID_ALGORITHMS } from "@/lib/array/gridAlgorithms";

export function finalState(kind, options = {}) {
    const algorithm = GRID_ALGORITHMS[kind];
    const { steps } = algorithm.run(algorithm.defaultGrid, {
        start: algorithm.defaultStart,
        target: algorithm.defaultTarget,
        ...options,
    });
    return { grid: algorithm.defaultGrid, last: steps.at(-1), steps: steps.length };
}

export function ExamplePreview({ kind, options, label, compact = false }) {
    const { grid, last } = finalState(kind, options);
    return <GridPreview matrix={grid} cells={last.cells} order={last.order} compact={compact} label={label} />;
}

export function WorkedExample({ kind, options, label, children }) {
    return (
        <div className="grid sm:grid-cols-[auto_1fr] gap-4 items-start pt-1">
            <div className="overflow-x-auto custom-scrollbar">
                <ExamplePreview kind={kind} options={options} label={label} />
            </div>
            <div className="space-y-2 min-w-0">{children}</div>
        </div>
    );
}

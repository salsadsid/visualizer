import GridPreview from "@/components/array/GridPreview";
import { MATRIX_OPS, finalResult, resultLabelFor } from "@/lib/array/matrixOps";
import { numberedGrid } from "@/lib/array/traversals";

export const EXAMPLE_A = numberedGrid(3, 4);
export const MULTIPLY_A = numberedGrid(2, 3);
export const MULTIPLY_B = numberedGrid(3, 2);

const describe = (name, m) => `${name}, ${m.length} by ${m[0].length}: ${m.map((row) => row.join(" ")).join("; ")}`;

const writtenCells = (m) =>
    Object.fromEntries(m.flatMap((row, i) => row.map((_, j) => [`${i},${j}`, "written"])));

const Glyph = ({ children }) => (
    <span aria-hidden="true" className="text-lg font-semibold text-subtle">
        {children}
    </span>
);

export function MatrixExample({ kind, a = EXAMPLE_A, b, variant, compact = false }) {
    const op = MATRIX_OPS[kind];
    const result = finalResult(kind, a, { variant, b });
    const resultName = resultLabelFor(op, variant);
    return (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`${op.label} example`}>
            <GridPreview matrix={a} compact={compact} label={describe("A", a)} />
            {b && (
                <>
                    <Glyph>×</Glyph>
                    <GridPreview matrix={b} compact={compact} label={describe("B", b)} />
                </>
            )}
            <Glyph>{kind === "multiply" ? "=" : "→"}</Glyph>
            <GridPreview matrix={result} cells={writtenCells(result)} compact={compact} label={describe(resultName, result)} />
        </div>
    );
}

export function WorkedExample({ kind, a, b, variant, children }) {
    return (
        <div className="grid gap-4 items-start pt-1">
            <div className="overflow-x-auto custom-scrollbar">
                <MatrixExample kind={kind} a={a} b={b} variant={variant} />
            </div>
            <div className="space-y-2 min-w-0">{children}</div>
        </div>
    );
}

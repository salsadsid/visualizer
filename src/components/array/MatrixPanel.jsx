"use client";
import ArrayGrid from "@/components/array/ArrayGrid";

export default function MatrixPanel({ label, matrix, panel, sizeCols }) {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;
    return (
        <figure className="min-w-0 max-w-full">
            <ArrayGrid
                bare
                dense
                matrix={matrix}
                maxLen={cols}
                sizeCols={sizeCols}
                fill={false}
                showIndices
                cells={panel.cells}
                pointers={panel.pointers}
            />
            <figcaption className="mt-1 text-center text-xs text-muted">
                <span className="font-semibold text-text">{label}</span>
                <span className="font-mono"> · {rows} × {cols}</span>
            </figcaption>
        </figure>
    );
}

"use client";
import { memo } from "react";
import Link from "next/link";
import LearningTabs, { CodeTabs } from "@/components/algorithms/LearningTabs";
import { LANGUAGES } from "@/lib/array/snippets";
import { MATRIX_OPS, MATRIX_OP_LIST } from "@/lib/array/matrixOps";
import { MATRIX_CODE } from "@/lib/array/matrixCode";

function Concept({ kind, basePath }) {
    const op = MATRIX_OPS[kind];
    const others = MATRIX_OP_LIST.filter((o) => o.key !== kind);
    return (
        <div className="space-y-3 text-sm leading-relaxed text-muted">
            <p>
                <strong className="text-text">{op.label}</strong> {op.lead}
            </p>
            <p>
                {kind === "multiply"
                    ? "Unlike the other three, multiplication makes new numbers instead of moving old ones around, and every cell of the result costs a whole loop of its own."
                    : "Transpose, rotate and flip never change a value: each one is a rule for where every cell moves, so they all cost one read and one write per cell."}{" "}
                Compare with{" "}
                {others.map((o, index) => (
                    <span key={o.key}>
                        {index > 0 && (index === others.length - 1 ? " and " : ", ")}
                        <Link href={`${basePath}/${o.key}`} className="text-accent hover:text-accent-hover font-medium">
                            {o.label.toLowerCase()}
                        </Link>
                    </span>
                ))}
                .
            </p>
            <p>
                {kind === "multiply" ? "Three nested loops, so it runs in " : "Two nested loops over the source, so it runs in "}
                <Link
                    href="/algorithms/complexity"
                    className="font-mono text-accent hover:text-accent-hover underline decoration-dotted underline-offset-2"
                >
                    {kind === "multiply" ? "O(n · m · p)" : "O(rows · cols)"}
                </Link>{" "}
                time
                {kind === "multiply"
                    ? ", which is O(n³) for square matrices. The result needs its own n × p cells."
                    : " and needs a second matrix of the same size, unless you do it in place."}
            </p>
        </div>
    );
}

const USES = {
    transpose: [
        { icon: "🧮", title: "Linear algebra", body: "Aᵀ shows up in dot products, least squares (AᵀA) and every symmetric-matrix check." },
        { icon: "📊", title: "Rows to columns", body: "Turning a table of records into a table of fields, or a CSV of rows into columns for a chart." },
        { icon: "⚡", title: "Cache-friendly loops", body: "Transposing once lets a column-heavy algorithm read memory in a straight line." },
        { icon: "💼", title: "Interviews", body: "Transpose is the first half of rotating a matrix in place (LeetCode 48) and a warm-up on its own (867)." },
    ],
    rotate: [
        { icon: "🖼️", title: "Images", body: "Rotating a photo a quarter turn is exactly this operation on its pixel grid." },
        { icon: "🎮", title: "Games", body: "Tetris pieces, puzzle tiles and dungeon rooms are rotated by rotating a small matrix." },
        { icon: "🗺️", title: "Maps and boards", body: "Checking a board against its rotations finds symmetric positions and duplicate puzzles." },
        { icon: "💼", title: "Interviews", body: "Rotate Image (LeetCode 48) is a classic: transpose, then reverse each row, all in place." },
    ],
    flip: [
        { icon: "🪞", title: "Mirroring", body: "A horizontal flip is a mirror image; image editors call it Flip Horizontal." },
        { icon: "🧩", title: "Symmetry checks", body: "A pattern is symmetric if flipping it gives the same matrix back." },
        { icon: "🎮", title: "Sprites", body: "Games draw a character facing left by flipping the right-facing sprite." },
        { icon: "💼", title: "Interviews", body: "Flipping an Image (LeetCode 832) flips every row and inverts the bits in one pass." },
    ],
    multiply: [
        { icon: "🕹️", title: "Graphics", body: "Every rotation, scale and projection in 2D and 3D graphics is a matrix multiplication." },
        { icon: "🤖", title: "Machine learning", body: "A neural-network layer is a matrix multiply followed by a simple function." },
        { icon: "🕸️", title: "Graphs", body: "Multiplying an adjacency matrix by itself counts the paths of length two between every pair of nodes." },
        { icon: "💼", title: "Interviews", body: "Sparse Matrix Multiplication (LeetCode 311) and fast Fibonacci with 2 × 2 matrix powers." },
    ],
};

function Uses({ kind }) {
    return (
        <div className="grid sm:grid-cols-2 gap-3">
            {USES[kind].map((item) => (
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

function MatrixLearn({ kind, basePath }) {
    const tabs = [
        { id: "concept", label: "Concept", content: <Concept kind={kind} basePath={basePath} /> },
        { id: "uses", label: "Use cases", content: <Uses kind={kind} /> },
        {
            id: "code",
            label: "Code",
            content: <CodeTabs languages={LANGUAGES} groups={MATRIX_CODE[kind]} />,
        },
    ];
    return (
        <LearningTabs
            heading={`Learn ${MATRIX_OPS[kind].label.toLowerCase()}`}
            tabs={tabs}
            tool="matrix"
        />
    );
}

export default memo(MatrixLearn);

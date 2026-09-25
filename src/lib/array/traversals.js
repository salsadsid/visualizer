import { makeGridRecorder } from "./gridRecorder.js";

const cellText = (matrix, r, c) => `a[${r}][${c}] = ${String(matrix[r][c])}`;

function finish(r, message) {
    r.clearPointers();
    r.push(r.steps.length ? lastLine(r) : 0, message);
}

function lastLine(r) {
    return r.steps[r.steps.length - 1].line;
}

function empty(kind) {
    return { steps: [{ cells: {}, order: {}, frontier: [], pointers: {}, vars: {}, line: 0, message: `Nothing to ${kind}: the grid has no cells.`, stats: { visited: 0, total: 0, frontier: 0 }, output: [] }] };
}

function rowMajor(matrix) {
    const r = makeGridRecorder(matrix, matrix.length * (matrix[0]?.length ?? 0));
    if (r.rows === 0 || r.cols === 0) return empty("traverse");
    r.push(0, "Row-major order reads the grid the way you read a page: left to right, one row at a time, top to bottom.");
    for (let i = 0; i < r.rows; i++) {
        r.pointers.i = i;
        delete r.pointers.j;
        r.push(0, `Row ${i}: walk across its ${r.cols} cells from left to right.`);
        for (let j = 0; j < r.cols; j++) {
            const last = j === r.cols - 1;
            r.visit(i, j, 2, `Visit ${cellText(matrix, i, j)}.${last ? ` End of row ${i}.` : ""}`);
        }
    }
    finish(r, `Every cell visited: ${r.rows} rows × ${r.cols} columns = ${r.rows * r.cols} steps.`);
    return { steps: r.steps };
}

function columnMajor(matrix) {
    const r = makeGridRecorder(matrix, matrix.length * (matrix[0]?.length ?? 0));
    if (r.rows === 0 || r.cols === 0) return empty("traverse");
    r.push(0, "Column-major order swaps the loops: go down one whole column before moving to the next column.");
    for (let j = 0; j < r.cols; j++) {
        r.pointers.j = j;
        delete r.pointers.i;
        r.push(0, `Column ${j}: walk down its ${r.rows} cells from top to bottom.`);
        for (let i = 0; i < r.rows; i++) {
            const last = i === r.rows - 1;
            r.visit(i, j, 2, `Visit ${cellText(matrix, i, j)}.${last ? ` Bottom of column ${j}.` : ""}`);
        }
    }
    finish(r, `Every cell visited: ${r.cols} columns × ${r.rows} rows = ${r.rows * r.cols} steps.`);
    return { steps: r.steps };
}

function snake(matrix) {
    const r = makeGridRecorder(matrix, matrix.length * (matrix[0]?.length ?? 0));
    if (r.rows === 0 || r.cols === 0) return empty("traverse");
    r.push(0, "Snake order goes left to right on even rows and right to left on odd rows, so the path never jumps back to the start of a row.");
    for (let i = 0; i < r.rows; i++) {
        const forward = i % 2 === 0;
        r.pointers.i = i;
        delete r.pointers.j;
        r.vars.direction = forward ? "→" : "←";
        r.push(forward ? 1 : 3, forward ? `Row ${i} is even, so walk it left to right.` : `Row ${i} is odd, so walk it right to left.`);
        for (let n = 0; n < r.cols; n++) {
            const j = forward ? n : r.cols - 1 - n;
            const turn = n === 0 && i > 0;
            r.visit(i, j, forward ? 2 : 4, `Visit ${cellText(matrix, i, j)}.${turn ? " The path turned around, no jump back." : ""}`, turn ? "turn" : "current");
        }
    }
    delete r.vars.direction;
    finish(r, `Every cell visited in ${r.rows * r.cols} steps, with only ${Math.max(0, r.rows - 1)} turns.`);
    return { steps: r.steps };
}

function diagonal(matrix) {
    const r = makeGridRecorder(matrix, matrix.length * (matrix[0]?.length ?? 0));
    if (r.rows === 0 || r.cols === 0) return empty("traverse");
    r.push(0, "Diagonal order groups cells by i + j: first the corner, then the two cells next to it, and so on down to the opposite corner.");
    for (let d = 0; d <= r.rows + r.cols - 2; d++) {
        r.vars.d = d;
        delete r.pointers.i;
        delete r.pointers.j;
        const from = Math.max(0, d - r.cols + 1);
        const to = Math.min(d, r.rows - 1);
        r.push(0, `Diagonal ${d}: every cell where i + j = ${d} (rows ${from} to ${to}).`);
        for (let i = from; i <= to; i++) {
            const j = d - i;
            r.visit(i, j, 3, `Visit ${cellText(matrix, i, j)}: ${i} + ${j} = ${d}.`, i === from ? "turn" : "current");
        }
    }
    delete r.vars.d;
    finish(r, `Every cell visited across ${r.rows + r.cols - 1} diagonals.`);
    return { steps: r.steps };
}

function boundaryCount(rows, cols) {
    if (rows === 0 || cols === 0) return 0;
    if (rows === 1 || cols === 1) return rows * cols;
    return 2 * rows + 2 * cols - 4;
}

function boundary(matrix) {
    const r = makeGridRecorder(matrix, boundaryCount(matrix.length, matrix[0]?.length ?? 0));
    if (r.rows === 0 || r.cols === 0) return empty("trace");
    r.push(0, "Boundary order walks the outer ring only: top row, right column, bottom row backwards, left column upwards.");
    const last = (n) => n - 1;
    for (let j = 0; j < r.cols; j++) {
        r.visit(0, j, 0, `Top row: visit ${cellText(matrix, 0, j)}.`, j === 0 ? "turn" : "current");
    }
    for (let i = 1; i < r.rows; i++) {
        r.visit(i, last(r.cols), 1, `Right column: visit ${cellText(matrix, i, last(r.cols))}.`, i === 1 ? "turn" : "current");
    }
    if (r.rows > 1) {
        for (let j = r.cols - 2; j >= 0; j--) {
            r.visit(last(r.rows), j, 2, `Bottom row, backwards: visit ${cellText(matrix, last(r.rows), j)}.`, j === r.cols - 2 ? "turn" : "current");
        }
    }
    if (r.cols > 1) {
        for (let i = r.rows - 2; i >= 1; i--) {
            r.visit(i, 0, 3, `Left column, upwards: visit ${cellText(matrix, i, 0)}.`, i === r.rows - 2 ? "turn" : "current");
        }
    }
    const inside = r.rows * r.cols - boundaryCount(r.rows, r.cols);
    finish(r, inside > 0 ? `The ring is done: ${boundaryCount(r.rows, r.cols)} cells visited, ${inside} inner cells never touched.` : `The ring is done: every cell was on the boundary.`);
    return { steps: r.steps };
}

function spiral(matrix) {
    const r = makeGridRecorder(matrix, matrix.length * (matrix[0]?.length ?? 0));
    if (r.rows === 0 || r.cols === 0) return empty("traverse");
    let top = 0;
    let bottom = r.rows - 1;
    let left = 0;
    let right = r.cols - 1;
    const bounds = () => Object.assign(r.vars, { top, bottom, left, right });
    bounds();
    r.push(0, "Spiral order peels the grid like an onion: along the top, down the right, back along the bottom, up the left, then the same on the ring inside.");
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) {
            r.visit(top, j, 2, `Top edge, row ${top}: visit ${cellText(matrix, top, j)}.`, j === left ? "turn" : "current");
        }
        top++;
        bounds();
        for (let i = top; i <= bottom; i++) {
            r.visit(i, right, 3, `Right edge, column ${right}: visit ${cellText(matrix, i, right)}.`, i === top ? "turn" : "current");
        }
        right--;
        bounds();
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                r.visit(bottom, j, 4, `Bottom edge, row ${bottom}: visit ${cellText(matrix, bottom, j)}.`, j === right ? "turn" : "current");
            }
            bottom--;
            bounds();
        }
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                r.visit(i, left, 5, `Left edge, column ${left}: visit ${cellText(matrix, i, left)}.`, i === bottom ? "turn" : "current");
            }
            left++;
            bounds();
        }
    }
    finish(r, `Every cell visited in ${r.rows * r.cols} steps. The bounds closed in until nothing was left.`);
    return { steps: r.steps };
}

const all = (rows, cols) => rows * cols;

export const TRAVERSALS = {
    "row-major": {
        key: "row-major",
        label: "Row-major",
        blurb: "Left to right, one row at a time. The order most languages store a 2D array in memory.",
        lead: "reads the grid the way you read a page: across the first row, then across the second, and so on. It is the order most languages store a 2D array in memory, so it is also the fastest way to touch every cell.",
        roles: ["current", "visited"],
        pseudocode: [
            "for i in 0 .. rows-1:",
            "  for j in 0 .. cols-1:",
            "    visit(a[i][j])",
        ],
        count: all,
        run: rowMajor,
    },
    "column-major": {
        key: "column-major",
        label: "Column-major",
        blurb: "Top to bottom, one column at a time. The same two loops, swapped.",
        lead: "walks down a whole column before moving to the next one. It is the same pair of loops as row-major with the inner and outer loop swapped, and it is how Fortran, MATLAB and NumPy's order=\"F\" arrays are laid out.",
        roles: ["current", "visited"],
        pseudocode: [
            "for j in 0 .. cols-1:",
            "  for i in 0 .. rows-1:",
            "    visit(a[i][j])",
        ],
        count: all,
        run: columnMajor,
    },
    snake: {
        key: "snake",
        label: "Snake",
        blurb: "Left to right, then right to left, like mowing a lawn. No jumping back to the start of a row.",
        lead: "alternates direction on every row, like mowing a lawn or an old printer head: left to right, then right to left. The path never jumps back to the start of a row, which is why it is also called zigzag or boustrophedon order.",
        roles: ["current", "visited", "turn"],
        pseudocode: [
            "for i in 0 .. rows-1:",
            "  if i is even:",
            "    for j in 0 .. cols-1: visit(a[i][j])",
            "  else:",
            "    for j in cols-1 .. 0: visit(a[i][j])",
        ],
        count: all,
        run: snake,
    },
    diagonal: {
        key: "diagonal",
        label: "Diagonal",
        blurb: "Cells grouped by i + j: corner first, then each anti-diagonal down to the opposite corner.",
        lead: "groups cells by the sum of their indices. All the cells where i + j = 0 come first (just the corner), then the cells where i + j = 1, and so on until the opposite corner. Each group is one anti-diagonal.",
        roles: ["current", "visited", "turn"],
        pseudocode: [
            "for d in 0 .. rows+cols-2:",
            "  for i in max(0, d-cols+1) .. min(d, rows-1):",
            "    j = d - i",
            "    visit(a[i][j])",
        ],
        count: all,
        run: diagonal,
    },
    boundary: {
        key: "boundary",
        label: "Boundary",
        blurb: "The outer ring only: top, right, bottom, left. Inner cells are never touched.",
        lead: "visits only the outer ring of the grid: across the top row, down the right column, back along the bottom row and up the left column. The cells inside the ring are never touched, so it takes far fewer steps than a full traversal.",
        roles: ["current", "visited", "turn"],
        pseudocode: [
            "for j in 0 .. cols-1: visit(a[0][j])",
            "for i in 1 .. rows-1: visit(a[i][cols-1])",
            "if rows > 1: for j in cols-2 .. 0: visit(a[rows-1][j])",
            "if cols > 1: for i in rows-2 .. 1: visit(a[i][0])",
        ],
        count: boundaryCount,
        run: boundary,
    },
    spiral: {
        key: "spiral",
        label: "Spiral",
        blurb: "Around the outside and inwards, clockwise, until the bounds meet in the middle.",
        lead: "peels the grid like an onion. It walks the outer ring clockwise, then shrinks the four bounds by one and walks the next ring, until top passes bottom or left passes right and nothing is left.",
        roles: ["current", "visited", "turn"],
        pseudocode: [
            "top = 0, bottom = rows-1, left = 0, right = cols-1",
            "while top <= bottom and left <= right:",
            "  for j in left .. right: visit(a[top][j]);      top += 1",
            "  for i in top .. bottom: visit(a[i][right]);   right -= 1",
            "  if top <= bottom: for j in right .. left: visit(a[bottom][j]); bottom -= 1",
            "  if left <= right: for i in bottom .. top: visit(a[i][left]);  left += 1",
        ],
        count: all,
        run: spiral,
    },
};

export const TRAVERSAL_LIST = Object.values(TRAVERSALS);

export function numberedGrid(rows, cols) {
    return Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => i * cols + j + 1));
}

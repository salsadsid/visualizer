export const gridKey = (r, c) => `${r},${c}`;

export function makeGridRecorder(matrix, total, { collectOutput = true } = {}) {
    const rows = matrix.length;
    const cols = rows > 0 ? matrix[0].length : 0;
    const steps = [];
    const visited = new Set();
    const order = {};
    const marks = {};
    const frontier = [];
    const outputs = [];
    const pointers = {};
    const vars = {};
    const extra = {};
    let count = 0;

    const push = (line, message, highlights = {}) => {
        const cells = {};
        for (const k of visited) cells[k] = "visited";
        for (const k of frontier) cells[k] = "frontier";
        Object.assign(cells, marks, highlights);
        steps.push({
            cells,
            order: { ...order },
            frontier: frontier.slice(),
            pointers: { ...pointers },
            vars: { ...vars },
            line,
            message,
            stats: { visited: count, total, frontier: frontier.length, ...extra },
            output: outputs.slice(),
        });
    };

    const visit = (r, c, line, message, role = "current", badge) => {
        const k = gridKey(r, c);
        count++;
        visited.add(k);
        order[k] = badge ?? count;
        if (collectOutput) outputs.push(matrix[r][c]);
        pointers.i = r;
        pointers.j = c;
        push(line, message, { [k]: role });
    };

    const mark = (r, c, n) => {
        order[gridKey(r, c)] = n;
    };

    const clearPointers = () => {
        delete pointers.i;
        delete pointers.j;
    };

    return { steps, rows, cols, pointers, vars, frontier, marks, extra, push, visit, mark, clearPointers };
}

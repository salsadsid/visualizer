const key = (r, c) => `${r},${c}`;

export function makeGridRecorder(matrix, total) {
    const rows = matrix.length;
    const cols = rows > 0 ? matrix[0].length : 0;
    const steps = [];
    const order = {};
    const output = [];
    const pointers = {};
    const vars = {};
    let count = 0;

    const push = (line, message, highlights = {}) => {
        const cells = {};
        for (const k in order) cells[k] = "visited";
        Object.assign(cells, highlights);
        steps.push({
            cells,
            order: { ...order },
            pointers: { ...pointers },
            vars: { ...vars },
            line,
            message,
            stats: { visited: count, total },
            output: output.slice(),
        });
    };

    const visit = (r, c, line, message, role = "current") => {
        count++;
        order[key(r, c)] = count;
        output.push(matrix[r][c]);
        pointers.i = r;
        pointers.j = c;
        push(line, message, { [key(r, c)]: role });
    };

    const clearPointers = () => {
        delete pointers.i;
        delete pointers.j;
    };

    return { steps, rows, cols, pointers, vars, push, visit, clearPointers };
}

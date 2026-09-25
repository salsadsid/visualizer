const fn = (name, params, body, typed) =>
    typed
        ? `function ${name}(${params.map((p) => `${p}: number[][]`).join(", ")}): number[][] {\n${body}\n}`
        : `function ${name}(${params.join(", ")}) {\n${body}\n}`;

const snippet = (title, { name, params = ["a"], cpp, python, js }) => ({
    cpp: { title: `${title} (C++)`, code: cpp },
    python: { title: `${title} (Python)`, code: python },
    javascript: { title: `${title} (JavaScript)`, code: fn(name, params, js, false) },
    typescript: { title: `${title} (TypeScript)`, code: fn(name, params, js, true) },
});

const group = (...snippets) => ({
    cpp: snippets.map((s) => s.cpp).filter(Boolean),
    python: snippets.map((s) => s.python).filter(Boolean),
    javascript: snippets.map((s) => s.javascript).filter(Boolean),
    typescript: snippets.map((s) => s.typescript).filter(Boolean),
});

const pythonOnly = (title, code) => ({ python: { title, code } });

const copy = (title, name, { outDims, assignCpp, assignPy, assignJs }) =>
    snippet(title, {
        name,
        cpp: `vector<vector<int>> ${name}(const vector<vector<int>>& a) {
    int rows = a.size(), cols = a[0].size();
    vector<vector<int>> b(${outDims.cpp});
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            ${assignCpp};
    return b;
}`,
        python: `def ${name}(a):
    rows, cols = len(a), len(a[0])
    b = ${outDims.py}
    for i in range(rows):
        for j in range(cols):
            ${assignPy}
    return b`,
        js: `    const rows = a.length, cols = a[0].length;
    const b = ${outDims.js};
    for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
            ${assignJs};
    return b;`,
    });

const COLS_BY_ROWS = {
    cpp: "cols, vector<int>(rows)",
    py: "[[0] * rows for _ in range(cols)]",
    js: "Array.from({ length: cols }, () => Array(rows).fill(0))",
};

const ROWS_BY_COLS = {
    cpp: "rows, vector<int>(cols)",
    py: "[[0] * cols for _ in range(rows)]",
    js: "Array.from({ length: rows }, () => Array(cols).fill(0))",
};

export const MATRIX_CODE = {
    transpose: group(
        copy("Transpose", "transpose", {
            outDims: COLS_BY_ROWS,
            assignCpp: "b[j][i] = a[i][j]",
            assignPy: "b[j][i] = a[i][j]",
            assignJs: "b[j][i] = a[i][j]",
        }),
        pythonOnly("Transpose with zip", `def transpose(a):
    return [list(row) for row in zip(*a)]`)
    ),
    rotate: group(
        copy("Rotate 90° clockwise", "rotateClockwise", {
            outDims: COLS_BY_ROWS,
            assignCpp: "b[j][rows - 1 - i] = a[i][j]",
            assignPy: "b[j][rows - 1 - i] = a[i][j]",
            assignJs: "b[j][rows - 1 - i] = a[i][j]",
        }),
        copy("Rotate 90° counter-clockwise", "rotateCounterClockwise", {
            outDims: COLS_BY_ROWS,
            assignCpp: "b[cols - 1 - j][i] = a[i][j]",
            assignPy: "b[cols - 1 - j][i] = a[i][j]",
            assignJs: "b[cols - 1 - j][i] = a[i][j]",
        }),
        pythonOnly("Rotate with zip", `def rotate_clockwise(a):
    return [list(row) for row in zip(*a[::-1])]

def rotate_counter_clockwise(a):
    return [list(row) for row in zip(*a)][::-1]`)
    ),
    flip: group(
        copy("Flip horizontally", "flipHorizontal", {
            outDims: ROWS_BY_COLS,
            assignCpp: "b[i][cols - 1 - j] = a[i][j]",
            assignPy: "b[i][cols - 1 - j] = a[i][j]",
            assignJs: "b[i][cols - 1 - j] = a[i][j]",
        }),
        copy("Flip vertically", "flipVertical", {
            outDims: ROWS_BY_COLS,
            assignCpp: "b[rows - 1 - i][j] = a[i][j]",
            assignPy: "b[rows - 1 - i][j] = a[i][j]",
            assignJs: "b[rows - 1 - i][j] = a[i][j]",
        }),
        pythonOnly("Flip with slices", `def flip_horizontal(a):
    return [row[::-1] for row in a]

def flip_vertical(a):
    return a[::-1]`)
    ),
    multiply: group(
        snippet("Matrix multiplication", {
            name: "multiply",
            params: ["a", "b"],
            cpp: `vector<vector<int>> multiply(const vector<vector<int>>& a, const vector<vector<int>>& b) {
    int n = a.size(), m = a[0].size(), p = b[0].size();
    vector<vector<int>> c(n, vector<int>(p, 0));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < p; j++)
            for (int k = 0; k < m; k++)
                c[i][j] += a[i][k] * b[k][j];
    return c;
}`,
            python: `def multiply(a, b):
    n, m, p = len(a), len(a[0]), len(b[0])
    c = [[0] * p for _ in range(n)]
    for i in range(n):
        for j in range(p):
            for k in range(m):
                c[i][j] += a[i][k] * b[k][j]
    return c`,
            js: `    const n = a.length, m = a[0].length, p = b[0].length;
    const c = Array.from({ length: n }, () => Array(p).fill(0));
    for (let i = 0; i < n; i++)
        for (let j = 0; j < p; j++)
            for (let k = 0; k < m; k++)
                c[i][j] += a[i][k] * b[k][j];
    return c;`,
        }),
        pythonOnly("Multiply with NumPy", `import numpy as np

c = np.array(a) @ np.array(b)`)
    ),
};

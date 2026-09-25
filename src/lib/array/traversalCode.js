const wrap = {
    javascript: (name, body) => `function ${name}(a, visit) {\n    const rows = a.length, cols = a[0].length;\n${body}\n}`,
    typescript: (name, body) =>
        `function ${name}(a: number[][], visit: (value: number) => void): void {\n    const rows = a.length, cols = a[0].length;\n${body}\n}`,
};

const snippet = (key, name, { cpp, python, js }) => ({
    cpp: [{ title: `${name} (C++)`, code: cpp }],
    python: [{ title: `${name} (Python)`, code: python }],
    javascript: [{ title: `${name} (JavaScript)`, code: wrap.javascript(key, js) }],
    typescript: [{ title: `${name} (TypeScript)`, code: wrap.typescript(key, js) }],
});

export const TRAVERSAL_CODE = {
    "row-major": snippet("rowMajor", "Row-major traversal", {
        cpp: `for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
        visit(a[i][j]);`,
        python: `for i in range(rows):
    for j in range(cols):
        visit(a[i][j])`,
        js: `    for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
            visit(a[i][j]);`,
    }),
    "column-major": snippet("columnMajor", "Column-major traversal", {
        cpp: `for (int j = 0; j < cols; j++)
    for (int i = 0; i < rows; i++)
        visit(a[i][j]);`,
        python: `for j in range(cols):
    for i in range(rows):
        visit(a[i][j])`,
        js: `    for (let j = 0; j < cols; j++)
        for (let i = 0; i < rows; i++)
            visit(a[i][j]);`,
    }),
    snake: snippet("snake", "Snake traversal", {
        cpp: `for (int i = 0; i < rows; i++) {
    if (i % 2 == 0)
        for (int j = 0; j < cols; j++) visit(a[i][j]);
    else
        for (int j = cols - 1; j >= 0; j--) visit(a[i][j]);
}`,
        python: `for i in range(rows):
    if i % 2 == 0:
        for j in range(cols):
            visit(a[i][j])
    else:
        for j in range(cols - 1, -1, -1):
            visit(a[i][j])`,
        js: `    for (let i = 0; i < rows; i++) {
        if (i % 2 === 0)
            for (let j = 0; j < cols; j++) visit(a[i][j]);
        else
            for (let j = cols - 1; j >= 0; j--) visit(a[i][j]);
    }`,
    }),
    diagonal: snippet("diagonal", "Diagonal traversal", {
        cpp: `for (int d = 0; d <= rows + cols - 2; d++) {
    int from = max(0, d - cols + 1);
    int to = min(d, rows - 1);
    for (int i = from; i <= to; i++)
        visit(a[i][d - i]);
}`,
        python: `for d in range(rows + cols - 1):
    for i in range(max(0, d - cols + 1), min(d, rows - 1) + 1):
        visit(a[i][d - i])`,
        js: `    for (let d = 0; d <= rows + cols - 2; d++) {
        const from = Math.max(0, d - cols + 1);
        const to = Math.min(d, rows - 1);
        for (let i = from; i <= to; i++)
            visit(a[i][d - i]);
    }`,
    }),
    boundary: snippet("boundary", "Boundary traversal", {
        cpp: `for (int j = 0; j < cols; j++) visit(a[0][j]);
for (int i = 1; i < rows; i++) visit(a[i][cols - 1]);
if (rows > 1)
    for (int j = cols - 2; j >= 0; j--) visit(a[rows - 1][j]);
if (cols > 1)
    for (int i = rows - 2; i >= 1; i--) visit(a[i][0]);`,
        python: `for j in range(cols):
    visit(a[0][j])
for i in range(1, rows):
    visit(a[i][cols - 1])
if rows > 1:
    for j in range(cols - 2, -1, -1):
        visit(a[rows - 1][j])
if cols > 1:
    for i in range(rows - 2, 0, -1):
        visit(a[i][0])`,
        js: `    for (let j = 0; j < cols; j++) visit(a[0][j]);
    for (let i = 1; i < rows; i++) visit(a[i][cols - 1]);
    if (rows > 1)
        for (let j = cols - 2; j >= 0; j--) visit(a[rows - 1][j]);
    if (cols > 1)
        for (let i = rows - 2; i >= 1; i--) visit(a[i][0]);`,
    }),
    spiral: snippet("spiral", "Spiral traversal", {
        cpp: `int top = 0, bottom = rows - 1, left = 0, right = cols - 1;
while (top <= bottom && left <= right) {
    for (int j = left; j <= right; j++) visit(a[top][j]);
    top++;
    for (int i = top; i <= bottom; i++) visit(a[i][right]);
    right--;
    if (top <= bottom) {
        for (int j = right; j >= left; j--) visit(a[bottom][j]);
        bottom--;
    }
    if (left <= right) {
        for (int i = bottom; i >= top; i--) visit(a[i][left]);
        left++;
    }
}`,
        python: `top, bottom, left, right = 0, rows - 1, 0, cols - 1
while top <= bottom and left <= right:
    for j in range(left, right + 1):
        visit(a[top][j])
    top += 1
    for i in range(top, bottom + 1):
        visit(a[i][right])
    right -= 1
    if top <= bottom:
        for j in range(right, left - 1, -1):
            visit(a[bottom][j])
        bottom -= 1
    if left <= right:
        for i in range(bottom, top - 1, -1):
            visit(a[i][left])
        left += 1`,
        js: `    let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) visit(a[top][j]);
        top++;
        for (let i = top; i <= bottom; i++) visit(a[i][right]);
        right--;
        if (top <= bottom) {
            for (let j = right; j >= left; j--) visit(a[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (let i = bottom; i >= top; i--) visit(a[i][left]);
            left++;
        }
    }`,
    }),
};

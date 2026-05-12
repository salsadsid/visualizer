export const LANGUAGES = [
    { id: "cpp", label: "C++" },
    { id: "python", label: "Python" },
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
];

export const SNIPPETS = {
    cpp: [
        {
            title: "Create a 3 × 3 matrix of zeros",
            code: `#include <vector>

int rows = 3, cols = 3;
std::vector<std::vector<int>> grid(rows, std::vector<int>(cols, 0));

// Read or write any cell: grid[row][col]
grid[1][2] = 7;`,
        },
        {
            title: "Row-major traversal",
            code: `for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        std::cout << grid[i][j] << " ";
    }
    std::cout << "\\n";
}`,
        },
        {
            title: "Tip: fixed vs dynamic size",
            code: `// Fixed size known at compile time
int arr[3][3] = {0};   // all zeros

// Dynamic size at runtime
std::vector<std::vector<int>> grid(rows,
    std::vector<int>(cols, 0));`,
        },
    ],
    python: [
        {
            title: "Create a 3 × 3 matrix of zeros",
            code: `rows, cols = 3, 3
grid = [[0] * cols for _ in range(rows)]

# Read or write any cell: grid[row][col]
grid[1][2] = 7`,
        },
        {
            title: "Row-major traversal",
            code: `for i in range(rows):
    for j in range(cols):
        print(grid[i][j], end=" ")
    print()`,
        },
        {
            title: "⚠️ Common bug: shared row reference",
            code: `# WRONG: every row is the SAME list
grid = [[0] * 3] * 3
grid[0][0] = 1   # mutates ALL rows!

# RIGHT: fresh list per row
grid = [[0] * 3 for _ in range(3)]`,
        },
    ],
    javascript: [
        {
            title: "Create a 3 × 3 matrix of zeros",
            code: `const rows = 3, cols = 3;
const grid = Array.from(
  { length: rows },
  () => Array(cols).fill(0)
);

// Read or write any cell: grid[row][col]
grid[1][2] = 7;`,
        },
        {
            title: "Row-major traversal",
            code: `for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    console.log(grid[i][j]);
  }
}`,
        },
        {
            title: "⚠️ Common bug: shared row reference",
            code: `// WRONG: every row is the SAME array
const grid = Array(3).fill(Array(3).fill(0));
grid[0][0] = 1;   // mutates ALL rows!

// RIGHT: Array.from gives each row its own array
const grid = Array.from(
  { length: 3 },
  () => Array(3).fill(0)
);`,
        },
    ],
    typescript: [
        {
            title: "Create a 3 × 3 matrix of zeros",
            code: `type Matrix = number[][];

const rows = 3;
const cols = 3;
const grid: Matrix = Array.from(
  { length: rows },
  () => Array<number>(cols).fill(0)
);

grid[1][2] = 7;`,
        },
        {
            title: "Row-major traversal",
            code: `for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    console.log(grid[i][j]);
  }
}`,
        },
        {
            title: "Typed helper: transpose",
            code: `type Matrix = number[][];

function transpose(m: Matrix): Matrix {
  return m[0].map((_, j) => m.map((row) => row[j]));
}

const t = transpose([[1, 2], [3, 4]]);
// t is [[1, 3], [2, 4]]`,
        },
    ],
};

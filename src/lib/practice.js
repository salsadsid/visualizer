export const PRACTICE_SITES = {
    leetcode: "LeetCode",
    codeforces: "Codeforces",
    cses: "CSES",
};

const leetcode = (id, title, slug, level, note) => ({
    site: "leetcode",
    title: `${id}. ${title}`,
    url: `https://leetcode.com/problems/${slug}/`,
    level,
    note,
});

const codeforces = (contest, index, title, level, note) => ({
    site: "codeforces",
    title: `${contest}${index}. ${title}`,
    url: `https://codeforces.com/problemset/problem/${contest}/${index}`,
    level,
    note,
});

const cses = (task, title, level, note) => ({
    site: "cses",
    title,
    url: `https://cses.fi/problemset/task/${task}`,
    level,
    note,
});

export const PRACTICE = {
    "/algorithms/sorting/bubble-sort": [
        codeforces(405, "A", "Gravity Flip", "Easy", "Flipping gravity to the right sorts the columns, and each pass carries the tallest one to the end."),
        codeforces(266, "B", "Queue at the School", "Easy", "Every second, each boy swaps with the girl behind him: one pass of neighbour swaps per second."),
        leetcode(75, "Sort Colors", "sort-colors", "Medium", "Only three values and n ≤ 300, so bubble sort passes. The follow-up asks for a single pass."),
    ],
    "/algorithms/sorting/selection-sort": [
        codeforces(489, "A", "SwapSort", "Medium", "Sort with at most n swaps: one swap per position is exactly what selection sort promises."),
        leetcode(414, "Third Maximum Number", "third-maximum-number", "Easy", "Three passes that each pick the largest value left: selection sort stopped after three rounds."),
        leetcode(2418, "Sort the People", "sort-the-people", "Easy", "Pick the tallest person on each pass and move their name along with them."),
    ],
    "/algorithms/sorting/insertion-sort": [
        leetcode(147, "Insertion Sort List", "insertion-sort-list", "Medium", "The same algorithm on a linked list: relink each node into place instead of shifting values."),
        leetcode(88, "Merge Sorted Array", "merge-sorted-array", "Easy", "Fill from the back, sliding bigger values right to make room, just like the inner loop."),
        leetcode(35, "Search Insert Position", "search-insert-position", "Easy", "Find where a key belongs in a sorted array: the inner loop on its own. Then try binary search."),
    ],
    "/data-structures/arrays/traversal/row-major": [
        leetcode(566, "Reshape the Matrix", "reshape-the-matrix", "Easy", "Read the grid row by row and refill it: cell k lands at row k / c, column k % c."),
        leetcode(2022, "Convert 1D Array Into 2D Array", "convert-1d-array-into-2d-array", "Easy", "Fill a grid row by row from a flat list: row-major order in reverse."),
        leetcode(1260, "Shift 2D Grid", "shift-2d-grid", "Easy", "Number the cells in row-major order and the shift becomes arithmetic on one long list."),
    ],
    "/data-structures/arrays/traversal/column-major": [
        leetcode(944, "Delete Columns to Make Sorted", "delete-columns-to-make-sorted", "Easy", "Walk down each column and check that it is sorted: a column-major scan."),
        leetcode(2639, "Find the Width of Columns of a Grid", "find-the-width-of-columns-of-a-grid", "Easy", "One answer per column, so the outer loop runs over columns and the inner loop over rows."),
        leetcode(1380, "Lucky Numbers in a Matrix", "lucky-numbers-in-a-matrix", "Easy", "Row minimums need a row-major pass; column maximums need a column-major one."),
    ],
    "/data-structures/arrays/traversal/snake": [
        codeforces(510, "A", "Fox And Snake", "Easy", "Draw the snake: full rows alternate with a single cell on the right, then on the left."),
        leetcode(3417, "Zigzag Grid Traversal With Skip", "zigzag-grid-traversal-with-skip", "Easy", "Exactly the snake order, left to right then right to left, keeping every other cell."),
    ],
    "/data-structures/arrays/traversal/diagonal": [
        leetcode(766, "Toeplitz Matrix", "toeplitz-matrix", "Easy", "Along a diagonal i − j stays the same: check that each diagonal holds a single value."),
        leetcode(498, "Diagonal Traverse", "diagonal-traverse", "Medium", "Walk the anti-diagonals where i + j is fixed, flipping direction each time."),
        leetcode(1424, "Diagonal Traverse II", "diagonal-traverse-ii", "Medium", "Group cells by i + j when the rows have different lengths."),
    ],
    "/data-structures/arrays/traversal/boundary": [
        leetcode(1914, "Cyclically Rotating a Grid", "cyclically-rotating-a-grid", "Medium", "Each layer is a ring: walk its boundary into a list, rotate the list, write it back."),
        leetcode(1020, "Number of Enclaves", "number-of-enclaves", "Medium", "Start from the land on the outer ring, then count the land nothing could reach."),
    ],
    "/data-structures/arrays/traversal/spiral": [
        leetcode(54, "Spiral Matrix", "spiral-matrix", "Medium", "The spiral order itself: shrink the top, right, bottom and left bounds after each edge."),
        leetcode(59, "Spiral Matrix II", "spiral-matrix-ii", "Medium", "The same walk, writing 1, 2, 3 … into the cells instead of reading them."),
        leetcode(885, "Spiral Matrix III", "spiral-matrix-iii", "Medium", "Spiral outwards from a start cell and skip the steps that fall outside the grid."),
    ],
    "/data-structures/arrays/matrix/transpose": [
        leetcode(867, "Transpose Matrix", "transpose-matrix", "Easy", "The operation itself: A[i][j] moves to B[j][i], and a non-square matrix changes shape."),
        leetcode(2352, "Equal Row and Column Pairs", "equal-row-and-column-pairs", "Medium", "Column j is row j of the transpose, so compare rows with the transpose's rows."),
    ],
    "/data-structures/arrays/matrix/rotate": [
        leetcode(48, "Rotate Image", "rotate-image", "Medium", "Rotate in place: transpose, then reverse every row."),
        leetcode(1886, "Determine Whether Matrix Can Be Obtained By Rotation", "determine-whether-matrix-can-be-obtained-by-rotation", "Easy", "Rotate up to three times and compare: four clockwise turns bring you back."),
    ],
    "/data-structures/arrays/matrix/flip": [
        leetcode(832, "Flipping an Image", "flipping-an-image", "Easy", "Flip each row horizontally, j with n − 1 − j, then invert the bits."),
        leetcode(3239, "Minimum Number of Flips to Make Binary Grid Palindromic I", "minimum-number-of-flips-to-make-binary-grid-palindromic-i", "Medium", "Compare each cell with its mirror across the row or the column. Here a flip changes a bit."),
    ],
    "/data-structures/arrays/matrix/multiply": [
        leetcode(509, "Fibonacci Number", "fibonacci-number", "Easy", "Solve it again with powers of the matrix [[1, 1], [1, 0]]: each step is one multiply."),
        cses(1722, "Fibonacci Numbers", "Medium", "n goes up to 10^18, so build fast matrix powers from the row-times-column rule."),
        codeforces(185, "A", "Plant", "Medium", "Count the upward triangles after n years with a 2 × 2 matrix power."),
    ],
    "/algorithms/grid/flood-fill": [
        leetcode(733, "Flood Fill", "flood-fill", "Easy", "The paint bucket itself: spread from one pixel to same-coloured neighbours."),
        leetcode(1034, "Coloring A Border", "coloring-a-border", "Medium", "Flood the component, then recolour only the cells on its edge."),
        leetcode(130, "Surrounded Regions", "surrounded-regions", "Medium", "Flood from the border first; every region the fill cannot reach gets captured."),
    ],
    "/algorithms/grid/number-of-islands": [
        leetcode(200, "Number of Islands", "number-of-islands", "Medium", "Scan the grid; each unvisited land cell starts a new island that a flood fill sinks."),
        cses(1192, "Counting Rooms", "Easy", "The same count on a building map: rooms are islands of floor cells."),
        leetcode(695, "Max Area of Island", "max-area-of-island", "Medium", "Count the cells as you sink each island and keep the largest."),
    ],
    "/algorithms/grid/shortest-path": [
        leetcode(1926, "Nearest Exit from Entrance in Maze", "nearest-exit-from-entrance-in-maze", "Medium", "Breadth-first search from the entrance: the first border cell you reach is the nearest exit."),
        cses(1193, "Labyrinth", "Medium", "BFS plus parent pointers, because you must print the path and not just its length."),
        leetcode(1091, "Shortest Path in Binary Matrix", "shortest-path-in-binary-matrix", "Medium", "The same BFS with eight directions instead of four."),
    ],
    "/data-structures/arrays/1d": [
        leetcode(1089, "Duplicate Zeros", "duplicate-zeros", "Easy", "Insert by shifting: every zero pushes the rest of the array one slot right."),
        leetcode(27, "Remove Element", "remove-element", "Easy", "Delete values in place and close the gaps, keeping count of what is left."),
        leetcode(344, "Reverse String", "reverse-string", "Easy", "Two pointers swap the ends and walk towards the middle, like the Reverse operation."),
    ],
    "/data-structures/arrays": [
        leetcode(1672, "Richest Customer Wealth", "richest-customer-wealth", "Easy", "Sum each row of a 2D array and keep the biggest: a first nested loop."),
        codeforces(263, "A", "Beautiful Matrix", "Easy", "Find the 1 in a 5 × 5 grid and count the moves to the centre from its row and column."),
        leetcode(1572, "Matrix Diagonal Sum", "matrix-diagonal-sum", "Easy", "Add the cells where i == j or i + j == n − 1, without counting the centre twice."),
    ],
    "/algorithms/complexity": [
        leetcode(704, "Binary Search", "binary-search", "Easy", "The phone-book race: halve the range every step for O(log n)."),
        leetcode(217, "Contains Duplicate", "contains-duplicate", "Easy", "Checking every pair is O(n²) and too slow at 10^5 values; a set makes it O(n)."),
        cses(1083, "Missing Number", "Easy", "One pass with a running sum is O(n), where searching for each number would be O(n²)."),
    ],
};

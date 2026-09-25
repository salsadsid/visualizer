import test from "node:test";
import assert from "node:assert/strict";
import { GRID_ALGORITHMS, GRID_ALGORITHM_LIST, isLand, isWall, pseudocodeFor } from "../src/lib/array/gridAlgorithms.js";

function mulberry32(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const rand = mulberry32(2026);
const pick = (values) => values[Math.floor(rand() * values.length)];
const randomGrid = (rows, cols, values) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => pick(values)));
const randomSize = () => [1 + Math.floor(rand() * 8), 1 + Math.floor(rand() * 10)];
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const key = (r, c) => `${r},${c}`;
const inside = (grid, r, c) => r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;

function refRegion(grid, sr, sc) {
    const value = grid[sr][sc];
    const seen = new Set([key(sr, sc)]);
    const queue = [[sr, sc]];
    while (queue.length) {
        const [r, c] = queue.shift();
        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc;
            if (inside(grid, nr, nc) && grid[nr][nc] === value && !seen.has(key(nr, nc))) {
                seen.add(key(nr, nc));
                queue.push([nr, nc]);
            }
        }
    }
    return seen;
}

function refIslands(grid) {
    const seen = new Set();
    const groups = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (!isLand(grid[i][j]) || seen.has(key(i, j))) continue;
            const group = new Set([key(i, j)]);
            const queue = [[i, j]];
            seen.add(key(i, j));
            while (queue.length) {
                const [r, c] = queue.shift();
                for (const [dr, dc] of DIRS) {
                    const nr = r + dr, nc = c + dc;
                    if (inside(grid, nr, nc) && isLand(grid[nr][nc]) && !seen.has(key(nr, nc))) {
                        seen.add(key(nr, nc));
                        group.add(key(nr, nc));
                        queue.push([nr, nc]);
                    }
                }
            }
            groups.push(group);
        }
    }
    return groups;
}

function refDistance(grid, [sr, sc], [tr, tc]) {
    const open = (r, c) => (r === sr && c === sc) || (r === tr && c === tc) || !isWall(grid[r][c]);
    const dist = { [key(sr, sc)]: 0 };
    const queue = [[sr, sc]];
    while (queue.length) {
        const [r, c] = queue.shift();
        if (r === tr && c === tc) return dist[key(r, c)];
        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc;
            if (inside(grid, nr, nc) && open(nr, nc) && !(key(nr, nc) in dist)) {
                dist[key(nr, nc)] = dist[key(r, c)] + 1;
                queue.push([nr, nc]);
            }
        }
    }
    return -1;
}

function checkSteps(algorithm, steps, variant) {
    const lines = pseudocodeFor(algorithm, variant).length;
    let visited = 0;
    for (const step of steps) {
        assert.ok(step.line >= 0 && step.line < lines, `${algorithm.key}: line ${step.line}`);
        assert.ok(typeof step.message === "string" && step.message.length > 0);
        for (const role of Object.values(step.cells)) assert.ok(algorithm.roles.includes(role), `${algorithm.key}: role ${role}`);
        for (const k of step.frontier) assert.match(k, /^\d+,\d+$/);
        for (const n of Object.values(step.order)) assert.ok(Number.isInteger(n) && n >= 0);
        assert.ok(step.stats.visited >= visited && step.stats.visited <= visited + 1, `${algorithm.key}: visited jumped`);
        assert.equal(step.stats.frontier, step.frontier.length);
        visited = step.stats.visited;
    }
}

test("flood fill fills exactly the connected region, with BFS and DFS alike", () => {
    const flood = GRID_ALGORITHMS["flood-fill"];
    for (let n = 0; n < 40; n++) {
        const [rows, cols] = randomSize();
        const grid = randomGrid(rows, cols, [0, 1, 2]);
        const start = [Math.floor(rand() * rows), Math.floor(rand() * cols)];
        const expected = refRegion(grid, ...start);
        for (const variant of ["bfs", "dfs"]) {
            const { steps } = flood.run(grid, { start, variant });
            const last = steps.at(-1);
            assert.deepEqual(new Set(Object.keys(last.order)), expected, `${variant} ${rows}×${cols} from ${start}`);
            assert.equal(last.stats.visited, expected.size);
            assert.equal(last.stats.total, expected.size);
            assert.equal(last.frontier.length, 0);
            checkSteps(flood, steps, variant);
        }
    }
});

test("the default flood fill example fills the region of 2s", () => {
    const flood = GRID_ALGORITHMS["flood-fill"];
    const { steps } = flood.run(flood.defaultGrid, { start: flood.defaultStart, variant: "bfs" });
    assert.equal(steps.at(-1).stats.visited, 12);
    for (const k of Object.keys(steps.at(-1).order)) {
        const [r, c] = k.split(",").map(Number);
        assert.equal(flood.defaultGrid[r][c], 2, k);
    }
    const dfs = flood.run(flood.defaultGrid, { start: flood.defaultStart, variant: "dfs" }).steps;
    assert.deepEqual(Object.keys(dfs.at(-1).order).sort(), Object.keys(steps.at(-1).order).sort());
    assert.ok(Math.max(...dfs.map((s) => s.frontier.length)) > 1, "the call stack is shown");
});

test("number of islands matches a reference count and colours each island", () => {
    const islands = GRID_ALGORITHMS["number-of-islands"];
    const cases = [
        [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]], 1],
        [islands.defaultGrid, 3],
        [[[0, 0], [0, 0]], 0],
        [[[1]], 1],
    ];
    for (let n = 0; n < 30; n++) cases.push([randomGrid(...randomSize(), [0, 0, 1, 1, 1]), null]);
    for (const [grid, known] of cases) {
        const groups = refIslands(grid);
        const { steps } = islands.run(grid);
        const last = steps.at(-1);
        assert.equal(last.stats.islands, known ?? groups.length);
        assert.equal(last.stats.visited, groups.reduce((n, g) => n + g.size, 0));
        assert.equal(last.stats.total, last.stats.visited);
        for (const group of groups) {
            const badges = new Set([...group].map((k) => last.order[k]));
            assert.equal(badges.size, 1, "one badge per island");
            const roles = new Set([...group].map((k) => last.cells[k]));
            assert.equal(roles.size, 1, "one colour per island");
            assert.match([...roles][0], /^island-[1-5]$/);
        }
        checkSteps(islands, steps);
    }
});

test("BFS shortest path finds the reference distance and traces a valid path", () => {
    const maze = GRID_ALGORITHMS["shortest-path"];
    const cases = [[maze.defaultGrid, maze.defaultStart, maze.defaultTarget]];
    for (let n = 0; n < 40; n++) {
        const [rows, cols] = randomSize();
        const grid = randomGrid(rows, cols, [0, 0, 0, 1, 1]);
        cases.push([grid, [0, 0], [Math.floor(rand() * rows), Math.floor(rand() * cols)]]);
    }
    let found = 0;
    for (const [grid, start, target] of cases) {
        const expected = refDistance(grid, start, target);
        const { steps } = maze.run(grid, { start, target });
        const last = steps.at(-1);
        checkSteps(maze, steps);
        if (expected < 0) {
            assert.equal(last.stats.distance, "–");
            assert.match(last.message, /no path/);
            assert.ok(!Object.values(last.cells).includes("path"));
            continue;
        }
        if (expected === 0) {
            assert.equal(last.stats.distance, 0);
            continue;
        }
        found++;
        assert.equal(last.stats.distance, expected, `${grid.length}×${grid[0].length}`);
        assert.equal(last.order[key(...target)], expected, "target badge is the distance");
        const chain = [key(...start), ...Object.keys(last.cells).filter((k) => last.cells[k] === "path"), key(...target)];
        assert.equal(chain.length, expected + 1, "path length equals the distance");
        const cellsOnPath = new Set(chain);
        for (const k of chain) {
            const [r, c] = k.split(",").map(Number);
            assert.ok(k === key(...start) || k === key(...target) || !isWall(grid[r][c]), "path avoids walls");
            const neighbours = DIRS.filter(([dr, dc]) => cellsOnPath.has(key(r + dr, c + dc))).length;
            assert.ok(neighbours >= 1, "path cells are connected");
        }
    }
    assert.ok(found >= 10, `only ${found} reachable cases`);
});

test("degenerate inputs are handled without throwing", () => {
    for (const algorithm of GRID_ALGORITHM_LIST) {
        assert.equal(algorithm.run([], {}).steps.length, 1, algorithm.key);
        const single = algorithm.run([[0]], { start: [5, 5], target: [9, 9], variant: "dfs" }).steps;
        assert.ok(single.length >= 1, algorithm.key);
    }
    const maze = GRID_ALGORITHMS["shortest-path"];
    assert.equal(maze.run([[0, 0]], { start: [0, 0], target: [0, 0] }).steps.at(-1).stats.distance, 0);
    assert.equal(maze.run([[1, 1]], { start: [0, 0], target: [0, 1] }).steps.at(-1).stats.distance, 1);
    assert.equal(maze.run([[1, 1], [1, 1]], { start: [0, 0], target: [1, 1] }).steps.at(-1).stats.distance, "–");
    const flood = GRID_ALGORITHMS["flood-fill"];
    const open = Array.from({ length: 8 }, () => Array(10).fill(0));
    for (const algorithm of [flood]) {
        for (const variant of ["bfs", "dfs"]) assert.ok(algorithm.run(open, { start: [0, 0], variant }).steps.length < 300);
    }
    assert.ok(GRID_ALGORITHMS["number-of-islands"].run(Array.from({ length: 8 }, () => Array(10).fill(1))).steps.length < 300);
    assert.ok(maze.run(open, { start: [0, 0], target: [7, 9] }).steps.length < 300);
});

test("the input grid is never modified", () => {
    for (const algorithm of GRID_ALGORITHM_LIST) {
        const grid = algorithm.defaultGrid.map((row) => row.slice());
        const before = JSON.stringify(grid);
        algorithm.run(grid, { start: algorithm.defaultStart, target: algorithm.defaultTarget, variant: "dfs" });
        algorithm.run(grid, { start: algorithm.defaultStart, target: algorithm.defaultTarget, variant: "bfs" });
        assert.equal(JSON.stringify(grid), before, algorithm.key);
    }
});

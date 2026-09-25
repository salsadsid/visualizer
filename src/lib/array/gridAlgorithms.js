import { gridKey, makeGridRecorder } from "./gridRecorder.js";
import { islandRole } from "./gridRoles.js";

const DIRS = [
    [-1, 0, "up"],
    [1, 0, "down"],
    [0, -1, "left"],
    [0, 1, "right"],
];

export const isLand = (v) => v === 1 || v === "1" || v === true || v === "#" || v === "L" || v === "X";
export const isWall = (v) => v === 1 || v === "1" || v === true || v === "#";

const inside = (rows, cols, r, c) => r >= 0 && r < rows && c >= 0 && c < cols;
const at = (r, c) => `(${r}, ${c})`;

function shape(grid) {
    return { rows: grid.length, cols: grid.length ? grid[0].length : 0 };
}

function clampPoint(point, rows, cols, fallback) {
    const [r, c] = Array.isArray(point) ? point : fallback;
    if (Number.isInteger(r) && Number.isInteger(c) && inside(rows, cols, r, c)) return [r, c];
    return fallback;
}

function emptySteps(message) {
    return {
        steps: [{ cells: {}, order: {}, frontier: [], pointers: {}, vars: {}, line: 0, message, stats: { visited: 0, total: 0, frontier: 0 }, output: [] }],
    };
}

function regionOf(grid, sr, sc) {
    const { rows, cols } = shape(grid);
    const value = grid[sr][sc];
    const seen = new Set([gridKey(sr, sc)]);
    const queue = [[sr, sc]];
    while (queue.length) {
        const [r, c] = queue.shift();
        for (const [dr, dc] of DIRS) {
            const nr = r + dr;
            const nc = c + dc;
            const k = gridKey(nr, nc);
            if (inside(rows, cols, nr, nc) && grid[nr][nc] === value && !seen.has(k)) {
                seen.add(k);
                queue.push([nr, nc]);
            }
        }
    }
    return seen;
}

function floodFillBfs(grid, sr, sc) {
    const { rows, cols } = shape(grid);
    const value = grid[sr][sc];
    const r = makeGridRecorder(grid, regionOf(grid, sr, sc).size, { collectOutput: false });
    const seen = new Set([gridKey(sr, sc)]);
    r.vars.old = String(value);
    r.frontier.push(gridKey(sr, sc));
    r.push(0, `Start at ${at(sr, sc)}. Its value is ${String(value)}, so that is the value we spread from. Put it in the queue.`, { [gridKey(sr, sc)]: "current" });
    while (r.frontier.length) {
        const [cr, cc] = r.frontier.shift().split(",").map(Number);
        r.visit(cr, cc, 3, `Take ${at(cr, cc)} from the front of the queue and fill it.`);
        const added = [];
        for (const [dr, dc, name] of DIRS) {
            const nr = cr + dr;
            const nc = cc + dc;
            const k = gridKey(nr, nc);
            if (inside(rows, cols, nr, nc) && grid[nr][nc] === value && !seen.has(k)) {
                seen.add(k);
                r.frontier.push(k);
                added.push(name);
            }
        }
        if (added.length) {
            r.push(5, `Queue the ${added.join(", ")} neighbour${added.length > 1 ? "s" : ""} of ${at(cr, cc)}: same value, not filled yet.`);
        } else {
            r.push(4, `Every neighbour of ${at(cr, cc)} is a different value, outside the grid or already filled. Nothing to queue.`);
        }
    }
    r.clearPointers();
    r.push(1, `The queue is empty. ${r.steps.at(-1).stats.visited} connected cells were filled.`);
    return { steps: r.steps };
}

function floodFillDfs(grid, sr, sc) {
    const { rows, cols } = shape(grid);
    const value = grid[sr][sc];
    const r = makeGridRecorder(grid, regionOf(grid, sr, sc).size, { collectOutput: false });
    const filled = new Set();
    r.vars.old = String(value);
    r.vars.depth = 0;
    r.push(0, `Start at ${at(sr, sc)}. Its value is ${String(value)}, so that is the value we spread from. Call fill on it.`, { [gridKey(sr, sc)]: "current" });
    const fill = (cr, cc, from) => {
        const k = gridKey(cr, cc);
        if (!inside(rows, cols, cr, cc) || grid[cr][cc] !== value || filled.has(k)) return;
        filled.add(k);
        r.frontier.push(k);
        r.vars.depth = r.frontier.length;
        r.visit(cr, cc, 3, from ? `Go ${from} into ${at(cr, cc)}: same value, not filled yet. Fill it. The call stack is ${r.frontier.length} deep.` : `Fill ${at(cr, cc)}.`);
        for (const [dr, dc, name] of DIRS) fill(cr + dr, cc + dc, name);
        r.frontier.pop();
        r.vars.depth = r.frontier.length;
        r.push(4, `All four neighbours of ${at(cr, cc)} are done. Return${r.frontier.length ? ` to ${at(...r.frontier.at(-1).split(",").map(Number))}` : ""}.`);
    };
    fill(sr, sc, null);
    r.clearPointers();
    delete r.vars.depth;
    r.push(0, `Back where we started. ${r.steps.at(-1).stats.visited} connected cells were filled.`);
    return { steps: r.steps };
}

function numberOfIslands(grid) {
    const { rows, cols } = shape(grid);
    const land = [];
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) if (isLand(grid[i][j])) land.push(gridKey(i, j));
    const r = makeGridRecorder(grid, land.length, { collectOutput: false });
    for (const k of land) r.marks[k] = "land";
    const seen = new Set();
    let count = 0;
    r.vars.count = 0;
    r.extra.islands = 0;
    r.push(0, `Count starts at 0. Scan the grid row by row, looking for land (1) that has not been visited.`);
    const sink = (cr, cc, from) => {
        const k = gridKey(cr, cc);
        if (!inside(rows, cols, cr, cc) || !isLand(grid[cr][cc]) || seen.has(k)) return;
        seen.add(k);
        r.frontier.push(k);
        r.marks[k] = islandRole(count);
        r.visit(cr, cc, 4, from ? `Go ${from} to ${at(cr, cc)}: land that belongs to island ${count}. Mark it.` : `Sink ${at(cr, cc)}: mark it as part of island ${count}.`, "current", count);
        for (const [dr, dc, name] of DIRS) sink(cr + dr, cc + dc, name);
        r.frontier.pop();
        if (r.frontier.length) r.push(4, `Every neighbour of ${at(cr, cc)} is done. Return to ${at(...r.frontier.at(-1).split(",").map(Number))}.`);
    };
    for (let i = 0; i < rows; i++) {
        r.pointers.i = i;
        delete r.pointers.j;
        r.push(1, `Scan row ${i} from left to right.`);
        for (let j = 0; j < cols; j++) {
            const k = gridKey(i, j);
            if (!isLand(grid[i][j]) || seen.has(k)) continue;
            count++;
            r.vars.count = count;
            r.extra.islands = count;
            r.pointers.j = j;
            r.push(3, `${at(i, j)} is land nobody has visited, so it starts island ${count}. count = ${count}.`, { [k]: "current" });
            sink(i, j, null);
            r.push(4, `Island ${count} is fully marked. Back to scanning.`);
        }
    }
    r.clearPointers();
    r.push(5, count === 1 ? "Scan finished. There is 1 island." : `Scan finished. There are ${count} islands.`);
    return { steps: r.steps };
}

function shortestPath(grid, start, target) {
    const { rows, cols } = shape(grid);
    const [sr, sc] = start;
    const [tr, tc] = target;
    const open = (rr, cc) => (rr === sr && cc === sc) || (rr === tr && cc === tc) || !isWall(grid[rr][cc]);
    let total = 0;
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) if (open(i, j)) total++;
    const r = makeGridRecorder(grid, total, { collectOutput: false });
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) if (!open(i, j)) r.marks[gridKey(i, j)] = "wall";
    r.marks[gridKey(sr, sc)] = "start";
    r.marks[gridKey(tr, tc)] = "target";
    const dist = { [gridKey(sr, sc)]: 0 };
    const parent = {};
    r.extra.distance = "–";
    r.mark(sr, sc, 0);
    r.frontier.push(gridKey(sr, sc));
    if (sr === tr && sc === tc) {
        r.push(0, `Start and target are the same cell ${at(sr, sc)}. Distance 0.`);
        r.extra.distance = 0;
        r.push(5, "Nothing to search.");
        return { steps: r.steps };
    }
    r.push(0, `Start at ${at(sr, sc)} with distance 0. The target is ${at(tr, tc)}. Walls are 1, open cells are 0.`);
    let found = false;
    while (r.frontier.length && !found) {
        const [cr, cc] = r.frontier.shift().split(",").map(Number);
        const d = dist[gridKey(cr, cc)];
        r.vars.dist = d;
        r.visit(cr, cc, 2, `Take ${at(cr, cc)} from the front of the queue. It is ${d} step${d === 1 ? "" : "s"} from the start.`, "current", d);
        const added = [];
        for (const [dr, dc, name] of DIRS) {
            const nr = cr + dr;
            const nc = cc + dc;
            const k = gridKey(nr, nc);
            if (!inside(rows, cols, nr, nc) || !open(nr, nc) || k in dist) continue;
            dist[k] = d + 1;
            parent[k] = gridKey(cr, cc);
            r.mark(nr, nc, d + 1);
            r.frontier.push(k);
            added.push(name);
            if (nr === tr && nc === tc) {
                found = true;
                break;
            }
        }
        if (found) {
            r.extra.distance = d + 1;
            r.push(5, `The ${added.at(-1)} neighbour of ${at(cr, cc)} is the target. Its distance is ${d + 1}, and nothing found later could be shorter, so stop.`);
        } else if (added.length) {
            r.push(4, `Discover the ${added.join(", ")} neighbour${added.length > 1 ? "s" : ""} of ${at(cr, cc)} at distance ${d + 1} and queue them.`);
        } else {
            r.push(3, `Every neighbour of ${at(cr, cc)} is a wall, outside the grid or already seen.`);
        }
    }
    r.clearPointers();
    delete r.vars.dist;
    if (!found) {
        r.push(7, `The queue ran empty without reaching ${at(tr, tc)}. There is no path: the target is walled off.`);
        return { steps: r.steps };
    }
    const path = [];
    for (let k = gridKey(tr, tc); k !== undefined; k = parent[k]) path.push(k);
    r.vars.length = path.length - 1;
    for (let n = 1; n < path.length - 1; n++) {
        const [pr, pc] = path[n].split(",").map(Number);
        r.marks[path[n]] = "path";
        r.push(6, `Walk back: ${at(pr, pc)} is the parent of ${at(...path[n - 1].split(",").map(Number))}.`);
    }
    r.push(6, `Path complete: ${path.length - 1} steps from ${at(sr, sc)} to ${at(tr, tc)}, following the parent pointers backwards.`);
    return { steps: r.steps };
}

const FLOOD_GRID = [
    [0, 0, 0, 1, 1, 1, 2, 2],
    [0, 0, 1, 1, 1, 2, 2, 2],
    [0, 0, 1, 1, 2, 2, 2, 2],
    [0, 0, 0, 1, 2, 2, 0, 0],
    [0, 0, 0, 1, 1, 2, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0],
];

const ISLANDS_GRID = [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1],
];

const MAZE_GRID = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
];

export const GRID_ALGORITHMS = {
    "flood-fill": {
        key: "flood-fill",
        label: "Flood fill",
        blurb: "The paint bucket: from one cell, spread to every connected cell with the same value.",
        lead: "is the paint-bucket tool. Starting from one cell, it spreads to every neighbour that has the same value, and from those to their neighbours, until the whole connected region is filled. BFS does it with a queue; DFS does it with recursion.",
        roles: ["current", "frontier", "visited"],
        click: "start",
        variants: {
            bfs: {
                label: "BFS (queue)",
                strip: "Queue",
                pseudocode: [
                    "old = grid[start]; queue = [start]",
                    "while queue is not empty:",
                    "  (r, c) = queue.pop_front()",
                    "  fill (r, c)",
                    "  for each neighbour (nr, nc) of (r, c):",
                    "    if inside and grid[nr][nc] == old and not filled: queue.push((nr, nc))",
                ],
            },
            dfs: {
                label: "DFS (recursion)",
                strip: "Call stack",
                pseudocode: [
                    "old = grid[start]; fill(start)",
                    "fill(r, c):",
                    "  if outside or grid[r][c] != old or already filled: return",
                    "  mark (r, c) filled",
                    "  fill(r-1, c); fill(r+1, c); fill(r, c-1); fill(r, c+1)",
                ],
            },
        },
        defaultGrid: FLOOD_GRID,
        defaultStart: [2, 5],
        run(grid, options = {}) {
            const { rows, cols } = shape(grid);
            if (rows === 0 || cols === 0) return emptySteps("Nothing to fill: the grid has no cells.");
            const [sr, sc] = clampPoint(options.start, rows, cols, [0, 0]);
            return options.variant === "dfs" ? floodFillDfs(grid, sr, sc) : floodFillBfs(grid, sr, sc);
        },
    },
    "number-of-islands": {
        key: "number-of-islands",
        label: "Number of islands",
        blurb: "Count the connected patches of land in a grid of 1s and 0s, sinking each island as you find it.",
        lead: "counts the connected patches of land in a grid of 1s (land) and 0s (water). Scan every cell; each time you find land nobody has visited, that is a new island, and a DFS sinks the whole island so it is never counted again.",
        roles: ["current", "land", "island-1", "island-2", "island-3", "island-4", "island-5"],
        click: "toggle",
        variants: null,
        pseudocode: [
            "count = 0",
            "for each cell (r, c) in row-major order:",
            "  if grid[r][c] is land and not visited:",
            "    count += 1",
            "    sink(r, c)   # DFS marks the whole island visited",
            "return count",
        ],
        strip: "Call stack",
        defaultGrid: ISLANDS_GRID,
        run(grid) {
            const { rows, cols } = shape(grid);
            if (rows === 0 || cols === 0) return emptySteps("Nothing to count: the grid has no cells.");
            return numberOfIslands(grid);
        },
    },
    "shortest-path": {
        key: "shortest-path",
        label: "BFS shortest path",
        blurb: "Find the fewest steps through a maze by exploring in rings of equal distance, then walk the parents back.",
        lead: "finds the fewest steps from a start cell to a target through a grid of walls, by exploring in rings: every cell one step away, then every cell two steps away, and so on. The first time the target is reached, that distance is the shortest one.",
        roles: ["start", "target", "wall", "frontier", "current", "visited", "path"],
        click: "wall",
        variants: null,
        pseudocode: [
            "dist[start] = 0; queue = [start]",
            "while queue is not empty:",
            "  (r, c) = queue.pop_front()",
            "  for each open neighbour (nr, nc) not yet seen:",
            "    dist[nr][nc] = dist[r][c] + 1; parent[nr][nc] = (r, c); queue.push((nr, nc))",
            "    if (nr, nc) is the target: stop",
            "walk parent pointers from the target back to the start",
            "queue empty and no target: there is no path",
        ],
        strip: "Queue",
        defaultGrid: MAZE_GRID,
        defaultStart: [0, 0],
        defaultTarget: [7, 9],
        run(grid, options = {}) {
            const { rows, cols } = shape(grid);
            if (rows === 0 || cols === 0) return emptySteps("Nothing to search: the grid has no cells.");
            const start = clampPoint(options.start, rows, cols, [0, 0]);
            const target = clampPoint(options.target, rows, cols, [rows - 1, cols - 1]);
            return shortestPath(grid, start, target);
        },
    },
};

export const GRID_ALGORITHM_LIST = Object.values(GRID_ALGORITHMS);

export function pseudocodeFor(algorithm, variant) {
    return algorithm.variants ? algorithm.variants[variant]?.pseudocode ?? algorithm.variants.bfs.pseudocode : algorithm.pseudocode;
}

export function stripLabelFor(algorithm, variant) {
    return algorithm.variants ? algorithm.variants[variant]?.strip ?? algorithm.variants.bfs.strip : algorithm.strip;
}

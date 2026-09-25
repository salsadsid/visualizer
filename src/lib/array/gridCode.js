const snippet = (title, code) => ({ title, code });

export const GRID_CODE = {
    "flood-fill": {
        cpp: [
            snippet("Flood fill with BFS (queue)", `void floodFillBfs(vector<vector<int>>& grid, int sr, int sc, int color) {
    int rows = grid.size(), cols = grid[0].size();
    int old = grid[sr][sc];
    if (old == color) return;          // nothing to change, and it would loop forever
    queue<pair<int, int>> q;
    q.push({sr, sc});
    grid[sr][sc] = color;              // painting doubles as "already filled"
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] != old) continue;
            grid[nr][nc] = color;
            q.push({nr, nc});
        }
    }
}`),
            snippet("Flood fill with DFS (recursion)", `void fill(vector<vector<int>>& grid, int r, int c, int old, int color) {
    if (r < 0 || r >= (int)grid.size() || c < 0 || c >= (int)grid[0].size()) return;
    if (grid[r][c] != old) return;
    grid[r][c] = color;
    fill(grid, r - 1, c, old, color);
    fill(grid, r + 1, c, old, color);
    fill(grid, r, c - 1, old, color);
    fill(grid, r, c + 1, old, color);
}

void floodFillDfs(vector<vector<int>>& grid, int sr, int sc, int color) {
    int old = grid[sr][sc];
    if (old != color) fill(grid, sr, sc, old, color);
}`),
        ],
        python: [
            snippet("Flood fill with BFS (queue)", `from collections import deque

def flood_fill_bfs(grid, sr, sc, color):
    rows, cols = len(grid), len(grid[0])
    old = grid[sr][sc]
    if old == color:                 # nothing to change, and it would loop forever
        return grid
    queue = deque([(sr, sc)])
    grid[sr][sc] = color             # painting doubles as "already filled"
    while queue:
        r, c = queue.popleft()
        for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == old:
                grid[nr][nc] = color
                queue.append((nr, nc))
    return grid`),
            snippet("Flood fill with DFS (recursion)", `def flood_fill_dfs(grid, sr, sc, color):
    rows, cols = len(grid), len(grid[0])
    old = grid[sr][sc]
    if old == color:
        return grid

    def fill(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != old:
            return
        grid[r][c] = color
        fill(r - 1, c)
        fill(r + 1, c)
        fill(r, c - 1)
        fill(r, c + 1)

    fill(sr, sc)
    return grid`),
        ],
        javascript: [
            snippet("Flood fill with BFS (queue)", `function floodFillBfs(grid, sr, sc, color) {
    const rows = grid.length, cols = grid[0].length;
    const old = grid[sr][sc];
    if (old === color) return grid;    // nothing to change, and it would loop forever
    const queue = [[sr, sc]];
    grid[sr][sc] = color;              // painting doubles as "already filled"
    while (queue.length) {
        const [r, c] = queue.shift();
        for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] !== old) continue;
            grid[nr][nc] = color;
            queue.push([nr, nc]);
        }
    }
    return grid;
}`),
            snippet("Flood fill with DFS (recursion)", `function floodFillDfs(grid, sr, sc, color) {
    const rows = grid.length, cols = grid[0].length;
    const old = grid[sr][sc];
    if (old === color) return grid;
    const fill = (r, c) => {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== old) return;
        grid[r][c] = color;
        fill(r - 1, c);
        fill(r + 1, c);
        fill(r, c - 1);
        fill(r, c + 1);
    };
    fill(sr, sc);
    return grid;
}`),
        ],
        typescript: [
            snippet("Flood fill with BFS (queue)", `function floodFillBfs(grid: number[][], sr: number, sc: number, color: number): number[][] {
    const rows = grid.length, cols = grid[0].length;
    const old = grid[sr][sc];
    if (old === color) return grid;    // nothing to change, and it would loop forever
    const queue: [number, number][] = [[sr, sc]];
    grid[sr][sc] = color;              // painting doubles as "already filled"
    while (queue.length) {
        const [r, c] = queue.shift()!;
        for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] !== old) continue;
            grid[nr][nc] = color;
            queue.push([nr, nc]);
        }
    }
    return grid;
}`),
            snippet("Flood fill with DFS (recursion)", `function floodFillDfs(grid: number[][], sr: number, sc: number, color: number): number[][] {
    const rows = grid.length, cols = grid[0].length;
    const old = grid[sr][sc];
    if (old === color) return grid;
    const fill = (r: number, c: number): void => {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== old) return;
        grid[r][c] = color;
        fill(r - 1, c);
        fill(r + 1, c);
        fill(r, c - 1);
        fill(r, c + 1);
    };
    fill(sr, sc);
    return grid;
}`),
        ],
    },
    "number-of-islands": {
        cpp: [
            snippet("Number of islands", `void sink(vector<vector<int>>& g, int r, int c) {
    if (r < 0 || r >= (int)g.size() || c < 0 || c >= (int)g[0].size()) return;
    if (g[r][c] != 1) return;
    g[r][c] = 0;                       // mark visited by sinking the land
    sink(g, r - 1, c);
    sink(g, r + 1, c);
    sink(g, r, c - 1);
    sink(g, r, c + 1);
}

int numIslands(vector<vector<int>>& g) {
    int count = 0;
    for (int r = 0; r < (int)g.size(); r++)
        for (int c = 0; c < (int)g[0].size(); c++)
            if (g[r][c] == 1) {
                count++;
                sink(g, r, c);
            }
    return count;
}`),
        ],
        python: [
            snippet("Number of islands", `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != 1:
            return
        grid[r][c] = 0               # mark visited by sinking the land
        sink(r - 1, c)
        sink(r + 1, c)
        sink(r, c - 1)
        sink(r, c + 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                count += 1
                sink(r, c)
    return count`),
        ],
        javascript: [
            snippet("Number of islands", `function numIslands(grid) {
    const rows = grid.length, cols = grid[0].length;
    const sink = (r, c) => {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 1) return;
        grid[r][c] = 0;                // mark visited by sinking the land
        sink(r - 1, c);
        sink(r + 1, c);
        sink(r, c - 1);
        sink(r, c + 1);
    };
    let count = 0;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (grid[r][c] === 1) {
                count++;
                sink(r, c);
            }
    return count;
}`),
        ],
        typescript: [
            snippet("Number of islands", `function numIslands(grid: number[][]): number {
    const rows = grid.length, cols = grid[0].length;
    const sink = (r: number, c: number): void => {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 1) return;
        grid[r][c] = 0;                // mark visited by sinking the land
        sink(r - 1, c);
        sink(r + 1, c);
        sink(r, c - 1);
        sink(r, c + 1);
    };
    let count = 0;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (grid[r][c] === 1) {
                count++;
                sink(r, c);
            }
    return count;
}`),
        ],
    },
    "shortest-path": {
        cpp: [
            snippet("BFS shortest path with parent pointers", `vector<pair<int, int>> shortestPath(vector<vector<int>>& grid, pair<int, int> start, pair<int, int> target) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> dist(rows, vector<int>(cols, -1));
    vector<vector<pair<int, int>>> parent(rows, vector<pair<int, int>>(cols, {-1, -1}));
    queue<pair<int, int>> q;
    dist[start.first][start.second] = 0;
    q.push(start);
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] == 1 || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;
            parent[nr][nc] = {r, c};
            q.push({nr, nc});
            if (make_pair(nr, nc) == target) {
                vector<pair<int, int>> path;
                for (auto p = target; p != start; p = parent[p.first][p.second]) path.push_back(p);
                path.push_back(start);
                reverse(path.begin(), path.end());
                return path;
            }
        }
    }
    return {};                         // no path
}`),
        ],
        python: [
            snippet("BFS shortest path with parent pointers", `from collections import deque

def shortest_path(grid, start, target):
    rows, cols = len(grid), len(grid[0])
    dist = {start: 0}
    parent = {}
    queue = deque([start])
    while queue:
        r, c = queue.popleft()
        for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == 1 or (nr, nc) in dist:
                continue
            dist[(nr, nc)] = dist[(r, c)] + 1
            parent[(nr, nc)] = (r, c)
            queue.append((nr, nc))
            if (nr, nc) == target:
                path = [target]
                while path[-1] != start:
                    path.append(parent[path[-1]])
                return path[::-1]
    return None                      # no path`),
        ],
        javascript: [
            snippet("BFS shortest path with parent pointers", `function shortestPath(grid, start, target) {
    const rows = grid.length, cols = grid[0].length;
    const key = ([r, c]) => r + "," + c;
    const dist = new Map([[key(start), 0]]);
    const parent = new Map();
    const queue = [start];
    while (queue.length) {
        const [r, c] = queue.shift();
        for (const next of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
            const [nr, nc] = next;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] === 1 || dist.has(key(next))) continue;
            dist.set(key(next), dist.get(key([r, c])) + 1);
            parent.set(key(next), [r, c]);
            queue.push(next);
            if (nr === target[0] && nc === target[1]) {
                const path = [target];
                while (key(path[0]) !== key(start)) path.unshift(parent.get(key(path[0])));
                return path;
            }
        }
    }
    return null;                       // no path
}`),
        ],
        typescript: [
            snippet("BFS shortest path with parent pointers", `type Cell = [number, number];

function shortestPath(grid: number[][], start: Cell, target: Cell): Cell[] | null {
    const rows = grid.length, cols = grid[0].length;
    const key = ([r, c]: Cell) => r + "," + c;
    const dist = new Map<string, number>([[key(start), 0]]);
    const parent = new Map<string, Cell>();
    const queue: Cell[] = [start];
    while (queue.length) {
        const [r, c] = queue.shift()!;
        for (const next of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]] as Cell[]) {
            const [nr, nc] = next;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] === 1 || dist.has(key(next))) continue;
            dist.set(key(next), dist.get(key([r, c]))! + 1);
            parent.set(key(next), [r, c]);
            queue.push(next);
            if (nr === target[0] && nc === target[1]) {
                const path: Cell[] = [target];
                while (key(path[0]) !== key(start)) path.unshift(parent.get(key(path[0]))!);
                return path;
            }
        }
    }
    return null;                       // no path
}`),
        ],
    },
};

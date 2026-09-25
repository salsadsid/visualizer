import { parseInput } from "./parser.js";
import { formatMatrix } from "./presets.js";
import { decodeGrid } from "../share.js";

export const MAX_ROWS = 8;
export const MAX_COLS = 10;

export function gridFromHash(hash) {
    const shared = decodeGrid(hash);
    if (!shared) return null;
    const trimmed = shared.matrix.slice(0, MAX_ROWS).map((row) => row.slice(0, MAX_COLS));
    const { matrix, maxLen } = parseInput(formatMatrix(trimmed));
    return maxLen > 0 ? matrix : null;
}

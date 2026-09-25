import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Grid Algorithms — flood fill, number of islands and BFS shortest path, step by step";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "GRID",
        title: "Grid Algorithms",
        accent: "BFS and DFS on a grid.",
        subtitle:
            "Flood fill, number of islands and BFS shortest path with the queue or call stack, live distances and clickable cells.",
    });
}

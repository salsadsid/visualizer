import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "2D Array Visualizer — paste a matrix and see it as a grid";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "GRID",
        title: "2D Array Visualizer",
        accent: "Paste a matrix. See the grid.",
        subtitle:
            "Color cells by value, show row and column indices, and learn with code in C++, Python, JavaScript and TypeScript.",
    });
}

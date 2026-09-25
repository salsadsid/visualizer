import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "2D Array Traversals — six ways to visit every cell of a grid, step by step";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "GRID",
        title: "2D Array Traversals",
        accent: "Six ways through a grid.",
        subtitle:
            "Row-major, column-major, snake, diagonal, boundary and spiral, each with live indices, visit numbers and code.",
    });
}

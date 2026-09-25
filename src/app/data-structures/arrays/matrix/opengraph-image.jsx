import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Matrix Operations Visualizer — transpose, rotate, flip and multiply, one cell at a time";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "MATRIX",
        title: "Matrix Operations",
        accent: "Transpose, rotate, flip, multiply.",
        subtitle:
            "The source and the result side by side, one cell at a time, with live indices, counters and code in four languages.",
    });
}

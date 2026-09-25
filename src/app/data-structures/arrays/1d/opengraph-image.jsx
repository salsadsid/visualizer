import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "1D Array Visualizer — insert, delete, search and reverse, one step at a time";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "ARRAY",
        title: "1D Array Visualizer",
        accent: "Every read, write and shift.",
        subtitle:
            "Insert, delete, linear search and reverse with two pointers, with live indices, counters and code in four languages.",
    });
}

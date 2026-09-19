import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Sorting Visualizer — step through Bubble, Selection and Insertion sort";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "SORT",
        title: "Sorting Visualizer",
        accent: "Watch every single step.",
        subtitle:
            "Bubble, Selection and Insertion sort with animated bars, live loop variables and synced pseudocode.",
    });
}

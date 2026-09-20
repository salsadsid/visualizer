import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Sorting Algorithm Visualizer — compare Bubble, Selection and Insertion sort";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "SORT",
        title: "Sorting Algorithm Visualizer",
        accent: "Compare them step by step.",
        subtitle:
            "Bubble, Selection and Insertion sort with animated bars, live loop variables and synced pseudocode.",
    });
}

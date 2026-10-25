import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Sorting Algorithm Visualizer — compare Bubble, Selection, Insertion and Counting sort";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "SORT",
        title: "Sorting Algorithm Visualizer",
        accent: "Compare them step by step.",
        subtitle:
            "Bubble, Selection, Insertion and Counting sort with animated bars, live loop variables and synced pseudocode.",
    });
}

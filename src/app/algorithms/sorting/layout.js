import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "Sorting Visualizer",
    description:
        "Interactive sorting visualizer for Bubble, Selection, and Insertion sort. Step through animated bars with synchronized pseudocode, live comparison/swap counters, speed control, and C++, Python, JavaScript & TypeScript code.",
    path: "/algorithms/sorting",
});

export default function Layout({ children }) {
    return children;
}

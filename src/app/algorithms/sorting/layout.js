import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "Sorting Visualizer",
    description:
        "Step through Bubble, Selection and Insertion sort: animated bars, live i/j pointers, synced pseudocode, swap counters, and code in C++, Python, JS & TS.",
    path: "/algorithms/sorting",
});

export default function Layout({ children }) {
    return children;
}

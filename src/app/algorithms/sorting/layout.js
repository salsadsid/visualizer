export const metadata = {
    title: "Sorting Visualizer",
    description:
        "Interactive sorting visualizer for Bubble, Selection, and Insertion sort. Step through animated bars with synchronized pseudocode, live comparison/swap counters, speed control, and C++, Python, JavaScript & TypeScript code.",
    alternates: {
        canonical: "/algorithms/sorting",
    },
    openGraph: {
        title: "Sorting Visualizer · DSA Visualizer",
        description:
            "Step through Bubble, Selection, and Insertion sort with animated bars, pseudocode highlighting, and live stats.",
        url: "/algorithms/sorting",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sorting Visualizer · DSA Visualizer",
        description:
            "Step through Bubble, Selection, and Insertion sort with animated bars, pseudocode highlighting, and live stats.",
    },
};

export default function Layout({ children }) {
    return children;
}

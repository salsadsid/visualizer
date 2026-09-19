import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "2D Array Visualizer",
    description:
        "Interactive 2D array visualizer. Paste any JSON matrix, color each value, toggle indices, and learn array operations in C++, Python, JavaScript, and TypeScript.",
    path: "/data-structures/arrays",
});

export default function Layout({ children }) {
    return children;
}

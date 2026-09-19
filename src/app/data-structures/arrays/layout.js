import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "2D Array Visualizer",
    description:
        "Paste any 2D array or matrix and see it as a grid. Color cells by value, show row and column indices, and learn with C++, Python, JS & TS code. Free.",
    path: "/data-structures/arrays",
});

export default function Layout({ children }) {
    return children;
}

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "Big-O Playground",
    description:
        "Learn Big-O by measuring it: count steps with the computer, then watch O(1), O(log n), O(n), O(n log n) and O(n²) growth curves fan out. Beginner friendly.",
    path: "/algorithms/complexity",
});

export default function Layout({ children }) {
    return children;
}

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "Big-O Playground",
    description:
        "Learn time complexity by measuring it. An interactive Big-O playground: pick O(1), O(log n), O(√n), O(n), O(n log n), O(n²) or O(2ⁿ) and watch their real growth curves fan out — with a 'how it scales' table and C++/Python/JavaScript/TypeScript code.",
    path: "/algorithms/complexity",
});

export default function Layout({ children }) {
    return children;
}

export const metadata = {
    title: "Big-O Playground",
    description:
        "Learn time complexity by measuring it. An interactive Big-O playground: pick O(1), O(log n), O(√n), O(n), O(n log n), O(n²) or O(2ⁿ) and watch their real growth curves fan out — with a 'how it scales' table and C++/Python/JavaScript/TypeScript code.",
    alternates: {
        canonical: "/algorithms/complexity",
    },
    openGraph: {
        title: "Big-O Playground · DSA Visualizer",
        description:
            "Measure time complexity for real — plot O(1) through O(2ⁿ) growth curves, toggle operations vs time, and see how algorithms scale.",
        url: "/algorithms/complexity",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Big-O Playground · DSA Visualizer",
        description:
            "Measure time complexity for real — plot growth curves and see how algorithms scale.",
    },
};

export default function Layout({ children }) {
    return children;
}

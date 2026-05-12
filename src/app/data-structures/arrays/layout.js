export const metadata = {
    title: "2D Array Visualizer",
    description:
        "Interactive 2D array visualizer. Paste any JSON matrix, color each value, toggle indices, and learn array operations in C++, Python, JavaScript, and TypeScript.",
    alternates: {
        canonical: "/data-structures/arrays",
    },
    openGraph: {
        title: "2D Array Visualizer · DSA Visualizer",
        description:
            "Paste JSON, color cells by value, learn array operations across C++, Python, JavaScript, and TypeScript.",
        url: "/data-structures/arrays",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "2D Array Visualizer · DSA Visualizer",
        description:
            "Paste JSON, color cells by value, learn array operations across C++, Python, JavaScript, and TypeScript.",
    },
};

export default function Layout({ children }) {
    return children;
}

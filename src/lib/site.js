export const siteConfig = {
    url:
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        "https://visualizer-gold.vercel.app",
    name: "DSA Visualizer",
    shortName: "DSA Visualizer",
    title: "DSA Visualizer · Interactive 2D Array Playground",
    description:
        "Free interactive 2D array visualizer. Paste any JSON matrix, color cells by value, and learn data structures with built-in C++, Python, JavaScript, and TypeScript snippets.",
    author: {
        name: "Salman Sadik Siddiquee",
        url: "https://github.com/salsadsid",
        github: "salsadsid",
    },
    repo: "https://github.com/salsadsid/visualizer",
    keywords: [
        "DSA visualizer",
        "2D array visualizer",
        "data structures visualizer",
        "matrix visualization",
        "algorithm visualizer",
        "interactive data structures",
        "learn DSA",
        "JSON to grid",
        "computer science learning tool",
        "Next.js DSA",
    ],
    locale: "en_US",
    themeColor: {
        light: "#fafafa",
        dark: "#09090b",
    },
};

export const siteConfig = {
    url:
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        "https://visualizer-gold.vercel.app",
    name: "DSA Visualizer",
    shortName: "DSA Visualizer",
    title: "DSA Visualizer · Interactive 2D Array Playground",
    description:
        "Free interactive data structures & algorithms visualizer. Step through Bubble, Selection, and Insertion sort, paste any JSON matrix and color it by value, and learn with built-in C++, Python, JavaScript, and TypeScript code.",
    author: {
        name: "Salman Sadik Siddiquee",
        url: "https://github.com/salsadsid",
        github: "salsadsid",
    },
    repo: "https://github.com/salsadsid/visualizer",
    keywords: [
        "DSA visualizer",
        "sorting visualizer",
        "sorting algorithm visualizer",
        "bubble sort visualizer",
        "selection sort visualizer",
        "insertion sort visualizer",
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

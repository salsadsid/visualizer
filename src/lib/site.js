export const siteConfig = {
    url:
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        "https://visualizer-gold.vercel.app",
    name: "DSA Visualizer",
    shortName: "DSA Visualizer",
    tagline: "Data structures & algorithms, brought to life",
    title: "DSA Visualizer · Interactive 2D Array Playground",
    description:
        "Free interactive DSA visualizer: a 2D array & matrix visualizer, step-by-step sorting animations with live code, and a Big-O playground. No sign-up.",
    author: {
        name: "Salman Sadik Siddiquee",
        url: "https://github.com/salsadsid",
        github: "salsadsid",
        x: "salsadsid",
    },
    repo: "https://github.com/salsadsid/visualizer",
    keywords: [
        "DSA visualizer",
        "sorting visualizer",
        "sorting algorithm visualizer",
        "big o notation",
        "time complexity visualizer",
        "big o playground",
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

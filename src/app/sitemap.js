import { siteConfig } from "@/lib/site";

const PAGES = [
    { path: "/", lastModified: "2026-09-19", changeFrequency: "weekly", priority: 1.0 },
    { path: "/data-structures", lastModified: "2026-09-19", changeFrequency: "weekly", priority: 0.8 },
    { path: "/data-structures/arrays", lastModified: "2026-09-19", changeFrequency: "weekly", priority: 0.9 },
    { path: "/algorithms", lastModified: "2026-09-19", changeFrequency: "weekly", priority: 0.8 },
    { path: "/algorithms/sorting", lastModified: "2026-09-19", changeFrequency: "weekly", priority: 0.9 },
    { path: "/algorithms/complexity", lastModified: "2026-09-19", changeFrequency: "weekly", priority: 0.8 },
    { path: "/roadmap", lastModified: "2026-09-19", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap() {
    return PAGES.map(({ path, ...entry }) => ({
        url: `${siteConfig.url}${path}`,
        ...entry,
    }));
}

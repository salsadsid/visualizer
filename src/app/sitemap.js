import { siteConfig } from "@/lib/site";

export default function sitemap() {
    const now = new Date();
    return [
        {
            url: `${siteConfig.url}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${siteConfig.url}/data-structures/arrays`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteConfig.url}/roadmap`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}

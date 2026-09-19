import { siteConfig } from "./site.js";

const WEBSITE_ID = `${siteConfig.url}/#website`;

const author = {
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.author.url,
};

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: siteConfig.name,
        alternateName: "Data Structures and Algorithms Visualizer",
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: "en",
        author,
    };
}

export function learningResourceJsonLd({ title, description, path, teaches }) {
    return {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: title,
        description,
        url: `${siteConfig.url}${path}`,
        learningResourceType: "interactive simulation",
        educationalLevel: "beginner",
        teaches,
        isAccessibleForFree: true,
        inLanguage: "en",
        author,
        isPartOf: { "@id": WEBSITE_ID },
    };
}

export function breadcrumbJsonLd(trail) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((entry, index) => {
            const element = { "@type": "ListItem", position: index + 1, name: entry.name };
            if (entry.path && index < trail.length - 1) {
                element.item = `${siteConfig.url}${entry.path}`;
            }
            return element;
        }),
    };
}

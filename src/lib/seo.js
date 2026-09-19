import { siteConfig } from "@/lib/site";

export function buildMetadata({ title, description, path, image = "/opengraph-image" }) {
    const fullTitle = `${title} · ${siteConfig.shortName}`;

    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            siteName: siteConfig.shortName,
            locale: siteConfig.locale,
            url: path,
            title: fullTitle,
            description,
            images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [{ url: image, alt: fullTitle }],
            creator: `@${siteConfig.author.x}`,
        },
    };
}

import { sitemapEntries } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export default function sitemap() {
    return sitemapEntries().map(({ path, ...entry }) => ({
        url: `${siteConfig.url}${path}`,
        ...entry,
    }));
}

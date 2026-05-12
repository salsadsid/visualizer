import { siteConfig } from "@/lib/site";

export default function manifest() {
    return {
        name: siteConfig.name,
        short_name: siteConfig.shortName,
        description: siteConfig.description,
        start_url: "/",
        display: "standalone",
        background_color: siteConfig.themeColor.light,
        theme_color: siteConfig.themeColor.light,
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
